import sys, os, json
HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.join(HERE, '..', '..'))
import chartography_engine as ce
from chartography_engine import (F, text, text_block, prog, ease, clamp, mix, pill, card, counter, hand_underline, chrome,
                                 eyebrow, mascot, MINT, AMBER, CREAM, MUTED, PANEL, CORAL, SLATE, EMPTY, GRID, BG)

ce.use_canvas('short')
W, H = ce.W, ce.H
AUD = HERE + '/vo_short.mp3'; DUR = ce.duration(AUD)
c = ce.Cues(json.load(open(HERE + '/words.json')), DUR)
GOLD = (232, 190, 92)

t_best = c.at('had its best year since 1979')
t_jan = c.at('then in january')
t_5000 = c.at('passed 5000 dollars an ounce')
t_5500 = c.at('past 5500')
t_rec = c.at('all the way to a record')
t_why = c.at('analysts pointed to a weaker')
t_tension = c.at('tension in the middle least')
t_print = c.at('a fear that governments')
t_drop = c.at('then came the drop')
t_june = c.at('by late june gold had slipped')
t_oct = c.at('then on october thirtieth')
t_week = c.at("and this week it's back under")
t_gone = c.at("that's more than 1500 dollars gone")
t_quarter = c.at('the safe haven lost more than a quarter')

SRC = 'Kitco; Al Jazeera (Jan 29, 2026); LiteFinance (Nov 12, 2026)'


def gold_bar(d, cx, cy, w, a, lost=0.0):
    if a <= 0.01:
        return
    h = w * 0.36
    cy += (1 - a) * 24
    pts = [(cx - w * 0.36, cy - h / 2), (cx + w * 0.36, cy - h / 2), (cx + w / 2, cy + h / 2), (cx - w / 2, cy + h / 2)]
    d.polygon(pts, fill=mix(GOLD, a))
    if lost > 0:
        xr = cx + w / 2 - w * lost
        cut = [(max(x, xr), y) for x, y in pts]
        d.polygon(cut, fill=mix(CORAL, a))
    d.line([(cx - w * 0.3, cy - h * 0.25), (cx + w * 0.1, cy - h * 0.25)], fill=mix((255, 230, 160), a), width=8)


def hook(T, img, d):
    a = prog(T, 0.0, 0.25)
    text(d, (W/2, 330), 'ONE OUNCE OF GOLD', F('sansb', 44), MINT, a, anchor='mm', rise=8)
    text(d, (W/2, 520), '-$1,500?', F('serifb', 180), CORAL, a, anchor='mm')
    text(d, (W/2, 700), 'from its record', F('serif', 80), CREAM, prog(T, 0.3, 0.3), anchor='mm')
    a2 = prog(T, t_best)
    card(d, (90, 820, W - 90, 1080), a2)
    text(d, (W/2, 880), 'BUT FIRST: 2025', F('sansb', 40), AMBER, a2, anchor='mm', base=PANEL)
    text(d, (W/2, 980), 'best year since 1979', F('serifb', 76), CREAM, a2, anchor='mm', base=PANEL)
    mascot(img, (W/2 - 160, 1130), 330, T=T, start=0.15)
    chrome(img, d, 'ABC News (Dec 2025); Kitco; LiteFinance (Nov 12, 2026)')


def climb(T, img, d):
    eyebrow(d, 'JANUARY 2026: IT KEPT RUNNING', prog(T, t_jan))
    # vertical thermometer
    x0, x1, yb, yt = 140, 280, 1450, 330
    a = prog(T, t_jan)
    d.rounded_rectangle([x0, yt, x1, yb], radius=70, fill=mix(EMPTY, a))
    lv = 0.0
    for v, t0 in ((5000, t_5000), (5500, t_5500), (5600, t_rec)):
        if T > t0:
            lv = max(lv, 0.0 + (v - 4400) / 1250 * ease((T - t0) / 0.7) + (lv if False else 0))
    target = 0.0
    if T > t_5000: target = (5000 - 4400) / 1250
    if T > t_5500: target = (5500 - 4400) / 1250
    if T > t_rec: target = (5600 - 4400) / 1250
    fill_h = (yb - yt) * target
    if fill_h > 4:
        d.rounded_rectangle([x0 + 14, yb - fill_h, x1 - 14, yb - 14], radius=56, fill=GOLD)
    for v, t0, lab in ((5000, t_5000, 'Past $5,000'), (5500, t_5500, 'Past $5,500'), (5600, t_rec, 'Record: about $5,600')):
        y = yb - (yb - yt) * (v - 4400) / 1250
        aa = prog(T, t0)
        d.line([(x1 + 20, y), (x1 + 90, y)], fill=mix(CREAM, aa), width=6)
        col = AMBER if v == 5600 else CREAM
        text(d, (x1 + 110, y + (30 if v == 5500 else 0 if v == 5000 else -50)), lab, F('serifb', 50 if v == 5600 else 58), col, aa, anchor='lm')
    text(d, (x1 + 110, 1300), 'per ounce', F('hand', 70), MUTED, prog(T, t_5000 + 0.5), anchor='lm')
    chrome(img, d, 'Al Jazeera (Jan 29, 2026); Kitco')


def why(T, img, d):
    eyebrow(d, 'WHY? WHAT ANALYSTS SAID', prog(T, t_why))
    items = [('A weaker US dollar', t_why + 1.0), ('Tension in the Middle East', t_tension), ('Fear of money printing', t_print)]
    for i, (lab, t0) in enumerate(items):
        a = prog(T, t0)
        y0 = 360 + i * 330
        card(d, (90, y0, W - 90, y0 + 270), a)
        text(d, (160, y0 + 135), str(i + 1), F('serifb', 140), GOLD, a, anchor='lm', base=PANEL)
        text_block(d, (300, y0 + 75), lab, F('serifb', 66), W - 440, CREAM, a, base=PANEL)
    chrome(img, d, 'Al Jazeera (Jan 29, 2026); Reuters (Jan 2026)')


def drop(T, img, d):
    eyebrow(d, 'THEN CAME THE DROP', prog(T, t_drop))
    rows = [('Late Jan', 'about $5,600', GOLD, t_drop + 0.3), ('Late June', 'below $4,000', CORAL, t_june),
            ('Oct 30', 'about $3,940', CORAL, t_oct), ('This week', 'under $4,000', CORAL, t_week)]
    for i, (when, val, col, t0) in enumerate(rows):
        a = prog(T, t0)
        y = 330 + i * 290
        x = 90 + i * 40
        card(d, (x, y, x + 860, y + 210), a)
        text(d, (x + 40, y + 50), when.upper(), F('sansb', 36), MUTED, a, base=PANEL)
        text(d, (x + 40, y + 100), val, F('serifb', 84), col, a, base=PANEL)
        if i < 3:
            ap = prog(T, rows[i + 1][3] - 0.3)
            if ap > 0.01:
                cx = x + 900
                d.polygon([(cx, y + 250), (cx - 26, y + 205), (cx + 26, y + 205)], fill=mix(CORAL, ap))
                d.line([(cx, y + 150), (cx, y + 215)], fill=mix(CORAL, ap), width=10)
    chrome(img, d, 'BNN Bloomberg (Jun 24); ROIC/Reuters (Oct 30); LiteFinance (Nov 12, 2026)')


def punch(T, img, d):
    a = prog(T, t_gone)
    text(d, (W/2, 330), 'GONE FROM EVERY OUNCE', F('sansb', 44), MINT, a, anchor='mm', rise=8)
    text(d, (W/2, 480), '-$1,500+', F('serifb', 170), CORAL, a, anchor='mm')
    aq = prog(T, t_quarter)
    gold_bar(d, W/2, 760, 760, prog(T, t_gone + 0.4), lost=0.27 * ease((T - t_quarter - 0.4) / 1.2))
    text(d, (W/2, 960), 'The safe haven lost', F('serif', 76), CREAM, aq, anchor='mm')
    text(d, (W/2, 1060), 'more than a quarter', F('serifb', 92), AMBER, prog(T, t_quarter + 0.6), anchor='mm')
    text(d, (W/2, 1160), 'of its value.', F('serifb', 92), AMBER, prog(T, t_quarter + 1.0), anchor='mm')
    text(d, (W/2, 1250), 'Still think gold is safe?', F('hand', 66), MUTED, prog(T, t_quarter + 2.0), anchor='mm')
    mascot(img, (W/2 - 120, 1300), 190, T=T, start=t_quarter + 1.4, flip=True)
    chrome(img, d, SRC)


scenes = [ce.Scene(0, hook), ce.Scene(t_jan - 0.15, climb), ce.Scene(t_why - 0.15, why), ce.Scene(t_drop - 0.15, drop),
          ce.Scene(t_gone - 0.15, punch)]

if __name__ == '__main__':
    if sys.argv[1:] == ['stills']:
        ss = sorted(scenes, key=lambda s: s.start)
        for k, s in enumerate(ss):
            T = (ss[k + 1].start - 0.3) if k + 1 < len(ss) else DUR + 1.0
            ce.still(scenes, T, f'{HERE}/still_{k}.png', DUR + 1.5)
    else:
        ce.render(scenes, AUD, HERE + '/final.mp4', tail=1.5)
        print(ce.sync_report(c, HERE + '/sync.json'))
