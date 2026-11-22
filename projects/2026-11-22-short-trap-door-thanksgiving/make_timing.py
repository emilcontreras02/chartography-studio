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
seg = [s[1] for s in spk]
P = [
    ('fall', 'and i fall'), ('r1', 'round one'), ('cheaper', 'got cheaper this year'), ('o1', 'the turkey the cranberries'),
    ('o2', 'the cranberries'), ('o3', 'or the vegetray'), ('pick3', 'door three'), ('safe', 'safe'), ('down37', 'down three point seven'),
    ('afbf', 'american farm bureau'), ('turkey', 'the turkey up'), ('up10', 'up ten per cent'),
    ('r2', 'round two'), ('gas', 'a gallon of gas'), ('d1', 'a dime about'), ('d2', 'fifty seven cents or'), ('d3', 'two dollars'),
    ('pick1', 'a dime wrong'), ('wrong', 'wrong door'), ('more67', 'fifty seven cents more'), ('p375', 'three sixty six'), ('p308', 'three o nine'),
    ('noo', 'no final'), ('r3', 'final round'), ('pit', 'bottom of the pit'), ('travel', 'how many americans'), ('ans', 'eighty one and a half'),
    ('correct', 'correct'), ('fewer', 'tiny bit fewer'), ('records', 'three straight records'), ('cta', 'how many doors'), ('score', 'your score'),
]
cues = {kk: round(c.at(p), 3) for kk, p in P}
KEYS = {'cheaper', 'safe.', 'percent', 'percent,', 'percent.', 'wrong', 'cents', 'cents,', 'million!', 'correct.', 'records.', 'fall!', 'survive?', 'dime!'}
caps = []
for i, w in enumerate(cw):
    nxt = cw[i + 1][1] if i + 1 < len(cw) else dur
    caps.append([w[0], round(w[1], 3), round(min(nxt, w[1] + 1.4), 3), w[2], w[0].lower() in KEYS])
json.dump({'dur': round(dur, 3), 'seg': seg, 'segEnd': [s[2] for s in spk], 'cues': cues, 'caps': caps}, open(f'{HERE}/src/timing.json', 'w'), indent=1)
shutil.copy(f'{HERE}/vo.mp3', f'{HERE}/public/vo.mp3')
print(ce.sync_report(c, f'{HERE}/sync.json'))
print(json.dumps(cues), 'dur', round(dur, 2))
