import sys, os, json
HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.join(HERE, '..', '..'))
import chartography_engine as ce
from chartography_engine import (F, text, text_block, prog, mix, card, chrome, eyebrow, mascot, pill,
                                 MINT, AMBER, CREAM, MUTED, PANEL, CORAL, BG)
ce.use_canvas('short'); W, H = ce.W, ce.H
AUD = HERE + '/vo_short.mp3'; DUR = ce.duration(AUD)
c = ce.Cues(json.load(open(HERE + '/words.json')), DUR)
PAPER = (240, 229, 203); INK = (44, 44, 52)

t_found = c.at("googall's founders offered their little search engine")
t_big = c.at('one of the biggest web sites of the day')
t_1m = c.at('the price started at one million dollars')
t_750 = c.at('then it dropped to seven hundred fifty thousand')
t_no = c.at('excites boss said no')
t_tm = c.at('time machine')
t_35 = c.at('worth about three point five trillion')
t_47 = c.at('four point seven million times more')
t_end = c.at('the price excite turned down')


def hook(T, img, d):
    pill(d, W/2, 330, '1999', prog(T, 0.0, 0.25), color=BG, fill=AMBER, font=F('sansb', 56))
    text(d, (W/2, 520), '$750,000', F('serifb', 190), MINT, prog(T, 0.05, 0.3), anchor='mm')
    text(d, (W/2, 690), 'for all of Google?', F('serif', 92), CREAM, prog(T, 0.25, 0.3), anchor='mm')
    mascot(img, (W/2 - 230, 860), 340, T=T, start=0.3)
    text(d, (W/2, 1330), 'Billion-dollar regret #3', F('hand', 70), AMBER, prog(T, 1.2), anchor='mm')
    chrome(img, d, 'Fortune (Sept 29, 2010)')


def tag(d, x, y, s, a, struck=0.0, color=INK):
    if a <= 0.01:
        return
    f = F('serifb', 96)
    w = d.textlength(s, font=f) + 90
    d.rounded_rectangle([x - w/2, y - 80, x + w/2, y + 80], radius=24, fill=mix(PAPER, a))
    text(d, (x, y), s, f, color, a, anchor='mm', base=PAPER, rise=0)
    if struck > 0:
        d.line([(x - w/2 + 20, y + 40), (x - w/2 + 20 + (w - 40) * struck, y - 40)], fill=CORAL, width=12)


def offer(T, img, d):
    eyebrow(d, 'THE OFFER, 1999', prog(T, t_found - 0.3))
    text_block(d, (90, 320), "Google's founders tried to sell to Excite", F('serif', 70), W - 180, CREAM, prog(T, t_found))
    pill(d, W/2, 700, 'Excite = one of the biggest websites of 1999', prog(T, t_big) * (1 - prog(T, t_1m - 0.45, 0.25)), color=CREAM, fill=PANEL, font=F('sansm', 40))
    text(d, (W/2, 600), 'Asking price', F('sansm', 50), MUTED, prog(T, t_1m), anchor='mm')
    tag(d, W/2, 730, '$1,000,000', prog(T, t_1m, 0.3), struck=prog(T, t_750 - 0.2, 0.4))
    text(d, (W/2, 900), 'then...', F('hand', 70), AMBER, prog(T, t_750 - 0.1), anchor='mm')
    tag(d, W/2, 1060, '$750,000', prog(T, t_750 + 0.3, 0.3), color=(30, 120, 80))
    a = prog(T, t_no, 0.25)
    if a > 0:
        f = F('sansb', 120); s = 'EXCITE: NO'
        w = d.textlength(s, font=f) + 80
        d.rounded_rectangle([W/2 - w/2, 1240, W/2 + w/2, 1420], radius=18, outline=mix(CORAL, a), width=12)
        text(d, (W/2, 1330), s, f, CORAL, a, anchor='mm', rise=0)
    chrome(img, d, 'Fortune (Sept 29, 2010)')


def machine(T, img, d):
    eyebrow(d, 'TIME MACHINE  >  NOV 2026', prog(T, t_tm))
    card(d, (80, 300, W - 80, 1380), prog(T, t_tm))
    fa = prog(T, t_tm, 0.3) * (1 - prog(T, t_47 - 0.6, 0.3))
    text(d, (W/2, 1000), '1999  >  2026', F('serifb', 120), AMBER, fa, anchor='mm', base=PANEL, rise=0)
    text(d, (W/2, 420), "Alphabet (Google's parent) is worth", F('sansm', 46), MUTED, prog(T, t_tm + 0.6), anchor='mm', base=PANEL)
    text(d, (W/2, 570), '$3.5', F('serifb', 210), MINT, prog(T, t_35 + 0.2, 0.3), anchor='mm', base=PANEL)
    text(d, (W/2, 720), 'TRILLION', F('sansb', 96), MINT, prog(T, t_35 + 0.5, 0.3), anchor='mm', base=PANEL)
    text(d, (W/2, 880), 'That is about', F('sansm', 50), MUTED, prog(T, t_47 - 0.2), anchor='mm', base=PANEL)
    a = prog(T, t_47 + 0.3, 0.3)
    if a > 0:
        f = F('serifb', 120); s = 'x 4.7 MILLION'
        w = d.textlength(s, font=f) + 80
        d.rounded_rectangle([W/2 - w/2, 940, W/2 + w/2, 1110], radius=18, outline=mix(CORAL, a, PANEL), width=10)
        text(d, (W/2, 1025), s, f, CORAL, a, anchor='mm', base=PANEL, rise=0)
    text(d, (W/2, 1220), 'the price Excite turned down', F('hand', 72), AMBER, prog(T, t_end), anchor='mm', base=PANEL)
    chrome(img, d, 'Market value: StockTitan, data through Nov 7, 2026')


def ending(T, img, d):
    s = t_end + 1.0
    text(d, (W/2, 400), '$750,000 in 1999.', F('serifb', 100), CREAM, prog(T, s - 0.1), anchor='mm')
    text(d, (W/2, 540), 'Would you have said yes?', F('hand', 84), MINT, prog(T, s + 0.3), anchor='mm')
    mascot(img, (W/2 - 230, 680), 340, T=T, start=s + 0.2)
    text_block(d, (110, 1180), 'Full video: 5 Tiny Deals That Became Billion-Dollar Regrets', F('sansm', 40), W - 220, MUTED, prog(T, s + 0.5))
    chrome(img, d)


scenes = [ce.Scene(0, hook), ce.Scene(t_found - 0.45, offer), ce.Scene(t_tm - 0.15, machine), ce.Scene(t_end + 0.9, ending)]

if __name__ == '__main__':
    if sys.argv[1:] == ['stills']:
        for n, T in [('hook', 2.2), ('offer', t_tm - 0.3), ('machine', t_end + 1.2), ('ending', DUR + 1.8)]:
            ce.still(scenes, T, f'{HERE}/still_{n}.png', DUR + 1.9)
    else:
        ce.render(scenes, AUD, HERE + '/final.mp4', tail=1.9)
        print(ce.sync_report(c, HERE + '/sync.json'))
