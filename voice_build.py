"""Build a multi-voice voiceover from a project's segments.json (Nov 18, 2026).

    python3 voice_build.py projects/<slug>

segments.json = [["hero"|"narr", "text"], ...]
  hero = the mascot (ElevenLabs premade Liam), narr = Jarnathan narrator.
Writes vo.mp3, speakers.json ([speaker, start, end] per segment) and words.json (ASR word times).
Key: ELEVENLABS_API_KEY env or /tmp/el_key. Falls back to the free voice when credits run low (tts_auto).
"""
import sys, os, json, subprocess, tempfile
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import chartography_engine as ce

VOICES = {
    'hero': dict(voice_id='TX3LPaxmHKxFdv7VOQHJ', stability=0.35, style=0.5),   # Liam
    'narr': dict(voice_id='c6SfcYrb2t09NHXiT80T', stability=0.5, style=0.0),    # Jarnathan
}
GAP = 0.3


def _key():
    k = os.environ.get('ELEVENLABS_API_KEY')
    if not k and os.path.exists('/tmp/el_key'):
        k = open('/tmp/el_key').read().strip()
    return k


def build(proj):
    segs = json.load(open(os.path.join(proj, 'segments.json')))
    key = _key()
    tmp = tempfile.mkdtemp()
    wavs, spk, t = [], [], 0.0
    for i, (who, txt) in enumerate(segs):
        mp3 = f'{tmp}/s{i}.mp3'
        v = VOICES[who]
        if key and ce.credits_left(key) > len(txt) + 1000:
            ce.tts(txt, mp3, key=key, voice_id=v['voice_id'], stability=v['stability'], style=v['style'])
        else:
            ce.tts_free(txt, mp3)
        wav = f'{tmp}/s{i}.wav'
        subprocess.run(['ffmpeg', '-y', '-loglevel', 'error', '-i', mp3, '-af',
                        'silenceremove=start_periods=1:start_threshold=-45dB,areverse,silenceremove=start_periods=1:start_threshold=-45dB,areverse,loudnorm=I=-16:TP=-1.5:LRA=11',
                        '-ar', '44100', '-ac', '1', wav], check=True)
        d = ce.duration(wav)
        spk.append([who, round(t, 2), round(t + d, 2)])
        wavs.append(wav)
        t += d + GAP
    gap = f'{tmp}/gap.wav'
    subprocess.run(['ffmpeg', '-y', '-loglevel', 'error', '-f', 'lavfi', '-i', f'anullsrc=r=44100:cl=mono', '-t', str(GAP), gap], check=True)
    lst = f'{tmp}/list.txt'
    with open(lst, 'w') as f:
        for i, w in enumerate(wavs):
            f.write(f"file '{w}'\n")
            if i < len(wavs) - 1:
                f.write(f"file '{gap}'\n")
    out = os.path.join(proj, 'vo.mp3')
    subprocess.run(['ffmpeg', '-y', '-loglevel', 'error', '-f', 'concat', '-safe', '0', '-i', lst, '-c:a', 'libmp3lame', '-b:a', '192k', out], check=True)
    json.dump(spk, open(os.path.join(proj, 'speakers.json'), 'w'))
    words = ce.transcribe(out)
    json.dump(words, open(os.path.join(proj, 'words.json'), 'w'))
    print('vo', round(ce.duration(out), 2), 's;', spk)


if __name__ == '__main__':
    build(sys.argv[1])
