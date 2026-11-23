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
cues = {
    'jump30': c.at('jumped about thirty'),
    'back': c.at('is back'),
    'nov12': c.at('november twelfth'),
    'noreason': c.at('gave no reason'),
    'kress': c.at('stepped in'),
    'fell7': c.at('seven trading days'),
    'twist': seg[3] + 1.2,
    'unanimous': c.at('voted unanimously'),
    'bell': c.at('opening bell'),
    'pct32': c.at('thirty two'),
    'p165': c.at('one sixty five'),
    'committee': c.at('independent committee'),
    'foreign': c.at('foreign intelligence'),
    'cta': seg[6],
}
KEYS = {'thirty', 'back.', 'resigned', 'no', 'reason.', 'seven', 'twist.', 'unanimously', 'thirty-two', 'percent,', 'committee', 'comments.'}
caps = []
for i, w in enumerate(cw):
    nxt = cw[i + 1][1] if i + 1 < len(cw) else dur
    caps.append([w[0], round(w[1], 3), round(min(nxt, w[1] + 1.4), 3), w[2], w[0].lower() in KEYS])
json.dump({'dur': round(dur, 3), 'seg': seg, 'segEnd': [s[2] for s in spk], 'cues': cues, 'caps': caps}, open(f'{HERE}/src/timing.json', 'w'), indent=1)
shutil.copy(f'{HERE}/vo.mp3', f'{HERE}/public/vo.mp3')
print(json.dumps(cues), 'dur', round(dur, 2))
