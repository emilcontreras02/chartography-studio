import sys, os, json
HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.join(HERE, '..', '..'))
import chartography_engine as ce
from chartography_engine import (F, text, text_block, fit_font, prog, ease, clamp, mix, card, counter, chrome, eyebrow,
                                 mascot, pill, arrow, MINT, AMBER, CREAM, MUTED, PANEL, CORAL, SLATE, BG, EMPTY)
ce.use_canvas('short'); W, H = ce.W, ce.H
AUD = HERE + '/vo_short.mp3'; DUR = ce.duration(AUD)
c = ce.Cues(json.load(open(HERE + '/words.json')), DUR)
SRC = 'Microsoft Research "Working with AI" (v7, Oct 23, 2026), Table L.4; jobs: BLS 2023. Score = AI applicability, not job loss'

t_interp = c.at('interpreters and translators')
t_049 = c.at('at point four nine out of one')
t_515 = c.at("that's fifty one thousand five hundred sixty")
t_turn = c.at('turning one language into another')
t_lm = c.at('pretty much what a language model does best')
t_hat = c.at('nobody wears a hard hat')
t_desk = c.at("it's done at a desk with words")
t_rem = c.at('remember number two')
t_hist = c.at('historians')
t_all = c.at('all three thousand forty of them')
t_top = c.at("so the top of the list isn't a factory")
t_old = c.at("it's two of the oldest desk jobs")


def hard_hat(d, cx, cy, s, col, a=1.0):
    if a <= 0.01:
        return
    colr = mix(col, a)
    d.pieslice([cx - s * 0.5, cy - s * 0.45, cx + s * 0.5, cy + s * 0.55], 180, 360, fill=colr)
    d.rounded_rectangle([cx - s * 0.7, cy + s * 0.02, cx + s * 0.7, cy + s * 0.16], radius=8, fill=colr)
    d.rectangle([cx - s * 0.06, cy - s * 0.45, cx + s * 0.06, cy], fill=mix(BG, a))


def cross(d, cx, cy, s, p):
    if p <= 0:
        return
    q1 = min(1, p * 2)
    d.line([(cx - s, cy - s), (cx - s + 2 * s * q1, cy - s + 2 * s * q1)], fill=CORAL, width=16)
    if p > 0.5:
        q = (p - 0.5) * 2
        d.line([(cx + s, cy - s), (cx + s - 2 * s * q, cy - s + 2 * s * q)], fill=CORAL, width=16)


def hook(T, img, d):
    # hook card: payoff number on the first frame
    d.ellipse([W / 2 - 150, 270, W / 2 + 150, 570], fill=AMBER)
    text(d, (W / 2, 425), '#1', F('serifb', 170), BG, 1.0, anchor='mm', base=AMBER, rise=0)
    text(d, (W / 2, 660), 'JOB AI CAN DO', F('sansb', 64), CREAM, 1.0, anchor='mm', rise=0)
    text(d, (W / 2, 840), '0.49', F('serifb', 230), MINT, 1.0, anchor='mm', rise=0)
    text(d, (W / 2, 990), 'out of 1', F('sansm', 50), MUTED, 1.0, anchor='mm', rise=0)
    nm = 'Interpreters & translators'
    text(d, (W / 2, 1120), nm, fit_font(d, nm, 'serifb', 76, W - 140), AMBER, prog(T, t_interp, 0.4), anchor='mm')
    mascot(img, (W / 2 - 200, 1200), 290, T=T, start=0.0)
    chrome(img, d, SRC)


def people(T, img, d):
    eyebrow(d, '#1  INTERPRETERS & TRANSLATORS', prog(T, t_515 - 0.2))
    counter(d, (W / 2, 420), 51560, T, t_515, dur=1.2, prefix='', font=F('serifb', 190), color=CREAM)
    text(d, (W / 2, 560), 'Americans', F('sansm', 56), MUTED, prog(T, t_515 + 0.8), anchor='mm')
    a1, a2 = prog(T, t_turn, 0.4), prog(T, t_turn + 0.7, 0.4)
    card(d, (90, 690, 470, 860), a1, radius=40)
    text(d, (280, 775), 'Hola', F('serifb', 80), CREAM, a1, anchor='mm', base=PANEL, rise=0)
    arrow(d, (500, 775), (590, 775), a2, AMBER, 10)
    card(d, (610, 690, 990, 860), a2, fill=(30, 80, 70), radius=40)
    text(d, (800, 775), 'Hello', F('serifb', 80), MINT, a2, anchor='mm', base=(30, 80, 70), rise=0)
    text(d, (W / 2, 950), 'one language into another', F('sansm', 46), MUTED, prog(T, t_turn + 0.4), anchor='mm')
    text_block(d, (W / 2, 1120), 'exactly what a language model does best', F('hand', 88), W - 160, MINT, prog(T, t_lm), anchor='ma')
    chrome(img, d, SRC)


def desk(T, img, d):
    ah = prog(T, t_hat, 0.4)
    hard_hat(d, W / 2, 520, 300, SLATE, ah)
    cross(d, W / 2, 520, 190, clamp((T - t_hat - 0.4) / 0.6))
    text(d, (W / 2, 820), 'No hard hat.', F('serifb', 110), CREAM, prog(T, t_hat + 0.3), anchor='mm')
    a = prog(T, t_desk, 0.4)
    card(d, (120, 960, W - 120, 1320), a)
    text(d, (W / 2, 1070), 'A desk.', F('serifb', 110), AMBER, a, anchor='mm', base=PANEL)
    text(d, (W / 2, 1210), 'And words.', F('serifb', 110), MINT, prog(T, t_desk + 0.9), anchor='mm', base=PANEL)
    chrome(img, d)


def podium(T, img, d):
    eyebrow(d, 'THE TOP 2', prog(T, t_rem))
    for i, (rk, nm, sc, n, col, t0) in enumerate([(1, 'Interpreters & translators', '0.492', '51,560 jobs', MINT, t_rem),
                                                  (2, 'Historians', '0.462', 'all 3,040 of them', AMBER, t_hist)]):
        a = prog(T, t0, 0.4)
        y = 300 + i * 440
        card(d, (80, y, W - 80, y + 380), a, fill=(40, 66, 98) if i == 1 else PANEL)
        base = (40, 66, 98) if i == 1 else PANEL
        text(d, (140, y + 90), f'#{rk}', F('serifb', 120), AMBER, a, anchor='lm', base=base)
        text(d, (330, y + 90), sc, F('serifb', 100), col, a, anchor='lm', base=base)
        text(d, (140, y + 220), nm, fit_font(d, nm, 'serifb', 70, W - 280), CREAM, a, anchor='lm', base=base)
        aa = prog(T, t_all if i == 1 else t0 + 0.6, 0.4)
        text(d, (140, y + 310), n, F('sansb', 52), MUTED if i == 0 else AMBER, aa, anchor='lm', base=base)
    text(d, (W / 2, 1300), 'Not a factory in sight.', F('hand', 80), CORAL, prog(T, t_top), anchor='mm')
    chrome(img, d, SRC)


def ending(T, img, d):
    text(d, (W / 2, 360), 'Two of the', F('serif', 100), CREAM, prog(T, t_old - 0.2), anchor='mm')
    text(d, (W / 2, 490), 'oldest desk jobs', F('serifb', 112), AMBER, prog(T, t_old + 0.3), anchor='mm')
    text(d, (W / 2, 620), 'top the list.', F('serif', 100), CREAM, prog(T, t_old + 0.8), anchor='mm')
    t_end = DUR - 1.9
    pill(d, W / 2, 800, 'Full Top 10 on the channel', prog(T, t_end - 0.4), color=BG, fill=MINT, font=F('sansb', 52))
    arrow(d, (W / 2, 1000), (W / 2, 880), prog(T, t_end - 0.2), MINT, 10)
    mascot(img, (W / 2 - 210, 1020), 300, T=T, start=t_old)
    text(d, (W / 2, 1420), 'So what scored 0.49?', F('hand', 72), MINT, prog(T, t_end + 0.3), anchor='mm')
    chrome(img, d)


scenes = [ce.Scene(0, hook), ce.Scene(t_515 - 0.15, people), ce.Scene(t_hat - 0.15, desk), ce.Scene(t_rem - 0.15, podium),
          ce.Scene(t_old - 0.35, ending)]

if __name__ == '__main__':
    if sys.argv[1:] == ['stills']:
        nxt = [s.start for s in scenes[1:]] + [DUR + 1.4]
        for s, e in zip(scenes, nxt):
            ce.still(scenes, e - 0.2, f'{HERE}/still_{s.name}.png', DUR + 1.5)
    else:
        ce.render(scenes, AUD, HERE + '/final.mp4', tail=1.5)
        print(ce.sync_report(c, HERE + '/sync.json'))
