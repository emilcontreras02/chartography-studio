"""Chartography Top 10 long-form in Remotion (Nov 19, 2026).

    python3 templates/remotion-top10/build.py projects/<slug>        # writes <slug>/remotion/ ready to render
    cd projects/<slug>/remotion && npx remotion render src/index.ts Top10 out/final.mp4 --crf=18 --browser-executable=$HS
    npx remotion still src/index.ts Thumb out/thumb.png --browser-executable=$HS

The project folder needs: segments.json (hero/narr lines), speakers.json + words.json + vo.mp3 (from voice_build.py)
and top10.json (the content spec; see templates/remotion-top10/example.top10.json).
"""
import sys, os, json, shutil, subprocess
TPL = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.abspath(os.path.join(TPL, '..', '..'))
sys.path.insert(0, ROOT)
import chartography_engine as ce
ce.use_canvas('long')
import whatif_kit as k


def build(proj):
    proj = os.path.abspath(proj)
    out = os.path.join(proj, 'remotion')
    os.makedirs(out, exist_ok=True)
    for f in ('package.json', 'package-lock.json', '.gitignore'):
        shutil.copy(os.path.join(TPL, f), out)
    shutil.copytree(os.path.join(TPL, 'src'), os.path.join(out, 'src'), dirs_exist_ok=True)
    shutil.copytree(os.path.join(TPL, 'public'), os.path.join(out, 'public'), dirs_exist_ok=True)
    shutil.copy(os.path.join(proj, 'vo.mp3'), os.path.join(out, 'public', 'vo.mp3'))
    spec = json.load(open(os.path.join(proj, 'top10.json')))
    segs = json.load(open(os.path.join(proj, 'segments.json')))
    words = json.load(open(os.path.join(proj, 'words.json')))
    spk = json.load(open(os.path.join(proj, 'speakers.json')))
    dur = ce.duration(os.path.join(proj, 'vo.mp3'))
    cw = k.caption_words([(s[0], s[1]) for s in segs], words, dur)
    caps = []
    for i, w in enumerate(cw):
        nxt = cw[i + 1][1] if i + 1 < len(cw) else dur
        caps.append([w[0], round(w[1], 3), round(min(nxt, w[1] + 1.4), 3), w[2]])
    timing = {'dur': round(dur, 3), 'seg': [s[1] for s in spk], 'segEnd': [s[2] for s in spk], 'who': [s[0] for s in spk], 'caps': caps}
    # optional cue phrases inside the spec ("cue": "phrase") -> seconds
    c = ce.Cues(words, dur)
    cues = {}
    for it in spec.get('items', []):
        if it.get('cue'):
            cues[f"item{it['rank']}"] = c.at(it['cue'], after=timing['seg'][it['seg']] - 0.5)
    timing['cues'] = cues
    json.dump(spec, open(os.path.join(out, 'src', 'data.json'), 'w'), indent=1)
    json.dump(timing, open(os.path.join(out, 'src', 'timing.json'), 'w'), indent=1)
    if not os.path.isdir(os.path.join(out, 'node_modules')):
        subprocess.run(['npm', 'ci', '--ignore-scripts', '--no-fund', '--no-audit'], cwd=out, check=True)
    print('ready:', out, '| duration', round(dur, 1), 's')


if __name__ == '__main__':
    build(sys.argv[1])
