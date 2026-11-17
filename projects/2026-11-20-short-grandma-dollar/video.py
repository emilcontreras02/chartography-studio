"""GRANDMA'S $1 (Chartography remake of this week's viral 'A Grandma's Heart Has No Limits' family-skit format).
The full-body mascot is the main character; Grandma is a supporting drawn character (no voice).
Fact: BLS CPI-U 1960 annual average 29.6; Oct 2026 337.511 -> $1 (1960) = $11.40 today; $1 today = 9 cents in 1960."""
import sys, os, json, math
from functools import lru_cache
HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.join(HERE, '..', '..'))
import chartography_engine as ce
ce.use_canvas('short')
import whatif_kit as k
import hero
from PIL import Image, ImageDraw
from chartography_engine import F, text, prog, ease, mix, chrome, MINT, AMBER, CREAM, MUTED, PANEL, CORAL, BG
W, H = ce.W, ce.H
AUD = HERE + '/vo.mp3'; DUR = ce.duration(AUD)
WORDS = json.load(open(HERE + '/words.json'))
c = ce.Cues(WORDS, DUR)
SPK = json.load(open(HERE + '/speakers.json'))
SEGS = json.load(open(HERE + '/segments.json'))
seg = [s[1] for s in SPK]
CW = k.caption_words([(s[0], s[1]) for s in SEGS], WORDS, DUR)
CHUNKS = k.caption_chunks(CW, 3)
KEYS = {'dollar', 'one', 'nineteen', 'sixty', 'eleven', 'forty', 'nine', 'cents', 'grandma', 'comments'}
SPEAKERS = {'hero': (None, CORAL), 'narr': (None, MINT)}
GROUND = 1330
BILL = (92, 158, 104); BILL_DK = (52, 110, 66); BILL_LT = (196, 226, 190)

t_give = c.at('gave me one dollar')
t_said = c.at('she said')
t_check = seg[1]
t_match = c.at('to match one')
t_1140 = c.at('eleven dollars and forty')
t_flip = seg[4]
t_9c = c.at('nine cents in')
t_love = c.at('love you')
t_cta = seg[6]

# ---------- Grandma (same flat outlined style as hero.py) ----------
G_SKIN = (238, 204, 178); G_HAIR = (214, 216, 224); G_TOP = (176, 84, 118); G_SKIRT = (88, 70, 120)
G_ARMS = {
    'stand': (((132, 300), (116, 356), (118, 414)), ((228, 300), (244, 356), (242, 414))),
    'give': (((132, 300), (116, 356), (118, 414)), ((228, 300), (288, 318), (338, 300))),
    'hug': (((132, 300), (70, 280), (52, 214)), ((228, 300), (290, 280), (308, 214))),
}


@lru_cache(maxsize=64)
def _grandma(h, pose, face):
    s = hero.SS
    im = Image.new('RGBA', (hero.UW * s, hero.UH * s), (0, 0, 0, 0))
    d = ImageDraw.Draw(im)
    la, ra = G_ARMS[pose]
    hero._ell(d, 156, 574, 30, 17, hero.SHOE, s); hero._ell(d, 204, 574, 30, 17, hero.SHOE, s)
    hero._rr(d, (150, 470, 172, 560), 10, G_SKIN, s); hero._rr(d, (188, 470, 210, 560), 10, G_SKIN, s)
    hero._thick(d, la, 28, G_TOP, s); hero._hand(d, la[2], s)
    d.polygon([(118 * s, 400 * s), (242 * s, 400 * s), (262 * s, 520 * s), (98 * s, 520 * s)], fill=hero.NAVY)
    d.polygon([(124 * s, 404 * s), (236 * s, 404 * s), (254 * s, 513 * s), (106 * s, 513 * s)], fill=G_SKIRT)
    hero._rr(d, (128, 286, 232, 430), 30, G_TOP, s)
    for yy in (330, 366, 402):
        d.ellipse([174 * s, yy * s, 186 * s, (yy + 12) * s], fill=CREAM)
    hero._thick(d, ra, 28, G_TOP, s); hero._hand(d, ra[2], s)
    # head + hair bun
    hero._ell(d, 180, 92, 46, 40, G_HAIR, s)
    hero._ell(d, 180, 198, 104, 98, G_SKIN, s)
    d.chord([(76 - 7) * s, (96 - 7) * s, (284 + 7) * s, (230) * s], 180, 360, fill=hero.NAVY)
    d.chord([76 * s, 96 * s, 284 * s, 222 * s], 180, 360, fill=G_HAIR)
    for cx in (90, 270):
        hero._ell(d, cx, 176, 24, 34, G_HAIR, s, ow=6)
    # glasses + eyes
    for ex in (146, 214):
        d.ellipse([(ex - 28) * s, 182 * s, (ex + 28) * s, 232 * s], outline=hero.NAVY, width=6 * s)
        if face == 'happy':
            d.arc([(ex - 13) * s, 196 * s, (ex + 13) * s, 220 * s], 200, 340, fill=hero.NAVY, width=6 * s)
        else:
            d.ellipse([(ex - 8) * s, 196 * s, (ex + 8) * s, 220 * s], fill=hero.NAVY)
    d.line([(174 * s, 204 * s), (186 * s, 204 * s)], fill=hero.NAVY, width=5 * s)
    d.arc([156 * s, 232 * s, 204 * s, 266 * s], 20, 160, fill=hero.NAVY, width=6 * s)
    d.ellipse([110 * s, 236 * s, 132 * s, 250 * s], fill=hero.BLUSH); d.ellipse([228 * s, 236 * s, 250 * s, 250 * s], fill=hero.BLUSH)
    w = int(hero.UW * h / hero.UH)
    return im.resize((w, h), Image.LANCZOS)


def grandma(img, x, yfoot, h, pose='stand', face='smile', T=0):
    im = _grandma(int(h), pose, face)
    y = yfoot - im.height + math.sin(T * 2.2 + 1) * h * 0.006
    img.paste(im, (int(x - im.width / 2), int(y)), im)
    return h / hero.UH


# ---------- props ----------
def bill(d, cx, cy, w, a=1.0, ang=0.0, label='$1'):
    if a <= 0.01:
        return
    h = w * 0.43
    pts = [(-w / 2, -h / 2), (w / 2, -h / 2), (w / 2, h / 2), (-w / 2, h / 2)]
    ca, sa = math.cos(ang), math.sin(ang)
    P = lambda px, py: (cx + px * ca - py * sa, cy + px * sa + py * ca)
    o = max(3, w * 0.025)
    d.polygon([P(x * (1 + 2 * o / w), y * (1 + 2 * o / h)) for x, y in pts], fill=mix(BILL_DK, a))
    d.polygon([P(x, y) for x, y in pts], fill=mix(BILL, a))
    d.polygon([P(x * 0.86, y * 0.74) for x, y in pts], fill=mix(BILL_LT, a))
    r = h * 0.3
    d.ellipse([cx - r, cy - r, cx + r, cy + r], fill=mix(BILL, a))
    if w > 90:
        d.text((cx, cy), label, font=F('serifb', int(h * 0.42)), fill=mix(BILL_DK, a, BILL_LT), anchor='mm')


def heart(d, cx, cy, r, col, a=1.0):
    if a <= 0.01:
        return
    col = mix(col, a)
    d.ellipse([cx - r, cy - r * 0.6, cx, cy + r * 0.4], fill=col)
    d.ellipse([cx, cy - r * 0.6, cx + r, cy + r * 0.4], fill=col)
    d.polygon([(cx - r * 0.97, cy), (cx + r * 0.97, cy), (cx, cy + r * 1.05)], fill=col)


def room(d):
    for y in range(0, GROUND, 8):  # warm wall
        kk = y / GROUND
        d.rectangle([0, y, W, y + 8], fill=(int(30 + 22 * kk), int(36 + 16 * kk), int(58 + 6 * kk)))
    for x in range(0, W, 120):  # wallpaper stripes
        d.rectangle([x, 0, x + 6, GROUND], fill=(44, 50, 74))
    d.rectangle([0, GROUND - 60, W, GROUND], fill=(70, 52, 44))  # skirting
    d.rectangle([0, GROUND, W, H], fill=(96, 70, 52))  # wooden floor
    for y in range(GROUND + 40, H, 70):
        d.line([(0, y), (W, y)], fill=(82, 60, 44), width=4)
    # framed old photo
    d.rectangle([110, 470, 300, 630], fill=(140, 104, 64)); d.rectangle([126, 486, 284, 614], fill=(214, 200, 168))
    d.text((205, 550), '1960', font=F('hand', 52), fill=(110, 90, 70), anchor='mm')


def panel(d, a):
    d.rounded_rectangle([60, 400, W - 60, 900], radius=36, fill=mix((16, 24, 44), a * 0.92, (40, 46, 66)), outline=mix((70, 86, 110), a, (40, 46, 66)), width=4)


def scene(T, img, d):
    room(d)
    # ---------- top header (hook) ----------
    ah = prog(T, 0.0, 0.25) * (1 - prog(T, t_match - 0.3, 0.3))
    text(d, (W / 2, 250), "GRANDMA'S $1", F('serifb', 112), AMBER, ah, anchor='mm', rise=0, base=(30, 36, 58))
    text(d, (W / 2, 350), 'from 1960 vs. today', F('sansm', 52), CREAM, ah * prog(T, 0.5, 0.3), anchor='mm', base=(30, 36, 58))
    # ---------- characters ----------
    hx = 800
    if T >= t_love - 0.2:  # walk over for the hug
        hx = 800 - 170 * ease(prog(T, t_love - 0.2, 0.6))
    gpose = 'give' if t_give - 0.4 <= T < t_give + 1.2 else ('hug' if T >= t_love else 'stand')
    gface = 'happy' if (T < seg[1] or T >= t_love) else 'smile'
    grandma(img, 270, GROUND, 430, gpose, gface, T)
    if T < seg[1]:
        pose, face, mood, mt = ('stand', 'talk', 'happy', t_give + 0.4)
    elif T < seg[2]:
        pose, face, mood, mt = 'think', 'talk', 'think', seg[1]
    elif T < seg[3]:
        pose, face, mood, mt = 'stand', 'smile', None, 0
    elif T < seg[4]:
        pose, face, mood, mt = 'shock', 'shock', 'shock', seg[3]
    elif T < seg[5]:
        pose, face, mood, mt = 'stand', 'worry', None, 0
    elif T < seg[6]:
        pose, face, mood, mt = ('shrug', 'talk', None, 0) if T < t_love else ('cheer', 'happy', 'happy', t_love)
    else:
        pose, face, mood, mt = 'point', 'talk', None, 0
    k.actor(img, d, T, hx, GROUND, 470, pose=pose, face=face, mood=mood, mood_t=mt, flip=(pose == 'point'))
    # the dollar: flies from grandma's hand to hero's hand, then stays with him
    sc = 470 / 600
    hand = (hx + (110 - 180) * sc, GROUND - (600 - 410) * sc)
    gh = (270 + (338 - 180) * 430 / 600, GROUND - (600 - 300) * 430 / 600)
    p = ease(prog(T, t_give, 0.7))
    if T < t_give:
        bx, by = gh
    else:
        bx = gh[0] + (hand[0] - gh[0]) * p
        by = gh[1] + (hand[1] - gh[1]) * p - math.sin(p * math.pi) * 120
    if T < seg[2] or T >= t_cta:
        bill(d, bx, by, 150, prog(T, t_give - 0.6, 0.3), ang=-0.25 + p * 0.25)
    # grandma's line (speech bubble, the hero voices it)
    ab = prog(T, t_said, 0.25) * (1 - prog(T, seg[1] + 0.6, 0.3))
    k.bubble(d, 380, 760, 'Back in 1960, a dollar', ab, F('sansb', 44), tail_x=300)
    k.bubble(d, 380, 860, 'was a LOT of money!', ab, F('sansb', 44), tail_x=300)
    # ---------- the math: 1960 $1 vs today's stack ----------
    ap = prog(T, t_match - 0.3, 0.3) * (1 - prog(T, t_love - 0.3, 0.3))
    if ap > 0:
        panel(d, ap)
        flipped = prog(T, t_flip, 0.4)
        a1 = ap * (1 - flipped)
        if a1 > 0.01:
            text(d, (290, 460), '1960', F('serifb', 64), AMBER, a1, anchor='mm', base=(16, 24, 44), rise=0)
            text(d, (790, 460), 'TODAY', F('serifb', 64), MINT, a1, anchor='mm', base=(16, 24, 44), rise=0)
            bill(d, 290, 770, 220, a1)
            text(d, (290, 850), '$1.00', F('sansb', 56), CREAM, a1, anchor='mm', base=(16, 24, 44), rise=0)
            grow = ease(prog(T, t_match, max(0.5, t_1140 - t_match + 0.6)))
            n = 11.4 * grow
            for i in range(int(math.ceil(n))):
                frac = min(1.0, n - i)
                bill(d, 790, 780 - i * 20, 190 * (0.4 + 0.6 * frac) if frac < 1 else 190, a1 * min(1, frac * 2), ang=(0.05 if i % 2 else -0.05))
            text(d, (790, 850), f'${n:,.2f}', F('sansb', 56), MINT, a1, anchor='mm', base=(16, 24, 44), rise=0)
            text(d, (540, 640), '=', F('serifb', 110), CREAM, a1 * prog(T, t_1140, 0.3), anchor='mm', base=(16, 24, 44), rise=0)
            pass  # text(d, (W / 2, 540), 'same shopping power', F('sansm', 38), MUTED, a1 * prog(T, t_match + 0.4, 0.3), anchor='mm', base=(16, 24, 44), rise=0)
        if flipped > 0:
            a2 = ap * flipped
            text(d, (W / 2, 470), "Flip it: today's $1 in 1960 money", F('sansb', 46), CREAM, a2, anchor='mm', base=(16, 24, 44), rise=0)
            bill(d, 280, 680, 260, a2)
            ce.arrow(d, (440, 680), (620, 680), a2, color=AMBER, width=10)
            shrink = ease(prog(T, t_9c - 0.4, 0.6))
            r = 120 - 50 * shrink
            ce.coin(d, 800, 680, r, a2)
            text(d, (800, 840), '9¢', F('serifb', 90), AMBER, a2 * shrink, anchor='mm', base=(16, 24, 44), rise=0)
    # ---------- hug hearts ----------
    if T >= t_love:
        for i in range(5):
            since = T - t_love - i * 0.25
            if since > 0:
                heart(d, 330 + i * 90 + math.sin(since * 3 + i) * 20, 900 - since * 140, 28 + (i % 2) * 10, CORAL, max(0, 1 - since / 2.2))
    # ---------- CTA ----------
    ae = prog(T, t_cta, 0.3)
    if ae > 0:
        d.rounded_rectangle([90, 470, W - 90, 760], radius=34, fill=mix(AMBER, ae, (30, 36, 58)))
        text(d, (W / 2, 545), 'What did $1 buy when your', F('sansb', 52), BG, ae, anchor='mm', base=AMBER, rise=0)
        text(d, (W / 2, 610), 'grandparents were kids?', F('sansb', 52), BG, ae, anchor='mm', base=AMBER, rise=0)
        text(d, (W / 2, 695), 'Tell me in the comments ↓', F('sansm', 44), BG, ae, anchor='mm', base=AMBER, rise=0)
    chrome(img, d, 'BLS CPI-U, 1960 annual average (29.6) vs. Oct 2026 (337.511)')
    k.captions(d, T, CHUNKS, y=1440, keywords=KEYS, speaker_colors=SPEAKERS)


scenes = [ce.Scene(0, scene)]

if __name__ == '__main__':
    if sys.argv[1:] == ['stills']:
        for n, T in [('hook', t_said + 1.5), ('think', seg[1] + 0.8), ('stack', t_1140 + 1.2), ('shock', seg[3] + 1.0), ('flip', t_9c + 0.8), ('hug', t_love + 0.8), ('cta', DUR + 0.8)]:
            ce.still(scenes, T, f'{HERE}/still_{n}.png', DUR + 1.8)
    else:
        ce.render(scenes, AUD, HERE + '/final.mp4', tail=1.8)
        print(ce.sync_report(c, HERE + '/sync.json'))
