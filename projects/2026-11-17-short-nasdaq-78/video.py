import sys, os, json
HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.join(HERE, '..', '..'))
import chartography_engine as ce
from chartography_engine import (F, text, text_block, prog, ease, mix, card, counter, hand_underline, chrome, eyebrow,
                                 mascot, pill, arrow, MINT, AMBER, CREAM, MUTED, PANEL, CORAL, BG, SLATE, GRID)
ce.use_canvas('short'); W, H = ce.W, ce.H
AUD = HERE + '/vo_short.mp3'; DUR = ce.duration(AUD)
c = ce.Cues(json.load(open(HERE + '/words.json')), DUR)
SRC = 'Wikipedia: Dot-com bubble (Nasdaq peak Mar 10, 2000; low Oct 2002)'

t_5048 = c.at('hit 5,048')
t_sure = c.at('everyone was sure the internet')
t_oct = c.at('by october two thousand two the')
t_78 = c.at('had fallen seventy eight per cent')
t_5t = c.at('about five trillion dollars')
t_cisco = c.at('Cisco, one of the stars')
t_80 = c.at('fell around eighty per cent')
t_amzn = c.at('Amazon dropped from 113')
t_15 = c.at('to about 15')
t_crash = c.at('does that mean a i is about to crash')
t_twist = c.at("here's the twist")
t_nobody = c.at('nobody knows when a bubble pops')
t_experts = c.at('not even the experts')
t_fake = c.at('a bubble bursting does not mean')
t_look = c.at('look at the internette')
t_burst = c.at('the bubble burst')
t_didnt = c.at("the internet didn't")


def hook(T, img, d):
    # hook card: payoff number on screen by 0.3 s
    card(d, (90, 280, W - 90, 900), prog(T, 0.0, 0.3))
    text(d, (W/2, 380), 'NASDAQ', F('sansb', 70), MUTED, prog(T, 0.0, 0.3), anchor='mm', base=PANEL)
    text(d, (W/2, 590), '-78%?', F('serifb', 250), CORAL, prog(T, 0.1, 0.3), anchor='mm', base=PANEL)
    text(d, (W/2, 800), 'the dot-com crash, 2000-2002', F('hand', 66), AMBER, prog(T, 0.3, 0.3), anchor='mm', base=PANEL)
    pill(d, W/2, 1010, 'March 2000 peak:  5,048', prog(T, t_5048), color=BG, fill=MINT, font=F('sansb', 54))
    mascot(img, (W/2 - 200, 1110), 330, T=T, start=0.3)
    chrome(img, d, SRC)


def elevator(T, img, d):
    # one tall column that collapses to 22% of its height
    eyebrow(d, 'NASDAQ COMPOSITE', prog(T, t_sure - 0.2))
    text_block(d, (70, 270), 'Everyone was sure the internet would change everything.', F('serif', 58), W - 140, CREAM, prog(T, t_sure))
    x0, x1, base, top = 110, 400, 1430, 520
    a = prog(T, t_sure, 0.4)
    full = base - top
    p = ease(prog(T, t_78, 1.4))
    h = full * (1 - 0.78 * p)
    if a > 0:
        d.rectangle([x0, top, x1, base], outline=mix(GRID, a), width=4)
        d.rectangle([x0, base - h, x1, base], fill=mix(MINT if p < 0.5 else CORAL, a))
        text(d, ((x0 + x1) / 2, base + 40), 'Mar 2000', F('sansb', 40), MUTED, a, anchor='mm', rise=0)
    text(d, (x0 + 40, top - 50), '5,048', F('serifb', 64), CREAM, a, anchor='lm', rise=0)
    text(d, (470, 760), 'Oct 2002', F('sansb', 52), AMBER, prog(T, t_oct), rise=10)
    text(d, (470, 830), '-78%', F('serifb', 160), CORAL, prog(T, t_78 + 0.3), rise=10)
    a5 = prog(T, t_5t)
    text(d, (470, 1080), 'about', F('sansm', 44), MUTED, a5, rise=10)
    counter(d, (470, 1185), 5, T, t_5t + 0.2, dur=1.0, suffix=' trillion', font=F('serifb', 80), color=AMBER, anchor='lm')
    text(d, (470, 1270), 'of market value gone', F('sansm', 42), MUTED, a5, rise=10)
    chrome(img, d, SRC)


def stars(T, img, d):
    eyebrow(d, 'THE STARS OF THE BOOM', prog(T, t_cisco - 0.2))
    # Cisco card
    a = prog(T, t_cisco)
    card(d, (70, 290, W - 70, 760), a)
    text(d, (130, 340), 'Cisco', F('serifb', 96), CREAM, a, base=PANEL)
    text(d, (W - 130, 360), 'about -80%', F('serifb', 80), CORAL, prog(T, t_80), anchor='ra', base=PANEL)
    pb = ease(prog(T, t_80, 1.0))
    if a > 0:
        d.rounded_rectangle([130, 560, W - 130, 660], radius=14, fill=mix((34, 56, 84), a, PANEL))
        wfull = W - 260
        d.rounded_rectangle([130, 560, 130 + wfull * (1 - 0.8 * pb), 660], radius=14, fill=mix(SLATE, a, PANEL))
    # Amazon card
    a2 = prog(T, t_amzn)
    card(d, (70, 820, W - 70, 1430), a2)
    text(d, (130, 870), 'Amazon', F('serifb', 96), CREAM, a2, base=PANEL)
    text(d, (130, 1010), 'per share', F('sansm', 44), MUTED, a2, base=PANEL)
    text(d, (W/2 - 60, 1180), '$113', F('serifb', 150), MINT, prog(T, t_amzn + 0.5), anchor='rm', base=PANEL)
    arrow(d, (W/2 - 20, 1180), (W/2 + 100, 1180), prog(T, t_15 - 0.3), color=MUTED, width=8)
    text(d, (W/2 + 140, 1180), '$15', F('serifb', 150), CORAL, prog(T, t_15), anchor='lm', base=PANEL)
    text(d, (W/2, 1360), 'about', F('hand', 60), AMBER, prog(T, t_15 + 0.2), anchor='mm', base=PANEL)
    chrome(img, d, 'Wikipedia: Dot-com bubble; Commoncog: How Amazon survived the dot-com bust')


def question(T, img, d):
    text(d, (W/2, 380), 'So is AI', F('serif', 96), CREAM, prog(T, t_crash), anchor='mm')
    text(d, (W/2, 510), 'about to crash?', F('serifb', 116), AMBER, prog(T, t_crash + 0.4), anchor='mm')
    pill(d, W/2, 720, "HERE'S THE TWIST", prog(T, t_twist), color=BG, fill=CORAL, font=F('sansb', 60))
    text_block(d, (110, 880), 'Nobody knows when a bubble pops.', F('serifb', 86), W - 220, CREAM, prog(T, t_nobody))
    text(d, (W/2, 1330), 'not even the experts', F('hand', 84), MINT, prog(T, t_experts), anchor='mm')
    hand_underline(d, 230, W - 230, 1390, prog(T, t_experts + 0.3, 0.6), color=MINT)
    chrome(img, d)


def ending(T, img, d):
    a = prog(T, t_fake)
    text(d, (W/2, 320), 'A bubble bursting', F('serif', 76), CREAM, a, anchor='mm')
    text(d, (W/2, 420), 'is not fake tech.', F('serifb', 90), AMBER, prog(T, t_fake + 0.6), anchor='mm')
    text(d, (W/2, 600), 'Look at the internet:', F('sansm', 56), MUTED, prog(T, t_look), anchor='mm')
    text(d, (W/2, 730), 'The bubble burst.', F('serifb', 92), CORAL, prog(T, t_burst), anchor='mm')
    text(d, (W/2, 870), "The internet didn't.", F('serifb', 92), MINT, prog(T, t_didnt), anchor='mm')
    mascot(img, (W/2 - 190, 960), 300, T=T, start=t_burst)
    pill(d, W/2, 1330, 'Bubble, or the next internet?', prog(T, t_didnt + 0.9), color=BG, fill=AMBER, font=F('sansb', 52))
    text(d, (W/2, 1440), 'Full video: What Happens If the AI Bubble Bursts?', F('sansm', 34), MUTED, prog(T, t_didnt + 1.2), anchor='mm')
    chrome(img, d)


scenes = [ce.Scene(0, hook), ce.Scene(t_sure - 0.15, elevator), ce.Scene(t_cisco - 0.15, stars),
          ce.Scene(t_crash - 0.15, question), ce.Scene(t_fake - 0.15, ending)]

if __name__ == '__main__':
    if sys.argv[1:] == ['stills']:
        for n, T in [('hook', t_sure - 0.3), ('elevator', t_cisco - 0.3), ('stars', t_crash - 0.3), ('question', t_fake - 0.3), ('ending', DUR + 0.3)]:
            ce.still(scenes, T, f'{HERE}/still_{n}.png', DUR + 1.5)
    else:
        ce.render(scenes, AUD, HERE + '/final.mp4', tail=1.5)
        print(ce.sync_report(c, HERE + '/sync.json'))
