"""Builds src/timing.json (scene cues + word captions) from the VO files, and copies vo.mp3 into public/."""
import sys, os, json, shutil
HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.join(HERE, '..', '..'))
import chartography_engine as ce
ce.use_canvas('short')
import whatif_kit as k

segs = json.load(open(f'{HERE}/segments.json'))
words = json.load(open(f'{HERE}/words.json'))
spk = json.load(open(f'{HERE}/speakers.json'))
dur = ce.duration(f'{HERE}/vo.mp3')
c = ce.Cues(words, dur)
cw = k.caption_words([(s[0], s[1]) for s in segs], words, dur)
P = [
    ('share', 'family to share'), ('copy', 'one copy'), ('p7999', 'seventy nine ninety nine'), ('paying', 'only one paying'),
    ('nov19', 'november nineteenth'), ('b379', 'three point seven nine billion dollars'), ('takes', 'take two says'),
    ('withb', 'billion with a b'), ('m325', 'thirty two and a half'), ('cameout', 'even came out'),
    ('x47', 'four point seven times'), ('y2013', 'twenty thirteen'), ('m800', 'eight hundred million'),
    ('catch', "here's the catch"), ('spent', 'shoppers spent'), ('cut', 'take a cut'), ('less', 'keeps less'),
    ('split', 'eighty bucks'), ('dayone', 'buy it on day one'), ('sale', 'wait for a'), ('comments', 'tell us in the'),
]
cues = {kk: round(c.at(p), 3) for kk, p in P}
KEYS = {'copy.', 'billion', 'billion.', 'b.', 'million', 'times', 'catch.', 'cut,', 'less.', 'split', 'sale?'}
caps = []
for i, w in enumerate(cw):
    nxt = cw[i + 1][1] if i + 1 < len(cw) else dur
    caps.append([w[0], round(w[1], 3), round(min(nxt, w[1] + 1.4), 3), w[2], w[0].lower() in KEYS])
json.dump({'dur': round(dur, 3), 'seg': [s[1] for s in spk], 'segEnd': [s[2] for s in spk], 'cues': cues, 'caps': caps}, open(f'{HERE}/src/timing.json', 'w'), indent=1)
shutil.copy(f'{HERE}/vo.mp3', f'{HERE}/public/vo.mp3')
print(ce.sync_report(c, f'{HERE}/sync.json'))
print(json.dumps(cues), 'dur', round(dur, 2))
