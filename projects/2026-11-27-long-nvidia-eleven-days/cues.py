"""Timing for the Remotion build (Nov 27 Nvidia 'eleven days' documentary): segment starts, word captions and reveal cues
(phrases as the transcriber heard them), in script order."""
import sys, os, json, shutil
H = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.join(H, '..', '..'))
import chartography_engine as ce
ce.use_canvas('long')
import whatif_kit as k
P = [
 ('nov12', 'november twelfth twenty'), ('y33', 'thirty three years'), ('founder', 'without its founder'), ('seven', 'seven trading days later'), ('trillion0', 'more than a trillion dollars of value'),
 ('hero1', 'a trillion in a week'), ('monday', 'then one monday morning'), ('press', 'single press release'), ('eleven', 'story of eleven days'), ('pricetag', 'the price tag'), ('oneman', 'put on one man'),
 ('ch1', 'chapter one the empty'), ('short', 'the filing is short'), ('resigns', 'resigns as president'), ('effective', 'effective immediately'), ('noreason', 'no reason is given'), ('notone', 'not one line'),
 ('kress', 'colette cress'), ('since2013', 'since twenty thirteen'), ('interim', 'becomes interim'), ('jones', 'harvey jones'), ('accepted', 'had accepted the resignation'),
 ('nightbefore', 'the night before the news'), ('p17373', 'one hundred seventy three dollars'), ('oct6', 'back on october sixth'), ('p239', 'two hundred thirty nine'),
 ('ch2', 'chapter two the best'), ('nov17', 'november seventeenth'), ('revenue', 'revenue for the quarter'), ('b1158', 'one hundred fifteen point eight billion'), ('double', 'more than double'),
 ('beats', 'own forecast by'), ('b78', 'seven point eight billion'), ('datacenters', 'data centers the chips'), ('b1076', 'one hundred seven point six'), ('profit', 'profit is sixty five'), ('perday', 'seven hundred seventeen million'),
 ('falling', 'the stock keeps falling'), ('nov20', 'friday november twentieth'), ('p14', 'fourteen per cent'), ('p12553', 'one hundred twenty five dollars'), ('p277', 'twenty seven point seven'),
 ('soft', 'if this already surprised'), ('stranger', 'next part gets stranger'),
 ('ch3', 'chapter three the phone'), ('weekend', 'over the week end'), ('nov22', 'sunday november twenty second'), ('unan', 'it votes unanimously'), ('bring', 'bring him back'),
 ('nov23', 'monday november twenty third'), ('t855', 'eight fifty five'), ('goesout', 'the announcement goes out'), ('candor', 'satisfied with his candor'), ('input', 'received input from senior'), ('nsr', 'no national security risk'),
 ('reason', 'line is there for a reason'), ('committee', 'an independent committee'), ('foreign', 'foreign intelligence effort'), ('notfinished', 'review is not finished'), ('newcomm', 'creates a new committee'), ('cco', 'chief compliance officer'),
 ('opens', 'then the market opens'),
 ('ch4', 'chapter four the round'), ('close', 'by the close'), ('p3148', 'thirty one point four eight'), ('p16505', 'one hundred sixty five dollars'),
 ('lost', 'value gone in seven'), ('back', 'close to a trillion back'), ('estimate', 'both by our estimate'), ('twist', 'here is the twist'), ('below', 'about five per cent below'), ('nextday', 'the next day it slipped'), ('p586', 'five point eight six'),
 ('best', 'the best quarter in'), ('sold', 'investors sold anyway'), ('onepr', 'then one press release did'),
 ('care', 'why should you care'), ('top10', 'ten biggest american companies'), ('p40', 'about forty per cent'), ('k401', 'if your four'), ('piece', 'a small piece'),
 ('sixweeks', 'in the six weeks'), ('t8', 'roughly eight trillion'), ('t3', 'about three trillion'),
 ('questions', 'questions are not all'), ('reuters', 'reported that s c'), ('notconf', 'has not confirmed'), ('nocomment', 'declined to comment'),
 ('end11', 'eleven days more than'), ('pricingco', 'not pricing a company'), ('oneperson', 'pricing one person'), ('q', 'should one person be worth'), ('comments', 'celis and the commons'),
 ('follow', 'follow the money'), ('subscribe', 'subscribe to troutography'), ('saturday', 'next on saturday'), ('babies', 'running out of babies'),
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
    json.dump(t, open(H + '/remotion/src/timing.json', 'w'), indent=1)
    shutil.copy(H + '/vo.mp3', H + '/remotion/public/vo.mp3')
    print(ce.sync_report(c, H + '/sync.json'))
