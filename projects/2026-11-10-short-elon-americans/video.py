import sys, os, json
HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.join(HERE, '..', '..'))
import chartography_engine as ce
from chartography_engine import F, text, text_block, prog, pill_row, card, counter, hand_underline, chrome, eyebrow, hbars, dot_field, mascot, MINT, AMBER, CREAM, MUTED, PANEL, CORAL, SLATE
ce.use_canvas('short'); W, H = ce.W, ce.H
AUD = HERE + '/vo_short.mp3'; DUR = ce.duration(AUD)
c = ce.Cues(json.load(open(HERE + '/words.json')), DUR)

t_ok = c.at('okay what if he only gave it')
t_us = c.at('the us has about 342 million')
t_split = c.at('split 869 billion dollars')
t_2540 = c.at('gets about 2,540 dollars')
t_here = c.at("and here's where it gets interesting")
t_tried = c.at('tried something like this before')
t_three = c.at('three rounds of stimulus checks')
t_476 = c.at('about 476 million payments')
t_814 = c.at('roughly 814 billion dollars')
t_almost = c.at("that's almost exactly")
t_guess = c.at("so we don't have to guess")
t_bills = c.at('people paid bills')
t_debt = c.at('paid down debt')
t_spent = c.at('and spent it')
t_some = c.at('some economists argue')
t_others = c.at('others say broken supply chains')
t_either = c.at('either way one burst of cash')

def hook(T, img, d):
    eyebrow(d, "IF ELON SPLIT $869B...", prog(T, 0.0, 0.3))
    text(d, (W/2, 520), '$2,540', F('serifb', 230), AMBER, prog(T, 0.0, 0.35), anchor='mm')
    text(d, (W/2, 720), 'for every', F('serif', 110), CREAM, prog(T, 0.15, 0.35), anchor='mm')
    text(d, (W/2, 860), 'American?', F('serifb', 130), MINT, prog(T, 0.3, 0.35), anchor='mm')
    mascot(img, (W/2 - 230, 1080), 330, T=T, start=0.2)
    chrome(img, d, 'Forbes net worth as of Nov 1, 2026')

def split(T, img, d):
    eyebrow(d, 'ONLY AMERICANS', prog(T, t_us))
    counter(d, (W/2, 400), 342, T, t_us + 0.3, dur=1.0, prefix='', suffix=' million', font=F('serifb', 120), color=CREAM)
    text(d, (W/2, 500), 'people in the US', F('sansm', 44), MUTED, prog(T, t_us + 0.5), anchor='mm')
    dot_field(d, (130, 580), T, t_us + 0.4, rows=9, cols=25, spacing=33, size=14)
    text(d, (W/2, 960), '$869B  ÷  342M', F('sansb', 80), CREAM, prog(T, t_split), anchor='mm')
    if T > t_2540 - 0.2:
        card(d, (90, 1070, W - 90, 1440), prog(T, t_2540 - 0.2))
        counter(d, (W/2, 1210), 2540, T, t_2540, dur=1.0, font=F('serifb', 190), color=MINT)
        text(d, (W/2, 1370), 'each - adults AND kids', F('serif', 58), CREAM, prog(T, t_2540 + 0.6), anchor='mm', base=PANEL)
    chrome(img, d, 'Forbes (Nov 1, 2026); US Census Bureau')

def tried(T, img, d):
    eyebrow(d, "WE'VE TRIED THIS BEFORE", prog(T, t_here))
    text(d, (W/2, 420), 'Pandemic', F('serifb', 120), CREAM, prog(T, t_tried), anchor='mm')
    text(d, (W/2, 550), 'stimulus checks', F('serif', 96), CREAM, prog(T, t_tried + 0.3), anchor='mm')
    pill_row(d, 720, ['Round 1', 'Round 2', 'Round 3'], T, [t_three, t_three + 0.3, t_three + 0.6], font=F('sansb', 48), colors=[MINT, MINT, MINT])
    card(d, (90, 830, W - 90, 1440), prog(T, t_476 - 0.2))
    counter(d, (W/2, 960), 476, T, t_476, dur=1.0, prefix='', suffix=' million', font=F('serifb', 110), color=CREAM)
    text(d, (W/2, 1060), 'payments', F('sansm', 48), MUTED, prog(T, t_476 + 0.4), anchor='mm', base=PANEL)
    counter(d, (W/2, 1230), 814, T, t_814, dur=1.0, suffix='B', font=F('serifb', 170), color=AMBER)
    text(d, (W/2, 1370), 'in total', F('sansm', 48), MUTED, prog(T, t_814 + 0.4), anchor='mm', base=PANEL)
    chrome(img, d, 'Pandemic Response Accountability Committee (IRS data)')

def compare(T, img, d):
    eyebrow(d, 'ALMOST THE SAME AMOUNT', prog(T, t_almost))
    hbars(d, T, [("Musk's fortune", 869), ('3 stimulus rounds', 814)], (470, 560, 330, 260), t_almost + 0.1,
          label_font=F('sansm', 36), value_font=F('sansb', 50), colors=[MINT, AMBER], vmax=900)
    text(d, (W/2, 1200), 'So we know what happens.', F('hand', 92), AMBER, prog(T, t_guess), anchor='mm')
    chrome(img, d, 'Forbes (Nov 1, 2026); PRAC')

def went(T, img, d):
    eyebrow(d, 'WHERE THE CHECKS WENT', prog(T, t_bills - 0.3))
    for i, (s, t0) in enumerate([('Paid bills', t_bills), ('Paid down debt', t_debt), ('Spent it', t_spent)]):
        a = prog(T, t0)
        if a > 0:
            card(d, (120, 300 + i * 170, W - 120, 440 + i * 170), a)
            text(d, (W/2, 370 + i * 170), s, F('serifb', 84), CREAM, a, anchor='mm', base=PANEL)
    text(d, (W/2, 880), 'Did they push prices up?', F('sansb', 56), MUTED, prog(T, t_some), anchor='mm')
    card(d, (80, 960, W/2 - 20, 1400), prog(T, t_some + 0.3))
    text_block(d, (120, 1010), 'Some economists: checks + everything else helped push prices up in 2021-22', F('sansm', 40), W/2 - 180, CREAM, prog(T, t_some + 0.4), base=PANEL)
    card(d, (W/2 + 20, 960, W - 80, 1400), prog(T, t_others))
    text_block(d, (W/2 + 60, 1010), 'Others: broken supply chains were the bigger cause', F('sansm', 40), W/2 - 180, CREAM, prog(T, t_others + 0.1), base=PANEL)
    chrome(img, d)

def punch(T, img, d):
    text(d, (W/2, 420), 'One burst of cash', F('serif', 96), CREAM, prog(T, t_either), anchor='mm')
    text(d, (W/2, 560), "didn't make anyone", F('serif', 96), CREAM, prog(T, t_either + 0.6), anchor='mm')
    text(d, (W/2, 720), 'rich for long.', F('serifb', 130), AMBER, prog(T, t_either + 1.2), anchor='mm')
    tw = d.textlength('rich for long.', font=F('serifb', 130))
    hand_underline(d, W/2 - tw/2, W/2 + tw/2, 800, ce.ease((T - t_either - 1.6) / 0.6), AMBER, 10)
    text(d, (W/2, 900), 'Would $2,540 change anything for you?', F('hand', 72), MINT, prog(T, t_either + 1.8), anchor='mm')
    mascot(img, (W/2 - 210, 1010), 300, T=T, start=t_either + 1.0)
    text(d, (W/2, 1390), "Note: Musk's fortune has since dropped (Bloomberg, Nov 4-5).", F('sansm', 30), MUTED, prog(T, t_either + 2.0), anchor='mm')
    chrome(img, d)

scenes = [ce.Scene(0, hook), ce.Scene(t_us - 0.15, split), ce.Scene(t_here - 0.15, tried),
          ce.Scene(t_almost - 0.15, compare), ce.Scene(t_bills - 0.45, went), ce.Scene(t_either - 0.15, punch)]
if __name__ == '__main__':
    if sys.argv[1:] == ['stills']:
        for n, T in [('hook', 1.6), ('split', t_2540 + 1.4), ('tried', t_814 + 1.2), ('compare', t_guess + 0.9), ('went', t_either - 0.3), ('punch', DUR - 0.3)]:
            ce.still(scenes, T, f'{HERE}/still_{n}.png', DUR + 1.5)
    else:
        ce.render(scenes, AUD, HERE + '/final.mp4', tail=1.5)
        print(ce.sync_report(c, HERE + '/sync.json'))
