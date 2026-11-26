"""Synthesized soundtrack (no samples, no recordings): dark desert drone, frame drum, radio static, and our own trumpet signal."""
import json, os, subprocess
import numpy as np, soundfile as sf

P = os.path.dirname(os.path.abspath(__file__))
SR = 44100
T = json.load(open(os.path.join(P, 'timing.json')))
starts, t = {}, 0.0
for s in T:
    starts[s['id']] = t; t += s['dur']
TOTAL = t
DUR = {s['id']: s['dur'] for s in T}
rng = np.random.default_rng(11)
n = int(SR * TOTAL); tt = np.arange(n) / SR

def place(track, sig, at):
    i = int(at * SR); j = min(len(track), i + len(sig))
    if 0 <= i < len(track): track[i:j] += sig[:j - i]

def horn(freq, dur, amp=0.5, bright=1.0):
    """Brassy additive tone: brightness rises with the attack, a little lip vibrato and breath."""
    m = int(SR * dur); x = np.arange(m) / SR
    att = np.minimum(1, x / 0.045); rel = np.minimum(1, (dur - x) / 0.09).clip(0, 1)
    env = att * rel * (0.85 + 0.15 * np.exp(-x * 6))
    vib = 1 + 0.004 * np.sin(2 * np.pi * 5.2 * x) * np.minimum(1, x / 0.3)
    ph = 2 * np.pi * freq * np.cumsum(vib) / SR
    sig = np.zeros(m)
    for h in range(1, 14):
        g = (1 / h ** (1.05 - 0.35 * bright)) * (1 - np.exp(-x * (40 / h)))
        sig += g * np.sin(h * ph)
    sig = np.tanh(sig * 1.4) / 1.2
    breath = rng.normal(0, 1, m) * np.exp(-x * 30) * 0.08
    return (sig + breath) * env * amp

def drum(amp=0.5):
    m = int(SR * 0.6); x = np.arange(m) / SR
    f = 70 + 60 * np.exp(-x * 30)
    body = np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-x * 7)
    slap = rng.normal(0, 1, m) * np.exp(-x * 60) * 0.3
    return (body + slap) * amp

def reverb(x, wet=0.3):
    out = x.copy()
    for d, g in ((0.031, .5), (0.047, .42), (0.067, .36), (0.097, .3), (0.139, .24), (0.211, .17), (0.307, .11), (0.43, .07)):
        k = int(SR * d); out[k:] += g * wet * x[:-k] * 2
    return out

def seg(sid):
    return int(starts[sid] * SR), int((starts[sid] + DUR[sid]) * SR)

def fadewin(m, f=1.5):
    k = np.arange(m); return np.minimum(1, np.minimum(k, m - k) / (SR * f))

# ---- bed: low drone on D with a Phrygian half-step colour, slowly breathing
drone = np.zeros(n)
for f, a in ((73.42, .5), (110.0, .3), (146.83, .2), (155.56, .06), (220.0, .07)):
    lfo = 1 + 0.3 * np.sin(2 * np.pi * 0.045 * tt + f)
    drone += a * lfo * np.sin(2 * np.pi * f * tt + 0.25 * np.sin(2 * np.pi * 0.09 * tt))
bed = drone * 0.055

# desert wind in the tomb scene
i0, i1 = seg('tomb'); m = i1 - i0
w = np.convolve(rng.normal(0, 1, m), np.ones(60) / 60, 'same')
w *= (0.6 + 0.4 * np.sin(2 * np.pi * 0.13 * np.arange(m) / SR)) * fadewin(m, 2)
bed[i0:i1] += w * 0.16

# frame-drum heartbeat under the tense scenes
for sid, bpm, a in (('broadcast', 62, .18), ('war', 70, .26), ('pattern', 66, .2), ('heist', 76, .24)):
    at = starts[sid] + 1.0; end = starts[sid] + DUR[sid] - 1.5; k = 0
    while at < end:
        place(bed, drum(a * (1 if k % 2 == 0 else 0.6)), at)
        at += 60 / bpm * (1 if k % 2 == 0 else 1); k += 1

# radio static + warble at the end of the broadcast scene
bs = starts['broadcast']; tw = [x for x in T if x['id'] == 'broadcast'][0]
st_at = bs + [t for w_, t in tw['words'] if w_ == 'sixteenth'][0] - 0.5
m = int(SR * 7); x = np.arange(m) / SR
static = rng.normal(0, 1, m) * (0.05 + 0.03 * np.sin(2 * np.pi * 3 * x)) * fadewin(m, 1.2)
place(bed, static, st_at)

# distant trumpet calls as stings
def call(at, amp=0.22, base=233.08):
    for i, (mul, d) in enumerate(((1, .22), (1, .22), (1.5, .9))):
        place(bed, horn(base * mul, d, amp), at + i * 0.3)

def word_at(sid, w, nth=0):
    hits = [t for x, t in [x for x in T if x['id'] == sid][0]['words'] if x.startswith(w)]
    return starts[sid] + hits[nth]

call(word_at('hook', 'trumpets') + 0.6, 0.16)
call(word_at('hook', 'follows') + 0.7, 0.24, 196.0)
call(word_at('tomb', 'trumpets') + 0.7, 0.14)
call(word_at('war', 'begins') + 0.5, 0.2, 196.0)

# ---- narration + ducking
vo = np.zeros(n)
for s in T:
    a, sr = sf.read(os.path.join(P, 'audio', s['id'] + '.mp3'), always_2d=False)
    if a.ndim > 1: a = a.mean(1)
    if sr != SR: a = np.interp(np.arange(0, len(a), sr / SR), np.arange(len(a)), a)
    place(vo, a, starts[s['id']] + s['head'])
env = np.convolve(np.abs(vo), np.ones(SR // 5) / (SR // 5), 'same')
bed *= 1 - 0.55 * np.minimum(1, env / 0.05)

# ---- the listen piece: a military-style signal on three notes (root, fifth, octave), rhythmic
L = [s for s in T if s['id'] == 'listen'][0]
L0 = starts['listen'] + L['head'] + L['voice'] + 0.8
R, F5, O = 233.08, 349.23, 466.16   # Bb3, F4, Bb4
q = 0.36
PHRASES = [
    [(R, 1), (R, 1), (F5, 3)],
    [(R, 1), (R, 1), (F5, 1), (R, 3)],
    [(F5, 1), (F5, 1), (O, 3), (F5, 1), (R, 3)],
    [(R, .5), (R, .5), (R, 1), (F5, 1), (O, 4)],
    [(R, 1), (F5, 1), (R, 1), (F5, 1), (O, 2), (F5, 1), (R, 4)],
    [(R, 1), (R, 1), (F5, 6)],
]
piece = np.zeros(int(SR * 26)); at = 0.2; MARKS = []
for ph in PHRASES:
    for f, beats in ph:
        d = beats * q
        place(piece, horn(f, d * 0.92, 0.42, bright=1.0 if f > R else 0.8), at)
        MARKS.append([round(L0 + at, 2), round(d * 0.92, 2), [R, F5, O].index(f)])
        at += d
    at += q * 2.2
piece = reverb(piece, 0.55)
place(bed, piece * 1.15, L0)
json.dump({'listen_music_start': L0, 'notes': MARKS, 'listen_scene_start': starts['listen']}, open(os.path.join(P, 'music_cue.json'), 'w'))

mix = reverb(bed, 0.22) + vo
fi = int(SR * 0.5); mix[:fi] *= np.linspace(0, 1, fi)
fo = int(SR * 2.5); mix[-fo:] *= np.linspace(1, 0, fo)
mix /= max(1e-9, np.max(np.abs(mix))) / 0.89
sf.write(os.path.join(P, 'mix.wav'), mix.astype(np.float32), SR)
subprocess.run(['ffmpeg', '-y', '-loglevel', 'error', '-i', os.path.join(P, 'mix.wav'), '-af', 'loudnorm=I=-14:TP=-1.5:LRA=11',
                '-ar', '48000', '-c:a', 'aac', '-b:a', '192k', os.path.join(P, 'mix.m4a')], check=True)
print('mix', round(TOTAL, 1), 's, piece ends', round(at, 1))
