import sys, os, json
HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.join(HERE, '..', '..'))
import chartography_engine as ce
from chartography_engine import (F, text, text_block, fit_font, prog, ease, clamp, mix, card, counter, chrome, eyebrow,
                                 mascot, pill, arrow, person_icon, progress_bar, MINT, AMBER, CREAM, MUTED, PANEL, CORAL,
                                 SLATE, BG, EMPTY)
ce.use_canvas('short'); W, H = ce.W, ce.H
AUD = HERE + '/vo_short.mp3'; DUR = ce.duration(AUD)
c = ce.Cues(json.load(open(HERE + '/words.json')), DUR)
SRC = 'Microsoft Research "Working with AI" (v7, Oct 23, 2026), Table L.4; jobs: BLS 2023. Other nine = sum of the table rows'

t_rep = c.at('work as customers service representatives')
t_one = c.at('and that one job has')
t_twice = c.at('more than twice as many workers')
t_comb = c.at('the other nine on this list combined')
t_139 = c.at('the other nine add up to about')
t_score = c.at('the score here is point for one')
t_ans = c.at('answering questions')
t_acct = c.at('looking up an account')
t_bill = c.at('explaining a bill')
t_reply = c.at('writing a polite reply')
t_tasks = c.at('those are exactly the tasks')
t_thing = c.at("so here's the thing about number seven")
t_not = c.at("it's not the highest score")
t_crowd = c.at("it's just the biggest crowd")


def hook(T, img, d):
    d.rounded_rectangle([W / 2 - 150, 270, W / 2 + 150, 470], radius=36, fill=AMBER)
    text(d, (W / 2, 370), '#7', F('serifb', 150), BG, 1.0, anchor='mm', base=AMBER, rise=0)
    text(d, (W / 2, 620), '2.86', F('serifb', 260), MINT, 1.0, anchor='mm', rise=0)
    text(d, (W / 2, 800), 'MILLION JOBS', F('sansb', 84), CREAM, 1.0, anchor='mm', rise=0)
    text(d, (W / 2, 930), 'on AI\'s top-10 list', F('sansm', 50), MUTED, 1.0, anchor='mm', rise=0)
    pill(d, W / 2, 1080, 'Customer service reps', prog(T, t_rep, 0.4), color=BG, fill=AMBER, font=F('sansb', 56))
    mascot(img, (W / 2 - 200, 1180), 290, T=T, start=0.0)
    chrome(img, d, SRC)


def bars(T, img, d):
    eyebrow(d, 'WORKERS IN THE US', prog(T, t_one - 0.2))
    by, mh = 1330, 820
    for i, (lab, v, col, t0) in enumerate([('Customer\nservice', 2858710, MINT, t_one), ('Other nine\ncombined', 1388550, SLATE, t_comb)]):
        x = 150 + i * 440
        p = ease((T - t0) / 1.0)
        h = mh * v / 2858710 * p
        if h > 2:
            d.rounded_rectangle([x, by - h, x + 340, by], radius=16, fill=col)
        text(d, (x + 170, by - h - 60), f'{v / 1e6:.2f}M', F('serifb', 80), CREAM, prog(T, t0 + 0.5) if i == 0 else prog(T, t_139 + 1.0), anchor='mm', rise=0)
        for k, ln in enumerate(lab.split('\n')):
            text(d, (x + 170, by + 50 + k * 50), ln, F('sansb', 42), MUTED, prog(T, t0), anchor='mm', rise=0)
    a = prog(T, t_twice, 0.3)
    if a > 0:
        f = F('sansb', 60); s = 'MORE THAN 2x'
        w = d.textlength(s, font=f) + 60
        cx, cy = 810, 700
        d.rounded_rectangle([cx - w / 2, cy - 55, cx + w / 2, cy + 55], radius=16, outline=mix(CORAL, a), width=9)
        text(d, (cx, cy), s, f, CORAL, a, anchor='mm', rise=0)
    chrome(img, d, SRC)


def tasks(T, img, d):
    eyebrow(d, 'THE SCORE', prog(T, t_score - 0.2))
    text(d, (W / 2, 410), '0.408', F('serifb', 200), MINT, prog(T, t_score + 0.3), anchor='mm')
    progress_bar(d, (120, 540, W - 120, 580), 0.408 * ease((T - t_score - 0.3) / 1.0), prog(T, t_score + 0.3))
    text(d, (W / 2, 630), 'AI applicability score (0 to 1)', F('sansm', 40), MUTED, prog(T, t_score + 0.6), anchor='mm')
    items = [('Answering questions', t_ans), ('Looking up an account', t_acct), ('Explaining a bill', t_bill), ('Writing a polite reply', t_reply)]
    for i, (s, t0) in enumerate(items):
        a = prog(T, t0, 0.4)
        y = 740 + i * 150
        card(d, (110, y, W - 110, y + 120), a, radius=60)
        text(d, (190, y + 60), s, F('sansb', 52), CREAM, a, anchor='lm', base=PANEL, rise=0)
        text(d, (W - 190, y + 60), 'AI', F('sansb', 46), MINT, prog(T, t_tasks + i * 0.25), anchor='rm', base=PANEL, rise=0)
    text(d, (W / 2, 1400), 'what people bring to AI chats every day', F('hand', 64), AMBER, prog(T, t_tasks + 0.5), anchor='mm')
    chrome(img, d, SRC)


def crowd(T, img, d):
    text(d, (W / 2, 330), 'Not the highest score.', F('serifb', 76), MUTED, prog(T, t_not), anchor='mm')
    text(d, (W / 2, 460), 'Just the biggest crowd.', F('serifb', 80), AMBER, prog(T, t_crowd), anchor='mm')
    a = clamp((T - t_thing) / 2.0)
    for r in range(5):
        for k in range(9):
            ap = clamp(a * 3 - (r + k) / 15 * 2)
            if ap > 0:
                person_icon(d, 140 + k * 100, 620 + r * 105, 70, mix(MINT if (r + k) % 7 else CREAM, ap))
    t_end = DUR - 1.9
    pill(d, W / 2, 1310, 'Full Top 10 on the channel', prog(T, t_end - 0.3), color=BG, fill=MINT, font=F('sansb', 50))
    text(d, (W / 2, 1440), '#7 is 2.86 million...', F('hand', 70), CREAM, prog(T, t_end + 0.3), anchor='mm')
    mascot(img, (80, 1110), 150, T=T, start=t_end - 0.4)
    chrome(img, d)


scenes = [ce.Scene(0, hook), ce.Scene(t_one - 0.15, bars), ce.Scene(t_score - 0.15, tasks), ce.Scene(t_thing - 0.15, crowd)]

if __name__ == '__main__':
    if sys.argv[1:] == ['stills']:
        nxt = [s.start for s in scenes[1:]] + [DUR + 1.4]
        for s, e in zip(scenes, nxt):
            ce.still(scenes, e - 0.2, f'{HERE}/still_{s.name}.png', DUR + 1.5)
    else:
        ce.render(scenes, AUD, HERE + '/final.mp4', tail=1.5)
        print(ce.sync_report(c, HERE + '/sync.json'))
