"""Top 10 Simple Ideas That Made Billions - TEST long-form in the new style:
full-body mascot as main character (own voice), flat illustrated world, rank ladder, word-by-word captions, comment CTA."""
import sys, os, json, math
HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.join(HERE, '..', '..'))
import chartography_engine as ce
ce.use_canvas('long')
import whatif_kit as k
import hero
from chartography_engine import F, text, prog, ease, mix, chrome, pill, MINT, AMBER, CREAM, MUTED, PANEL, CORAL, BG, SLATE
W, H = ce.W, ce.H
k.W, k.H = W, H
AUD = HERE + '/vo.mp3'; DUR = ce.duration(AUD)
WORDS = json.load(open(HERE + '/words.json'))
c = ce.Cues(WORDS, DUR)
SPK = json.load(open(HERE + '/speakers.json'))
SEGS = json.load(open(HERE + '/segments.json'))
seg = [s[1] for s in SPK]

CW = k.caption_words([(s[0], s[1]) for s in SEGS], WORDS, DUR)
CHUNKS = k.caption_chunks(CW, 4)
KEYS = {'trillion', 'billion', 'hundred', 'thousand', 'million', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten',
        'garage', 'simple', 'idea', 'twist', 'comments', 'subscribe'}
SPEAKERS = {'hero': (None, CORAL), 'narr': (None, MINT)}
GROUND = 860
SRC = 'Market value: CompaniesMarketCap (Nov 16, 2026 close); history: Wikipedia company pages'

ITEMS = [  # rank, name, idea, started, value $B, label, icon, segment index
    (10, 'Uber', 'A ride at the tap of a button', '2009  ·  the idea "UberCab"', 142.91, '$143B', 'phone', 2),
    (9, "McDonald's", 'A kitchen like an assembly line', '1948  ·  "Speedee Service System"', 193.85, '$194B', 'burger', 3),
    (8, 'Netflix', 'Movies by mail', 'Aug 1997  ·  DVD rentals', 249.45, '$249B', 'dvd', 4),
    (7, 'Coca-Cola', 'A drink for 5 cents a glass', 'May 8, 1886  ·  an Atlanta pharmacy', 427.95, '$428B', 'glass', 5),
    (6, 'Costco', 'A warehouse you pay to shop in', 'Sept 1983  ·  Seattle', 493.53, '$494B', 'warehouse', 6),
    (5, 'Visa', 'A card to pay later', 'Sept 1958  ·  BankAmericard, Fresno', 795.68, '$796B', 'card', 7),
    (4, 'Walmart', 'Low prices in a small town', 'July 2, 1962  ·  Rogers, Arkansas', 1018.0, '$1.02T', 'store', 8),
    (3, 'Meta (Facebook)', 'A website for college students', 'Feb 4, 2004  ·  Cambridge, MA', 1601.0, '$1.60T', 'laptop', 10),
    (2, 'Amazon', 'A bookstore on the internet', 'July 1994  ·  first called "Cadabra"', 2787.0, '$2.79T', 'box', 11),
    (1, 'Alphabet (Google)', 'A research project', 'Jan 1996  ·  1998 office: a garage', 3457.0, '$3.46T', 'garage', 12),
]
T_ITEM = {r: seg[si] for r, *_, si in ITEMS}
T_WORTH = {r: c.at('worth about', after=seg[si] + 1) for r, *_, si in ITEMS}
t_hook_narr = seg[1]
t_ranked = c.at('we picked ten famous simple ideas')
t_count = c.at("let's count down")
t_trillion1 = c.at('one trillion from one small town store')
t_35m = c.at("that's about thirty five million times")
t_twist = seg[14]
t_together = c.at('together these ten ideas')
t_turn = seg[15]
t_cta = seg[16]
t_top = c.at('the top comment becomes')


# ---------------- icons (flat, no brand logos) ----------------
def icon(d, kind, cx, cy, s=1.0, a=1.0):
    if a <= 0.01:
        return
    O = (11, 31, 58)
    def R(box, fill, r=14, w=6):
        x0, y0, x1, y1 = box
        d.rounded_rectangle([cx + x0 * s, cy + y0 * s, cx + x1 * s, cy + y1 * s], radius=int(r * s), fill=mix(fill, a, PANEL), outline=mix(O, a, PANEL), width=max(2, int(w * s)))
    def E(box, fill, w=6):
        x0, y0, x1, y1 = box
        d.ellipse([cx + x0 * s, cy + y0 * s, cx + x1 * s, cy + y1 * s], fill=mix(fill, a, PANEL), outline=mix(O, a, PANEL), width=max(2, int(w * s)))
    if kind == 'phone':
        R((-70, -120, 70, 120), (40, 44, 56), 22); R((-56, -96, 56, 92), (210, 230, 250), 10)
        E((-26, -60, 26, -8), CORAL); d.polygon([(cx - 22 * s, cy - 30 * s), (cx + 22 * s, cy - 30 * s), (cx, cy + 10 * s)], fill=mix(CORAL, a, PANEL))
        R((-40, 40, 40, 70), MINT, 12)
    elif kind == 'burger':
        d.chord([cx - 110 * s, cy - 90 * s, cx + 110 * s, cy + 40 * s], 180, 360, fill=mix((232, 170, 80), a, PANEL), outline=mix(O, a, PANEL), width=int(6 * s))
        R((-115, -20, 115, 5), (110, 200, 90), 10); R((-110, 5, 110, 40), (120, 70, 50), 14); R((-105, 40, 105, 70), (232, 170, 80), 18)
    elif kind == 'dvd':
        R((-120, -80, 120, 90), (226, 92, 72), 10); E((-60, -70, 80, 70), (220, 225, 235)); E((-8, -18, 28, 18), (60, 70, 90))
    elif kind == 'glass':
        d.polygon([(cx - 60 * s, cy - 100 * s), (cx + 60 * s, cy - 100 * s), (cx + 40 * s, cy + 100 * s), (cx - 40 * s, cy + 100 * s)], fill=mix((120, 60, 40), a, PANEL), outline=mix(O, a, PANEL))
        d.rectangle([cx - 58 * s, cy - 100 * s, cx + 58 * s, cy - 70 * s], fill=mix((240, 236, 220), a, PANEL))
        text(d, (cx + 110 * s, cy - 60 * s), '5¢', F('serifb', int(70 * s)), AMBER, a, anchor='mm', base=PANEL, rise=0)
    elif kind == 'warehouse':
        d.polygon([(cx - 140 * s, cy - 20 * s), (cx, cy - 100 * s), (cx + 140 * s, cy - 20 * s)], fill=mix((200, 70, 60), a, PANEL), outline=mix(O, a, PANEL))
        R((-130, -20, 130, 100), (220, 224, 232), 4); R((-50, 20, 50, 100), (90, 100, 120), 4)
    elif kind == 'card':
        R((-140, -85, 140, 85), (52, 104, 190), 18); R((-110, -40, -50, 0), (240, 200, 90), 6)
        d.rectangle([cx - 110 * s, cy + 30 * s, cx + 60 * s, cy + 45 * s], fill=mix((210, 225, 245), a, PANEL))
    elif kind == 'store':
        R((-150, -60, 150, 100), (236, 230, 214), 4); R((-150, -100, 150, -55), (70, 130, 210), 6)
        text(d, (cx, cy - 78 * s), 'DISCOUNT CITY', F('sansb', int(26 * s)), (255, 255, 255), a, anchor='mm', base=(70, 130, 210), rise=0)
        R((-40, 20, 40, 100), (90, 100, 120), 4); R((-130, -30, -60, 30), (150, 200, 235), 4); R((60, -30, 130, 30), (150, 200, 235), 4)
    elif kind == 'laptop':
        R((-120, -90, 120, 60), (40, 44, 56), 12); R((-104, -76, 104, 46), (210, 230, 250), 6)
        E((-28, -56, 28, 0), (52, 104, 190)); R((-50, 6, 50, 34), (52, 104, 190), 14)
        d.polygon([(cx - 150 * s, cy + 60 * s), (cx + 150 * s, cy + 60 * s), (cx + 130 * s, cy + 84 * s), (cx - 130 * s, cy + 84 * s)], fill=mix((150, 156, 166), a, PANEL))
    elif kind == 'box':
        R((-120, -60, 120, 90), (200, 150, 90), 6); d.line([(cx - 120 * s, cy - 10 * s), (cx + 120 * s, cy - 10 * s)], fill=mix(O, a, PANEL), width=int(5 * s))
        for i, col in enumerate([(226, 92, 72), (63, 150, 220), (63, 190, 140)]):
            R((-90 + i * 60, -120, -45 + i * 60, -60), col, 4)
    elif kind == 'garage':
        d.polygon([(cx - 150 * s, cy - 40 * s), (cx, cy - 130 * s), (cx + 150 * s, cy - 40 * s)], fill=mix((120, 130, 150), a, PANEL), outline=mix(O, a, PANEL))
        R((-130, -40, 130, 100), (236, 230, 214), 4)
        for i in range(4):
            R((-90, -20 + i * 28, 90, 4 + i * 28), (200, 204, 212), 4, 4)


def check(d, x, y, w, a, amt='$100,000', date='Aug 1998'):
    if a <= 0.01:
        return
    PAPER = (240, 236, 214)
    h = w * 0.42
    d.rounded_rectangle([x, y, x + w, y + h], radius=14, fill=mix(PAPER, a), outline=mix((120, 150, 120), a), width=5)
    text(d, (x + 30, y + 26), 'PAY TO: A RESEARCH PROJECT', F('sansb', int(w * 0.04)), (70, 80, 70), a, base=PAPER, rise=0)
    text(d, (x + w - 30, y + 26), date, F('sansm', int(w * 0.04)), (70, 80, 70), a, anchor='ra', base=PAPER, rise=0)
    text(d, (x + w / 2, y + h * 0.58), amt, F('serifb', int(w * 0.16)), (30, 90, 60), a, anchor='mm', base=PAPER, rise=0)


# ---------------- shared parts ----------------
def ladder(d, T, upto_t=None):
    """10 slots on the right; a rank fills when its 'worth' cue is reached."""
    x0, x1, y0, sh = 1600, 1880, 150, 66
    text(d, (x1, 112), 'Value as of Nov 16, 2026', F('sansm', 22), MUTED, 1, anchor='ra', rise=0)
    cur = None
    for r, name, *_ in ITEMS:
        if T >= T_ITEM[r] - 0.2:
            cur = r
    for i, (r, name, idea, started, val, lab, ic, si) in enumerate(sorted(ITEMS, key=lambda x: x[0])):
        y = y0 + i * sh
        filled = T >= T_WORTH[r]
        active = cur == r
        fill = (40, 58, 86) if not active else (70, 58, 30)
        d.rounded_rectangle([x0, y, x1, y + sh - 10], radius=12, fill=fill, outline=AMBER if active else (60, 76, 104), width=3)
        text(d, (x0 + 18, y + (sh - 10) / 2), f'#{r}', F('sansb', 30), AMBER if active else MUTED, 1, anchor='lm', base=fill, rise=0)
        if filled:
            short = name.split(' (')[0]
            text(d, (x0 + 84, y + (sh - 10) / 2 - 11), short, F('sansb', 22), CREAM, 1, anchor='lm', base=fill, rise=0)
            text(d, (x0 + 84, y + (sh - 10) / 2 + 13), lab, F('sansb', 22), MINT, 1, anchor='lm', base=fill, rise=0)


def base(T, img, d, src=SRC, lad=True):
    k.grad_sky(d, 0, H)
    k.ground(d, GROUND, T, road=False)
    pill(d, 250, 110, 'TOP 10 SIMPLE IDEAS', 1.0, color=BG, fill=AMBER, font=F('sansb', 34))
    if lad:
        ladder(d, T)
    return src


def finish(T, img, d, src):
    chrome(img, d, src)
    k.captions(d, T, CHUNKS, y=955, keywords=KEYS, speaker_colors=SPEAKERS, size=64)


# ---------------- scenes ----------------
def s_hook(T, img, d):
    k.grad_sky(d, 0, H)
    k.ground(d, GROUND, T, road=False)
    shocked = T < seg[1] + 0.2
    k.actor(img, d, T, 360, GROUND, 600, pose='shock' if shocked else 'point', face='shock' if shocked else 'smile',
            mood='shock', mood_t=0.6)
    check(d, 720, 200, 520, prog(T, 0.1, 0.3))
    a = prog(T, 1.6, 0.4)
    if a > 0:
        d.line([(1250, 300), (1380, 300)], fill=mix(MINT, a), width=10)
        d.polygon([(1380, 280), (1420, 300), (1380, 320)], fill=mix(MINT, a))
        g = ease(prog(T, 2.2, 1.6))
        bh = 40 + 520 * g
        d.rounded_rectangle([1460, GROUND - 40 - bh, 1820, GROUND - 40], radius=18, fill=mix(MINT, a))
        text(d, (1640, GROUND - 70 - bh), '$3.5 TRILLION', F('serifb', 64), MINT, prog(T, 3.0, 0.4), anchor='mm', rise=0)
    text(d, (980, 520), 'Today: #1 on this list', F('hand', 70), AMBER, prog(T, c.at("and it's number one on this list"), 0.4), anchor='mm')
    ar = prog(T, t_ranked, 0.4)
    if ar > 0:
        d.rounded_rectangle([700, 600, 1400, 800], radius=24, fill=mix(PANEL, ar))
        text(d, (1050, 660), '10 famous simple ideas', F('serifb', 56), CREAM, ar, anchor='mm', base=PANEL)
        text(d, (1050, 740), 'ranked by what they are worth today', F('sansm', 38), MUTED, ar, anchor='mm', base=PANEL)
    finish(T, img, d, 'Wikipedia (Google: $100,000 investment, Aug 1998); CompaniesMarketCap (Nov 16, 2026 close)')


def make_item(r):
    rank, name, idea, started, val, lab, ic, si = next(x for x in ITEMS if x[0] == r)
    t0 = T_ITEM[r]; tw = T_WORTH[r]

    def scene(T, img, d):
        src = base(T, img, d)
        pose, face, mood, mt = 'point', 'smile', 'happy', t0
        if r == 4 and seg[9] - 0.2 <= T:
            pose, face, mood, mt = 'cheer', ('talk' if T < SPK[9][2] else 'happy'), 'happy', seg[9]
        k.actor(img, d, T, 300, GROUND, 560, pose=pose, face=face, mood=mood, mood_t=mt)
        a = prog(T, t0 - 0.1, 0.35)
        d.rounded_rectangle([590, 150, 1560, 830], radius=30, fill=mix(PANEL, a))
        text(d, (640, 250), f'#{r}', F('serifb', 150), AMBER, a, anchor='lm', base=PANEL)
        text(d, (640, 380), name, F('serifb', 76), CREAM, prog(T, t0 + 0.4, 0.3), anchor='lm', base=PANEL)
        text(d, (640, 460), idea, F('hand', 58), MINT, prog(T, t0 + 0.9, 0.3), anchor='lm', base=PANEL)
        if r != 1:
            icon(d, ic, 1400, 290, 0.95, prog(T, t0 + 0.6, 0.4))
        text(d, (640, 580), 'STARTED', F('sansb', 28), MUTED, prog(T, t0 + 2.0, 0.3), anchor='lm', base=PANEL)
        text(d, (640, 625), started, F('sansb', 44), CREAM, prog(T, t0 + 2.0, 0.3), anchor='lm', base=PANEL)
        aw = prog(T, tw - 0.2, 0.3)
        text(d, (640, 720), 'WORTH TODAY', F('sansb', 28), MUTED, aw, anchor='lm', base=PANEL)
        if aw > 0:
            g = ease(prog(T, tw - 0.1, 0.9))
            v = val * g
            s = f'${v / 1000:,.2f}T' if val >= 1000 else f'${v:,.0f}B'
            if g >= 1:
                s = lab
            text(d, (640, 778), s, F('serifb', 84), MINT, aw, anchor='lm', base=PANEL)
        if r == 1:
            icon(d, 'garage', 1440, 300, 0.75, prog(T, t0 + 0.6, 0.4))
            check(d, 1140, 420, 380, prog(T, c.at('it got its first check', after=t0), 0.3))
            a35 = prog(T, t_35m, 0.3)
            if a35 > 0:
                d.rounded_rectangle([1120, 640, 1540, 800], radius=18, fill=mix(CORAL, a35, PANEL))
                text(d, (1330, 700), 'x 35 million', F('serifb', 64), (255, 255, 255), a35, anchor='mm', base=CORAL, rise=0)
                text(d, (1330, 765), 'the first check (illustration)', F('sansm', 26), (255, 255, 255), a35, anchor='mm', base=CORAL, rise=0)
        finish(T, img, d, src)
    scene.__name__ = f's_rank{r}'
    return scene


def s_wow(T, img, d):
    src = base(T, img, d)
    k.actor(img, d, T, 520, GROUND, 640, pose='shock', face='talk' if T < SPK[13][2] else 'shock', mood='shock', mood_t=seg[13])
    check(d, 980, 200, 460, 1.0)
    text(d, (1210, 520), 'x 35 million', F('serifb', 110), CORAL, prog(T, seg[13] + 0.6, 0.3), anchor='mm')
    icon(d, 'garage', 1210, 720, 0.8, prog(T, seg[13] + 1.6, 0.3))
    finish(T, img, d, 'Illustration: Alphabet market value ($3.46T, Nov 16, 2026) / the $100,000 first check, not an investor return')


def s_recap(T, img, d):
    src = base(T, img, d, lad=False)
    k.actor(img, d, T, 260, GROUND, 520, pose='shrug', face='smile', mood='happy', mood_t=t_twist)
    x0, xw, y0, bh = 760, 900, 150, 62
    a0 = prog(T, t_twist + 6.0, 0.4)
    text(d, (x0 - 20, 112), 'Worth today (Nov 16, 2026)', F('sansb', 30), MINT, a0, anchor='lm')
    for i, (r, name, idea, started, val, lab, ic, si) in enumerate(sorted(ITEMS, key=lambda x: -x[4])):
        y = y0 + i * bh
        a = prog(T, t_twist + 6.0 + i * 0.25, 0.3)
        short = name.split(' (')[0]
        text(d, (x0 - 20, y + 24), short, F('sansb', 30), CREAM, a, anchor='rm')
        g = ease(prog(T, t_twist + 6.2 + i * 0.25, 0.8))
        d.rounded_rectangle([x0, y + 4, x0 + max(6, xw * val / 3500 * g), y + 46], radius=10, fill=mix(AMBER if i == 0 else SLATE, a))
        text(d, (x0 + xw * val / 3500 * g + 14, y + 25), lab, F('sansb', 28), MINT, a if g > 0.9 else 0, anchor='lm')
    at = prog(T, t_together, 0.3)
    if at > 0:
        f = F('serifb', 64); s = 'Together: about $11.2 trillion'
        w = d.textlength(s, font=f) + 70
        d.rounded_rectangle([1200 - w / 2, 790, 1200 + w / 2, 870], radius=18, fill=mix(CORAL, at))
        text(d, (1200, 830), s, f, (255, 255, 255), at, anchor='mm', base=CORAL, rise=0)
    finish(T, img, d, SRC)


def s_cta(T, img, d):
    k.grad_sky(d, 0, H)
    k.ground(d, GROUND, T, road=False)
    talking = T < SPK[15][2]
    k.actor(img, d, T, 420, GROUND, 640, pose='think' if talking else 'wave', face='talk' if talking else 'happy',
            mood='think' if talking else 'happy', mood_t=seg[15] + 0.4 if talking else SPK[15][2])
    a1 = prog(T, seg[15] + 0.3, 0.3)
    d.rounded_rectangle([820, 140, 1820, 330], radius=26, fill=mix(PANEL, a1))
    text(d, (1320, 200), 'Which simple idea', F('serifb', 60), CREAM, a1, anchor='mm', base=PANEL)
    text(d, (1320, 275), 'would you have bet on?', F('serifb', 60), AMBER, a1, anchor='mm', base=PANEL)
    a2 = prog(T, t_cta + 0.2, 0.3)
    d.rounded_rectangle([820, 370, 1820, 560], radius=26, fill=mix((250, 247, 238), a2))
    text(d, (1320, 430), 'COMMENT the next Top 10 you want', F('sansb', 46), (30, 34, 44), a2, anchor='mm', base=(250, 247, 238))
    text(d, (1320, 505), 'top comment = our next video', F('hand', 62), CORAL, prog(T, t_top, 0.3), anchor='mm', base=(250, 247, 238))
    pill(d, 1320, 640, 'SUBSCRIBE for the next Top 10', prog(T, t_top + 1.4), color=BG, fill=MINT, font=F('sansb', 50))
    finish(T, img, d, None)


scenes = [ce.Scene(0, s_hook)]
for r, *_ in ITEMS:
    scenes.append(ce.Scene(T_ITEM[r] - 0.25, make_item(r)))
scenes += [ce.Scene(seg[13] - 0.2, s_wow), ce.Scene(t_twist - 0.2, s_recap), ce.Scene(t_turn - 0.2, s_cta)]
scenes.sort(key=lambda s: s.start)

if __name__ == '__main__':
    if sys.argv[1:] == ['stills']:
        pts = [('hook', 25.0), ('r10', T_WORTH[10] + 1.5), ('r7', T_WORTH[7] + 1.5), ('r4', seg[9] + 1.5), ('r1', t_35m + 1.0),
               ('wow', SPK[13][2] - 0.4), ('recap', t_together + 1.0), ('cta', DUR + 1.0)]
        for n, T in pts:
            ce.still(scenes, T, f'{HERE}/still_{n}.png', DUR + 2.0)
    else:
        ce.render(scenes, AUD, HERE + '/final.mp4', tail=2.0)
        print(ce.sync_report(c, HERE + '/sync.json'))
