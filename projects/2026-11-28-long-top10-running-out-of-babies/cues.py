"""Extra reveal cues for the Remotion Top 10 template (run after templates/remotion-top10/build.py): item values, twist lines, intro refs."""
import sys, os, json
H = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.join(H, '..', '..'))
import chartography_engine as ce
words = json.load(open(H + '/words.json')); dur = ce.duration(H + '/vo.mp3')
c = ce.Cues(words, dur)
spec = json.load(open(H + '/top10.json'))
tp = H + '/remotion/src/timing.json'; T = json.load(open(tp))
P = [('world', 'the world average'), ('usa', 'the united states about'),
     ('v10', 'one point one eight'), ('v9', 'one point one six seven'), ('v8', 'one point one four nine'), ('v7', 'spain one point one two'),
     ('v6', 'one point zero eight two'), ('v5', 'malta one point zero six'), ('v4', 'zero point nine nine nine'), ('v3', 'zero point nine seven seven'),
     ('v2', 'singapore zero point nine seven'), ('v1', 'zero point seventy one')]
P += [(f'tw{i}', l[1]) for i, l in enumerate(spec['twist']['lines'])]
P += [('rc', 'quick recap'), ('q', 'did any country'), ('follow', 'follow the money'), ('subscribe', 'subscribe to troutography'), ('monday', 'next monday')]
x = {k: round(c.at(p), 3) for k, p in P}
T['x'] = x
json.dump(T, open(tp, 'w'), indent=1)
print(ce.sync_report(c, H + '/sync.json'))
