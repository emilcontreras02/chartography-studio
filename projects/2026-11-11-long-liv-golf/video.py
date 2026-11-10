import sys, os, json, math
HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.join(HERE, '..', '..'))
import chartography_engine as ce
from PIL import Image, ImageDraw
from chartography_engine import (F, text, text_block, prog, ease, clamp, mix, card, counter, hand_underline, chrome,
                                 eyebrow, vbars, donut, mascot, pill, pill_row, arrow, person_icon, coin, progress_bar,
                                 calendar_grid, MINT, AMBER, CREAM, MUTED, PANEL, CORAL, SLATE, BG, EMPTY, GRID)
ce.use_canvas('long'); W, H = ce.W, ce.H
AUD = HERE + '/vo.mp3'; DUR = ce.duration(AUD)
c = ce.Cues(json.load(open(HERE + '/words.json')), DUR)

PAPER = (240, 229, 203)
INK = (44, 44, 52)
INK2 = (120, 110, 95)

# ---------- cues (script order) ----------
t_turned = c.at('reportedly turned down somewhere between')
t_four = c.at('four years later that league')
t_liq = c.at('is being liquidated')
t_called = c.at("it's called live golf")
t_5b = c.at('more than 5 billion dollars')
t_nov5 = c.at('and on november fifth twenty twenty')
t_court = c.at('bankruptcy court in new jersey')
t_wind = c.at('will wind down and sell off')
t_10min = c.at('the hearing took less than')
t_how = c.at('so how does a sports league burn')
t_notgolf = c.at('the answer is not really about golf')
t_check = c.at('a check book with only one name')
t_stay = c.at('and stay to the end')
t_ledger = c.at("let's open the ledger")
t_wallet = c.at('came out of the same wallet')
t_pif = c.at('the public investment fund')
t_eye = c.at('keep an eye on that wallet')
t_pitch = c.at("the league's pitch was simple")
t_54 = c.at('shorter tournaments of 54 holes')
t_team = c.at('a team competition on top')
t_nocut = c.at('and no cut', after=t_team)
t_every = c.at('every player in the field goes home')
t_expensive = c.at('expensive for whoever writes')
t_strange = c.at("here's why that's strange")
t_normal = c.at('a normal sports league has lots')
t_fans = c.at('fans by tickets')
t_tv = c.at('by the rights to show the games')
t_spons = c.at('sponsors pay to put their logos')
t_livtv = c.at('did land t v deals')
t_fox = c.at('later with fox')
t_nonum = c.at('but we could not find any public numbers')
t_y1 = c.at('in its first year a brand new golf league')
t_255 = c.at('255 million dollars in prize money')
t_oneplace = c.at('almost all of it came from one place')
t_eight = c.at('that first season had just eight')
t_32 = c.at('about 32 million dollars per event')
t_14 = c.at('then the schedule grew to 14')
t_405 = c.at('prize fund reached 405 million')
t_april = c.at('then in late april 2026')
t_pulled = c.at('the fund pulled its money')
t_sept = c.at('by early september')
t_onecust = c.at('a business with one customer')
t_allow = c.at("it's an allowance")
t_rescue = c.at('now there was one last rescue')
t_bc = c.at('an investment firm called b c partners')
t_300 = c.at('offered 300 million dollars')
t_catch = c.at('but there was a catch')
t_mass = c.at('critical mass of players')
t_30 = c.at('about 30 players reportedly')
t_10 = c.at('talks with about 10 others')
t_rahm = c.at('meanwhile some of the biggest names')
t_dp = c.at("leave for europe's d p world")
t_walked = c.at('then b c partners walked away')
t_terms = c.at('mutually acceptable terms')
t_slam = c.at('the check book slammed shut')
t_quote = c.at('as one attorney put it')
t_who = c.at('so who gets paid now')
t_assets = c.at('between 100 million and 500 million')
t_owes = c.at('and it owes somewhere between')
t_gap = c.at('that gap means not everyone')
t_line = c.at("and there's a line")
t_front = c.at('at the very front stands')
t_secured = c.at('listed as a secured creditor')
t_back = c.at('the players and vendors who are owed')
t_ret = c.at('golf channel also reports')
t_ceo = c.at('including more than six million dollars')
t_math = c.at("let's do the math on that ledger")
t_in = c.at('more than 5 billion dollars went in')
t_left = c.at('about 500 million dollars of assets are left')
t_cents = c.at('somewhere between 2 and 10 cents')
t_90 = c.at('about 90 cents of every dollar')
t_feel = c.at("here's another way to feel")
t_year = c.at('roughly a billion dollars a year')
t_day = c.at('close to 3 million dollars every single day')
t_tiger = c.at('somebody offered tiger woods')
t_no = c.at('he said no', after=t_tiger)
t_norman = c.at('back in 2022')
t_nine = c.at('high nine digits')
t_7to8 = c.at('reports later put it at 700')
t_stayed = c.at('woods stayed with the')
t_fair = c.at('to be fair the players who did sign')
t_bkcourt = c.at('the league that made tiger that offer')
t_paid = c.at('at least one of its former stars paid')
t_koepka = c.at('when brooks kepa returned')
t_5m = c.at('5 million dollar donation')
t_price = c.at('the price of coming back')
t_won = c.at('the man who said no one')
t_sank = c.at('so what really sank live golf')
t_shape = c.at('it was the shape of the business')
t_out = c.at('one wallet paying out')
t_backin = c.at('not enough wallets paying back in')
t_under = c.at('nothing underneath to hold')
t_next = c.at('what happens next')
t_20 = c.at('meet on november twentieth')
t_24 = c.at('set for november twenty fourth')
t_plan = c.at('the liquidation plan still has to be approved')
t_ft = c.at('the financial times has reported')
t_lesson = c.at('but the lesson is already clear')
t_buy = c.at('big money can buy players')
t_cannot = c.at('it cannot buy a business model')
t_q = c.at("so here's my question for you")
t_could = c.at('could any sports league survive')
t_sub = c.at('subscribe to chartography')

SRC_GC = 'Golf Channel; NBC Sports (Nov 5, 2026)'


# ---------- small drawing helpers ----------
def stamp(img, center, s, a, color=CORAL, size=90, angle=-12):
    """Rubber-stamp word, rotated, pops in."""
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
    sc = 1.0 + (1 - ease(a)) * 0.6
    lay = lay.resize((int(tw * sc), int(th * sc)), Image.LANCZOS).rotate(angle, expand=True, resample=Image.BICUBIC)
    img.paste(lay, (int(center[0] - lay.width / 2), int(center[1] - lay.height / 2)), lay)


def wallet(d, cx, cy, w, a, fill_frac=1.0, label=None):
    """Simple wallet icon with a fill meter inside."""
    if a <= 0.01:
        return
    h = w * 0.66
    x0, y0 = cx - w / 2, cy - h / 2 + (1 - a) * 20
    d.rounded_rectangle([x0, y0, x0 + w, y0 + h], radius=int(w * 0.09), fill=mix((120, 84, 52), a))
    d.rounded_rectangle([x0 + w * 0.62, y0 + h * 0.33, x0 + w + 6, y0 + h * 0.67], radius=int(w * 0.05), fill=mix((150, 108, 70), a))
    d.ellipse([x0 + w * 0.8, y0 + h * 0.45, x0 + w * 0.88, y0 + h * 0.55], fill=mix(AMBER, a))
    mx0, my0, mx1, my1 = x0 + w * 0.08, y0 + h * 0.18, x0 + w * 0.55, y0 + h * 0.82
    d.rounded_rectangle([mx0, my0, mx1, my1], radius=8, fill=mix(BG, a))
    fh = (my1 - my0 - 8) * clamp(fill_frac)
    if fh > 2:
        d.rounded_rectangle([mx0 + 4, my1 - 4 - fh, mx1 - 4, my1 - 4], radius=6, fill=mix(MINT if fill_frac > 0.25 else CORAL, a))
    if label:
        text(d, (cx, y0 + h + 40), label, F('sansb', 30), CREAM, a, anchor='mm')


def cheque(d, box, a, payee, amount, signer='PIF', rot_y=0):
    if a <= 0.01:
        return
    x0, y0, x1, y1 = box
    y0 += (1 - a) * 30; y1 += (1 - a) * 30
    d.rounded_rectangle([x0, y0, x1, y1], radius=14, fill=mix(PAPER, a))
    d.rectangle([x0, y0 + 18, x1, y0 + 34], fill=mix((210, 196, 165), a))
    text(d, (x0 + 30, y0 + 70), 'PAY TO', F('sansb', 22), INK2, a, base=PAPER, rise=0)
    text(d, (x0 + 30, y0 + 100), payee, F('serifb', 40), INK, a, base=PAPER, rise=0)
    text(d, (x1 - 30, y0 + 100), amount, F('serifb', 44), (30, 120, 90), a, anchor='ra', base=PAPER, rise=0)
    d.line([(x1 - 260, y1 - 40), (x1 - 30, y1 - 40)], fill=mix(INK2, a), width=2)
    text(d, (x1 - 145, y1 - 48), signer, F('hand', 40), INK, a, anchor='ms', base=PAPER, rise=0)


# ---------- scenes ----------
def hook(T, img, d):
    eyebrow(d, 'THE OFFER TIGER WOODS TURNED DOWN', prog(T, 0.0, 0.3))
    text(d, (140, 260), 'Reported offer', F('sansm', 44), MUTED, prog(T, 0.1, 0.3))
    text(d, (140, 310), '$700-800M', F('serifb', 170), MINT, prog(T, 0.3, 0.5))
    stamp(img, (480, 580), 'DECLINED', prog(T, 2.3, 0.35), CORAL, 70, -8)
    text(d, (140, 700), 'Four years later, that league is...', F('serif', 60), CREAM, prog(T, t_four))
    stamp(img, (600, 880), 'BEING LIQUIDATED', prog(T, t_liq, 0.35), CORAL, 70, -4)
    mascot(img, (1450, 560), 330, T=T, start=1.0)
    chrome(img, d, 'CBS Sports / Greg Norman (Aug 2022); Golf Channel (Nov 5, 2026)')


def intro(T, img, d):
    eyebrow(d, 'LIV GOLF, 2022-2026', prog(T, t_called))
    text(d, (140, 200), 'Spent in about five years', F('sansm', 44), MUTED, prog(T, t_called + 0.3))
    if T > t_5b:
        counter(d, (140, 260), 5, T, t_5b, dur=1.2, prefix='$', suffix=' billion+', font=F('serifb', 170), color=MINT, anchor='la')
    card(d, (140, 560, 1100, 900), prog(T, t_nov5))
    text(d, (190, 600), 'NOV 5, 2026', F('sansb', 36), AMBER, prog(T, t_nov5), base=PANEL)
    text(d, (190, 660), 'US Bankruptcy Court, New Jersey', F('serif', 52), CREAM, prog(T, t_court), base=PANEL)
    text(d, (190, 760), '"Wind down and sell off what\'s left"', F('hand', 64), MINT, prog(T, t_wind), base=PANEL)
    a = prog(T, t_10min)
    card(d, (1200, 560, 1780, 900), a)
    text(d, (1490, 610), 'The hearing took', F('sansm', 36), MUTED, a, anchor='mm', base=PANEL)
    text(d, (1490, 720), 'under 10 min', F('serifb', 78), AMBER, a, anchor='mm', base=PANEL)
    progress_bar(d, (1260, 800, 1720, 836), clamp((T - t_10min) / 2.0) * 0.16, a, CORAL)
    chrome(img, d, SRC_GC)


def question(T, img, d):
    text(d, (W/2, 260), 'How do you burn through', F('serif', 92), CREAM, prog(T, t_how), anchor='mm')
    text(d, (W/2, 390), '$5 billion?', F('serifb', 130), MINT, prog(T, t_how + 0.8), anchor='mm')
    text(d, (W/2 - 380, 560), 'Not about golf.', F('hand', 80), MUTED, prog(T, t_notgolf), anchor='mm')
    cheque(d, (W/2 + 40, 500, W/2 + 700, 760), prog(T, t_check), 'everyone', '$$$', 'one name')
    text(d, (W/2, 880), 'Stay to the end: the biggest winner never signed anything.', F('sansm', 44), AMBER, prog(T, t_stay), anchor='mm')
    chrome(img, d)


def ledger(T, img, d):
    eyebrow(d, 'THE ONE-WALLET LEDGER', prog(T, t_ledger))
    wallet(d, 520, 520, 520, prog(T, t_wallet), 1.0)
    a = prog(T, t_pif)
    text(d, (900, 400), 'The Public Investment Fund', F('serifb', 60), CREAM, a)
    text(d, (900, 490), "Saudi Arabia's sovereign wealth fund", F('sansm', 40), MUTED, a)
    text(d, (900, 640), 'Keep an eye on this wallet.', F('hand', 76), AMBER, prog(T, t_eye))
    text(d, (900, 740), "It's the only one that matters.", F('hand', 60), MUTED, prog(T, t_eye + 1.4))
    chrome(img, d, SRC_GC)


def pitch(T, img, d):
    eyebrow(d, "THE LEAGUE'S PITCH", prog(T, t_pitch))
    pill_row(d, 250, ['54 holes', 'Team competition', 'No cut'], T, [t_54, t_team, t_nocut], font=F('sansb', 48),
             colors=[CREAM, CREAM, AMBER])
    text(d, (W/2, 400), 'Every player goes home with a check', F('serif', 60), CREAM, prog(T, t_every), anchor='mm')
    for i in range(48):
        r, k = divmod(i, 16)
        x, y = 330 + k * 80, 520 + r * 120
        ap = prog(T, t_every + 0.3 + i * 0.025, 0.3)
        if ap > 0:
            person_icon(d, x, y, 60, mix(SLATE, ap))
            coin(d, x + 24, y + 34, 15, ap)
    text(d, (W/2, 920), 'Great for players. Expensive for whoever writes the checks.', F('hand', 64), CORAL, prog(T, t_expensive), anchor='mm')
    chrome(img, d, 'Wikipedia: LIV Golf (format)')


def wallets_in(T, img, d):
    eyebrow(d, 'HOW A NORMAL LEAGUE GETS PAID', prog(T, t_normal))
    items = [('Tickets', 'fans', t_fans), ('TV rights', 'networks', t_tv), ('Sponsors', 'logos', t_spons)]
    for i, (lab, sub, t0) in enumerate(items):
        a = prog(T, t0)
        y = 290 + i * 190
        wallet(d, 300, y, 190, a)
        text(d, (430, y - 20), lab, F('serifb', 56), CREAM, a, anchor='lm')
        arrow(d, (720, y), (880, y), a, MINT, 8)
    a = prog(T, t_normal + 0.3)
    card(d, (900, 230, 1260, 700), a)
    text(d, (1080, 465), 'LEAGUE', F('sansb', 50), CREAM, a, anchor='mm', base=PANEL)
    a = prog(T, t_livtv)
    text(d, (1340, 260), 'LIV did land TV deals:', F('sansm', 40), MUTED, a)
    pill(d, 1450, 360, 'The CW', a, CREAM, PANEL, F('sansb', 44))
    pill(d, 1690, 360, 'Fox', prog(T, t_fox), CREAM, PANEL, F('sansb', 44))
    a = prog(T, t_nonum)
    card(d, (1320, 460, 1800, 860), a)
    text(d, (1560, 510), 'Money in vs. money out', F('sansb', 34), MUTED, a, anchor='mm', base=PANEL)
    text(d, (1450, 650), '?', F('serifb', 150), AMBER, a, anchor='mm', base=PANEL)
    text(d, (1560, 650), 'vs', F('sans', 40), MUTED, a, anchor='mm', base=PANEL)
    text(d, (1680, 650), '$$$', F('serifb', 90), CORAL, a, anchor='mm', base=PANEL)
    text_block(d, (1560, 760), 'No public numbers found', F('hand', 46), 440, CREAM, a, anchor='ma', base=PANEL)
    chrome(img, d, 'Wikipedia: LIV Golf (TV partners)')


def year_one(T, img, d):
    eyebrow(d, 'YEAR ONE, 2022', prog(T, t_y1))
    text(d, (140, 190), 'Prize money paid out', F('sansm', 44), MUTED, prog(T, t_y1 + 0.3))
    if T > t_255:
        counter(d, (140, 250), 255, T, t_255, dur=1.3, suffix='M', font=F('serifb', 170), color=MINT, anchor='la')
    a = prog(T, t_oneplace)
    text(d, (140, 470), 'From one place:', F('hand', 66), AMBER, a)
    wallet(d, 300, 680, 280, a, 1.0, 'PIF')
    a = prog(T, t_eight)
    text(d, (1000, 210), 'Tournaments that season', F('sansm', 40), MUTED, a)
    for i in range(8):
        ap = prog(T, t_eight + 0.2 + i * 0.12, 0.3)
        x = 1000 + (i % 4) * 190
        y = 280 + (i // 4) * 150
        d.rounded_rectangle([x, y + (1 - ap) * 20, x + 160, y + 120 + (1 - ap) * 20], radius=16, fill=mix(SLATE, ap))
        text(d, (x + 80, y + 60), str(i + 1), F('serifb', 60), CREAM, ap, anchor='mm', base=SLATE, rise=0)
    a = prog(T, t_32)
    card(d, (1000, 620, 1740, 900), a)
    text(d, (1370, 690), 'Per event, on average', F('sansm', 38), MUTED, a, anchor='mm', base=PANEL)
    text(d, (1370, 800), 'about $32M', F('serifb', 100), AMBER, a, anchor='mm', base=PANEL)
    chrome(img, d, 'Wikipedia: LIV Golf (2022 prize money); per-event average is our math')


def growth(T, img, d):
    eyebrow(d, 'THE PRIZE MONEY GREW', prog(T, t_14))
    vbars(d, T, [('2022: 8 events', 255), ('Later: 14 events a year', 405)], (300, 900, 1000, 560), t_14 + 0.2,
          stagger=1.2, value_fmt=lambda v: f'${v:,.0f}M', colors=[SLATE, MINT], label_font=F('sansm', 36), value_font=F('serifb', 64))
    a = prog(T, t_405)
    text(d, (1350, 380), 'Prize fund', F('sansm', 44), MUTED, a)
    text(d, (1350, 440), '$405M', F('serifb', 120), MINT, a)
    text(d, (1350, 600), 'Almost all from', F('hand', 60), AMBER, a)
    text(d, (1350, 670), 'one wallet.', F('hand', 60), AMBER, a)
    chrome(img, d, 'Wikipedia: LIV Golf')


def closes(T, img, d):
    eyebrow(d, '2026: THE WALLET CLOSES', prog(T, t_april))
    # wallet meter drains from April to the allowance line
    drain = 1.0 - clamp((T - t_pulled) / 3.0)
    wallet(d, 420, 430, 460, prog(T, t_april), drain, 'PIF funding')
    x0, x1, y = 860, 1760, 330
    a = prog(T, t_april)
    d.line([(x0, y), (x0 + (x1 - x0) * ease((T - t_april) / 1.5), y)], fill=mix(GRID, a), width=6)
    for t0, xx, lab, sub, col in [(t_april, x0 + 60, 'Late April 2026', 'PIF pulls its money', CORAL),
                                  (t_sept, x0 + 600, 'Early Sept 2026', 'Chapter 11', CORAL)]:
        aa = prog(T, t0)
        d.ellipse([xx - 16, y - 16, xx + 16, y + 16], fill=mix(col, aa))
        text(d, (xx, y - 60), lab, F('sansb', 36), CREAM, aa, anchor='mm')
        text(d, (xx, y + 60), sub, F('serifb', 50), col, aa, anchor='mm')
    a = prog(T, t_onecust)
    card(d, (860, 560, 1760, 880), a)
    text(d, (1310, 640), 'A business with one customer', F('serif', 52), CREAM, a, anchor='mm', base=PANEL)
    text(d, (1310, 700), "isn't really a business.", F('serif', 52), CREAM, a, anchor='mm', base=PANEL)
    text(d, (1310, 800), "It's an allowance.", F('handb', 84), AMBER, prog(T, t_allow), anchor='mm', base=PANEL)
    chrome(img, d, 'Golf Channel; EssentiallySports (Nov 2026)')


def rescue(T, img, d):
    eyebrow(d, 'THE LAST RESCUE ATTEMPT', prog(T, t_rescue))
    a = prog(T, t_bc)
    card(d, (120, 200, 820, 560), a)
    text(d, (170, 240), 'BC PARTNERS', F('sansb', 40), MUTED, a, base=PANEL)
    if T > t_300:
        counter(d, (170, 300), 300, T, t_300, dur=1.0, suffix='M', font=F('serifb', 130), color=MINT, anchor='la')
    text(d, (170, 470), 'to rebuild it as "LIV 2.0"', F('sansm', 40), CREAM, prog(T, t_300 + 0.8), base=PANEL)
    text(d, (470, 650), 'The catch:', F('hand', 70), AMBER, prog(T, t_catch), anchor='mm')
    text(d, (470, 740), 'a critical mass of players', F('serif', 50), CREAM, prog(T, t_mass), anchor='mm')
    text(d, (1000, 210), 'Players (reported)', F('sansm', 40), MUTED, prog(T, t_30))
    for i in range(40):
        r, k = divmod(i, 10)
        x, y = 1040 + k * 76, 330 + r * 100
        signed = i < 30
        t0 = (t_30 + 0.3 + i * 0.03) if signed else (t_10 + 0.3 + (i - 30) * 0.06)
        ap = prog(T, t0, 0.3)
        if ap > 0:
            person_icon(d, x, y, 54, mix(MINT if signed else AMBER, ap))
    text(d, (1000, 720), 'about 30 signed', F('sansb', 38), MINT, prog(T, t_30 + 0.8))
    text(d, (1400, 720), 'about 10 stuck on money', F('sansb', 38), AMBER, prog(T, t_10 + 0.5))
    pill_row(d, 840, ['Rahm', 'Hatton', 'Garcia'], T, [t_rahm + 0.5, t_rahm + 1.2, t_rahm + 1.9], font=F('sansb', 40), cx=1360)
    text(d, (1360, 930), 'plan to leave for the DP World Tour', F('sansb', 34), CORAL, prog(T, t_dp), anchor='mm')
    chrome(img, d, 'Golf Channel (Nov 5, 2026)')


def walked(T, img, d):
    a = prog(T, t_walked)
    text(d, (W/2, 230), 'BC Partners walked away', F('serifb', 90), CREAM, a, anchor='mm')
    text(d, (W/2, 330), '"Mutually acceptable terms could not be reached"', F('sansm', 40), MUTED, prog(T, t_terms), anchor='mm')
    cheque(d, (W/2 - 300, 390, W/2 + 300, 590), a, 'LIV 2.0', '$300M', 'BC')
    p = ease((T - t_walked - 0.8) / 0.5)
    if p > 0:
        d.line([(W/2 - 320, 390), (W/2 - 320 + 640 * p, 390 + 200 * p)], fill=CORAL, width=12)
    stamp(img, (W/2, 670), 'NOV 5: CHECKBOOK CLOSED', prog(T, t_slam, 0.35), CORAL, 50, -4)
    a = prog(T, t_quote)
    card(d, (300, 770, W - 300, 960), a)
    text(d, (W/2, 830), '"We believe the wind-down path', F('serif', 52), CREAM, a, anchor='mm', base=PANEL)
    text(d, (W/2, 900), 'is the best path."', F('serif', 52), CREAM, a, anchor='mm', base=PANEL)
    chrome(img, d, SRC_GC)


def range_bar(d, y, lo, hi, vmax, x0, w, col, a, label, lab_lo, lab_hi):
    d.rounded_rectangle([x0, y, x0 + w, y + 70], radius=35, fill=mix(EMPTY, a))
    p = ease(a)
    xl, xh = x0 + w * lo / vmax, x0 + w * hi / vmax * p + w * lo / vmax * (1 - p)
    d.rounded_rectangle([xl, y, max(xh, xl + 70), y + 70], radius=35, fill=mix(col, a))
    text(d, (x0, y - 50), label, F('sansb', 40), CREAM, a)
    text(d, (xl, y + 110), lab_lo, F('sansb', 34), MUTED, a, anchor='mm')
    text(d, (xh, y + 110), lab_hi, F('sansb', 34), MUTED, a, anchor='mm')


def who_paid(T, img, d):
    eyebrow(d, 'WHO GETS PAID NOW? (COURT DOCUMENTS)', prog(T, t_who))
    x0, w = 200, 1500
    range_bar(d, 300, 100, 500, 1000, x0, w, MINT, prog(T, t_assets), 'What LIV has (assets)', '$100M', '$500M')
    range_bar(d, 600, 500, 1000, 1000, x0, w, CORAL, prog(T, t_owes), 'What LIV owes (liabilities)', '$500M', '$1B')
    text(d, (W/2, 900), 'Not everyone gets their money back.', F('hand', 70), AMBER, prog(T, t_gap), anchor='mm')
    chrome(img, d, 'Golf Channel, citing court documents (Nov 5, 2026)')


def queue(T, img, d):
    eyebrow(d, 'THE PAYBACK LINE', prog(T, t_line))
    a = prog(T, t_front)
    text(d, (180, 250), 'FRONT', F('sansb', 34), MINT, a)
    wallet(d, 300, 420, 220, a, 0.6)
    text(d, (300, 590), 'PIF', F('serifb', 50), CREAM, a, anchor='mm')
    text(d, (300, 650), 'secured creditor: paid first', F('sansm', 30), MINT, prog(T, t_secured), anchor='mm')
    for i in range(9):
        ap = prog(T, t_back + i * 0.08, 0.3)
        if ap > 0:
            person_icon(d, 620 + i * 110, 430, 80, mix(SLATE, ap))
    text(d, (1060, 560), 'players and vendors owed money: further back', F('sansm', 34), MUTED, prog(T, t_back), anchor='mm')
    a = prog(T, t_ret)
    card(d, (300, 720, W - 300, 930), a)
    text(d, (360, 760), 'Retention payments to executives', F('sansm', 36), MUTED, a, base=PANEL)
    text(d, (360, 820), '$15.5M+', F('serifb', 80), AMBER, a, base=PANEL)
    a = prog(T, t_ceo)
    text(d, (1000, 760), 'to the CEO alone', F('sansm', 36), MUTED, a, base=PANEL)
    text(d, (1000, 820), '$6M+', F('serifb', 80), CORAL, a, base=PANEL)
    chrome(img, d, 'Golf Channel (Nov 5, 2026)')


def ledger_math(T, img, d):
    eyebrow(d, 'THE LEDGER MATH', prog(T, t_math))
    a = prog(T, t_in)
    text(d, (140, 230), 'Went in', F('sansm', 44), MUTED, a)
    text(d, (140, 290), '$5B+', F('serifb', 120), CREAM, a)
    a2 = prog(T, t_left)
    text(d, (140, 470), 'Left (at most)', F('sansm', 44), MUTED, a2)
    text(d, (140, 530), 'about $500M', F('serifb', 100), MINT, a2)
    sweep = ease((T - t_in) / 1.5)
    parts = [(0.9, CORAL), (0.1, MINT)] if T > t_left else [(1.0, SLATE)]
    donut(img, 1160, 520, 300, parts, sweep, prog(T, t_in))
    a = prog(T, t_cents)
    text(d, (1160, 490), '2-10', F('serifb', 110), AMBER, a, anchor='mm')
    text(d, (1160, 580), 'cents left per $1', F('sansm', 34), CREAM, a, anchor='mm')
    a = prog(T, t_90)
    text(d, (1520, 330), 'Best case:', F('hand', 56), MUTED, a)
    text(d, (1520, 400), '90 cents', F('serifb', 76), CORAL, a)
    text(d, (1520, 490), 'of every $1', F('serif', 48), CREAM, a)
    text(d, (1520, 550), 'simply gone', F('hand', 56), CORAL, a)
    chrome(img, d, 'Our math from Golf Channel + NBC Sports figures')


def per_day(T, img, d):
    eyebrow(d, 'ANOTHER WAY TO FEEL IT', prog(T, t_feel))
    a = prog(T, t_year)
    text(d, (140, 220), '$5B over about 5 years', F('sansm', 44), MUTED, a)
    text(d, (140, 280), 'about $1B a year', F('serifb', 96), CREAM, a)
    a2 = prog(T, t_day)
    n = int(365 * clamp((T - t_day) / 3.0))
    calendar_grid(d, 140, 470, n, total=365, cols=37, cell=24, gap=6, a=max(0.3, a2), color=CORAL)
    text(d, (1400, 520), 'close to', F('hand', 60), AMBER, a2)
    text(d, (1400, 590), '$3M', F('serifb', 150), CORAL, a2)
    text(d, (1400, 770), 'every single day', F('serif', 52), CREAM, a2)
    text(d, (1400, 840), 'for five years', F('serif', 52), CREAM, a2)
    chrome(img, d, 'Our math: $5B / about 5 years / 365 days')


def twist(T, img, d):
    eyebrow(d, 'THE TWIST', prog(T, t_tiger))
    text(d, (140, 220), 'Offered to Tiger Woods: up to', F('serif', 50), CREAM, prog(T, t_tiger))
    text(d, (140, 290), '$800M', F('serifb', 200), MINT, prog(T, t_tiger + 0.6))
    text(d, (140, 560), 'He said NO.', F('handb', 120), AMBER, prog(T, t_no))
    a = prog(T, t_nine)
    card(d, (1000, 200, 1780, 440), a)
    text(d, (1040, 240), 'Greg Norman, 2022:', F('sansm', 36), MUTED, a, base=PANEL)
    text(d, (1040, 310), '"high nine digits"', F('serifb', 64), CREAM, a, base=PANEL)
    a = prog(T, t_7to8)
    text(d, (1040, 490), 'Later reported: $700-800M', F('sansb', 44), MINT, a)
    text(d, (1040, 570), 'He stayed with the PGA Tour.', F('sansm', 44), CREAM, prog(T, t_stayed))
    mascot(img, (1300, 640), 300, T=T, start=t_no, flip=True)
    chrome(img, d, 'CBS Sports / NPR (Aug 2022); Wikipedia: LIV Golf')


def no_won(T, img, d):
    a = prog(T, t_fair)
    card(d, (120, 180, 900, 520), a)
    text(d, (510, 240), 'THOSE WHO SIGNED', F('sansb', 36), MUTED, a, anchor='mm', base=PANEL)
    text(d, (510, 340), 'got very rich', F('serif', 70), MINT, a, anchor='mm', base=PANEL)
    a2 = prog(T, t_bkcourt)
    text(d, (510, 440), 'their league: in bankruptcy court', F('sansm', 36), CORAL, a2, anchor='mm', base=PANEL)
    a = prog(T, t_paid)
    card(d, (1020, 180, 1800, 520), a)
    text(d, (1410, 240), 'THE PRICE OF COMING BACK', F('sansb', 36), MUTED, a, anchor='mm', base=PANEL)
    text(d, (1410, 300), 'Brooks Koepka returned to the PGA Tour', F('sansm', 34), CREAM, prog(T, t_koepka), anchor='mm', base=PANEL)
    text(d, (1410, 410), '$5M', F('serifb', 110), AMBER, prog(T, t_5m), anchor='mm', base=PANEL)
    text(d, (1410, 480), 'charity donation', F('sansm', 32), MUTED, prog(T, t_5m + 0.4), anchor='mm', base=PANEL)
    text(d, (W/2, 700), 'The man who said no', F('serif', 100), CREAM, prog(T, t_won), anchor='mm')
    text(d, (W/2, 840), 'won.', F('serifb', 140), MINT, prog(T, t_won + 0.9), anchor='mm')
    tw = d.textlength('won.', font=F('serifb', 140))
    hand_underline(d, W/2 - tw/2, W/2 + tw/2, 920, ease((T - t_won - 1.3) / 0.6), AMBER, 10)
    chrome(img, d, 'NBC Sports (Nov 5, 2026)')


def sank(T, img, d):
    eyebrow(d, 'WHAT REALLY SANK LIV GOLF?', prog(T, t_sank))
    text(d, (W/2, 230), 'The shape of the business', F('serifb', 90), CREAM, prog(T, t_shape), anchor='mm')
    # left: one big wallet paying out to many
    a = prog(T, t_out)
    wallet(d, 420, 520, 300, a, 0.0 if T > t_under else 0.8, None)
    text(d, (420, 720), 'ONE wallet paying out', F('sansb', 40), CORAL, a, anchor='mm')
    for i in range(6):
        arrow(d, (600, 520), (760, 380 + i * 56), a, CORAL, 5)
    # right: few small wallets paying in
    a = prog(T, t_backin)
    for i, x in enumerate((1220, 1420)):
        wallet(d, x, 500, 150, a)
        arrow(d, (x, 420), (x, 340), a, MINT, 5)
    text(d, (1320, 720), 'not enough paying back in', F('sansb', 40), MINT, a, anchor='mm')
    text(d, (W/2, 870), 'When the one wallet closed, nothing held it up.', F('hand', 66), AMBER, prog(T, t_under), anchor='mm')
    chrome(img, d)


def next_up(T, img, d):
    eyebrow(d, 'WHAT HAPPENS NEXT', prog(T, t_next))
    x0, x1, y = 200, 1720, 380
    a = prog(T, t_next)
    d.line([(x0, y), (x0 + (x1 - x0) * ease((T - t_next) / 1.5), y)], fill=mix(GRID, a), width=6)
    pts = [(t_next, 300, 'Nov 5', 'wind-down announced', CORAL), (t_20, 800, 'Nov 20', 'creditors meet', AMBER),
           (t_24, 1300, 'Nov 24', 'next court hearing', AMBER)]
    for t0, xx, lab, sub, col in pts:
        aa = prog(T, t0)
        d.ellipse([xx - 18, y - 18, xx + 18, y + 18], fill=mix(col, aa))
        text(d, (xx, y - 70), lab, F('serifb', 56), CREAM, aa, anchor='mm')
        text(d, (xx, y + 70), sub, F('sansm', 36), MUTED, aa, anchor='mm')
    aa = prog(T, t_plan)
    text(d, (1700, y), '?', F('serifb', 110), MINT, aa, anchor='mm')
    text(d, (1700, y + 90), 'plan needs court OK', F('sansm', 32), MUTED, aa, anchor='mm')
    a = prog(T, t_ft)
    card(d, (300, 620, W - 300, 880), a)
    text(d, (W/2, 680), 'SINCE THEN (Financial Times, as reported)', F('sansb', 34), MUTED, a, anchor='mm', base=PANEL)
    text(d, (W/2, 770), 'BC Partners is trying again,', F('serif', 56), CREAM, a, anchor='mm', base=PANEL)
    text(d, (W/2, 835), "via the league's bankruptcy loan", F('serif', 48), CREAM, a, anchor='mm', base=PANEL)
    chrome(img, d, 'Golf Channel; NBC Sports; Financial Times via Reuters/Yahoo Sports')


def lesson(T, img, d):
    a = prog(T, t_buy)
    pill_row(d, 330, ['Players', 'Trophies', 'Headlines'], T, [t_buy + 0.4, t_buy + 1.0, t_buy + 1.6], font=F('sansb', 52),
             colors=[MINT, MINT, MINT])
    text(d, (W/2, 200), 'Big money can buy', F('serif', 80), CREAM, prog(T, t_lesson + 0.5), anchor='mm')
    text(d, (W/2, 560), 'It cannot buy', F('serif', 90), CREAM, prog(T, t_cannot), anchor='mm')
    text(d, (W/2, 700), 'a business model.', F('serifb', 130), AMBER, prog(T, t_cannot + 0.7), anchor='mm')
    tw = d.textlength('a business model.', font=F('serifb', 130))
    hand_underline(d, W/2 - tw/2, W/2 + tw/2, 790, ease((T - t_cannot - 1.2) / 0.6), CORAL, 10)
    chrome(img, d)


def outro(T, img, d):
    text(d, (W/2, 250), 'Could any sports league', F('serif', 96), CREAM, prog(T, t_could), anchor='mm')
    text(d, (W/2, 380), 'survive on ONE funder?', F('serifb', 110), MINT, prog(T, t_could + 0.6), anchor='mm')
    text(d, (W/2, 530), 'Tell me in the comments', F('hand', 80), AMBER, prog(T, t_could + 2.0), anchor='mm')
    pill(d, W/2 + 230, 800, 'Subscribe to Chartography', prog(T, t_sub - 0.3), color=BG, fill=MINT, font=F('sansb', 44))
    mascot(img, (420, 640), 330, T=T, start=t_q + 0.5)
    chrome(img, d)


scenes = [ce.Scene(0, hook), ce.Scene(t_called - 0.15, intro), ce.Scene(t_how - 0.15, question),
          ce.Scene(t_ledger - 0.15, ledger), ce.Scene(t_pitch - 0.15, pitch), ce.Scene(t_strange - 0.15, wallets_in),
          ce.Scene(t_y1 - 0.15, year_one), ce.Scene(t_14 - 0.15, growth), ce.Scene(t_april - 0.15, closes),
          ce.Scene(t_rescue - 0.15, rescue), ce.Scene(t_walked - 0.15, walked), ce.Scene(t_who - 0.15, who_paid),
          ce.Scene(t_line - 0.15, queue), ce.Scene(t_math - 0.15, ledger_math), ce.Scene(t_feel - 0.15, per_day),
          ce.Scene(t_tiger - 0.15, twist), ce.Scene(t_fair - 0.15, no_won), ce.Scene(t_sank - 0.15, sank),
          ce.Scene(t_next - 0.15, next_up), ce.Scene(t_lesson - 0.15, lesson), ce.Scene(t_q - 0.15, outro)]

if __name__ == '__main__':
    if sys.argv[1:] == ['stills']:
        pts = [('hook', t_called - 0.3), ('intro', t_how - 0.3), ('question', t_ledger - 0.3), ('ledger', t_pitch - 0.3),
               ('pitch', t_strange - 0.3), ('wallets', t_y1 - 0.3), ('year1', t_14 - 0.3), ('growth', t_april - 0.3),
               ('closes', t_rescue - 0.3), ('rescue', t_walked - 0.3), ('walked', t_who - 0.3), ('who', t_line - 0.3),
               ('queue', t_math - 0.3), ('math', t_feel - 0.3), ('perday', t_tiger - 0.3), ('twist', t_fair - 0.3),
               ('nowon', t_sank - 0.3), ('sank', t_next - 0.3), ('next', t_lesson - 0.3), ('lesson', t_q - 0.3),
               ('outro', DUR - 0.3)]
        pts = [(n, T - 0.15 if n != 'outro' else T) for n, T in pts]
        os.makedirs(HERE + '/stills', exist_ok=True)
        for n, T in pts:
            ce.still(scenes, T, f'{HERE}/stills/{n}.png', DUR + 2)
        print([(s.name, round(s.start, 2)) for s in sorted(scenes, key=lambda s: s.start)])
    else:
        ce.render(scenes, AUD, HERE + '/final.mp4', tail=2.0, procs=max(2, os.cpu_count()))
        print(ce.sync_report(c, HERE + '/sync.json'))
