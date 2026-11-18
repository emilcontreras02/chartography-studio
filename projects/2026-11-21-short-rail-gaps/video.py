"""WHY RAILS HAD GAPS (Chartography remake of the viral 'Why Perfect Railroads Don't Work' story Short, Ricks Clips, Nov 2026).
Borrowed: the format only (skeptic mocks a rule, nature proves it right, twist). Own plot, script, voices and visuals.
Facts: FRA CWR plan adjustment constant 0.000078 in/ft/F (= 0.0000065 in/in/F) -> 39 ft x 100 F = 0.30 in;
US rail stress-free temperatures 95-109 F (Wikipedia, Rail stressing); sun kink = heat buckling (Practical Engineering, Dec 5, 2023)."""
import sys, os, json, math
HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.join(HERE, '..', '..'))
import chartography_engine as ce
ce.use_canvas('short')
import whatif_kit as k
from chartography_engine import F, text, prog, ease, mix, chrome, MINT, AMBER, CREAM, MUTED, CORAL, BG
W, H = ce.W, ce.H
AUD = HERE + '/vo.mp3'; DUR = ce.duration(AUD)
WORDS = json.load(open(HERE + '/words.json'))
c = ce.Cues(WORDS, DUR)
SPK = json.load(open(HERE + '/speakers.json'))
SEGS = json.load(open(HERE + '/segments.json'))
seg = [s[1] for s in SPK]
CW = k.caption_words([(s[0], s[1]) for s in SEGS], WORDS, DUR)
CHUNKS = k.caption_chunks(CW, 3)
KEYS = {'gap', 'gaps', 'january', 'july', 'thirty', 'nine', 'hundred', 'degrees', 'third', 'inch', 'sideways', 'kink', 'clickety', 'clack', 'welded', 'comments'}
SPEAKERS = {'hero': (None, CORAL), 'narr': (None, MINT)}
GROUND = 1330
PANEL = (60, 380, W - 60, 880)
PBG = (16, 24, 44)

t_jan = seg[1]
t_jul = seg[3]
t_39 = c.at('warm a thirty')
t_third = c.at('about a third')
t_kink0 = seg[4]
t_side = c.at('shoves sideways')
t_sun = c.at('call it a')
t_modern = c.at('modern rails')
t_free = c.at('stress free')
t_cta = seg[7]
heat = lambda T: ease(prog(T, t_jul, 1.2))


def sky(d, T):
    h = heat(T)
    top = mix((44, 30, 58), h, (22, 36, 66)); low = mix((196, 112, 64), h, (64, 92, 128))
    for y in range(0, GROUND, 8):
        kk = y / GROUND
        d.rectangle([0, y, W, y + 8], fill=tuple(int(top[i] + (low[i] - top[i]) * kk) for i in range(3)))
    if h > 0:  # sun
        cx, cy, r = 880, 250, 70
        for i in range(12):
            a = i * math.pi / 6 + T * 0.4
            d.line([(cx + math.cos(a) * (r + 18), cy + math.sin(a) * (r + 18)), (cx + math.cos(a) * (r + 48), cy + math.sin(a) * (r + 48))], fill=mix(AMBER, h, top), width=8)
        d.ellipse([cx - r, cy - r, cx + r, cy + r], fill=mix((255, 214, 102), h, top))
    if h < 1:  # snow
        for i in range(40):
            sx = (i * 263 + T * 40 * (1 + i % 3)) % W
            sy = (i * 151 + T * 90 * (1 + i % 2)) % GROUND
            d.ellipse([sx, sy, sx + 7, sy + 7], fill=mix((235, 240, 250), 1 - h, top))
    # mesas on the horizon
    gcol = mix((150, 98, 62), h, (86, 96, 114))
    d.polygon([(0, GROUND), (0, 1150), (120, 1150), (170, 1210), (330, 1210), (380, GROUND)], fill=mix((122, 72, 50), h, (70, 80, 100)))
    d.polygon([(560, GROUND), (640, 1180), (780, 1180), (840, GROUND)], fill=mix((122, 72, 50), h, (70, 80, 100)))
    d.rectangle([0, GROUND, W, H], fill=gcol)
    d.rectangle([0, GROUND, W, GROUND + 10], fill=mix((176, 120, 76), h, (110, 120, 138)))


def track(d, y, x0, x1, gaps, gap_px, kink, a, rail_col=(196, 204, 214)):
    """Top-down view of a track. kink = sideways bulge in px (sun kink)."""
    if a <= 0.01:
        return
    off = lambda x: kink * math.exp(-((x - (x0 + x1) / 2) / 120) ** 2) * math.sin((x - (x0 + x1) / 2) / 60)
    for x in range(int(x0), int(x1), 34):  # ties
        o = off(x)
        d.rectangle([x, y - 46 + o, x + 16, y + 46 + o], fill=mix((120, 84, 56), a, PBG))
    col = mix(rail_col, a, PBG)
    for ry in (-28, 28):
        if gaps:
            L = 150
            x = x0
            while x < x1:
                xe = min(x1, x + L - gap_px)
                pts = [(xx, y + ry + off(xx)) for xx in range(int(x), int(xe) + 1, 6)]
                if len(pts) > 1:
                    d.line(pts, fill=col, width=10)
                x += L
        else:
            pts = [(xx, y + ry + off(xx)) for xx in range(int(x0), int(x1) + 1, 4)]
            d.line(pts, fill=col, width=10, joint='curve')


def rail_number_card(d, T, a):
    x0, y0, x1, y1 = PANEL
    d.rounded_rectangle(PANEL, radius=36, fill=mix(PBG, a * 0.95, (60, 50, 70)), outline=mix((70, 86, 110), a, (60, 50, 70)), width=4)
    text(d, (W / 2, 450), 'ONE 39-FOOT RAIL', F('serifb', 60), AMBER, a, anchor='mm', base=PBG, rise=0)
    text(d, (W / 2, 515), '+100°F of warming', F('sansm', 44), CREAM, a * prog(T, t_39 + 0.6, 0.3), anchor='mm', base=PBG, rise=0)
    g = ease(prog(T, t_39 + 1.0, 1.4))
    rx0, rx1 = 130, 860
    grow = 70 * g
    d.rounded_rectangle([rx0, 600, rx1 + grow, 640], radius=8, fill=mix((196, 204, 214), a, PBG))
    d.line([(rx1, 580), (rx1, 660)], fill=mix(MUTED, a, PBG), width=4)
    if g > 0.02:
        d.rectangle([rx1, 600, rx1 + grow, 640], fill=mix(CORAL, a, PBG))
    at = a * prog(T, t_third - 0.2, 0.3)
    text(d, (W / 2, 730), '+0.3 inch longer', F('serifb', 76), MINT, at, anchor='mm', base=PBG, rise=0)
    text(d, (W / 2, 815), '468 in × 0.0000065 per °F × 100°F', F('sansm', 34), MUTED, at, anchor='mm', base=PBG, rise=0)


def modern_card(d, T, a):
    d.rounded_rectangle(PANEL, radius=36, fill=mix(PBG, a * 0.95, (60, 50, 70)), outline=mix((70, 86, 110), a, (60, 50, 70)), width=4)
    text(d, (W / 2, 450), 'TODAY: WELDED RAIL', F('serifb', 60), MINT, a, anchor='mm', base=PBG, rise=0)
    text(d, (W / 2, 515), 'no gaps, no clickety-clack', F('sansm', 42), CREAM, a, anchor='mm', base=PBG, rise=0)
    track(d, 640, 110, 760, False, 0, 0, a)
    # thermometer
    tx, ty0, ty1 = 880, 560, 800
    d.rounded_rectangle([tx - 22, ty0, tx + 22, ty1], radius=22, fill=mix(CREAM, a, PBG))
    lvl = ease(prog(T, t_free - 1.0, 1.0))
    d.rounded_rectangle([tx - 12, ty1 - 30 - 170 * lvl, tx + 12, ty1 - 10], radius=12, fill=mix(CORAL, a, PBG))
    d.ellipse([tx - 36, ty1 - 30, tx + 36, ty1 + 42], fill=mix(CORAL, a, PBG))
    af = a * prog(T, t_free, 0.3)
    text(d, (W / 2 - 60, 760), 'clamped stress-free at', F('sansm', 38), CREAM, af, anchor='mm', base=PBG, rise=0)
    text(d, (W / 2 - 60, 822), '~95-109°F (US)', F('serifb', 58), AMBER, af, anchor='mm', base=PBG, rise=0)


def scene(T, img, d):
    sky(d, T)
    # ---- header: hook, then month badge ----
    ah = prog(T, 0.0, 0.25) * (1 - prog(T, t_jan - 0.2, 0.3))
    text(d, (W / 2, 210), 'WHY DO RAILS', F('serifb', 96), CREAM, ah, anchor='mm', base=(22, 36, 66), rise=0)
    text(d, (W / 2, 310), 'HAVE GAPS?', F('serifb', 96), AMBER, ah, anchor='mm', base=(22, 36, 66), rise=0)
    am = prog(T, t_jan, 0.3) * (1 - prog(T, t_39 - 0.3, 0.3))
    month = 'JULY' if T >= t_jul else 'JANUARY'
    if am > 0:
        f = F('sansb', 56); tw = d.textlength(month, font=f) + 70
        col = CORAL if T >= t_jul else (120, 180, 230)
        d.rounded_rectangle([90, 200, 90 + tw, 290], radius=24, fill=mix(col, am, (40, 40, 60)))
        text(d, (90 + tw / 2, 245), month, f, BG, am, anchor='mm', base=col, rise=0)
    # ---- the two tracks (view from above) ----
    ap = prog(T, 0.2, 0.3) * (1 - prog(T, t_39 - 0.3, 0.3)) + prog(T, t_kink0 - 0.2, 0.3) * (1 - prog(T, t_modern - 0.3, 0.3))
    ap = min(1, ap)
    if ap > 0.01:
        d.rounded_rectangle(PANEL, radius=36, fill=mix(PBG, ap * 0.95, (60, 50, 70)), outline=mix((70, 86, 110), ap, (60, 50, 70)), width=4)
        text(d, (W - 90, 862), 'VIEW FROM ABOVE', F('sansm', 26), MUTED, ap, anchor='rd', base=PBG, rise=0)
        hot = prog(T, t_kink0, 1.5)
        # boss's track: gaps close in the heat
        text(d, (100, 450), "BOSS'S TRACK  ·  gaps", F('sansb', 40), AMBER, ap, anchor='lm', base=PBG, rise=0)
        track(d, 545, 100, W - 100, True, 16 - 13 * hot, 0, ap)
        if T < t_jul:
            ag = ap * prog(T, c.at('a gap'), 0.3)
            ce.arrow(d, (322, 470), (322, 505), ag, color=AMBER, width=6)
        if hot > 0.6:
            text(d, (W - 100, 450), 'still fine ✓', F('sansb', 38), MINT, ap * prog(T, t_kink0 + 1.0, 0.3), anchor='rm', base=PBG, rise=0)
        # his track: no gaps, kinks in July
        ab = ap * prog(T, c.at('no gaps'), 0.3)
        text(d, (100, 665), 'HIS TRACK  ·  no gaps', F('sansb', 40), CORAL, ab, anchor='lm', base=PBG, rise=0)
        kink = 70 * ease(prog(T, t_side - 0.3, 1.0))
        track(d, 775, 100, W - 100, False, 0, kink, ab)
        if T >= t_sun - 0.2:
            asn = ap * prog(T, t_sun, 0.3)
            d.rounded_rectangle([W / 2 + 120, 640, W / 2 + 420, 700], radius=16, fill=mix(CORAL, asn, PBG))
            text(d, (W / 2 + 270, 670), 'SUN KINK', F('sansb', 40), BG, asn, anchor='mm', base=CORAL, rise=0)
    # ---- number card and modern card ----
    an = prog(T, t_39 - 0.3, 0.3) * (1 - prog(T, t_kink0 - 0.2, 0.3))
    if an > 0.01:
        rail_number_card(d, T, an)
    amod = prog(T, t_modern - 0.3, 0.3) * (1 - prog(T, t_cta, 0.3))
    if amod > 0.01:
        modern_card(d, T, amod)
    # ---- the mascot ----
    if T < seg[1]:
        pose, face, mood, mt = 'shrug', 'talk', None, 0
    elif T < seg[2]:
        pose, face, mood, mt = 'stand', 'smile', None, 0
    elif T < seg[3]:
        pose, face, mood, mt = 'cheer', 'happy', 'happy', seg[2]
    elif T < seg[4]:
        pose, face, mood, mt = 'think', 'worry', None, 0
    elif T < seg[5]:
        pose, face, mood, mt = ('stand', 'worry', None, 0) if T < t_side else ('shock', 'shock', 'shock', t_side)
    elif T < seg[6]:
        pose, face, mood, mt = 'shrug', 'talk', None, 0
    elif T < seg[7]:
        pose, face, mood, mt = 'point', 'smile', None, 0
    else:
        pose, face, mood, mt = 'wave', 'talk', 'happy', seg[7]
    k.actor(img, d, T, 800, GROUND, 430, pose=pose, face=face, mood=mood, mood_t=mt, flip=(pose == 'point'))
    # sweat in the heat
    # ---- CTA ----
    ae = prog(T, t_cta, 0.3)
    if ae > 0:
        d.rounded_rectangle([90, 430, W - 90, 760], radius=34, fill=mix(AMBER, ae, (60, 50, 70)))
        text(d, (W / 2, 510), "Did you know that's why", F('sansb', 54), BG, ae, anchor='mm', base=AMBER, rise=0)
        text(d, (W / 2, 580), 'old trains went', F('sansb', 54), BG, ae, anchor='mm', base=AMBER, rise=0)
        text(d, (W / 2, 650), 'clickety-clack?', F('serifb', 64), BG, ae, anchor='mm', base=AMBER, rise=0)
        text(d, (W / 2, 720), 'Tell me in the comments ↓', F('sansm', 40), BG, ae, anchor='mm', base=AMBER, rise=0)
    chrome(img, d, 'FRA CWR plan (0.0000065 per °F); Wikipedia, Rail stressing; Practical Engineering, Dec 5, 2023')
    k.captions(d, T, CHUNKS, y=1440, keywords=KEYS, speaker_colors=SPEAKERS)


scenes = [ce.Scene(0, scene)]

if __name__ == '__main__':
    if sys.argv[1:] == ['stills']:
        for n, T in [('hook', 2.5), ('jan', seg[2] + 1.0), ('num', t_third + 1.5), ('kink', t_sun + 1.0), ('ok', seg[5] + 1.0), ('modern', t_free + 1.2), ('cta', DUR + 0.8)]:
            ce.still(scenes, T, f'{HERE}/still_{n}.png', DUR + 1.8)
    else:
        ce.render(scenes, AUD, HERE + '/final.mp4', tail=1.8)
        print(ce.sync_report(c, HERE + '/sync.json'))
