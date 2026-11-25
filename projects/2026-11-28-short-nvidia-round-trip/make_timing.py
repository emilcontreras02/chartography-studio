"""Builds src/timing.json (cues + word captions) for the CUT Short, and copies vo.mp3 into public/."""
import sys, os, json, shutil
HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.join(HERE, '..', '..'))
import chartography_engine as ce
ce.use_canvas('short')
import whatif_kit as k
segs = json.load(open(f'{HERE}/segments.json'))
words = json.load(open(f'{HERE}/words.json'))
dur = ce.duration(f'{HERE}/vo.mp3')
c = ce.Cues(words, dur)
cw = k.caption_words([(s[0], s[1]) for s in segs], words, dur)
P = [('gone', 'gone in seven trading days'), ('back', 'close to a trillion back'), ('estimate', 'both by our estimate'),
     ('twist', 'here is the twist'), ('below', 'about five per cent below'), ('nightbefore', 'the night before'), ('nextday', 'the next day it slipped'),
     ('p586', 'five point eight six'), ('best', 'the best quarter'), ('gonef', 'its founder was gone'), ('sold', 'investors sold anyway'),
     ('onepr', 'then one press release'), ('b115', 'one hundred fifteen billion'), ('couldnot', 'sales could not')]
cues = {kk: round(c.at(p), 3) for kk, p in P}
KEYS = {'trillion', 'days.', 'back,', 'twist.', 'percent', 'gone.', 'anyway.', 'not.'}
caps = []
for i, w in enumerate(cw):
    nxt = cw[i + 1][1] if i + 1 < len(cw) else dur
    caps.append([w[0], round(w[1], 3), round(min(nxt, w[1] + 1.4), 3), w[2], w[0].lower() in KEYS])
json.dump({'dur': round(dur - 0.45, 3), 'cues': cues, 'caps': caps}, open(f'{HERE}/src/timing.json', 'w'), indent=1)
shutil.copy(f'{HERE}/vo.mp3', f'{HERE}/public/vo.mp3')
print(ce.sync_report(c, f'{HERE}/sync.json'))
print(json.dumps(cues), 'dur', round(dur, 2))
