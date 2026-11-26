"""Key every on-screen reveal to the moment its words are spoken. Writes rm/src/cues.json (scene-local seconds)."""
import json, os, re
P = os.path.dirname(os.path.abspath(__file__))
T = {s['id']: s for s in json.load(open(os.path.join(P, 'timing.json')))}

CUES = {
 'hook': {'age': 'three thousand', 'buried': 'buried', 'oldest': 'oldest song', 'poem': 'not a poem', 'painting': 'not a painting',
          'actual': 'an actual song', 'words': 'the words', 'q1': 'how did it survive', 'q2': 'who wrote it', 'q3': 'what did it',
          'stick': 'stick around', 'hear': 'going to hear'},
 'intro': {'name': 'sound chronicles', 'tag': 'the story'},
 'farmer': {'year': 'story starts', 'farmer': 'a farmer', 'hill': 'little hill', 'clunk': 'hits a stone', 'tomb': 'ancient tomb',
            'arch': 'archaeologists', 'bigger': 'much bigger', 'city': 'lost city', 'name': 'its name'},
 'city': {'busy': 'busiest', 'egypt': 'egypt', 'cyprus': 'cyprus', 'hittite': 'hittite', 'tin': 'tin', 'fish': 'tinfish', 'pottery': 'pottery',
          'timber': 'timber', 'clay': 'on clay', 'cune': 'cunny', 'reed': 'with a reed'},
 'fire': {'year': 'around', 'drought': 'drought', 'famine': 'famine', 'raiders': 'raiders', 'letters': 'letters', 'burned': 'burned',
          'twist': 'the twist', 'rain': 'in the rain', 'mud': 'into mud', 'baked': 'baked', 'kiln': 'kiln', 'disaster': 'the disaster',
          'read': 'still read'},
 'dig': {'year': 'fast forward', 'palace': 'royal palace', 'pieces': 'pieces of clay', 'hymns': 'thirty six', 'broken': 'broken beyond',
         'except': 'except one', 'three': 'three fragments', 'name': 'boring name', 'h6': 'number six'},
 'tablet': {'top': 'across the top', 'hurrian': 'the language', 'double': 'double line', 'music': 'the music', 'notnotes': 'not notes',
            'pairs': 'pairs of strings', 'number': 'followed by', 'like': 'something like', 'tab': 'guitar tab', 'bottom': 'very bottom',
            'name': 'his name', 'tuning': 'which tuning'},
 'lyre': {'nine': 'nine stringed', 'frame': 'wooden frame', 'pluck': 'you pluck', 'singer': 'the singer', 'pairs': 'pairs of strings'},
 'nikkal': {'who': 'so who', 'goddess': 'goddess named', 'orchards': 'orchards', 'moon': 'moon god', 'offer': 'offerings',
            'love': 'love song', 'prayer': 'a prayer', 'honest': 'honestly', 'gaps': 'gaps', 'flakes': 'flakes'},
 'time': {'persp': 'perspective', 'written': 'when this song', 'pyr': 'pyramids', 'thousand': 'more than a thousand', 'greece': 'about a thousand',
          'seik': 'epitaph', 'between': 'between that', 'gen': 'hundred generations'},
 'mystery': {'catch': 'the catch', 'fifty': 'fifty years', 'seventies': 'nineteen seventies', 'kilmer': 'at berkeley', 'tuning': 'describe tuning',
             'perf': 'seventy four', 'five': 'five different', 'diff': 'completely different', 'upside': 'upside down', 'lowest': 'the lowest',
             'numbers': 'those numbers', 'times': 'three times', 'beats': 'three beats', 'nobody': 'nobody knows'},
 'listen': {'take': 'our own take', 'tribute': 'a tribute', 'lyre': 'nine string', 'scale': 'seven note', 'pairs': 'pairs of strings',
            'close': 'close your eyes', 'palace': 'a palace', 'listen': 'and listen'},
 'outro': {'empires': 'empires', 'burned': 'city burned', 'lang': 'the language', 'survived': 'song survived', 'someone': 'thirty four',
           'older': 'older than', 'cities': 'older than cities', 'people': 'as old as', 'channel': 'chasing', 'next': 'next time',
           'trumpets': 'two trumpets', 'war': 'war follows', 'sub': 'subscribe', 'mj': 'i am'},
}

def norm(w): return re.sub(r"[^a-z']", '', w.lower())
out, bad = {}, []
for sid, cs in CUES.items():
    words = [[norm(w), t] for w, t in T[sid]['words']]
    out[sid] = {}
    last = 0
    for k, ph in cs.items():
        p = [norm(x) for x in ph.split()]
        hit = None
        for i in range(len(words) - len(p) + 1):
            if all(words[i + j][0].startswith(p[j]) or p[j].startswith(words[i + j][0]) and len(words[i+j][0]) > 2 for j in range(len(p))) and words[i][1] >= last - 0.01:
                hit = words[i][1]; break
        if hit is None:
            bad.append((sid, k, ph)); hit = last + 1.0
        out[sid][k] = round(hit, 2); last = hit
json.dump(out, open(os.path.join(P, 'rm', 'src', 'cues.json'), 'w'), indent=0)
print('missing:', bad)
