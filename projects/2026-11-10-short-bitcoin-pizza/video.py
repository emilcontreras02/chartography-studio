import sys, os, json
HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.join(HERE, '..', '..'))
import chartography_engine as ce
from chartography_engine import (F, text, text_block, prog, ease, mix, card, counter, hand_underline, chrome, eyebrow,
                                 mascot, pill, arrow, MINT, AMBER, CREAM, MUTED, PANEL, CORAL, BG)
ce.use_canvas('short'); W, H = ce.W, ce.H
AUD = HERE + '/vo_short.mp3'; DUR = ce.duration(AUD)
c = ce.Cues(json.load(open(HERE + '/words.json')), DUR)
PAPER = (240, 229, 203); INK = (44, 44, 52); INK2 = (120, 110, 95)

t_prog = c.at('a programmer wanted to prove')
t_10k = c.at('so he offered 10,000 bitcoin')
t_did = c.at('someone did')
t_41 = c.at('worth about 41 dollars')
t_run = c.at("now let's run that receipt")
t_74 = c.at('trading at around 74,200')
t_742 = c.at('cost about 742 million')
t_18 = c.at("that's roughly 18 million times")
t_dinner = c.at('probably the most expensive dinner')
t_fans = c.at('crypto fans still celebrate')


def dash(d, x0, x1, y, col):
    x = x0
    while x < x1:
        d.line([(x, y), (min(x + 14, x1), y)], fill=col, width=3)
        x += 26


def receipt(d, T, box, a):
    if a <= 0.01:
        return
    x0, y0, x1, y1 = box
    pts = [(x0, y0), (x1, y0), (x1, y1)]
    for i in range(14, -1, -1):
        pts.append((x0 + (x1 - x0) * i / 14, y1 + (16 if i % 2 else 0)))
    d.polygon(pts, fill=mix(PAPER, a))
    cx = (x0 + x1) / 2
    text(d, (cx, y0 + 70), 'RECEIPT  -  MAY 22, 2010', F('sansb', 40), INK, a, anchor='mm', base=PAPER, rise=0)
    dash(d, x0 + 40, x1 - 40, y0 + 125, mix(INK2, a, PAPER))
    for i, (lab, val, t0) in enumerate([('Item', '2 pizzas', 0.4), ('Buyer', 'a programmer', t_prog), ('Paid', '10,000 BTC', t_10k)]):
        aa = min(a, prog(T, t0, 0.4))
        y = y0 + 180 + i * 80
        text(d, (x0 + 50, y), lab, F('sansm', 44), INK, aa, base=PAPER, rise=8)
        text(d, (x1 - 50, y), val, F('sansb', 44), INK, aa, anchor='ra', base=PAPER, rise=8)
    aa = min(a, prog(T, t_41, 0.4))
    dash(d, x0 + 40, x1 - 40, y1 - 150, mix(INK2, aa, PAPER))
    text(d, (x0 + 50, y1 - 110), 'TOTAL', F('sansb', 52), INK, aa, base=PAPER, rise=8)
    text(d, (x1 - 50, y1 - 120), 'about $41', F('serifb', 76), INK, aa, anchor='ra', base=PAPER, rise=8)


def hook(T, img, d):
    text(d, (W/2, 330), '2 PIZZAS', F('serifb', 150), CREAM, prog(T, 0.0, 0.3), anchor='mm')
    text(d, (W/2, 480), '=', F('sansb', 110), MUTED, prog(T, 0.2, 0.3), anchor='mm')
    text(d, (W/2, 640), '$742 MILLION?', F('serifb', 120), CORAL, prog(T, 0.4, 0.3), anchor='mm')
    pill(d, W/2, 800, 'Receipt #1  -  May 22, 2010', prog(T, 0.6), color=AMBER, font=F('sansb', 44))
    mascot(img, (W/2 - 240, 930), 340, T=T, start=0.3)
    chrome(img, d, 'CoinDesk; BTC price Nov 9, 2026 (Sunday Guardian)')


def story(T, img, d):
    eyebrow(d, 'RECEIPT #1', prog(T, t_prog - 0.3))
    receipt(d, T, (100, 300, W - 100, 1000), prog(T, t_prog - 0.3))
    text_block(d, (110, 1110), 'Goal: prove bitcoin could buy real things', F('serif', 64), W - 220, CREAM, prog(T, t_prog + 0.6))
    text(d, (W/2, 1400), 'Someone delivered.', F('hand', 80), AMBER, prog(T, t_did), anchor='mm')
    chrome(img, d, 'CoinDesk: Bitcoin Pizza Day')


def machine(T, img, d):
    eyebrow(d, 'TIME MACHINE  >  NOV 9, 2026', prog(T, t_run))
    card(d, (80, 300, W - 80, 1300), prog(T, t_run))
    text(d, (W/2, 420), '1 bitcoin = about', F('sansm', 54), MUTED, prog(T, t_74), anchor='mm', base=PANEL)
    text(d, (W/2, 530), '$74,200', F('serifb', 130), CREAM, prog(T, t_74 + 0.3), anchor='mm', base=PANEL)
    text(d, (W/2, 660), 'x 10,000', F('sansb', 72), AMBER, prog(T, t_74 + 1.0), anchor='mm', base=PANEL)
    counter(d, (W/2, 870), 742, T, t_742, dur=1.4, suffix='M', font=F('serifb', 210), color=MINT)
    a = prog(T, t_18, 0.3)
    if a > 0:
        f = F('sansb', 64); s = 'x 18 MILLION'
        w = d.textlength(s, font=f) + 80
        d.rounded_rectangle([W/2 - w/2, 1050, W/2 + w/2, 1170], radius=16, outline=mix(CORAL, a, PANEL), width=9)
        text(d, (W/2, 1110), s, f, CORAL, a, anchor='mm', base=PANEL, rise=0)
    chrome(img, d, 'BTC about $74,201 on Nov 9, 2026 (Sunday Guardian)')


def ending(T, img, d):
    text(d, (W/2, 380), 'The most expensive', F('serif', 92), CREAM, prog(T, t_dinner), anchor='mm')
    text(d, (W/2, 500), 'dinner ever?', F('serifb', 120), AMBER, prog(T, t_dinner + 0.5), anchor='mm')
    pill(d, W/2, 680, 'May 22 = Bitcoin Pizza Day', prog(T, t_fans), color=BG, fill=MINT, font=F('sansb', 52))
    text(d, (W/2, 830), 'Would you have eaten the pizza?', F('hand', 76), MINT, prog(T, t_fans + 1.2), anchor='mm')
    mascot(img, (W/2 - 230, 960), 330, T=T, start=t_dinner + 0.4)
    text(d, (W/2, 1430), 'Full video: 5 Tiny Deals That Became Billion-Dollar Regrets', F('sansm', 32), MUTED, prog(T, t_fans + 1.5), anchor='mm')
    chrome(img, d)


scenes = [ce.Scene(0, hook), ce.Scene(t_prog - 0.45, story), ce.Scene(t_run - 0.15, machine), ce.Scene(t_dinner - 0.15, ending)]

if __name__ == '__main__':
    if sys.argv[1:] == ['stills']:
        for n, T in [('hook', 1.8), ('story', t_run - 0.3), ('machine', t_dinner - 0.3), ('ending', DUR - 0.2)]:
            ce.still(scenes, T, f'{HERE}/still_{n}.png', DUR + 1.5)
    else:
        ce.render(scenes, AUD, HERE + '/final.mp4', tail=1.5)
        print(ce.sync_report(c, HERE + '/sync.json'))
