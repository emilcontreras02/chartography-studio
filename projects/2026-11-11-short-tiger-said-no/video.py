import sys, os, json
HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.join(HERE, '..', '..'))
import chartography_engine as ce
from chartography_engine import (F, text, text_block, prog, ease, mix, card, hand_underline, chrome, eyebrow,
                                 mascot, pill, arrow, MINT, AMBER, CREAM, MUTED, PANEL, CORAL, BG, SLATE)
ce.use_canvas('short'); W, H = ce.W, ce.H
AUD = HERE + '/vo_short.mp3'; DUR = ce.duration(AUD)
c = ce.Cues(json.load(open(HERE + '/words.json')), DUR)

t_no = c.at('he said no')
t_2022 = c.at('back in 2022')
t_nine = c.at('high nine digits')
t_7to8 = c.at('reports later put it at')
t_stayed = c.at('woods stayed with the')
t_fair = c.at('to be fair the players who did sign')
t_bk = c.at('is in bankruptcy court')
t_paid = c.at('at least one of its former stars')
t_koepka = c.at('when brooks kepa returned')
t_5m = c.at('five million dollar donation')
t_price = c.at('the price of coming back')
t_story = c.at('in this story the man')
t_won = c.at('said no one')

SRC = 'CBS Sports / NPR (Aug 2022); Golf Channel + NBC Sports (Nov 5, 2026)'


def hook(T, img, d):
    text(d, (W/2, 330), 'A GOLF LEAGUE OFFERED TIGER WOODS', F('sansb', 38), MINT, prog(T, 0.0, 0.3), anchor='mm', rise=8)
    text(d, (W/2, 560), '$800M', F('serifb', 260), MINT, prog(T, 0.0, 0.3), anchor='mm')
    text(d, (W/2, 720), '(up to, as reported)', F('sansm', 40), MUTED, prog(T, 0.3, 0.3), anchor='mm')
    text(d, (W/2, 900), '...and he said', F('serif', 100), CREAM, prog(T, 0.5, 0.35), anchor='mm')
    text(d, (W/2, 1060), 'NO?', F('serifb', 200), AMBER, prog(T, t_no, 0.3), anchor='mm')
    mascot(img, (330, 1200), 300, T=T, start=0.2)
    chrome(img, d, 'CBS Sports / NPR (Aug 2022)')


def digits(T, img, d):
    eyebrow(d, 'GREG NORMAN, LIV BOSS, 2022', prog(T, t_2022))
    text(d, (W/2, 400), '"high nine digits"', F('serifb', 96), CREAM, prog(T, t_nine), anchor='mm')
    # 9 digit boxes, 3 groups
    for i in range(9):
        g = i // 3
        x = 120 + i * 92 + g * 30
        a = prog(T, t_nine + 0.3 + i * 0.08, 0.3)
        if a > 0:
            d.rounded_rectangle([x, 560 + (1 - a) * 20, x + 78, 680 + (1 - a) * 20], radius=12, fill=mix(PANEL, a))
            ch = '7' if i == 0 else '0'
            if T > t_7to8:
                text(d, (x + 39, 620), ch, F('serifb', 76), MINT, prog(T, t_7to8 + i * 0.05, 0.3), anchor='mm', base=PANEL, rise=0)
    a = prog(T, t_7to8)
    text(d, (W/2, 820), 'Later reported:', F('sansm', 48), MUTED, a, anchor='mm')
    text(d, (W/2, 950), '$700-800M', F('serifb', 150), MINT, a, anchor='mm')
    a = prog(T, t_stayed)
    card(d, (120, 1120, W - 120, 1330), a)
    text(d, (W/2, 1225), 'He stayed with the PGA Tour', F('serif', 54), CREAM, a, anchor='mm', base=PANEL)
    chrome(img, d, 'CBS Sports / NPR (Aug 2022)')


def paths(T, img, d):
    eyebrow(d, 'TWO PATHS', prog(T, t_fair))
    a = prog(T, t_fair)
    card(d, (90, 300, W - 90, 760), a)
    text(d, (150, 350), 'THE PLAYERS WHO SIGNED', F('sansb', 38), MUTED, a, base=PANEL)
    text(d, (150, 420), 'got very rich', F('serifb', 100), MINT, a, base=PANEL)
    a2 = prog(T, t_bk)
    text(d, (150, 580), 'Four years later, their league:', F('sansm', 40), CREAM, a2, base=PANEL)
    text(d, (150, 640), 'in bankruptcy court', F('serifb', 70), CORAL, a2, base=PANEL)
    a = prog(T, t_paid)
    card(d, (90, 860, W - 90, 1440), a)
    text(d, (150, 910), 'ONE FORMER STAR CAME BACK', F('sansb', 38), MUTED, a, base=PANEL)
    text(d, (150, 980), 'Brooks Koepka, to the PGA Tour', F('sansm', 44), CREAM, prog(T, t_koepka), base=PANEL)
    text(d, (W/2, 1170), '$5M', F('serifb', 220), AMBER, prog(T, t_5m), anchor='mm', base=PANEL)
    text(d, (W/2, 1340), 'charity donation: the price of coming back', F('sansm', 38), CREAM, prog(T, t_price), anchor='mm', base=PANEL)
    chrome(img, d, 'NBC Sports (Nov 5, 2026); Golf Channel')


def final(T, img, d):
    text(d, (W/2, 420), 'The man who', F('serif', 120), CREAM, prog(T, t_story), anchor='mm')
    text(d, (W/2, 580), 'said NO', F('serifb', 170), AMBER, prog(T, t_story + 0.5), anchor='mm')
    text(d, (W/2, 790), 'won.', F('serifb', 230), MINT, prog(T, t_won, 0.35), anchor='mm')
    tw = d.textlength('won.', font=F('serifb', 230))
    hand_underline(d, W/2 - tw/2, W/2 + tw/2, 920, ease((T - t_won - 0.4) / 0.6), AMBER, 12)
    text(d, (W/2, 1060), 'Would you have said no?', F('hand', 80), CREAM, prog(T, t_won + 0.8), anchor='mm')
    mascot(img, (360, 1150), 320, T=T, start=t_won + 0.3)
    chrome(img, d, SRC)


scenes = [ce.Scene(0, hook), ce.Scene(t_2022 - 0.15, digits), ce.Scene(t_fair - 0.15, paths), ce.Scene(t_story - 0.15, final)]

if __name__ == '__main__':
    if sys.argv[1:] == ['stills']:
        for n, T in [('hook', t_2022 - 0.35), ('digits', t_fair - 0.35), ('paths', t_story - 0.35), ('final', DUR + 1.0)]:
            ce.still(scenes, T, f'{HERE}/still_{n}.png', DUR + 1.5)
    else:
        ce.render(scenes, AUD, HERE + '/final.mp4', tail=1.5)
        print(ce.sync_report(c, HERE + '/sync.json'))
