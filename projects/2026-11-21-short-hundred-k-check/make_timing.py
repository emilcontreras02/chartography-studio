"""src/timing.json (cues + captions) for the Nov 21 cut Short; copies vo_short.mp3 into public/vo.mp3."""
import sys, os, json, shutil
HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.join(HERE, '..', '..'))
import chartography_engine as ce
ce.use_canvas('short')
import whatif_kit as k
segs = json.load(open(f'{HERE}/segments.json'))
words = json.load(open(f'{HERE}/words.json'))
dur = ce.duration(f'{HERE}/vo_short.mp3')
c = ce.Cues(words, dur)
cues = {
    'garage': c.at('that year its office was a garage'),
    'today': c.at("to day gugall's parent company"),
    'worth': c.at('three and a half trillion'),
    'x35': c.at('thirty five million times that first'),
    'hero': c.at('thirty five million times from a garage'),
    'twist': c.at('the twist'),
    'button': c.at('a button for a ride'),
    'kitchen': c.at('a faster kitchen'),
    'dvd': c.at('in an envelope'),
    'drink': c.at('five cent drink'),
    'small': c.at('started small and simple'),
    'eleven': c.at('eleven trillion dollars'),
}
cw = k.caption_words([(s[0], s[1]) for s in segs], words, dur)
KEYS = {'hundred', 'thousand', 'dollars,', 'garage.', 'trillion', 'million', 'garage?', 'twist.', 'eleven'}
caps = []
for i, w in enumerate(cw):
    nxt = cw[i + 1][1] if i + 1 < len(cw) else dur
    caps.append([w[0], round(w[1], 3), round(min(nxt, w[1] + 1.4), 3), w[2], w[0].lower() in KEYS])
json.dump({'dur': round(dur, 3), 'cues': cues, 'caps': caps}, open(f'{HERE}/src/timing.json', 'w'), indent=1)
shutil.copy(f'{HERE}/vo_short.mp3', f'{HERE}/public/vo.mp3')
print(ce.sync_report(c, f'{HERE}/sync.json'))
print(json.dumps(cues), 'dur', round(dur, 2))
