"""The Chartography mascot as a full-body 2D character (user request, Nov 17, 2026).
Same identity as assets/mascot.png - navy cap with the white bar-chart logo, round cream face, black oval eyes,
small smile, blue shirt - but with a whole body and NO magnifying glass / side bar chart, so he can live inside
the flat illustrated world (whatif_kit scenes).

    import hero
    hero.paste(img, (x_center, y_feet), height, pose='stand', face='smile', T=T, flip=False)

poses: stand, shock, think, wave, point, shrug, cheer
faces: smile, shock, worry, happy, talk (mouth open/close with T)
"""
import math
from functools import lru_cache
from PIL import Image, ImageDraw

NAVY = (11, 31, 58)        # outline
CAP = (22, 62, 102)
CAP_HI = (52, 104, 150)
SKIN = (246, 243, 236)
SHIRT = (34, 114, 180)
SHIRT_DK = (22, 88, 146)
PANTS = (44, 62, 92)
SHOE = (16, 28, 46)
WHITE = (255, 255, 255)
BLUSH = (246, 190, 180)

UW, UH = 360, 600          # design units (feet at y=600, body centred on x=180)
SS = 3                     # supersampling

ARMS = {  # (shoulder, elbow, hand) for screen-left arm and screen-right arm
    'stand': (((132, 300), (112, 352), (110, 410)), ((228, 300), (248, 352), (250, 410))),
    'shock': (((132, 300), (66, 270), (40, 170)), ((228, 300), (294, 270), (320, 170))),
    'think': (((132, 300), (112, 352), (110, 410)), ((228, 300), (262, 300), (214, 252))),
    'wave':  (((132, 300), (112, 352), (110, 410)), ((228, 300), (300, 264), (326, 150))),
    'point': (((132, 300), (112, 352), (110, 410)), ((228, 300), (284, 296), (340, 288))),
    'shrug': (((132, 300), (96, 330), (70, 300)), ((228, 300), (264, 330), (290, 300))),
    'cheer': (((132, 300), (60, 250), (36, 120)), ((228, 300), (300, 250), (324, 120))),
}


def _u(p, s):
    return (p[0] * s, p[1] * s)


def _thick(d, pts, w, fill, s, ow=7):
    pts = [_u(p, s) for p in pts]
    d.line(pts, fill=NAVY, width=int((w + 2 * ow) * s), joint='curve')
    for x, y in (pts[0], pts[-1]):
        r = (w / 2 + ow) * s
        d.ellipse([x - r, y - r, x + r, y + r], fill=NAVY)
    d.line(pts, fill=fill, width=int(w * s), joint='curve')
    for x, y in pts[1:]:
        r = w / 2 * s
        d.ellipse([x - r, y - r, x + r, y + r], fill=fill)


def _ell(d, cx, cy, rx, ry, fill, s, ow=7):
    d.ellipse([(cx - rx - ow) * s, (cy - ry - ow) * s, (cx + rx + ow) * s, (cy + ry + ow) * s], fill=NAVY)
    d.ellipse([(cx - rx) * s, (cy - ry) * s, (cx + rx) * s, (cy + ry) * s], fill=fill)


def _rr(d, box, r, fill, s, ow=7):
    x0, y0, x1, y1 = box
    d.rounded_rectangle([(x0 - ow) * s, (y0 - ow) * s, (x1 + ow) * s, (y1 + ow) * s], radius=(r + ow) * s, fill=NAVY)
    d.rounded_rectangle([x0 * s, y0 * s, x1 * s, y1 * s], radius=r * s, fill=fill)


def _hand(d, p, s):
    _ell(d, p[0], p[1], 19, 19, SKIN, s, ow=6)


def _face(d, face, s, talk_open=False):
    ex1, ex2, ey = 150, 208, 198
    if face == 'happy':
        for ex in (ex1, ex2):
            d.arc([(ex - 15) * s, (ey - 10) * s, (ex + 15) * s, (ey + 16) * s], 200, 340, fill=NAVY, width=7 * s)
        d.chord([152 * s, 222 * s, 206 * s, 262 * s], 0, 180, fill=NAVY)
        d.ellipse([168 * s, 240 * s, 190 * s, 258 * s], fill=(230, 110, 110))
    else:
        big = 1.25 if face == 'shock' else 1.0
        for ex in (ex1, ex2):
            d.ellipse([(ex - 11 * big) * s, (ey - 19 * big) * s, (ex + 11 * big) * s, (ey + 19 * big) * s], fill=NAVY)
            d.ellipse([(ex - 4) * s, (ey - 12 * big) * s, (ex + 3) * s, (ey - 5 * big) * s], fill=WHITE)
        if face == 'shock':
            d.ellipse([166 * s, 232 * s, 192 * s, 266 * s], fill=NAVY)
        elif face == 'worry':
            d.line([(136 * s, 168 * s), (160 * s, 160 * s)], fill=NAVY, width=6 * s)
            d.line([(198 * s, 160 * s), (222 * s, 168 * s)], fill=NAVY, width=6 * s)
            d.arc([160 * s, 240 * s, 198 * s, 262 * s], 200, 340, fill=NAVY, width=6 * s)
        elif face == 'talk' and talk_open:
            d.chord([160 * s, 226 * s, 200 * s, 256 * s], 0, 180, fill=NAVY)
        else:
            d.arc([158 * s, 216 * s, 202 * s, 246 * s], 20, 160, fill=NAVY, width=6 * s)
    d.ellipse([122 * s, 222 * s, 142 * s, 234 * s], fill=BLUSH)
    d.ellipse([218 * s, 222 * s, 238 * s, 234 * s], fill=BLUSH)


@lru_cache(maxsize=256)
def _render(h, pose, face, flip, talk_open):
    s = SS
    im = Image.new('RGBA', (UW * s, UH * s), (0, 0, 0, 0))
    d = ImageDraw.Draw(im)
    la, ra = ARMS.get(pose, ARMS['stand'])
    # legs + shoes
    _rr(d, (146, 420, 176, 560), 12, PANTS, s)
    _rr(d, (184, 420, 214, 560), 12, PANTS, s)
    _ell(d, 154, 572, 34, 20, SHOE, s)
    _ell(d, 206, 572, 34, 20, SHOE, s)
    d.ellipse([132 * s, 560 * s, 176 * s, 572 * s], fill=(70, 86, 110))
    d.ellipse([184 * s, 560 * s, 228 * s, 572 * s], fill=(70, 86, 110))
    # torso (shirt) + arms behind/front
    up_l, up_r = la[2][1] < 290, ra[2][1] < 290
    if not up_l:
        _thick(d, la, 30, SHIRT, s)
    _rr(d, (124, 282, 236, 440), 34, SHIRT, s)
    d.rounded_rectangle([132 * s, 404 * s, 228 * s, 440 * s], radius=20 * s, fill=SHIRT_DK)
    d.polygon([(166 * s, 284 * s), (180 * s, 304 * s), (194 * s, 284 * s)], fill=NAVY)
    d.polygon([(170 * s, 284 * s), (180 * s, 298 * s), (190 * s, 284 * s)], fill=SKIN)
    if not up_r:
        _thick(d, ra, 30, SHIRT, s)
    if not up_l:
        _hand(d, la[2], s)
    if not up_r:
        _hand(d, ra[2], s)
    # head
    _ell(d, 180, 196, 116, 104, SKIN, s)
    _face(d, face, s, talk_open)
    # cap: dome + brim (brim to screen-left, like the logo mascot)
    d.pieslice([(58 - 7) * s, (66 - 7) * s, (302 + 7) * s, (262 + 7) * s], 180, 360, fill=NAVY)
    d.pieslice([58 * s, 66 * s, 302 * s, 262 * s], 180, 360, fill=CAP)
    d.rectangle([(58 - 7) * s, 160 * s, (302 + 7) * s, 172 * s], fill=NAVY)
    d.pieslice([82 * s, 82 * s, 196 * s, 180 * s], 190, 300, fill=CAP_HI)
    _ell(d, 64, 166, 62, 16, CAP_HI, s, ow=6)
    d.ellipse([10 * s, 158 * s, 118 * s, 178 * s], fill=CAP)
    for arm, up in ((la, up_l), (ra, up_r)):
        if up:
            _thick(d, arm, 30, SHIRT, s)
            _hand(d, arm[2], s)
    # bar-chart logo on the cap
    for i, (bx, bh) in enumerate([(176, 26), (198, 40), (220, 56)]):
        d.rounded_rectangle([bx * s, (150 - bh) * s, (bx + 16) * s, 150 * s], radius=3 * s, fill=WHITE)
    if flip:
        im = im.transpose(Image.FLIP_LEFT_RIGHT)
    w = int(UW * h / UH)
    return im.resize((w, h), Image.LANCZOS)


def size(h):
    return int(UW * h / UH), h


def paste(img, xy, h, pose='stand', face='smile', T=None, flip=False, a=1.0, bob=True):
    """xy = (center x, feet y). Returns the sprite's top-left (x, y) and width."""
    talk_open = face == 'talk' and T is not None and (int(T * 8) % 2 == 0)
    im = _render(int(h), pose, face, bool(flip), talk_open)
    x = xy[0] - im.width / 2
    y = xy[1] - im.height
    if bob and T is not None:
        y += math.sin(T * 2.6) * h * 0.008
    if a < 1:
        r, g, b, al = im.split()
        im = Image.merge('RGBA', (r, g, b, al.point(lambda v: int(v * max(0, a)))))
    img.paste(im, (int(x), int(y)), im)
    return x, y, im.width
