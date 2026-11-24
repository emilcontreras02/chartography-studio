"""src/timing.json for the cut Short (words from the Nov 25 US-debt long-form cut (China stretch)); copies vo_short.mp3 into public/vo.mp3."""
import sys, os, json, shutil
HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.join(HERE, '..', '..'))
import chartography_engine as ce
ce.use_canvas('short')
import whatif_kit as k
words = json.load(open(f'{HERE}/words.json'))
dur = ce.duration(f'{HERE}/vo_short.mp3')
c = ce.Cues(words, dur)
txt = open(f'{HERE}/narration.txt').read().strip()
cw = k.caption_words([('narr', txt)], words, dur)
P = [('b564', 'five hundred sixty four billion'), ('least', 'the least since'), ('y2008', 'two thousand eight'), ('sept', 'in september alone'), ('pct', 'four and a half per cent'), ('b591', 'five hundred ninety one billion'), ('fourth', 'fourth monthly drop'), ('japan', 'and japan the biggest'), ('five', 'five months straight'), ('peak', 'down from a peak'), ('t13', 'one point three trillion'), ('nov21', 'november twenty twenty one'), ('two', 'of america\'s biggest lenders'), ('away', 'quietly backing away')]
cues = {kk: round(c.at(p), 3) for kk, p in P}
KEYS = {'2008.', 'percent,', 'billion.', 'row.', 'straight,', 'away.'}
caps = []
for i, w in enumerate(cw):
    nxt = cw[i + 1][1] if i + 1 < len(cw) else dur
    caps.append([w[0], round(w[1], 3), round(min(nxt, w[1] + 1.4), 3), w[2], w[0].lower() in KEYS])
json.dump({'dur': round(dur, 3), 'cues': cues, 'caps': caps}, open(f'{HERE}/src/timing.json', 'w'), indent=1)
shutil.copy(f'{HERE}/vo_short.mp3', f'{HERE}/public/vo.mp3')
print(ce.sync_report(c, f'{HERE}/sync.json')); print(cues)
