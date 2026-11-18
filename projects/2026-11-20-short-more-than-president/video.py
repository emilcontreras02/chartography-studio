"""Short (Nov 20, 2026): 'More than the President' - CUT from the Nov 20 Top 10 government pay long-form (0 credits).
New vertical layouts: hook card, two stacked pay slips, coach tower, 23-paycheck stack, punchline + end card."""
import sys, os, json, math
HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.join(HERE, '..', '..'))
import chartography_engine as ce
ce.use_canvas('short')
import whatif_kit as k
from chartography_engine import F, text, prog, ease, mix, chrome, pill, MINT, AMBER, CREAM, MUTED, PANEL, CORAL, BG, SLATE
W, H = ce.W, ce.H
k.W, k.H = W, H
AUD = HERE + '/vo_short.mp3'; DUR = ce.duration(AUD)
WORDS = json.load(open(HERE + '/words.json'))
c = ce.Cues(WORDS, DUR)
SEGS = json.load(open(HERE + '/segments.json'))
CW = k.caption_words([(s[0], s[1]) for s in SEGS], WORDS, DUR)
CHUNKS = k.caption_chunks(CW, 3)
KEYS = {'president', 'million', 'thousand', 'coach', 'times', 'fed'}
SPEAKERS = {'hero': (None, CORAL), 'narr': (None, MINT)}
CARD = (22, 38, 62)
GROUND = 1330
S_FED = 'Federal Reserve Annual Report 2015, Table 13 (Dec 31, 2015); 3 U.S.C. 102'
S_COACH = 'GOBankingRates via OpenTheBooks (2018 pay, pub. Aug 27, 2019); 3 U.S.C. 102'

t_that = c.at("that's what the president")
t_more = c.at('more than the president')
t_bigger = c.at('and it gets bigger')
t_ky = c.at('in kentucky')
t_93 = c.at('nine point three million')
t_al = c.at('in alabama')
t_83 = c.at('eight point three million')
t_23 = c.at('about twenty three times')
t_hero = c.at('twenty three times the coach')
t_punch = c.at('the most powerful job')
t_best = c.at("isn't the best paid")


def world(d, T):
    k.grad_sky(d, 0, H)
    k.ground(d, GROUND, T, road=False)


def finish(T, img, d, src):
    chrome(img, d, src)
    k.captions(d, T, CHUNKS, y=1440, keywords=KEYS, speaker_colors=SPEAKERS, size=72)


def money(v):
    return f'${v:,.0f}'


def s_hook(T, img, d):
    world(d, T)
    # rank-style badge + payoff number from frame 0
    d.rounded_rectangle([90, 270, 990, 760], radius=36, fill=CARD)
    pill(d, 540, 330, 'MORE THAN THE PRESIDENT?', 1.0, color=BG, fill=AMBER, font=F('sansb', 46))
    text(d, (540, 470), '$466,500', F('serifb', 165), MINT, 1.0, anchor='mm', base=CARD, rise=0)
    text(d, (540, 590), 'a year', F('sansm', 44), CREAM, 1.0, anchor='mm', base=CARD, rise=0)
    a = prog(T, t_that, 0.3)
    text(d, (540, 680), 'the head of the New York Fed (2015)', F('sansb', 40), AMBER, a, anchor='mm', base=CARD)
    k.actor(img, d, T, 540, GROUND, 520, pose='shock', face='shock', mood='shock', mood_t=0.2)
    finish(T, img, d, S_FED)


def slip(d, y, title, sub, amount, col, a, g):
    if a <= 0.01:
        return
    d.rounded_rectangle([90, y, 990, y + 260], radius=28, fill=mix(CARD, a))
    text(d, (130, y + 50), title, F('sansb', 44), CREAM, a, anchor='lm', base=CARD, rise=0)
    text(d, (130, y + 100), sub, F('sansm', 34), MUTED, a, anchor='lm', base=CARD, rise=0)
    text(d, (130, y + 190), money(amount * g) if g < 1 else money(amount), F('serifb', 100), col, a, anchor='lm', base=CARD, rise=0)


def s_compare(T, img, d):
    world(d, T)
    slip(d, 280, 'NY FED PRESIDENT', 'pay in 2015', 466500, AMBER, 1.0, 1.0)
    ap = prog(T, t_more, 0.3)
    slip(d, 600, 'THE PRESIDENT', 'U.S. salary, since 2001', 400000, MINT, ap, ease(prog(T, t_more + 0.2, 0.8)))
    ag = prog(T, t_more + 1.2, 0.3)
    if ag > 0:
        pill(d, 540, 925, '+$66,500 more', ag, color=(255, 255, 255), fill=CORAL, font=F('sansb', 50))
    k.actor(img, d, T, 880, GROUND, 340, pose='think', face='worry', mood='think', mood_t=t_more)
    finish(T, img, d, S_FED)


def s_tower(T, img, d):
    world(d, T)
    a = prog(T, t_bigger - 0.1, 0.3)
    text(d, (540, 290), 'IT GETS BIGGER', F('serifb', 80), AMBER, a, anchor='mm')
    text(d, (540, 370), "Kentucky's highest-paid public employee, 2018:", F('sansb', 36), CREAM, prog(T, t_ky - 0.3, 0.3), anchor='mm')
    text(d, (540, 425), 'a state-university basketball coach', F('hand', 56), MINT, prog(T, t_ky + 1.0, 0.3), anchor='mm')
    # tower vs tiny President bar (same scale)
    base_y, mh, vmax = 1290, 720, 9276643
    gp = ease(prog(T, t_ky, 0.6))
    hp = max(4, mh * 400000 / vmax * gp)
    d.rounded_rectangle([170, base_y - hp, 390, base_y], radius=10, fill=MINT)
    text(d, (280, base_y - hp - 40), '$400,000', F('serifb', 44), CREAM, gp, anchor='mm', rise=0)
    text(d, (280, base_y - hp - 90), 'President', F('sansb', 34), MUTED, gp, anchor='mm', rise=0)
    g = ease(prog(T, t_93 - 0.3, 1.2))
    hc = max(4, mh * g)
    if T >= t_93 - 0.4:
        d.rounded_rectangle([520, base_y - hc, 820, base_y], radius=12, fill=CORAL)
        text(d, (670, base_y - hc - 50), f'${9.28 * g:.2f} million', F('serifb', 58), CREAM, 1.0, anchor='mm', rise=0)
    aa = prog(T, t_al, 0.3)
    if aa > 0:
        d.rounded_rectangle([90, 560, 480, 760], radius=22, fill=mix(CARD, aa))
        text(d, (285, 605), 'ALABAMA, 2018', F('sansb', 32), MUTED, aa, anchor='mm', base=CARD, rise=0)
        text(d, (285, 650), 'football coach', F('hand', 46), AMBER, aa, anchor='mm', base=CARD, rise=0)
        text(d, (285, 715), 'about $8.3M', F('serifb', 54), CREAM, prog(T, t_83, 0.3), anchor='mm', base=CARD, rise=0)
    finish(T, img, d, S_COACH)


def s_stack(T, img, d):
    world(d, T)
    a = prog(T, t_23 - 0.2, 0.3)
    text(d, (540, 300), '23 x', F('serifb', 170), CORAL, a, anchor='mm')
    text(d, (540, 420), "the President's salary", F('sansb', 50), CREAM, a, anchor='mm')
    # 23 paychecks dealt into a 5-wide grid
    cols, w, h, gx, gy = 5, 170, 78, 20, 18
    x0 = (W - (cols * w + (cols - 1) * gx)) / 2
    for i in range(23):
        ai = prog(T, t_23 + 0.1 + i * 0.07, 0.2)
        if ai <= 0:
            continue
        cx = x0 + (i % cols) * (w + gx); cy = 500 + (i // cols) * (h + gy)
        d.rounded_rectangle([cx, cy, cx + w, cy + h], radius=10, fill=mix((63, 190, 140), ai), outline=mix((20, 90, 60), ai), width=4)
        text(d, (cx + w / 2, cy + h / 2), '$400K', F('sansb', 34), (12, 40, 30), ai, anchor='mm', base=(63, 190, 140), rise=0)
    ah = prog(T, t_hero, 0.2)
    if ah > 0:
        k.actor(img, d, T, 910, GROUND, 360, pose='shock', face='shock' if T > c.at('the coach out earns') else 'talk', mood='shock', mood_t=t_hero)
        k.bubble(d, 420, 1170, 'The coach out-earns the President?', ah, font=F('sansb', 36), tail_x=700)
    text(d, (440, 1030), '= one coach (Kentucky, 2018)', F('hand', 56), AMBER, prog(T, t_23 + 1.9, 0.3), anchor='mm')
    finish(T, img, d, S_COACH)


def s_end(T, img, d):
    world(d, T)
    a = prog(T, t_punch, 0.3)
    text(d, (540, 340), 'The most powerful job', F('serifb', 76), CREAM, a, anchor='mm')
    text(d, (540, 440), "isn't the best-paid one.", F('serifb', 76), AMBER, prog(T, t_best, 0.3), anchor='mm')
    ae = prog(T, DUR - 1.2, 0.3)
    if ae > 0:
        d.rounded_rectangle([140, 540, 940, 760], radius=30, fill=mix(MINT, ae))
        text(d, (540, 610), 'Full Top 10', F('serifb', 70), BG, ae, anchor='mm', base=MINT, rise=0)
        text(d, (540, 695), 'on the channel', F('sansb', 46), BG, ae, anchor='mm', base=MINT, rise=0)
        ce.arrow(d, (900, 1060), (900, 790), ae, color=AMBER, width=10)
    text(d, (540, 870), 'So who made $466,500?', F('hand', 60), AMBER, prog(T, DUR + 0.2, 0.3), anchor='mm')
    k.actor(img, d, T, 600, GROUND, 400, pose='point' if T > DUR - 1.2 else 'shrug', face='happy', mood='happy', mood_t=t_punch)
    finish(T, img, d, None)


scenes = [ce.Scene(0, s_hook), ce.Scene(t_more - 0.15, s_compare), ce.Scene(t_bigger - 0.15, s_tower),
          ce.Scene(t_23 - 0.15, s_stack), ce.Scene(t_punch - 0.15, s_end)]

if __name__ == '__main__':
    if sys.argv[1:] == ['stills']:
        for n, T in [('hook', 0.3), ('hook2', t_more - 0.3), ('compare', t_bigger - 0.3), ('tower', t_83 + 0.6), ('stack', t_hero + 2.0), ('end', DUR + 1.0)]:
            ce.still(scenes, T, f'{HERE}/still_{n}.png', DUR + 1.5)
        print('ok')
    else:
        ce.render(scenes, AUD, HERE + '/final.mp4', tail=1.5)
        print(ce.sync_report(c, HERE + '/sync.json'))
