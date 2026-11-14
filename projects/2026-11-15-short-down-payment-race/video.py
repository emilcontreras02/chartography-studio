import sys, os, json, math
HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.join(HERE, '..', '..'))
import chartography_engine as ce
from chartography_engine import (F, text, text_block, prog, ease, clamp, mix, card, counter, hand_underline, chrome,
                                 eyebrow, mascot, pill, pill_row, MINT, AMBER, CREAM, MUTED, PANEL, CORAL, BG,
                                 EMPTY, SLATE)
ce.use_canvas('short'); W, H = ce.W, ce.H
AUD = HERE + '/vo_short.mp3'; DUR = ce.duration(AUD)
c = ce.Cues(json.load(open(HERE + '/words.json')), DUR)

S_ALL = ('Census/HUD new-home median via PennyCalc (1985 avg; Q3 2026, checked Nov 1, 2026); '
         'Census median household income via FRED (1985; 2025, updated Sep 16, 2026)')

t_85 = c.at('a typical family needed about eight and a half months')
# matcher scores 'today' weakly here; take the transcriber's own time for the word 'today' (first after t_85)
t_today = next(t for w, t in c.words if w == 'today' and t > t_85)
t_math = c.at("here's the math")
t_p85 = c.at('twenty per cent of eighty four thousand')
t_16 = c.at('is sixteen thousand eight hundred fifty five')
t_i85 = c.at('on twenty three thousand six hundred twenty')
t_m85 = c.at("that's about eight and a half months")
t_now = c.at("now take today's new home")
t_393 = c.at('three hundred ninety three thousand')
t_p26 = c.at('twenty per cent is seventy eight')
t_i26 = c.at('on eighty seven thousand four hundred sixty')
t_m26 = c.at("that's almost eleven months")
t_food = c.at('before food')
t_rent = c.at('before rent')
t_else = c.at('before anything else')
t_round = c.at('round two goes to nineteen eighty five')


def year_clock(d, cx, cy, r, frac, a, col, T, t0, big, small='months of pay', width=46):
    """A 12-month 'year clock': the ring fills clockwise from 12 o'clock to the share of a year."""
    if a <= 0.01:
        return
    box = [cx - r, cy - r, cx + r, cy + r]
    d.ellipse(box, outline=mix(EMPTY, a), width=width)
    f = frac * ease((T - t0) / 1.4)
    if f > 0.005:
        d.arc(box, -90, -90 + 360 * f, fill=mix(col, a), width=width)
    for m in range(12):  # month ticks
        ang = math.radians(-90 + 30 * m)
        x0, y0 = cx + (r + 14) * math.cos(ang), cy + (r + 14) * math.sin(ang)
        x1, y1 = cx + (r + 30) * math.cos(ang), cy + (r + 30) * math.sin(ang)
        d.line([x0, y0, x1, y1], fill=mix(MUTED, a), width=4)
    if T > t0 + 0.3:
        b = prog(T, t0 + 0.3)
        text(d, (cx, cy - 20), big, F('serifb', int(r * 0.62)), col, b, anchor='mm', rise=0)
        text(d, (cx, cy + r * 0.38), small, F('sansm', int(r * 0.15)), CREAM, b, anchor='mm', rise=0)


def hook(T, img, d):
    pill(d, W / 2, 330, 'JUST THE 20% DOWN PAYMENT', prog(T, 0.0, 0.25), color=AMBER, font=F('sansb', 40))
    a1 = prog(T, 0.05, 0.3)
    text(d, (290, 560), '8½', F('serifb', 260), AMBER, a1, anchor='mm')
    text(d, (W / 2, 560), 'vs', F('serif', 90), MUTED, prog(T, 0.15, 0.3), anchor='mm')
    text(d, (790, 560), '11', F('serifb', 260), MINT, prog(T, 0.25, 0.3), anchor='mm')
    text(d, (W / 2, 770), 'MONTHS OF PAY', F('serifb', 100), CREAM, prog(T, 0.35, 0.3), anchor='mm')
    text(d, (290, 890), '1985', F('sansb', 56), AMBER, prog(T, t_85), anchor='mm')
    text(d, (790, 890), 'today', F('sansb', 56), MINT, prog(T, t_today), anchor='mm')
    text(d, (W / 2, 1010), 'for a new home', F('hand', 72), CREAM, prog(T, 0.6), anchor='mm')
    mascot(img, (W / 2 - 190, 1100), 360, T=T, start=0.2)
    chrome(img, d, S_ALL)


def equation(T, img, d, t_card, year, col, price, t_price, down, t_down, income, t_inc, months, t_months, big, frac):
    eyebrow(d, f'{year}: SAVING 20% DOWN (ILLUSTRATION)', prog(T, t_card))
    a = prog(T, t_card)
    card(d, (70, 270, W - 70, 760), a)
    text(d, (120, 310), 'NEW HOME (MEDIAN)', F('sansb', 32), MUTED, a, base=PANEL)
    text(d, (120, 355), price, F('serifb', 96), CREAM, prog(T, t_price), base=PANEL)
    text(d, (W - 120, 400), '× 20%', F('serifb', 80), AMBER, prog(T, t_price + 0.5), anchor='ra', base=PANEL)
    a2 = prog(T, t_down)
    d.line([120, 495, W - 120, 495], fill=mix(MUTED, a2, PANEL), width=3)
    text(d, (120, 520), 'DOWN PAYMENT', F('sansb', 32), MUTED, a2, base=PANEL)
    if T >= t_down:
        v = down * ease((T - t_down) / 1.2)
        text(d, (120, 565), f'${v:,.0f}', F('serifb', 120), col, a2, base=PANEL)
    a3 = prog(T, t_inc)
    pill(d, W / 2, 840, f'÷ {income} a year (median household)', a3, font=F('sansm', 38))
    year_clock(d, W / 2, 1200, 250, frac, prog(T, t_inc + 0.3), col, T, t_months, big)
    chrome(img, d, S_ALL)


def math85(T, img, d):
    equation(T, img, d, t_math - 0.1, '1985', AMBER, '$84,275', t_p85, 16855, t_16, '$23,620', t_i85, 8.6, t_m85, '8½', 16855 / 23620)


def math26(T, img, d):
    equation(T, img, d, t_now - 0.1, '2026', MINT, '$393,300', t_393, 78660, t_p26, '$87,460', t_i26, 10.8, t_m26, '11', 78660 / 87460)


def before(T, img, d):
    eyebrow(d, 'SAVED BEFORE YOU SPEND A DIME', prog(T, t_food - 0.15))
    a = prog(T, t_food - 0.15)
    year_clock(d, 290, 560, 170, 16855 / 23620, a, AMBER, T, t_food - 1.5, '8½', 'months', width=34)
    year_clock(d, 790, 560, 170, 78660 / 87460, a, MINT, T, t_food - 1.5, '11', 'months', width=34)
    text(d, (290, 800), '1985', F('sansb', 48), AMBER, a, anchor='mm')
    text(d, (790, 800), '2026', F('sansb', 48), MINT, a, anchor='mm')
    items = [('food', t_food), ('rent', t_rent), ('anything else', t_else)]
    for i, (lab, t0) in enumerate(items):
        y = 960 + i * 150
        ai = prog(T, t0)
        pill(d, W / 2, y, 'before ' + lab, ai, color=CREAM, font=F('serifb', 64))
        if T > t0 + 0.25:
            p = clamp((T - t0 - 0.25) / 0.3)
            wlen = d.textlength('before ' + lab, font=F('serifb', 64)) / 2 + 20
            d.line([W / 2 - wlen, y, W / 2 - wlen + 2 * wlen * p, y], fill=CORAL, width=9)
    chrome(img, d, S_ALL)


def verdict(T, img, d):
    a = prog(T, t_round - 0.15)
    text(d, (W / 2, 360), 'ROUND 2', F('sansb', 60), MUTED, a, anchor='mm')
    text(d, (W / 2, 470), 'THE DOWN PAYMENT', F('serifb', 76), CREAM, a, anchor='mm')
    ab = prog(T, t_round + 0.9, 0.35)
    if ab > 0:
        s = 1.25 - 0.25 * ab
        fnt = F('serifb', int(200 * s))
        text(d, (W / 2, 680), '1985', fnt, AMBER, ab, anchor='mm', rise=0)
        text(d, (W / 2, 830), 'wins', F('hand', 110), AMBER, ab, anchor='mm', rise=0)
    al = prog(T, t_round + 1.6)
    text(d, (W / 2, 990), 'How many months', F('serifb', 72), CREAM, al, anchor='mm')
    text(d, (W / 2, 1080), 'would it take you?', F('serifb', 72), MINT, al, anchor='mm')
    text(d, (W / 2, 1180), 'new homes only · not advice', F('sans', 32), MUTED, al, anchor='mm')
    mascot(img, (W / 2 - 130, 1235), 250, T=T, start=t_round + 0.4)
    chrome(img, d, S_ALL)


scenes = [ce.Scene(0, hook), ce.Scene(t_math - 0.15, math85), ce.Scene(t_now - 0.15, math26),
          ce.Scene(t_food - 0.15, before), ce.Scene(t_round - 0.15, verdict)]

if __name__ == '__main__':
    if sys.argv[1:] == ['stills']:
        for n, T in [('hook', 1.0), ('hook2', t_math - 0.3), ('math85', t_now - 0.3), ('math26', t_food - 0.3),
                     ('before', t_round - 0.3), ('verdict', DUR + 1.2)]:
            ce.still(scenes, T, f'{HERE}/still_{n}.png', DUR + 1.5)
    else:
        ce.render(scenes, AUD, HERE + '/final.mp4', tail=1.5)
        print(ce.sync_report(c, HERE + '/sync.json'))
