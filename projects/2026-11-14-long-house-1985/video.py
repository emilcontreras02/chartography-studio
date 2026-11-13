import sys, os, json, math
HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.join(HERE, '..', '..'))
import chartography_engine as ce
from PIL import Image, ImageDraw
from chartography_engine import (F, text, text_block, prog, ease, clamp, mix, card, counter, hand_underline, chrome,
                                 eyebrow, vbars, hbars, donut, mascot, pill, pill_row, arrow, coin, progress_bar,
                                 line_chart, house, person_icon, MINT, AMBER, CREAM, MUTED, PANEL, CORAL, SLATE,
                                 BG, EMPTY, GRID)
ce.use_canvas('long'); W, H = ce.W, ce.H
AUD = HERE + '/vo.mp3'; DUR = ce.duration(AUD)
c = ce.Cues(json.load(open(HERE + '/words.json')), DUR)

OLD = AMBER      # 1985 colour
NEW = MINT       # 2026 colour

S_PRICE = 'Census/HUD median price of new houses sold (1985 avg; Q3 2026) via PennyCalc, checked Nov 1, 2026'
S_INC = 'Census median household income via FRED MEHOINUSA646N (updated Sep 16, 2026)'
S_BOTH = 'Census/HUD new-home median (PennyCalc, Nov 1, 2026); Census income via FRED (Sep 16, 2026)'
S_RATE = 'Freddie Mac PMMS via FRED MORTGAGE30US (Jan 4, 1985); Freddie Mac (Nov 12, 2026); Census; Chartography math'
S_85 = 'Freddie Mac PMMS via FRED MORTGAGE30US (weekly, 1985)'
S_NOW = 'Freddie Mac Primary Mortgage Market Survey (Nov 12, 2026); FRED MORTGAGE30US (Jan 4, 1985)'

# ---------- cues (script order) ----------
t_today = c.at('today it costs about four and a half')
t_easier = c.at('so buying a house was easier back then')
t_fast = c.at('not so fast')
t_three = c.at('we ran three tests')
t_expect = c.at("the answer is not what you'd expect")
t_tm = c.at("let's build a time machine")
t_family = c.at('we take one family')
t_shop = c.at('we send them shopping')
t_r_sticker = c.at('the sticker price the down payment')
t_r_down = c.at('the down payment and the monthly')
t_r_month = c.at('and the monthly payment')
t_wins = c.at('whoever has the easier time')
t_rules = c.at('quick ground rules')
t_census = c.at('the median price of new homes sold')
t_income = c.at('and the medium household income')
t_notrick = c.at('no inflation tricks')
t_r1 = c.at('round one the sticker price')
t_84 = c.at('the median new home sold for about')
t_236 = c.at('the median household earned')
t_div = c.at('divide one by the other')
t_jump = c.at('now jump to 2026')
t_393 = c.at('the median new home in the third quarter')
t_874 = c.at('the latest medium household income')
t_45 = c.at('that house costs about four and a half')
t_grew = c.at('pay checks grew about three')
t_47 = c.at('new home prices grew about')
t_extra = c.at('so almost a full extra year')
t_save = c.at('if the family could save every single dollar')
t_r1win = c.at('round one goes to 1985')
t_r2 = c.at('to put twenty per cent down on a new home')
t_eleven = c.at('it takes almost eleven', lead=0.7)
t_math = c.at("here's the math twenty per cent")
t_16 = c.at('twenty per cent of 84275')
t_m85 = c.at('on 23620 dollars a year')
t_new393 = c.at("now take today's new home")
t_78 = c.at('twenty per cent is 78660')
t_m26 = c.at('on 87460 dollars a year')
t_food = c.at('before food before rent')
t_r2win = c.at('round two goes to 1985')
t_two = c.at('two rounds down')
t_blow = c.at('looks like a blow')
t_break = c.at("here's where the time machine breaks down")
t_r3 = c.at('in 1985 mortgage rates were about 13 percent')
t_13 = c.at('were about thirteen per cent')
t_ate = c.at('ate about thirty eight per cent')
t_loan = c.at('picture a 30 year fixed loan')
t_131 = c.at('in january 1985 the average rate')
t_751 = c.at("that's about 751 dollars a month")
t_38 = c.at('about thirty eight per cent of every pay check')
t_now26 = c.at('now twenty twenty six')
t_711 = c.at("this week's average rate is")
t_2117 = c.at("that's about 2117 dollars a month")
t_29 = c.at('about twenty nine per cent')
t_bill = c.at("day's bill is the bigger number", lead=0.35)
t_bite = c.at("but 1985's bill took the bigger bite")
t_lost = c.at('in this round your parents lost')
t_twist = c.at("so here's the twist")
t_house = c.at("the thing that made 1985 hard wasn't the house")
t_money = c.at('it was the money you borrowed')
t_whole = c.at('and that shows up again over the whole loan')
t_203 = c.at('the 1985 family would pay about')
t_24x = c.at("that's about 2.4 times the price")
t_447 = c.at("today's family would pay about 447")
t_11x = c.at('a bigger pile of money but only')
t_weak = c.at('but high rates have one weakness')
t_down = c.at('they can come down')
t_dec = c.at('by the last week of 1985')
t_refi = c.at('a family that bought in january could later refinance')
t_diff = c.at('a high price is different')
t_cant = c.at("you can't refinance the price of a house")
t_paid = c.at("once you've paid it it's paid")
t_who = c.at('so who really had it harder')
t_disagree = c.at('this is where people disagree')
t_side1 = c.at('one side says 1985 was easier')
t_s1b = c.at('the house cost less the down payment')
t_s1c = c.at('once they were in falling rates')
t_side2 = c.at('the other side says 1985 was harder')
t_s2b = c.at('every single month more than a third')
t_s2c = c.at('a thirteen per cent mortgage looked like')
t_say = c.at("here's what the numbers say")
t_month = c.at('the 1985 buyer had a harder month')
t_start = c.at('the 2026 buyer has a harder start')
t_getting = c.at('getting into the house is the hard part now')
t_moving = c.at('and right now the story is moving')
t_fourth = c.at('mortgage rates just fell for a fourth straight week')
t_ago = c.at('a year ago there were')
t_near = c.at('still higher than last year')
t_keepf = c.at('if rates keep falling')
t_keepc = c.at('if prices keep climbing')
t_foot = c.at('one honest footnote')
t_illus = c.at('our payment math is an illustration')
t_real = c.at('real bills are higher in both years')
t_advice = c.at('this is an advice just the numbers')
t_final = c.at('so the final score')
t_tworounds = c.at('two rounds to 1985 one round to 2026')
t_hits = c.at('but the round that hits you every single month')
t_q = c.at("so here's my question for you")
t_rather = c.at('would you rather have a cheaper house')
t_comments = c.at('tell me in the comments')
t_sub = c.at('subscribe to chartography')
t_like = c.at('and if you like seeing the story')


# ---------- helpers ----------
def big_house(d, x, y, s, col, a):
    """Simple house icon; (x, y) = left end of the roof line."""
    if a <= 0.01:
        return
    house(d, x, y + (1 - a) * 20, s, mix(col, a))


def family(d, cx, cy, s, a, col=CREAM):
    """Generic household icon: two adults + one child (no real people)."""
    if a <= 0.01:
        return
    cy += (1 - a) * 20
    person_icon(d, cx - s * 0.55, cy, s, mix(col, a))
    person_icon(d, cx + s * 0.55, cy, s, mix(col, a))
    person_icon(d, cx, cy + s * 0.25, s * 0.65, mix(col, a))


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


def scoreboard(d, x0, y0, a, s85, s26, w=520, glow=None):
    """Small scoreboard: 1985 vs 2026 'easier' rounds won."""
    if a <= 0.01:
        return
    card(d, (x0, y0, x0 + w, y0 + 170), a)
    yy = y0 + (1 - a) * 30
    text(d, (x0 + w / 2, yy + 32), 'EASIER TIME - ROUNDS WON', F('sansb', 22), MUTED, a, anchor='mm', base=PANEL, rise=0)
    text(d, (x0 + w * 0.25, yy + 72), '1985', F('sansb', 30), OLD, a, anchor='mm', base=PANEL, rise=0)
    text(d, (x0 + w * 0.75, yy + 72), '2026', F('sansb', 30), NEW, a, anchor='mm', base=PANEL, rise=0)
    text(d, (x0 + w * 0.25, yy + 125), str(s85), F('serifb', 66), CREAM if glow != 85 else OLD, a, anchor='mm', base=PANEL, rise=0)
    text(d, (x0 + w * 0.5, yy + 125), '-', F('serifb', 56), MUTED, a, anchor='mm', base=PANEL, rise=0)
    text(d, (x0 + w * 0.75, yy + 125), str(s26), F('serifb', 66), CREAM if glow != 26 else NEW, a, anchor='mm', base=PANEL, rise=0)


def year_blocks(d, x0, y0, years, a, col, T, t0, bw=150, bh=90, gap=14, label=True):
    """Row of 'one year of income' blocks, filled up to `years` (fractional)."""
    p = ease((T - t0) / 1.6)
    fill = years * p
    n = math.ceil(years)
    for i in range(n):
        x = x0 + i * (bw + gap)
        d.rounded_rectangle([x, y0, x + bw, y0 + bh], radius=10, fill=mix(EMPTY, a))
        f = clamp(fill - i)
        if f > 0.02:
            d.rounded_rectangle([x, y0, x + bw * f, y0 + bh], radius=10, fill=mix(col, a))
        if label and a > 0.05:
            text(d, (x + bw / 2, y0 + bh + 26), f'year {i + 1}', F('sans', 22), MUTED, a, anchor='mm', rise=0)


def month_row(d, x0, y0, months, a, col, T, t0, cell=78, gap=10):
    p = ease((T - t0) / 1.4)
    fill = months * p
    for i in range(12):
        x = x0 + i * (cell + gap)
        d.rounded_rectangle([x, y0, x + cell, y0 + cell], radius=12, fill=mix(EMPTY, a))
        f = clamp(fill - i)
        if f > 0.02:
            d.rounded_rectangle([x, y0, x + cell * f, y0 + cell], radius=12, fill=mix(col, a))
        text(d, (x + cell / 2, y0 + cell + 24), 'JFMAMJJASOND'[i], F('sans', 22), MUTED, a, anchor='mm', rise=0)


# ---------- scenes ----------
def hook(T, img, d):
    eyebrow(d, 'A NEW AMERICAN HOME COSTS ABOUT...', prog(T, 0.0, 0.3))
    a = prog(T, 0.15, 0.4)
    card(d, (120, 200, 760, 640), a)
    text(d, (160, 240), '1985', F('sansb', 44), OLD, a, base=PANEL)
    counter(d, (160, 310), 3.6, T, 0.3, dur=1.2, prefix='', decimals=1, font=F('serifb', 190), color=OLD, anchor='la')
    text(d, (160, 540), "years of a typical family's income", F('sans', 32), CREAM, a, base=PANEL)
    a2 = prog(T, t_today, 0.4)
    card(d, (840, 200, 1480, 640), a2)
    text(d, (880, 240), 'TODAY', F('sansb', 44), NEW, a2, base=PANEL)
    if T >= t_today:
        counter(d, (880, 310), 4.5, T, t_today, dur=1.2, prefix='', decimals=1, font=F('serifb', 190), color=NEW, anchor='la')
    text(d, (880, 540), "years of a typical family's income", F('sans', 32), CREAM, a2, base=PANEL)
    big_house(d, 360, 760, 160, OLD, prog(T, 0.4))
    big_house(d, 1080, 760, 160, NEW, prog(T, t_today))
    mascot(img, (1440, 640), 300, T=T, start=1.0)
    chrome(img, d, S_BOTH)


def tease(T, img, d):
    text(d, (W / 2, 240), 'Easier back then?', F('serifb', 110), CREAM, prog(T, t_easier), anchor='mm')
    text(d, (W / 2, 390), 'Not so fast.', F('hand', 90), AMBER, prog(T, t_fast), anchor='mm')
    a = prog(T, t_three)
    for i in range(3):
        aa = prog(T, t_three + 0.3 + i * 0.25)
        x = W / 2 - 330 + i * 330
        col = CORAL if i == 2 else SLATE
        d.rounded_rectangle([x - 130, 520 + (1 - aa) * 20, x + 130, 700 + (1 - aa) * 20], radius=24, fill=mix(col if i == 2 and T > t_three + 1.6 else PANEL, aa))
        text(d, (x, 580), f'TEST {i + 1}', F('sansb', 34), CREAM, aa, anchor='mm', base=PANEL, rise=0)
        text(d, (x, 645), '?', F('serifb', 60), CREAM, aa, anchor='mm', base=PANEL, rise=0)
    text(d, (W / 2, 790), 'In one of them, your parents had it harder.', F('serif', 56), CREAM, prog(T, t_three + 1.6), anchor='mm')
    text(d, (W / 2, 900), "The answer is not what you'd expect.", F('hand', 66), AMBER, prog(T, t_expect), anchor='mm')
    chrome(img, d)


def machine(T, img, d):
    eyebrow(d, 'THE HOUSE-HUNT TIME MACHINE', prog(T, t_tm))
    a = prog(T, t_tm)
    # time dial
    cx, cy = 480, 500
    d.ellipse([cx - 230, cy - 230, cx + 230, cy + 230], outline=mix(SLATE, a), width=14)
    sw = ease((T - t_shop) / 1.6)
    ang = -150 + 120 * sw
    d.line([(cx, cy), (cx + 190 * math.cos(math.radians(ang)), cy + 190 * math.sin(math.radians(ang)))], fill=mix(AMBER, a), width=12)
    d.ellipse([cx - 22, cy - 22, cx + 22, cy + 22], fill=mix(CREAM, a))
    text(d, (cx - 200, cy - 280), '1985', F('serifb', 60), OLD, a, anchor='mm')
    text(d, (cx + 200, cy - 280), '2026', F('serifb', 60), NEW, a, anchor='mm')
    family(d, cx, cy + 300, 90, prog(T, t_family), CREAM)
    text(d, (cx, cy + 440), 'one typical household', F('hand', 50), AMBER, prog(T, t_family + 0.8), anchor='mm')
    # rounds
    rounds = [('ROUND 1', 'Sticker price', t_r_sticker), ('ROUND 2', 'Down payment', t_r_down), ('ROUND 3', 'Monthly payment', t_r_month)]
    for i, (r, lab, t0) in enumerate(rounds):
        aa = prog(T, t0, 0.4)
        y = 250 + i * 190
        card(d, (900, y, 1780, y + 150), aa)
        text(d, (950, y + 40), r, F('sansb', 30), MINT, aa, base=PANEL)
        text(d, (950, y + 80), lab, F('serifb', 54), CREAM, aa, base=PANEL)
        if lab == 'Monthly payment':
            pass
    text(d, (1340, 860), 'easier time wins the round', F('hand', 54), AMBER, prog(T, t_wins), anchor='mm')
    chrome(img, d)


def rules(T, img, d):
    eyebrow(d, 'GROUND RULES', prog(T, t_rules))
    a = prog(T, t_census)
    card(d, (140, 230, 920, 640), a)
    big_house(d, 230, 390, 150, OLD, a)
    text_block(d, (430, 300), 'Median price of NEW homes sold', F('serifb', 50), 450, CREAM, a, base=PANEL)
    text(d, (180, 590), 'Census Bureau', F('sans', 32), MUTED, a, base=PANEL)
    a = prog(T, t_income)
    card(d, (1000, 230, 1780, 640), a)
    for k in range(3):
        coin(d, 1110 + k * 30, 380 - k * 20, 55, a)
    text_block(d, (1290, 300), 'Median household income', F('serifb', 50), 450, CREAM, a, base=PANEL)
    text(d, (1040, 590), "in each year's own dollars", F('sans', 32), MUTED, a, base=PANEL)
    text(d, (W / 2, 780), 'No inflation tricks.', F('serifb', 76), CREAM, prog(T, t_notrick), anchor='mm')
    text(d, (W / 2, 890), 'Just price against paycheck.', F('hand', 70), AMBER, prog(T, t_notrick + 1.2), anchor='mm')
    chrome(img, d, S_BOTH)


def round1(T, img, d):
    eyebrow(d, 'ROUND 1: THE STICKER PRICE', prog(T, t_r1))
    # 1985 column
    a = prog(T, t_84)
    big_house(d, 140, 370, 170, OLD, a)
    text(d, (140, 185), '1985', F('serifb', 64), OLD, a)
    text(d, (360, 250), 'New home', F('sans', 30), MUTED, a)
    if T >= t_84:
        counter(d, (360, 290), 84275, T, t_84 + 0.6, dur=1.4, prefix='$', font=F('serifb', 76), color=CREAM, anchor='la')
    a = prog(T, t_236)
    text(d, (360, 400), 'Household income', F('sans', 30), MUTED, a)
    text(d, (360, 440), '$23,620/yr', F('serifb', 60), CREAM, a)
    ad = prog(T, t_div)
    year_blocks(d, 140, 560, 3.57, ad, OLD, T, t_div + 0.5, bw=150, bh=80)
    text(d, (140, 700), '= about 3.6 years of income', F('serifb', 46), OLD, prog(T, t_div + 2.0))
    # 2026 column
    a = prog(T, t_393)
    text(d, (1000, 185), '2026', F('serifb', 64), NEW, prog(T, t_jump))
    big_house(d, 1000, 370, 170, NEW, a)
    text(d, (1220, 250), 'New home (Q3)', F('sans', 30), MUTED, a)
    if T >= t_393:
        counter(d, (1220, 290), 393300, T, t_393 + 0.6, dur=1.4, prefix='$', font=F('serifb', 76), color=CREAM, anchor='la')
    a = prog(T, t_874)
    text(d, (1220, 400), 'Household income (2025)', F('sans', 30), MUTED, a)
    text(d, (1220, 440), '$87,460/yr', F('serifb', 60), CREAM, a)
    a45 = prog(T, t_45)
    year_blocks(d, 1000, 560, 4.50, a45, NEW, T, t_45, bw=150, bh=80)
    text(d, (1000, 700), '= about 4.5 years of income', F('serifb', 46), NEW, prog(T, t_45 + 1.6))
    d.line([(940, 210), (940, 900)], fill=GRID, width=3)
    chrome(img, d, S_BOTH)


def growth(T, img, d):
    eyebrow(d, 'ROUND 1: 1985 TO 2026', prog(T, t_grew))
    rows = [('Paychecks', 3.7), ('New-home prices', 4.7)]
    vbars(d, T, rows[:1], (160, 820, 360, 520), t_grew, value_fmt=lambda v: 'x3.7', colors=[SLATE], vmax=4.7,
          label_font=F('sansb', 36), value_font=F('serifb', 64))
    if T > t_47:
        vbars(d, T, rows[1:], (540, 820, 360, 520), t_47, value_fmt=lambda v: 'x4.7', colors=[CORAL], vmax=4.7,
              label_font=F('sansb', 36), value_font=F('serifb', 64))
    a = prog(T, t_extra)
    text(d, (1060, 250), 'Almost a full', F('serifb', 70), CREAM, a)
    text(d, (1060, 340), 'extra year of pay', F('serifb', 70), CORAL, a)
    a2 = prog(T, t_save)
    text(d, (1060, 470), 'Saving every dollar to buy outright:', F('sans', 32), MUTED, a2)
    text(d, (1060, 530), '1985', F('sansb', 32), OLD, a2)
    progress_bar(d, (1180, 530, 1780, 566), 3.57 / 4.6 * ease((T - t_save - 0.3) / 1.2), a2, OLD)
    text(d, (1060, 600), '2026', F('sansb', 32), NEW, a2)
    progress_bar(d, (1180, 600, 1780, 636), 4.50 / 4.6 * ease((T - t_save - 0.8) / 1.2), a2, NEW)
    scoreboard(d, 1180, 720, prog(T, t_r1win), 1, 0, glow=85)
    chrome(img, d, S_BOTH)


def round2(T, img, d):
    eyebrow(d, 'ROUND 2: THE DOWN PAYMENT (20% DOWN)', prog(T, t_r2))
    a = prog(T, t_r2)
    text(d, (140, 250), 'Months of total household income needed for 20% down', F('sans', 36), MUTED, a)
    text(d, (140, 420), '1985', F('serifb', 60), OLD, a)
    month_row(d, 340, 400, 8.56, a, OLD, T, t_r2 + 2.5)
    text(d, (1420, 440), 'about 8.6', F('serifb', 60), OLD, prog(T, t_r2 + 4.0), anchor='lm')
    a2 = prog(T, t_eleven)
    text(d, (140, 620), '2026', F('serifb', 60), NEW, a2)
    month_row(d, 340, 600, 10.79, a2, NEW, T, t_eleven + 0.2)
    text(d, (1420, 640), 'about 10.8', F('serifb', 60), NEW, prog(T, t_eleven + 1.3), anchor='lm')
    text(d, (140, 820), 'Today it takes almost eleven months.', F('serifb', 64), CREAM, prog(T, t_eleven + 0.6))
    text(d, (140, 960), 'Illustration: 20% down on the median new home', F('sans', 26), MUTED, a, rise=0)
    chrome(img, d, S_BOTH)


def math2(T, img, d):
    eyebrow(d, "ROUND 2: HERE'S THE MATH", prog(T, t_math))
    # 1985 card
    a = prog(T, t_16)
    card(d, (120, 200, 920, 620), a)
    text(d, (160, 230), '1985', F('sansb', 40), OLD, a, base=PANEL)
    text(d, (160, 300), '20% of $84,275', F('serif', 48), CREAM, a, base=PANEL)
    text(d, (160, 370), '= $16,855', F('serifb', 80), OLD, prog(T, t_16 + 1.2), base=PANEL)
    a = prog(T, t_m85)
    text(d, (160, 500), 'of $23,620 a year = about 8.6 months', F('sans', 36), CREAM, a, base=PANEL)
    # 2026 card
    a = prog(T, t_new393)
    card(d, (1000, 200, 1800, 620), a)
    text(d, (1040, 230), '2026', F('sansb', 40), NEW, a, base=PANEL)
    text(d, (1040, 300), '20% of $393,300', F('serif', 48), CREAM, a, base=PANEL)
    text(d, (1040, 370), '= $78,660', F('serifb', 80), NEW, prog(T, t_78), base=PANEL)
    a = prog(T, t_m26)
    text(d, (1040, 500), 'of $87,460 a year = about 10.8 months', F('sans', 36), CREAM, a, base=PANEL)
    text(d, (W / 2, 720), 'Before food. Before rent. Before anything else.', F('hand', 64), AMBER, prog(T, t_food), anchor='mm')
    scoreboard(d, W / 2 - 260, 800, prog(T, t_r2win), 2, 0, glow=85)
    chrome(img, d, S_BOTH)


def blowout(T, img, d):
    a = prog(T, t_two)
    text(d, (W / 2, 200), 'Two rounds down.', F('serifb', 90), CREAM, a, anchor='mm')
    card(d, (560, 300, 1360, 640), a)
    text(d, (760, 380), '1985', F('sansb', 50), OLD, a, anchor='mm', base=PANEL)
    text(d, (1160, 380), '2026', F('sansb', 50), NEW, a, anchor='mm', base=PANEL)
    text(d, (760, 520), '2', F('serifb', 150), OLD, a, anchor='mm', base=PANEL)
    text(d, (960, 520), '-', F('serifb', 120), MUTED, a, anchor='mm', base=PANEL)
    text(d, (1160, 520), '0', F('serifb', 150), CREAM, a, anchor='mm', base=PANEL)
    text(d, (W / 2, 720), 'A blowout?', F('hand', 80), AMBER, prog(T, t_blow), anchor='mm')
    ab = prog(T, t_break)
    if ab > 0:
        jit = int(6 * math.sin(T * 40)) if T < t_break + 1.0 else 0
        text(d, (W / 2 + jit, 850), 'Here is where the time machine breaks down.', F('serifb', 58), CORAL, ab, anchor='mm')
    chrome(img, d)


def round3(T, img, d):
    eyebrow(d, 'ROUND 3: THE MONTHLY PAYMENT', prog(T, t_r3))
    a = prog(T, t_r3)
    text(d, (140, 210), '1985 mortgage rate', F('sans', 40), MUTED, a)
    counter(d, (140, 270), 13, T, t_13 + 0.2, dur=0.6, prefix='about ', suffix='%', font=F('serifb', 170), color=CORAL, anchor='la')
    aa = prog(T, t_ate)
    sweep = ease((T - t_ate - 0.3) / 1.4)
    donut(img, 1340, 520, 280, [(0.38, CORAL), (0.62, EMPTY)], max(0.001, sweep), aa)
    text(d, (1340, 500), '38%', F('serifb', 110), CORAL, prog(T, t_ate + 1.2), anchor='mm')
    text(d, (1340, 590), 'of income', F('sans', 34), CREAM, prog(T, t_ate + 1.2), anchor='mm')
    text_block(d, (140, 560), "The monthly payment on a new home ate about 38% of a typical family's income.", F('serif', 50), 820, CREAM, aa)
    chrome(img, d, S_RATE)


def math3(T, img, d):
    eyebrow(d, 'ROUND 3: 30-YEAR FIXED, 80% LOAN (ILLUSTRATION)', prog(T, t_loan))
    for col_i, (yr, colr, t_rate, rate, t_pay, pay, inc, t_share, share) in enumerate([
            ('JAN 1985', OLD, t_131, '13.1%', t_751, '$751/mo', '$23,620/yr', t_38, 0.38),
            ('NOV 2026', NEW, t_711, '7.11%', t_2117, '$2,117/mo', '$87,460/yr', t_29, 0.29)]):
        x0 = 120 + col_i * 880
        a = prog(T, t_rate - 0.6 if col_i == 0 else t_now26)
        card(d, (x0, 200, x0 + 800, 760), a)
        text(d, (x0 + 40, 230), yr, F('sansb', 38), colr, a, base=PANEL)
        text(d, (x0 + 40, 290), 'Average rate', F('sans', 30), MUTED, prog(T, t_rate), base=PANEL)
        text(d, (x0 + 40, 330), rate, F('serifb', 80), CREAM, prog(T, t_rate), base=PANEL)
        text(d, (x0 + 420, 290), 'Payment (P+I)', F('sans', 30), MUTED, prog(T, t_pay), base=PANEL)
        text(d, (x0 + 420, 335), pay, F('serifb', 62), CREAM, prog(T, t_pay), base=PANEL)
        text(d, (x0 + 40, 460), 'on ' + inc + ' household income', F('sans', 32), MUTED, prog(T, t_pay + 1.5), base=PANEL)
        a3 = prog(T, t_share)
        text(d, (x0 + 40, 540), 'Share of income', F('sans', 30), MUTED, a3, base=PANEL)
        progress_bar(d, (x0 + 40, 600, x0 + 440, 650), share / 0.4 * ease((T - t_share) / 1.0), a3, CORAL if col_i == 0 else NEW)
        text(d, (x0 + 470, 625), f'about {round(share * 100)}%', F('serifb', 54), CORAL if col_i == 0 else NEW, a3, anchor='lm', base=PANEL)
    text(d, (120, 960), 'Illustration: 20% down, 30-year fixed, principal + interest only (no taxes or insurance)', F('sans', 26), MUTED, prog(T, t_loan), rise=0)
    chrome(img, d, S_RATE)


def verdict3(T, img, d):
    a = prog(T, t_bill)
    text(d, (140, 200), 'Bigger bill', F('sansb', 40), MUTED, a)
    text(d, (140, 260), '2026: $2,117', F('serifb', 90), NEW, a)
    ab = prog(T, t_bite)
    text(d, (140, 430), 'Bigger bite of the paycheck', F('sansb', 40), MUTED, ab)
    text(d, (140, 490), '1985: 38%', F('serifb', 90), CORAL, ab)
    stamp(img, (560, 760), 'PARENTS LOST THIS ROUND', prog(T, t_lost, 0.35), CORAL, 54, -6)
    scoreboard(d, 1180, 220, prog(T, t_lost + 0.6), 2, 1, glow=26)
    mascot(img, (1260, 560), 300, T=T, start=t_lost + 0.3, flip=True)
    chrome(img, d, S_RATE)


def twist(T, img, d):
    eyebrow(d, "HERE'S THE TWIST", prog(T, t_twist))
    a = prog(T, t_house)
    big_house(d, 260, 520, 260, SLATE, a)
    text(d, (390, 810), 'not the house', F('hand', 60), MUTED, a, anchor='mm')
    if a > 0.5:
        d.line([(230, 350), (550, 750)], fill=mix(CORAL, prog(T, t_house + 1.2)), width=12)
    am = prog(T, t_money)
    for k in range(5):
        coin(d, 1000 + k * 130, 640 + (k % 2) * 40, 60, am)
    text(d, (1260, 380), 'It was the money', F('serifb', 76), CREAM, am, anchor='mm')
    text(d, (1260, 470), 'you borrowed.', F('serifb', 76), CORAL, am, anchor='mm')
    chrome(img, d)


def interest(T, img, d):
    eyebrow(d, 'OVER 30 YEARS: HOUSE PRICE vs INTEREST PAID (ILLUSTRATION)', prog(T, t_whole))
    a = prog(T, t_203)
    rows85 = [('1985 house', 84275), ('1985 interest', 203000)]
    rows26 = [('2026 house', 393300), ('2026 interest', 447000)]
    fmt = lambda v: f'about ${v/1000:,.0f}K'
    hbars(d, T, rows85, (520, 280, 1000, 110), t_203, value_fmt=fmt, colors=[SLATE, OLD], vmax=470000,
          label_font=F('sansb', 36), value_font=F('serifb', 44))
    text(d, (1560, 400), '2.4x the price', F('serifb', 54), OLD, prog(T, t_24x), anchor='mm')
    if T > t_447:
        hbars(d, T, rows26, (520, 580, 1000, 110), t_447 - 0.6, value_fmt=fmt, colors=[SLATE, NEW], vmax=470000,
              label_font=F('sansb', 36), value_font=F('serifb', 44))
    text(d, (W / 2, 890), 'A bigger pile today, but only about 1.1x the price of the house.', F('serif', 48), CREAM, prog(T, t_11x), anchor='mm')
    chrome(img, d, S_RATE)


def ratesfall(T, img, d):
    eyebrow(d, 'THE 30-YEAR MORTGAGE RATE IN 1985', prog(T, t_weak))
    text(d, (W / 2, 200), 'High rates have one weakness: they can come down.', F('serifb', 60), CREAM, prog(T, t_down), anchor='mm')
    pts = [(0.0, 13.10, 'Jan 4'), (0.23, 13.29, 'Mar 29 (high)'), (1.0, 11.09, 'Dec 27')]
    line_chart(d, T, pts, (260, 330, 1240, 820), t_down + 0.6, dur=2.6, ymax=14, ymin=10, color=CORAL, width=10,
               y_ticks=(10, 11, 12, 13, 14), y_fmt=lambda v: f'{v}%', point_labels=['13.10%', '13.29%', '11.09%'],
               label_font=F('sansb', 34))
    a = prog(T, t_refi)
    card(d, (1340, 330, 1800, 560), a)
    text_block(d, (1380, 360), 'A January buyer could later REFINANCE', F('serifb', 44), 400, MINT, a, base=PANEL)
    a2 = prog(T, t_cant)
    card(d, (1340, 600, 1800, 830), a2)
    text_block(d, (1380, 630), "You can't refinance the price.", F('serifb', 44), 400, CORAL, a2, base=PANEL)
    text(d, (1570, 900), "Once it's paid, it's paid.", F('hand', 46), AMBER, prog(T, t_paid), anchor='mm')
    chrome(img, d, S_85)


def debate(T, img, d):
    text(d, (W / 2, 170), 'So who really had it harder?', F('serifb', 80), CREAM, prog(T, t_who), anchor='mm')
    text(d, (W / 2, 270), 'People disagree. Both sides have a point.', F('hand', 56), AMBER, prog(T, t_disagree), anchor='mm')
    sides = [(t_side1, '"1985 was EASIER"', OLD, [(t_s1b, 'Cheaper house'), (t_s1b + 1.6, 'Faster down payment'), (t_s1c, 'Falling rates did the rest')]),
             (t_side2, '"1985 was HARDER"', CORAL, [(t_s2b, 'More than 1/3 of pay, every month'), (t_s2b + 3.0, 'Nobody knew rates would fall'), (t_s2c, '13% looked like forever')])]
    for i, (t0, title, col, pts) in enumerate(sides):
        a = prog(T, t0)
        x0 = 140 + i * 840
        card(d, (x0, 350, x0 + 780, 860), a)
        text(d, (x0 + 40, 390), title, F('serifb', 56), col, a, base=PANEL)
        for k, (tp, s) in enumerate(pts):
            ap = prog(T, tp)
            y = 510 + k * 110
            d.ellipse([x0 + 50, y + 4 + (1 - ap) * 20, x0 + 74, y + 28 + (1 - ap) * 20], fill=mix(col, ap, PANEL))
            text(d, (x0 + 100, y), s, F('sans', 38), CREAM, ap, base=PANEL)
    chrome(img, d)


def numbers_say(T, img, d):
    eyebrow(d, "WHAT THE NUMBERS SAY", prog(T, t_say))
    a = prog(T, t_month)
    text(d, (140, 260), '1985 buyer:', F('sansb', 50), OLD, a)
    text(d, (620, 230), 'a harder MONTH', F('serifb', 100), CREAM, a)
    a2 = prog(T, t_start)
    text(d, (140, 460), '2026 buyer:', F('sansb', 50), NEW, a2)
    text(d, (620, 430), 'a harder START', F('serifb', 100), CREAM, a2)
    a3 = prog(T, t_getting)
    text(d, (W / 2, 760), 'Getting in is the hard part now. Staying in was the hard part then.', F('hand', 60), AMBER, a3, anchor='mm')
    chrome(img, d)


def rightnow(T, img, d):
    eyebrow(d, 'RIGHT NOW: 30-YEAR FIXED, FREDDIE MAC', prog(T, t_moving))
    rows = [('Jan 1985', 13.10), ('A year ago', 6.24), ('Nov 12, 2026', 7.11)]
    vbars(d, T, rows[2:], (1000, 860, 340, 560), t_fourth, value_fmt=lambda v: '7.11%', colors=[NEW], vmax=13.1,
          label_font=F('sansb', 32), value_font=F('serifb', 56))
    if T > t_ago:
        vbars(d, T, rows[1:2], (640, 860, 340, 560), t_ago, value_fmt=lambda v: '6.24%', colors=[SLATE], vmax=13.1,
              label_font=F('sansb', 32), value_font=F('serifb', 56))
    if T > t_near:
        vbars(d, T, rows[:1], (280, 860, 340, 560), t_near + 1.0, value_fmt=lambda v: '13.10%', colors=[CORAL], vmax=13.1,
              label_font=F('sansb', 32), value_font=F('serifb', 56))
    a = prog(T, t_fourth)
    text(d, (1420, 260), '4th straight', F('serifb', 60), CREAM, a)
    text(d, (1420, 340), 'weekly drop', F('serifb', 60), CREAM, a)
    af = prog(T, t_keepf)
    text_block(d, (1420, 500), 'Rates keep falling? Round 3 tilts to today.', F('sans', 34), 400, MINT, af)
    ac = prog(T, t_keepc)
    text_block(d, (1420, 680), 'Prices keep climbing? Rounds 1 and 2 get worse.', F('sans', 34), 400, CORAL, ac)
    chrome(img, d, S_NOW)


def footnote(T, img, d):
    eyebrow(d, 'ONE HONEST FOOTNOTE', prog(T, t_foot))
    a = prog(T, t_illus)
    card(d, (300, 250, 1620, 720), a)
    text(d, (360, 290), 'Our payment math is an ILLUSTRATION', F('serifb', 56), AMBER, a, base=PANEL)
    pill_row(d, 460, ['20% down', '30-year fixed', 'no taxes or insurance'], T, [t_illus + 1.5, t_illus + 2.4, t_illus + 3.6],
             font=F('sansm', 40), cx=W / 2)
    text(d, (W / 2, 600), 'Real bills are higher in both years.', F('serif', 50), CREAM, prog(T, t_real), anchor='mm', base=PANEL)
    text(d, (W / 2, 850), "Not advice. Just the numbers.", F('hand', 66), MINT, prog(T, t_advice), anchor='mm')
    chrome(img, d)


def final(T, img, d):
    eyebrow(d, 'THE FINAL SCORE', prog(T, t_final))
    rows = [('Round 1', 'Sticker price', '1985 easier', OLD), ('Round 2', 'Down payment', '1985 easier', OLD),
            ('Round 3', 'Monthly payment', '2026 easier', NEW)]
    for i, (r, lab, win, col) in enumerate(rows):
        a = prog(T, t_tworounds + i * 0.6)
        y = 270 + i * 170
        hi = i == 2 and T > t_hits
        card(d, (300, y, 1620, y + 140), a, fill=(52, 44, 40) if hi else PANEL)
        base = (52, 44, 40) if hi else PANEL
        text(d, (350, y + 70), r, F('sansb', 36), MUTED, a, anchor='lm', base=base, rise=0)
        text(d, (590, y + 70), lab, F('serifb', 56), CREAM, a, anchor='lm', base=base, rise=0)
        text(d, (1580, y + 70), win, F('serifb', 52), col, a, anchor='rm', base=base, rise=0)
    text(d, (W / 2, 860), 'But the round that hits you every single month went the other way.', F('hand', 56), AMBER, prog(T, t_hits), anchor='mm')
    chrome(img, d)


def outro(T, img, d):
    a = prog(T, t_q)
    text(d, (W / 2, 170), 'Would you rather have...', F('serifb', 70), CREAM, a, anchor='mm')
    ar = prog(T, t_rather)
    card(d, (160, 270, 900, 620), ar)
    big_house(d, 230, 400, 120, OLD, ar)
    text_block(d, (400, 320), 'a cheaper house + a 13% mortgage', F('serifb', 50), 460, OLD, ar, base=PANEL)
    text(d, (930, 445), 'or', F('hand', 64), AMBER, prog(T, t_rather + 1.5), anchor='mm')
    ar2 = prog(T, t_rather + 2.4)
    card(d, (960, 270, 1700, 620), ar2)
    big_house(d, 1030, 400, 120, NEW, ar2)
    text_block(d, (1200, 320), "today's prices + today's rates", F('serifb', 50), 460, NEW, ar2, base=PANEL)
    text(d, (160, 700), 'Tell me in the comments.', F('serif', 56), CREAM, prog(T, t_comments))
    asub = prog(T, t_like)
    text(d, (160, 820), 'Subscribe to Chartography', F('serifb', 62), MINT, asub)
    text(d, (160, 905), 'the story behind the numbers', F('hand', 50), AMBER, asub)
    mascot(img, (1300, 660), 300, T=T, start=t_like)
    chrome(img, d)


scenes = [
    ce.Scene(0.0, hook),
    ce.Scene(t_easier - 0.15, tease),
    ce.Scene(t_tm - 0.15, machine),
    ce.Scene(t_rules - 0.15, rules),
    ce.Scene(t_r1 - 0.15, round1),
    ce.Scene(t_grew - 0.15, growth),
    ce.Scene(t_r2 - 0.15, round2),
    ce.Scene(t_math - 0.15, math2),
    ce.Scene(t_two - 0.15, blowout),
    ce.Scene(t_r3 - 0.15, round3),
    ce.Scene(t_loan - 0.15, math3),
    ce.Scene(t_bill - 0.15, verdict3),
    ce.Scene(t_twist - 0.15, twist),
    ce.Scene(t_whole - 0.15, interest),
    ce.Scene(t_weak - 0.15, ratesfall),
    ce.Scene(t_who - 0.15, debate),
    ce.Scene(t_say - 0.15, numbers_say),
    ce.Scene(t_moving - 0.15, rightnow),
    ce.Scene(t_foot - 0.15, footnote),
    ce.Scene(t_final - 0.15, final),
    ce.Scene(t_q - 0.15, outro),
]

if __name__ == '__main__':
    mode = sys.argv[1] if len(sys.argv) > 1 else 'render'
    if mode == 'stills':
        os.makedirs(HERE + '/stills', exist_ok=True)
        ss = sorted(scenes, key=lambda s: s.start)
        for i, sc in enumerate(ss):
            end = ss[i + 1].start if i + 1 < len(ss) else DUR + 2
            T = end - 0.4
            ce.still(scenes, T, f'{HERE}/stills/{i:02d}_{sc.name}.png', DUR + 2)
            print(i, sc.name, round(sc.start, 1))
    else:
        ce.render(scenes, AUD, HERE + '/final.mp4', procs=max(2, os.cpu_count() or 2))
        ce.sync_report(c, HERE + '/sync.json')
        ss = sorted(scenes, key=lambda s: s.start)
        print('CHAPTERS', [(s.name, round(s.start, 1)) for s in ss])
