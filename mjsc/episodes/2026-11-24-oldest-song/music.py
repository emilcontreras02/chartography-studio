"""Synthesize all music/sfx (no samples, no copyrighted recordings) and mix the final soundtrack."""
import json, os, subprocess
import numpy as np, soundfile as sf

P = os.path.dirname(os.path.abspath(__file__))
SR = 44100
T = json.load(open(os.path.join(P, 'timing.json')))
starts, t = {}, 0.0
for s in T:
    starts[s['id']] = t; t += s['dur']
TOTAL = t
rng = np.random.default_rng(7)

def pluck(freq, dur=3.2, bright=0.5, amp=0.5):
    """Karplus-Strong string with a little body resonance: a gut-string lyre."""
    n = int(SR * dur); N = int(SR / freq)
    buf = rng.uniform(-1, 1, N)
    # soften attack (finger, not pick)
    for _ in range(int(3 - bright * 2)):
        buf = 0.5 * (buf + np.roll(buf, 1))
    out = np.zeros(n); decay = 0.996 - (1 - bright) * 0.002
    idx = 0
    for i in range(n):
        v = buf[idx]; nxt = buf[(idx + 1) % N]
        buf[idx] = decay * 0.5 * (v + nxt)
        out[i] = v; idx = (idx + 1) % N
    env = np.minimum(1, np.arange(n) / (SR * 0.004))
    out *= env * amp
    # simple wooden body: short comb resonance
    d = int(SR * 0.0031)
    body = out.copy(); body[d:] += 0.35 * out[:-d]
    return body

def place(track, sig, at):
    i = int(at * SR); j = min(len(track), i + len(sig))
    if i < len(track): track[i:j] += sig[:j - i]

# ---- the lyre: 9 strings, ancient-sounding diatonic (E phrygian-ish), low to high
STR = [164.81, 174.61, 196.00, 220.00, 246.94, 261.63, 293.66, 329.63, 349.23]   # E3 F3 G3 A3 B3 C4 D4 E4 F4
cache = {}
def S(k, amp=0.45, dur=3.6):
    key = (k, amp, dur)
    if key not in cache: cache[key] = pluck(STR[k - 1], dur=dur, amp=amp)
    return cache[key]

def dyad(track, at, a, b, amp=0.45, roll=0.06):
    place(track, S(a, amp), at); place(track, S(b, amp * 0.85), at + roll)

# ---- "listen" piece: string pairs with repeat counts, like the tablet's pair + number layout
PIECE = [((3, 7), 3), ((2, 6), 1), ((3, 7), 3), ((1, 5), 1), ((4, 8), 2), ((5, 9), 1), ((4, 8), 1), ((3, 7), 2),
         ((2, 6), 2), ((1, 5), 2), ((3, 6), 1), ((4, 7), 2), ((3, 7), 3), ((1, 5), 1), ((2, 4), 1), ((1, 5), 3)]
def lyre_piece(seconds):
    tr = np.zeros(int(SR * (seconds + 4)))
    beat = 60 / 66; at = 0.4
    for (a, b), n in PIECE:
        for r in range(n):
            dyad(tr, at, a, b, amp=0.42 + 0.06 * (r == 0))
            at += beat
        at += beat * 0.35
        if at > seconds - 3: break
    # final open ring
    dyad(tr, at + 0.2, 1, 8, amp=0.5, roll=0.12); place(tr, S(5, 0.35, 5.0), at + 0.45)
    return tr, at + 4

def reverb(x, wet=0.28):
    out = x.copy()
    for d, g in ((0.029, .5), (0.043, .42), (0.061, .36), (0.089, .3), (0.131, .22), (0.197, .16), (0.283, .1)):
        k = int(SR * d); out[k:] += g * wet * x[:-k] * 2
    return out

# ---- ambient bed: soft drone on E with slow movement, plus occasional distant lyre notes
n = int(SR * TOTAL); tt = np.arange(n) / SR
drone = np.zeros(n)
for f, a in ((82.41, .5), (123.47, .3), (164.81, .22), (246.94, .08)):
    lfo = 1 + 0.25 * np.sin(2 * np.pi * 0.05 * tt + f)
    drone += a * lfo * np.sin(2 * np.pi * f * tt + 0.3 * np.sin(2 * np.pi * 0.11 * tt))
drone *= 0.06
bed = drone.copy()
# sparse plucks every few seconds through the bed (not during the listen piece)
at = 1.0
pat = [5, 7, 8, 7, 5, 3, 4, 5]
k = 0
while at < TOTAL - 4:
    if not (starts['listen'] - 2 < at < starts['outro'] + 1):
        place(bed, S(pat[k % len(pat)], 0.09, 3.0), at)
    at += 2.4 + (k % 3) * 0.8; k += 1
# fire scene: crackle + low rumble
fs = starts['fire']; fd = [s for s in T if s['id'] == 'fire'][0]['dur']
i0, i1 = int(fs * SR), int((fs + fd) * SR)
seg = i1 - i0
noise = rng.normal(0, 1, seg)
crack = (rng.random(seg) > 0.9993) * rng.uniform(0.3, 1, seg)
crack = np.convolve(crack, np.exp(-np.arange(300) / 40), 'same')
rumble = np.convolve(noise, np.ones(400) / 400, 'same') * 2.2
fade = np.minimum(1, np.minimum(np.arange(seg), seg - np.arange(seg)) / (SR * 2))
bed[i0:i1] += (crack * 0.25 + rumble * 0.25) * fade * np.r_[np.ones(int(seg * 0.55)), np.linspace(1, 0.2, seg - int(seg * 0.55))]

# ---- narration track + ducking
vo = np.zeros(n)
for s in T:
    a, sr = sf.read(os.path.join(P, 'audio', s['id'] + '.mp3'), always_2d=False)
    if a.ndim > 1: a = a.mean(1)
    if sr != SR:
        a = np.interp(np.arange(0, len(a), sr / SR), np.arange(len(a)), a)
    place(vo, a, starts[s['id']] + s['head'])
env = np.abs(vo)
env = np.convolve(env, np.ones(SR // 5) / (SR // 5), 'same')
duck = 1 - 0.55 * np.minimum(1, env / 0.05)
bed *= duck

# ---- listen piece placed right after the listen narration
L = [s for s in T if s['id'] == 'listen'][0]
piece, plen = lyre_piece(31.5)
place(bed, piece * 1.1, starts['listen'] + L['head'] + L['voice'] + 0.8)
json.dump({'listen_music_start': starts['listen'] + L['head'] + L['voice'] + 0.8}, open(os.path.join(P, 'music_cue.json'), 'w'))

mix = reverb(bed) + vo
# fade in/out
fi = int(SR * 0.5); mix[:fi] *= np.linspace(0, 1, fi)
fo = int(SR * 2.5); mix[-fo:] *= np.linspace(1, 0, fo)
mix /= max(1e-9, np.max(np.abs(mix))) / 0.89
sf.write(os.path.join(P, 'mix.wav'), mix.astype(np.float32), SR)
subprocess.run(['ffmpeg', '-y', '-loglevel', 'error', '-i', os.path.join(P, 'mix.wav'), '-af', 'loudnorm=I=-14:TP=-1.5:LRA=11',
                '-ar', '48000', '-c:a', 'aac', '-b:a', '192k', os.path.join(P, 'mix.m4a')], check=True)
print('mix', round(TOTAL, 1), 's')
