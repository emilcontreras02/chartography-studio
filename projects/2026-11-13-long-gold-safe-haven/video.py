import sys, os, json, math
HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.join(HERE, '..', '..'))
import chartography_engine as ce
from PIL import Image, ImageDraw
from chartography_engine import (F, text, text_block, prog, ease, clamp, mix, card, counter, hand_underline, chrome,
                                 eyebrow, vbars, hbars, donut, mascot, pill, pill_row, arrow, coin, progress_bar,
                                 line_chart, calendar_grid, dot_field, MINT, AMBER, CREAM, MUTED, PANEL, CORAL, SLATE,
                                 BG, EMPTY, GRID)
ce.use_canvas('long'); W, H = ce.W, ce.H
AUD = HERE + '/vo.mp3'; DUR = ce.duration(AUD)
c = ce.Cues(json.load(open(HERE + '/words.json')), DUR)

GOLD = (232, 190, 92)
GOLD_D = (176, 132, 48)

# ---------- cues (script order) ----------
t_nov = c.at('by november it had lost')
t_gold = c.at("that's gold the thing")
t_safe = c.at("it's supposed to be safe")
t_what = c.at('so what happened')
t_haven = c.at('is the safe haven still safe')
t_expect = c.at("the answer is not what you'd expect")
t_climb = c.at('first the climb')
t_2025 = c.at('gold had its best year since 1979')
t_jan = c.at('then in january')
t_5000 = c.at('passed 5000 dollars an ounce')
t_5500 = c.at('past 5500')
t_rec = c.at('all the way to a record')
t_why = c.at('analysts pointed to a weaker')
t_tension = c.at('tension in the middle least')
t_print = c.at('a fear that governments would keep printing')
t_drop = c.at('then came the drop')
t_june = c.at('by late june gold had slipped')
t_oct = c.at('then on october thirtieth')
t_week = c.at("and this week it's back under")
t_gone = c.at("that's more than 1500 dollars gone")
t_quarter = c.at('the safe haven lost more than a quarter')
t_strange = c.at('and the strangest part')
t_know = c.at('the people who know gold best')
t_real = c.at("let's make that real")
t_10k = c.at('say you put 10000 dollars')
t_7k = c.at('worth only a little over 7000 dollars')
t_3k = c.at('nearly 3000 dollars gone')
t_boring = c.at('from the asset that was supposed')
t_plug = c.at('so who pulled the plug')
t_lineup = c.at("let's line up the suspects")
t_s1 = c.at('suspect number one interest rates')
t_fed = c.at('the federal reserve held its rate steady')
t_cpi = c.at('the october inflation report came in hot')
t_04 = c.at('zero point four per cent in a single month')
t_bet = c.at('now traders are betting heavily')
t_hike = c.at('is a rate hike not a cut')
t_hold = c.at('higher rates for longer are bad news')
t_s2 = c.at('suspect number two the dollar')
t_priced = c.at('gold is priced in dollars')
t_stronger = c.at('when the dollar gets stronger')
t_blamed = c.at('analysts blamed a firmer dollar')
t_s3 = c.at('and suspect number three is the one')
t_turns = c.at('this is where the story turns')
t_twist = c.at("here's the twist")
t_nothing = c.at('gold pays you nothing')
t_zero = c.at('zero percent')
t_nodiv = c.at('no interest no dividend no rent')
t_vault = c.at('it just sits in a vault')
t_years = c.at("for years that didn't matter much")
t_10yr = c.at('the yield on the ten year')
t_park = c.at('so picture two safe places')
t_gz = c.at('gold pays you zero')
t_500 = c.at('the treasury pays you about 500 dollars')
t_harder = c.at('the shiny option has to work')
t_case = c.at("that's the case many analysts make")
t_upd = c.at('rates went up and gold came down')
t_flip = c.at('flip it around')
t_giveup = c.at('you give up about 500 dollars')
t_ten = c.at('over ten years')
t_compound = c.at('before any compounding')
t_keep = c.at('gold has to climb just to keep up')
t_fit = c.at("but here's the part that doesn't fit")
t_kept = c.at('the biggest gold buyers on the planet kept buying')
t_cb = c.at('central banks the institutions')
t_244 = c.at('added about 244 tons')
t_spring = c.at('in the spring quarter')
t_record = c.at('their buying hit a record')
t_42 = c.at('central bank buying jumped 42')
t_wgc = c.at('according to the world gold council')
t_regular = c.at("regular investors didn't run")
t_funds = c.at('gold funds holdings')
t_octf = c.at('and even in october')
t_less = c.at('just less of it')
t_slide = c.at("so the slide didn't come")
t_price_money = c.at('the price of money itself going up')
t_sale = c.at('treated the drop like a sale')
t_bounce = c.at('does that mean gold is about to bounce')
t_warn = c.at('history has a warning')
t_1980 = c.at('in january 1980')
t_850 = c.at('gold hit 850 dollars an ounce')
t_2008 = c.at('again until two thousand eight')
t_28 = c.at('twenty eight years of waiting')
t_rem = c.at('and remember the year before')
t_1979 = c.at('the last time gold had a better year')
t_hist = c.at('this is history not a forecast')
t_fast = c.at('safe and fast are not the same')
t_own = c.at('if you own gold nothing about the metal')
t_shine = c.at('same weight same shine')
t_pay = c.at('what changed is what people will pay')
t_verdict = c.at('so is the safe haven still safe')
t_depends = c.at('it depends on what you mean by safe')
t_decades = c.at('over decades gold has been good')
t_months = c.at('over months it can fall')
t_thisyear = c.at('this year it lost more than a quarter')
t_lot = c.at('gold is safe from a lot of things')
t_rates = c.at('it is not safe from interest rates')
t_advice = c.at('just the numbers')
t_q = c.at("so here's my question for you")
t_comments = c.at('tell me in the comments')
t_sub = c.at('subscribe to')

S_PRICE = 'Kitco; LiteFinance (Nov 12, 2026); Al Jazeera (Jan 29, 2026)'
S_WGC = 'World Gold Council via Kitco (Nov 3, 2026), investingLive, The National'


# ---------- drawing helpers ----------
def gold_bar(d, cx, cy, w, a, label=None, fill=1.0):
    """Trapezoid gold ingot. fill <1 shows how much of the value is left (rest is drawn empty)."""
    if a <= 0.01:
        return
    h = w * 0.36
    cy += (1 - a) * 24
    top = [(cx - w * 0.36, cy - h / 2), (cx + w * 0.36, cy - h / 2), (cx + w / 2, cy + h / 2), (cx - w / 2, cy + h / 2)]
    d.polygon(top, fill=mix(EMPTY, a))
    if fill > 0:
        # clip fill from the left
        xr = cx - w / 2 + w * clamp(fill)
        poly = []
        for (x0, y0), (x1, y1) in zip(top, top[1:] + top[:1]):
            poly.append((min(x0, xr), y0))
        d.polygon(poly, fill=mix(GOLD, a))
    d.line([(cx - w * 0.3, cy - h * 0.25), (cx + w * 0.22, cy - h * 0.25)], fill=mix((255, 230, 160), a * clamp(fill * 2)), width=max(2, int(w / 60)))
    if label:
        text(d, (cx, cy + 6), label, F('serifb', int(w * 0.11)), (60, 44, 20) if fill > 0.6 else CREAM, a, anchor='mm', base=GOLD if fill > 0.6 else EMPTY, rise=0)


def stamp(img, center, s, a, color=CORAL, size=80, angle=-8):
    if a <= 0.01:
        return
    f = F('sansb', size)
    tmp = ImageDraw.Draw(Image.new('L', (10, 10)))
    tw = int(tmp.textlength(s, font=f)) + 60
    th = int(size * 1.5)
    lay = Image.new('RGBA', (tw, th), (0, 0, 0, 0))
    dl = ImageDraw.Draw(lay)
    col = color + (int(255 * a),)
    dl.rounded_rectangle([4, 4, tw - 4, th - 4], radius=14, outline=col, width=8)
    dl.text((tw / 2, th / 2), s, font=f, fill=col, anchor='mm')
    sc = 1.0 + (1 - ease(a)) * 0.5
    lay = lay.resize((int(tw * sc), int(th * sc)), Image.LANCZOS).rotate(angle, expand=True, resample=Image.BICUBIC)
    img.paste(lay, (int(center[0] - lay.width / 2), int(center[1] - lay.height / 2)), lay)


def tri(d, cx, cy, s, up, col, a):
    if a <= 0.01:
        return
    if up:
        pts = [(cx, cy - s), (cx - s, cy + s * 0.7), (cx + s, cy + s * 0.7)]
    else:
        pts = [(cx, cy + s), (cx - s, cy - s * 0.7), (cx + s, cy - s * 0.7)]
    d.polygon(pts, fill=mix(col, a))


def suspect_card(d, box, a, num, label, col, reveal=True):
    if a <= 0.01:
        return
    x0, y0, x1, y1 = box
    y0 += (1 - a) * 30; y1 += (1 - a) * 30
    d.rounded_rectangle([x0, y0, x1, y1], radius=24, fill=mix(PANEL, a), outline=mix(col, a), width=4)
    cx = (x0 + x1) / 2
    # silhouette icon (generic shape, not a person)
    d.ellipse([cx - 55, y0 + 60, cx + 55, y0 + 170], fill=mix(SLATE, a))
    d.rounded_rectangle([cx - 95, y0 + 180, cx + 95, y0 + 300], radius=40, fill=mix(SLATE, a))
    text(d, (cx, y0 + 115), '?' if not reveal else num, F('serifb', 70), CREAM, a, anchor='mm', base=SLATE, rise=0)
    text(d, (cx, y1 - 70), label, F('sansb', 44), col, a, anchor='mm', base=PANEL, rise=0)


# ---------- scenes ----------
def hook(T, img, d):
    eyebrow(d, 'ONE OUNCE OF GOLD', prog(T, 0.0, 0.3))
    text(d, (140, 220), 'January 2026, record', F('sansm', 44), MUTED, prog(T, 0.1, 0.3))
    counter(d, (140, 280), 5600, T, 0.2, dur=1.6, prefix='about $', font=F('serifb', 150), color=GOLD, anchor='la')
    a = prog(T, t_nov)
    text(d, (140, 560), 'By November', F('sansm', 44), MUTED, a)
    text(d, (140, 620), '-$1,500+', F('serifb', 170), CORAL, a)
    tw = d.textlength('-$1,500+', font=F('serifb', 170))
    hand_underline(d, 140, 140 + tw, 850, ease((T - t_nov - 1.0) / 0.6), CORAL, 10)
    gold_bar(d, 1150, 900, 340, prog(T, 0.6), fill=1.0 - 0.28 * ease((T - t_nov) / 1.5))
    mascot(img, (1420, 520), 330, T=T, start=0.9)
    chrome(img, d, S_PRICE)


def safe(T, img, d):
    text(d, (W/2, 230), "That's gold.", F('serifb', 110), GOLD, prog(T, t_gold), anchor='mm')
    text(d, (W/2, 360), 'The thing people buy because it is supposed to be', F('serif', 54), CREAM, prog(T, t_gold + 0.8), anchor='mm')
    stamp(img, (W/2, 480), 'SAFE', prog(T, t_safe + 0.4, 0.35), MINT, 90, -4)
    a = prog(T, t_haven)
    text(d, (W/2, 660), 'Is the safe haven still safe?', F('serifb', 84), CREAM, a, anchor='mm')
    text(d, (W/2, 790), "The answer is not what you'd expect.", F('hand', 72), AMBER, prog(T, t_expect), anchor='mm')
    chrome(img, d)


def climb(T, img, d):
    eyebrow(d, 'FIRST, THE CLIMB', prog(T, t_climb))
    a = prog(T, t_2025)
    card(d, (120, 200, 760, 520), a)
    text(d, (160, 240), '2025', F('sansb', 40), AMBER, a, base=PANEL)
    text(d, (160, 300), "Gold's best year", F('serifb', 66), CREAM, a, base=PANEL)
    text(d, (160, 390), 'since 1979', F('serifb', 66), GOLD, a, base=PANEL)
    text(d, (120, 600), 'January 2026: it kept running', F('hand', 64), AMBER, prog(T, t_jan))
    rows = [('Past $5,000', 5000, t_5000), ('Past $5,500', 5500, t_5500), ('Record: about $5,600', 5600, t_rec)]
    for i, (lab, v, t0) in enumerate(rows):
        aa = prog(T, t0)
        x = 900 + i * 300
        h = 560 * (v - 3500) / 2200 * ease((T - t0) / 0.8)
        if h > 2:
            d.rounded_rectangle([x, 900 - h, x + 220, 900], radius=10, fill=GOLD if i == 2 else GOLD_D)
        text(d, (x + 110, 940), lab.split(':')[0], F('sansb', 32), CREAM, aa, anchor='mm', rise=0)
        if aa > 0.05:
            text(d, (x + 110, 900 - h - 40), f'${v:,}' if i < 2 else 'about $5,600', F('serifb', 46), CREAM, aa, anchor='mm', rise=0)
    chrome(img, d, 'ABC News / NBC News (Dec 2025); Al Jazeera (Jan 29, 2026); Kitco')


def why(T, img, d):
    eyebrow(d, 'WHY IT CLIMBED (WHAT ANALYSTS SAID)', prog(T, t_why))
    items = [('A weaker US dollar', '$', t_why + 0.9, False), ('Tension in the Middle East', '!', t_tension, False),
             ('Fear of money printing', '$$$', t_print, True)]
    for i, (lab, icon, t0, _) in enumerate(items):
        a = prog(T, t0)
        x0 = 140 + i * 570
        card(d, (x0, 300, x0 + 500, 780), a)
        d.ellipse([x0 + 160, 360 + (1 - a) * 20, x0 + 340, 540 + (1 - a) * 20], fill=mix(SLATE, a))
        text(d, (x0 + 250, 450), icon, F('serifb', 80 if len(icon) < 3 else 54), CREAM, a, anchor='mm', base=SLATE, rise=0)
        text_block(d, (x0 + 250, 600), lab, F('serifb', 46), 440, CREAM, a, anchor='ma', base=PANEL)
    chrome(img, d, 'Al Jazeera (Jan 29, 2026); Reuters via reportify (Jan 2026)')


def drop(T, img, d):
    eyebrow(d, 'THEN CAME THE DROP', prog(T, t_drop))
    pts = [(0.02, 5600, 'Late Jan'), (0.45, 3990, 'Late June'), (0.88, 3940, 'Oct 30'), (0.98, 3960, '')]
    labels = ['about $5,600', 'below $4,000', 'about $3,940', '']
    a = prog(T, t_drop)
    box = (260, 230, 1500, 820)
    line_chart(d, T, pts[:1] + [pts[1]], box, t_june - 0.8, dur=1.2, ymax=6000, ymin=3000, color=CORAL, width=10,
               y_ticks=(3000, 4000, 5000, 6000), y_fmt=lambda v: f'${v:,}', point_labels=[labels[0], ''], label_font=F('sansb', 34))
    text(d, (260 + 1240 * 0.45, 230 + 590 * (6000 - 3990) / 3000 + 50), 'below $4,000', F('sansb', 34), CREAM, prog(T, t_june + 0.4), anchor='mm', rise=0)
    if T > t_oct - 0.5:
        line_chart(d, T, [pts[1], pts[2]], box, t_oct - 0.5, dur=1.0, ymax=6000, ymin=3000, color=CORAL, width=10,
                   point_labels=['', ''], label_font=F('sansb', 34))
        text(d, (260 + 1240 * 0.88, 230 + 590 * (6000 - 3940) / 3000 + 50), 'about $3,940', F('sansb', 34), CREAM, prog(T, t_oct + 0.8), anchor='mm', rise=0)
    text(d, (260 + 1240 * 0.66, 380), 'bounced in between', F('hand', 46), MUTED, prog(T, t_oct - 0.3), anchor='mm')
    aw = prog(T, t_week)
    card(d, (1560, 300, 1840, 700), aw)
    text(d, (1700, 380), 'THIS WEEK', F('sansb', 30), AMBER, aw, anchor='mm', base=PANEL)
    text(d, (1700, 490), 'under', F('serif', 44), CREAM, aw, anchor='mm', base=PANEL)
    text(d, (1700, 580), '$4,000', F('serifb', 70), CORAL, aw, anchor='mm', base=PANEL)
    text(d, (880, 920), 'Key points only, not every day\'s price', F('sans', 28), MUTED, a, anchor='mm', rise=0)
    chrome(img, d, 'BNN Bloomberg (Jun 24, 2026); ROIC/Reuters (Oct 30, 2026); LiteFinance (Nov 12, 2026)')


def gone(T, img, d):
    a = prog(T, t_gone)
    text(d, (140, 200), 'Gone from every ounce', F('sansm', 48), MUTED, a)
    text(d, (140, 260), 'more than $1,500', F('serifb', 104), CORAL, a)
    sweep = ease((T - t_quarter - 0.5) / 1.4)
    donut(img, 1500, 560, 270, [(0.72, GOLD), (0.28, CORAL)], max(0.001, sweep), prog(T, t_quarter))
    aq = prog(T, t_quarter)
    text(d, (140, 560), 'The safe haven lost', F('serif', 64), CREAM, aq)
    text(d, (140, 650), 'more than', F('serif', 64), CREAM, aq)
    text(d, (140, 740), 'a quarter of its value.', F('serifb', 76), AMBER, aq)
    text(d, (1500, 560), '1/4+', F('serifb', 90), CORAL, prog(T, t_quarter + 1.5), anchor='mm')
    chrome(img, d, 'Kitco record (Jan 2026); LiteFinance (Nov 12, 2026); Chartography math')


def tease(T, img, d):
    a = prog(T, t_strange)
    text(d, (W/2, 330), 'And the strangest part?', F('serifb', 100), CREAM, a, anchor='mm')
    text(d, (W/2, 500), 'The people who know gold best', F('serif', 66), CREAM, prog(T, t_know), anchor='mm')
    text(d, (W/2, 590), 'did something almost nobody saw coming.', F('serif', 66), AMBER, prog(T, t_know + 1.2), anchor='mm')
    text(d, (W/2, 760), "We'll get there.", F('hand', 80), MINT, prog(T, t_know + 3.6), anchor='mm')
    chrome(img, d)


def real(T, img, d):
    eyebrow(d, "LET'S MAKE THAT REAL (ILLUSTRATION)", prog(T, t_real))
    a = prog(T, t_10k)
    text(d, (140, 220), 'Put into gold at the January peak', F('sansm', 44), MUTED, a)
    rows = [('January peak', 10000), ('Today', 7050)]
    hbars(d, T, rows[:1], (520, 330, 880, 170), t_10k + 0.3, value_fmt=lambda v: f'${v:,.0f}', colors=[GOLD],
          label_font=F('sansb', 44), value_font=F('serifb', 60), vmax=10000)
    if T > t_7k:
        hbars(d, T, rows[1:], (520, 500, 880, 170), t_7k, value_fmt=lambda v: 'a little over $7,000', colors=[CORAL],
              label_font=F('sansb', 44), value_font=F('serifb', 60), vmax=10000)
    a3 = prog(T, t_3k)
    text(d, (520, 720), 'Nearly $3,000 gone in about nine months', F('serifb', 62), CORAL, a3)
    text(d, (520, 820), 'from the "boring" asset.', F('hand', 66), AMBER, prog(T, t_boring))
    text(d, (140, 960), 'Illustration at about $4,000/oz vs the record; not investment advice', F('sans', 26), MUTED, a, rise=0)
    chrome(img, d)


def lineup(T, img, d):
    a = prog(T, t_plug)
    text(d, (W/2, 200), 'So who pulled the plug?', F('serifb', 96), CREAM, a, anchor='mm')
    text(d, (W/2, 300), "Let's line up the suspects.", F('hand', 66), AMBER, prog(T, t_lineup), anchor='mm')
    for i in range(3):
        ap = prog(T, t_lineup + 0.4 + i * 0.3)
        x0 = 330 + i * 450
        suspect_card(d, (x0, 400, x0 + 380, 900), ap, '#' + str(i + 1), ['#1', '#2', '#3'][i], MUTED, reveal=False)
    chrome(img, d)


def rates(T, img, d):
    eyebrow(d, 'SUSPECT #1: INTEREST RATES', prog(T, t_s1))
    a = prog(T, t_fed)
    card(d, (120, 200, 900, 470), a)
    text(d, (160, 240), 'OCTOBER: THE FED HOLDS', F('sansb', 34), MUTED, a, base=PANEL)
    text(d, (160, 300), '3.75% to 4%', F('serifb', 100), CREAM, a, base=PANEL)
    a = prog(T, t_cpi)
    card(d, (1000, 200, 1800, 470), a)
    text(d, (1040, 240), 'NOV 10: OCTOBER INFLATION REPORT', F('sansb', 32), MUTED, a, base=PANEL)
    text(d, (1040, 300), '+0.4%', F('serifb', 100), CORAL, prog(T, t_04), base=PANEL)
    text(d, (1400, 350), 'in one month', F('hand', 56), AMBER, prog(T, t_04 + 0.6), base=PANEL)
    a = prog(T, t_bet)
    text(d, (W/2, 560), "Traders' bet for December:", F('serif', 60), CREAM, a, anchor='mm')
    pill(d, W/2 - 200, 680, 'Rate CUT', a, MUTED, PANEL, F('sansb', 52))
    pill(d, W/2 + 200, 680, 'Rate HIKE', prog(T, t_hike), BG, CORAL, F('sansb', 52))
    if T > t_hike + 0.4:
        p = ease((T - t_hike - 0.4) / 0.4)
        d.line([(W/2 - 330, 680), (W/2 - 330 + 260 * p, 680)], fill=CORAL, width=8)
    text(d, (W/2, 850), "Bad news for anything that doesn't pay interest. Hold that thought.", F('hand', 58), AMBER, prog(T, t_hold), anchor='mm')
    chrome(img, d, 'Kitco (Oct 28, 2026); BLS CPI (Nov 10, 2026); CME FedWatch via CappNotes (Nov 10)')


def dollar(T, img, d):
    eyebrow(d, 'SUSPECT #2: THE DOLLAR', prog(T, t_s2))
    a = prog(T, t_priced)
    text(d, (140, 220), 'Gold is priced in dollars.', F('serifb', 76), CREAM, a)
    as_ = prog(T, t_stronger)
    # seesaw
    ang = 0.18 * ease((T - t_stronger - 0.6) / 1.0)
    cx, cy, L = 960, 720, 560
    x0, y0 = cx - L * math.cos(ang), cy + L * math.sin(ang)
    x1, y1 = cx + L * math.cos(ang), cy - L * math.sin(ang)
    if as_ > 0.01:
        d.polygon([(cx, cy + 10), (cx - 50, cy + 110), (cx + 50, cy + 110)], fill=mix(SLATE, as_))
        d.line([(x0, y0), (x1, y1)], fill=mix(CREAM, as_), width=12)
        coin(d, x1 - 60, y1 - 80, 60, as_)
        text(d, (x1 - 60, y1 - 190), 'Dollar', F('sansb', 44), MINT, as_, anchor='mm', rise=0)
        tri(d, x1 + 60, y1 - 190, 22, True, MINT, as_)
        gold_bar(d, x0 + 70, y0 - 60, 200, as_)
        text(d, (x0 + 70, y0 - 170), 'Gold demand', F('sansb', 44), CORAL, as_, anchor='mm', rise=0)
        tri(d, x0 + 230, y0 - 170, 22, False, CORAL, as_)
    text(d, (W/2, 370), 'Stronger dollar = pricier gold for everyone else', F('sansm', 44), MUTED, prog(T, t_stronger + 1.0), anchor='mm')
    text(d, (W/2, 900), 'Blamed for both big drops below $4,000', F('hand', 62), AMBER, prog(T, t_blamed), anchor='mm')
    chrome(img, d, 'BNN Bloomberg (Jun 24, 2026); Asharq Al-Awsat / The Standard (2026)')


def third(T, img, d):
    a = prog(T, t_s3)
    suspect_card(d, (W/2 - 230, 160, W/2 + 230, 700), a, '#3', 'SUSPECT #3', AMBER, reveal=False)
    text(d, (W/2, 820), 'The one that ties it all together.', F('serif', 64), CREAM, prog(T, t_s3 + 1.2), anchor='mm')
    text(d, (W/2, 920), 'This is where the story turns.', F('hand', 64), AMBER, prog(T, t_turns), anchor='mm')
    chrome(img, d)


def twist(T, img, d):
    eyebrow(d, "HERE'S THE TWIST", prog(T, t_twist))
    a = prog(T, t_nothing)
    text(d, (140, 200), 'Gold pays you', F('serif', 70), CREAM, a)
    text(d, (140, 260), '0%', F('serifb', 300), AMBER, prog(T, t_zero))
    pill_row(d, 720, ['No interest', 'No dividend', 'No rent'], T, [t_nodiv, t_nodiv + 0.6, t_nodiv + 1.2], font=F('sansb', 44), cx=620)
    gold_bar(d, 620, 880, 240, prog(T, t_vault))
    text(d, (900, 880), 'It just sits in a vault.', F('hand', 56), MUTED, prog(T, t_vault + 0.3), anchor='lm')
    mascot(img, (1420, 300), 340, T=T, start=t_zero, flip=True)
    chrome(img, d)


def compare(T, img, d):
    eyebrow(d, 'TWO SAFE PLACES FOR $10,000 (ILLUSTRATION)', prog(T, t_park))
    a = prog(T, t_10yr)
    text(d, (W/2, 200), '10-year US Treasury yield touched', F('serif', 60), CREAM, a, anchor='mm')
    text(d, (W/2, 290), '5%', F('serifb', 110), MINT, a, anchor='mm')
    ag = prog(T, t_gz)
    card(d, (220, 400, 900, 840), ag)
    text(d, (560, 450), 'GOLD', F('sansb', 40), GOLD, ag, anchor='mm', base=PANEL)
    text(d, (560, 520), 'pays per year', F('sansm', 34), MUTED, ag, anchor='mm', base=PANEL)
    text(d, (560, 650), '$0', F('serifb', 150), CORAL, ag, anchor='mm', base=PANEL)
    at = prog(T, t_500)
    card(d, (1020, 400, 1700, 840), at)
    text(d, (1360, 450), '10-YEAR TREASURY', F('sansb', 40), MINT, at, anchor='mm', base=PANEL)
    text(d, (1360, 520), 'pays per year', F('sansm', 34), MUTED, at, anchor='mm', base=PANEL)
    if T > t_500:
        counter(d, (1360, 650), 500, T, t_500 + 0.3, dur=1.0, prefix='about $', font=F('serifb', 88), color=MINT, anchor='mm')
    text(d, (W/2, 930), 'The shiny option has to work a lot harder to win.', F('hand', 60), AMBER, prog(T, t_harder), anchor='mm')
    chrome(img, d, 'US Treasury 10-yr touched 5% (CappNotes, Nov 10, 2026); $500 = 5% of $10,000, our math')


def updown(T, img, d):
    a = prog(T, t_case)
    text(d, (W/2, 230), 'The case many analysts make:', F('serif', 64), CREAM, a, anchor='mm')
    text(d, (W/2, 330), 'higher rates make an asset that pays nothing less attractive', F('sansm', 44), MUTED, prog(T, t_case + 1.5), anchor='mm')
    au = prog(T, t_upd)
    text(d, (640, 600), 'Rates', F('serifb', 110), MINT, au, anchor='mm')
    tri(d, 640, 780, 60, True, MINT, au)
    ag = prog(T, t_upd + 0.9)
    text(d, (1280, 600), 'Gold', F('serifb', 110), GOLD, ag, anchor='mm')
    tri(d, 1280, 780, 60, False, CORAL, ag)
    chrome(img, d)


def flip(T, img, d):
    eyebrow(d, 'FLIP IT AROUND (ILLUSTRATION)', prog(T, t_flip))
    a = prog(T, t_giveup)
    text(d, (140, 220), 'Hold $10,000 of gold instead of the Treasury:', F('sansm', 46), MUTED, prog(T, t_flip + 0.4))
    text(d, (140, 290), 'about $500 of interest missed, every year', F('serifb', 66), CREAM, a)
    for i in range(10):
        ap = prog(T, t_ten + 0.3 + i * 0.18, 0.3)
        x = 220 + i * 150
        if ap > 0:
            coin(d, x, 560, 58, ap)
            text(d, (x, 650), f'Yr {i + 1}', F('sans', 28), MUTED, ap, anchor='mm', rise=0)
    if T > t_ten + 0.3:
        counter(d, (W/2, 790), 5000, T, t_ten + 0.4, dur=1.6, prefix='about $', suffix=' never collected', font=F('serifb', 80), color=CORAL, anchor='mm')
    text(d, (W/2, 900), 'before compounding. Gold has to climb just to keep up.', F('hand', 56), AMBER, prog(T, t_keep), anchor='mm')
    chrome(img, d, 'Chartography math: 5% of $10,000 x 10 years, simple interest')


def central(T, img, d):
    eyebrow(d, "THE PART THAT DOESN'T FIT", prog(T, t_fit))
    text(d, (140, 190), 'While prices fell, the biggest buyers kept buying', F('serifb', 58), CREAM, prog(T, t_kept))
    text(d, (140, 270), 'Central banks', F('hand', 64), AMBER, prog(T, t_cb))
    cards = [('Q1 2026', '244 t', 'about, added', t_244, GOLD), ('Q2 2026', 'RECORD', 'buying, as prices slid', t_record, MINT),
             ('Q3 2026', '+42%', 'vs a year earlier', t_42, MINT)]
    for i, (q, big, sub, t0, col) in enumerate(cards):
        a = prog(T, t0)
        x0 = 140 + i * 560
        card(d, (x0, 400, x0 + 500, 800), a)
        text(d, (x0 + 250, 460), q, F('sansb', 38), MUTED, a, anchor='mm', base=PANEL)
        text(d, (x0 + 250, 590), big, F('serifb', 100), col, a, anchor='mm', base=PANEL)
        text(d, (x0 + 250, 720), sub, F('sansm', 36), CREAM, a, anchor='mm', base=PANEL)
    text(d, (W/2, 900), 'Source: World Gold Council', F('sansm', 36), MUTED, prog(T, t_wgc), anchor='mm')
    chrome(img, d, S_WGC)


def funds(T, img, d):
    eyebrow(d, 'REGULAR INVESTORS', prog(T, t_regular))
    text(d, (140, 200), "Didn't run either.", F('serifb', 90), CREAM, prog(T, t_regular))
    a = prog(T, t_funds)
    card(d, (140, 380, 900, 820), a)
    text(d, (520, 440), 'GOLD FUND HOLDINGS', F('sansb', 36), MUTED, a, anchor='mm', base=PANEL)
    text(d, (520, 580), 'New record', F('serifb', 90), MINT, a, anchor='mm', base=PANEL)
    text(d, (520, 700), 'September 2026', F('sansm', 40), CREAM, a, anchor='mm', base=PANEL)
    a = prog(T, t_octf)
    card(d, (1020, 380, 1780, 820), a)
    text(d, (1400, 440), 'OCTOBER FLOWS', F('sansb', 36), MUTED, a, anchor='mm', base=PANEL)
    text(d, (1400, 580), 'Still money in', F('serifb', 80), MINT, a, anchor='mm', base=PANEL)
    text(d, (1400, 700), 'just less of it', F('hand', 60), AMBER, prog(T, t_less), anchor='mm', base=PANEL)
    chrome(img, d, 'World Gold Council ETF flows via Money Metals (Oct 8 and Nov 6, 2026)')


def sale(T, img, d):
    a = prog(T, t_slide)
    text(d, (W/2, 220), "The slide didn't come from long-term owners leaving.", F('serif', 62), CREAM, a, anchor='mm')
    text(d, (W/2, 330), 'Many analysts say: the price of money went up.', F('serifb', 64), MINT, prog(T, t_price_money), anchor='mm')
    gold_bar(d, W/2 - 200, 640, 420, prog(T, t_slide + 0.5), fill=1.0)
    stamp(img, (W/2 + 360, 620), 'ON SALE?', prog(T, t_sale, 0.35), AMBER, 80, -10)
    text(d, (W/2, 900), 'Long-horizon buyers treated the drop like a sale.', F('hand', 60), AMBER, prog(T, t_sale + 0.6), anchor='mm')
    chrome(img, d)


def history(T, img, d):
    eyebrow(d, 'HISTORY HAS A WARNING (NOT A FORECAST)', prog(T, t_bounce))
    text(d, (140, 190), 'Is gold about to bounce back? Nobody knows.', F('serif', 56), CREAM, prog(T, t_bounce))
    a = prog(T, t_850)
    text(d, (140, 290), 'January 1980 peak', F('sansm', 40), MUTED, prog(T, t_1980))
    text(d, (140, 340), '$850', F('serifb', 120), GOLD, a)
    text(d, (140, 500), 'back at that price in', F('sansm', 40), MUTED, prog(T, t_2008))
    text(d, (140, 550), '2008', F('serifb', 120), CORAL, prog(T, t_2008))
    a28 = prog(T, t_28 - 0.3)
    filled = int(28 * clamp((T - t_28 + 0.3) / 1.6))
    if a28 > 0.01:
        for i in range(28):
            r, k = divmod(i, 7)
            x, y = 800 + k * 140, 300 + r * 120
            col = CORAL if i < filled else EMPTY
            d.rounded_rectangle([x, y, x + 120, y + 100], radius=12, fill=mix(col, a28))
            text(d, (x + 60, y + 50), str(1980 + i), F('sans', 26), CREAM, a28, anchor='mm', base=col, rise=0)
    text(d, (1290, 820), '28 years of waiting', F('serifb', 64), CORAL, prog(T, t_28), anchor='mm')
    text(d, (140, 760), 'The year before that peak: 1979,', F('hand', 50), AMBER, prog(T, t_rem))
    text(d, (140, 820), 'the last year better than 2025.', F('hand', 50), AMBER, prog(T, t_1979))
    text(d, (W/2, 930), 'Safe and fast are not the same thing.', F('serifb', 50), CREAM, prog(T, t_fast), anchor='mm')
    chrome(img, d, 'USAGOLD gold price history; ABC News (Dec 2025)')


def own(T, img, d):
    a = prog(T, t_own)
    text(d, (W/2, 220), 'If you own gold, the metal did not change.', F('serif', 62), CREAM, a, anchor='mm')
    gold_bar(d, 600, 560, 420, prog(T, t_shine))
    text(d, (600, 760), 'Same weight. Same shine.', F('hand', 60), MUTED, prog(T, t_shine), anchor='mm')
    ap = prog(T, t_pay)
    card(d, (1050, 380, 1750, 760), ap)
    text(d, (1400, 440), 'WHAT CHANGED', F('sansb', 36), AMBER, ap, anchor='mm', base=PANEL)
    text_block(d, (1400, 500), 'what people will pay today vs what they can earn elsewhere', F('serifb', 50), 620, CREAM, ap, anchor='ma', base=PANEL)
    chrome(img, d)


def verdict(T, img, d):
    a = prog(T, t_verdict)
    text(d, (W/2, 190), 'So, is the safe haven still safe?', F('serifb', 84), CREAM, a, anchor='mm')
    text(d, (W/2, 290), 'Depends on what you mean by safe.', F('hand', 60), AMBER, prog(T, t_depends), anchor='mm')
    ad = prog(T, t_decades)
    card(d, (180, 380, 900, 760), ad)
    text(d, (540, 440), 'OVER DECADES', F('sansb', 38), MUTED, ad, anchor='mm', base=PANEL)
    text_block(d, (540, 510), 'good at holding value when paper money loses it', F('serifb', 46), 620, MINT, ad, anchor='ma', base=PANEL)
    am = prog(T, t_months)
    card(d, (1020, 380, 1740, 760), am)
    text(d, (1380, 440), 'OVER MONTHS', F('sansb', 38), MUTED, am, anchor='mm', base=PANEL)
    text_block(d, (1380, 510), 'can fall as hard as almost anything', F('serifb', 46), 620, CORAL, am, anchor='ma', base=PANEL)
    at = prog(T, t_thisyear)
    progress_bar(d, (360, 820, 1560, 860), 1 - 0.27 * ease((T - t_thisyear - 0.3) / 1.2), at, GOLD)
    text(d, (W/2, 910), '2026: more than a quarter lost in under ten months', F('sansb', 36), CREAM, at, anchor='mm')
    chrome(img, d, 'Kitco; LiteFinance (Nov 12, 2026)')


def lesson(T, img, d):
    text(d, (W/2, 330), 'Gold is safe from a lot of things.', F('serif', 84), CREAM, prog(T, t_lot), anchor='mm')
    text(d, (W/2, 500), 'It is not safe from', F('serif', 84), CREAM, prog(T, t_rates), anchor='mm')
    text(d, (W/2, 650), 'interest rates.', F('serifb', 140), AMBER, prog(T, t_rates + 0.7), anchor='mm')
    tw = d.textlength('interest rates.', font=F('serifb', 140))
    hand_underline(d, W/2 - tw/2, W/2 + tw/2, 750, ease((T - t_rates - 1.2) / 0.6), CORAL, 10)
    chrome(img, d)


def outro(T, img, d):
    text(d, (W/2, 150), 'Not investment advice. Just the numbers.', F('sansm', 40), MUTED, prog(T, t_advice - 1.5), anchor='mm')
    a = prog(T, t_q)
    text(d, (W/2, 280), 'Would you rather hold', F('serif', 80), CREAM, a, anchor='mm')
    text(d, (W/2, 400), 'Gold at 0%', F('serifb', 96), GOLD, prog(T, t_q + 1.5), anchor='mm')
    text(d, (W/2, 520), 'or a Treasury at 5%?', F('serifb', 90), MINT, prog(T, t_q + 2.4), anchor='mm')
    text(d, (W/2, 650), 'Tell me in the comments', F('hand', 76), AMBER, prog(T, t_comments), anchor='mm')
    pill(d, W/2 + 230, 850, 'Subscribe to Chartography', prog(T, t_sub - 1.2), color=BG, fill=MINT, font=F('sansb', 44))
    mascot(img, (230, 680), 320, T=T, start=t_comments)
    chrome(img, d)


scenes = [ce.Scene(0, hook), ce.Scene(t_gold - 0.15, safe), ce.Scene(t_climb - 0.15, climb), ce.Scene(t_why - 0.15, why),
          ce.Scene(t_drop - 0.15, drop), ce.Scene(t_gone - 0.15, gone), ce.Scene(t_strange - 0.15, tease),
          ce.Scene(t_real - 0.15, real), ce.Scene(t_plug - 0.15, lineup), ce.Scene(t_s1 - 0.15, rates),
          ce.Scene(t_s2 - 0.15, dollar), ce.Scene(t_s3 - 0.15, third), ce.Scene(t_twist - 0.15, twist),
          ce.Scene(t_10yr - 0.15, compare), ce.Scene(t_case - 0.15, updown), ce.Scene(t_flip - 0.15, flip),
          ce.Scene(t_fit - 0.15, central), ce.Scene(t_regular - 0.15, funds), ce.Scene(t_slide - 0.15, sale),
          ce.Scene(t_bounce - 0.15, history), ce.Scene(t_own - 0.15, own), ce.Scene(t_verdict - 0.15, verdict),
          ce.Scene(t_lot - 0.15, lesson), ce.Scene(t_advice - 2.0, outro)]
for s, n in zip(scenes, ['hook', 'safe', 'climb', 'why', 'drop', 'gone', 'tease', 'real', 'lineup', 'rates', 'dollar', 'third',
                         'twist', 'compare', 'updown', 'flip', 'central', 'funds', 'sale', 'history', 'own', 'verdict',
                         'lesson', 'outro']):
    s.name = n

if __name__ == '__main__':
    ss = sorted(scenes, key=lambda s: s.start)
    if sys.argv[1:] == ['stills']:
        os.makedirs(HERE + '/stills', exist_ok=True)
        for k, s in enumerate(ss):
            T = (ss[k + 1].start - 0.3) if k + 1 < len(ss) else DUR
            ce.still(scenes, T, f'{HERE}/stills/{k:02d}_{s.name}.png', DUR + 2)
        print([(s.name, round(s.start, 2)) for s in ss])
    else:
        ce.render(scenes, AUD, HERE + '/final.mp4', tail=2.0, procs=max(2, os.cpu_count()))
        print(ce.sync_report(c, HERE + '/sync.json'))
