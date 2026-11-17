import sys, os, json, math
HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.join(HERE, '..', '..'))
import chartography_engine as ce
from chartography_engine import (F, text, text_block, fit_font, prog, ease, clamp, mix, card, counter, hand_underline,
                                 chrome, eyebrow, mascot, pill, pill_row, arrow, progress_bar, person_icon,
                                 MINT, AMBER, CREAM, MUTED, PANEL, CORAL, SLATE, BG, EMPTY)
ce.use_canvas('long'); W, H = ce.W, ce.H
AUD = HERE + '/vo.mp3'; DUR = ce.duration(AUD)
c = ce.Cues(json.load(open(HERE + '/words.json')), DUR)

SRC = 'Microsoft Research "Working with AI" (Oct 2026), Table L.4; jobs: BLS 2023. Score = AI applicability, not job loss'
SRC_LOW = 'Microsoft Research, "Working with AI" (v7 Oct 23, 2026), Table L.5. Jobs: BLS 2023'

# ---------- cues (script order) ----------
t_conv = c.at('about 200,000 real conversations')
t_hundreds = c.at('gave hundreds of jobs a score')
t_top = c.at('topscore is point four nine')
t_factory = c.at("it doesn't belong to a factory worker")
t_here = c.at('here are the ten highest')
t_n10 = c.at('number ten mathematicians')
t_s10 = c.at('score point three nine')
t_2220 = c.at('only 2,220 americans')
t_muscle = c.at("this list isn't about muscles")
t_words = c.at("it's about words numbers and information")
t_note = c.at('quick note on the score')
t_copilot = c.at('looked at u s copylot chats')
t_one = c.at('a score of one would mean')
t_zero = c.at('zero means nothing')
t_tasks = c.at('it measures tasks not lay offs')
t_miss = c.at('and just missing the cut')
t_between = c.at('all of them score between')
t_keep = c.at('keep that in mind')
t_n9 = c.at('number nine political scientists')
t_5580 = c.at('there are 5,580 of them')
t_much = c.at('much of the job is reading')
t_bring9 = c.at('exactly the kind of work people bring')
t_n8 = c.at('number eight telemarkeers')
t_81 = c.at("that's 81,580 americans")
t_script = c.at('scripted calls the same questions')
t_chatbot = c.at("sounds like a chat bot's job description")
t_n7 = c.at('number seven is the biggest one')
t_286 = c.at('2.86 million americans work as customer service')
t_twice = c.at('more than twice as many workers')
t_139 = c.at('the other nine add up to about')
t_s7 = c.at('the score here is point for one')
t_answer = c.at('answering questions looking up an account')
t_thing = c.at("so here's the thing about number seven")
t_crowd = c.at("it's just the biggest crowd")
t_n6 = c.at('number six broadcast announcers')
t_25 = c.at("that's 25,070 people")
t_songs = c.at('writing what to say between songs')
t_page = c.at('a lot of that job is words on a page')
t_n5 = c.at('number five is the odd one out')
t_cnc = c.at('see and see tool programers at point four two')
t_code = c.at('they write the code that tells')
t_floor = c.at('one job connected to the factory floor')
t_closer = c.at('but look closer')
t_desk5 = c.at("it's the programing part")
t_28 = c.at('28,030 americans do it')
t_n4 = c.at('number four sales representatives')
t_114 = c.at('this one is huge')
t_emails = c.at('emiles pitches follow ups')
t_share = c.at("that's a big share of a sales person's day")
t_n3 = c.at('number three writers and authors')
t_49 = c.at('49,450 americans')
t_machine = c.at('no big surprise that a machine')
t_wait = c.at('but wait')
t_n2 = c.at('number two historians')
t_s2 = c.at('score point four six')
t_3040 = c.at('there are only 3,040 historians')
t_research = c.at('their work is research')
t_hand = c.at("it turns out that's exactly the kind of work")
t_n1 = c.at('and number one')
t_s1 = c.at('the job a i can already do the most of')
t_515 = c.at("that's 51,560 americans")
t_lm = c.at('pretty much what a language model')
t_hat = c.at('nobody wears a hard hat')
t_rem = c.at('remember number two')
t_all = c.at('all 3,040 of them')
t_top2 = c.at("so the top of the list isn't a factory")
t_oldest = c.at('two of the oldest desk jobs')
t_twist = c.at("now here's the twist")
t_other = c.at('look at the other end')
t_dredge = c.at('the jobs with a score of zero')
t_bridge = c.at('bridge and lock tenders')
t_orderlies = c.at('orderlies', after=t_bridge)
t_pile = c.at('pile driver operators')
t_sanders = c.at('floor sanders and finishers')
t_water = c.at('people who run water treatment plants')
t_hands = c.at('every single one is hands on work')
t_robots = c.at('we pictured robots coming')
t_desk = c.at('the jobs a i chatts touch the most are done at a desk')
t_panic = c.at('desk but before', lead=-0.55)
t_mistake = c.at('they say it would be a mistake')
t_help = c.at('a high score means a i can help')
t_pink = c.at('it is not a pink slip')
t_data = c.at('and remember where the data comes from')
t_recap = c.at("so here's the full top ten")
t_r = [None] * 11
t_r[10] = c.at('ten mathematicians')
t_r[9] = c.at('nine political scientists')
t_r[8] = c.at('eight telemarkeers')
t_r[7] = c.at('seven customers service')
t_r[6] = c.at('six announcers and radio de jas')
t_r[5] = c.at('five c and c programers')
t_r[4] = c.at('four sales reps')
t_r[3] = c.at('three writers')
t_r[2] = c.at('two historians')
t_r[1] = c.at('and number one interpreters and translators')
t_almost = c.at('almost every one of them is about words')
t_board = c.at("the biggest number on the whole board isn't")
t_csr = c.at("it's the 2.86 million people in customer service")
t_which = c.at('which one surprised you the most')
t_sub = c.at('subscribe to tchertography')
t_friday = c.at('on friday the 10 highest paid jobs')

# ---------- data (Table L.4, VERIFIED 2026-11-16) ----------
JOBS = {10: ('Mathematicians', 0.386, 2220), 9: ('Political scientists', 0.391, 5580), 8: ('Telemarketers', 0.404, 81580),
        7: ('Customer service reps', 0.408, 2858710), 6: ('Announcers & radio DJs', 0.409, 25070),
        5: ('CNC tool programmers', 0.419, 28030), 4: ('Sales reps (services)', 0.449, 1142020),
        3: ('Writers & authors', 0.454, 49450), 2: ('Historians', 0.462, 3040), 1: ('Interpreters & translators', 0.492, 51560)}
REVEAL = {10: t_n10, 9: t_n9, 8: t_n8, 7: t_n7, 6: t_n6, 5: t_n5, 4: t_n4, 3: t_n3, 2: t_n2, 1: t_s1}

LX0, LX1, LY0, LSTEP, LH = 60, 540, 112, 87, 76
CX0 = 620  # content area starts here when the ladder is on screen


def ladder(T, d, cur=None, appear=None):
    """Persistent rank ladder: #1 at the top, #10 at the bottom; fills in as ranks are revealed."""
    for r in range(1, 11):
        y = LY0 + (r - 1) * LSTEP
        a = 1.0 if appear is None else prog(T, appear + (10 - r) * 0.12, 0.4)
        if a <= 0.01:
            continue
        rev = T >= REVEAL[r]
        on = cur == r
        fill = (40, 66, 98) if on else (PANEL if rev else (20, 35, 56))
        d.rounded_rectangle([LX0, y, LX1, y + LH], radius=16, fill=mix(fill, a), outline=mix(MINT, a) if on else None, width=4)
        text(d, (LX0 + 22, y + LH / 2), f'#{r}', F('sansb', 32), AMBER if (rev or on) else MUTED, a, anchor='lm', rise=0, base=fill)
        if rev:
            ra = min(a, prog(T, REVEAL[r], 0.4))
            name, sc, _ = JOBS[r]
            text(d, (LX0 + 98, y + LH / 2), name, fit_font(d, name, 'sansm', 28, 255), CREAM, ra, anchor='lm', rise=0, base=fill)
            text(d, (LX1 - 20, y + LH / 2), f'{sc:.3f}', F('sansb', 28), MINT, ra, anchor='rm', rise=0, base=fill)
        else:
            text(d, (LX0 + 98, y + LH / 2), '?', F('sansb', 32), mix(MUTED, 0.7), a, anchor='lm', rise=0, base=fill)


def rank_header(T, d, r, t0, y=120):
    name, sc, n = JOBS[r]
    a = prog(T, t0, 0.4)
    text(d, (CX0, y), f'#{r}', F('serifb', 170), AMBER, a, rise=30)
    text(d, (CX0 + (250 if r < 10 else 340), y + 40), name, fit_font(d, name, 'serifb', 84, 1180 - (250 if r < 10 else 340)), CREAM, prog(T, t0 + 0.3, 0.4))


def score_chip(T, d, r, t0, xy):
    a = prog(T, t0, 0.4)
    pill(d, xy[0], xy[1], f'AI applicability score: {JOBS[r][1]:.3f}', a, color=BG, fill=MINT, font=F('sansb', 34))


def hard_hat(d, cx, cy, s, col, a=1.0):
    if a <= 0.01:
        return
    colr = mix(col, a)
    d.pieslice([cx - s * 0.5, cy - s * 0.45, cx + s * 0.5, cy + s * 0.55], 180, 360, fill=colr)
    d.rounded_rectangle([cx - s * 0.7, cy + s * 0.02, cx + s * 0.7, cy + s * 0.16], radius=8, fill=colr)
    d.rectangle([cx - s * 0.06, cy - s * 0.45, cx + s * 0.06, cy], fill=mix(BG, a))


def cross(d, cx, cy, s, p, col=CORAL):
    if p <= 0:
        return
    d.line([(cx - s, cy - s), (cx - s + 2 * s * min(1, p * 2), cy - s + 2 * s * min(1, p * 2))], fill=col, width=14)
    if p > 0.5:
        q = (p - 0.5) * 2
        d.line([(cx + s, cy - s), (cx + s - 2 * s * q, cy - s + 2 * s * q)], fill=col, width=14)


def stamp(d, cxy, s, col, a, base=BG, size=56):
    if a <= 0.01:
        return
    cx, cy = cxy
    f = F('sansb', size)
    w = d.textlength(s, font=f) + 70
    h = size + 46
    sc = 1.25 - 0.25 * ease(a)
    d.rounded_rectangle([cx - w * sc / 2, cy - h * sc / 2, cx + w * sc / 2, cy + h * sc / 2], radius=14, outline=mix(col, a, base), width=8)
    text(d, (cx, cy + 2), s, f, col, a, anchor='mm', base=base, rise=0)


def bubble(d, box, s, a, fill, col, font):
    if a <= 0.01:
        return
    x0, y0, x1, y1 = box
    off = (1 - a) * 20
    d.rounded_rectangle([x0, y0 + off, x1, y1 + off], radius=28, fill=mix(fill, a))
    text(d, ((x0 + x1) / 2, (y0 + y1) / 2 + off), s, font, col, a, anchor='mm', base=fill, rise=0)


# ---------- scenes ----------
def hook(T, img, d):
    eyebrow(d, 'MICROSOFT RESEARCH  -  "WORKING WITH AI"', prog(T, 0.0))
    counter(d, (500, 330), 200000, T, t_conv, dur=1.5, prefix='', font=F('serifb', 150), color=CREAM)
    text(d, (500, 440), 'real AI chats from Americans', F('sansm', 42), MUTED, prog(T, t_conv + 0.5), anchor='mm')
    pill(d, 500, 560, 'Every job gets a score: 0 to 1', prog(T, t_hundreds), color=AMBER, font=F('sansb', 40))
    a = prog(T, t_top - 0.1, 0.4)
    card(d, (1000, 200, 1760, 760), a)
    text(d, (1380, 280), 'TOP SCORE', F('sansb', 38), AMBER, a, anchor='mm', base=PANEL)
    text(d, (1380, 450), '0.49', F('serifb', 230), MINT, prog(T, t_top + 0.4, 0.4), anchor='mm', base=PANEL)
    text(d, (1380, 600), 'out of 1', F('sansm', 46), MUTED, prog(T, t_top + 1.4, 0.4), anchor='mm', base=PANEL)
    text(d, (1380, 690), 'Job #1 = ?', F('sansb', 44), CREAM, prog(T, t_top + 1.8, 0.4), anchor='mm', base=PANEL)
    ah = prog(T, t_factory, 0.4)
    hard_hat(d, 330, 820, 150, SLATE, ah)
    cross(d, 330, 820, 95, clamp((T - t_factory - 0.5) / 0.6))
    text(d, (470, 830), 'not a factory job', F('hand', 72), CORAL, prog(T, t_factory + 0.8), anchor='lm')
    mascot(img, (1230, 790), 200, T=T, start=0.8)
    chrome(img, d, SRC)


def intro(T, img, d):
    ladder(T, d, appear=t_here - 0.1)
    text(d, (CX0 + 40, 260), 'The 10 jobs AI', F('serifb', 110), CREAM, prog(T, t_here), rise=30)
    text(d, (CX0 + 40, 390), 'can help with most', F('serifb', 110), MINT, prog(T, t_here + 0.4), rise=30)
    text(d, (CX0 + 40, 560), 'counted down  10 > 1', F('sansb', 54), AMBER, prog(T, t_here + 1.0))
    text(d, (CX0 + 40, 700), 'Score = AI applicability, not job loss', F('sansm', 40), MUTED, prog(T, t_here + 1.4))
    chrome(img, d, SRC)


def s10(T, img, d):
    ladder(T, d, cur=10)
    rank_header(T, d, 10, t_n10)
    a = prog(T, t_s10, 0.4)
    card(d, (CX0, 340, 1820, 600), a)
    text(d, (CX0 + 50, 400), 'AI applicability score', F('sansm', 38), MUTED, a, base=PANEL)
    counter(d, (CX0 + 50, 470), 0.386, T, t_s10, dur=1.0, prefix='', decimals=3, font=F('serifb', 96), color=MINT, anchor='la')
    progress_bar(d, (CX0 + 470, 500, 1770, 540), 0.386 * ease((T - t_s10) / 1.0), a)
    text(d, (CX0 + 470, 560), '0', F('sans', 26), MUTED, a, base=PANEL, rise=0)
    text(d, (1770, 560), '1', F('sans', 26), MUTED, a, anchor='ra', base=PANEL, rise=0)
    counter(d, (CX0 + 50, 720), 2220, T, t_2220, dur=1.0, prefix='', suffix=' Americans', font=F('serifb', 76), color=CREAM, anchor='lm')
    text(d, (CX0 + 50, 790), 'have this job title', F('sansm', 36), MUTED, prog(T, t_2220 + 0.5), anchor='lm')
    text(d, (1330, 720), 'not muscles...', F('hand', 64), CORAL, prog(T, t_muscle), anchor='lm')
    pill_row(d, 900, ['words', 'numbers', 'information'], T, [t_words + 0.1, t_words + 0.5, t_words + 0.9],
             font=F('sansb', 40), colors=[AMBER] * 3, cx=CX0 + 600)
    chrome(img, d, SRC)


def explain(T, img, d):
    ladder(T, d)
    eyebrow(d, 'HOW THE SCORE WORKS', prog(T, t_note), xy=(CX0, 120))
    a = prog(T, t_copilot, 0.4)
    card(d, (CX0, 180, 1820, 400), a)
    text(d, (CX0 + 50, 240), 'about 200,000 US Copilot chats', F('serifb', 60), CREAM, a, base=PANEL)
    text(d, (CX0 + 50, 320), 'January to September 2024  -  which work tasks, and how well AI did', F('sansm', 34), MUTED, prog(T, t_copilot + 1.0), base=PANEL)
    ab = prog(T, t_one - 0.2, 0.4)
    x0, x1, y = CX0 + 80, 1740, 560
    if ab > 0:
        d.rounded_rectangle([x0, y - 18, x1, y + 18], radius=18, fill=mix(EMPTY, ab))
        p = ease((T - t_one) / 1.2)
        d.rounded_rectangle([x0, y - 18, x0 + max(36, (x1 - x0) * p), y + 18], radius=18, fill=mix(MINT, ab))
    text(d, (x1, 640), '1 = AI touches almost', F('sansb', 36), MINT, prog(T, t_one), anchor='ra')
    text(d, (x1, 685), 'everything the job does', F('sansb', 36), MINT, prog(T, t_one), anchor='ra')
    text(d, (x0, 640), '0 = nothing', F('sansb', 36), CORAL, prog(T, t_zero), anchor='la')
    stamp(d, (CX0 + 600, 860), 'TASKS, NOT LAYOFFS', AMBER, prog(T, t_tasks, 0.3))
    chrome(img, d, SRC)


def missed(T, img, d):
    ladder(T, d)
    eyebrow(d, 'JUST MISSED THE CUT  -  #11 TO #15', prog(T, t_miss), xy=(CX0, 120))
    rows = [('#11 Reporters & journalists', 0.383), ('#12 Passenger attendants', 0.376), ('#13 Technical writers', 0.373),
            ('#14 Concierges', 0.372), ('#15 Proofreaders', 0.369)]
    ce.hbars(d, T, rows, (1150, 200, 520, 120), t_miss + 0.6, stagger=0.9, value_fmt=lambda v: f'{v:.3f}',
             label_font=F('sansm', 32), value_font=F('sansb', 34), colors=[SLATE] * 5, vmax=0.5)
    pill(d, CX0 + 600, 860, 'all between 0.37 and 0.38', prog(T, t_between), color=AMBER, font=F('sansb', 38))
    text(d, (CX0 + 600, 950), 'almost all of them work with words', F('hand', 56), MINT, prog(T, t_keep + 1.5), anchor='mm')
    chrome(img, d, SRC)


def s9(T, img, d):
    ladder(T, d, cur=9)
    rank_header(T, d, 9, t_n9)
    score_chip(T, d, 9, t_n9 + 1.5, (CX0 + 330, 370))
    counter(d, (CX0 + 40, 520), 5580, T, t_5580, dur=1.0, prefix='', suffix=' in the US', font=F('serifb', 80), color=CREAM, anchor='lm')
    tasks = [('Reading', t_much + 0.6), ('Researching', t_much + 1.2), ('Writing up findings', t_much + 2.0)]
    for i, (s, t0) in enumerate(tasks):
        a = prog(T, t0, 0.4)
        y = 620 + i * 100
        card(d, (CX0 + 40, y, CX0 + 700, y + 80), a, radius=20)
        text(d, (CX0 + 80, y + 40), f'{i + 1}', F('sansb', 36), AMBER, a, anchor='lm', base=PANEL, rise=0)
        text(d, (CX0 + 140, y + 40), s, F('sansm', 40), CREAM, a, anchor='lm', base=PANEL, rise=0)
    arrow(d, (CX0 + 740, 760), (CX0 + 860, 760), prog(T, t_bring9), MINT, 8)
    text_block(d, (CX0 + 890, 700), 'what people ask AI chats for all day', F('hand', 58), 380, MINT, prog(T, t_bring9 + 0.4))
    chrome(img, d, SRC)


def s8(T, img, d):
    ladder(T, d, cur=8)
    rank_header(T, d, 8, t_n8)
    score_chip(T, d, 8, t_n8 + 1.6, (CX0 + 330, 370))
    counter(d, (CX0 + 40, 500), 81580, T, t_81, dur=1.0, prefix='', suffix=' Americans', font=F('serifb', 76), color=CREAM, anchor='lm')
    f = F('sansm', 36)
    bubble(d, (CX0 + 40, 590, CX0 + 620, 680), 'Do you have a minute?', prog(T, t_script), (40, 66, 98), CREAM, f)
    bubble(d, (CX0 + 560, 700, CX0 + 1180, 790), 'Not really.', prog(T, t_script + 0.8), EMPTY, MUTED, f)
    bubble(d, (CX0 + 40, 810, CX0 + 620, 900), 'Do you have a minute?', prog(T, t_script + 1.6), (40, 66, 98), CREAM, f)
    text(d, (CX0 + 700, 870), '(illustration)', F('sans', 26), MUTED, prog(T, t_script), rise=0)
    text(d, (CX0 + 620, 960), "a chatbot's job description?", F('hand', 62), AMBER, prog(T, t_chatbot), anchor='mm')
    chrome(img, d, SRC)


def s7(T, img, d):
    ladder(T, d, cur=7)
    rank_header(T, d, 7, t_n7)
    text(d, (CX0, 300), 'the biggest one on the list', F('hand', 56), AMBER, prog(T, t_n7 + 1.0))
    counter(d, (CX0 + 330, 470), 2.86, T, t_286, dur=1.2, prefix='', suffix=' million', decimals=2, font=F('serifb', 120), color=MINT)
    text(d, (CX0 + 330, 560), 'Americans work in customer service', F('sansm', 36), MUTED, prog(T, t_286 + 1.0), anchor='mm')
    # two bars: customer service vs the other nine combined
    by, mh = 940, 300
    for i, (lab, v, col, t0) in enumerate([('Customer service', 2858710, MINT, t_twice), ('Other nine combined', 1388550, SLATE, t_139)]):
        x = 1380 + i * 230
        p = ease((T - t0) / 1.0)
        h = mh * v / 2858710 * p
        if h > 2:
            d.rounded_rectangle([x, by - h, x + 170, by], radius=10, fill=col)
        text(d, (x + 85, by - h - 40), f'{v / 1e6:.2f}M', F('sansb', 36), CREAM, prog(T, t0 + 0.6), anchor='mm', rise=0)
        text(d, (x + 85, by + 30), lab, fit_font(d, lab, 'sansm', 26, 215), MUTED, prog(T, t0), anchor='mm', rise=0)
    stamp(d, (1610, 520), 'MORE THAN 2x', CORAL, prog(T, t_twice + 0.8, 0.3), size=40)
    score_chip(T, d, 7, t_s7, (CX0 + 330, 660))
    text(d, (CX0 + 20, 770), 'Not the highest score.', F('serifb', 50), CREAM, prog(T, t_thing + 2.2))
    text(d, (CX0 + 20, 850), 'Just the biggest crowd.', F('serifb', 50), AMBER, prog(T, t_crowd))
    chrome(img, d, SRC)


def s6(T, img, d):
    ladder(T, d, cur=6)
    rank_header(T, d, 6, t_n6)
    a = prog(T, t_n6 + 1.0, 0.4)
    if a > 0:
        d.rounded_rectangle([CX0 + 40, 350, CX0 + 420, 470], radius=18, outline=mix(CORAL, a), width=8)
        text(d, (CX0 + 230, 410), 'ON AIR', F('sansb', 64), CORAL, a, anchor='mm', rise=0)
    score_chip(T, d, 6, t_n6 + 2.4, (CX0 + 860, 410))
    counter(d, (CX0 + 40, 570), 25070, T, t_25, dur=1.0, prefix='', suffix=' people', font=F('serifb', 80), color=CREAM, anchor='lm')
    pill_row(d, 720, ['between-song talk', 'the news', 'interview prep'], T, [t_songs + 0.2, t_songs + 1.6, t_songs + 2.8],
             font=F('sansm', 36), cx=CX0 + 600)
    text(d, (CX0 + 600, 870), 'words on a page before they hit the air', F('hand', 60), MINT, prog(T, t_page + 0.4), anchor='mm')
    chrome(img, d, SRC)


def s5(T, img, d):
    ladder(T, d, cur=5)
    rank_header(T, d, 5, t_cnc)
    stamp(d, (CX0 + 1000, 320), 'ODD ONE OUT', AMBER, prog(T, t_n5 + 0.3, 0.3), size=44)
    score_chip(T, d, 5, t_cnc + 1.0, (CX0 + 330, 330))
    a1 = prog(T, t_floor, 0.4)
    card(d, (CX0 + 20, 430, CX0 + 560, 800), a1)
    hard_hat(d, CX0 + 290, 560, 140, SLATE, a1)
    text(d, (CX0 + 290, 690), 'the factory floor', F('sansb', 40), MUTED, a1, anchor='mm', base=PANEL)
    a2 = prog(T, t_desk5, 0.4)
    card(d, (CX0 + 660, 430, CX0 + 1200, 800), a2)
    text(d, (CX0 + 930, 560), '</>', F('sansb', 110), MINT, a2, anchor='mm', base=PANEL)
    text(d, (CX0 + 930, 690), 'the programming', F('sansb', 40), MINT, a2, anchor='mm', base=PANEL)
    arrow(d, (CX0 + 575, 615), (CX0 + 645, 615), prog(T, t_closer), AMBER, 8)
    text(d, (CX0 + 930, 750), 'AI helps here', F('hand', 48), AMBER, prog(T, t_desk5 + 1.0), anchor='mm', base=PANEL)
    text(d, (CX0 + 20, 890), 'code that tells machines how to cut metal', F('sansm', 34), MUTED, prog(T, t_code) * (1 - prog(T, t_28 - 0.3)), anchor='lm')
    counter(d, (CX0 + 20, 890), 28030, T, t_28, dur=0.8, prefix='', suffix=' Americans do it', font=F('serifb', 60), color=CREAM, anchor='lm')
    chrome(img, d, SRC)


def s4(T, img, d):
    ladder(T, d, cur=4)
    rank_header(T, d, 4, t_n4)
    score_chip(T, d, 4, t_n4 + 3.0, (CX0 + 330, 370))
    text(d, (CX0 + 600, 470), 'This one is huge:', F('hand', 60), AMBER, prog(T, t_114), anchor='mm')
    counter(d, (CX0 + 600, 590), 1.14, T, t_114 + 1.0, dur=1.2, prefix='', suffix=' million', decimals=2, font=F('serifb', 130), color=MINT)
    text(d, (CX0 + 600, 690), 'Americans', F('sansm', 40), MUTED, prog(T, t_114 + 1.8), anchor='mm')
    pill_row(d, 810, ['emails', 'pitches', 'follow-ups', 'customer research'], T,
             [t_emails, t_emails + 0.6, t_emails + 1.2, t_emails + 2.0], font=F('sansm', 36), cx=CX0 + 600)
    text(d, (CX0 + 600, 920), 'a big share of the day is writing', F('hand', 56), CREAM, prog(T, t_share + 0.5), anchor='mm')
    chrome(img, d, SRC)


def s3(T, img, d):
    ladder(T, d, cur=3)
    rank_header(T, d, 3, t_n3)
    text(d, (CX0, 330), 'neck and neck with #4', F('sansb', 40), AMBER, prog(T, t_n3 + 1.5))
    rows = [('#3 Writers & authors', 0.454, MINT), ('#4 Sales reps (services)', 0.449, SLATE)]
    for i, (lab, v, col) in enumerate(rows):
        y = 420 + i * 130
        a = prog(T, t_n3 + 1.5 + i * 0.4, 0.4)
        text(d, (CX0, y), lab, F('sansm', 34), CREAM, a, rise=0)
        p = ease((T - t_n3 - 1.5 - i * 0.4) / 1.0)
        w = 900 * v / 0.5 * p
        if w > 2:
            d.rounded_rectangle([CX0, y + 50, CX0 + w, y + 100], radius=10, fill=col)
        text(d, (CX0 + w + 20, y + 75), f'{v:.3f}', F('sansb', 36), CREAM, clamp(p * 1.5), anchor='lm', rise=0)
    counter(d, (CX0, 760), 49450, T, t_49, dur=1.0, prefix='', suffix=' Americans', font=F('serifb', 70), color=CREAM, anchor='lm')
    text(d, (CX0, 860), 'a machine built to write vs people who write', F('sansm', 34), MUTED, prog(T, t_machine), anchor='lm')
    text(d, (1500, 760), 'But wait...', F('hand', 90), CORAL, prog(T, t_wait), anchor='mm')
    chrome(img, d, SRC)


def s2(T, img, d):
    ladder(T, d, cur=2)
    rank_header(T, d, 2, t_n2)
    score_chip(T, d, 2, t_s2, (CX0 + 330, 370))
    counter(d, (CX0 + 20, 500), 3040, T, t_3040, dur=1.0, prefix='only ', suffix='', font=F('serifb', 90), color=CREAM, anchor='lm')
    text(d, (CX0 + 20, 580), 'historians in the whole country', F('sansm', 36), MUTED, prog(T, t_3040 + 0.6), anchor='lm')
    # area comparison: historians vs customer service workers
    ac = prog(T, t_3040 + 1.5, 0.6)
    if ac > 0:
        R = 190
        r = R * math.sqrt(3040 / 2858710)
        cx, cy = 1600, 420
        d.ellipse([cx - R, cy - R, cx + R, cy + R], outline=mix(SLATE, ac), width=4)
        text(d, (cx, cy - 60), 'customer service', F('sansm', 28), MUTED, ac, anchor='mm', rise=0)
        text(d, (cx, cy - 25), '2.86M', F('sansb', 30), MUTED, ac, anchor='mm', rise=0)
        d.ellipse([cx - r - 3, cy + 60 - r - 3, cx + r + 3, cy + 60 + r + 3], fill=mix(AMBER, ac))
        text(d, (cx, cy + 105), 'historians: 3,040', F('sansb', 28), AMBER, ac, anchor='mm', rise=0)
    pill_row(d, 720, ['records', 'reading', 'summarizing', 'explaining'], T,
             [t_research + 1.6, t_research + 2.4, t_research + 3.0, t_research + 3.8], font=F('sansm', 32), cx=CX0 + 450)
    text(d, (CX0 + 20, 860), 'exactly the kind of work people hand to AI', F('hand', 58), MINT, prog(T, t_hand + 0.6), anchor='lm')
    chrome(img, d, SRC)


def s1(T, img, d):
    ladder(T, d, cur=1)
    a = prog(T, t_n1, 0.4)
    text(d, (CX0, 110), '#1', F('serifb', 200), AMBER, a, rise=30)
    nm = 'Interpreters & translators'
    text(d, (CX0 + 290, 170), nm, fit_font(d, nm, 'serifb', 80, 900), CREAM, prog(T, t_s1 + 1.8, 0.4))
    counter(d, (CX0 + 290, 280), 0.492, T, t_s1 + 2.6, dur=1.0, prefix='', decimals=3, font=F('serifb', 110), color=MINT, anchor='la')
    text(d, (CX0 + 640, 330), 'out of 1', F('sansm', 40), MUTED, prog(T, t_s1 + 3.4), anchor='lm')
    counter(d, (CX0 + 20, 520), 51560, T, t_515, dur=1.0, prefix='', suffix=' Americans', font=F('serifb', 76), color=CREAM, anchor='lm')
    text(d, (CX0 + 20, 590), 'turning one language into another', F('sansm', 36), MUTED, prog(T, t_515 + 1.0), anchor='lm')
    text(d, (CX0 + 20, 660), '= what a language model does best', F('hand', 56), MINT, prog(T, t_lm), anchor='lm')
    ah = prog(T, t_hat, 0.4)
    hard_hat(d, 1660, 560, 120, SLATE, ah)
    cross(d, 1660, 560, 80, clamp((T - t_hat - 0.3) / 0.6))
    ar = prog(T, t_rem, 0.4)
    card(d, (CX0 + 20, 760, 1200, 900), ar)
    text(d, (CX0 + 60, 830), '#2 Historians: all 3,040', F('sansb', 44), AMBER, prog(T, t_all), anchor='lm', base=PANEL)
    text(d, (1560, 830), 'two of the oldest', F('hand', 56), CREAM, prog(T, t_oldest), anchor='mm')
    text(d, (1560, 900), 'desk jobs there are', F('hand', 56), CREAM, prog(T, t_oldest + 0.6), anchor='mm')
    chrome(img, d, SRC)


def twist(T, img, d):
    eyebrow(d, 'THE TWIST  -  THE OTHER END OF THE SAME STUDY', prog(T, t_twist))
    text(d, (120, 170), 'Score: 0.000', F('serifb', 90), CORAL, prog(T, t_dredge))
    items = [('Dredge operators', 940, t_dredge + 1.2), ('Bridge & lock tenders', 3460, t_bridge), ('Orderlies', 48710, t_orderlies),
             ('Pile driver operators', 3010, t_pile), ('Floor sanders & finishers', 5070, t_sanders),
             ('Water treatment plant operators', 120710, t_water)]
    for i, (nm, n, t0) in enumerate(items):
        a = prog(T, t0, 0.4)
        x = 120 + (i % 3) * 560
        y = 300 + (i // 3) * 210
        card(d, (x, y, x + 520, y + 190), a, radius=24)
        text(d, (x + 30, y + 45), nm, fit_font(d, nm, 'sansb', 36, 460), CREAM, a, anchor='lm', base=PANEL, rise=0)
        text(d, (x + 30, y + 115), '0.000', F('serifb', 64), CORAL, a, anchor='lm', base=PANEL, rise=0)
        text(d, (x + 490, y + 125), f'{n:,} jobs', F('sansm', 30), MUTED, a, anchor='rm', base=PANEL, rise=0)
    text(d, (120, 760), 'Every one: hands-on work.', F('serifb', 66), AMBER, prog(T, t_hands))
    text(d, (120, 870), 'The jobs AI chats touch most are done at a desk.', F('hand', 58), MINT, prog(T, t_desk))
    mascot(img, (1440, 740), 200, T=T, start=t_hands, flip=True)
    chrome(img, d, SRC_LOW)


def warning(T, img, d):
    eyebrow(d, 'THE RESEARCHERS\' OWN WARNING', prog(T, t_panic))
    a = prog(T, t_mistake, 0.5)
    card(d, (160, 190, 1760, 590), a)
    text(d, (220, 230), '“', F('serifb', 160), AMBER, a, base=PANEL, rise=0)
    text_block(d, (320, 260), 'This would be a mistake, as downstream consequences of new technologies are very hard to predict and often counterintuitive.',
               F('serif', 54), 1360, CREAM, a, base=PANEL)
    text(d, (320, 530), '- Microsoft Research authors, "Working with AI" (2025), on reading high scores as job or wage loss',
         F('sansm', 28), MUTED, prog(T, t_mistake + 1.5), base=PANEL, rise=0)
    text(d, (W / 2, 700), 'High score = AI can help with many tasks.', F('serifb', 62), MINT, prog(T, t_help), anchor='mm')
    stamp(d, (W / 2, 820), 'NOT A PINK SLIP', CORAL, prog(T, t_pink, 0.3), size=52)
    text(d, (W / 2, 940), 'Data: what people asked one AI assistant in 2024. Tools change fast.', F('sansm', 34), MUTED, prog(T, t_data), anchor='mm')
    chrome(img, d, 'Microsoft Research, "Working with AI" (arXiv 2507.07935, Dec 2025 version)')


def recap(T, img, d):
    eyebrow(d, 'THE FULL TOP 10  -  AI APPLICABILITY SCORE', prog(T, t_recap))
    lx, y0, maxw, rh = 760, 180, 760, 80
    for r in range(1, 11):
        name, sc, n = JOBS[r]
        t0 = t_r[r] if r != 1 else t_r[1] + 0.6
        y = y0 + (r - 1) * rh
        a = prog(T, t0, 0.4)
        text(d, (lx - 30, y + rh * 0.35), f'#{r}  {name}', F('sansm', 34), AMBER if r == 1 else CREAM, a, anchor='rm', rise=0)
        p = ease((T - t0) / 0.9)
        w = maxw * sc / 0.5 * p
        if w > 2:
            d.rounded_rectangle([lx, y + 8, lx + w, y + rh * 0.62], radius=8, fill=MINT if r == 1 else SLATE)
        if p > 0.05:
            text(d, (lx + w + 20, y + rh * 0.35), f'{sc * p:.3f}', F('sansb', 34), CREAM, clamp(p * 1.5), anchor='lm', rise=0)
    text(d, (1660, 640), 'words, talk or research', F('hand', 56), AMBER, prog(T, t_almost), anchor='mm')
    chrome(img, d, SRC)


def biggest(T, img, d):
    eyebrow(d, 'THE BIGGEST NUMBER ON THE BOARD', prog(T, t_board))
    rows = sorted([(JOBS[r][0], JOBS[r][2]) for r in JOBS], key=lambda x: -x[1])
    lx, y0, maxw, rh = 760, 180, 880, 80
    for i, (nm, n) in enumerate(rows):
        t0 = t_board + 0.3 + i * 0.18
        y = y0 + i * rh
        a = prog(T, t0, 0.4)
        top = i == 0
        text(d, (lx - 30, y + rh * 0.35), nm, F('sansm', 34), MINT if top else CREAM, a, anchor='rm', rise=0)
        p = ease((T - t0) / 0.9)
        w = max(3, maxw * n / 2858710 * p) if p > 0 else 0
        if w > 2:
            d.rounded_rectangle([lx, y + 8, lx + w, y + rh * 0.62], radius=8, fill=MINT if top else SLATE)
        if p > 0.05:
            text(d, (lx + w + 20, y + rh * 0.35), f'{n:,}', F('sansb', 32), CREAM, clamp(p * 1.5), anchor='lm', rise=0)
    text(d, (1250, 600), 'jobs in the US', F('hand', 60), AMBER, prog(T, t_csr), anchor='mm')
    chrome(img, d, 'BLS 2023 employment, as listed in Microsoft Research "Working with AI", Table L.4')


def outro(T, img, d):
    text(d, (W / 2 + 150, 230), 'Which one surprised you?', F('serifb', 100), CREAM, prog(T, t_which), anchor='mm')
    text(d, (W / 2 + 150, 350), 'Tell me in the comments', F('hand', 70), AMBER, prog(T, t_which + 1.6), anchor='mm')
    pill(d, W / 2 + 150, 520, 'Subscribe to Chartography for the next Top 10', prog(T, t_sub - 0.2), color=BG, fill=MINT, font=F('sansb', 44))
    a = prog(T, t_friday, 0.4)
    card(d, (720, 650, 1720, 900), a)
    text(d, (1220, 710), 'FRIDAY', F('sansb', 36), AMBER, a, anchor='mm', base=PANEL)
    text(d, (1220, 790), 'Top 10 highest-paid US government jobs', F('serifb', 46), CREAM, a, anchor='mm', base=PANEL)
    text(d, (1220, 855), 'who makes more than the President?', F('sansm', 34), MUTED, prog(T, t_friday + 2.0), anchor='mm', base=PANEL)
    mascot(img, (130, 560), 290, T=T, start=t_which + 0.8)
    chrome(img, d)


scenes = [ce.Scene(0, hook), ce.Scene(t_here - 0.15, intro), ce.Scene(t_n10 - 0.15, s10), ce.Scene(t_note - 0.15, explain),
          ce.Scene(t_miss - 0.15, missed), ce.Scene(t_n9 - 0.15, s9), ce.Scene(t_n8 - 0.15, s8), ce.Scene(t_n7 - 0.15, s7),
          ce.Scene(t_n6 - 0.15, s6), ce.Scene(t_n5 - 0.15, s5), ce.Scene(t_n4 - 0.15, s4), ce.Scene(t_n3 - 0.15, s3),
          ce.Scene(t_n2 - 0.15, s2), ce.Scene(t_n1 - 0.15, s1), ce.Scene(t_twist - 0.15, twist), ce.Scene(t_panic - 0.15, warning),
          ce.Scene(t_recap - 0.15, recap), ce.Scene(t_board - 0.15, biggest), ce.Scene(t_which - 0.15, outro)]

if __name__ == '__main__':
    if sys.argv[1:] == ['stills']:
        nxt = [s.start for s in scenes[1:]] + [DUR]
        for s, e in zip(scenes, nxt):
            ce.still(scenes, e - 0.35, f'{HERE}/still_{s.name}.png', DUR + 2)
        print([(s.name, round(s.start, 1)) for s in scenes])
    else:
        ce.render(scenes, AUD, HERE + '/final.mp4', tail=2.0)
        print(ce.sync_report(c, HERE + '/sync.json'))
