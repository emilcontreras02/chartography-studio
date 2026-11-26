"""Key every on-screen reveal to the moment its words are spoken. Writes rm/src/cues.json (scene-local seconds)."""
import json, os, re
P = os.path.dirname(os.path.abspath(__file__))
T = {s['id']: s for s in json.load(open(os.path.join(P, 'timing.json')))}

CUES = {
 'hook': {'year': 'april', 'million': 'fifty', 'heard': 'nobody had', 'trumpets': 'two trumpets', 'tomb': 'taken from', 'king': 'boy king',
          'less': 'less than', 'ww2': 'second world', 'whisper': 'whispered', 'every': 'every time', 'follows': 'war follows',
          'curse': 'curse', 'coinc': 'coincidence', 'stick': 'stick around', 'hear': 'going to hear'},
 'intro': {'name': 'sound chronicles', 'tag': 'the story'},
 'tomb': {'year': 'november', 'valley': 'valley', 'carter': 'howard carter', 'nothing': 'almost nothing', 'step': 'a step', 'another': 'then another',
          'door': 'sealed door', 'hole': 'small hole', 'candle': 'a candle', 'asks': 'can you see', 'yes': 'yes', 'wonderful': 'wonderful',
          'tut': 'it was the tomb', 'untouched': 'untouched', 'objects': 'five thousand', 'gold': 'gold', 'mask': 'golden mask', 'trumpets': 'two trumpets'},
 'trumpets': {'silver': 'silver', 'bronze': 'bronze', 'arm': 'longer than', 'core': 'wooden core', 'names': 'engraved', 'gods': 'with gods',
              'party': 'party', 'paint': 'wall paintings', 'soldiers': 'soldiers', 'signals': 'signals', 'army': 'an army', 'war': 'instruments of war'},
 'broadcast': {'year': 'fast forward', 'bbc': 'b b c', 'world': 'whole world', 'permission': 'permission', 'keating': 'rex keating', 'tappern': 'james',
               'wrong': 'going wrong', 'shatter': 'shatters', 'car': 'his car', 'horse': 'runaway', 'power': 'power', 'candle': 'candle',
               'date': 'sixteenth', 'waves': 'air waves'},
 'war': {'letters': 'letters', 'same': 'same thing', 'trumpets': 'war trumpets', 'curse': 'released', 'sept': 'first of september',
         'poland': 'invades', 'begins': 'begins', 'deadliest': 'deadliest'},
 'pattern': {'curator': 'curator', 'hala': 'hasan', 'powers': 'magical', 'blows': 'whenever', 'y67': 'sixty seven', 'six': 'day war',
             'y91': 'ninety one', 'gulf': 'gulf', 'y11': 'and then', 'staff': 'staff member', 'photo': 'photographed', 'week': 'one week', 'rev': 'revolution'},
 'heist': {'weird': 'weirder', 'date': 'twenty eighth', 'thieves': 'thieves', 'museum': 'egyptian museum', 'checked': 'checked', 'missing': 'missing',
           'bronze': 'bronze', 'gone': 'gone', 'weeks': 'weeks later', 'vault': 'vault', 'market': 'black market', 'bag': 'a bag', 'metro': 'metro',
           'nobody': 'nobody'},
 'truth': {'q': 'really cursed', 'honest': 'honest', 'europe': 'europe', 'czech': 'taken over', 'coming': 'war was coming', 'century': 'twentieth',
           'any': 'pick any', 'egypt': 'egyptologists', 'love': 'part i love', 'announce': 'announce', 'story': 'still the story', 'job': 'doing their'},
 'listen': {'real': 'real one', 'case': 'just in case', 'take': 'our own take', 'horn': 'bright horn', 'notes': 'few notes', 'rhythm': 'rhythm',
            'army': 'army signal', 'turn': 'turn it up', 'listen': 'and listen'},
 'outro': {'two': 'two trumpets', 'silence': 'silence', 'radio': 'radio broadcast', 'legend': 'legend', 'think': 'what do you think', 'curse': 'curse',
           'comments': 'comments', 'sub': 'subscribe', 'next': 'next time', 'song': 'a song', 'years': 'seventeen', 'mj': 'this is m', 'end': 'see you'},
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
