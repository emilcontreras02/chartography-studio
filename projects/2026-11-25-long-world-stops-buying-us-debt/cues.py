"""Timing for the Remotion build (Nov 25 US-debt day-by-day story): segment starts, word captions and reveal cues (phrases as the transcriber heard them), in script order."""
import sys, os, json
H = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.join(H, '..', '..'))
import chartography_engine as ce
ce.use_canvas('long')
import whatif_kit as k
P = [
 ('day1', 'day one a scenario'), ('wash', 'somewhere in washington'), ('auction', 'opens an auction'), ('borrow', 'needs to borrow'), ('overseas', 'from overseas'), ('wait0', 'wait nobody wants'),
 ('real', "here's what's real"), ('t92', 'nine point two trillion'), ('china0', 'china just cut'), ('since08', 'lowest level since'), ('daybyday', 'what would happen day by day'), ('everynum', "every number you'll see"), ('marked', 'every scene marked'), ('scariest', 'the scariest part'),
 ('ch1', 'chapter one the pile'), ('t407', 'forty point seven trillion'), ('t329', 'thirty two point nine'), ('public', 'held by the public'), ('t78', 'seven point eight trillion'), ('trust', 'trust funds like'), ('cbo', 'the congressional budget'), ('p100', 'one hundred per cent of the whole'), ('y1946', 'highest since nineteen forty six'),
 ('hero100', 'a hundred per cent of everything'),
 ('ch2', 'chapter two the empty'), ('thin', 'foreign bids are thin'), ('list', 'has the list'), ('japan', 'japan about one point'), ('uk', 'the united kingdom about'), ('china2', 'china about five hundred'), ('belgium', 'then belgium the cayman'), ('range', 'four hundred fifty to five'),
 ('custody', 'held in custody'), ('owns', 'who really owns them'), ('official', 'foreign governments and central'), ('t367', 'three point six seven'), ('private', 'private investors abroad'),
 ('day2', 'day too of our'), ('headlines', 'the headlines spread'), ('gap', 'who fills the gap'), ('twistq', 'the answer is the twist'),
 ('ch3', 'chapter three china'), ('day7', 'day seven is when'), ('onthemove', 'already on the move'), ('b564', 'china now holds about'), ('least08', 'the least since'), ('p45', 'four and a half per cent'), ('b591', 'five hundred ninety one'), ('fourth', 'fourth monthly drop'), ('japan5', 'has cut for five months'), ('peak', 'a peak of about'), ('backing', 'quietly backing away'),
 ('leaving', 'the world really is leaving'),
 ('notsofast', 'not so fast'), ('b808', 'eighty point eight billion'), ('t924', 'nine point two four'), ('yearago', 'higher than a year earlier'), ('record', 'the record of about'), ('sellbuy', 'others are buying'), ('b261', 'two hundred sixty one billion'),
 ('sub1', 'surprised you it subscribe'),
 ('ch4', 'chapter four rates'), ('day14', 'day fourteen'), ('betterdeal', 'better deal to borrow'), ('yield', 'higher interest rate or yield'), ('kitchen', 'kitchen table'), ('mortgage10', 'mortgage rates tend'),
 ('realnum', 'real numbers on november'), ('p492', 'four point nine two'), ('p515', 'five point one five'), ('swing', 'rates can swing'), ('p735', 'seven point three five'), ('strike', 'buyer strike would'), ('everyone', 'so does almost every one'),
 ('day21', 'day twenty one'), ('banks', 'american banks and funds'), ('fedin', 'federal reserve steps in'), ('fedowner', 'already one of the biggest'),
 ('tokyo', 'bonds and toky o'),
 ('partly', 'partly yes'), ('ch5', 'chapter five the bill'), ('day30', 'day thirty of'), ('notscen', "isn't a scenario at all"), ('t114', 'one point one four trillion'), ('b114', 'one hundred fourteen billion'), ('medicare', 'more than it spent on medica'), ('military', 'spent on the military'), ('b31', 'three point one billion'), ('t54', 'five point four trillion'), ('c21', 'twenty one cents'), ('deficit', 'a deficit of almost'),
 ('hero3b', 'three billion dollars a day just'),
 ('ch6', 'chapter six who'), ('twist', "here's the twist the question"), ('slice', 'owns a slice'), ('p23', 'twenty three per cent'), ('fed459', 'four point five nine'), ('p11', 'about eleven per cent'), ('p19', 'nineteen per cent'), ('p47', 'forty seven per cent'), ('rough', 'these shares are rough'),
 ('fun', "here's a fun one"), ('combined', 'china combined'), ('x18', 'one point eight times'),
 ('owesus', 'mostly owes money'),
 ('mostly', "mostly yes that's"), ('harder', 'collapse is harder'), ('pressure', 'the real pressure'), ('bill2', 'already here in the bill'), ('biggerthan', 'now bigger than medica'), ('dec15', 'december fifteenth'), ('chinaline', "watching china's line"),
 ('q', 'your turn before'), ('comments', 'tell us in the comments'), ('follow', 'follow the money'), ('subscribe', 'subscribe to tchertography'), ('friday', 'friday invid'), ('seeyou', 'see you there'),
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
