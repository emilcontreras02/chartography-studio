"""Chartography WHAT-IF kit: flat illustrated world (sky, road, gas station, people, cars, trucks, shelves,
speech bubbles, fact cards) + word-by-word kinetic captions. Import after ce.use_canvas('short').
Pattern: projects/2026-11-17-whatif-gas-10-v2/video.py"""
import math
import chartography_engine as ce
from chartography_engine import F, text, prog, ease, mix, MINT, AMBER, CREAM, MUTED, PANEL, CORAL, BG, SLATE
W, H = 1080, 1920

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




# ---------------- kinetic captions (word-by-word, like the reference reels) ----------------
import re, difflib

def _norm(w):
    return re.sub(r"[^a-z0-9']", '', w.lower())


def caption_words(segments, asr_words, end):
    """segments: [(speaker, text), ...] in spoken order. asr_words: [[word, t], ...] from words.json.
    Returns [(display_word, t, speaker)] with times aligned to the voice (unmatched words interpolated)."""
    disp = []
    for spk, txt in segments:
        for tok in txt.split():
            for part in re.split(r'(?<=[a-zA-Z])-(?=[a-zA-Z])', tok):
                disp.append([part, None, spk])
    a = [_norm(w) for w, _ in asr_words]
    b = [_norm(w[0]) for w in disp]
    sm = difflib.SequenceMatcher(None, b, a, autojunk=False)
    for blk in sm.get_matching_blocks():
        for k in range(blk.size):
            disp[blk.a + k][1] = asr_words[blk.b + k][1]
    # interpolate gaps
    known = [i for i, w in enumerate(disp) if w[1] is not None]
    for i, w in enumerate(disp):
        if w[1] is None:
            prev = max([k for k in known if k < i], default=None)
            nxt = min([k for k in known if k > i], default=None)
            t0 = disp[prev][1] if prev is not None else 0.0
            t1 = disp[nxt][1] if nxt is not None else end
            n0 = prev if prev is not None else -1
            n1 = nxt if nxt is not None else len(disp)
            w[1] = t0 + (t1 - t0) * (i - n0) / max(1, n1 - n0)
    return [tuple(w) for w in disp]


def caption_chunks(cw, max_words=3):
    chunks, cur = [], []
    for w in cw:
        if cur and (len(cur) >= max_words or w[2] != cur[-1][2]):
            chunks.append(cur); cur = []
        cur.append(w)
        if re.search(r'[.?!,:]$', w[0]):
            chunks.append(cur); cur = []
    if cur:
        chunks.append(cur)
    return chunks


def captions(d, T, chunks, y=1430, keywords=(), speaker_colors=None, size=78):
    """Big bold caption line at y (center), current word in an amber box; keyword words in amber text."""
    cur = None
    for i, ch in enumerate(chunks):
        t0 = ch[0][1] - 0.05
        t1 = chunks[i + 1][0][1] - 0.05 if i + 1 < len(chunks) else ch[-1][1] + 1.2
        if t0 <= T < t1:
            cur = ch
            break
    if not cur:
        return
    f = F('sansb', size)
    words = [w[0].strip() for w in cur]
    up = [w.upper() for w in words]
    sp = d.textlength(' ', font=f)
    widths = [d.textlength(w, font=f) for w in up]
    total = sum(widths) + sp * (len(up) - 1)
    if total > W - 120:
        f = F('sansb', int(size * (W - 120) / total)); sp = d.textlength(' ', font=f)
        widths = [d.textlength(w, font=f) for w in up]; total = sum(widths) + sp * (len(up) - 1)
    x = (W - total) / 2
    spk = cur[0][2]
    if speaker_colors and spk in speaker_colors:
        tag, col = speaker_colors[spk]
        if tag:
            ft = F('sansb', 30)
            tw = d.textlength(tag, font=ft) + 30
            d.rounded_rectangle([W / 2 - tw / 2, y - f.size - 26, W / 2 + tw / 2, y - f.size + 18], radius=12, fill=col)
            d.text((W / 2, y - f.size - 4), tag, font=ft, fill=BG, anchor='mm')
    for j, (w, ww) in enumerate(zip(up, widths)):
        active = cur[j][1] - 0.05 <= T and (j + 1 == len(cur) or T < cur[j + 1][1] - 0.05)
        key = _norm(words[j]) in keywords
        if active:
            d.rounded_rectangle([x - 12, y - f.size * 0.62, x + ww + 12, y + f.size * 0.62], radius=14, fill=AMBER)
            col = BG
        else:
            col = AMBER if key else WHITE
        # outline for readability on any background
        d.text((x, y), w, font=f, fill=col, anchor='lm', stroke_width=0 if active else 6, stroke_fill=(10, 14, 24))
        x += ww + sp


def host(img, T, x=None, y=None, h=230, start=0.0):
    """The mascot as a persistent on-screen host (bottom-right), gently bobbing."""
    ce.mascot(img, (x if x is not None else W - 270, y if y is not None else 1110), h, T=T, start=start)
