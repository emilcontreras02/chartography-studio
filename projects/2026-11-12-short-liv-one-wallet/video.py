import sys, os, json, math
HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.join(HERE, '..', '..'))
import chartography_engine as ce
from chartography_engine import (F, text, text_block, prog, ease, mix, card, counter, hand_underline, chrome, eyebrow,
                                 mascot, pill, arrow, vbars, MINT, AMBER, CREAM, MUTED, PANEL, CORAL, BG, SLATE, EMPTY)
ce.use_canvas('short'); W, H = ce.W, ce.H
AUD = HERE + '/vo_short.mp3'; DUR = ce.duration(AUD)
c = ce.Cues(json.load(open(HERE + '/words.json')), DUR)

# cues in script order (phrases spelled as the transcriber heard them where needed)
t_year = c.at('in its first year')
t_255 = c.at('paid out 255 million dollars')
t_one = c.at('almost all of it came from one place')
t_fund = c.at('a souty fund')
t_eight = c.at('that first season had just eight tournaments')
t_32 = c.at("that's about 32 million dollars per event")
t_14 = c.at('then the schedule grew to 14 events')
t_405 = c.at('the prize fund reached 405 million')
t_april = c.at('then in late april')
t_closed = c.at('the wallet closed')
t_pulled = c.at('the fund pulled its money')
t_sept = c.at('by early september')
t_ch11 = c.at('had filed for chapter 11')
t_biz = c.at('a business with one customer')
t_allow = c.at("it's an allowance")

SRC = 'Wikipedia: LIV Golf; Golf Channel, Nov 5, 2026'


def hook(T, img, d):
    text(d, (W/2, 330), 'YEAR ONE PRIZE MONEY', F('sansb', 46), MUTED, prog(T, 0.0, 0.3), anchor='mm')
    text(d, (W/2, 520), '$255M', F('serifb', 240), MINT, prog(T, 0.05, 0.3), anchor='mm')
    text(d, (W/2, 720), '...from ONE wallet?', F('handb', 110), AMBER, prog(T, 0.35, 0.3), anchor='mm')
    a = prog(T, t_one)
    pill(d, W/2, 880, 'A brand-new golf league, 2022', prog(T, 0.6), color=CREAM, font=F('sansb', 44))
    mascot(img, (W/2 - 230, 980), 360, T=T, start=0.3)
    chrome(img, d, SRC)


def source(T, img, d):
    """One tap, many pipes: every dollar flows from a single source."""
    eyebrow(d, 'WHERE THE MONEY CAME FROM', prog(T, t_one - 0.3))
    a = prog(T, t_one - 0.2)
    cx, cy = W/2, 520
    r = 150
    d.ellipse([cx - r, cy - r, cx + r, cy + r], fill=mix(AMBER, a), outline=None)
    text(d, (cx, cy - 30), 'ONE', F('serifb', 96), BG, a, anchor='mm', base=AMBER, rise=0)
    text(d, (cx, cy + 50), 'source', F('sansb', 44), BG, a, anchor='mm', base=AMBER, rise=0)
    b = prog(T, t_fund, 0.5)
    text(d, (cx, cy + r + 70), "Saudi Arabia's PIF", F('serifb', 76), CREAM, b, anchor='mm')
    text(d, (cx, cy + r + 150), '(Public Investment Fund)', F('sansm', 40), MUTED, b, anchor='mm')
    # pipes fanning down into 8 purses
    n = 8
    for i in range(n):
        x = 110 + i * (W - 220) / (n - 1)
        p = ease((T - t_one - 0.8 - i * 0.12) / 0.6)
        if p <= 0:
            continue
        y0, y1 = cy + r + 210, 1300
        ye = y0 + (y1 - y0) * p
        xe = cx + (x - cx) * p
        d.line([(cx, y0), (xe, ye)], fill=mix(SLATE, 1.0), width=6)
        if p > 0.95:
            d.ellipse([x - 34, y1 - 34, x + 34, y1 + 34], fill=MINT)
            text(d, (x, y1), '$', F('sansb', 40), BG, 1.0, anchor='mm', base=MINT, rise=0)
    text(d, (W/2, 1420), 'Almost every check: one payer', F('hand', 70), AMBER, prog(T, t_fund + 0.3), anchor='mm')
    chrome(img, d, SRC)


def tiles(T, img, d):
    """8 tournaments, about $32M each."""
    eyebrow(d, 'SEASON ONE: 2022', prog(T, t_eight - 0.2))
    text(d, (W/2, 330), 'Just 8 tournaments', F('serifb', 92), CREAM, prog(T, t_eight), anchor='mm')
    cols, rows = 2, 4
    tw, th, gx, gy = 420, 200, 40, 34
    x0 = (W - (cols * tw + gx)) / 2
    y0 = 450
    for k in range(8):
        r_, c_ = divmod(k, cols)
        a = prog(T, t_eight + 0.5 + k * 0.12, 0.35)
        if a <= 0:
            continue
        bx = x0 + c_ * (tw + gx); by = y0 + r_ * (th + gy)
        d.rounded_rectangle([bx, by, bx + tw, by + th], radius=24, fill=mix(PANEL, a))
        text(d, (bx + 30, by + 34), f'EVENT {k + 1}', F('sansb', 30), MUTED, a, base=PANEL, rise=0)
        b = prog(T, t_32 + k * 0.1, 0.35)
        text(d, (bx + tw / 2, by + 125), '~$32M', F('serifb', 84), MINT, b, anchor='mm', base=PANEL, rise=10)
    text(d, (W/2, 1430), '$255M / 8 = about $32M each, on average', F('sansm', 40), AMBER, prog(T, t_32 + 1.2), anchor='mm')
    chrome(img, d, SRC)


def growth(T, img, d):
    """2022 vs 2023: more events, bigger fund."""
    eyebrow(d, 'THEN IT GREW', prog(T, t_14 - 0.2))
    text(d, (W/2, 330), 'Bigger every year', F('serifb', 92), CREAM, prog(T, t_14), anchor='mm')
    card(d, (70, 430, W/2 - 20, 820), prog(T, t_14))
    card(d, (W/2 + 20, 430, W - 70, 820), prog(T, t_14 + 0.2))
    a1 = prog(T, t_14 + 0.1); a2 = prog(T, t_14 + 0.6)
    text(d, (W/4 + 25, 500), '2022', F('sansb', 40), MUTED, a1, anchor='mm', base=PANEL, rise=0)
    text(d, (W/4 + 25, 640), '8', F('serifb', 170), SLATE, a1, anchor='mm', base=PANEL)
    text(d, (W/4 + 25, 765), 'events', F('sansm', 40), MUTED, a1, anchor='mm', base=PANEL, rise=0)
    text(d, (3*W/4 - 25, 500), 'From 2023', F('sansb', 40), MUTED, a2, anchor='mm', base=PANEL, rise=0)
    text(d, (3*W/4 - 25, 640), '14', F('serifb', 170), MINT, a2, anchor='mm', base=PANEL)
    text(d, (3*W/4 - 25, 765), 'events a year', F('sansm', 40), MUTED, a2, anchor='mm', base=PANEL, rise=0)
    text(d, (110, 900), 'Prize money', F('sansb', 40), CREAM, prog(T, t_405 - 0.3), rise=8)
    vbars(d, T, [('2022', 255), ('2023 fund', 405)], (140, 1390, W - 280, 380), t_405 - 0.4, stagger=0.35,
          value_fmt=lambda v: f'${v:,.0f}M', colors=[SLATE, MINT], vmax=405,
          label_font=F('sansm', 40), value_font=F('serifb', 72))
    chrome(img, d, SRC)


def timeline(T, img, d):
    """The wallet closes: a vertical 2026 timeline."""
    eyebrow(d, '2026: THE WALLET CLOSES', prog(T, t_april - 0.2))
    x = 200
    y_top, y_bot = 360, 1380
    p = ease((T - t_april) / 7.0)
    d.line([(x, y_top), (x, y_top + (y_bot - y_top) * max(p, 0.02))], fill=SLATE, width=8)
    items = [
        (t_april, 'APR 30', 'Saudi fund: money ends', 'after the 2026 season', CORAL, 400),
        (t_sept, 'SEPT', 'LIV files for', 'Chapter 11 bankruptcy', CORAL, 760),
        (t_ch11 + 1.0, 'NOV 10', 'Liquidation plan', 'filed in court', AMBER, 1120),
    ]
    for t0, date, l1, l2, col, y in items:
        a = prog(T, t0, 0.45)
        if a <= 0:
            continue
        d.ellipse([x - 30, y - 30, x + 30, y + 30], fill=mix(col, a))
        text(d, (x + 70, y - 70), date, F('sansb', 44), col, a, rise=8)
        text(d, (x + 70, y - 10), l1, F('serifb', 64), CREAM, a, rise=8)
        text(d, (x + 70, y + 70), l2, F('serif', 56), MUTED, a, rise=8)
    # empty wallet meter
    a = prog(T, t_closed)
    if a > 0:
        fr = 1 - ease((T - t_closed) / 1.5)
        bx0, by0, bx1, by1 = 640, 270, 1000, 314
        d.rounded_rectangle([bx0, by0, bx1, by1], radius=14, fill=mix(EMPTY, a))
        if fr > 0.01:
            d.rounded_rectangle([bx0, by0, bx0 + (bx1 - bx0) * fr, by1], radius=14, fill=mix(MINT, a))
        text(d, (bx0 - 20, (by0 + by1) / 2), 'wallet: empty' if fr < 0.05 else 'wallet', F('hand', 56), AMBER, a, anchor='rm', rise=0)
    chrome(img, d, 'Al Jazeera, Apr 30 and Sept 9, 2026; AP, Nov 10, 2026')


def ending(T, img, d):
    a = prog(T, t_biz)
    text(d, (W/2, 360), 'One customer', F('serifb', 110), CREAM, a, anchor='mm')
    text(d, (W/2, 490), 'is not a business.', F('serif', 90), MUTED, prog(T, t_biz + 0.8), anchor='mm')
    text(d, (W/2, 660), "It's an", F('serif', 90), CREAM, prog(T, t_allow), anchor='mm')
    text(d, (W/2, 800), 'ALLOWANCE.', F('serifb', 124), AMBER, prog(T, t_allow + 0.25), anchor='mm')
    hand_underline(d, 170, W - 170, 890, prog(T, t_allow + 0.6, 0.6), color=CORAL)
    mascot(img, (W/2 - 220, 950), 330, T=T, start=t_allow + 0.3)
    text(d, (W/2, 1330), 'Could any league survive that?', F('hand', 72), MINT, prog(T, t_allow + 0.9), anchor='mm')
    text(d, (W/2, 1440), "Full video: LIV Golf's $5 Billion Collapse", F('sansm', 34), MUTED, prog(T, t_allow + 1.1), anchor='mm')
    chrome(img, d)


scenes = [ce.Scene(0, hook), ce.Scene(t_one - 0.45, source), ce.Scene(t_eight - 0.15, tiles),
          ce.Scene(t_14 - 0.15, growth), ce.Scene(t_april - 0.15, timeline), ce.Scene(t_biz - 0.15, ending)]

if __name__ == '__main__':
    if sys.argv[1:] == ['stills']:
        for n, T in [('hook', 3.0), ('source', t_eight - 0.25), ('tiles', t_14 - 0.3), ('growth', t_april - 0.3),
                     ('timeline', t_biz - 0.3), ('ending', DUR - 0.3)]:
            ce.still(scenes, T, f'{HERE}/still_{n}.png', DUR + 1.5)
        print({k: round(v, 2) for k, v in dict(one=t_one, eight=t_eight, n14=t_14, april=t_april, ch11=t_ch11, biz=t_biz).items()})
    else:
        ce.render(scenes, AUD, HERE + '/final.mp4', tail=1.5)
        print(ce.sync_report(c, HERE + '/sync.json'))
