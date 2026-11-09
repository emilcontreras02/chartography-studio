import sys, os, json, math
HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.join(HERE, '..', '..'))
import chartography_engine as ce
from chartography_engine import (F, text, text_block, prog, ease, clamp, mix, card, counter, hand_underline, chrome,
                                 eyebrow, hbars, mascot, pill, arrow, MINT, AMBER, CREAM, MUTED, PANEL, CORAL, SLATE, BG)
ce.use_canvas('long'); W, H = ce.W, ce.H
AUD = HERE + '/vo.mp3'; DUR = ce.duration(AUD)
c = ce.Cues(json.load(open(HERE + '/words.json')), DUR)

t_spend = c.at('on track to spend about one trillion')
t_every = c.at("that's roughly every dollar")
t_flinch = c.at('and last thursday the market flinched')
t_3t = c.at('about three trillion dollars of stock market value')
t_isai = c.at('so is ai a bubble')
t_pops = c.at('what happens when it pops')
t_test = c.at("let's run a pop test")
t_more = c.at('the more gauges that fill up')
t_g1 = c.at('number one money going out')
t_ubs = c.at('according to estimates from the bank')
t_102 = c.at('microsoft that\'s around 102')
t_think = c.at('think about that')
t_bet = c.at("but it's a bet on the future")
t_g1f = c.at('the first gauge fills up a lot')
t_g2 = c.at('two the power')
t_elec = c.at('it runs on electricity')
t_third = c.at('nearly a third of the new')
t_cant = c.at("if the buildings can't get power")
t_g2f = c.at('gauge two fills up half way')
t_g3 = c.at('three the mood swings')
t_nov5 = c.at('watch what happened on thursday november fifth')
t_sp = c.at('the s and p 500 fell more than four')
t_chip = c.at('a key index of chip stocks dropped')
t_nv = c.at('fell nine percent', after=t_chip)
t_amd = c.at('amd fell seventeen')
t_corr = c.at('slid into a correction')
t_next = c.at('and then the very next day')
t_g3f = c.at('gauge three fills up fast')
t_g4 = c.at('four the mirror')
t_2000 = c.at('in march 2000 the')
t_78 = c.at('had fallen 78 percent')
t_5t = c.at('about five trillion dollars of market value was gone')
t_cisco = c.at('cisco one of the stars')
t_amzn = c.at('amazon dropped from 113')
t_four = c.at('so four gauges')
t_crash = c.at('does that mean ai is about to crash')
t_twist = c.at("here's the twist")
t_fake = c.at('a bubble bursting does not mean')
t_look = c.at('look at the internet')
t_didnt = c.at("the internet didn't")
t_amzn2 = c.at('amazon lost almost ninety percent')
t_built = c.at('the companies that overbuilt went broke')
t_real = c.at('probably the most realistic way')
t_fall = c.at('the prices of these stocks can fall hard')
t_fail = c.at('some companies will fail')
t_stay = c.at('but the useful tools are likely to stay')
t_reg = c.at('what would a pop mean for regular americans')
t_401 = c.at('many retirement accounts and index funds')
t_jobs = c.at('jobs tied to the data center boom')
t_tools = c.at('and the ai tools you use every day')
t_notbuy = c.at('this is not a buy or sell call')
t_big = c.at('big ideas and big prices')
t_what = c.at('so what do you think')
t_sub = c.at('subscribe to chartography')

GAUGES = [('Money out vs in', t_g1f, 0.82), ('The power wall', t_g2f, 0.5), ('Mood swings', t_g3f, 0.75), ('The dot-com mirror', t_amzn + 1.0, 0.7)]


def gauge(d, cx, cy, r, level, a=1.0, label=None, num=None, base=BG):
    """Semicircle gauge. level 0..1 animates the fill (mint -> amber -> coral)."""
    if a <= 0.01:
        return
    box = [cx - r, cy - r, cx + r, cy + r]
    d.arc(box, 180, 360, fill=mix(SLATE, a * 0.6, base), width=int(r * 0.22))
    if level > 0.005:
        col = MINT if level < 0.4 else (AMBER if level < 0.7 else CORAL)
        d.arc(box, 180, 180 + 180 * level, fill=mix(col, a, base), width=int(r * 0.22))
    ang = math.radians(180 + 180 * level)
    nx, ny = cx + math.cos(ang) * r * 0.78, cy + math.sin(ang) * r * 0.78
    d.line([(cx, cy), (nx, ny)], fill=mix(CREAM, a, base), width=max(3, int(r * 0.05)))
    d.ellipse([cx - r * 0.08, cy - r * 0.08, cx + r * 0.08, cy + r * 0.08], fill=mix(CREAM, a, base))
    if num:
        text(d, (cx, cy + r * 0.32), num, F('sansb', int(r * 0.26)), CREAM, a, anchor='mm', base=base, rise=0)
    if label:
        text(d, (cx, cy + r * 0.62), label, F('sansm', int(r * 0.2)), MUTED, a, anchor='mm', base=base, rise=0)


def bubble(d, cx, cy, r, a=1.0, wobble=0.0):
    if a <= 0.01:
        return
    rr = r * (1 + 0.02 * math.sin(wobble * 3))
    d.ellipse([cx - rr, cy - rr, cx + rr, cy + rr], outline=mix(MINT, a), width=8)
    d.arc([cx - rr * 0.85, cy - rr * 0.85, cx + rr * 0.85, cy + rr * 0.85], 205, 235, fill=mix(CREAM, a * 0.8), width=10)


def gfill(T, t0, level):
    return level * ease((T - t0) / 1.2)


def hook(T, img, d):
    bubble(d, 1400, 470, 300, prog(T, 0.0, 0.5), T)
    counter(d, (1400, 450), 1, T, t_spend + 0.2, dur=1.0, suffix=' TRILLION', font=F('serifb', 76), color=MINT)
    text(d, (1400, 540), 'on AI in 2026', F('sansm', 44), CREAM, prog(T, t_spend + 0.8), anchor='mm')
    text(d, (120, 260), 'Big Tech is betting', F('serif', 76), CREAM, prog(T, 0.1), rise=12)
    text(d, (120, 360), 'about $1 trillion', F('serifb', 96), AMBER, prog(T, t_spend), rise=12)
    text_block(d, (120, 500), 'That is about every dollar their cloud businesses bring in.', F('sansm', 44), 760, MUTED, prog(T, t_every))
    mascot(img, (220, 700), 290, T=T, start=0.5)
    chrome(img, d, 'UBS estimate via Yahoo Finance (Aug 22, 2026)')


def flinch(T, img, d):
    eyebrow(d, 'THURSDAY, NOVEMBER 5, 2026', prog(T, t_flinch))
    text(d, (W/2, 330), 'The market flinched.', F('hand', 110), AMBER, prog(T, t_flinch + 0.3), anchor='mm')
    counter(d, (W/2, 560), 3, T, t_3t, dur=1.0, prefix='-$', suffix=' TRILLION', font=F('serifb', 150), color=CORAL)
    text(d, (W/2, 700), 'of stock market value, in one day', F('sansm', 48), CREAM, prog(T, t_3t + 0.6), anchor='mm')
    a = prog(T, t_isai)
    text(d, (W/2, 880), 'Is AI a bubble?', F('serifb', 90), MINT, a, anchor='mm')
    text(d, (W/2, 970), 'And what happens when it pops?', F('sansm', 44), MUTED, prog(T, t_pops), anchor='mm')
    chrome(img, d, 'Yahoo Finance live coverage (Nov 5-6, 2026)')


def poptest(T, img, d):
    eyebrow(d, 'THE POP TEST', prog(T, t_test))
    text(d, (W/2, 230), '4 checks.  4 gauges.', F('serifb', 90), CREAM, prog(T, t_test + 0.3), anchor='mm')
    for i, (lab, _, _) in enumerate(GAUGES):
        a = prog(T, t_test + 0.6 + i * 0.25, 0.4)
        gauge(d, 300 + i * 440, 620, 170, 0.0, a, label=lab, num=str(i + 1))
    text(d, (W/2, 900), 'More gauges full = more bubble', F('hand', 70), AMBER, prog(T, t_more), anchor='mm')
    chrome(img, d)


def g1(T, img, d):
    eyebrow(d, 'GAUGE 1  -  MONEY OUT VS MONEY IN', prog(T, t_g1))
    text(d, (120, 260), 'Amazon, Google, Microsoft (2026)', F('sansb', 44), MUTED, prog(T, t_ubs))
    counter(d, (560, 470), 102, T, t_102, dur=1.2, prefix='', suffix='%', font=F('serifb', 200), color=CORAL)
    text_block(d, (120, 600), 'of their cloud revenue goes into building AI', F('serif', 56), 860, CREAM, prog(T, t_102 + 0.6))
    text(d, (120, 830), "A bet on the future - not a sure thing.", F('hand', 64), AMBER, prog(T, t_bet))
    card(d, (1180, 240, 1800, 880), prog(T, t_g1))
    gauge(d, 1490, 620, 230, gfill(T, t_g1f, 0.82), prog(T, t_g1), label='Money out vs in', num='1', base=PANEL)
    chrome(img, d, 'UBS estimate via Yahoo Finance (Aug 22, 2026)')


def g2(T, img, d):
    eyebrow(d, 'GAUGE 2  -  THE POWER WALL', prog(T, t_g2))
    text(d, (120, 260), 'AI runs on electricity.', F('serifb', 80), CREAM, prog(T, t_elec), rise=12)
    a = prog(T, t_third)
    text(d, (120, 420), 'New US data center capacity due in 2028', F('sansm', 40), MUTED, a)
    p = ease((T - t_third - 0.3) / 1.2)
    d.rounded_rectangle([120, 480, 1000, 560], radius=14, fill=mix(SLATE, a))
    if p > 0:
        d.rounded_rectangle([120, 480, 120 + 880 * 0.32 * p, 560], radius=14, fill=mix(CORAL, a))
    text(d, (120, 590), 'Nearly 1/3 could be delayed or lost (UBS)', F('sansb', 44), CORAL, prog(T, t_third + 0.8))
    text_block(d, (120, 720), "No power, no payoff on the trillion dollars.", F('hand', 64), 900, AMBER, prog(T, t_cant))
    card(d, (1180, 240, 1800, 880), prog(T, t_g2))
    gauge(d, 1490, 620, 230, gfill(T, t_g2f, 0.5), prog(T, t_g2), label='The power wall', num='2', base=PANEL)
    chrome(img, d, 'UBS via The Motley Fool (Nov 5, 2026)')


def g3(T, img, d):
    eyebrow(d, 'GAUGE 3  -  THE MOOD SWINGS (NOV 5, 2026)', prog(T, t_g3))
    rows = [('S&P 500', 4), ('Chip stocks index', 12), ('Nvidia', 9), ('AMD', 17)]
    starts = [t_sp, t_chip, t_nv, t_amd]
    for i, ((lab, v), t0) in enumerate(zip(rows, starts)):
        a = prog(T, t0, 0.4)
        y = 300 + i * 120
        text(d, (440, y + 30), lab, F('sansm', 40), CREAM, a, anchor='rm', rise=0)
        p = ease((T - t0) / 0.8)
        if p > 0:
            d.rounded_rectangle([470, y + 5, 470 + 30 * v * p, y + 60], radius=8, fill=mix(CORAL, a))
            text(d, (490 + 30 * v * p, y + 32), f'-{v}%' if v != 4 else '-4%+', F('sansb', 40), CREAM, a, anchor='lm', rise=0)
    pill(d, 640, 820, 'Nasdaq: correction (-10%+ from peak)', prog(T, t_corr), color=AMBER, font=F('sansb', 36))
    text(d, (640, 930), 'Next day: many bounced back.', F('hand', 60), MINT, prog(T, t_next), anchor='mm')
    card(d, (1180, 240, 1800, 880), prog(T, t_g3))
    gauge(d, 1490, 620, 230, gfill(T, t_g3f, 0.75), prog(T, t_g3), label='Mood swings', num='3', base=PANEL)
    chrome(img, d, 'Yahoo Finance (Nov 5-6, 2026)')


def g4(T, img, d):
    eyebrow(d, 'GAUGE 4  -  THE DOT-COM MIRROR', prog(T, t_g4))
    text(d, (120, 250), 'Nasdaq, March 2000:', F('sansm', 44), MUTED, prog(T, t_2000))
    text(d, (120, 300), '5,048', F('serifb', 120), CREAM, prog(T, t_2000 + 0.3))
    arrow(d, (500, 370), (625, 370), prog(T, t_78), CORAL, 10)
    text(d, (650, 300), '-78%', F('serifb', 120), CORAL, prog(T, t_78))
    text(d, (650, 440), 'by Oct 2002', F('sansm', 40), MUTED, prog(T, t_78 + 0.3))
    text(d, (120, 520), 'About $5 trillion of value gone', F('sansb', 48), AMBER, prog(T, t_5t))
    rows = [('Cisco', 80, t_cisco), ('Amazon ($113 -> $15)', 87, t_amzn)]
    for i, (lab, v, t0) in enumerate(rows):
        a = prog(T, t0, 0.4)
        y = 660 + i * 130
        text(d, (120, y), lab, F('sansm', 40), CREAM, a)
        p = ease((T - t0) / 0.8)
        if p > 0:
            d.rounded_rectangle([120, y + 55, 120 + 9 * v * p, y + 105], radius=8, fill=mix(CORAL, a))
            text(d, (140 + 9 * v * p, y + 80), f'-{v}%', F('sansb', 40), CREAM, a, anchor='lm', rise=0)
    card(d, (1180, 240, 1800, 880), prog(T, t_g4))
    gauge(d, 1490, 620, 230, gfill(T, t_amzn + 1.0, 0.7), prog(T, t_g4), label='Dot-com mirror', num='4', base=PANEL)
    chrome(img, d, 'Wikipedia: Dot-com bubble; Commoncog (Amazon)')


def verdict(T, img, d):
    text(d, (W/2, 200), 'Four gauges. Mostly in the red.', F('serifb', 84), CREAM, prog(T, t_four), anchor='mm')
    for i, (lab, _, lvl) in enumerate(GAUGES):
        gauge(d, 300 + i * 440, 560, 170, lvl, prog(T, t_four + i * 0.15), label=lab, num=str(i + 1))
    text(d, (W/2, 880), 'So... is AI about to crash?', F('hand', 90), AMBER, prog(T, t_crash), anchor='mm')
    chrome(img, d)


def twist(T, img, d):
    eyebrow(d, 'THE TWIST', prog(T, t_twist))
    text(d, (120, 280), 'Nobody knows WHEN', F('serifb', 100), CREAM, prog(T, t_twist + 0.4), rise=12)
    text(d, (120, 400), 'a bubble pops.', F('serifb', 100), CREAM, prog(T, t_twist + 1.0), rise=12)
    text(d, (120, 600), 'And a burst does not mean', F('serif', 72), MUTED, prog(T, t_fake), rise=12)
    text(d, (120, 700), 'the technology was fake.', F('serifb', 80), MINT, prog(T, t_fake + 0.8), rise=12)
    mascot(img, (1380, 560), 360, T=T, start=t_twist + 0.3, flip=True)
    chrome(img, d)


def internet(T, img, d):
    text(d, (W/2, 240), 'The bubble burst.', F('serif', 100), CREAM, prog(T, t_look), anchor='mm')
    text(d, (W/2, 370), "The internet didn't.", F('serifb', 120), MINT, prog(T, t_didnt), anchor='mm')
    card(d, (360, 500, 1560, 820), prog(T, t_amzn2))
    text(d, (W/2, 570), 'Amazon:  $113  ->  about $15', F('sansb', 56), CORAL, prog(T, t_amzn2 + 0.2), anchor='mm', base=PANEL)
    text(d, (W/2, 660), '...then one of the biggest companies on Earth', F('sansm', 46), CREAM, prog(T, t_amzn2 + 1.6), anchor='mm', base=PANEL)
    text(d, (W/2, 750), 'The builders went broke. What they built stayed.', F('hand', 56), AMBER, prog(T, t_built), anchor='mm', base=PANEL)
    chrome(img, d, 'Commoncog (Amazon in the dot-com bust)')


def realistic(T, img, d):
    eyebrow(d, 'THE REALISTIC VIEW', prog(T, t_real))
    items = [('Stock prices can fall hard', t_fall, CORAL), ('Some companies will fail', t_fail, AMBER), ('Useful tools likely stay (maybe cheaper)', t_stay, MINT)]
    for i, (s, t0, col) in enumerate(items):
        a = prog(T, t0)
        card(d, (240, 240 + i * 220, 1680, 420 + i * 220), a)
        d.ellipse([300, 300 + i * 220, 360, 360 + i * 220], fill=mix(col, a, PANEL))
        text(d, (400, 330 + i * 220), s, F('serifb', 60), CREAM, a, anchor='lm', base=PANEL)
    chrome(img, d)


def regular(T, img, d):
    eyebrow(d, 'WHAT A POP COULD MEAN FOR REGULAR AMERICANS', prog(T, t_reg))
    cards = [('401(k)s', 'Many retirement and index funds hold these giants', t_401),
             ('Jobs', 'Data center boom jobs could slow', t_jobs),
             ('Your AI tools', 'Prices or owners could change', t_tools)]
    for i, (h, s, t0) in enumerate(cards):
        a = prog(T, t0)
        x = 140 + i * 570
        card(d, (x, 260, x + 520, 760), a)
        text(d, (x + 260, 360), h, F('serifb', 76), AMBER, a, anchor='mm', base=PANEL)
        text_block(d, (x + 40, 460), s, F('sansm', 44), 440, CREAM, a, base=PANEL)
    text(d, (W/2, 880), 'This is not a buy or sell call.', F('sansb', 52), MUTED, prog(T, t_notbuy), anchor='mm')
    text(d, (W/2, 960), 'Big ideas and big prices are not the same thing.', F('hand', 60), MINT, prog(T, t_big), anchor='mm')
    chrome(img, d)


def outro(T, img, d):
    text(d, (W/2 + 200, 300), 'Bubble,', F('serifb', 130), CORAL, prog(T, t_what + 0.3), anchor='mm')
    text(d, (W/2 + 200, 460), 'or the next internet?', F('serifb', 110), MINT, prog(T, t_what + 0.9), anchor='mm')
    text(d, (W/2 + 200, 600), 'Tell us in the comments', F('hand', 70), AMBER, prog(T, t_what + 1.5), anchor='mm')
    pill(d, W/2 + 200, 780, 'Subscribe to Chartography', prog(T, t_sub - 0.3), color=BG, fill=MINT, font=F('sansb', 44))
    mascot(img, (120, 560), 340, T=T, start=t_what + 0.5)
    chrome(img, d)


scenes = [ce.Scene(0, hook), ce.Scene(t_flinch - 0.15, flinch), ce.Scene(t_test - 0.15, poptest), ce.Scene(t_g1 - 0.4, g1),
          ce.Scene(t_g2 - 0.4, g2), ce.Scene(t_g3 - 0.4, g3), ce.Scene(t_g4 - 0.4, g4), ce.Scene(t_four - 0.15, verdict),
          ce.Scene(t_twist - 0.15, twist), ce.Scene(t_look - 0.15, internet), ce.Scene(t_real - 0.15, realistic),
          ce.Scene(t_reg - 0.15, regular), ce.Scene(t_what - 0.15, outro)]

if __name__ == '__main__':
    if sys.argv[1:] == ['stills']:
        pts = [('hook', t_every + 2), ('flinch', t_pops + 1.5), ('poptest', t_g1 - 0.6), ('g1', t_g2 - 0.6), ('g2', t_g3 - 0.6),
               ('g3', t_g4 - 0.6), ('g4', t_four - 0.4), ('verdict', t_twist - 0.4), ('twist', t_look - 0.4),
               ('internet', t_real - 0.4), ('realistic', t_reg - 0.4), ('regular', t_what - 0.4), ('outro', DUR - 0.3)]
        for n, T in pts:
            ce.still(scenes, T, f'{HERE}/still_{n}.png', DUR + 2)
    else:
        ce.render(scenes, AUD, HERE + '/final.mp4', tail=2.0)
        print(ce.sync_report(c, HERE + '/sync.json'))
