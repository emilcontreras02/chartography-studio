import json, math, sys, subprocess, os
from PIL import Image, ImageDraw, ImageFont

W, H, FPS = 1920, 1080, 30
HERE = os.path.dirname(os.path.abspath(__file__))
BG = (14, 27, 46)
CREAM = (246, 241, 231)
MINT = (63, 214, 160)
AMBER = (242, 181, 68)
MUTED = (175, 184, 198)
SLATE = (92, 115, 146)
CORAL = (255, 138, 101)
PANEL = (22, 40, 63)
AUDIO_END = 376.19
TAIL = 2.5

INTER = '/usr/share/fonts/opentype/inter/'
_fc = {}
def F(kind, size):
    key = (kind, size)
    if key not in _fc:
        path = {
            'serif': HERE + '/fonts/Fraunces-600.ttf',
            'serifb': HERE + '/fonts/Fraunces-700.ttf',
            'hand': HERE + '/fonts/Caveat-600.ttf',
            'sans': INTER + 'Inter-Regular.otf',
            'sansm': INTER + 'Inter-Medium.otf',
            'sansb': INTER + 'Inter-SemiBold.otf',
        }[kind]
        _fc[key] = ImageFont.truetype(path, size)
    return _fc[key]

def clamp(x, a=0.0, b=1.0):
    return max(a, min(b, x))

def ease(x):
    x = clamp(x)
    return 1 - (1 - x) ** 3

def prog(t, a, dur=0.6):
    return ease((t - a) / dur)

def mix(c, a, base=BG):
    return tuple(int(base[i] + (c[i] - base[i]) * a) for i in range(3))

def text(d, xy, s, font, color=CREAM, a=1.0, anchor='la', rise=24, base=BG):
    if a <= 0.001:
        return
    x, y = xy
    y += (1 - a) * rise
    d.text((x, y), s, font=font, fill=mix(color, a, base), anchor=anchor)

def fmt_int(n):
    return f"{int(round(n)):,}"

# ---------- timing ----------
segs = json.load(open(HERE + '/segs.json'))
by_p = {}
for g in segs:
    by_p.setdefault(g['p'], []).append(g)

# ---------- logo ----------
def bez(p0, p1, p2, p3, n=24):
    pts = []
    for i in range(n + 1):
        t = i / n
        u = 1 - t
        pts.append((u**3*p0[0] + 3*u*u*t*p1[0] + 3*u*t*t*p2[0] + t**3*p3[0],
                    u**3*p0[1] + 3*u*u*t*p1[1] + 3*u*t*t*p2[1] + t**3*p3[1]))
    return pts

def path_pts(start, curves):
    pts = [start]
    cur = start
    for c in curves:
        seg = bez(cur, c[0], c[1], c[2])
        pts += seg[1:]
        cur = c[2]
    return pts

LINE = path_pts((168, 566), [((214, 556), (236, 510), (276, 478)), ((312, 450), (346, 446), (374, 462)),
                             ((404, 480), (424, 502), (452, 486)), ((494, 462), (516, 378), (556, 316)),
                             ((580, 280), (600, 258), (618, 246))])
BASE = path_pts((150, 628), [((260, 620), (380, 636), (500, 624)), ((560, 618), (620, 626), (652, 620))])
RING = path_pts((682, 216), [((670, 178), (600, 170), (574, 206)), ((548, 242), (566, 294), (618, 302)),
                             ((664, 308), (698, 280), (692, 242)), ((690, 226), (678, 212), (662, 206))])

_logo = {}
def logo(size, tile=PANEL):
    if size in _logo:
        return _logo[size]
    S = 800
    im = Image.new('RGB', (S, S), tile)
    d = ImageDraw.Draw(im)
    d.line(BASE, fill=MINT, width=16, joint='curve')
    d.line(LINE, fill=CREAM, width=40, joint='curve')
    for p in (LINE[0], LINE[-1]):
        d.ellipse([p[0]-20, p[1]-20, p[0]+20, p[1]+20], fill=CREAM)
    for p in ((276, 478), (374, 462), (452, 486)):
        d.ellipse([p[0]-15, p[1]-15, p[0]+15, p[1]+15], fill=tile)
    d.ellipse([622-36, 242-36, 622+36, 242+36], fill=AMBER)
    d.line(RING, fill=AMBER, width=10, joint='curve')
    im = im.resize((size, size), Image.LANCZOS)
    mask = Image.new('L', (size*4, size*4), 0)
    ImageDraw.Draw(mask).rounded_rectangle([0, 0, size*4-1, size*4-1], radius=int(size*4*0.22), fill=255)
    mask = mask.resize((size, size), Image.LANCZOS)
    _logo[size] = (im, mask)
    return _logo[size]

def paste_logo(img, size, xy, a=1.0):
    im, mask = logo(size)
    if a < 1:
        mask = mask.point(lambda v: int(v * a))
    img.paste(im, xy, mask)

# ---------- shared chrome ----------
def chrome(img, d, source=None, a=1.0):
    paste_logo(img, 44, (W - 120 - 44 - 250, 1004))
    d.text((W - 120 - 236, 1026), 'Chartography', font=F('serif', 30), fill=MUTED, anchor='lm')
    if source:
        d.text((120, 1026), 'Source: ' + source, font=F('sans', 22), fill=mix(MUTED, 0.85*a), anchor='lm')

def eyebrow(d, s, a=1.0, xy=(120, 120)):
    text(d, xy, s, F('sansb', 28), MINT, a, rise=10)

def pill(d, cx, cy, s, a, color=CREAM, fill=PANEL, font=None):
    if a <= 0.001:
        return
    font = font or F('sansm', 40)
    w = d.textlength(s, font=font) + 72
    hgt = 86
    cy += (1 - a) * 20
    d.rounded_rectangle([cx - w/2, cy - hgt/2, cx + w/2, cy + hgt/2], radius=43, fill=mix(fill, a))
    d.text((cx, cy), s, font=font, fill=mix(color, a, fill), anchor='mm')

def hand_underline(d, x0, x1, y, p, color=MINT, width=8):
    if p <= 0:
        return
    pts = []
    n = 40
    for i in range(n + 1):
        u = i / n
        if u > p:
            break
        x = x0 + (x1 - x0) * u
        yy = y + math.sin(u * 3.1) * 6 - u * 8
        pts.append((x, yy))
    if len(pts) > 1:
        d.line(pts, fill=color, width=width, joint='curve')

def calendar(d, x0, y0, filled, cols=25, cell=34, gap=7, total=365, a=1.0, color=AMBER):
    for i in range(total):
        r, c = divmod(i, cols)
        x = x0 + c * (cell + gap)
        y = y0 + r * (cell + gap)
        on = i < filled
        col = color if on else (34, 56, 84)
        d.rounded_rectangle([x, y, x + cell, y + cell], radius=7, fill=mix(col, a))

# ---------- scenes ----------
def T(p, k=0):
    return by_p[p][k]['t0']

def s1(t, img, d, st):
    eyebrow(d, 'THE RICHEST PERSON ON EARTH', prog(t, 0.2))
    text(d, (W/2, 330), 'Elon Musk', F('serif', 96), CREAM, prog(t, 0.4), anchor='mm')
    c = ease((t - 0.8) / 3.2)
    if t > 0.6:
        val = 869e9 * c
        text(d, (W/2, 560), '$' + fmt_int(val), F('serifb', 156), MINT, prog(t, 0.6, 0.4), anchor='mm')
    a2 = prog(t, T(0, 1) - st)
    text(d, (W/2, 720), "his fortune, according to Forbes (Nov 1, 2026)", F('hand', 64), AMBER, a2, anchor='mm')
    chrome(img, d, 'Forbes, Nov 1, 2026')

def s2(t, img, d, st):
    a = prog(t, T(1, 1) - st)
    text(d, (W/2, 300), 'What if he gave it all away?', F('serif', 100), CREAM, a, anchor='mm')
    text(d, (W/2, 420), 'Every last dollar, split evenly.', F('sans', 46), MUTED, prog(t, T(1, 2) - st), anchor='mm')
    qs = ['End poverty?', 'Make us all rich?', 'Something strange?']
    xs = [W/2 - 560, W/2, W/2 + 560]
    for i, q in enumerate(qs):
        pill(d, xs[i], 650, q, prog(t, T(1, 3 + i) - st), color=AMBER if i == 2 else CREAM)
    chrome(img, d)

def s3(t, img, d, st):
    a = prog(t, 0.1, 0.5)
    text(d, (W/2, 470), "Let's do the math.", F('hand', 170), AMBER, a, anchor='mm')
    tw = d.textlength("Let's do the math.", font=F('hand', 170))
    hand_underline(d, W/2 - tw/2, W/2 + tw/2, 575, ease((t - 0.6) / 0.9), MINT, 10)
    text(d, (W/2, 700), "The answer isn't what most people expect.", F('sans', 44), MUTED, prog(t, T(2, 1) - st), anchor='mm')
    chrome(img, d)

RICH = [('Elon Musk', 869), ('Jeff Bezos', 361), ('Larry Page', 233), ('Michael Dell', 229), ('Sergey Brin', 214)]
def s4(t, img, d, st):
    eyebrow(d, 'HOW BIG IS $869 BILLION?', prog(t, 0.2))
    text(d, (120, 165), "World's richest people, net worth", F('serif', 60), CREAM, prog(t, 0.3), rise=14)
    g0 = T(4, 0) - st
    x0, maxw = 470, 1100
    for i, (name, v) in enumerate(RICH):
        y = 300 + i * 95
        a = prog(t, g0 + i * 0.15, 0.4)
        text(d, (x0 - 30, y + 30), name, F('sansm', 36), CREAM, a, anchor='rm', rise=0)
        p = ease((t - g0 - i * 0.15) / 1.2)
        w = maxw * v / 869 * p
        col = MINT if i == 0 else SLATE
        if w > 2:
            d.rounded_rectangle([x0, y + 6, x0 + w, y + 54], radius=8, fill=col)
        if p > 0.05:
            text(d, (x0 + w + 20, y + 30), f'${v}B', F('sansb', 36), CREAM, clamp(p * 1.5), anchor='lm', rise=0)
    a2 = prog(t, T(4, 1) - st)
    text(d, (x0 + maxw + 20, 262), '2.4× Bezos', F('hand', 56), AMBER, a2, anchor='lm', rise=10)
    a3 = prog(t, T(4, 2) - st)
    if a3 > 0:
        y = 790
        text(d, (x0 - 30, y + 30), 'Next 3 combined', F('sansm', 36), AMBER, a3, anchor='rm', rise=0)
        xx = x0
        for j, (name, v) in enumerate(RICH[1:4]):
            pj = ease((t - (T(4, 2) - st) - j * 0.35) / 0.7)
            w = maxw * v / 869 * pj
            if w > 2:
                d.rounded_rectangle([xx, y + 6, xx + w - 4, y + 54], radius=8, fill=[SLATE, (120, 142, 172), (150, 168, 194)][j])
                if pj > 0.9:
                    d.text((xx + w / 2, y + 30), name.split()[1], font=F('sansm', 26), fill=BG, anchor='mm')
            xx += w
        text(d, (xx + 20, y + 30), '$823B', F('sansb', 36), CREAM, prog(t, T(4, 2) - st + 1.1), anchor='lm', rise=0)
        mx = x0 + maxw
        d.line([(mx, 290), (mx, 860)], fill=mix(MINT, a3 * 0.8), width=3)
        text(d, (mx + 14, 882), 'still less than Musk', F('hand', 48), MINT, prog(t, T(4, 2) - st + 1.4), anchor='lm', rise=6)
    chrome(img, d, 'Forbes real-time list, Nov 1, 2026')

def s5(t, img, d, st):
    eyebrow(d, 'ANOTHER WAY TO SEE IT', prog(t, 0.2))
    a1 = prog(t, T(5, 1) - st)
    text(d, (120, 240), '$7.4 trillion', F('serifb', 100), CREAM, a1)
    text(d, (124, 365), 'US federal spending, fiscal 2026', F('sans', 36), MUTED, a1)
    a2 = prog(t, T(5, 2) - st)
    text(d, (120, 460), 'About $20 billion', F('serifb', 80), MINT, a2)
    text(d, (124, 565), 'every single day', F('sans', 36), MUTED, a2)
    a3 = prog(t, T(5, 3) - st)
    gx, gy = 900, 250
    if a3 > 0:
        fill_n = int(43 * ease((t - (T(5, 3) - st) - 0.6) / 2.0))
        calendar(d, gx, gy, fill_n, a=a3, cell=30, gap=6)
        text(d, (gx, gy - 60), 'One year of US government spending  (1 square = 1 day)', F('sans', 30), MUTED, a3, rise=6)
    a4 = prog(t, T(5, 3) - st + 2.4)
    text(d, (120, 680), 'Musk = 43 days', F('serifb', 84), AMBER, a4)
    a5 = prog(t, T(6, 0) - st)
    text(d, (124, 830), 'Remember this number.', F('hand', 64), AMBER, a5)
    chrome(img, d, 'CBO Monthly Budget Review, Oct 2026')

def dots(d, a, dim=1.0, t=0):
    cols, rows = 48, 14
    for r in range(rows):
        for c in range(cols):
            x = 180 + c * 33
            y = 330 + r * 33
            ap = clamp(a * 3 - (c + r) / (cols + rows) * 2)
            if ap > 0:
                col = mix(CREAM, 0.55 * ap * dim)
                d.ellipse([x, y, x + 13, y + 13], fill=col)

def s6(t, img, d, st):
    eyebrow(d, 'THE BIG SPLIT', prog(t, 0.2))
    a1 = prog(t, T(7, 1) - st, 1.5)
    k = T(8, 0) - st
    dim = 1 - 0.75 * prog(t, k, 0.6)
    dots(d, a1, dim)
    text(d, (W/2, 230), '8.3 billion people', F('serif', 84), CREAM, prog(t, T(7, 1) - st), anchor='mm')
    if t > k:
        a = prog(t, k)
        d.rounded_rectangle([360, 330, W - 360, 800], radius=36, fill=mix(PANEL, a))
        text(d, (W/2, 440), '$869B  ÷  8.3B people', F('serif', 80), CREAM, a, anchor='mm', base=PANEL)
        c = ease((t - k - 1.6) / 1.6)
        if t > k + 1.4:
            text(d, (W/2, 640), '= $' + str(int(round(104 * c))) + ' each', F('serifb', 170), MINT, prog(t, k + 1.4, 0.4), anchor='mm', base=PANEL)
    a9 = prog(t, T(9, 0) - st)
    text(d, (W/2, 900), "That's it. One hundred and four dollars.", F('hand', 66), AMBER, a9, anchor='mm')
    chrome(img, d, 'Forbes; Worldometer (UN data), Nov 2026')

def card(d, x0, y0, x1, y1, a, fill=PANEL):
    d.rounded_rectangle([x0, y0 + (1 - a) * 30, x1, y1 + (1 - a) * 30], radius=32, fill=mix(fill, a))

def s7(t, img, d, st):
    eyebrow(d, 'SAME $104, DIFFERENT WORLDS', prog(t, 0.2))
    a = prog(t, 0.3)
    card(d, 120, 220, 930, 800, a)
    text(d, (180, 280), 'For many viewers', F('sansb', 34), MUTED, a, base=PANEL)
    text(d, (180, 350), 'a nice dinner out', F('serif', 70), CREAM, prog(t, 0.5), base=PANEL)
    text(d, (180, 450), 'or new shoes', F('serif', 70), CREAM, prog(t, 1.4), base=PANEL)
    text(d, (180, 640), "Pleasant. Not life-changing.", F('hand', 62), MUTED, prog(t, T(10, 1) - st), base=PANEL)
    b = prog(t, T(11, 0) - st)
    card(d, 990, 220, 1800, 800, b)
    text(d, (1050, 280), 'Living on less than $3 a day', F('sansb', 34), MUTED, b, base=PANEL)
    text(d, (1050, 350), '34+ days', F('serifb', 130), AMBER, prog(t, T(11, 0) - st + 0.8), base=PANEL)
    text(d, (1050, 520), 'of living', F('serif', 70), CREAM, prog(t, T(11, 0) - st + 1.0), base=PANEL)
    text(d, (W/2, 900), 'Same money. Completely different meaning.', F('hand', 68), MINT, prog(t, T(11, 1) - st), anchor='mm')
    chrome(img, d, 'World Bank $3.00/day extreme poverty line')

def s8(t, img, d, st):
    eyebrow(d, 'ONLY AMERICANS?', prog(t, 0.2))
    text(d, (W/2, 280), 'What if only Americans got it?', F('serif', 92), CREAM, prog(t, T(12, 1) - st), anchor='mm')
    a1 = prog(t, T(13, 0) - st)
    text(d, (W/2, 430), '$869B  ÷  342 million people', F('serif', 72), MUTED, a1, anchor='mm')
    k = T(13, 1) - st
    c = ease((t - k - 0.3) / 1.8)
    if t > k:
        text(d, (W/2, 620), '$' + fmt_int(2540 * c), F('serifb', 210), MINT, prog(t, k, 0.4), anchor='mm')
        text(d, (W/2, 790), 'for every adult and every kid', F('hand', 66), AMBER, prog(t, k + 1.6), anchor='mm')
    chrome(img, d, 'US Census Bureau (Jul 1, 2025 estimate)')

def s9(t, img, d, st):
    eyebrow(d, "WE'VE TRIED THIS BEFORE", prog(t, 0.2))
    text(d, (120, 165), 'Pandemic stimulus checks, 2020–2021', F('serif', 64), CREAM, prog(t, T(14, 1) - st), rise=14)
    x0, maxw = 560, 1000
    kb = T(14, 3) - st
    for i, (lab, sub, v, col) in enumerate([('Stimulus checks', '476M payments, 3 rounds', 814, SLATE), ("Musk's fortune", 'Nov 1, 2026', 869, MINT)]):
        y = 300 + i * 130
        a = prog(t, kb + i * 0.5)
        text(d, (x0 - 30, y + 22), lab, F('sansm', 38), CREAM, a, anchor='rm', rise=0)
        text(d, (x0 - 30, y + 66), sub, F('sans', 26), MUTED, a, anchor='rm', rise=0)
        p = ease((t - kb - i * 0.5) / 1.2)
        w = maxw * v / 869 * p
        if w > 2:
            d.rounded_rectangle([x0, y + 4, x0 + w, y + 84], radius=10, fill=col)
        if p > 0.05:
            text(d, (x0 + w + 22, y + 44), f'${v}B', F('sansb', 44), CREAM, clamp(p * 1.5), anchor='lm', rise=0)
    text(d, (1800, 560), 'almost the same!', F('hand', 64), AMBER, prog(t, T(15, 0) - st), anchor='rm')
    k16 = T(16, 2) - st
    chips = ['Paid bills', 'Paid down debt', 'Spent it']
    for i, c in enumerate(chips):
        pill(d, 520 + i * 440, 640, c, prog(t, k16 + i * 0.45))
    text(d, (W/2, 770), 'Did it push prices up? Economists still debate it.', F('sans', 42), MUTED, prog(t, T(16, 3) - st), anchor='mm')
    text(d, (W/2, 880), 'One burst of cash is not lasting wealth', F('hand', 70), MINT, prog(t, T(16, 5) - st), anchor='mm')
    chrome(img, d, 'Pandemic Response Accountability Committee (IRS data)')

def yearbar(d, y, filled_days, a=1.0, label=True, col=MINT):
    x0, x1 = 160, 1760
    d.rounded_rectangle([x0, y, x1, y + 70], radius=35, fill=mix((34, 56, 84), a))
    w = (x1 - x0) * filled_days / 365
    if w > 70:
        d.rounded_rectangle([x0, y, x0 + w, y + 70], radius=35, fill=mix(col, a))
    if label:
        for m, name in enumerate(['Jan', 'Mar', 'May', 'Jul', 'Sep', 'Nov']):
            xx = x0 + (x1 - x0) * (m * 61) / 365
            d.text((xx + 8, y + 100), name, font=F('sans', 24), fill=mix(MUTED, a), anchor='lm')

def s10(t, img, d, st):
    eyebrow(d, 'AIM IT AT THE POOREST', prog(t, 0.2))
    text(d, (W/2, 250), 'What if it only went to the poorest?', F('serif', 84), CREAM, prog(t, 0.3), anchor='mm')
    a1 = prog(t, T(18, 1) - st)
    text(d, (W/2, 380), '838 million people live on less than $3 a day', F('sans', 46), MUTED, a1, anchor='mm')
    k = T(19, 0) - st
    c = ease((t - k - 0.8) / 1.6)
    if t > k:
        text(d, (W/2, 540), '$' + fmt_int(1040 * c) + ' each', F('serifb', 150), MINT, prog(t, k, 0.4), anchor='mm')
    k2 = T(20, 0) - st
    if t > k2:
        a = prog(t, k2)
        days = 346 * ease((t - k2 - 0.6) / 3.0)
        yearbar(d, 720, days, a)
        text(d, (160, 690), f'Days above the extreme poverty line: {int(days)}', F('sansb', 32), CREAM, a, anchor='ls', rise=0)
    text(d, (W/2, 960), 'Almost a full year.', F('hand', 66), AMBER, prog(t, T(20, 1) - st), anchor='mm')
    chrome(img, d, 'World Bank Poverty & Inequality Platform ($3.00/day line)')

def s11(t, img, d, st):
    a = prog(t, 0.2)
    yearbar(d, 200, 346, a * 0.6, label=False, col=SLATE)
    text(d, (W/2, 150), 'But notice the word: a year. Not forever.', F('sans', 40), MUTED, a, anchor='mm')
    k = T(21, 4) - st
    text(d, (W/2, 450), 'Day 347', F('serifb', 190), CORAL, prog(t, k, 0.5), anchor='mm')
    text(d, (W/2, 590), 'The money runs out.', F('serif', 70), CREAM, prog(t, k + 0.8), anchor='mm')
    items = ['No jobs', 'No roads', 'No schools', 'No stable government']
    fnt = F('sansm', 36)
    ws = [d.textlength(s, font=fnt) + 72 for s in items]
    x = W / 2 - (sum(ws) + 40 * 3) / 2
    for i, s in enumerate(items):
        pill(d, x + ws[i] / 2, 760, s, prog(t, k + 2.2 + i * 0.5), font=fnt)
        x += ws[i] + 40
    text(d, (W/2, 900), '...are still there.', F('hand', 66), AMBER, prog(t, k + 4.6), anchor='mm')
    chrome(img, d)

_donut_cache = {}
def donut(img, cx, cy, r, frac_sweep, a=1.0):
    key = (round(frac_sweep, 3), round(a, 2))
    if frac_sweep >= 0.999 and key in _donut_cache:
        layer, mask = _donut_cache[key]
    else:
        S = 2
        size = int(r * 2 * S) + 8
        layer = Image.new('RGB', (size, size), BG)
        mk = Image.new('L', (size, size), 0)
        dl = ImageDraw.Draw(layer)
        dm = ImageDraw.Draw(mk)
        box = [4, 4, size - 4, size - 4]
        total = 360 * frac_sweep
        sp = 360 * 0.79
        a1 = min(total, sp)
        if a1 > 0:
            dl.pieslice(box, -90, -90 + a1, fill=mix(MINT, a))
            dm.pieslice(box, -90, -90 + a1, fill=255)
        if total > sp:
            dl.pieslice(box, -90 + sp, -90 + total, fill=mix(SLATE, a))
            dm.pieslice(box, -90 + sp, -90 + total, fill=255)
        inner = int(r * 0.58 * S)
        c = size / 2
        dm.ellipse([c - inner, c - inner, c + inner, c + inner], fill=0)
        layer = layer.resize((size // S, size // S), Image.LANCZOS)
        mask = mk.resize((size // S, size // S), Image.LANCZOS)
        if frac_sweep >= 0.999:
            _donut_cache[key] = (layer, mask)
    img.paste(layer, (int(cx - layer.width / 2), int(cy - layer.height / 2)), mask)

def s12(t, img, d, st):
    eyebrow(d, 'THE TWIST', prog(t, 0.2))
    text(d, (W/2, 200), "Musk doesn't actually have $869 billion.", F('serif', 80), CREAM, prog(t, T(22, 1) - st), anchor='mm')
    text(d, (W/2, 300), 'not in cash, anyway', F('hand', 74), AMBER, prog(t, T(23, 0) - st), anchor='mm')
    k = T(24, 1) - st
    if t > k - 0.2:
        a = prog(t, k - 0.2)
        donut(img, 520, 650, 260, ease((t - k) / 1.6), a)
        text(d, (520, 650), 'mostly', F('sans', 34), MUTED, prog(t, k + 1.2), anchor='mm', rise=0)
        text(d, (520, 600), 'stock', F('serifb', 60), CREAM, prog(t, k + 1.2), anchor='mm', rise=0)
        text(d, (840, 500), 'SpaceX stake ≈ 4/5', F('sansb', 44), MINT, prog(t, k + 1.0), rise=10)
        text(d, (840, 565), 'Tesla and the rest ≈ 1/5', F('sansb', 44), (150, 168, 194), prog(t, T(24, 2) - st), rise=10)
    text(d, (840, 700), 'To give cash, he must SELL shares.', F('serif', 52), CREAM, prog(t, T(24, 3) - st), rise=10)
    text(d, (840, 780), '...and someone has to BUY them.', F('hand', 64), AMBER, prog(t, T(24, 4) - st), rise=10)
    chrome(img, d, 'Forbes, Nov 1, 2026')

PTS = [('Feb', 0.12, 800), ('Jun 16', 0.50, 1330), ('Early Aug', 0.66, 684), ('Nov 1', 1.0, 869)]
def s13(t, img, d, st):
    eyebrow(d, "WE JUST WATCHED IT HAPPEN", prog(t, 0.2))
    text(d, (120, 165), "Musk's net worth in 2026 (key points)", F('serif', 60), CREAM, prog(t, 0.3), rise=14)
    gx0, gx1, gy0, gy1 = 220, 1560, 300, 880
    def X(f): return gx0 + (gx1 - gx0) * f
    def Y(v): return gy1 - (gy1 - gy0) * v / 1400
    a = prog(t, 0.4)
    for v in (0, 500, 1000):
        d.line([(gx0, Y(v)), (gx1, Y(v))], fill=mix((40, 62, 92), a), width=2)
        d.text((gx0 - 20, Y(v)), ('$0' if v == 0 else (f'${v}B' if v < 1000 else '$1T')), font=F('sans', 26), fill=mix(MUTED, a), anchor='rm')
    k1 = T(25, 1) - st
    k2 = T(25, 2) - st
    k3 = T(25, 3) - st
    def reveal(f):
        if f <= PTS[0][1]:
            return 0
        if f <= PTS[1][1]:
            return ease((t - k1) / 2.0)
        if f <= PTS[2][1]:
            return ease((t - k3) / 1.6)
        return ease((t - k3 - 2.2) / 1.6)
    pts = [(X(f), Y(v)) for _, f, v in PTS]
    segs_col = [MINT, CORAL, MINT]
    for i in range(3):
        p = reveal(PTS[i + 1][1])
        if p <= 0:
            continue
        x0, y0 = pts[i]
        x1, y1 = pts[i + 1]
        d.line([(x0, y0), (x0 + (x1 - x0) * p, y0 + (y1 - y0) * p)], fill=segs_col[i], width=10)
    for i, (lab, f, v) in enumerate(PTS):
        ap = 1 if i == 0 else reveal(f)
        ap = clamp((ap - 0.85) / 0.15) if i > 0 else prog(t, k1 - 0.3)
        if ap <= 0:
            continue
        x, y = pts[i]
        col = CORAL if i == 2 else (AMBER if i == 1 else CREAM)
        d.ellipse([x - 13, y - 13, x + 13, y + 13], fill=mix(col, ap))
        d.text((x, gy1 + 36), lab, font=F('sans', 28), fill=mix(MUTED, ap), anchor='mm')
        val = f'${v / 1000:.2f}T' if v >= 1000 else f'${v}B'
        dy = -40 if i != 2 else 52
        d.text((x, y + dy), val, font=F('sansb', 36), fill=mix(col, ap), anchor='mm')
    text(d, (X(0.22), Y(1330)), 'SpaceX goes public (June)', F('hand', 50), AMBER, prog(t, T(25, 1) - st + 1.5), anchor='mm', rise=8)
    ka = k3 + 1.6
    if t > ka:
        a2 = prog(t, ka)
        xx = X(0.70)
        text(d, (xx, Y(470)), 'SpaceX shares −46%', F('sansb', 40), CORAL, a2, anchor='lm', rise=8)
        text(d, (xx, Y(470) + 56), '−$600B+ in ~6 weeks', F('sansb', 40), CORAL, a2, anchor='lm', rise=8)
    text(d, (gx1 + 40, Y(869)), 'today', F('hand', 50), MINT, prog(t, k3 + 3.6), anchor='lm', rise=6)
    chrome(img, d, 'Bloomberg Billionaires Index; Forbes. Straight lines join reported values.')

def s14(t, img, d, st):
    eyebrow(d, 'THINK ABOUT THAT', prog(t, 0.2))
    a = prog(t, T(26, 1) - st)
    text(d, (W/2, 250), '$600B lost  ÷  8.3B people', F('serif', 80), CREAM, a, anchor='mm')
    k = T(26, 1) - st + 1.0
    if t > k:
        text(d, (W/2, 410), '= $72 each', F('serifb', 140), CORAL, prog(t, k, 0.4), anchor='mm')
    kb = T(26, 2) - st
    if t > kb:
        ab = prog(t, kb)
        x0, x1, y = 260, 1660, 620
        d.rounded_rectangle([x0, y, x1, y + 110], radius=20, fill=mix(MINT, ab))
        pc = ease((t - kb - 0.6) / 1.4)
        wl = (x1 - x0) * 72 / 104 * pc
        if wl > 20:
            d.rounded_rectangle([x0, y, x0 + wl, y + 110], radius=20, fill=CORAL)
        d.text((x0, y - 30), 'Your $104 share', font=F('sansb', 34), fill=mix(CREAM, ab), anchor='ls')
        if pc > 0.9:
            d.text((x0 + wl / 2, y + 55), '$72 gone in the crash', font=F('sansb', 38), fill=BG, anchor='mm')
            d.text((x0 + wl + (x1 - x0 - wl) / 2, y + 55), '$32', font=F('sansb', 38), fill=BG, anchor='mm')
    text(d, (W/2, 880), 'without giving anyone a single cent', F('hand', 68), AMBER, prog(t, kb + 2.2), anchor='mm')
    chrome(img, d, 'Bloomberg Billionaires Index; Worldometer')

def s15(t, img, d, st):
    eyebrow(d, 'A FIRE SALE', prog(t, 0.2))
    text(d, (W/2, 230), 'What if he sold everything at once?', F('serif', 84), CREAM, prog(t, 0.3), anchor='mm')
    text(d, (W/2, 340), 'A flood of shares crashes the price before he finishes.', F('sans', 42), MUTED, prog(t, T(27, 1) - st), anchor='mm')
    k = T(27, 2) - st
    vals = [('$104', 230, MINT, k), ('$40?', 160, AMBER, T(27, 2) - st + 2.6), ('$20?', 110, CORAL, T(27, 3) - st)]
    xs = [420, 1010, 1520]
    for i, (s, sz, col, kk) in enumerate(vals):
        a = prog(t, kk, 0.5)
        text(d, (xs[i], 620), s, F('serifb', sz), col, a, anchor='mm')
        if i < 2:
            aa = prog(t, vals[i + 1][3] - 0.3, 0.4)
            if aa > 0:
                xa = xs[i] + d.textlength(vals[i][0], font=F('serifb', vals[i][1])) / 2 + 30
                xb = xs[i + 1] - d.textlength(vals[i + 1][0], font=F('serifb', vals[i + 1][1])) / 2 - 30
                d.line([(xa, 620), (xb, 620)], fill=mix(MUTED, aa), width=6)
                d.polygon([(xb + 4, 620), (xb - 18, 606), (xb - 18, 634)], fill=mix(MUTED, aa))
    text(d, (W/2, 860), 'illustration, not a forecast', F('hand', 56), MUTED, prog(t, k + 0.5), anchor='mm')
    chrome(img, d)

def house(d, x, y, s, col):
    d.polygon([(x, y), (x + s / 2, y - s * 0.45), (x + s, y)], fill=col)
    d.rectangle([x + s * 0.1, y, x + s * 0.9, y + s * 0.6], fill=col)
    d.rectangle([x + s * 0.42, y + s * 0.3, x + s * 0.58, y + s * 0.6], fill=BG)

def s16(t, img, d, st):
    eyebrow(d, 'A PRICE, NOT A PILE OF CASH', prog(t, 0.2))
    text(d, (W/2, 230), 'His fortune is real the way a house price is real.', F('serif', 70), CREAM, prog(t, 0.3), anchor='mm')
    text(d, (W/2, 330), "It's what someone would pay for it today.", F('sans', 42), MUTED, prog(t, T(28, 1) - st), anchor='mm')
    k = T(28, 2) - st
    crash = ease((t - k - 1.5) / 1.0)
    for i in range(6):
        x = 190 + i * 270
        a = prog(t, 0.6 + i * 0.12)
        house(d, x, 620, 190, mix(CREAM, a * 0.9))
        tag_col = CORAL if crash > 0.5 else MINT
        price = '$500K' if crash < 0.5 else '$200K?'
        shake = math.sin(t * 40 + i) * 4 * (1 - abs(crash - 0.5) * 2) if 0 < crash < 1 else 0
        if a > 0.5:
            d.rounded_rectangle([x + 20 + shake, 780, x + 170 + shake, 840], radius=14, fill=mix(tag_col, a))
            d.text((x + 95 + shake, 810), price, font=F('sansb', 30), fill=BG, anchor='mm')
    text(d, (W/2, 930), 'Sell every house on the street the same afternoon, and that price is gone.', F('sans', 38), AMBER, prog(t, k), anchor='mm')
    chrome(img, d)

def s17(t, img, d, st):
    eyebrow(d, 'SO, WHAT WOULD ACTUALLY HAPPEN?', prog(t, 0.2))
    rows = [('Everyone on Earth', '~$104', 'and likely much less after a crash', MINT, T(30, 0)),
            ('Americans', '~$2,540', 'a stimulus check we have seen before', MINT, T(30, 1)),
            ("The world's poorest", '~1 year', 'of breathing room', AMBER, T(30, 2))]
    for i, (who, amt, note, col, tt) in enumerate(rows):
        y = 230 + i * 190
        a = prog(t, tt - st)
        card(d, 120, y, W - 120, y + 160, a)
        text(d, (180, y + 80), who, F('sansb', 44), CREAM, a, anchor='lm', base=PANEL, rise=0)
        text(d, (740, y + 80), amt, F('serifb', 84), col, a, anchor='lm', base=PANEL, rise=0)
        text(d, (1210, y + 80), note, F('sans', 32), MUTED, a, anchor='lm', base=PANEL, rise=0)
    text(d, (W/2, 900), 'And then, in most places, life goes back to normal.', F('hand', 66), AMBER, prog(t, T(30, 3) - st), anchor='mm')
    chrome(img, d)

def s18(t, img, d, st):
    eyebrow(d, 'THE REAL LESSON', prog(t, 0.2))
    a = prog(t, 0.2)
    calendar(d, 840, 230, 43, a=a, cell=34, gap=7)
    text(d, (120, 260), '43 days', F('serifb', 150), AMBER, prog(t, 0.4))
    text(d, (124, 450), 'of one government\'s', F('sans', 40), MUTED, prog(t, 0.6))
    text(d, (124, 505), 'yearly spending', F('sans', 40), MUTED, prog(t, 0.6))
    text(d, (124, 650), 'Huge for one person.', F('serif', 56), CREAM, prog(t, T(31, 2) - st))
    text(d, (124, 730), 'Small for the world.', F('serif', 56), MINT, prog(t, T(31, 2) - st + 1.5))
    text(d, (W/2, 930), "Money given once can't fix what whole systems create every year.", F('hand', 60), AMBER, prog(t, T(31, 3) - st), anchor='mm')
    chrome(img, d, 'CBO Monthly Budget Review, Oct 2026')

def icon_water(d, cx, cy, a):
    col = mix((110, 190, 255), a)
    d.ellipse([cx - 60, cy - 20, cx + 60, cy + 100], fill=col)
    d.polygon([(cx - 56, cy + 22), (cx, cy - 110), (cx + 56, cy + 22)], fill=col)

def icon_health(d, cx, cy, a):
    col = mix(CORAL, a)
    d.rounded_rectangle([cx - 26, cy - 85, cx + 26, cy + 85], radius=10, fill=col)
    d.rounded_rectangle([cx - 85, cy - 26, cx + 85, cy + 26], radius=10, fill=col)

def icon_school(d, cx, cy, a):
    col = mix(AMBER, a)
    d.polygon([(cx - 100, cy - 30), (cx, cy - 100), (cx + 100, cy - 30)], fill=col)
    d.rectangle([cx - 85, cy - 30, cx + 85, cy + 80], fill=col)
    d.rectangle([cx - 20, cy + 20, cx + 20, cy + 80], fill=BG)
    for dx in (-60, 40):
        d.rectangle([cx + dx, cy - 10, cx + dx + 22, cy + 12], fill=BG)

def s19(t, img, d, st):
    eyebrow(d, 'AIMED CAREFULLY', prog(t, 0.2))
    text(d, (W/2, 230), "That doesn't mean it would be worthless.", F('serif', 76), CREAM, prog(t, 0.3), anchor='mm')
    k = T(32, 1) - st
    items = [(icon_water, 'Clean water'), (icon_health, 'Vaccines'), (icon_school, 'Schools')]
    for i, (fn, lab) in enumerate(items):
        a = prog(t, k + 0.8 + i * 0.8)
        cx = 460 + i * 500
        if a > 0:
            fn(d, cx, 520 + (1 - a) * 20, a)
            text(d, (cx, 680), lab, F('sansb', 44), CREAM, a, anchor='mm', rise=0)
    text(d, (W/2, 820), 'could change millions of lives for good', F('sans', 44), MUTED, prog(t, k + 3.6), anchor='mm')
    text(d, (W/2, 930), "It just wouldn't make all of us rich.", F('hand', 70), AMBER, prog(t, T(32, 2) - st), anchor='mm')
    chrome(img, d)

def s20(t, img, d, st):
    k2 = T(34, 0) - st
    out = prog(t, k2 - 0.4, 0.4)
    a1 = prog(t, T(33, 1) - st) * (1 - out)
    text(d, (W/2, 420), 'What would you do', F('serif', 110), CREAM, a1, anchor='mm')
    text(d, (W/2, 560), 'with your $104?', F('serifb', 130), MINT, a1, anchor='mm')
    text(d, (W/2, 720), 'Tell us in the comments', F('hand', 76), AMBER, prog(t, T(33, 2) - st) * (1 - out), anchor='mm')
    if t > k2:
        a = prog(t, k2, 0.7)
        paste_logo(img, 240, (int(W/2 - 120), int(250 + (1 - a) * 30)), a)
        text(d, (W/2, 600), 'Chartography', F('serifb', 120), CREAM, a, anchor='mm')
        hand_underline(d, W/2 - 380, W/2 + 380, 680, ease((t - k2 - 0.6) / 0.9), MINT, 8)
        text(d, (W/2, 760), 'the story behind the numbers', F('hand', 70), MINT, prog(t, k2 + 1.0), anchor='mm')
        pa = prog(t, T(34, 1) - st)
        if pa > 0:
            pill(d, W/2, 900, 'Subscribe for one big question every week', pa, color=BG, fill=AMBER, font=F('sansb', 38))

SCENES = [([0], s1), ([1], s2), ([2], s3), ([3, 4], s4), ([5, 6], s5), ([7, 8, 9], s6), ([10, 11], s7),
          ([12, 13], s8), ([14, 15, 16], s9), ([17, 18, 19, 20], s10), ([21], s11), ([22, 23, 24], s12),
          ([25], s13), ([26], s14), ([27], s15), ([28], s16), ([29, 30], s17), ([31], s18), ([32], s19), ([33, 34], s20)]

def scene_bounds():
    starts = [0.0] + [T(ps[0]) - 0.15 for ps, _ in SCENES[1:]]
    ends = starts[1:] + [AUDIO_END + TAIL]
    fr = [(round(a * FPS), round(b * FPS)) for a, b in zip(starts, ends)]
    return starts, fr

def render_frame(i, t_local):
    ps, fn = SCENES[i]
    starts, fr = scene_bounds()
    img = Image.new('RGB', (W, H), BG)
    d = ImageDraw.Draw(img)
    fn(t_local, img, d, starts[i])
    nfr = fr[i][1] - fr[i][0]
    fi = round(t_local * FPS)
    fade_in, fade_out = 8, 6
    if i == 0:
        fade_in = 15
    al = 1.0
    if fi < fade_in:
        al = (fi + 1) / (fade_in + 1)
    if fi >= nfr - fade_out and i < len(SCENES) - 1:
        al = min(al, (nfr - fi) / (fade_out + 1))
    if i == len(SCENES) - 1 and fi >= nfr - 20:
        al = min(al, (nfr - fi) / 21)
    if al < 1:
        img = Image.blend(Image.new('RGB', (W, H), BG), img, al)
    return img

def render_scene(i, out):
    starts, fr = scene_bounds()
    nfr = fr[i][1] - fr[i][0]
    t0 = fr[i][0] / FPS
    tmp = out[:-4] + '.part.mp4'
    p = subprocess.Popen(['ffmpeg', '-y', '-loglevel', 'error', '-f', 'rawvideo', '-pix_fmt', 'rgb24', '-s', f'{W}x{H}', '-r', str(FPS), '-i', '-',
                          '-c:v', 'libx264', '-preset', 'veryfast', '-crf', '20', '-pix_fmt', 'yuv420p', '-g', '60', tmp], stdin=subprocess.PIPE)
    for f in range(nfr):
        tl = f / FPS + (t0 - starts[i])
        p.stdin.write(render_frame(i, tl).tobytes())
    p.stdin.close()
    if p.wait() == 0:
        os.replace(tmp, out)

if __name__ == '__main__':
    mode = sys.argv[1]
    if mode == 'still':
        i = int(sys.argv[2]); tl = float(sys.argv[3])
        render_frame(i, tl).save(sys.argv[4])
    elif mode == 'bounds':
        s, fr = scene_bounds()
        for i, (a, b) in enumerate(fr):
            print(i, SCENES[i][1].__name__, round(s[i], 2), (b - a) / FPS)
    elif mode == 'scenes':
        for i in map(int, sys.argv[2].split(',')):
            render_scene(i, f'{HERE}/out/scene_{i:02d}.mp4')
