"""What if gas hit $10 a gallon? - Chartography WHAT-IF Short (illustrated story style, pilot for user approval)."""
import sys, os, json, math
HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.join(HERE, '..', '..'))
import chartography_engine as ce
from chartography_engine import (F, text, text_block, prog, ease, mix, chrome, mascot, pill,
                                 MINT, AMBER, CREAM, MUTED, PANEL, CORAL, BG, SLATE)
ce.use_canvas('short'); W, H = ce.W, ce.H
AUD = HERE + '/vo.mp3'; DUR = ce.duration(AUD)
c = ce.Cues(json.load(open(HERE + '/words.json')), DUR)

# ---- cues (spelled as the transcriber heard them) ----
t_today = c.at('to day the national average')
t_378 = c.at('three dollars and seventy eight cents')
t_dial = c.at("so let's turn up the dial")
t_w1 = c.at('week one six dollars')
t_dana = c.at('meet dana')
t_57 = c.at('used to cost about fifty seven dollars')
t_90 = c.at('now ninety')
t_fact = c.at('real fact the all time record')
t_501 = c.at('about five dollars and one cent')
t_blew = c.at('we just blew right past it')
t_m2 = c.at('month two eight dollars')
t_trucks = c.at('trucks moved more than eleven billion tons')
t_shelf = c.at('so the prices on the shelf')
t_m3 = c.at('month three ten dollars')
t_miles = c.at('the average driver covers about thirteen thousand')
t_mpg = c.at('at twenty five miles per gallon')
t_2100 = c.at('about twenty one hundred dollars of gas')
t_5500 = c.at('at ten dollars about fifty five hundred')
t_extra = c.at('an extra thirty four hundred dollars')
t_wins = c.at('so who wins')
t_ev = c.at('electric cars')
t_home = c.at('people who work from home')
t_oil = c.at('and oil producers')
t_loses = c.at('who loses')
t_comm = c.at('long commutes')
t_deliv = c.at('delivery drivers')
t_far = c.at('anyone who lives far from work')
t_ask = c.at('so at ten dollars a gallon what would you give up first')
t_sub = c.at('tell me in the comments')

# ---- palette for the illustrated world ----
SKY_TOP = (12, 22, 40); SKY_LOW = (30, 48, 78)
ASPHALT = (38, 46, 60); LINE_Y = (226, 196, 120)
CANOPY = (232, 236, 242); CANOPY_RED = (226, 92, 72)
GLASS = (120, 190, 230); WHITE = (250, 250, 250)
SKIN = (241, 196, 160); SKIN2 = (196, 140, 102)
HAIR = (70, 46, 34); SHIRT = (63, 150, 220); PANTS = (52, 62, 92)
CAR_RED = (220, 84, 72); CAR_BLUE = (70, 130, 210); CAR_GREEN = (63, 190, 140)


def grad_sky(d, y0=0, y1=None):
    y1 = y1 or H
    for y in range(y0, y1, 6):
        k = (y - y0) / max(1, y1 - y0)
        col = tuple(int(SKY_TOP[i] + (SKY_LOW[i] - SKY_TOP[i]) * k) for i in range(3))
        d.rectangle([0, y, W, y + 6], fill=col)
    for i in range(28):  # stars (fixed positions)
        sx = (i * 397) % W; sy = y0 + 40 + (i * 211) % 520
        d.ellipse([sx, sy, sx + 4, sy + 4], fill=(200, 210, 230))


def ground(d, y, T=0, road=True):
    d.rectangle([0, y, W, H], fill=ASPHALT)
    d.rectangle([0, y, W, y + 10], fill=(58, 68, 86))
    if road:
        off = (T * 220) % 160
        for x in range(-160, W + 160, 160):
            d.rectangle([x - off, y + 120, x - off + 80, y + 132], fill=LINE_Y)


def person(d, x, yf, h=360, skin=SKIN, hair=HAIR, top=SHIRT, pants=PANTS, arm_up=0.0, T=0, bob=True, hair_long=True):
    """Simple flat character, feet at (x, yf)."""
    b = math.sin(T * 3.0) * 4 if bob else 0
    hr = h * 0.13
    leg = h * 0.34; body = h * 0.36
    yb = yf - leg + b
    d.rounded_rectangle([x - h * 0.08, yf - leg, x - h * 0.015, yf], radius=10, fill=pants)
    d.rounded_rectangle([x + h * 0.015, yf - leg, x + h * 0.08, yf], radius=10, fill=pants)
    d.rounded_rectangle([x - h * 0.13, yb - body, x + h * 0.13, yb + 10], radius=int(h * 0.07), fill=top)
    # arms
    d.line([(x - h * 0.12, yb - body + 20), (x - h * 0.2, yb - body * 0.25)], fill=top, width=int(h * 0.055))
    ax = x + h * 0.12; ay = yb - body + 20
    ex = ax + h * 0.1; ey = ay + (body * 0.75) * (1 - arm_up) - body * 0.55 * arm_up
    d.line([(ax, ay), (ex, ey)], fill=top, width=int(h * 0.055))
    d.ellipse([ex - 12, ey - 12, ex + 12, ey + 12], fill=skin)
    # head
    hy = yb - body - hr * 0.9
    if hair_long:
        d.rounded_rectangle([x - hr * 1.12, hy - hr * 1.05, x + hr * 1.12, hy + hr * 1.25], radius=int(hr), fill=hair)
    d.ellipse([x - hr, hy - hr, x + hr, hy + hr], fill=skin)
    d.chord([x - hr * 1.05, hy - hr * 1.12, x + hr * 1.05, hy + hr * 0.5], 180, 360, fill=hair)
    d.ellipse([x - hr * 0.42, hy - 4, x - hr * 0.42 + 9, hy + 5], fill=(40, 40, 50))
    d.ellipse([x + hr * 0.3, hy - 4, x + hr * 0.3 + 9, hy + 5], fill=(40, 40, 50))
    return (x, hy - hr)


def bubble(d, x, y, s, a, font=None, tail_x=None, side=None):
    if a <= 0.01:
        return
    font = font or F('sansb', 52)
    w = d.textlength(s, font=font) + 60
    hgt = font.size + 44
    box = [x - w / 2, y - hgt, x + w / 2, y]
    d.rounded_rectangle(box, radius=28, fill=mix(WHITE, a))
    if side == 'right':
        my = y - hgt / 2
        d.polygon([(x + w / 2 - 2, my - 16), (x + w / 2 - 2, my + 16), (x + w / 2 + 34, my + 4)], fill=mix(WHITE, a))
    else:
        tx = tail_x if tail_x is not None else x
        d.polygon([(tx - 18, y - 2), (tx + 18, y - 2), (tx + 4, y + 30)], fill=mix(WHITE, a))
    text(d, (x, y - hgt / 2), s, font, (30, 34, 44), a, anchor='mm', base=WHITE, rise=0)


def car(d, x, y, w=360, col=CAR_RED, ev=False):
    """x = left, y = ground line."""
    h = w * 0.32
    d.rounded_rectangle([x, y - h * 0.75, x + w, y - h * 0.15], radius=int(h * 0.2), fill=col)
    d.rounded_rectangle([x + w * 0.2, y - h * 1.2, x + w * 0.72, y - h * 0.65], radius=int(h * 0.25), fill=col)
    d.rounded_rectangle([x + w * 0.25, y - h * 1.1, x + w * 0.44, y - h * 0.72], radius=10, fill=GLASS)
    d.rounded_rectangle([x + w * 0.48, y - h * 1.1, x + w * 0.67, y - h * 0.72], radius=10, fill=GLASS)
    for cx in (x + w * 0.22, x + w * 0.78):
        d.ellipse([cx - h * 0.27, y - h * 0.42, cx + h * 0.27, y + h * 0.12], fill=(28, 30, 36))
        d.ellipse([cx - h * 0.12, y - h * 0.27, cx + h * 0.12, y - h * 0.03], fill=(150, 156, 166))
    d.ellipse([x + w - 26, y - h * 0.6, x + w - 6, y - h * 0.42], fill=(255, 236, 160))
    if ev:
        bx = x + w * 0.5; by = y - h * 0.45
        d.polygon([(bx + 8, by - 34), (bx - 16, by + 4), (bx, by + 4), (bx - 8, by + 34), (bx + 16, by - 4), (bx, by - 4)], fill=AMBER)


def pump(d, x, y, price_txt, total_txt=None, hl=0.0):
    """x = left, y = ground. hl = highlight the total."""
    d.rounded_rectangle([x, y - 360, x + 170, y], radius=18, fill=(214, 70, 60))
    d.rounded_rectangle([x + 20, y - 330, x + 150, y - 190], radius=10, fill=(20, 24, 30))
    text(d, (x + 85, y - 296), total_txt or '', F('sansb', 44), mix(AMBER, 1.0, (20, 24, 30)) if hl else (120, 230, 140), 1, anchor='mm', base=(20, 24, 30), rise=0)
    text(d, (x + 85, y - 230), price_txt, F('sansm', 28), (200, 200, 200), 1, anchor='mm', base=(20, 24, 30), rise=0)
    d.rectangle([x + 150, y - 170, x + 200, y - 150], fill=(40, 40, 46))
    d.line([(x + 195, y - 160), (x + 230, y - 60), (x + 210, y - 30)], fill=(40, 40, 46), width=10)


def price_sign(d, x, y, price, a=1.0, label='REGULAR'):
    """Tall roadside sign, x = center, y = top."""
    d.rectangle([x - 14, y + 300, x + 14, y + 700], fill=(90, 98, 112))
    d.rounded_rectangle([x - 190, y, x + 190, y + 310], radius=22, fill=(240, 240, 236))
    d.rounded_rectangle([x - 190, y, x + 190, y + 70], radius=22, fill=CANOPY_RED)
    d.rectangle([x - 190, y + 46, x + 190, y + 70], fill=CANOPY_RED)
    text(d, (x, y + 36), 'GAS', F('sansb', 44), WHITE, 1, anchor='mm', base=CANOPY_RED, rise=0)
    text(d, (x, y + 108), label, F('sansb', 30), (60, 64, 74), 1, anchor='mm', base=(240, 240, 236), rise=0)
    d.rounded_rectangle([x - 160, y + 140, x + 160, y + 290], radius=14, fill=(20, 24, 30))
    text(d, (x, y + 216), price, F('sansb', 104), (255, 90, 70), a, anchor='mm', base=(20, 24, 30), rise=0)


def station(d, T, sign_price, sign_a=1.0):
    grad_sky(d)
    gy = 1250
    # canopy
    d.rectangle([40, 560, W - 470, 616], fill=CANOPY)
    d.rectangle([40, 616, W - 470, 640], fill=CANOPY_RED)
    for px in (90, W - 540):
        d.rectangle([px, 640, px + 34, gy], fill=(200, 204, 212))
    for i in range(5):
        lx = 130 + i * 100
        d.ellipse([lx, 640, lx + 46, 656], fill=(255, 248, 210))
    ground(d, gy, T, road=False)
    price_sign(d, W - 260, 400, sign_price, sign_a)
    return gy


def hud(T, d, label, show=True):
    """Time label (top-left) + live gas ticker (top-right)."""
    if not show:
        return
    a = 1.0
    pill(d, 190, 200, label, a, color=BG, fill=AMBER, font=F('sansb', 40))
    # ticker value
    stages = [(t_today, 3.78), (t_w1 + 0.3, 6.00), (t_m2 + 0.3, 8.00), (t_m3 + 0.3, 10.00)]
    v = stages[0][1]
    for i in range(1, len(stages)):
        t0, v1 = stages[i]
        p = ease(prog(T, t0, 1.2))
        if p > 0:
            v = stages[i - 1][1] + (v1 - stages[i - 1][1]) * p
    x0, y0 = W - 420, 150
    d.rounded_rectangle([x0, y0, x0 + 340, y0 + 150], radius=22, fill=(10, 16, 28), outline=(70, 86, 110), width=3)
    text(d, (x0 + 30, y0 + 22), 'GAS / GALLON (US AVG)', F('sansb', 22), MUTED, 1, base=(10, 16, 28), rise=0)
    col = CORAL if v > 5.02 else MINT
    text(d, (x0 + 30, y0 + 58), f'${v:,.2f}', F('sansb', 72), col, 1, base=(10, 16, 28), rise=0)


def fact_card(d, y, title, body, a, w=900):
    if a <= 0.01:
        return
    x0 = (W - w) / 2
    lines = ce.wrap(d, body, F('sansm', 44), w - 80)
    h = 120 + len(lines) * 56
    d.rounded_rectangle([x0, y, x0 + w, y + h], radius=26, fill=mix((250, 247, 238), a))
    d.rounded_rectangle([x0 + 30, y + 26, x0 + 30 + d.textlength(title, font=F('sansb', 30)) + 40, y + 74], radius=14, fill=mix(AMBER, a, (250, 247, 238)))
    text(d, (x0 + 50, y + 50), title, F('sansb', 30), (30, 30, 36), a, anchor='lm', base=AMBER, rise=0)
    for i, ln in enumerate(lines):
        text(d, (x0 + 40, y + 100 + i * 56), ln, F('sansm', 44), (30, 34, 44), a, base=(250, 247, 238), rise=0)


# ---------------- scenes ----------------
def s_hook(T, img, d):
    gy = station(d, T, '$10.00')
    car(d, 170, gy, 380, CAR_BLUE)
    pump(d, 600, gy, '$10.00/gal', '')
    mascot(img, (W - 350, 930), 300, T=T, start=0.2)
    chrome(img, d)
    # breaking-news lower third
    a = prog(T, 0.0, 0.25)
    y = 1270
    d.rectangle([40, y, 40 + 230, y + 70], fill=mix((210, 40, 40), a))
    text(d, (155, y + 35), 'BREAKING', F('sansb', 40), WHITE, a, anchor='mm', base=(210, 40, 40), rise=0)
    d.rectangle([270, y, 270 + 190, y + 70], fill=mix(AMBER, a))
    text(d, (365, y + 35), 'WHAT IF', F('sansb', 40), (30, 30, 30), a, anchor='mm', base=AMBER, rise=0)
    d.rectangle([40, y + 70, W - 40, y + 220], fill=mix(WHITE, a))
    text(d, (80, y + 145), 'GAS = $10 A GALLON', F('sansb', 92), (20, 24, 32), a, anchor='lm', base=WHITE, rise=0)
    d.rectangle([40, y + 220, W - 40, y + 268], fill=mix((16, 20, 30), a))
    text(d, (70, y + 244), 'CHARTOGRAPHY  ·  WHAT-IF SCENARIO  ·  NOT REAL NEWS', F('sansb', 26), CREAM, a, anchor='lm', base=(16, 20, 30), rise=0)


def s_today(T, img, d):
    gy = station(d, T, '$3.78')
    car(d, 170, gy, 380, CAR_BLUE)
    pump(d, 600, gy, '$3.78/gal', '')
    hud(T, d, 'TODAY')
    chrome(img, d, 'AAA national average, Nov 17, 2026')
    fact_card(d, 1290, 'TODAY', 'US average: $3.78 a gallon (AAA)', prog(T, t_378, 0.4))
    # the dial
    a = prog(T, t_dial, 0.3)
    if a > 0:
        cx, cy, r = 300, 400, 95
        d.ellipse([cx - r, cy - r, cx + r, cy + r], fill=mix((240, 240, 236), a), outline=mix(AMBER, a), width=10)
        ang = math.radians(220 - 200 * ease(prog(T, t_dial + 0.4, 1.4)))
        d.line([(cx, cy), (cx + math.cos(ang) * r * 0.8, cy - math.sin(ang) * r * 0.8)], fill=mix(CORAL, a), width=14)
        d.ellipse([cx - 16, cy - 16, cx + 16, cy + 16], fill=mix((40, 40, 46), a))
        text(d, (cx + r + 40, cy), 'TURN IT UP', F('sansb', 36), AMBER, a, anchor='lm', rise=0)


def s_week1(T, img, d):
    gy = station(d, T, '$6.00')
    car(d, 120, gy, 400, CAR_RED)
    p = prog(T, t_57, 1.2)
    if T < t_90:
        tot = 56.7 * ease(p)
    else:
        tot = 90.0
    pump(d, 560, gy, '$6.00/gal', f'${tot:,.2f}', hl=T >= t_90)
    person(d, 860, gy, 420, T=T, arm_up=1.0 if T >= t_90 else 0.0)
    hud(T, d, 'WEEK 1')
    chrome(img, d, 'Illustration: 15-gallon tank; AAA average $3.78 (Nov 17, 2026)')
    text(d, (860, 1300), 'Dana', F('hand', 72), AMBER, prog(T, t_dana), anchor='mm', base=ASPHALT)
    bubble(d, 560, 860, '$90?!', prog(T, t_90, 0.25), font=F('sansb', 72), side='right')
    text(d, (90, 1360), '15-gallon fill-up', F('sansm', 46), MUTED, prog(T, t_57), base=ASPHALT)
    a57 = prog(T, t_57, 0.3)
    if a57 > 0:
        text(d, (90, 1420), '$57', F('sansb', 96), CREAM, a57, base=ASPHALT)
        if T >= t_90:
            d.line([(80, 1490), (300, 1440)], fill=CORAL, width=10)
    text(d, (330, 1420), '->  $90', F('sansb', 96), CORAL, prog(T, t_90), base=ASPHALT)


def s_fact(T, img, d):
    grad_sky(d)
    hud(T, d, 'WEEK 1')
    # price ladder
    x0, y0, y1 = 220, 1300, 520
    def yv(v):
        return y0 - (v - 3.0) / (6.5 - 3.0) * (y0 - y1)
    d.line([(x0, y0), (x0, y1)], fill=SLATE, width=6)
    for v in (3, 4, 5, 6):
        text(d, (x0 - 30, yv(v)), f'${v}', F('sansm', 40), MUTED, 1, anchor='rm', rise=0)
        d.line([(x0 - 10, yv(v)), (x0 + 10, yv(v))], fill=SLATE, width=4)
    ar = prog(T, t_501, 0.4)
    if ar > 0:
        d.line([(x0, yv(5.01)), (W - 120, yv(5.01))], fill=mix(AMBER, ar), width=6)
        text(d, (x0 + 30, yv(5.01) - 40), 'RECORD: $5.01 (June 2022)', F('sansb', 40), AMBER, ar, anchor='lm')
    ab = prog(T, t_blew, 0.4)
    if ab > 0:
        y = yv(6.0)
        d.ellipse([x0 - 22, y - 22, x0 + 22, y + 22], fill=mix(CORAL, ab))
        text(d, (x0 + 40, y), 'WE ARE HERE: $6.00', F('sansb', 52), CORAL, ab, anchor='lm')
    d.ellipse([x0 - 18, yv(3.78) - 18, x0 + 18, yv(3.78) + 18], fill=MINT)
    text(d, (x0 + 40, yv(3.78)), 'Today: $3.78', F('sansb', 44), MINT, 1, anchor='lm')
    fact_card(d, 1380, 'REAL FACT', 'The highest US average ever was $5.01 a gallon, in June 2022 (AAA).', prog(T, t_fact, 0.4))
    mascot(img, (W - 330, 960), 260, T=T, start=t_blew)
    chrome(img, d, 'AAA (June 13, 2022; Nov 17, 2026)')


def truck(d, x, y, w=620):
    h = w * 0.42
    d.rounded_rectangle([x, y - h, x + w * 0.7, y - h * 0.18], radius=12, fill=(236, 238, 242))
    text(d, (x + w * 0.35, y - h * 0.6), 'FREIGHT', F('sansb', int(w * 0.07)), SLATE, 1, anchor='mm', base=(236, 238, 242), rise=0)
    d.rounded_rectangle([x + w * 0.72, y - h * 0.8, x + w, y - h * 0.18], radius=18, fill=CAR_BLUE)
    d.rounded_rectangle([x + w * 0.8, y - h * 0.72, x + w * 0.96, y - h * 0.48], radius=8, fill=GLASS)
    for cx in (x + w * 0.12, x + w * 0.3, x + w * 0.86):
        d.ellipse([cx - h * 0.13, y - h * 0.3, cx + h * 0.13, y - h * 0.04], fill=(28, 30, 36))


def shelf(d, T, x0, y0, w, start):
    items = [((230, 90, 80), 'MILK', 4.29), ((240, 190, 80), 'BREAD', 3.49), ((120, 190, 110), 'APPLES', 2.19), ((150, 120, 220), 'CEREAL', 5.79)]
    d.rounded_rectangle([x0, y0, x0 + w, y0 + 520], radius=18, fill=(232, 228, 216))
    for r in range(2):
        d.rectangle([x0, y0 + 250 + r * 250, x0 + w, y0 + 266 + r * 250], fill=(170, 160, 140))
    iw = w / 4
    for i, (col, name, pr) in enumerate(items):
        cx = x0 + iw * (i + 0.5)
        d.rounded_rectangle([cx - 60, y0 + 70, cx + 60, y0 + 250], radius=12, fill=col)
        text(d, (cx, y0 + 160), name, F('sansb', 26), WHITE, 1, anchor='mm', base=col, rise=0)
        up = prog(T, start + 0.25 * i, 0.4)
        tag_col = mix(CORAL, up, (250, 250, 250)) if up > 0 else (250, 250, 250)
        d.rounded_rectangle([cx - 70, y0 + 290, cx + 70, y0 + 360], radius=10, fill=(250, 250, 250))
        d.rectangle([cx - 70, y0 + 290, cx - 60, y0 + 360], fill=tag_col)
        text(d, (cx + 4, y0 + 325), 'UP' if up > 0.5 else 'TAG', F('sansb', 34), CORAL if up > 0.5 else (90, 90, 96), 1, anchor='mm', base=(250, 250, 250), rise=0)
        if up > 0:
            ay = y0 + 420 - 40 * ease(up)
            d.polygon([(cx, ay - 40), (cx - 30, ay), (cx + 30, ay)], fill=mix(CORAL, up, (232, 228, 216)))
            d.rectangle([cx - 10, ay, cx + 10, ay + 50], fill=mix(CORAL, up, (232, 228, 216)))


def s_month2(T, img, d):
    grad_sky(d, 0, 900)
    ground(d, 900, T)
    tx = -380 + (W + 380) * prog(T, t_m2 - 0.2, 4.0)
    truck(d, tx, 1010)
    hud(T, d, 'MONTH 2')
    fact_card(d, 420, 'REAL FACT', 'US trucks moved 11.27 billion tons of freight in 2024 (ATA).', prog(T, t_trucks, 0.4))
    a = prog(T, t_shelf - 0.4, 0.4)
    if a > 0:
        shelf(d, T, 90, 1080, W - 180, t_shelf + 0.2)
        person(d, 860, 1660, 330, skin=SKIN2, hair=(30, 26, 24), top=CAR_GREEN, pants=(70, 70, 90), T=T, hair_long=False)
        bubble(d, W / 2 + 160, 1070, 'Wait... why?', prog(T, t_shelf + 1.3, 0.3), font=F('sansb', 48), tail_x=W / 2 + 260)
    chrome(img, d, 'ATA American Trucking Trends (2024 data)')


def s_month3(T, img, d):
    grad_sky(d)
    hud(T, d, 'MONTH 3')
    d.rounded_rectangle([70, 380, W - 70, 1500], radius=30, fill=PANEL)
    text(d, (W / 2, 450), 'ONE DRIVER, ONE YEAR', F('sansb', 40), MINT, prog(T, t_m3 + 0.3), anchor='mm', base=PANEL)
    text(d, (W / 2, 560), '13,735 miles', F('serifb', 110), CREAM, prog(T, t_miles + 0.5, 0.3), anchor='mm', base=PANEL)
    text(d, (W / 2, 650), 'average per licensed driver (FHWA, 2024)', F('sansm', 34), MUTED, prog(T, t_miles + 0.8), anchor='mm', base=PANEL)
    text(d, (W / 2, 740), 'at 25 mpg = about 549 gallons', F('sansb', 48), AMBER, prog(T, t_mpg + 0.2), anchor='mm', base=PANEL)
    # bars
    bx0, bw = 200, W - 420
    for i, (lab, val, t0, col) in enumerate([('Gas at $3.78', 2077, t_2100, MINT), ('Gas at $10', 5494, t_5500, CORAL)]):
        y = 860 + i * 190
        a = prog(T, t0, 0.3)
        text(d, (bx0, y), lab, F('sansb', 40), CREAM, a, anchor='lm', base=PANEL)
        g = ease(prog(T, t0 + 0.2, 1.0))
        d.rounded_rectangle([bx0, y + 40, bx0 + max(4, bw * val / 5600 * g), y + 120], radius=14, fill=mix(col, a, PANEL))
        if g > 0.9:
            text(d, (bx0 + bw * val / 5600 - 20, y + 80), f'${val:,}', F('sansb', 52), BG, 1, anchor='rm', base=col, rise=0)
    ae = prog(T, t_extra, 0.3)
    if ae > 0:
        f = F('serifb', 96); s = '+$3,400 a year'
        w = d.textlength(s, font=f) + 80
        d.rounded_rectangle([W / 2 - w / 2, 1270, W / 2 + w / 2, 1420], radius=20, outline=mix(CORAL, ae, PANEL), width=10)
        text(d, (W / 2, 1345), s, f, CORAL, ae, anchor='mm', base=PANEL, rise=0)
    text(d, (W / 2, 1460), 'Illustration: Chartography math, 25 mpg assumed', F('sansm', 28), MUTED, prog(T, t_mpg), anchor='mm', base=PANEL)
    chrome(img, d, 'FHWA Our Nation\'s Highways 2026; AAA (Nov 17, 2026)')


def derrick(d, x, y, s=1.0):
    d.polygon([(x, y - 260 * s), (x - 90 * s, y), (x + 90 * s, y)], outline=(220, 220, 228), width=8)
    d.line([(x - 60 * s, y - 80 * s), (x + 60 * s, y - 80 * s)], fill=(220, 220, 228), width=6)
    d.line([(x - 35 * s, y - 160 * s), (x + 35 * s, y - 160 * s)], fill=(220, 220, 228), width=6)
    d.ellipse([x - 26 * s, y - 40 * s, x + 26 * s, y + 4 * s], fill=(30, 30, 30))


def laptop_house(d, x, y):
    d.polygon([(x - 120, y - 170), (x, y - 270), (x + 120, y - 170)], fill=CORAL)
    d.rectangle([x - 100, y - 170, x + 100, y], fill=(236, 230, 214))
    d.rounded_rectangle([x - 50, y - 120, x + 50, y - 50], radius=6, fill=(40, 60, 90))
    d.rectangle([x - 62, y - 50, x + 62, y - 38], fill=(150, 156, 166))


def van(d, x, y, w=300):
    h = w * 0.5
    d.rounded_rectangle([x, y - h, x + w, y - h * 0.15], radius=20, fill=(240, 240, 236))
    d.rounded_rectangle([x + w * 0.66, y - h * 0.9, x + w * 0.92, y - h * 0.55], radius=8, fill=GLASS)
    text(d, (x + w * 0.33, y - h * 0.55), 'DELIVERY', F('sansb', int(w * 0.08)), SLATE, 1, anchor='mm', base=(240, 240, 236), rise=0)
    for cx in (x + w * 0.2, x + w * 0.8):
        d.ellipse([cx - h * 0.17, y - h * 0.3, cx + h * 0.17, y + h * 0.04], fill=(28, 30, 36))


def s_split(T, img, d):
    grad_sky(d)
    hud(T, d, 'MONTH 3')
    # wins half
    d.rounded_rectangle([50, 380, W - 50, 930], radius=28, fill=(18, 52, 52))
    text(d, (100, 430), 'WINS', F('sansb', 56), MINT, prog(T, t_wins), base=(18, 52, 52), rise=0)
    if T >= t_ev - 0.1:
        a = prog(T, t_ev, 0.3)
        car(d, 90, 860 + (1 - a) * 40, 300, CAR_GREEN, ev=True)
        text(d, (240, 900), 'Electric cars', F('sansb', 32), CREAM, a, anchor='mm', base=(18, 52, 52), rise=0)
    if T >= t_home - 0.1:
        a = prog(T, t_home, 0.3)
        laptop_house(d, W / 2 + 20, 860 + (1 - a) * 40)
        text(d, (W / 2 + 20, 900), 'Work from home', F('sansb', 32), CREAM, a, anchor='mm', base=(18, 52, 52), rise=0)
    if T >= t_oil - 0.1:
        a = prog(T, t_oil, 0.3)
        derrick(d, W - 220, 860 + (1 - a) * 40, 0.9)
        text(d, (W - 220, 900), 'Oil producers', F('sansb', 32), CREAM, a, anchor='mm', base=(18, 52, 52), rise=0)
    # loses half
    d.rounded_rectangle([50, 960, W - 50, 1510], radius=28, fill=(60, 30, 34))
    text(d, (100, 1010), 'LOSES', F('sansb', 56), CORAL, prog(T, t_loses), base=(60, 30, 34), rise=0)
    if T >= t_comm - 0.1:
        a = prog(T, t_comm, 0.3)
        d.line([(80, 1420), (380, 1300)], fill=mix(LINE_Y, a, (60, 30, 34)), width=8)
        car(d, 100, 1440 + (1 - a) * 40, 260, CAR_RED)
        text(d, (230, 1480), 'Long commutes', F('sansb', 32), CREAM, a, anchor='mm', base=(60, 30, 34), rise=0)
    if T >= t_deliv - 0.1:
        a = prog(T, t_deliv, 0.3)
        van(d, W / 2 - 130, 1440 + (1 - a) * 40, 280)
        text(d, (W / 2 + 10, 1480), 'Delivery drivers', F('sansb', 32), CREAM, a, anchor='mm', base=(60, 30, 34), rise=0)
    if T >= t_far - 0.1:
        a = prog(T, t_far, 0.3)
        hx = W - 210
        d.polygon([(hx - 70, 1330), (hx, 1270), (hx + 70, 1330)], fill=mix(SLATE, a, (60, 30, 34)))
        d.rectangle([hx - 55, 1330, hx + 55, 1430], fill=mix((236, 230, 214), a, (60, 30, 34)))
        text(d, (hx, 1480), 'Live far from work', F('sansb', 32), CREAM, a, anchor='mm', base=(60, 30, 34), rise=0)
    chrome(img, d)


def s_end(T, img, d):
    grad_sky(d)
    text(d, (W / 2, 380), 'At $10 a gallon,', F('serif', 84), CREAM, prog(T, t_ask), anchor='mm')
    text(d, (W / 2, 490), 'what would you', F('serifb', 96), AMBER, prog(T, t_ask + 0.6), anchor='mm')
    text(d, (W / 2, 600), 'give up first?', F('serifb', 96), AMBER, prog(T, t_ask + 0.9), anchor='mm')
    mascot(img, (W / 2 - 250, 700), 380, T=T, start=t_ask + 0.3)
    text(d, (W / 2, 1180), 'Comment below', F('hand', 80), MINT, prog(T, t_sub), anchor='mm')
    pill(d, W / 2, 1320, 'Subscribe for the next WHAT IF', prog(T, t_sub + 0.8), color=BG, fill=MINT, font=F('sansb', 46))
    chrome(img, d)


scenes = [ce.Scene(0, s_hook), ce.Scene(t_today - 0.2, s_today), ce.Scene(t_w1 - 0.2, s_week1),
          ce.Scene(t_fact - 0.2, s_fact), ce.Scene(t_m2 - 0.2, s_month2), ce.Scene(t_m3 - 0.2, s_month3),
          ce.Scene(t_wins - 0.2, s_split), ce.Scene(t_ask - 0.25, s_end)]

if __name__ == '__main__':
    if sys.argv[1:] == ['stills']:
        pts = [('hook', 1.5), ('today', t_w1 - 0.4), ('week1', t_fact - 0.4), ('fact', t_m2 - 0.4), ('m2', t_m3 - 0.4),
               ('m3', t_wins - 0.4), ('split', t_ask - 0.5), ('end', DUR + 1.0)]
        for n, T in pts:
            ce.still(scenes, T, f'{HERE}/still_{n}.png', DUR + 1.8)
    else:
        ce.render(scenes, AUD, HERE + '/final.mp4', tail=1.8)
        print(ce.sync_report(c, HERE + '/sync.json'))
