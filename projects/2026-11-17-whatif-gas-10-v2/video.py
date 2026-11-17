"""WHAT IF gas hit $10 a gallon? (v2) - fast skit style: Dana's own voice, mascot host, word-by-word captions, comment CTA."""
import sys, os, json, math
HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.join(HERE, '..', '..'))
import chartography_engine as ce
ce.use_canvas('short')
import whatif_kit as k
from chartography_engine import F, text, prog, ease, mix, chrome, pill, MINT, AMBER, CREAM, MUTED, PANEL, CORAL, BG, SLATE
W, H = ce.W, ce.H
AUD = HERE + '/vo.mp3'; DUR = ce.duration(AUD)
WORDS = json.load(open(HERE + '/words.json'))
c = ce.Cues(WORDS, DUR)
SPK = json.load(open(HERE + '/speakers.json'))

SEGMENTS = [
    ('dana', 'A hundred and fifty dollars?! To fill up my car?'),
    ('narr', "Welcome to ten-dollar gas. Today, the US average is about three dollars and seventy-eight cents. So how do we get from here... to there? "
             "Week one. Six dollars. Dana's fifteen-gallon fill-up jumps from fifty-seven dollars to ninety. That's already past the all-time record: five dollars and one cent. "
             "Month two. Eight dollars. Trucks haul more than eleven billion tons of freight a year. So groceries start climbing too. "
             "Month three. Ten dollars. For an average driver, that's about thirty-four hundred extra dollars a year. "
             "Winners? Electric cars, remote workers, and oil producers. Losers? Long commutes and delivery drivers."),
    ('dana', 'Okay... so what do I cut first?'),
    ('narr', 'Tell Dana in the comments. And drop your next what-if. The top comment becomes our next video.'),
]
CW = k.caption_words(SEGMENTS, WORDS, DUR)
CHUNKS = k.caption_chunks(CW, 3)
KEYS = {'hundred', 'fifty', 'ten', 'dollar', 'dollars', 'six', 'eight', 'ninety', 'seventy', 'record', 'billion', 'thirty', 'four', 'extra',
        'winners', 'losers', 'comments', 'top', 'comment', 'gas'}
SPEAKERS = {'dana': ('DANA', CORAL), 'narr': (None, MINT)}

t_n1 = SPK['n1'][0]; t_d2 = SPK['d2'][0]; t_n2 = SPK['n2'][0]
t_today = c.at('to day the u s average')
t_here = c.at('so how do we get from here')
t_there = c.at('to there', after=t_here)
t_w1 = c.at('weak one six dollars')
t_57 = c.at('jumps from fifty seven dollars')
t_90 = c.at('to ninety', after=t_57)
t_rec = c.at("that's already past the all time record")
t_501 = c.at('five dollars and one cent')
t_m2 = c.at('month two eight dollars')
t_trucks = c.at('trucks haul more than eleven billion')
t_groc = c.at('so grocery start climbing')
t_m3 = c.at('month three ten dollars')
t_avg = c.at('for an average driver')
t_3400 = c.at('about thirty four hundred extra')
t_win = c.at('winners')
t_ev = c.at('electric cars')
t_remote = c.at('remote workers')
t_oil = c.at('and oil producers')
t_lose = c.at('losers')
t_long = c.at('long commutes')
t_deliv = c.at('delivery drivers')
t_tell = c.at('tell dana in the comments')
t_drop = c.at('and drop your next')
t_top = c.at('the top comment becomes')


def gas_price(T):
    stages = [(t_today, 3.78), (t_w1 + 0.2, 6.00), (t_m2 + 0.2, 8.00), (t_m3 + 0.2, 10.00)]
    v = stages[0][1]
    for i in range(1, len(stages)):
        p = ease(prog(T, stages[i][0], 1.0))
        if p > 0:
            v = stages[i - 1][1] + (stages[i][1] - stages[i - 1][1]) * p
    return v


def hud(T, d, label):
    pill(d, 170, 200, label, 1.0, color=BG, fill=AMBER, font=F('sansb', 40))
    v = gas_price(T)
    x0, y0 = W - 400, 140
    d.rounded_rectangle([x0, y0, x0 + 330, y0 + 140], radius=22, fill=(10, 16, 28), outline=(70, 86, 110), width=3)
    text(d, (x0 + 28, y0 + 20), 'US GAS / GALLON', F('sansb', 22), MUTED, 1, base=(10, 16, 28), rise=0)
    text(d, (x0 + 28, y0 + 52), f'${v:,.2f}', F('sansb', 70), CORAL if v > 5.02 else MINT, 1, base=(10, 16, 28), rise=0)


def overlay(T, img, d, label=None, host=True, src=None):
    if label:
        hud(T, d, label)
    if host:
        k.host(img, T, start=0.4)
    chrome(img, d, src)
    k.captions(d, T, CHUNKS, y=1440, keywords=KEYS, speaker_colors=SPEAKERS)


def big_card(d, y, top, big, bottom, a, big_col=AMBER, w=860):
    if a <= 0.01:
        return
    x0 = (W - w) / 2
    d.rounded_rectangle([x0, y, x0 + w, y + 330], radius=30, fill=mix((250, 247, 238), a))
    text(d, (W / 2, y + 50), top, F('sansb', 34), (90, 96, 110), a, anchor='mm', base=(250, 247, 238), rise=0)
    text(d, (W / 2, y + 160), big, F('serifb', 140), big_col, a, anchor='mm', base=(250, 247, 238), rise=0)
    text(d, (W / 2, y + 270), bottom, F('sansm', 34), (70, 76, 90), a, anchor='mm', base=(250, 247, 238), rise=0)


# ---------------- scenes ----------------
def s_shock(T, img, d):
    gy = k.station(d, T, '$10.00')
    k.car(d, 90, gy, 380, k.CAR_RED)
    tot = 150.0 * ease(prog(T, 0.0, 1.3))
    k.pump(d, 520, gy, '$10.00/gal', f'${tot:,.2f}', hl=tot > 149)
    k.person(d, 800, gy, 420, T=T, arm_up=1.0)
    k.bubble(d, 520, 840, '$150?!', prog(T, 0.25, 0.2), font=F('sansb', 80), side='right')
    a = prog(T, 0.0, 0.2)
    d.rectangle([40, 150, 40 + 230, 220], fill=mix((210, 40, 40), a))
    text(d, (155, 185), 'BREAKING', F('sansb', 40), k.WHITE, a, anchor='mm', base=(210, 40, 40), rise=0)
    d.rectangle([270, 150, 460, 220], fill=mix(AMBER, a))
    text(d, (365, 185), 'WHAT IF', F('sansb', 40), (30, 30, 30), a, anchor='mm', base=AMBER, rise=0)
    d.rectangle([40, 220, W - 40, 350], fill=mix(k.WHITE, a))
    text(d, (70, 285), 'GAS = $10 A GALLON', F('sansb', 84), (20, 24, 32), a, anchor='lm', base=k.WHITE, rise=0)
    overlay(T, img, d, None, host=False)


def s_road(T, img, d):
    gy = k.station(d, T, '$3.78')
    k.car(d, 90, gy, 380, k.CAR_RED)
    k.pump(d, 520, gy, '$3.78/gal', '')
    k.person(d, 800, gy, 420, T=T)
    # here -> there progress bar
    a = prog(T, t_here, 0.3)
    if a > 0:
        x0, x1, y = 90, 560, 340
        d.rounded_rectangle([x0, y - 14, x1, y + 14], radius=14, fill=mix((60, 74, 98), a))
        p = ease(prog(T, t_there, 1.2))
        d.rounded_rectangle([x0, y - 14, x0 + (x1 - x0) * max(0.03, p), y + 14], radius=14, fill=mix(CORAL, a))
        text(d, (x0, y + 56), 'HERE $3.78', F('sansb', 38), MINT, a, anchor='lm', rise=0)
        text(d, (x1, y + 56), 'THERE $10', F('sansb', 38), CORAL, prog(T, t_there, 0.3), anchor='rm', rise=0)
    overlay(T, img, d, 'TODAY', src='AAA national average, Nov 17, 2026')


def s_week1(T, img, d):
    gy = k.station(d, T, '$6.00')
    k.car(d, 90, gy, 380, k.CAR_RED)
    tot = 56.7 * ease(prog(T, t_57, 1.0)) if T < t_90 else 90.0
    k.pump(d, 520, gy, '$6.00/gal', f'${tot:,.2f}', hl=T >= t_90)
    k.person(d, 800, gy, 420, T=T, arm_up=1.0 if T >= t_90 else 0.0)
    ar = prog(T, t_rec, 0.3)
    big_card(d, 330, 'ALREADY PAST THE ALL-TIME RECORD', '$5.01', 'US average, June 2022 (AAA)', ar)
    if ar <= 0:
        big_card(d, 330, 'ONE 15-GALLON FILL-UP', '$57 -> $90', 'at $3.78 vs $6 a gallon', prog(T, t_57, 0.3), big_col=CORAL)
    overlay(T, img, d, 'WEEK 1', src='AAA (June 13, 2022; Nov 17, 2026); 15-gallon tank = illustration')


def s_month2(T, img, d):
    k.grad_sky(d, 0, 1000)
    k.ground(d, 1000, T)
    tx = -380 + (W + 380) * prog(T, t_m2 - 0.2, 3.6)
    k.truck(d, tx, 1110)
    big_card(d, 330, 'TRUCKS HAULED IN 2024', '11.27B tons', 'of US freight (ATA)', prog(T, t_trucks, 0.3), big_col=CORAL)
    a = prog(T, t_groc - 0.3, 0.3)
    if a > 0:
        k.shelf(d, T, 90, 700, W - 180, t_groc)
    overlay(T, img, d, 'MONTH 2', src='ATA American Trucking Trends (2024 data)')


def s_month3(T, img, d):
    k.grad_sky(d)
    big_card(d, 360, 'ONE AVERAGE DRIVER, ONE YEAR', '+$3,400', 'extra for gas at $10 vs $3.78', prog(T, t_3400 - 0.2, 0.3), big_col=CORAL)
    a = prog(T, t_avg, 0.3)
    text(d, (W / 2, 800), '13,735 miles a year  ·  25 mpg', F('sansb', 44), CREAM, a, anchor='mm')
    text(d, (W / 2, 870), 'about 549 gallons (Chartography illustration)', F('sansm', 34), MUTED, a, anchor='mm')
    k.ground(d, 1150, T)
    k.car(d, 160 + 500 * prog(T, t_m3, 6.0), 1150, 340, k.CAR_BLUE)
    overlay(T, img, d, 'MONTH 3', src='FHWA Our Nation\'s Highways 2026 (2024 data); AAA Nov 17, 2026')


def s_split(T, img, d):
    k.grad_sky(d)
    G, R = (18, 52, 52), (60, 30, 34)
    d.rounded_rectangle([50, 330, W - 50, 800], radius=28, fill=G)
    text(d, (90, 370), 'WINNERS', F('sansb', 52), MINT, prog(T, t_win), base=G, rise=0)
    for tt, draw in [(t_ev, lambda a: (k.car(d, 80, 730 + (1 - a) * 40, 290, k.CAR_GREEN, ev=True), text(d, (225, 770), 'Electric cars', F('sansb', 32), CREAM, a, anchor='mm', base=G, rise=0))),
                     (t_remote, lambda a: (k.laptop_house(d, W / 2 + 10, 730 + (1 - a) * 40), text(d, (W / 2 + 10, 770), 'Remote workers', F('sansb', 32), CREAM, a, anchor='mm', base=G, rise=0))),
                     (t_oil, lambda a: (k.derrick(d, W - 210, 730 + (1 - a) * 40, 0.85), text(d, (W - 210, 770), 'Oil producers', F('sansb', 32), CREAM, a, anchor='mm', base=G, rise=0)))]:
        if T >= tt - 0.05:
            draw(prog(T, tt, 0.3))
    d.rounded_rectangle([50, 830, W - 50, 1300], radius=28, fill=R)
    text(d, (90, 870), 'LOSERS', F('sansb', 52), CORAL, prog(T, t_lose), base=R, rise=0)
    if T >= t_long - 0.05:
        a = prog(T, t_long, 0.3)
        k.car(d, 100, 1230 + (1 - a) * 40, 280, k.CAR_RED)
        text(d, (240, 1270), 'Long commutes', F('sansb', 32), CREAM, a, anchor='mm', base=R, rise=0)
    if T >= t_deliv - 0.05:
        a = prog(T, t_deliv, 0.3)
        k.van(d, W / 2 + 40, 1230 + (1 - a) * 40, 300)
        text(d, (W / 2 + 190, 1270), 'Delivery drivers', F('sansb', 32), CREAM, a, anchor='mm', base=R, rise=0)
    overlay(T, img, d, 'MONTH 3', host=False)


def s_dana(T, img, d):
    k.grad_sky(d)
    k.ground(d, 1300, T, road=False)
    k.person(d, 360, 1300, 640, T=T)
    k.bubble(d, 640, 520, 'So what do I cut first?', prog(T, t_d2, 0.25), font=F('sansb', 56))
    for i, s in enumerate(['Road trips?', 'Eating out?', 'The car itself?']):
        a = prog(T, t_d2 + 0.7 + i * 0.5, 0.3)
        pill(d, 780, 700 + i * 110, s, a, color=CREAM, fill=PANEL, font=F('sansb', 40))
    overlay(T, img, d, None)


def s_cta(T, img, d):
    k.grad_sky(d)
    text(d, (W / 2, 330), 'COMMENT BELOW', F('sansb', 58), MINT, prog(T, t_tell - 0.2), anchor='mm')
    a1 = prog(T, t_tell, 0.3)
    d.rounded_rectangle([90, 400, W - 90, 560], radius=26, fill=mix(PANEL, a1))
    text(d, (W / 2, 480), 'What would Dana cut first?', F('serifb', 62), CREAM, a1, anchor='mm', base=PANEL)
    a2 = prog(T, t_drop, 0.3)
    d.rounded_rectangle([90, 590, W - 90, 800], radius=26, fill=mix((250, 247, 238), a2))
    text(d, (W / 2, 650), 'Your next WHAT IF', F('sansb', 52), (30, 34, 44), a2, anchor='mm', base=(250, 247, 238))
    text(d, (W / 2, 735), 'top comment = our next video', F('hand', 64), CORAL, prog(T, t_top, 0.3), anchor='mm', base=(250, 247, 238))
    ce.mascot(img, (W / 2 - 200, 840), 320, T=T, start=t_tell + 0.2)
    pill(d, W / 2, 1250, 'FOLLOW for the next WHAT IF', prog(T, t_top + 1.0), color=BG, fill=AMBER, font=F('sansb', 46))
    overlay(T, img, d, None, host=False)


scenes = [ce.Scene(0, s_shock), ce.Scene(t_n1 - 0.1, s_road), ce.Scene(t_w1 - 0.2, s_week1), ce.Scene(t_m2 - 0.2, s_month2),
          ce.Scene(t_m3 - 0.2, s_month3), ce.Scene(t_win - 0.2, s_split), ce.Scene(t_d2 - 0.2, s_dana), ce.Scene(t_n2 - 0.1, s_cta)]

if __name__ == '__main__':
    if sys.argv[1:] == ['stills']:
        pts = [('shock', 2.0), ('road', t_w1 - 0.5), ('week1', t_501 + 0.4), ('m2', t_m3 - 0.5), ('m3', t_win - 0.5),
               ('split', t_d2 - 0.4), ('dana', t_n2 - 0.3), ('cta', DUR + 0.8)]
        for n, T in pts:
            ce.still(scenes, T, f'{HERE}/still_{n}.png', DUR + 1.8)
    else:
        ce.render(scenes, AUD, HERE + '/final.mp4', tail=1.8)
        print(ce.sync_report(c, HERE + '/sync.json'))
