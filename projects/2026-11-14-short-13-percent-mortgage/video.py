import sys, os, json
HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.join(HERE, '..', '..'))
import chartography_engine as ce
from chartography_engine import (F, text, text_block, prog, ease, clamp, mix, card, counter, hand_underline, chrome,
                                 eyebrow, mascot, pill, pill_row, house, MINT, AMBER, CREAM, MUTED, PANEL, CORAL, BG,
                                 EMPTY, SLATE)
ce.use_canvas('short'); W, H = ce.W, ce.H
AUD = HERE + '/vo_short.mp3'; DUR = ce.duration(AUD)
c = ce.Cues(json.load(open(HERE + '/words.json')), DUR)

S_RATE = 'Freddie Mac PMMS via FRED (Jan 4, 1985); Freddie Mac (Nov 12, 2026)'
S_ALL = ('Freddie Mac PMMS (Jan 4, 1985; Nov 12, 2026); Census new-home median via PennyCalc (Nov 1, 2026); '
         'Census income via FRED (Sep 16, 2026)')

t_ate = c.at('ate about thirty eight per cent')
t_loan = c.at('picture a thirty year fixed loan')
t_131 = c.at('in january nineteen eighty five the average rate')
t_751 = c.at("that's about seven hundred fifty one dollars")
t_inc85 = c.at('on twenty three thousand six hundred twenty')
t_38 = c.at('about thirty eight per cent of every')
t_now = c.at('now twenty twenty six')
t_711 = c.at("this week's average rate")
t_2117 = c.at("that's about two thousand one hundred seventeen")
t_inc26 = c.at('on eighty seven thousand four hundred sixty')
t_29 = c.at('about twenty nine per cent')
t_bill = c.at("to day's bill is the bigger number")
t_bite = c.at('took the bigger bite')
t_lost = c.at('in this round your parents lost')


def paycheck(d, x0, y0, w, h, frac, a, col, T, t0, label):
    """Tall 'monthly paycheck' column; the mortgage bite fills from the top."""
    if a <= 0.01:
        return
    y0 += (1 - a) * 30
    d.rounded_rectangle([x0, y0, x0 + w, y0 + h], radius=28, fill=mix(EMPTY, a))
    f = frac * ease((T - t0) / 1.2)
    if f > 0.01:
        d.rounded_rectangle([x0, y0, x0 + w, y0 + h * f], radius=28, fill=mix(col, a))
        if T > t0 + 0.8:
            text(d, (x0 + w / 2, y0 + h * f / 2), f'{round(frac * 100)}%', F('serifb', 92), BG, prog(T, t0 + 0.8), anchor='mm', base=col, rise=0)
    text(d, (x0 + w / 2, y0 + h + 50), label, F('sansb', 40), CREAM, a, anchor='mm', rise=0)


def hook(T, img, d):
    text(d, (W / 2, 380), '13%', F('serifb', 330), CORAL, prog(T, 0.0, 0.25), anchor='mm')
    text(d, (W / 2, 590), 'MORTGAGES?!', F('serifb', 120), CREAM, prog(T, 0.15, 0.3), anchor='mm')
    pill(d, W / 2, 740, 'America, 1985', prog(T, 0.3), color=AMBER, font=F('sansb', 48))
    a = prog(T, t_ate)
    text(d, (W / 2, 900), 'The payment ate', F('serif', 70), CREAM, a, anchor='mm')
    text(d, (W / 2, 1030), '38% of pay', F('serifb', 140), AMBER, prog(T, t_ate + 0.4), anchor='mm')
    mascot(img, (W / 2 - 230, 1150), 330, T=T, start=0.2)
    chrome(img, d, S_RATE)


def bill85(T, img, d):
    eyebrow(d, '1985 MONTHLY BILL (ILLUSTRATION)', prog(T, t_loan))
    pill_row(d, 330, ['20% down', '30-yr fixed', 'principal + interest'], T, [t_loan, t_loan + 0.4, t_loan + 0.8],
             font=F('sansm', 34), gap=20)
    a = prog(T, t_131)
    card(d, (70, 430, 600, 1420), a)
    text(d, (110, 470), 'JAN 1985 RATE', F('sansb', 34), MUTED, a, base=PANEL)
    text(d, (110, 520), '13.1%', F('serifb', 120), CORAL, a, base=PANEL)
    a2 = prog(T, t_751)
    text(d, (110, 720), 'PAYMENT', F('sansb', 34), MUTED, a2, base=PANEL)
    text(d, (110, 770), '$751', F('serifb', 120), CREAM, a2, base=PANEL)
    text(d, (110, 920), 'a month', F('sans', 40), MUTED, a2, base=PANEL)
    a3 = prog(T, t_inc85)
    text(d, (110, 1050), 'INCOME', F('sansb', 34), MUTED, a3, base=PANEL)
    text(d, (110, 1100), '$23,620', F('serifb', 84), CREAM, a3, base=PANEL)
    text(d, (110, 1210), 'a year (median household)', F('sans', 32), MUTED, a3, base=PANEL)
    paycheck(d, 680, 430, 330, 900, 0.38, prog(T, t_38 - 0.5), CORAL, T, t_38, 'monthly pay')
    chrome(img, d, S_ALL)


def compare(T, img, d):
    eyebrow(d, 'SHARE OF A TYPICAL PAYCHECK', prog(T, t_now))
    a = prog(T, t_now)
    text(d, (290, 320), '1985', F('serifb', 80), AMBER, a, anchor='mm')
    text(d, (790, 320), '2026', F('serifb', 80), MINT, a, anchor='mm')
    text(d, (290, 420), '13.1% rate', F('sansm', 40), MUTED, a, anchor='mm')
    text(d, (790, 420), '7.11% rate', F('sansm', 40), MUTED, prog(T, t_711), anchor='mm')
    paycheck(d, 140, 480, 300, 760, 0.38, a, CORAL, T, t_now - 0.6, '$751/mo')
    paycheck(d, 640, 480, 300, 760, 0.29, prog(T, t_2117), MINT, T, t_29, '$2,117/mo')
    text(d, (790, 1360), 'on $87,460 a year', F('sans', 34), MUTED, prog(T, t_inc26), anchor='mm')
    text(d, (290, 1360), 'on $23,620 a year', F('sans', 34), MUTED, a, anchor='mm')
    chrome(img, d, S_ALL)


def verdict(T, img, d):
    a = prog(T, t_bill)
    card(d, (80, 300, W - 80, 620), a)
    text(d, (W / 2, 360), 'BIGGER BILL', F('sansb', 40), MUTED, a, anchor='mm', base=PANEL)
    text(d, (W / 2, 490), '2026: $2,117', F('serifb', 110), MINT, a, anchor='mm', base=PANEL)
    ab = prog(T, t_bite)
    card(d, (80, 670, W - 80, 990), ab)
    text(d, (W / 2, 730), 'BIGGER BITE', F('sansb', 40), MUTED, ab, anchor='mm', base=PANEL)
    text(d, (W / 2, 860), '1985: 38%', F('serifb', 110), CORAL, ab, anchor='mm', base=PANEL)
    al = prog(T, t_lost)
    text(d, (W / 2, 1080), 'Your parents', F('serifb', 84), CREAM, al, anchor='mm')
    text(d, (W / 2, 1180), 'lost this round.', F('serifb', 84), AMBER, al, anchor='mm')
    text(d, (W / 2, 1290), 'So who really had it harder?', F('hand', 64), MINT, prog(T, t_lost + 0.9), anchor='mm')
    mascot(img, (W / 2 - 150, 1330), 170, T=T, start=t_lost + 0.3)
    chrome(img, d, S_ALL)


scenes = [ce.Scene(0, hook), ce.Scene(t_loan - 0.15, bill85), ce.Scene(t_now - 0.15, compare), ce.Scene(t_bill - 0.15, verdict)]

if __name__ == '__main__':
    if sys.argv[1:] == ['stills']:
        for n, T in [('hook', t_loan - 0.4), ('bill85', t_now - 0.4), ('compare', t_bill - 0.4), ('verdict', DUR - 0.1)]:
            ce.still(scenes, T, f'{HERE}/still_{n}.png', DUR + 1.5)
    else:
        ce.render(scenes, AUD, HERE + '/final.mp4', tail=1.5)
        print(ce.sync_report(c, HERE + '/sync.json'))
