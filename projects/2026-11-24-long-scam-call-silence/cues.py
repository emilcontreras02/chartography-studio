"""Timing for the Remotion build: segment starts, word captions and reveal cues (phrases as the transcriber heard them), in script order."""
import sys, os, json
H = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.join(H, '..', '..'))
import chartography_engine as ce
ce.use_canvas('long')
import whatif_kit as k
P = [
 ('ring', 'your phone rings'), ('unknown', "a number you don't know"), ('pick', 'you pick up'), ('hello0', 'you say hello'), ('one', 'one second'), ('two0', 'second two'), ('three0', 'two three'), ('click0', 'then a click'), ('dead', 'line goes dead'),
 ('who', 'wait who was that'),
 ('nobody', 'maybe nobody'), ('filter', "it's the filter"), ('record', 'sits a record'), ('b159', 'fifteen point nine billion'), ('day', 'forty three point six'), ('follow', 'we follow one call'), ('empty', 'the empty bank account'), ('small', 'far too small'),
 ('ch1', 'chapter one the silent'), ('ruth', 'meet ruth'), ('madeup', "she's made up"), ('package', 'holiday package'), ('keeps', 'phone keeps ringing'), ('h1', 'same thing hello'), ('sil1', 'hello silence'), ('clk1', 'silence click'),
 ('dinner', 'come at dinner'), ('show', 'favorite show'), ('area', 'own area code'), ('driver', 'delivery driver'), ('grandson', 'her grandson'),
 ('usually', "here's what that silence"), ('dialer', 'predictive daler'), ('several', 'calls several people'), ('free', 'who is free whoever'), ('first', 'picks up first'), ('hung', 'hung up on'), ('waiting', 'left waiting in silence'),
 ('ch2', 'chapter two the machine'), ('rules', 'there are rules'), ('tsr', 'telemarketing sales rule'), ('abandoned', 'counts as abandoned'), ('twosec', 'within two seconds'), ('pct3', 'three per cent'), ('rings', 'fifteen seconds or four'), ('msg', 'play a message'),
 ('breaks', 'breaks the rules'),
 ('realbiz', 'for a real business'), ('dontfollow', "scammers don't follow"), ('sorting', 'a sorting machine'), ('experts', 'some security experts'), ('live', 'number is alive'), ('prove', 'nobody can prove'), ('data', 'what happens next to a lot'),
 ('ch3', 'chapter three the second'), ('text3', 'ruth gets a text'), ('call3', 'then a call'), ('bankvoice', "her bank's fraud"), ('fast', 'act fast'), ('trick', 'most common trick'), ('nine', 'nine years in a row'), ('million1', 'one million impostor'), ('b35', 'three and a half billion'), ('onein3', 'nearly one and three'),
 ('sub1', 'hit subscribe'),
 ('costliest', 'costliest scams often'), ('biz', 'business impersonators'), ('bankimp', 'bank impersonators were'), ('gov', 'government impersonators took'), ('m920', 'nine hundred twenty million'), ('p40', 'jumped forty per cent'), ('tolls', 'unpaid tolls'), ('texts', 'text messages were'),
 ('ch4', 'chapter four moving'), ('savings', "savings aren't safe"), ('donthang', "don't hang up"), ('branch', 'at the branch'), ('shaking', 'hands are shaking'), ('leaves', 'money actually leaves'), ('paymeth', 'payment methods with'), ('bankpay', 'bank payments'), ('crypto', 'then crypto'),
 ('biggest', "biggest losses didn't"), ('invest', 'investment scams more'), ('b79', 'seven point nine billion'), ('half', 'about half of everything'), ('avg', 'average victim'), ('k10', 'ten thousand'), ('contact', 'contact method with the highest'), ('social', 'social media'), ('b2', 'two billion dollars'),
 ('door', 'just the door'),
 ('pretty', 'pretty much'), ('checks', 'cheques who picks up'), ('builds', 'builds the story'), ('transfer', 'transfer is where'),
 ('ch5', 'chapter five'), ('reports3', 'three million fraud'), ('lost159', 'dollars lost'), ('p25', 'twenty five per cent more'), ('m26', 'two point six million'), ('b12', 'more than twelve billion'), ('everyyear', 'every year for six'),
 ('b6', 'more than six billion'), ('b9', 'about nine billion'), ('b10', 'more than ten billion'), ('since2020', 'since twenty twenty'), ('p430', 'four hundred thirty'), ('k100', 'a hundred thousand dollars'),
 ('twist', "here's the twist"), ('onlypart', 'only the part people'), ('p48', 'four point eight'), ('bbb', 'better business bureau'), ('estimate', 'estimate the real cost'), ('b1959', 'one hundred ninety five point nine'),
 ('tentimes', 'more than ten times'),
 ('ch6', 'chapter six never'), ('back', 'back to that silent'), ('tooknothing', 'took nothing from ruth'), ('later', 'lost later'), ('nevercamp', 'called never ever'), ('alerts', 'new alerts about'), ('grandkid', 'grand kid scams'), ('search', 'holiday search results'),
 ('rep', 'dollars reported may'), ('unrep', 'far more unreported'), ('threewords', 'three little words'), ('hello9', 'hello any one there'),
 ('q', 'your turn have you'), ('comments', 'tell us in the comments'),
 ('followmoney', 'follow the money'),
 ('subscribe', 'subscribe to tertography'), ('tomorrow', 'what if the world'), ('daybyday', 'day by day see'),
]
if __name__ == '__main__':
    segs = json.load(open(H + '/segments.json')); words = json.load(open(H + '/words.json')); spk = json.load(open(H + '/speakers.json'))
    dur = ce.duration(H + '/vo.mp3')
    c = ce.Cues(words, dur)
    x = {kk: round(c.at(p), 3) for kk, p in P}
    cw = k.caption_words([(s[0], s[1]) for s in segs], words, dur)
    caps = []
    for i, w in enumerate(cw):
        nxt = cw[i + 1][1] if i + 1 < len(cw) else dur
        caps.append([w[0], round(w[1], 3), round(min(nxt, w[1] + 1.4), 3), w[2]])
    t = {'dur': round(dur, 3), 'seg': [s[1] for s in spk], 'segEnd': [s[2] for s in spk], 'who': [s[0] for s in spk], 'caps': caps, 'x': x}
    os.makedirs(H + '/remotion/src', exist_ok=True)
    json.dump(t, open(H + '/remotion/src/timing.json', 'w'), indent=1)
    print(ce.sync_report(c, H + '/sync.json'))
