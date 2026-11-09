"""Chartography video engine.

Typical use (see README.md):
    import chartography_engine as ce
    ce.setup()                                  # fonts + speech model (once per run)
    ce.tts(script_text, 'vo.mp3')               # ElevenLabs voiceover
    cues = ce.Cues.from_audio('vo.mp3')          # exact word timings
    ce.use_canvas('long')                        # or 'short' (1080x1920)
    def scene_hook(T, img, d): ...               # T = absolute seconds in the voiceover
    scenes = [ce.Scene(0.0, scene_hook), ce.Scene(cues.at('now the big split'), scene_split), ...]
    ce.render(scenes, 'vo.mp3', 'final.mp4')
    ce.sync_report(cues, 'sync.json'); ce.contact_sheet('final.mp4', [5, 60, 120], 'sheet.png')
"""
import json, math, os, re, subprocess, sys, tarfile, glob, difflib, shutil, urllib.request

from PIL import Image, ImageDraw, ImageFont

HOME = os.environ.get('CHARTO_HOME', os.path.expanduser('~/.chartography'))
os.makedirs(HOME, exist_ok=True)

# ---------------- palette ----------------
BG = (14, 27, 46)
CREAM = (246, 241, 231)
MINT = (63, 214, 160)
AMBER = (242, 181, 68)
MUTED = (175, 184, 198)
SLATE = (92, 115, 146)
SLATE2 = (120, 142, 172)
SLATE3 = (150, 168, 194)
CORAL = (255, 138, 101)
PANEL = (22, 40, 63)
GRID = (40, 62, 92)
EMPTY = (34, 56, 84)
SKY = (110, 190, 255)

FPS = 30
W, H = 1920, 1080
MODE = 'long'

def use_canvas(mode):
    """'long' = 1920x1080, 'short' = 1080x1920."""
    global W, H, MODE
    MODE = mode
    W, H = (1920, 1080) if mode == 'long' else (1080, 1920)

# ---------------- setup ----------------
FONT_DIR = os.path.join(HOME, 'fonts')
ASR_DIR = os.path.join(HOME, 'asr')
INTER = '/usr/share/fonts/opentype/inter/'
ASR_URL = 'https://github.com/k2-fsa/sherpa-onnx/releases/download/asr-models/sherpa-onnx-zipformer-small-en-2023-06-26.tar.bz2'

def _run(cmd, **kw):
    return subprocess.run(cmd, shell=isinstance(cmd, str), check=True, **kw)

def setup():
    """Install fonts (Fraunces, Caveat from npm) and the offline speech model. Safe to call repeatedly."""
    os.makedirs(FONT_DIR, exist_ok=True)
    need = {'Fraunces-600.ttf': ('fraunces', 'fraunces-latin-600-normal.woff2'),
            'Fraunces-700.ttf': ('fraunces', 'fraunces-latin-700-normal.woff2'),
            'Caveat-600.ttf': ('caveat', 'caveat-latin-600-normal.woff2'),
            'Caveat-700.ttf': ('caveat', 'caveat-latin-700-normal.woff2')}
    if not all(os.path.exists(os.path.join(FONT_DIR, k)) for k in need):
        _run('pip install --break-system-packages -q brotli fonttools sherpa-onnx soundfile >/dev/null 2>&1 || true')
        from fontTools.ttLib import TTFont
        tmp = os.path.join(HOME, 'npm')
        os.makedirs(tmp, exist_ok=True)
        for pkg in ('fraunces', 'caveat'):
            _run(f'cd "{tmp}" && npm pack @fontsource/{pkg} --silent >/dev/null && mkdir -p x_{pkg} && tar -xzf fontsource-{pkg}-*.tgz -C x_{pkg}')
        for out, (pkg, src) in need.items():
            f = TTFont(os.path.join(tmp, f'x_{pkg}', 'package', 'files', src))
            f.flavor = None
            f.save(os.path.join(FONT_DIR, out))
    try:
        import sherpa_onnx  # noqa
    except ImportError:
        _run('pip install --break-system-packages -q sherpa-onnx soundfile >/dev/null 2>&1')
    model = os.path.join(ASR_DIR, 'sherpa-onnx-zipformer-small-en-2023-06-26')
    if not os.path.exists(os.path.join(model, 'tokens.txt')):
        os.makedirs(ASR_DIR, exist_ok=True)
        tb = os.path.join(ASR_DIR, 'm.tar.bz2')
        _run(['curl', '-sL', '--max-time', '300', '-o', tb, ASR_URL])
        with tarfile.open(tb) as t:
            t.extractall(ASR_DIR)
    return True

_fc = {}
def F(kind, size):
    """kind: serif, serifb, hand, handb, sans, sansm, sansb"""
    key = (kind, size)
    if key not in _fc:
        path = {'serif': FONT_DIR + '/Fraunces-600.ttf', 'serifb': FONT_DIR + '/Fraunces-700.ttf',
                'hand': FONT_DIR + '/Caveat-600.ttf', 'handb': FONT_DIR + '/Caveat-700.ttf',
                'sans': INTER + 'Inter-Regular.otf', 'sansm': INTER + 'Inter-Medium.otf',
                'sansb': INTER + 'Inter-SemiBold.otf'}[kind]
        _fc[key] = ImageFont.truetype(path, size)
    return _fc[key]
# Fraunces/Caveat have no glyphs for ≈ ≠ ≤ ≥ →: write words instead ("about", "is not") or use Inter (sans*) for those symbols.

# ---------------- ElevenLabs voice ----------------
EL = 'https://api.elevenlabs.io'
VOICE_NAME = 'Jarnathan'
VOICE_ID = 'c6SfcYrb2t09NHXiT80T'  # 'Jarnathan - Confident and Versatile' (so a key without voices_read still works)
MODEL_ID = 'eleven_v4'

def _el(method, path, key, body=None, raw=False):
    key = (key or '').replace('\\', '').strip()  # Google Docs shows 'sk\_...' - drop the backslash
    req = urllib.request.Request(EL + path, method=method, headers={'xi-api-key': key, 'Content-Type': 'application/json', 'Accept': '*/*'})
    data = json.dumps(body).encode() if body is not None else None
    with urllib.request.urlopen(req, data=data, timeout=300) as r:
        b = r.read()
    return b if raw else json.loads(b or b'{}')

def find_voice(key, name=VOICE_NAME):
    cache = os.path.join(HOME, 'voice_id.txt')
    if os.path.exists(cache):
        return open(cache).read().strip()
    vid = None
    try:
        res = _el('GET', '/v2/voices?search=' + urllib.parse.quote(name) + '&page_size=20', key)
        for v in res.get('voices', []):
            if v.get('name', '').lower().startswith(name.lower()):
                vid = v['voice_id']; break
    except Exception:
        pass
    if not vid:
        res = _el('GET', '/v1/shared-voices?search=' + urllib.parse.quote(name) + '&page_size=20', key)
        for v in res.get('voices', []):
            if v.get('name', '').lower().startswith(name.lower()):
                try:
                    _el('POST', f"/v1/voices/add/{v['public_owner_id']}/{v['voice_id']}", key, {'new_name': v['name']})
                except Exception:
                    pass
                vid = v['voice_id']; break
    if not vid:
        raise RuntimeError(f'ElevenLabs voice "{name}" not found')
    open(cache, 'w').write(vid)
    return vid

import urllib.parse

def tts(text, out_mp3, key=None, voice_id=None, model_id=MODEL_ID, stability=0.5, similarity=0.75, style=0.0):
    """Narrate text with ElevenLabs. Long text is split at paragraph breaks into <=4000-char parts and joined."""
    key = key or os.environ.get('ELEVENLABS_API_KEY')
    if not key:
        raise RuntimeError('No ElevenLabs API key (set ELEVENLABS_API_KEY)')
    voice_id = voice_id or VOICE_ID or find_voice(key)
    paras = [p.strip() for p in text.split('\n\n') if p.strip()]
    parts, cur = [], ''
    for p in paras:
        if cur and len(cur) + len(p) + 2 > 4000:
            parts.append(cur); cur = p
        else:
            cur = (cur + '\n\n' + p) if cur else p
    if cur:
        parts.append(cur)
    files = []
    for i, part in enumerate(parts):
        body = {'text': part, 'model_id': model_id,
                'voice_settings': {'stability': stability, 'similarity_boost': similarity, 'style': style, 'use_speaker_boost': True}}
        if i > 0:
            body['previous_text'] = parts[i - 1][-600:]
        if i < len(parts) - 1:
            body['next_text'] = parts[i + 1][:600]
        try:
            audio = _el('POST', f'/v1/text-to-speech/{voice_id}?output_format=mp3_44100_128', key, body, raw=True)
        except urllib.error.HTTPError as e:
            if model_id != 'eleven_multilingual_v2' and e.code in (400, 422):
                body['model_id'] = 'eleven_multilingual_v2'
                audio = _el('POST', f'/v1/text-to-speech/{voice_id}?output_format=mp3_44100_128', key, body, raw=True)
            else:
                raise RuntimeError(f'ElevenLabs error {e.code}: {e.read()[:300]}')
        fn = f'{out_mp3}.part{i}.mp3'
        open(fn, 'wb').write(audio)
        files.append(fn)
    if len(files) == 1:
        shutil.move(files[0], out_mp3)
    else:
        lst = out_mp3 + '.txt'
        open(lst, 'w').write(''.join(f"file '{os.path.abspath(f)}'\n" for f in files))
        _run(['ffmpeg', '-y', '-loglevel', 'error', '-f', 'concat', '-safe', '0', '-i', lst, '-c', 'copy', out_mp3])
    return out_mp3

# ---- Free "Chartography voice" (Kokoro, open source, runs here; 0 credits) ----
# Tuned on Nov 6, 2026 to sound close to the ElevenLabs Jarnathan narration (pitch, pace, pauses).
# It is our own voice (a blend of two Kokoro voices), NOT a clone of Jarnathan.
FREE_VOICE = {'blend': {'am_fenrir': 0.7, 'am_michael': 0.3}, 'speed': 0.94,
              'sent_gap': 0.42, 'para_gap': 0.85, 'ellipsis_gap': 0.6}
_KOKORO_URL = 'https://github.com/thewh1teagle/kokoro-onnx/releases/download/model-files-v1.0/'
_KOKORO = {}

def _kokoro():
    if 'k' in _KOKORO:
        return _KOKORO['k']
    try:
        from kokoro_onnx import Kokoro
    except ImportError:
        _run([sys.executable, '-m', 'pip', 'install', '-q', '--break-system-packages', 'kokoro-onnx', 'soundfile'])
        from kokoro_onnx import Kokoro
    d = os.path.expanduser('~/.cache/chartography/kokoro'); os.makedirs(d, exist_ok=True)
    for f in ('kokoro-v1.0.onnx', 'voices-v1.0.bin'):
        p = os.path.join(d, f)
        if not os.path.exists(p) or os.path.getsize(p) < 1_000_000:
            _run(['curl', '-sSL', '--retry', '3', '-o', p, _KOKORO_URL + f])
    _KOKORO['k'] = Kokoro(os.path.join(d, 'kokoro-v1.0.onnx'), os.path.join(d, 'voices-v1.0.bin'))
    return _KOKORO['k']

def tts_free(text, out_mp3, voice=None):
    """Narrate with the free Chartography voice (0 ElevenLabs credits). Same interface as tts()."""
    import numpy as np, soundfile as sf
    v = voice or FREE_VOICE
    k = _kokoro()
    style = sum(w * k.get_voice_style(n) for n, w in v['blend'].items())
    sr, out = 24000, []
    for p in [p.strip() for p in text.split('\n\n') if p.strip()]:
        for s in re.split(r'(?<=[.?!])\s+', p):
            bits = s.split('...')
            for j, chunk in enumerate(bits):
                if chunk.strip():
                    a, sr = k.create(chunk.strip(), voice=style, speed=v['speed'], lang='en-us')
                    out.append(a)
                if j < len(bits) - 1:
                    out.append(np.zeros(int(sr * v['ellipsis_gap'])))
            out.append(np.zeros(int(sr * v['sent_gap'])))
        out.append(np.zeros(int(sr * (v['para_gap'] - v['sent_gap']))))
    wav = out_mp3 + '.wav'
    sf.write(wav, np.concatenate(out), sr)
    _run(['ffmpeg', '-y', '-loglevel', 'error', '-i', wav, '-af', 'highpass=f=70,loudnorm=I=-16:TP=-1.5',
          '-ar', '44100', '-b:a', '192k', out_mp3])
    os.remove(wav)
    return out_mp3

def credits_left(key=None):
    key = key or os.environ.get('ELEVENLABS_API_KEY')
    if not key:
        return 0
    try:
        s = _el('GET', '/v1/user/subscription', key)
    except urllib.error.HTTPError as e:
        print('credits_left: cannot read subscription (key needs User: Read):', e.code)
        return None
    return int(s.get('character_limit', 0)) - int(s.get('character_count', 0))

def tts_auto(text, out_mp3, key=None, reserve=1000):
    """ElevenLabs while credits last, otherwise the free Chartography voice. Returns 'elevenlabs' or 'free'.
    One voice per video: never mix the two inside one video."""
    try:
        left = credits_left(key)
        if left is None or left >= len(text) + reserve:
            tts(text, out_mp3, key=key)
            return 'elevenlabs'
    except Exception as e:
        print('ElevenLabs unavailable, using the free voice:', str(e)[:200])
    tts_free(text, out_mp3)
    return 'free'

def duration(path):
    return float(subprocess.check_output(['ffprobe', '-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', path]).decode().strip())

# ---------------- word timings ----------------
_ones = 'zero one two three four five six seven eight nine ten eleven twelve thirteen fourteen fifteen sixteen seventeen eighteen nineteen'.split()
_tens = '_ _ twenty thirty forty fifty sixty seventy eighty ninety'.split()
def _n2w(n):
    n = int(n)
    if n < 20: return _ones[n]
    if n < 100: return _tens[n // 10] + ('' if n % 10 == 0 else ' ' + _ones[n % 10])
    if n < 1000: return _ones[n // 100] + ' hundred' + ('' if n % 100 == 0 else ' ' + _n2w(n % 100))
    if n < 1000000: return _n2w(n // 1000) + ' thousand' + ('' if n % 1000 == 0 else ' ' + _n2w(n % 1000))
    return _n2w(n // 1000000) + ' million' + ('' if n % 1000000 == 0 else ' ' + _n2w(n % 1000000))

def spoken_words(s):
    """Normalise script text to the words a narrator says (numbers -> words)."""
    s = s.replace(',', '').replace('%', ' percent').replace('$', ' ')
    s = re.sub(r'(\d+)\.(\d+)', lambda m: _n2w(m.group(1)) + ' point ' + ' '.join(_ones[int(c)] for c in m.group(2)), s)
    s = re.sub(r'\b(19|20)(\d\d)\b', lambda m: _n2w(m.group(1)) + ' ' + (_n2w(m.group(2)) if m.group(2) != '00' else 'hundred'), s)
    s = re.sub(r'\d+', lambda m: _n2w(m.group()), s)
    w = re.findall(r"[a-z']+", s.lower())
    out = []
    for x in w:  # ASR splits some compounds
        out += {'everyone': ['every', 'one'], 'someone': ['some', 'one'], 'anyone': ['any', 'one'], 'today': ['to', 'day'],
                'tomorrow': ['to', 'morrow'], 'forever': ['for', 'ever'], 'altogether': ['altogether'], 'okay': ['o', 'k'],
                'us': ['us']}.get(x, [x])
    return out

def transcribe(mp3, out_json=None):
    import numpy as np, soundfile as sf, sherpa_onnx
    wav = mp3 + '.16k.wav'
    _run(['ffmpeg', '-y', '-loglevel', 'error', '-i', mp3, '-ac', '1', '-ar', '16000', wav])
    D = os.path.join(ASR_DIR, 'sherpa-onnx-zipformer-small-en-2023-06-26') + '/'
    rec = sherpa_onnx.OfflineRecognizer.from_transducer(encoder=D + 'encoder-epoch-99-avg-1.int8.onnx', decoder=D + 'decoder-epoch-99-avg-1.int8.onnx',
                                                        joiner=D + 'joiner-epoch-99-avg-1.int8.onnx', tokens=D + 'tokens.txt', num_threads=2, decoding_method='greedy_search')
    a, sr = sf.read(wav, dtype='float32')
    # cut at pauses so chunks stay ~15 s
    sil = subprocess.run(['ffmpeg', '-hide_banner', '-i', wav, '-af', 'silencedetect=noise=-35dB:d=0.3', '-f', 'null', '-'], capture_output=True, text=True).stderr
    mids, st = [], None
    for l in sil.split('\n'):
        m = re.search(r'silence_start: ([\d.]+)', l)
        if m: st = float(m.group(1))
        m = re.search(r'silence_end: ([\d.]+)', l)
        if m and st is not None: mids.append((st + float(m.group(1))) / 2)
    cuts = [0.0]
    for m in mids:
        if m - cuts[-1] > 15: cuts.append(m)
    cuts.append(len(a) / sr)
    words = []
    for c0, c1 in zip(cuts[:-1], cuts[1:]):
        s = rec.create_stream(); s.accept_waveform(sr, a[int(c0 * sr):int(c1 * sr)]); rec.decode_stream(s)
        cur = None
        for tok, ts in zip(s.result.tokens, s.result.timestamps):
            if tok.startswith(('▁', ' ')) or cur is None:
                if cur: words.append(cur)
                cur = [tok.replace('▁', '').strip().lower(), round(c0 + ts, 3)]
            else:
                cur[0] += tok.lower()
        if cur: words.append(cur)
    words = [w for w in words if w[0]]
    if out_json:
        json.dump(words, open(out_json, 'w'))
    return words

class Cues:
    """Find when a phrase is spoken. cues.at('one hundred and four dollars') -> seconds (start of first word).
    Write the phrase as in the script (digits fine). Searches forward from the previous cue unless after= is given."""
    def __init__(self, words, end=None):
        self.words = [[w.lower(), t] for w, t in words]
        self.W = [w for w, _ in self.words]
        self.end = end or (words[-1][1] + 1.0 if words else 0)
        self.used = []
        self._pos = 0

    @classmethod
    def from_audio(cls, mp3, cache=None):
        words = transcribe(mp3, cache)
        return cls(words, duration(mp3))

    def _find(self, phrase, start):
        ph = spoken_words(phrase)
        n = len(ph)
        if n == 0:
            raise ValueError('empty phrase')
        best, bi = 0, None
        for i in range(start, len(self.W)):
            seg = self.W[i:i + n + 2]
            r = difflib.SequenceMatcher(a=ph, b=seg[:n], autojunk=False).ratio()
            if r > best:
                best, bi = r, i
            if r == 1.0:
                break
        return bi, best

    def at(self, phrase, after=None, lead=0.1):
        start = self._pos if after is None else next((i for i, (_, t) in enumerate(self.words) if t >= after), len(self.W))
        i, score = self._find(phrase, start)
        if i is None or score < 0.6:
            i2, s2 = self._find(phrase, 0)
            if i2 is not None and s2 > (score or 0):
                i, score = i2, s2
        if i is None or score < 0.6:
            raise ValueError(f'cue not found in voiceover: "{phrase}" (best match {score:.2f})')
        self._pos = i + 1
        t = max(0.0, self.words[i][1] - lead)
        self.used.append({'phrase': phrase, 'time': round(t, 2), 'match': round(score, 2), 'heard': ' '.join(self.W[i:i + len(spoken_words(phrase))])})
        return t

    def sentence_times(self, script):
        """Start time of every sentence in the script (for captions or checks)."""
        sents = [s for p in script.split('\n\n') for s in re.split(r'(?<=[.?!])\s+', p.strip()) if s.strip()]
        sw, owner = [], []
        for k, s in enumerate(sents):
            for w in spoken_words(s):
                sw.append(w); owner.append(k)
        sm = difflib.SequenceMatcher(a=sw, b=self.W, autojunk=False)
        first = {}
        for a0, b0, n in sm.get_matching_blocks():
            for j in range(n):
                k = owner[a0 + j]
                if k not in first:
                    first[k] = self.words[b0 + j][1]
        return [(s, first.get(k)) for k, s in enumerate(sents)]

def _silences(path, noise='-38dB', min_d=0.18):
    out = subprocess.run(['ffmpeg', '-hide_banner', '-i', path, '-af', f'silencedetect=noise={noise}:d={min_d}', '-f', 'null', '-'],
                         capture_output=True, text=True).stderr
    st = [float(x) for x in re.findall(r'silence_start: ([0-9.]+)', out)]
    en = [float(x) for x in re.findall(r'silence_end: ([0-9.]+)', out)]
    return list(zip(st, en))

def cut_segment(src_mp3, words, start_phrase, end_phrase, out_mp3, out_words=None, lead=0.12, tail=0.45):
    """Cut a Short's voiceover out of a long-form voiceover - costs NO ElevenLabs credits.
    start_phrase / end_phrase: the first words of the first sentence and the LAST words of the last sentence you keep
    (exact script wording). Writes out_mp3 (with tiny fades) and out_words (word times shifted to start at 0).
    Returns (duration, words). Then use ce.Cues(words, duration) exactly like a freshly voiced Short."""
    if isinstance(words, str):
        words = json.load(open(words))
    c = Cues(words, duration(src_mp3))
    t0 = c.at(start_phrase, lead=lead)
    i, score = c._find(end_phrase, c._pos)
    if i is None or score < 0.75:
        raise ValueError(f'end phrase not found after start: "{end_phrase}" (best match {score:.2f})')
    last = i + len(spoken_words(end_phrase)) - 1
    last_t = c.words[last][1]
    nxt = c.words[last + 1][1] if last + 1 < len(c.words) else c.end
    t1 = min(nxt - 0.05, last_t + 1.2)  # stop before the next word starts
    t1 = max(t1, last_t + 0.35)
    # Snap both cut points into the silent gap between sentences (word timings from the transcriber can be
    # a few tenths of a second late, which would leave the tail of the previous sentence or the start of the next).
    gaps = _silences(src_mp3)
    pre = [g for g in gaps if g[1] <= t0 + 0.45 and g[1] >= t0 - 1.5]
    if pre:
        t0 = max(0.0, pre[-1][1] - 0.06)
    post = [g for g in gaps if g[0] >= last_t + 0.1 and g[0] <= last_t + 1.6]
    if post:
        t1 = post[0][0] + 0.06
    d = t1 - t0
    _run(['ffmpeg', '-y', '-loglevel', 'error', '-ss', f'{t0:.3f}', '-to', f'{t1:.3f}', '-i', src_mp3,
          '-af', f'afade=t=in:d=0.04,afade=t=out:st={max(0, d - 0.12):.3f}:d=0.12,apad=pad_dur={tail}',
          '-c:a', 'libmp3lame', '-b:a', '192k', out_mp3])
    seg = [[w, round(t - t0, 3)] for w, t in c.words if t0 <= t < t1]
    if out_words:
        json.dump(seg, open(out_words, 'w'))
    return duration(out_mp3), seg

def sync_report(cues, out_json):
    json.dump(cues.used, open(out_json, 'w'), indent=1)
    weak = [u for u in cues.used if u['match'] < 0.85]
    return {'cues': len(cues.used), 'weak_matches': weak}

# ---------------- drawing helpers ----------------
def clamp(x, a=0.0, b=1.0):
    return max(a, min(b, x))

def ease(x):
    x = clamp(x)
    return 1 - (1 - x) ** 3

def prog(T, start, dur=0.6):
    """0..1 eased progress of an element that appears at absolute time `start`."""
    return ease((T - start) / dur)

def mix(c, a, base=BG):
    return tuple(int(base[i] + (c[i] - base[i]) * a) for i in range(3))

def text(d, xy, s, font, color=CREAM, a=1.0, anchor='la', rise=24, base=BG):
    if a <= 0.001:
        return
    x, y = xy
    d.text((x, y + (1 - a) * rise), s, font=font, fill=mix(color, a, base), anchor=anchor)

def fit_font(d, s, kind, size, max_w):
    """Largest font size <= size so that s fits in max_w pixels."""
    while size > 12 and d.textlength(s, font=F(kind, size)) > max_w:
        size -= 2
    return F(kind, size)

def wrap(d, s, font, max_w):
    out, cur = [], ''
    for w in s.split():
        x = (cur + ' ' + w).strip()
        if d.textlength(x, font=font) <= max_w:
            cur = x
        else:
            if cur: out.append(cur)
            cur = w
    if cur: out.append(cur)
    return out

def text_block(d, xy, s, font, max_w, color=CREAM, a=1.0, anchor='la', line_gap=1.18, base=BG):
    """Wrapped multi-line text; anchor 'la' (left) or 'ma' (centered on x)."""
    x, y = xy
    lines = wrap(d, s, font, max_w)
    lh = font.size * line_gap
    for i, ln in enumerate(lines):
        text(d, (x, y + i * lh), ln, font, color, a, anchor=anchor, base=base)
    return y + len(lines) * lh

def fmt_int(n):
    return f'{int(round(n)):,}'

def counter(d, xy, value, T, start, dur=1.8, prefix='$', suffix='', font=None, color=MINT, anchor='mm', decimals=0):
    """Number that counts up from 0 to value."""
    if T < start:
        return
    v = value * ease((T - start) / dur)
    s = f'{v:,.{decimals}f}' if decimals else fmt_int(v)
    text(d, xy, prefix + s + suffix, font or F('serifb', 160), color, prog(T, start, 0.4), anchor=anchor)

def pill(d, cx, cy, s, a, color=CREAM, fill=PANEL, font=None):
    if a <= 0.001:
        return
    font = font or F('sansm', 40)
    w = d.textlength(s, font=font) + 72
    h = font.size + 46
    cy += (1 - a) * 20
    d.rounded_rectangle([cx - w / 2, cy - h / 2, cx + w / 2, cy + h / 2], radius=h / 2, fill=mix(fill, a))
    d.text((cx, cy), s, font=font, fill=mix(color, a, fill), anchor='mm')

def pill_row(d, cy, items, T, starts, font=None, gap=40, colors=None, cx=None):
    """Centered row of pills that appear at the given times."""
    font = font or F('sansm', 40)
    ws = [d.textlength(s, font=font) + 72 for s in items]
    x = (cx if cx is not None else W / 2) - (sum(ws) + gap * (len(items) - 1)) / 2
    for i, s in enumerate(items):
        pill(d, x + ws[i] / 2, cy, s, prog(T, starts[i]), color=(colors or [CREAM] * len(items))[i], font=font)
        x += ws[i] + gap

def card(d, box, a, fill=PANEL, radius=32):
    x0, y0, x1, y1 = box
    if a <= 0.001:
        return
    d.rounded_rectangle([x0, y0 + (1 - a) * 30, x1, y1 + (1 - a) * 30], radius=radius, fill=mix(fill, a))

def hand_underline(d, x0, x1, y, p, color=MINT, width=8):
    if p <= 0:
        return
    pts = []
    for i in range(41):
        u = i / 40
        if u > p:
            break
        pts.append((x0 + (x1 - x0) * u, y + math.sin(u * 3.1) * 6 - u * 8))
    if len(pts) > 1:
        d.line(pts, fill=color, width=width, joint='curve')

def arrow(d, p0, p1, a=1.0, color=MUTED, width=6):
    if a <= 0:
        return
    (x0, y0), (x1, y1) = p0, p1
    d.line([p0, p1], fill=mix(color, a), width=width)
    ang = math.atan2(y1 - y0, x1 - x0)
    for s in (-1, 1):
        d.line([(x1, y1), (x1 - 22 * math.cos(ang + s * 0.5), y1 - 22 * math.sin(ang + s * 0.5))], fill=mix(color, a), width=width)

def hbars(d, T, rows, box, start, stagger=0.15, grow=1.2, value_fmt=lambda v: f'${v:,.0f}B', label_font=None, value_font=None, colors=None, vmax=None):
    """Horizontal bar chart. rows = [(label, value)]; box = (label_right_x, top_y, max_bar_width, row_height)."""
    lx, y0, maxw, rh = box
    vmax = vmax or max(v for _, v in rows)
    lf = label_font or F('sansm', 36)
    vf = value_font or F('sansb', 36)
    for i, (lab, v) in enumerate(rows):
        y = y0 + i * rh
        a = prog(T, start + i * stagger, 0.4)
        text(d, (lx - 30, y + rh * 0.32), lab, lf, CREAM, a, anchor='rm', rise=0)
        p = ease((T - start - i * stagger) / grow)
        w = maxw * v / vmax * p
        col = (colors[i] if colors else (MINT if i == 0 else SLATE))
        if w > 2:
            d.rounded_rectangle([lx, y + rh * 0.06, lx + w, y + rh * 0.58], radius=8, fill=col)
        if p > 0.05:
            text(d, (lx + w + 20, y + rh * 0.32), value_fmt(v * p if p < 1 else v), vf, CREAM, clamp(p * 1.5), anchor='lm', rise=0)

def vbars(d, T, rows, box, start, stagger=0.2, grow=1.0, value_fmt=lambda v: f'{v:,.0f}', colors=None, vmax=None, label_font=None, value_font=None):
    """Vertical bars. rows=[(label, value)]; box=(x0, baseline_y, total_width, max_height)."""
    x0, by, tw, mh = box
    n = len(rows)
    vmax = vmax or max(v for _, v in rows)
    slot = tw / n
    bw = slot * 0.62
    lf = label_font or F('sansm', 30)
    vf = value_font or F('sansb', 34)
    for i, (lab, v) in enumerate(rows):
        cx = x0 + slot * (i + 0.5)
        p = ease((T - start - i * stagger) / grow)
        h = mh * v / vmax * p
        col = colors[i] if colors else MINT
        if h > 2:
            d.rounded_rectangle([cx - bw / 2, by - h, cx + bw / 2, by], radius=8, fill=col)
        a = prog(T, start + i * stagger, 0.4)
        text(d, (cx, by + 34), lab, lf, MUTED, a, anchor='mm', rise=0)
        if p > 0.05:
            text(d, (cx, by - h - 30), value_fmt(v), vf, CREAM, clamp(p * 1.5), anchor='mm', rise=0)

def line_chart(d, T, pts, box, start, dur=2.5, ymax=None, ymin=0, color=MINT, width=8, y_ticks=(), y_fmt=str, x_labels=True, point_labels=None, label_font=None):
    """pts = [(x_fraction 0..1, value, x_label)]. Draws progressively from start over dur seconds."""
    gx0, gy0, gx1, gy1 = box
    ymax = ymax or max(v for _, v, _ in pts) * 1.15
    X = lambda f: gx0 + (gx1 - gx0) * f
    Y = lambda v: gy1 - (gy1 - gy0) * (v - ymin) / (ymax - ymin)
    a = prog(T, start - 0.4)
    for v in y_ticks:
        d.line([(gx0, Y(v)), (gx1, Y(v))], fill=mix(GRID, a), width=2)
        d.text((gx0 - 16, Y(v)), y_fmt(v), font=F('sans', 26), fill=mix(MUTED, a), anchor='rm')
    p = clamp((T - start) / dur)
    xy = [(X(f), Y(v)) for f, v, _ in pts]
    # length-proportional reveal
    segl = [math.dist(xy[i], xy[i + 1]) for i in range(len(xy) - 1)]
    total = sum(segl) or 1
    goal = total * ease(p)
    drawn = [xy[0]]
    acc = 0
    for i, L in enumerate(segl):
        if acc + L <= goal:
            drawn.append(xy[i + 1]); acc += L
        else:
            r = (goal - acc) / L if L else 0
            drawn.append((xy[i][0] + (xy[i + 1][0] - xy[i][0]) * r, xy[i][1] + (xy[i + 1][1] - xy[i][1]) * r))
            break
    if len(drawn) > 1 and p > 0:
        d.line(drawn, fill=color, width=width, joint='curve')
    lf = label_font or F('sansb', 32)
    reached = 0
    for i, (f, v, lab) in enumerate(pts):
        frac = (sum(segl[:i]) / total) if i else 0
        if ease(p) + 1e-6 >= frac and p > 0:
            x, y = xy[i]
            d.ellipse([x - 11, y - 11, x + 11, y + 11], fill=CREAM)
            if x_labels and lab:
                d.text((x, gy1 + 34), lab, font=F('sans', 26), fill=MUTED, anchor='mm')
            if point_labels:
                d.text((x, y - 36), point_labels[i], font=lf, fill=CREAM, anchor='mm')
            reached = i
    return reached

def calendar_grid(d, x0, y0, filled, total=365, cols=25, cell=30, gap=6, a=1.0, color=AMBER):
    for i in range(total):
        r, c = divmod(i, cols)
        x = x0 + c * (cell + gap)
        y = y0 + r * (cell + gap)
        d.rounded_rectangle([x, y, x + cell, y + cell], radius=max(3, cell // 5), fill=mix(color if i < filled else EMPTY, a))

def progress_bar(d, box, frac, a=1.0, color=MINT):
    x0, y0, x1, y1 = box
    r = (y1 - y0) / 2
    d.rounded_rectangle(box, radius=r, fill=mix(EMPTY, a))
    w = (x1 - x0) * clamp(frac)
    if w > 2 * r:
        d.rounded_rectangle([x0, y0, x0 + w, y1], radius=r, fill=mix(color, a))

def dot_field(d, box, T, start, rows=14, cols=48, spacing=33, size=13, dim=1.0):
    x0, y0 = box[0], box[1]
    a = clamp((T - start) / 1.5)
    for r in range(rows):
        for c in range(cols):
            ap = clamp(a * 3 - (c + r) / (cols + rows) * 2)
            if ap > 0:
                x, y = x0 + c * spacing, y0 + r * spacing
                d.ellipse([x, y, x + size, y + size], fill=mix(CREAM, 0.55 * ap * dim))

_donut_cache = {}
def donut(img, cx, cy, r, parts, sweep, a=1.0, hole=0.58):
    """parts = [(fraction, color)] summing to 1; sweep 0..1 animates the reveal (antialiased)."""
    key = (cx, cy, r, tuple(parts), round(sweep, 3), round(a, 2))
    if key in _donut_cache:
        layer, mask = _donut_cache[key]
    else:
        S = 2
        size = int(r * 2 * S) + 8
        layer = Image.new('RGB', (size, size), BG)
        mk = Image.new('L', (size, size), 0)
        dl, dm = ImageDraw.Draw(layer), ImageDraw.Draw(mk)
        bx = [4, 4, size - 4, size - 4]
        total, acc = 360 * clamp(sweep), 0
        for frac, col in parts:
            seg = 360 * frac
            e = min(acc + seg, total)
            if e > acc:
                dl.pieslice(bx, -90 + acc, -90 + e, fill=mix(col, a))
                dm.pieslice(bx, -90 + acc, -90 + e, fill=255)
            acc += seg
        c, inner = size / 2, r * hole * S
        dm.ellipse([c - inner, c - inner, c + inner, c + inner], fill=0)
        layer = layer.resize((size // S, size // S), Image.LANCZOS)
        mask = mk.resize((size // S, size // S), Image.LANCZOS)
        if sweep >= 0.999:
            _donut_cache[key] = (layer, mask)
    img.paste(layer, (int(cx - layer.width / 2), int(cy - layer.height / 2)), mask)

def house(d, x, y, s, col):
    d.polygon([(x, y), (x + s / 2, y - s * 0.45), (x + s, y)], fill=col)
    d.rectangle([x + s * 0.1, y, x + s * 0.9, y + s * 0.6], fill=col)
    d.rectangle([x + s * 0.42, y + s * 0.3, x + s * 0.58, y + s * 0.6], fill=BG)

def person_icon(d, cx, cy, s, col):
    d.ellipse([cx - s * 0.22, cy - s * 0.5, cx + s * 0.22, cy - s * 0.06], fill=col)
    d.rounded_rectangle([cx - s * 0.36, cy, cx + s * 0.36, cy + s * 0.55], radius=int(s * 0.2), fill=col)

def coin(d, cx, cy, r, a=1.0):
    d.ellipse([cx - r, cy - r, cx + r, cy + r], fill=mix(AMBER, a))
    d.ellipse([cx - r * 0.72, cy - r * 0.72, cx + r * 0.72, cy + r * 0.72], outline=mix((200, 140, 40), a), width=max(2, int(r * 0.08)))
    d.text((cx, cy), '$', font=F('serifb', int(r * 1.1)), fill=mix((140, 92, 20), a), anchor='mm')

# ---------------- logo + chrome ----------------
def _bez(p0, p1, p2, p3, n=24):
    return [((1-t)**3*p0[0] + 3*(1-t)**2*t*p1[0] + 3*(1-t)*t*t*p2[0] + t**3*p3[0],
             (1-t)**3*p0[1] + 3*(1-t)**2*t*p1[1] + 3*(1-t)*t*t*p2[1] + t**3*p3[1]) for t in [i / n for i in range(n + 1)]]

def _path(start, curves):
    pts, cur = [start], start
    for c in curves:
        pts += _bez(cur, *c)[1:]
        cur = c[2]
    return pts

_LINE = _path((168, 566), [((214, 556), (236, 510), (276, 478)), ((312, 450), (346, 446), (374, 462)), ((404, 480), (424, 502), (452, 486)),
                           ((494, 462), (516, 378), (556, 316)), ((580, 280), (600, 258), (618, 246))])
_BASE = _path((150, 628), [((260, 620), (380, 636), (500, 624)), ((560, 618), (620, 626), (652, 620))])
_RING = _path((682, 216), [((670, 178), (600, 170), (574, 206)), ((548, 242), (566, 294), (618, 302)), ((664, 308), (698, 280), (692, 242)), ((690, 226), (678, 212), (662, 206))])
_logo = {}
def logo(size, tile=PANEL):
    if (size, tile) in _logo:
        return _logo[(size, tile)]
    im = Image.new('RGB', (800, 800), tile)
    dd = ImageDraw.Draw(im)
    dd.line(_BASE, fill=MINT, width=16, joint='curve')
    dd.line(_LINE, fill=CREAM, width=40, joint='curve')
    for p in (_LINE[0], _LINE[-1]):
        dd.ellipse([p[0] - 20, p[1] - 20, p[0] + 20, p[1] + 20], fill=CREAM)
    for p in ((276, 478), (374, 462), (452, 486)):
        dd.ellipse([p[0] - 15, p[1] - 15, p[0] + 15, p[1] + 15], fill=tile)
    dd.ellipse([586, 206, 658, 278], fill=AMBER)
    dd.line(_RING, fill=AMBER, width=10, joint='curve')
    im = im.resize((size, size), Image.LANCZOS)
    m = Image.new('L', (size * 4, size * 4), 0)
    ImageDraw.Draw(m).rounded_rectangle([0, 0, size * 4 - 1, size * 4 - 1], radius=int(size * 0.88), fill=255)
    _logo[(size, tile)] = (im, m.resize((size, size), Image.LANCZOS))
    return _logo[(size, tile)]

def paste_logo(img, size, xy, a=1.0):
    im, m = logo(size)
    if a < 1:
        m = m.point(lambda v: int(v * a))
    img.paste(im, (int(xy[0]), int(xy[1])), m)

_MASCOT = {}
MASCOT_PATH = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'assets', 'mascot_sticker.png')

def mascot(img, xy, height, a=1.0, T=None, start=None, flip=False, bob=True):
    """Paste the Chartography mascot (white sticker outline, works on navy). xy = top-left.
    In videos pass T and start: it pops in at `start` and bobs gently. flip=True makes it look right."""
    key = (height, flip)
    if key not in _MASCOT:
        m = Image.open(MASCOT_PATH).convert('RGBA')
        m = m.resize((int(m.width * height / m.height), height), Image.LANCZOS)
        if flip:
            m = m.transpose(Image.FLIP_LEFT_RIGHT)
        _MASCOT[key] = m
    m = _MASCOT[key]
    x, y = xy
    if T is not None and start is not None:
        p = prog(T, start, 0.45)
        a *= p
        y += (1 - ease(p)) * 60
        if bob:
            y += math.sin((T - start) * 2.4) * 6
    if a <= 0:
        return
    if a < 1:
        r, g, b, al = m.split()
        m = Image.merge('RGBA', (r, g, b, al.point(lambda v: int(v * a))))
    img.paste(m, (int(x), int(y)), m)

def chrome(img, d, source=None):
    """Brand footer: logo + wordmark bottom-right, source line bottom-left. Call in every scene."""
    m = 120 if MODE == 'long' else 70
    y = H - 54 if MODE == 'long' else H - 90
    paste_logo(img, 44, (W - m - 294, y - 22))
    d.text((W - m - 236, y), 'Chartography', font=F('serif', 30), fill=MUTED, anchor='lm')
    if source:
        fnt = F('sans', 22 if MODE == 'long' else 24)
        if MODE == 'long':
            d.text((m, y), 'Source: ' + source, font=fnt, fill=mix(MUTED, 0.85), anchor='lm')
        else:
            text_block(d, (m, y - 120), 'Source: ' + source, fnt, W - 2 * m, color=mix(MUTED, 0.85))

def eyebrow(d, s, a=1.0, xy=None):
    xy = xy or ((120, 120) if MODE == 'long' else (70, 200))
    text(d, xy, s, F('sansb', 28 if MODE == 'long' else 34), MINT, a, rise=10)

# ---------------- rendering ----------------
class Scene:
    def __init__(self, start, fn, name=None):
        self.start, self.fn, self.name = float(start), fn, name or fn.__name__

_SCENES = []
_ENDT = 0

def _frame(i, T):
    sc = _SCENES[i]
    img = Image.new('RGB', (W, H), BG)
    d = ImageDraw.Draw(img)
    sc.fn(T, img, d)
    s0 = round(sc.start * FPS)
    s1 = round((_SCENES[i + 1].start if i + 1 < len(_SCENES) else _ENDT) * FPS)
    fi = round(T * FPS) - s0
    n = s1 - s0
    al = 1.0
    fin = 15 if i == 0 else 8
    if fi < fin:
        al = (fi + 1) / (fin + 1)
    if i < len(_SCENES) - 1 and fi >= n - 6:
        al = min(al, (n - fi) / 7)
    if i == len(_SCENES) - 1 and fi >= n - 20:
        al = min(al, (n - fi) / 21)
    if al < 1:
        img = Image.blend(Image.new('RGB', (W, H), BG), img, max(0.0, al))
    return img

def _render_scene(args):
    i, out = args
    sc = _SCENES[i]
    s0 = round(sc.start * FPS)
    s1 = round((_SCENES[i + 1].start if i + 1 < len(_SCENES) else _ENDT) * FPS)
    tmp = out[:-4] + '.part.mp4'
    p = subprocess.Popen(['ffmpeg', '-y', '-loglevel', 'error', '-f', 'rawvideo', '-pix_fmt', 'rgb24', '-s', f'{W}x{H}', '-r', str(FPS), '-i', '-',
                          '-c:v', 'libx264', '-preset', 'veryfast', '-crf', '20', '-pix_fmt', 'yuv420p', '-g', '60', tmp], stdin=subprocess.PIPE)
    for f in range(s0, s1):
        p.stdin.write(_frame(i, f / FPS).tobytes())
    p.stdin.close()
    if p.wait() == 0:
        os.replace(tmp, out)
    return out

def still(scenes, T, out, audio_end=None):
    """Draw one frame at absolute time T (for checking layouts before the full render)."""
    global _SCENES, _ENDT
    _SCENES = sorted(scenes, key=lambda s: s.start)
    _ENDT = audio_end or (_SCENES[-1].start + 10)
    i = max(k for k, s in enumerate(_SCENES) if s.start <= T)
    _frame(i, T).save(out)
    return out

def render(scenes, audio, out, tail=2.0, workdir=None, music=None, music_db=-26, procs=2):
    """Render scenes (Scene objects with absolute start times) over the voiceover into out (mp4)."""
    global _SCENES, _ENDT
    import multiprocessing as mp
    _SCENES = sorted(scenes, key=lambda s: s.start)
    if _SCENES[0].start > 0:
        _SCENES[0].start = 0.0
    _ENDT = duration(audio) + tail
    wd = workdir or os.path.join(os.path.dirname(os.path.abspath(out)), 'scenes_' + MODE)
    shutil.rmtree(wd, ignore_errors=True)
    os.makedirs(wd)
    jobs = [(i, os.path.join(wd, f'scene_{i:03d}.mp4')) for i in range(len(_SCENES))]
    order = sorted(jobs, key=lambda j: -((_SCENES[j[0] + 1].start if j[0] + 1 < len(_SCENES) else _ENDT) - _SCENES[j[0]].start))
    ctx = mp.get_context('fork')
    with ctx.Pool(procs) as pool:
        pool.map(_render_scene, order, chunksize=1)
    missing = [o for _, o in jobs if not os.path.exists(o)]
    if missing:
        raise RuntimeError(f'scenes failed to render: {missing}')
    lst = os.path.join(wd, 'list.txt')
    open(lst, 'w').write(''.join(f"file '{o}'\n" for _, o in jobs))
    vid = os.path.join(wd, 'video_only.mp4')
    _run(['ffmpeg', '-y', '-loglevel', 'error', '-f', 'concat', '-safe', '0', '-i', lst, '-c', 'copy', vid])
    if music:
        _run(['ffmpeg', '-y', '-loglevel', 'error', '-i', vid, '-i', audio, '-stream_loop', '-1', '-i', music, '-filter_complex',
              f'[2:a]volume={music_db}dB,afade=t=out:st={_ENDT - 3}:d=3[m];[1:a]apad[v];[v][m]amix=inputs=2:duration=first:dropout_transition=0[a]',
              '-map', '0:v', '-map', '[a]', '-c:v', 'copy', '-c:a', 'aac', '-b:a', '192k', '-shortest', '-movflags', '+faststart', out])
    else:
        _run(['ffmpeg', '-y', '-loglevel', 'error', '-i', vid, '-i', audio, '-map', '0:v', '-map', '1:a', '-c:v', 'copy', '-c:a', 'aac', '-b:a', '192k',
              '-af', 'apad', '-shortest', '-movflags', '+faststart', out])
    return out

def contact_sheet(video, times, out, cols=2):
    """Grab frames at the given seconds into one image for visual review."""
    tw = 640 if MODE == 'long' else 360
    th = 360 if MODE == 'long' else 640
    ims = []
    for t in times:
        fn = f'{out}.{t:.1f}.png'
        _run(['ffmpeg', '-y', '-loglevel', 'error', '-ss', str(t), '-i', video, '-frames:v', '1', '-vf', f'scale={tw}:{th}', fn])
        ims.append(Image.open(fn))
    rows = math.ceil(len(ims) / cols)
    sheet = Image.new('RGB', (tw * cols, th * rows))
    for k, im in enumerate(ims):
        sheet.paste(im, ((k % cols) * tw, (k // cols) * th))
    sheet.save(out)
    return out

# ---------------- thumbnail ----------------
def thumbnail(out, top, big, bottom, big_color=AMBER, bars=False, with_mascot=True):
    """1280x720 long-form thumbnail: small mint line, one huge number/word, a big second line with underline,
    and the mascot bottom-right (always include it - Brand Guide). Custom designs: call mascot(img, (x, y), 290)."""
    Wt, Ht = 1280, 720
    img = Image.new('RGB', (Wt, Ht), BG)
    d = ImageDraw.Draw(img)
    if bars:
        for i, (h, c) in enumerate([(420, MINT), (150, SLATE), (60, CORAL)]):
            x = 900 + i * 110
            d.rounded_rectangle([x, 640 - h, x + 80, 640], radius=12, fill=c)
    d.text((70, 90), top.upper(), font=fit_font(d, top.upper(), 'sansb', 34, 780), fill=MINT)
    narrow = bars or with_mascot
    bf = fit_font(d, big, 'serifb', 300, 800 if narrow else 1140)
    d.text((60, 150), big, font=bf, fill=big_color)
    lf = fit_font(d, bottom, 'serifb', 150, 780 if narrow else 1140)
    d.text((70, 480), bottom, font=lf, fill=CREAM)
    hand_underline(d, 70, 70 + d.textlength(bottom, font=lf), 650, 1.0, MINT, 10)
    if with_mascot:
        mascot(img, (890, 433), 290)
    im, m = logo(90)
    img.paste(im, (1160, 40), m)
    img.save(out)
    return out

def short_cover(out, top, big, bottom):
    """1080x1920 cover frame for a Short (same style)."""
    img = Image.new('RGB', (1080, 1920), BG)
    d = ImageDraw.Draw(img)
    d.text((540, 520), top.upper(), font=fit_font(d, top.upper(), 'sansb', 44, 940), fill=MINT, anchor='mm')
    d.text((540, 860), big, font=fit_font(d, big, 'serifb', 300, 960), fill=AMBER, anchor='mm')
    lf = fit_font(d, bottom, 'serifb', 130, 960)
    d.text((540, 1140), bottom, font=lf, fill=CREAM, anchor='mm')
    tw = d.textlength(bottom, font=lf)
    hand_underline(d, 540 - tw / 2, 540 + tw / 2, 1230, 1.0, MINT, 10)
    im, m = logo(120)
    img.paste(im, (480, 1600), m)
    img.save(out)
    return out
