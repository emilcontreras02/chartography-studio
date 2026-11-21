"""Timing for the Remotion build: segment starts, word captions and reveal cues (phrases as the transcriber heard them), in script order."""
import sys, os, json
H = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.join(H, '..', '..'))
import chartography_engine as ce
ce.use_canvas('long')
import whatif_kit as k
P = [
 ('h_ten', 'here are the ten thanksgiving prices'),
 ('s10', 'number ten a thirty'), ('v10', 'four dollars and twenty four cents'), ('p10', 'up one point nine'), ('rule10', "here's the rule"),
 ('red10', 'price jumps glow red'), ('green10', 'price drops glow green'), ('eleven', 'at number eleven'),
 ('s9', 'number nine a one pound'), ('v9', 'one dollar and ninety nine'), ('p9', 'down two per cent'), ('under9', 'under two dollars'), ('four9', 'only four items'),
 ('s8', 'number eight two frozen'), ('v8', 'three dollars and twenty eight'), ('p8', 'down two point seven'), ('pie8', "here's the pie again"), ('up8', 'the filling went up'), ('down8', 'the crust went down'),
 ('s7', 'number seven the vegetray'), ('v7', 'one dollar and thirty one'), ('p7', 'down three point seven'), ('cheap7', 'cheapest thing on the whole table'), ('drop7', 'biggest price drop'),
 ('nodrops', 'no more drops'), ('s6', 'number six three pounds'), ('v6', 'four dollars and twenty cents'), ('p6', 'up five per cent'), ('six6', 'six price jumps in a row'), ('big6', 'bigger than the last'),
 ('s5', 'number five a fourteen'), ('v5', 'three dollars and ninety one'), ('p5', 'up five point four'), ('tied5', 'almost tied less than half'), ('pic5', 'one bag of stuffing now costs'), ('pic5b', 'the cranberries and the vegey tray'),
 ('s4', 'number four a dozen'), ('v4', 'three dollars and eighty one'), ('p4', 'up seven per cent'), ('why4', 'points to higher costs'), ('c_fuel', 'fuel processing'), ('c_pack', 'packaging and transport'), ('bread4', 'bread shows up twice'),
 ('s3', 'number three whole milk'), ('v3', 'four dollars and five cents'), ('p3', 'up eight point six'), ('why3', 'powdered protein'),
 ('s2', 'number two fresh cranberries'), ('v2', 'two dollars and forty eight'), ('p2', 'up eight point eight'), ('why2', 'high fuel costs'), ('tie2', 'milk and cranberries almost tied'), ('notonly', "the turkey isn't the only"),
 ('s1', 'and number one of course'), ('v1', 'twenty three dollars and sixty eight'), ('lb1', 'forty eight cents a pound'), ('p1', 'up ten point one'), ('why1', 'higher production costs'), ('share1', 'the turkey alone is'),
 ('half', 'not quite half'), ('exp', 'expanded menu comes to'), ('ne', 'the northeast pays'), ('south', 'the south pays'),
 ('tw', "here's the twist split"), ('tw586', 'five dollars and eighty six'), ('tw542', 'five dollars and forty two'), ('tw6405', 'sixty four o five'),
 ('twusda', 'the u s department'), ('tw6c', 'less than six cents'), ('twrest', 'most of the rest pays'), ('twrich', 'not the one getting rich'),
 ('rc', 'quick recap'), ('rc73', 'seven went up three went down'),
 ('rc10', 'pumpkin pie mix frozen'), ('rc9', 'frozen peas pie'), ('rc8', 'pie crusts the'), ('rc7', 'the vegetray sweet'), ('rc6', 'sweet potatoes stuffing'),
 ('rc5', 'stuffing dinner'), ('rc4', 'dinner rolls whole'), ('rc3', 'whole milk cranberries'), ('rc2', 'cranberries and at the top'), ('rc1', 'the turkey up ten'),
 ('q', 'which price surprised you'), ('comments', 'tell us in the comments'), ('follow', 'follow the money'), ('sub', 'subscribe to'), ('wed', 'on wednesday the ten'),
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
    print(ce.sync_report(c, H + '/sync.json'))
