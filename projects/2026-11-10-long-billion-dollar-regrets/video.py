import sys, os, json
HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.join(HERE, '..', '..'))
import chartography_engine as ce
from chartography_engine import (F, text, text_block, prog, ease, clamp, mix, card, counter, hand_underline, chrome,
                                 eyebrow, hbars, donut, mascot, pill, pill_row, arrow, MINT, AMBER, CREAM, MUTED,
                                 PANEL, CORAL, SLATE, BG)
ce.use_canvas('long'); W, H = ce.W, ce.H
AUD = HERE + '/vo.mp3'; DUR = ce.duration(AUD)
c = ce.Cues(json.load(open(HERE + '/words.json')), DUR)

PAPER = (240, 229, 203)
INK = (44, 44, 52)
INK2 = (120, 110, 95)

# ---------- cues (script order) ----------
t_sold = c.at('in 1976 a man sold his ten percent')
t_today = c.at('today ten percent of apple')
t_typo = c.at("that's not a typo")
t_history = c.at('history is full of tiny deals')
t_five = c.at('pulling five old receipts')
t_tm = c.at('running each one through a time machine')
t_how = c.at("here's how the machine works")
t_compare = c.at('compare it with what the same thing')
t_zeros = c.at('just two numbers and a lot of zeros')
t_stay = c.at('stay to the end')
t_shrinks = c.at('it shrinks', after=t_stay)
t_r1 = c.at('receipt number one')
t_prog = c.at('a programmer wanted to prove')
t_10k = c.at('he offered 10,000 bitcoin')
t_41 = c.at('worth about 41 dollars')
t_run1 = c.at("now let's run that receipt")
t_74 = c.at('trading at around 74,200 dollars')
t_742 = c.at('cost about 742 million dollars')
t_18m = c.at("that's roughly 18 million times")
t_pizzaday = c.at('crypto fans still celebrate')
t_r2 = c.at('receipt number two')
t_founders = c.at('founders they offered to sell')
t_passed = c.at('passed its former', after=t_founders)
t_boss = c.at('its former boss later said')
t_tm2 = c.at('is now worth about 260 billion')
t_5000 = c.at('more than 5,000 times')
t_bk = c.at('it filed for bankruptcy in 2010')
t_one = c.at('there is exactly one')
t_r3 = c.at('receipt number three')
t_offered = c.at("google's founders offered their little search engine")
t_1m = c.at('the price started at one million')
t_750 = c.at('then it dropped to 750 thousand')
t_no3 = c.at("excite's boss said no")
t_tm3 = c.at("google's parent company alphabet")
t_47 = c.at("that's about 4.7 million times")
t_r4 = c.at('receipt number four')
t_three = c.at('apple had three founders')
t_wayne = c.at('the third ronald wayne')
t_12 = c.at('just twelve days later')
t_worried = c.at('he was worried about being')
t_tm4 = c.at('apple is worth about 4.98 trillion')
t_498 = c.at('ten percent of that is about 498')
t_fair = c.at('now to be fair')
t_fortune = c.at('fortune estimates it would really')
t_notbad = c.at('still not bad for 800')
t_r5 = c.at('receipt number five')
t_feb = c.at('february 2008 microsoft offers')
t_yno = c.at('yahoo says no')
t_eight = c.at('eight years later yahoo agreed')
t_tenth = c.at('roughly a tenth of the offer')
t_bigger = c.at("the time machine doesn't always")
t_score = c.at("let's line up the scoreboard")
t_s1 = c.at('two pizzas about 18 million times')
t_s2 = c.at("blockbuster's chance at netflix")
t_s3 = c.at('chance at google about 4.7')
t_s4 = c.at("ronald wayne's slice of apple")
t_s5 = c.at('and yahoo down to about a tenth')
t_twist = c.at("so here's the twist")
t_sense = c.at('almost every choice made sense')
t_btc = c.at('in 2010 one bitcoin was worth less')
t_nf = c.at('in 2000 netflix was a small company')
t_gg = c.at('in 1999 google was just one')
t_ap = c.at('and in 1976 apple was a tiny')
t_nobody = c.at("nobody gets to read tomorrow's receipt")
t_hind = c.at('hindsight is the real time machine')
t_yahoo2 = c.at('and yahoo is the reminder')
t_which = c.at('which of these deals would you')
t_pizza2 = c.at("what do you think is today's 41 dollar pizza")
t_sub = c.at('subscribe to chartography')


# ---------- helpers ----------
def receipt(d, box, T, title, lines, starts, a, total=None, t_total=None, stamp_txt=None, t_stamp=None, stamp_col=CORAL):
    """Vintage paper receipt. lines = [(label, value)] revealed at starts."""
    if a <= 0.01:
        return
    x0, y0, x1, y1 = box
    off = (1 - a) * 40
    y0o, y1o = y0 + off, y1 + off
    pts = [(x0, y0o), (x1, y0o), (x1, y1o)]
    n = 16
    for i in range(n, -1, -1):
        px = x0 + (x1 - x0) * i / n
        pts.append((px, y1o + (14 if i % 2 else 0)))
    d.polygon(pts, fill=mix(PAPER, a))
    cx = (x0 + x1) / 2
    text(d, (cx, y0o + 60), title, F('sansb', 34), INK, a, anchor='mm', base=PAPER, rise=0)
    dash(d, x0 + 40, x1 - 40, y0o + 105, mix(INK2, a, PAPER))
    for i, ((lab, val), t0) in enumerate(zip(lines, starts)):
        aa = min(a, prog(T, t0, 0.4))
        y = y0o + 150 + i * 62
        text(d, (x0 + 45, y), lab, F('sansm', 32), INK, aa, base=PAPER, rise=8)
        text(d, (x1 - 45, y), val, F('sansb', 32), INK, aa, anchor='ra', base=PAPER, rise=8)
    if total:
        aa = min(a, prog(T, t_total, 0.4))
        yy = y1o - 120
        dash(d, x0 + 40, x1 - 40, yy - 20, mix(INK2, aa, PAPER))
        text(d, (x0 + 45, yy), 'TOTAL', F('sansb', 40), INK, aa, base=PAPER, rise=8)
        text(d, (x1 - 45, yy), total, F('serifb', 56), INK, aa, anchor='ra', base=PAPER, rise=8)
    if stamp_txt and t_stamp is not None:
        stamp(d, (cx, (y0o + y1o) / 2 + 30), stamp_txt, stamp_col, prog(T, t_stamp, 0.3), base=PAPER, size=74)


def dash(d, x0, x1, y, col):
    x = x0
    while x < x1:
        d.line([(x, y), (min(x + 14, x1), y)], fill=col, width=3)
        x += 26


def stamp(d, cxy, s, col, a, base=BG, size=64):
    if a <= 0.01:
        return
    cx, cy = cxy
    f = F('sansb', size)
    w = d.textlength(s, font=f) + 70
    h = size + 50
    sc = 1.25 - 0.25 * ease(a)
    w2, h2 = w * sc / 2, h * sc / 2
    d.rounded_rectangle([cx - w2, cy - h2, cx + w2, cy + h2], radius=14, outline=mix(col, a, base), width=8)
    text(d, (cx, cy + 2), s, f, col, a, anchor='mm', base=base, rise=0)


def machine(d, T, start, label='TODAY', x=1080, y=300):
    """The 'time machine' panel on the right: a card with a dial label."""
    a = prog(T, start, 0.5)
    card(d, (x, y, x + 700, y + 520), a)
    pill(d, x + 350, y + 60, 'TIME MACHINE  >  ' + label, a, color=AMBER, font=F('sansb', 30))
    return a


# ---------- scenes ----------
def hook(T, img, d):
    receipt(d, (200, 230, 760, 830), T, 'RECEIPT  -  APRIL 1976',
            [('Item', '10% of Apple'), ('Seller', 'co-founder'), ('Paid', 'cash')], [0.2, 0.5, 0.8], 1.0,
            total='$800', t_total=1.2)
    a = machine(d, T, t_today - 0.2, x=1130)
    counter(d, (1480, 560), 500, T, t_today + 0.2, dur=1.8, suffix=' billion', font=F('serifb', 100), color=MINT)
    text(d, (1480, 690), '10% of Apple today', F('sansm', 40), MUTED, prog(T, t_today + 0.8), anchor='mm', base=PANEL)
    mascot(img, (775, 700), 245, T=T, start=0.6)
    chrome(img, d, 'Fortune (Jan 2026); market value about $4.98T (StockTitan, Nov 7, 2026)')


def intro(T, img, d):
    text(d, (W/2, 250), "That's not a typo.", F('hand', 110), AMBER, prog(T, t_typo), anchor='mm')
    text(d, (W/2, 400), 'Tiny deals.  Giant regrets.', F('serifb', 100), CREAM, prog(T, t_history), anchor='mm')
    for i in range(5):
        a = prog(T, t_five + i * 0.15, 0.4)
        x = W/2 - 2 * 240 + i * 240
        if a > 0:
            dd = 0
            d.polygon([(x - 90, 560), (x + 90, 560), (x + 90, 800), (x - 90, 800)], fill=mix(PAPER, a))
            text(d, (x, 610), f'#{i+1}', F('sansb', 44), INK, a, anchor='mm', base=PAPER, rise=0)
            for k in range(3):
                d.line([(x - 60, 670 + k * 35), (x + 60, 670 + k * 35)], fill=mix(INK2, a, PAPER), width=4)
    text(d, (W/2, 900), '5 receipts.  1 time machine.', F('sansb', 56), MINT, prog(T, t_tm), anchor='mm')
    chrome(img, d)


def how(T, img, d):
    eyebrow(d, 'HOW THE MACHINE WORKS', prog(T, t_how))
    receipt(d, (180, 300, 600, 720), T, 'THEN', [('Price', '$1')], [t_how + 0.3], prog(T, t_how), total='$1', t_total=t_how + 0.5)
    arrow(d, (660, 510), (900, 510), prog(T, t_compare), AMBER, 10)
    card(d, (960, 300, 1740, 720), prog(T, t_compare))
    text(d, (1350, 380), 'NOW', F('sansb', 40), AMBER, prog(T, t_compare), anchor='mm', base=PANEL)
    text(d, (1350, 520), '$1,000,000,000', F('serifb', 92), MINT, prog(T, t_zeros), anchor='mm', base=PANEL)
    text(d, (1350, 640), 'two numbers + a lot of zeros', F('hand', 60), CREAM, prog(T, t_zeros + 0.4), anchor='mm', base=PANEL)
    p = clamp((T - t_shrinks) / 1.2)
    if T > t_stay - 0.2:
        a = prog(T, t_stay)
        s = 1 - 0.55 * ease(p)
        cx, cy, w, h = W/2, 900, 260 * s, 120 * s
        d.rounded_rectangle([cx - w/2, cy - h/2, cx + w/2, cy + h/2], radius=10, fill=mix(PAPER, a))
        text(d, (cx, cy), 'RECEIPT #5', F('sansb', max(10, int(40 * s))), INK, a, anchor='mm', base=PAPER, rise=0)
        text(d, (cx + 300, cy), '...it shrinks?', F('hand', 64), CORAL, prog(T, t_shrinks), anchor='lm')
    chrome(img, d)


def r1(T, img, d):
    eyebrow(d, 'RECEIPT #1', prog(T, t_r1))
    receipt(d, (200, 230, 760, 900), T, 'MAY 22, 2010',
            [('Item', '2 pizzas'), ('Buyer', 'a programmer'), ('Paid', '10,000 BTC')], [t_r1 + 0.6, t_prog, t_10k], prog(T, t_r1),
            total='about $41', t_total=t_41)
    text_block(d, (920, 380), 'Goal: prove bitcoin could buy real things', F('serif', 64), 820, CREAM, prog(T, t_prog + 0.3) * (1 - prog(T, t_run1 - 0.4, 0.3)))
    if T > t_run1 - 0.2:
        a = machine(d, T, t_run1 - 0.2, label='NOV 9, 2026', x=960, y=300)
        text(d, (1310, 430), '1 BTC = about $74,200', F('sansb', 44), CREAM, prog(T, t_74), anchor='mm', base=PANEL)
        text(d, (1310, 490), 'x 10,000', F('sansm', 40), MUTED, prog(T, t_74 + 0.5), anchor='mm', base=PANEL)
        counter(d, (1310, 620), 742, T, t_742, dur=1.6, suffix=' million', font=F('serifb', 110), color=MINT)
        stamp(d, (1310, 760), 'x 18 MILLION', CORAL, prog(T, t_18m, 0.3), base=PANEL, size=54)
    pill(d, 1310, 900, 'May 22 = Bitcoin Pizza Day', prog(T, t_pizzaday), color=AMBER, font=F('sansb', 36))
    chrome(img, d, 'CoinDesk (Bitcoin Pizza Day); BTC about $74,201 on Nov 9, 2026 (Sunday Guardian)')


def r2(T, img, d):
    eyebrow(d, 'RECEIPT #2', prog(T, t_r2))
    receipt(d, (200, 230, 760, 900), T, 'THE YEAR 2000',
            [('Seller', 'Netflix'), ('Buyer', 'Blockbuster?'), ('Item', 'the whole company')], [t_r2 + 0.6, t_r2 + 1.2, t_founders], prog(T, t_r2),
            total='$50M', t_total=t_founders + 1.5, stamp_txt='PASSED', t_stamp=t_passed)
    text_block(d, (920, 330), "Ex-CEO: talks were never that serious", F('sansm', 40), 800, MUTED, prog(T, t_boss) * (1 - prog(T, t_tm2 - 0.3)))
    if T > t_tm2 - 0.3:
        machine(d, T, t_tm2 - 0.3, x=960, y=300)
        counter(d, (1310, 520), 260, T, t_tm2 + 0.3, dur=1.4, suffix=' billion', font=F('serifb', 110), color=MINT)
        text(d, (1310, 620), 'Netflix today', F('sansm', 40), MUTED, prog(T, t_tm2 + 0.8), anchor='mm', base=PANEL)
        stamp(d, (1310, 730), 'x 5,000+', CORAL, prog(T, t_5000, 0.3), base=PANEL, size=54)
    if T > t_bk - 0.2:
        text(d, (1350, 900), 'Blockbuster: bankrupt 2010', F('sansb', 40), CORAL, prog(T, t_bk), anchor='mm')
        text(d, (1350, 960), 'Stores left today: 1 (Bend, Oregon)', F('sansb', 40), AMBER, prog(T, t_one), anchor='mm')
    chrome(img, d, 'Newsweek fact check; Netflix about $260.38B (StockTitan, Nov 7, 2026)')


def r3(T, img, d):
    eyebrow(d, 'RECEIPT #3', prog(T, t_r3))
    receipt(d, (200, 230, 760, 900), T, '1999',
            [('Seller', "Google's founders"), ('Buyer', 'Excite?'), ('Asking', '$1,000,000')], [t_offered, t_offered + 1.0, t_1m], prog(T, t_r3),
            total='$750,000', t_total=t_750, stamp_txt='NO', t_stamp=t_no3)
    if T > t_1m and T < t_tm3:
        y = 230 + 150 + 2 * 62 + 18
        p = ease((T - t_750) / 0.5)
        if p > 0:
            d.line([(560, y), (560 + 160 * p, y)], fill=CORAL, width=5)
    text(d, (1310, 300), 'You could have bought Google', F('serif', 56), CREAM, prog(T, t_r3 + 0.5) * (1 - prog(T, t_tm3 - 0.3)), anchor='mm')
    text(d, (1310, 390), 'for $750,000.', F('serifb', 80), AMBER, prog(T, t_r3 + 1.2) * (1 - prog(T, t_tm3 - 0.3)), anchor='mm')
    if T > t_tm3 - 0.3:
        machine(d, T, t_tm3 - 0.3, x=960, y=300)
        counter(d, (1310, 520), 3.5, T, t_tm3 + 0.4, dur=1.4, suffix=' trillion', font=F('serifb', 110), color=MINT, decimals=1)
        text(d, (1310, 620), 'Alphabet today', F('sansm', 40), MUTED, prog(T, t_tm3 + 0.9), anchor='mm', base=PANEL)
        stamp(d, (1310, 730), 'x 4.7 MILLION', CORAL, prog(T, t_47, 0.3), base=PANEL, size=54)
    chrome(img, d, 'Fortune (2010); Alphabet about $3.50T (StockTitan, Nov 7, 2026)')


def r4(T, img, d):
    eyebrow(d, 'RECEIPT #4', prog(T, t_r4))
    receipt(d, (200, 230, 760, 900), T, 'APRIL 1976',
            [('Company', 'Apple'), ('Founders', '3'), ('His stake', '10%'), ('Sold after', '12 days')],
            [t_r4 + 0.6, t_three, t_wayne, t_12], prog(T, t_r4), total='$800', t_total=t_12 + 1.2)
    text_block(d, (920, 330), 'His worry: being personally on the hook for the company\'s debts', F('sansm', 40), 800, MUTED,
               prog(T, t_worried) * (1 - prog(T, t_tm4 - 0.3)))
    if T > t_tm4 - 0.3:
        a = machine(d, T, t_tm4 - 0.3, x=960, y=300)
        sweep = ease((T - t_498) / 1.0)
        donut(img, 1120, 560, 120, [(0.10, AMBER), (0.90, ce.SLATE)], sweep, a=a)
        text(d, (1290, 470), 'Apple: $4.98T', F('sansb', 40), CREAM, prog(T, t_tm4 + 0.5), base=PANEL)
        counter(d, (1500, 580), 498, T, t_498 + 0.2, dur=1.2, suffix='B', font=F('serifb', 100), color=MINT)
        text(d, (1500, 670), '10% (if never diluted)', F('sansm', 34), MUTED, prog(T, t_498 + 0.6), anchor='mm', base=PANEL)
    if T > t_fair - 0.2:
        a = prog(T, t_fortune)
        card(d, (960, 850, 1740, 990), a)
        text(d, (1350, 895), 'Realistic estimate after dilution (Fortune):', F('sansm', 32), MUTED, a, anchor='mm', base=PANEL)
        text(d, (1350, 950), '$75B  to  $360B', F('serifb', 52), AMBER, prog(T, t_fortune + 0.6), anchor='mm', base=PANEL)
    chrome(img, d, 'Fortune (Jan 23, 2026); Apple about $4.98T (StockTitan, Nov 7, 2026)')


def r5(T, img, d):
    eyebrow(d, 'RECEIPT #5  -  THE ONE THAT SHRINKS', prog(T, t_r5))
    receipt(d, (200, 230, 760, 900), T, 'FEB 2008',
            [('Buyer', 'Microsoft'), ('Seller', 'Yahoo?')], [t_feb, t_feb + 1.0], prog(T, t_r5),
            total='$44.6B', t_total=t_feb + 1.8, stamp_txt='NO', t_stamp=t_yno)
    p = ease((T - t_tenth) / 0.5)
    if p > 0:
        d.line([(555, 812), (555 + 175 * p, 812)], fill=CORAL, width=7)
    if T > t_eight - 0.3:
        machine(d, T, t_eight - 0.3, label='2016', x=960, y=300)
        text(d, (1310, 430), 'Sold main business to Verizon', F('sansm', 40), CREAM, prog(T, t_eight + 0.3), anchor='mm', base=PANEL)
        counter(d, (1310, 560), 4.8, T, t_eight + 0.8, dur=1.2, suffix='B', font=F('serifb', 120), color=CORAL, decimals=1)
        stamp(d, (1310, 720), 'about 1/10', CORAL, prog(T, t_tenth, 0.3), base=PANEL, size=54)
    text(d, (1310, 900), "The time machine doesn't always make things bigger.", F('hand', 50), AMBER, prog(T, t_bigger), anchor='mm')
    chrome(img, d, 'Microsoft $44.6B offer (Feb 2008); Verizon deal $4.83B (Jul 2016)')


def scoreboard(T, img, d):
    eyebrow(d, 'THE SCOREBOARD', prog(T, t_score))
    rows = [('2 pizzas (2010)', 'x 18 million', MINT, t_s1), ('Blockbuster -> Netflix (2000)', 'x 5,000+', MINT, t_s2),
            ('Excite -> Google (1999)', 'x 4.7 million', MINT, t_s3), ("Wayne's 10% of Apple (1976)", '$75B-$498B', MINT, t_s4),
            ('Yahoo said no (2008)', 'about 1/10', CORAL, t_s5)]
    for i, (lab, val, col, t0) in enumerate(rows):
        a = prog(T, t0, 0.4)
        y = 230 + i * 150
        card(d, (240, y, 1680, y + 120), a)
        text(d, (300, y + 60), lab, F('sansb', 46), CREAM, a, anchor='lm', base=PANEL)
        text(d, (1620, y + 60), val, F('serifb', 60), col, a, anchor='rm', base=PANEL)
    chrome(img, d)


def twist(T, img, d):
    text(d, (W/2, 200), 'Every choice made sense at the time.', F('serifb', 80), CREAM, prog(T, t_sense), anchor='mm')
    facts = [('2010', '1 bitcoin < 1 cent', t_btc), ('2000', 'Netflix: losing money', t_nf),
             ('1999', 'Google: one of many', t_gg), ('1976', 'Apple: tiny garage startup', t_ap)]
    for i, (yr, s, t0) in enumerate(facts):
        a = prog(T, t0, 0.4)
        x = 160 + i * 420
        card(d, (x, 330, x + 380, 640), a)
        text(d, (x + 190, 400), yr, F('serifb', 70), AMBER, a, anchor='mm', base=PANEL)
        text_block(d, (x + 30, 470), s, F('sansm', 40), 320, CREAM, a, base=PANEL)
    text(d, (W/2 - 150, 800), "Nobody gets to read tomorrow's receipt.", F('hand', 72), MINT, prog(T, t_nobody), anchor='mm')
    mascot(img, (1450, 690), 300, T=T, start=t_twist)
    chrome(img, d, 'CoinDesk; Newsweek; Fortune')


def hindsight(T, img, d):
    text(d, (W/2, 380), 'Hindsight is the real', F('serif', 110), CREAM, prog(T, t_hind), anchor='mm')
    text(d, (W/2, 520), 'time machine.', F('serifb', 140), AMBER, prog(T, t_hind + 0.6), anchor='mm')
    tw = d.textlength('time machine.', font=F('serifb', 140))
    hand_underline(d, W/2 - tw/2, W/2 + tw/2, 610, ease((T - t_hind - 1.0) / 0.7), AMBER, 10)
    text(d, (W/2, 760), 'Saying no can be expensive too.', F('hand', 80), CORAL, prog(T, t_yahoo2 + 0.6), anchor='mm')
    chrome(img, d)


def outro(T, img, d):
    text(d, (W/2, 250), 'Which deal would you', F('serif', 96), CREAM, prog(T, t_which), anchor='mm')
    text(d, (W/2, 370), 'have said YES to?', F('serifb', 110), MINT, prog(T, t_which + 0.5), anchor='mm')
    text(d, (W/2, 520), "What's today's $41 pizza?", F('hand', 84), AMBER, prog(T, t_pizza2), anchor='mm')
    pill(d, W/2 + 230, 800, 'Subscribe to Chartography', prog(T, t_sub - 0.3), color=BG, fill=MINT, font=F('sansb', 44))
    mascot(img, (420, 640), 330, T=T, start=t_which + 1.0)
    chrome(img, d)


scenes = [ce.Scene(0, hook), ce.Scene(t_typo - 0.15, intro), ce.Scene(t_how - 0.15, how), ce.Scene(t_r1 - 0.15, r1),
          ce.Scene(t_r2 - 0.15, r2), ce.Scene(t_r3 - 0.15, r3), ce.Scene(t_r4 - 0.15, r4), ce.Scene(t_r5 - 0.15, r5),
          ce.Scene(t_score - 0.15, scoreboard), ce.Scene(t_twist - 0.15, twist), ce.Scene(t_hind - 0.15, hindsight),
          ce.Scene(t_which - 0.15, outro)]

if __name__ == '__main__':
    if sys.argv[1:] == ['stills']:
        pts = [('hook', t_today + 2.5), ('intro', t_tm + 1.0), ('how', t_shrinks + 0.7), ('r1', t_pizzaday + 1.5),
               ('r2', t_one + 1.5), ('r3', t_47 + 1.2), ('r4', t_notbad), ('r5', t_bigger + 1.5),
               ('score', t_twist - 0.4), ('twist', t_hind - 0.4), ('hind', t_which - 0.4), ('outro', DUR - 0.3)]
        for n, T in pts:
            ce.still(scenes, T, f'{HERE}/still_{n}.png', DUR + 2)
    else:
        ce.render(scenes, AUD, HERE + '/final.mp4', tail=2.0)
        print(ce.sync_report(c, HERE + '/sync.json'))
