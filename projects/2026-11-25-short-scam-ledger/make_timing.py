"""src/timing.json for the cut Short (words from the Nov 24 scam-call long-form cut); copies vo_short.mp3 into public/vo.mp3."""
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
P = [('rep', 'three million fraud'), ('b159', 'fifteen point nine billion'), ('lost', 'dollars lost'), ('p25', 'twenty five per cent more'), ('y24', 'than twenty twenty four'),
     ('m26', 'two point six million'), ('b12', 'more than twelve billion'), ('every', 'every year for six'), ('b6', 'more than six billion'), ('b9', 'about nine billion'),
     ('b10', 'more than ten billion'), ('since', 'since twenty twenty'), ('p430', 'four hundred thirty'), ('ftc', 'says a big driver'), ('k100', 'a hundred thousand dollars')]
cues = {kk: round(c.at(p), 3) for kk, p in P}
KEYS = {'lost.', 'percent.', 'billion.', 'more.'}
caps = []
for i, w in enumerate(cw):
    nxt = cw[i + 1][1] if i + 1 < len(cw) else dur
    caps.append([w[0], round(w[1], 3), round(min(nxt, w[1] + 1.4), 3), w[2], w[0].lower() in KEYS])
json.dump({'dur': round(dur, 3), 'cues': cues, 'caps': caps}, open(f'{HERE}/src/timing.json', 'w'), indent=1)
shutil.copy(f'{HERE}/vo_short.mp3', f'{HERE}/public/vo.mp3')
print(ce.sync_report(c, f'{HERE}/sync.json')); print(cues)
