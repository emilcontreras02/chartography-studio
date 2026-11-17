"""REAL OR FAKE? (Chartography take on this week's #1 US Short format 'Are these people real or AI?')
Quiz Short: the full-body mascot hosts; 4 money facts, 1 is made up; countdown; reveal; comment CTA."""
import sys, os, json, math
HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.join(HERE, '..', '..'))
import chartography_engine as ce
ce.use_canvas('short')
import whatif_kit as k
import hero
from chartography_engine import F, text, prog, ease, mix, chrome, pill, MINT, AMBER, CREAM, MUTED, PANEL, CORAL, BG, SLATE
W, H = ce.W, ce.H
AUD = HERE + '/vo.mp3'; DUR = ce.duration(AUD)
WORDS = json.load(open(HERE + '/words.json'))
c = ce.Cues(WORDS, DUR)
SPK = json.load(open(HERE + '/speakers.json'))
SEGS = json.load(open(HERE + '/segments.json'))
seg = [s[1] for s in SPK]
CW = k.caption_words([(s[0], s[1]) for s in SEGS], WORDS, DUR)
CHUNKS = k.caption_chunks(CW, 3)
KEYS = {'real', 'fake', 'five', 'cents', 'seven', 'hundred', 'fifty', 'thousand', 'ten', 'bitcoin', 'two', 'pizzas', 'new', 'york', 'rogers', 'arkansas'}
SPEAKERS = {'hero': (None, CORAL), 'narr': (None, MINT)}
GROUND = 1330

CARDS = [  # letter, text, cue phrase, reveal text, reveal cue, is_fake
    ('A', "Coca-Cola's first glasses sold for 5 cents", "a cocacola's first glasses", 'REAL  ·  Atlanta, 1886', 'atlanta in eighteen', False),
    ('B', 'Google was offered to Excite for $750,000', 'b gugall was offered', 'REAL  ·  Excite said no, 1999', 'excite said no', False),
    ('C', 'Someone paid 10,000 bitcoin for 2 pizzas', 'c some one paid ten thousand', 'REAL  ·  May 2010', 'and the pizzes were bought', False),
    ('D', "Walmart's first store opened in New York City", "d walmart's first store opened in new york", 'FAKE  ·  Rogers, Arkansas, 1962', 'the fake one is d', True),
]
T_CARD = [c.at(p) for _, _, p, _, _, _ in CARDS]
T_REV = [c.at(p, after=seg[3] - 0.5) for _, _, _, _, p, _ in CARDS]
t_count = [c.at('three', after=seg[2]), c.at('two', after=seg[2] + 1.5), c.at('one', after=seg[2] + 2.5)]
t_end = seg[4]


def card(d, i, T):
    letter, txt, _, rev, _, fake = CARDS[i]
    a = prog(T, T_CARD[i] - 0.1, 0.3)
    if a <= 0.01:
        return
    x0, x1 = 60, 760
    y0 = 430 + i * 205
    rv = prog(T, T_REV[i], 0.3)
    col = PANEL
    if rv > 0:
        col = mix((70, 30, 34), rv, PANEL) if fake else mix((18, 60, 52), rv, PANEL)
    d.rounded_rectangle([x0, y0 + (1 - a) * 30, x1, y0 + 190 + (1 - a) * 30], radius=24, fill=mix(col, a), outline=mix(CORAL if (fake and rv > 0) else (MINT if rv > 0 else (70, 86, 110)), a), width=4)
    d.ellipse([x0 + 22, y0 + 26, x0 + 102, y0 + 106], fill=mix(AMBER, a, col))
    text(d, (x0 + 62, y0 + 66), letter, F('sansb', 48), BG, a, anchor='mm', base=AMBER, rise=0)
    lines = ce.wrap(d, txt, F('sansb', 40), x1 - x0 - 150)
    for j, ln in enumerate(lines[:2]):
        text(d, (x0 + 125, y0 + 22 + j * 48), ln, F('sansb', 40), CREAM, a, base=col, rise=0)
    if rv > 0:
        tag = 'FAKE' if fake else 'REAL'
        tc = CORAL if fake else MINT
        f = F('sansb', 34)
        tw = d.textlength(rev, font=f) + 40
        d.rounded_rectangle([x0 + 125, y0 + 128, x0 + 125 + tw, y0 + 172], radius=12, fill=mix(tc, rv, col))
        text(d, (x0 + 125 + tw / 2, y0 + 150), rev, f, BG, rv, anchor='mm', base=tc, rise=0)
        if fake:
            d.line([(x0 + 120, y0 + 50), (x1 - 40, y0 + 50)], fill=mix(CORAL, rv, col), width=6)
            d.line([(x0 + 120, y0 + 98), (x0 + 520, y0 + 98)], fill=mix(CORAL, rv, col), width=6)


def scene(T, img, d):
    k.grad_sky(d, 0, H)
    k.ground(d, GROUND, T, road=False)
    a = prog(T, 0.0, 0.25)
    text(d, (W / 2, 250), 'REAL', F('serifb', 120), MINT, a, anchor='rm', rise=0)
    text(d, (W / 2 + 20, 250), 'or', F('hand', 80), CREAM, a, anchor='mm', rise=0)
    text(d, (W / 2 + 60, 250), 'FAKE?', F('serifb', 120), CORAL, a, anchor='lm', rise=0)
    ae0 = prog(T, t_end, 0.3)
    text(d, (W / 2, 350), '1 of these money facts is made up', F('sansm', 44), AMBER, prog(T, 1.2, 0.3) * (1 - ae0), anchor='mm')
    for i in range(4):
        card(d, i, T)
    # countdown
    for n, tc in zip(('3', '2', '1'), t_count):
        nxt = tc + 0.85
        if tc - 0.05 <= T < nxt:
            p = prog(T, tc - 0.05, 0.25)
            d.ellipse([W / 2 - 170 - 120, 760 - 120, W / 2 - 170 + 120, 760 + 120], fill=mix(AMBER, p * 0.95, (14, 22, 40)))
            text(d, (W / 2 - 170, 760), n, F('serifb', 190), BG, p, anchor='mm', base=AMBER, rise=0)
    # host
    if T < seg[1]:
        pose, face, mood, mt = 'point', 'talk', 'happy', 0.1
    elif T < seg[2]:
        pose, face, mood, mt = 'stand', 'smile', None, 0
    elif T < seg[3]:
        pose, face, mood, mt = 'think', 'talk' if T < SPK[2][2] else 'worry', 'think', seg[2] + 0.3
    elif T < seg[4]:
        pose, face, mood, mt = ('point' if T < T_REV[0] else 'shrug'), 'smile', 'happy', seg[3]
    else:
        pose, face, mood, mt = 'cheer', 'talk' if T < SPK[4][2] else 'happy', 'happy', seg[4]
    k.actor(img, d, T, 900, GROUND, 470, pose=pose, face=face, mood=mood, mood_t=mt, flip=(pose == 'point' and T > seg[3]))
    ae = prog(T, t_end, 0.3)
    if ae > 0:
        d.rounded_rectangle([W / 2 - 330, 300, W / 2 + 330, 400], radius=22, fill=mix(AMBER, ae))
        text(d, (W / 2, 350), 'Comment your score: _ / 4', F('sansb', 48), BG, ae, anchor='mm', base=AMBER, rise=0)
    chrome(img, d, 'Wikipedia (Coca-Cola; Walmart); Fortune, Sept 29, 2010; CoinDesk (Bitcoin Pizza Day)')
    k.captions(d, T, CHUNKS, y=1440, keywords=KEYS, speaker_colors=SPEAKERS)


scenes = [ce.Scene(0, scene)]

if __name__ == '__main__':
    if sys.argv[1:] == ['stills']:
        for n, T in [('list', seg[2] - 0.3), ('count', t_count[1] + 0.3), ('reveal', seg[4] - 0.3), ('end', DUR + 1.0)]:
            ce.still(scenes, T, f'{HERE}/still_{n}.png', DUR + 1.8)
    else:
        ce.render(scenes, AUD, HERE + '/final.mp4', tail=1.8)
        print(ce.sync_report(c, HERE + '/sync.json'))
