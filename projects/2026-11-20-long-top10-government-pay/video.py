"""Top 10 highest-paid jobs in the US federal government (official 2026 pay) - long-form, Nov 20, 2026.
Full-body mascot as host (own voice, Liam), narrator Jarnathan; rank ladder on the LEFT; word-by-word captions.
Numbers: Researcher VERIFIED lines (Calendar row 2026-11-20 Long, Notes)."""
import sys, os, json, math
HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.join(HERE, '..', '..'))
import chartography_engine as ce
ce.use_canvas('long')
import whatif_kit as k
from chartography_engine import F, text, prog, ease, mix, chrome, pill, MINT, AMBER, CREAM, MUTED, PANEL, CORAL, BG, SLATE
W, H = ce.W, ce.H
k.W, k.H = W, H
AUD = HERE + '/vo.mp3'; DUR = ce.duration(AUD)
WORDS = json.load(open(HERE + '/words.json'))
c = ce.Cues(WORDS, DUR)
SPK = json.load(open(HERE + '/speakers.json'))
SEGS = json.load(open(HERE + '/segments.json'))
seg = [s[1] for s in SPK]
end = [s[2] for s in SPK]

CW = k.caption_words([(s[0], s[1]) for s in SEGS], WORDS, DUR)
CHUNKS = k.caption_chunks(CW, 4)
KEYS = {'thousand', 'hundred', 'million', 'frozen', 'freeze', 'president', 'twist', 'coach', 'comments', 'subscribe', 'paper'}
SPEAKERS = {'hero': (None, CORAL), 'narr': (None, MINT)}
GROUND = 860
ICE = (150, 210, 255)
CARD = (22, 38, 62)

S_COURTS = 'uscourts.gov, Judicial Compensation (2026 pay)'
S_EXC = 'OPM 2026 Executive Schedule + pay-freeze memo CPM 2025-21; uscourts.gov 2026 judicial pay'
S_EXN = 'OPM 2026 Executive Schedule + pay-freeze memo CPM 2025-21; NTU Foundation (as of Jan 2026)'
S_ALL = 'OPM 2026 Executive Schedule; uscourts.gov 2026; NTU Foundation (Jan 2026); 3 U.S.C. 102'
S_EX = 'OPM 2026 Executive Schedule; OPM memo CPM 2025-21 (Dec 18, 2025) pay freeze; 5 U.S.C. 5312-5314'
S_NTU = 'National Taxpayers Union Foundation, salaries of members of Congress (as of Jan 2026)'
S_PRES = '3 U.S.C. 102 (Cornell LII): $400,000 since Jan 20, 2001'
S_TWIST = 'Federal Reserve Annual Report 2015, Table 13; GOBankingRates via OpenTheBooks (2018 pay)'

# ---------------- cues (script order) ----------------
t_hook_n = seg[1]
t_more = c.at('a few public pay checks')
t_tenbest = c.at('here are the ten best paid')
T10 = c.at('number ten'); V10 = c.at('two hundred nine thousand'); P10 = c.at('one hundred sixty eight thousand')
T9 = seg[3]; V9 = c.at('two hundred twenty three thousand'); L9 = c.at('party leaders'); M9 = c.at('every other member')
T8 = seg[4]; LV8 = c.at('level two'); V8 = c.at('two hundred twenty eight thousand'); P8 = c.at('one hundred eighty three thousand')
T7 = seg[5]; LIFE7 = c.at('appointed for life'); V7 = c.at('two hundred forty nine thousand')
T6 = seg[6]; V6 = c.at('two hundred fifty three thousand'); P6 = c.at('two hundred three thousand'); G6 = c.at('forty six thousand dollars less')
T6H = seg[7]
T5 = seg[8]; V5 = c.at('two hundred sixty four thousand'); G5 = c.at('fifteen thousand dollars more')
T4 = seg[9]; V4 = c.at('two hundred ninety two thousand'); P4 = c.at('two hundred thirty five thousand'); G4 = c.at('fifty seven thousand')
T4H = seg[10]
T3 = seg[11]; V3 = c.at('three hundred six thousand'); N3 = c.at('nine justices sit'); NINTH3 = c.at('the ninth makes more')
T2 = seg[12]; V2 = c.at('three hundred twenty thousand'); O2 = c.at('three hundred seventeen thousand'); G2 = c.at('fourteen thousand one hundred')
T1 = seg[13]; V1 = c.at('four hundred thousand dollars a year'); E1 = c.at('fifty thousand dollar'); Y1 = c.at('took effect on january')
TW = seg[14]; F1 = c.at('four hundred sixty six thousand'); K18 = c.at('in twenty eighteen'); K93 = c.at('nine point three million')
A83 = c.at('eight point three million'); X23 = c.at('twenty three times the')
TWH = seg[15]; PUNCH = seg[16]
REC = seg[17]; GAP = c.at('one hundred ninety thousand four hundred')
CTA = seg[18]; SUB = c.at('subscribe to')
# Nov 19 fill-ins for empty panels (Reviewer cosmetic note)
C6 = [c.at('the secretary of state', after=T6 - 0.5), c.at('the secretary of the treasury', after=T6 - 0.5), c.at('the secretary of defence', after=T6 - 0.5), c.at('the attorney general', after=T6 - 0.5)]
C8 = [c.at('deputy secretary of defense', after=T8 - 0.5), c.at('governors of the federal reserve board', after=T8 - 0.5)]

# rank, ladder name, value label, value, reveal cue, frozen-paid label or None
LADDER = [
    (10, 'Under secretaries', '$209,600', 209600, V10, '$168,400'),
    (9, 'Speaker of the House', '$223,500', 223500, V9, None),
    (8, 'Deputy secretaries', '$228,000', 228000, V8, '$183,100'),
    (7, 'District judges', '$249,900', 249900, V7, None),
    (6, 'Cabinet secretaries', '$253,100', 253100, V6, '$203,500'),
    (5, 'Appeals judges', '$264,900', 264900, V5, None),
    (4, 'Vice President', '$292,300', 292300, V4, '$235,100'),
    (3, 'Associate Justices', '$306,600', 306600, V3, None),
    (2, 'Chief Justice', '$320,700', 320700, V2, None),
    (1, 'President', '$400,000', 400000, V1, None),
]
STARTS = {10: T10, 9: T9, 8: T8, 7: T7, 6: T6, 5: T5, 4: T4, 3: T3, 2: T2, 1: T1}


# ---------------- shared parts ----------------
def ladder(d, T):
    """10 slots on the LEFT (#1 on top); a slot fills when its pay is spoken; current rank highlighted."""
    x0, x1, y0, sh = 36, 356, 150, 66
    text(d, (x0, 116), 'OFFICIAL 2026 PAY', F('sansb', 22), MUTED, 1, anchor='lm', rise=0)
    cur = None
    for r, *_ in LADDER:
        if T >= STARTS[r] - 0.3 and T < TW - 0.3:
            cur = r
    for i, (r, name, lab, val, tv, frz) in enumerate(sorted(LADDER, key=lambda x: x[0])):
        y = y0 + i * sh
        active = cur == r
        fill = (70, 58, 30) if active else (32, 50, 78)
        d.rounded_rectangle([x0, y, x1, y + sh - 10], radius=12, fill=fill, outline=AMBER if active else (60, 76, 104), width=3)
        text(d, (x0 + 16, y + (sh - 10) / 2), f'#{r}', F('sansb', 28), AMBER if active else MUTED, 1, anchor='lm', base=fill, rise=0)
        if T >= tv:
            a = prog(T, tv, 0.3)
            text(d, (x0 + 78, y + (sh - 10) / 2 - 11), name, F('sansb', 21), CREAM, a, anchor='lm', base=fill, rise=0)
            text(d, (x0 + 78, y + (sh - 10) / 2 + 13), lab, F('sansb', 21), MINT, a, anchor='lm', base=fill, rise=0)
            if frz:
                text(d, (x1 - 12, y + (sh - 10) / 2 + 13), 'frozen', F('sansb', 18), ICE, a, anchor='rm', base=fill, rise=0)


def world(d, T):
    k.grad_sky(d, 0, H)
    k.ground(d, GROUND, T, road=False)


def head(d, T, title='TOP 10 OFFICIAL PAYCHECKS'):
    pill(d, 930, 62, title, 1.0, color=BG, fill=AMBER, font=F('sansb', 30))


def finish(T, img, d, src):
    chrome(img, d, src)
    k.captions(d, T, CHUNKS, y=955, keywords=KEYS, speaker_colors=SPEAKERS, size=60)


def host(img, d, T, pose='point', face='smile', mood=None, mt=0.0, x=1720, h=520):
    talking = any(s[0] == 'hero' and s[1] - 0.1 <= T < s[2] for s in SPK)
    k.actor(img, d, T, x, GROUND, h, pose=pose, face='talk' if talking and face not in ('shock',) else face, mood=mood, mood_t=mt)


def card_head(d, T, r, title, sub, t0):
    a = prog(T, t0 - 0.1, 0.35)
    d.rounded_rectangle([400, 120, 1530, 830], radius=30, fill=mix(CARD, a))
    text(d, (440, 210), f'#{r}', F('serifb', 130), AMBER, a, anchor='lm', base=CARD)
    nx = 440 + d.textlength(f'#{r}', font=F('serifb', 130)) + 34
    f = ce.fit_font(d, title, 'serifb', 64, 1500 - nx)
    text(d, (nx, 188), title, f, CREAM, prog(T, t0 + 0.3, 0.3), anchor='lm', base=CARD)
    text(d, (nx, 252), sub, F('sansm', 30), MUTED, prog(T, t0 + 0.6, 0.3), anchor='lm', base=CARD)


def money(v):
    return f'${v:,.0f}'


def bar_pair(d, T, x, y, w, rows, vmax):
    """rows: [(label, value, color, cue, note)] horizontal bars inside a card."""
    for i, (lab, v, col, t, note) in enumerate(rows):
        yy = y + i * 150
        a = prog(T, t - 0.1, 0.3)
        text(d, (x, yy), lab, F('sansb', 30), MUTED if col != ICE else ICE, a, anchor='lm', base=CARD, rise=0)
        g = ease(prog(T, t, 0.9))
        bw = max(4, w * v / vmax * g)
        if a > 0:
            d.rounded_rectangle([x, yy + 26, x + bw, yy + 96], radius=12, fill=mix(col, a, CARD))
            text(d, (x + bw + 20, yy + 61), money(v * g) if g < 1 else money(v), F('serifb', 54), CREAM, a, anchor='lm', base=CARD, rise=0)
            if note and g >= 1:
                text(d, (x + bw + 20, yy + 108), note, F('hand', 40), AMBER, prog(T, t + 0.9, 0.3), anchor='lm', base=CARD, rise=0)


# ---------------- icons (flat, generic) ----------------
def gavel(d, cx, cy, s, a):
    if a <= 0.01:
        return
    O = (11, 31, 58)
    col = mix((170, 110, 70), a, CARD)
    d.polygon([(cx - 20 * s, cy - 10 * s), (cx + 120 * s, cy + 120 * s), (cx + 100 * s, cy + 140 * s), (cx - 40 * s, cy + 10 * s)], fill=col, outline=mix(O, a, CARD))
    d.rounded_rectangle([cx - 110 * s, cy - 80 * s, cx + 40 * s, cy - 10 * s], radius=int(14 * s), fill=col, outline=mix(O, a, CARD), width=5)
    d.rounded_rectangle([cx - 70 * s, cy + 150 * s, cx + 90 * s, cy + 180 * s], radius=int(10 * s), fill=mix((120, 80, 50), a, CARD))


def columns(d, cx, cy, s, a):
    if a <= 0.01:
        return
    col = mix((230, 226, 214), a, CARD)
    d.polygon([(cx - 150 * s, cy - 60 * s), (cx, cy - 130 * s), (cx + 150 * s, cy - 60 * s)], fill=col)
    for i in range(5):
        x = cx - 120 * s + i * 60 * s
        d.rectangle([x - 14 * s, cy - 50 * s, x + 14 * s, cy + 90 * s], fill=col)
    d.rectangle([cx - 160 * s, cy + 90 * s, cx + 160 * s, cy + 116 * s], fill=col)


def snowflake(d, cx, cy, r, a, base=CARD):
    if a <= 0.01:
        return
    col = mix(ICE, a, base)
    for i in range(6):
        ang = i * math.pi / 3
        x1, y1 = cx + r * math.cos(ang), cy + r * math.sin(ang)
        d.line([(cx, cy), (x1, y1)], fill=col, width=6)
        for sgn in (-1, 1):
            bx, by = cx + r * 0.6 * math.cos(ang), cy + r * 0.6 * math.sin(ang)
            d.line([(bx, by), (bx + r * 0.3 * math.cos(ang + sgn * 0.8), by + r * 0.3 * math.sin(ang + sgn * 0.8))], fill=col, width=5)


def seat(d, cx, cy, s, col, a):
    d.rounded_rectangle([cx - 34 * s, cy - 70 * s, cx + 34 * s, cy], radius=int(12 * s), fill=mix(col, a, CARD))
    d.rounded_rectangle([cx - 44 * s, cy - 6 * s, cx + 44 * s, cy + 20 * s], radius=int(8 * s), fill=mix(col, a, CARD))
    d.rectangle([cx - 36 * s, cy + 20 * s, cx - 28 * s, cy + 60 * s], fill=mix(col, a, CARD))
    d.rectangle([cx + 28 * s, cy + 20 * s, cx + 36 * s, cy + 60 * s], fill=mix(col, a, CARD))


# ---------------- scenes ----------------
def s_hook(T, img, d):
    world(d, T)
    head(d, T)
    ladder(d, T)
    shocked = T < t_hook_n
    host(img, d, T, pose='shock' if shocked else 'point', face='shock' if shocked else 'smile', mood='shock' if shocked else None, mt=0.3, x=1680, h=600)
    a = prog(T, 0.05, 0.25)
    text(d, (930, 250), 'THE PRESIDENT', F('sansb', 40), MUTED, a, anchor='mm')
    ce.counter(d, (930, 370), 400000, T, 0.1, dur=1.6, prefix='$', font=F('serifb', 170), color=MINT)
    text(d, (930, 505), 'a year', F('sansm', 40), CREAM, prog(T, 1.6, 0.3), anchor='mm')
    ah = prog(T, t_hook_n + 1.0, 0.3)
    if ah > 0:
        pill(d, 930, 575, '#1 ... unchanged since 2001', ah, color=BG, fill=AMBER, font=F('sansb', 40))
    text(d, (930, 655), "someone makes more...", F('hand', 74), AMBER, prog(T, t_more, 0.3), anchor='mm')
    at = prog(T, t_tenbest, 0.3)
    if at > 0:
        d.rounded_rectangle([520, 700, 1340, 830], radius=22, fill=mix(PANEL, at))
        text(d, (930, 745), 'The 10 best-paid jobs set by federal law', F('serifb', 46), CREAM, at, anchor='mm', base=PANEL)
        text(d, (930, 800), 'Executive Schedule · Congress · federal judges · official 2026 pay', F('sansm', 28), MUTED, at, anchor='mm', base=PANEL)
    finish(T, img, d, S_PRES)


def s10(T, img, d):
    world(d, T); head(d, T); ladder(d, T)
    host(img, d, T, pose='point', mt=T10)
    card_head(d, T, 10, 'Under secretaries', 'e.g. 6 Under Secretaries of State, 3 at the Treasury', T10)
    bar_pair(d, T, 460, 340, 640, [('ON PAPER (Executive Schedule Level III)', 209600, MINT, V10, None),
                                  ('ACTUALLY PAID (political appointees, frozen)', 168400, ICE, P10, None)], 209600)
    snowflake(d, 1420, 560, 50, prog(T, P10, 0.4))
    text(d, (460, 690), 'Remember this freeze.', F('hand', 56), AMBER, prog(T, c.at('remember that freeze'), 0.3), anchor='lm', base=CARD)
    finish(T, img, d, S_EX)


def s9(T, img, d):
    world(d, T); head(d, T); ladder(d, T)
    host(img, d, T, pose='stand', face='smile')
    card_head(d, T, 9, 'Speaker of the House', 'the top salary in Congress (as of Jan 2026)', T9)
    rows = [('Speaker', 223500), ('Party leaders', 193400), ('Other members', 174000)]
    starts = [V9, L9, M9]
    x0, by, tw, mh = 470, 760, 980, 380
    for i, ((lab, v), st) in enumerate(zip(rows, starts)):
        cx = x0 + tw / 3 * (i + 0.5)
        g = ease(prog(T, st, 0.8))
        h = mh * v / 223500 * g
        col = MINT if i == 0 else SLATE
        if h > 2:
            d.rounded_rectangle([cx - 110, by - h, cx + 110, by], radius=10, fill=col)
            text(d, (cx, by - h - 34), money(v), F('serifb', 44), CREAM, prog(T, st + 0.2, 0.3), anchor='mm', base=CARD, rise=0)
        text(d, (cx, by + 34), lab, F('sansb', 30), MUTED, prog(T, st, 0.3), anchor='mm', base=CARD, rise=0)
    finish(T, img, d, S_NTU)


def s8(T, img, d):
    world(d, T); head(d, T); ladder(d, T)
    host(img, d, T, pose='think', face='smile', mood='think', mt=P8)
    card_head(d, T, 8, 'Deputy secretaries', 'e.g. Deputy Secretary of Defense  ·  same pay line: Fed Board governors', T8)
    out8 = 1 - prog(T, LV8 - 0.4, 0.3)
    if out8 > 0:
        for i, (nm, tc) in enumerate(zip(['Deputy Secretary of Defense', 'Fed Board governors'], C8)):
            a = prog(T, tc, 0.3) * out8
            if a > 0:
                y0 = 340 + i * 200
                d.rounded_rectangle([470, y0, 1360, y0 + 160], radius=22, fill=mix((34, 54, 86), a, CARD))
                text(d, (915, y0 + 80), nm, F('serifb', 52), CREAM, a, anchor='mm', base=(34, 54, 86), rise=0)
    columns(d, 640, 540, 1.1, prog(T, LV8, 0.4))
    text(d, (640, 720), 'Executive Schedule Level II', F('sansb', 28), MUTED, prog(T, LV8, 0.3), anchor='mm', base=CARD)
    if T >= V8 - 0.1:
        ce.counter(d, (1120, 430), 228000, T, V8, dur=1.2, prefix='$', font=F('serifb', 110), color=MINT)
        text(d, (1120, 350), 'OFFICIAL PAY', F('sansb', 30), MUTED, prog(T, V8, 0.3), anchor='mm', base=CARD)
    a = prog(T, P8, 0.35)
    if a > 0:
        d.rounded_rectangle([880, 540, 1370, 720], radius=20, fill=mix(ICE, a, CARD))
        text(d, (1125, 585), 'FROZEN: ACTUALLY PAID', F('sansb', 28), BG, a, anchor='mm', base=ICE, rise=0)
        text(d, (1125, 655), '$183,100', F('serifb', 72), BG, a, anchor='mm', base=ICE, rise=0)
        text(d, (1125, 760), '(political appointees under the freeze)', F('sansm', 26), MUTED, a, anchor='mm', base=CARD, rise=0)
    finish(T, img, d, S_EX)


def s7(T, img, d):
    world(d, T); head(d, T); ladder(d, T)
    host(img, d, T, pose='stand', face='smile')
    card_head(d, T, 7, 'Federal district judges', 'the trial judges who run the courtrooms', T7)
    gavel(d, 1290, 420, 1.3, prog(T, T7 + 0.8, 0.4))
    text(d, (470, 400), 'appointed for life', F('hand', 66), AMBER, prog(T, LIFE7, 0.3), anchor='lm', base=CARD)
    if T >= V7 - 0.1:
        text(d, (470, 540), '2026 PAY', F('sansb', 30), MUTED, prog(T, V7, 0.3), anchor='lm', base=CARD)
        ce.counter(d, (470, 640), 249900, T, V7, dur=1.4, prefix='$', font=F('serifb', 130), color=MINT, anchor='lm')
    text(d, (470, 770), 'Keep this number in mind...', F('sansm', 36), CREAM, prog(T, c.at('keep that number in mind'), 0.3), anchor='lm', base=CARD)
    finish(T, img, d, S_COURTS)


def s6(T, img, d):
    world(d, T); head(d, T); ladder(d, T)
    hero_on = T >= T6H - 0.1
    host(img, d, T, pose='shock' if hero_on else 'point', face='shock' if hero_on and T > end[7] else 'smile', mood='shock' if hero_on else None, mt=T6H)
    card_head(d, T, 6, 'Cabinet secretaries', 'State, Treasury, Defense, the Attorney General ... (Level I)', T6)
    out6 = 1 - prog(T, V6 - 0.5, 0.3)
    if out6 > 0:
        for i, (nm, tc) in enumerate(zip(['Secretary of State', 'Secretary of the Treasury', 'Secretary of Defense', 'Attorney General'], C6)):
            a = prog(T, tc, 0.3) * out6
            if a > 0:
                x0, y0 = 470 + (i % 2) * 510, 330 + (i // 2) * 190
                d.rounded_rectangle([x0, y0, x0 + 480, y0 + 160], radius=22, fill=mix((34, 54, 86), a, CARD))
                text(d, (x0 + 240, y0 + 62), nm, F('serifb', 36), CREAM, a, anchor='mm', base=(34, 54, 86), rise=0)
                text(d, (x0 + 240, y0 + 115), 'Executive Schedule Level I', F('sansm', 24), MUTED, a, anchor='mm', base=(34, 54, 86), rise=0)
    # left card: cabinet
    a1 = prog(T, V6, 0.3)
    if a1 > 0:
        d.rounded_rectangle([450, 310, 960, 700], radius=24, fill=mix((34, 54, 86), a1, CARD))
        text(d, (705, 360), 'CABINET SECRETARY', F('sansb', 30), MUTED, a1, anchor='mm', base=(34, 54, 86), rise=0)
        text(d, (705, 440), '$253,100', F('serifb', 76), MINT, a1, anchor='mm', base=(34, 54, 86), rise=0)
        text(d, (705, 495), 'on paper', F('sansm', 28), MUTED, a1, anchor='mm', base=(34, 54, 86), rise=0)
        ap = prog(T, P6, 0.3)
        if ap > 0:
            d.line([(560, 440), (850, 440)], fill=mix(CORAL, ap, (34, 54, 86)), width=8)
            snowflake(d, 500, 590, 30, ap, base=(34, 54, 86))
            text(d, (735, 590), '$203,500', F('serifb', 76), ICE, ap, anchor='mm', base=(34, 54, 86), rise=0)
            text(d, (705, 655), 'actually paid (frozen)', F('sansm', 28), ICE, ap, anchor='mm', base=(34, 54, 86), rise=0)
    # right card: trial judge
    a2 = prog(T, G6 - 1.6, 0.3)
    if a2 > 0:
        d.rounded_rectangle([1000, 310, 1490, 700], radius=24, fill=mix((34, 54, 86), a2, CARD))
        text(d, (1245, 360), 'TRIAL JUDGE (#7)', F('sansb', 30), MUTED, a2, anchor='mm', base=(34, 54, 86), rise=0)
        text(d, (1245, 440), '$249,900', F('serifb', 76), MINT, a2, anchor='mm', base=(34, 54, 86), rise=0)
        text(d, (1245, 495), 'paid in 2026', F('sansm', 28), MUTED, a2, anchor='mm', base=(34, 54, 86), rise=0)
    ag = prog(T, G6, 0.3)
    if ag > 0:
        pill(d, 970, 765, 'Cabinet takes home about $46,400 LESS', ag, color=(255, 255, 255), fill=CORAL, font=F('sansb', 38))
    finish(T, img, d, S_EXC)


def s5(T, img, d):
    world(d, T); head(d, T); ladder(d, T)
    host(img, d, T, pose='stand', face='happy')
    card_head(d, T, 5, 'Federal appeals judges', 'the circuit courts, one step below the Supreme Court', T5)
    rows = [('Appeals judge', 264900), ('Cabinet (official)', 253100), ('District judge', 249900)]
    ce.hbars(d, T, rows, (800, 360, 480, 120), V5, stagger=0.5, grow=0.9, value_fmt=money,
             label_font=F('sansb', 32), value_font=F('serifb', 46), colors=[MINT, SLATE, SLATE], vmax=264900)
    ag = prog(T, G5, 0.3)
    if ag > 0:
        pill(d, 960, 760, '+$15,000 vs a district judge', ag, color=BG, fill=MINT, font=F('sansb', 40))
    finish(T, img, d, S_EXC)


def s4(T, img, d):
    world(d, T); head(d, T); ladder(d, T)
    hero_on = T >= T4H - 0.1
    host(img, d, T, pose='think' if hero_on else 'point', face='worry' if hero_on else 'smile', mood='think' if hero_on else None, mt=T4H)
    card_head(d, T, 4, 'The Vice President', 'official pay vs. the frozen paycheck (as of Jan 2026)', T4)
    by, mh = 770, 420
    cols = [(640, 'ON PAPER', 292300, MINT, V4), (1000, 'ACTUALLY PAID', 235100, ICE, P4)]
    for cx, lab, v, col, t in cols:
        g = ease(prog(T, t, 0.9))
        h = mh * v / 292300 * g
        if h > 2:
            d.rounded_rectangle([cx - 120, by - h, cx + 120, by], radius=12, fill=col)
            text(d, (cx, by - h - 36), money(v), F('serifb', 52), CREAM, prog(T, t + 0.3, 0.3), anchor='mm', base=CARD, rise=0)
        text(d, (cx, by + 30), lab, F('sansb', 28), col, prog(T, t, 0.3), anchor='mm', base=CARD, rise=0)
    text(d, (1000, 330), 'frozen since 2019', F('hand', 46), ICE, prog(T, c.at('in place since twenty nineteen'), 0.3), anchor='mm', base=CARD)
    ag = prog(T, G4, 0.3)
    if ag > 0:
        top1 = by - mh; top2 = by - mh * 235100 / 292300
        x = 1180
        d.line([(x, top1), (x + 30, top1), (x + 30, top2), (x, top2)], fill=mix(CORAL, ag, CARD), width=6)
        text(d, (x + 50, (top1 + top2) / 2 - 22), 'gap:', F('sansb', 32), CORAL, ag, anchor='lm', base=CARD, rise=0)
        text(d, (x + 50, (top1 + top2) / 2 + 22), '$57,200', F('serifb', 50), CORAL, ag, anchor='lm', base=CARD, rise=0)
    finish(T, img, d, S_EXN)


def s3(T, img, d):
    world(d, T); head(d, T); ladder(d, T)
    host(img, d, T, pose='stand', face='smile')
    card_head(d, T, 3, 'Associate Justices', 'the 8 justices of the Supreme Court (2026)', T3)
    if T >= V3 - 0.1:
        ce.counter(d, (800, 400), 306600, T, V3, dur=1.2, prefix='$', font=F('serifb', 110), color=MINT)
        text(d, (1180, 410), 'each', F('hand', 64), AMBER, prog(T, V3 + 1.2, 0.3), anchor='lm', base=CARD)
    for i in range(9):
        cx = 520 + i * 112
        if i < 8:
            a = prog(T, N3 + 0.15 * i, 0.3)
            seat(d, cx, 640, 0.95, MINT, a)
        else:
            a = prog(T, NINTH3, 0.3)
            seat(d, cx, 640, 0.95, AMBER, a)
            text(d, (cx, 530), '?', F('serifb', 70), AMBER, a, anchor='mm', base=CARD)
    text(d, (920, 770), 'nine seats on the Court', F('sansm', 32), MUTED, prog(T, N3, 0.3), anchor='mm', base=CARD)
    finish(T, img, d, S_COURTS)


def s2(T, img, d):
    world(d, T); head(d, T); ladder(d, T)
    host(img, d, T, pose='point', face='happy')
    card_head(d, T, 2, 'The Chief Justice', 'of the United States', T2)
    by, mh = 760, 380
    for cx, lab, v, col, t in [(620, '2025', 317500, SLATE, O2), (900, '2026', 320700, MINT, V2)]:
        g = ease(prog(T, t, 0.8))
        h = mh * v / 320700 * g
        if h > 2:
            d.rounded_rectangle([cx - 100, by - h, cx + 100, by], radius=10, fill=col)
            text(d, (cx, by - h - 34), money(v), F('serifb', 46), CREAM, prog(T, t + 0.2, 0.3), anchor='mm', base=CARD, rise=0)
        text(d, (cx, by + 30), lab, F('sansb', 30), MUTED, prog(T, t, 0.3), anchor='mm', base=CARD, rise=0)
    ag = prog(T, G2, 0.3)
    if ag > 0:
        d.rounded_rectangle([1060, 420, 1490, 640], radius=22, fill=mix((34, 54, 86), ag, CARD))
        text(d, (1275, 470), 'vs. other justices', F('sansb', 30), MUTED, ag, anchor='mm', base=(34, 54, 86), rise=0)
        text(d, (1275, 545), '+$14,100', F('serifb', 76), AMBER, ag, anchor='mm', base=(34, 54, 86), rise=0)
        text(d, (1275, 605), 'for running the Court', F('hand', 40), CREAM, ag, anchor='mm', base=(34, 54, 86), rise=0)
    finish(T, img, d, S_COURTS)


def s1(T, img, d):
    world(d, T); head(d, T); ladder(d, T)
    host(img, d, T, pose='cheer', face='happy', mood='happy', mt=T1)
    card_head(d, T, 1, 'The President', 'of the United States', T1)
    if T >= V1 - 0.1:
        ce.counter(d, (470, 370), 400000, T, V1, dur=1.0, prefix='$', font=F('serifb', 96), color=MINT, anchor='lm')
    ae = prog(T, E1, 0.3)
    if ae > 0:
        pill(d, 1240, 370, '+ $50,000 expense allowance', ae, color=BG, fill=AMBER, font=F('sansb', 30))
    pts = [(i / 25, 400000, str(2001 + i) if i in (0, 5, 10, 15, 20, 25) else '') for i in range(26)]
    if T >= Y1 - 0.4:
        ce.line_chart(d, T, pts, (520, 470, 1460, 720), Y1, dur=3.5, ymax=500000, ymin=0, color=MINT, width=10,
                      y_ticks=(0, 200000, 400000), y_fmt=lambda v: f'${v // 1000:,.0f}K')
    text(d, (990, 640), 'not one dollar of change', F('hand', 52), AMBER, prog(T, c.at('has not moved'), 0.3), anchor='mm', base=CARD)
    finish(T, img, d, S_PRES)


def s_twist(T, img, d):
    world(d, T); head(d, T, 'THE TWIST: MORE THAN THE PRESIDENT')
    shocked = T >= TWH - 0.1
    host(img, d, T, pose='shock' if shocked else 'think', face='shock' if shocked and T > end[15] else ('smile' if not shocked else 'shock'),
         mood='shock' if shocked else 'think', mt=TWH if shocked else TW + 0.3, x=1700, h=560)
    a = prog(T, TW, 0.3)
    d.rounded_rectangle([100, 120, 1480, 830], radius=30, fill=mix(CARD, a))
    # bars: President (2026), NY Fed president (2015), Kentucky coach (2018)
    aq = prog(T, TW + 0.6, 0.4) * (1 - prog(T, F1 - 2.9, 0.3))
    if aq > 0:
        text(d, (790, 400), "Who's paid MORE", F('serifb', 96), CREAM, aq, anchor='mm', base=CARD, rise=0)
        text(d, (790, 520), 'than $400,000?', F('serifb', 96), MINT, aq, anchor='mm', base=CARD, rise=0)
    rows = [('President', '(2026)', 400000, MINT, F1 - 2.5), ('NY Fed president', '(2015)', 466500, AMBER, F1), ('Kentucky public', 'employee #1 (2018)', 9276643, CORAL, K93)]
    zoom = ease(prog(T, K93 - 0.2, 1.2))
    vmax = 520000 + (11500000 - 520000) * zoom
    by, mh = 720, 520
    for i, (lab, sub, v, col, t) in enumerate(rows):
        if i == 2 and T < K18:
            continue
        cx = 300 + i * 420
        g = ease(prog(T, t, 0.9))
        h = max(3, mh * min(1.0, v / vmax) * g)
        d.rounded_rectangle([cx - 120, by - h, cx + 120, by], radius=10, fill=col)
        lab_v = money(v) if v < 1e6 else '$9.28 million'
        text(d, (cx, by - h - 36), lab_v, F('serifb', 46), CREAM, prog(T, t + 0.3, 0.3), anchor='mm', base=CARD, rise=0)
        text(d, (cx, by + 34), lab, F('sansb', 30), CREAM, prog(T, t, 0.3), anchor='mm', base=CARD, rise=0)
        text(d, (cx, by + 70), sub, F('sansm', 26), MUTED, prog(T, t, 0.3), anchor='mm', base=CARD, rise=0)
    text(d, (560, 290), 'a state-university basketball coach', F('hand', 46), AMBER, prog(T, K18 + 1.5, 0.3), anchor='mm', base=CARD)
    aa = prog(T, A83, 0.3)
    if aa > 0:
        pill(d, 560, 200, "Alabama's #1 (2018): football coach, about $8.3M", aa, color=BG, fill=CREAM, font=F('sansb', 28))
    ax = prog(T, X23, 0.3)
    if ax > 0:
        d.rounded_rectangle([380, 360, 740, 520], radius=24, fill=mix(CORAL, ax, CARD))
        text(d, (560, 420), 'x 23', F('serifb', 90), (255, 255, 255), ax, anchor='mm', base=CORAL, rise=0)
        text(d, (560, 492), "the President's salary", F('sansb', 24), (255, 255, 255), ax, anchor='mm', base=CORAL, rise=0)
    finish(T, img, d, S_TWIST)


def s_punch(T, img, d):
    world(d, T)
    host(img, d, T, pose='shrug', face='smile', mood='happy', mt=PUNCH, x=1500, h=640)
    a = prog(T, PUNCH, 0.3)
    text(d, (620, 330), 'The most powerful job', F('serifb', 84), CREAM, a, anchor='mm')
    text(d, (620, 450), "isn't the best-paid one.", F('serifb', 84), AMBER, prog(T, PUNCH + 1.2, 0.3), anchor='mm')
    finish(T, img, d, S_TWIST)


def s_recap(T, img, d):
    world(d, T); head(d, T, 'RECAP: OFFICIAL 2026 PAY')
    host(img, d, T, pose='point', face='smile', x=1760, h=460)
    rows = [(n, v) for r, n, lab, v, tv, frz in sorted(LADDER, key=lambda x: x[0])]
    ce.hbars(d, T, rows, (560, 130, 1000, 62), REC + 1.0, stagger=0.45, grow=0.7, value_fmt=money,
             label_font=F('sansb', 30), value_font=F('sansb', 30), colors=[AMBER] + [SLATE] * 9, vmax=400000)
    ag = prog(T, GAP, 0.3)
    if ag > 0:
        pill(d, 960, 805, '#10 to #1: a $190,400 gap', ag, color=(255, 255, 255), fill=CORAL, font=F('sansb', 38))
    finish(T, img, d, S_ALL)


def s_cta(T, img, d):
    world(d, T)
    host(img, d, T, pose='wave' if T > end[18] else 'think', face='happy', mood='think' if T < end[18] else 'happy',
         mt=CTA + 0.3 if T < end[18] else end[18], x=420, h=640)
    a1 = prog(T, CTA + 0.4, 0.3)
    d.rounded_rectangle([820, 140, 1820, 330], radius=26, fill=mix(PANEL, a1))
    text(d, (1320, 200), 'Which one surprised you', F('serifb', 60), CREAM, a1, anchor='mm', base=PANEL)
    text(d, (1320, 275), 'the most?', F('serifb', 60), AMBER, a1, anchor='mm', base=PANEL)
    for i, (s, ph) in enumerate([('The frozen Vice President', 'the frozen vice president'), ('The judge who out-earns the cabinet', 'the judge who out earns'), ('The coach', 'or the coach')]):
        ai = prog(T, c.at(ph), 0.3)
        text(d, (870, 390 + i * 60), f'{"ABC"[i]})  {s}', F('sansb', 38), CREAM, ai, anchor='lm')
    pill(d, 1320, 610, 'SUBSCRIBE for the next Top 10', prog(T, SUB, 0.3), color=BG, fill=MINT, font=F('sansb', 48))
    text(d, (1320, 720), 'Next: the 10 biggest IPOs in history', F('hand', 60), AMBER, prog(T, c.at('the ten biggest'), 0.3), anchor='mm')
    finish(T, img, d, None)


def make_react(i, line1, line2, src, pose='shock'):
    t0 = seg[i]
    def scene(T, img, d):
        world(d, T); head(d, T); ladder(d, T)
        talking = T < end[i]
        k.actor(img, d, T, 760, GROUND, 600, pose=pose, face='talk' if talking else 'shock', mood='shock', mood_t=t0)
        a = prog(T, t0 + 0.2, 0.3)
        k.bubble(d, 1340, 330, line1, a, font=F('sansb', 46), tail_x=1000)
        text(d, (1340, 520), line2, F('hand', 56), AMBER, prog(T, t0 + 1.4, 0.3), anchor='mm')
        finish(T, img, d, src)
    scene.__name__ = f's_react{i}'
    return scene


scenes = [ce.Scene(0, s_hook), ce.Scene(T10 - 0.15, s10), ce.Scene(T9 - 0.2, s9), ce.Scene(T8 - 0.2, s8), ce.Scene(T7 - 0.2, s7),
          ce.Scene(T6 - 0.2, s6), ce.Scene(T6H - 0.15, make_react(7, 'Judge out-earns the Secretary of State?', '$249,900 vs $203,500 (paid)', S_EXC)), ce.Scene(T5 - 0.2, s5), ce.Scene(T4 - 0.2, s4), ce.Scene(T4H - 0.15, make_react(10, 'The VP paycheck is frozen?', 'paid $235,100, not $292,300', S_EXN, pose='think')), ce.Scene(T3 - 0.2, s3), ce.Scene(T2 - 0.2, s2),
          ce.Scene(T1 - 0.2, s1), ce.Scene(TW - 0.2, s_twist), ce.Scene(PUNCH - 0.2, s_punch), ce.Scene(REC - 0.2, s_recap),
          ce.Scene(CTA - 0.2, s_cta)]

if __name__ == '__main__':
    if sys.argv[1:] == ['stills']:
        pts = [('hook', T10 - 0.4), ('r10', P10 + 3), ('r9', M9 + 2), ('r8', P8 + 2), ('r7', V7 + 3), ('r6', G6 + 1.5),
               ('react7', end[7] - 0.3), ('r5', G5 + 1.5), ('r4', G4 + 1.5), ('react10', end[10] - 0.3), ('r3', NINTH3 + 1), ('r2', G2 + 1.5), ('r1', Y1 + 4), ('twist', X23 + 1.5),
               ('punch', PUNCH + 2.5), ('recap', GAP + 1), ('cta', DUR + 1)]
        for n, T in pts:
            ce.still(scenes, T, f'{HERE}/still_{n}.png', DUR + 2.0)
        print('ok')
    else:
        ce.render(scenes, AUD, HERE + '/final.mp4', tail=2.0)
        print(ce.sync_report(c, HERE + '/sync.json'))
