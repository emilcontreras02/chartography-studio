"""Voice each scene with the free studio narrator (Kokoro blend), then build timing + lip-sync data."""
import sys, os, json, subprocess
sys.path.insert(0, '/home/claude/chartography-studio')
import numpy as np, soundfile as sf
import chartography_engine as ce

P = os.path.dirname(os.path.abspath(__file__))
A = os.path.join(P, 'audio'); os.makedirs(A, exist_ok=True)
scenes = json.load(open(os.path.join(P, 'script.json')))
FPS = 30
HEAD, TAIL = 0.6, 0.9          # silence before/after each scene's voice
LISTEN_MUSIC = 34.0            # seconds of lyre after the "listen" narration
out = []
for s in scenes:
    mp3 = os.path.join(A, s['id'] + '.mp3')
    if not os.path.exists(mp3):
        ce.tts_free('\n\n'.join(s['paras']), mp3)
    d = ce.duration(mp3)
    words = ce.transcribe(mp3)
    # mouth envelope per frame
    wav = mp3 + '.env.wav'
    subprocess.run(['ffmpeg', '-y', '-loglevel', 'error', '-i', mp3, '-ac', '1', '-ar', '24000', wav], check=True)
    a, sr = sf.read(wav); os.remove(wav)
    hop = sr // FPS
    env = [float(np.sqrt(np.mean(a[i:i + hop] ** 2))) for i in range(0, len(a), hop)]
    m = max(env) or 1
    env = [round(min(1, e / m * 1.6), 2) for e in env]
    tail = LISTEN_MUSIC if s['id'] == 'listen' else TAIL
    total = HEAD + d + tail
    out.append(dict(id=s['id'], voice=d, head=HEAD, dur=round(total, 3), frames=int(round(total * FPS)),
                    words=[[w, round(t + HEAD, 3)] for w, t in words], env=env))
    print(s['id'], round(d, 1), 's')
json.dump(out, open(os.path.join(P, 'timing.json'), 'w'))
print('TOTAL', round(sum(o['dur'] for o in out), 1), 's')
