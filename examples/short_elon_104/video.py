import sys, os
sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..', '..'))
import chartography_engine as ce
from chartography_engine import F, text, prog, pill, card, counter, hand_underline, chrome, eyebrow, MINT, AMBER, CREAM, MUTED, PANEL, CORAL

HERE = os.path.dirname(os.path.abspath(__file__))
ce.use_canvas('short')
W, H = ce.W, ce.H
c = ce.Cues(ce.json.load(open(HERE + '/words.json')), ce.duration(HERE + '/vo_short.mp3'))

t_hook = 0.0
t_take = c.at('take 869 billion dollars')
t_divided = c.at('divided by 8.3 billion people')
t_104 = c.at('about one hundred four dollars')
t_thats = c.at("that's it")
t_lot = c.at('for a lot of people watching this')
t_dinner = c.at('a nice dinner out')
t_shoes = c.at('a new pair of shoes')
t_pleasant = c.at('pleasant but it')
t_but = c.at('but for the hundreds of millions')
t_more = c.at('is more than a month of living')
t_same = c.at('same money')
t_born = c.at('where you were born')

def hook(T, img, d):
    text(d, (W/2, 330), "ELON MUSK'S FORTUNE", F('sansb', 40), MINT, prog(T, 0.0, 0.3), anchor='mm', rise=8)
    counter(d, (W/2, 470), 869e9, T, 0.0, dur=1.6, font=F('serifb', 104), color=MINT)
    text(d, (W/2, 820), 'What if he', F('serif', 120), CREAM, prog(T, 0.3, 0.35), anchor='mm')
    text(d, (W/2, 960), 'gave it all', F('serif', 120), CREAM, prog(T, 0.9, 0.35), anchor='mm')
    text(d, (W/2, 1100), 'away?', F('serifb', 140), AMBER, prog(T, 1.6, 0.35), anchor='mm')
    chrome(img, d, 'Forbes, Nov 1, 2026')

def split(T, img, d):
    eyebrow(d, 'SPLIT IT WITH EVERYONE', prog(T, t_take))
    text(d, (W/2, 520), '$869B', F('serifb', 150), CREAM, prog(T, t_take), anchor='mm')
    text(d, (W/2, 660), '÷', F('sansb', 110), MUTED, prog(T, t_divided), anchor='mm')
    text(d, (W/2, 800), '8.3 billion people', F('serif', 92), CREAM, prog(T, t_divided + 0.3), anchor='mm')
    if T > t_104 - 0.2:
        card(d, (90, 960, W - 90, 1320), prog(T, t_104 - 0.2))
        counter(d, (W/2, 1100), 104, T, t_104, dur=1.0, font=F('serifb', 210), color=MINT)
        text(d, (W/2, 1250), 'each', F('serif', 70), CREAM, prog(T, t_104 + 0.6), anchor='mm', base=PANEL)
    chrome(img, d, 'Forbes; Worldometer (UN data), Nov 2026')

def thats_it(T, img, d):
    text(d, (W/2, 560), "That's it.", F('hand', 150), AMBER, prog(T, t_thats, 0.4), anchor='mm')
    text(d, (W/2, 860), '$104', F('serifb', 300), MINT, prog(T, t_thats + 0.5, 0.4), anchor='mm')
    tw = d.textlength('$104', font=F('serifb', 300))
    hand_underline(d, W/2 - tw/2, W/2 + tw/2, 1010, ce.ease((T - t_thats - 0.9) / 0.8), AMBER, 12)
    chrome(img, d)

def two_worlds(T, img, d):
    eyebrow(d, 'SAME $104, DIFFERENT WORLDS', prog(T, t_lot))
    card(d, (80, 300, W - 80, 820), prog(T, t_lot))
    text(d, (140, 370), 'For a lot of viewers', F('sansb', 40), MUTED, prog(T, t_lot), base=PANEL)
    text(d, (140, 460), 'a nice dinner out', F('serif', 80), CREAM, prog(T, t_dinner), base=PANEL)
    text(d, (140, 570), 'or new shoes', F('serif', 80), CREAM, prog(T, t_shoes), base=PANEL)
    text(d, (140, 700), 'Nice. Not life-changing.', F('hand', 66), MUTED, prog(T, t_pleasant), base=PANEL)
    card(d, (80, 900, W - 80, 1420), prog(T, t_but))
    text(d, (140, 970), 'Living on less than $3 a day', F('sansb', 40), MUTED, prog(T, t_but), base=PANEL)
    text(d, (140, 1050), '34+ days', F('serifb', 170), AMBER, prog(T, t_more), base=PANEL)
    text(d, (140, 1260), 'of living', F('serif', 80), CREAM, prog(T, t_more + 0.4), base=PANEL)
    text(d, (W/2, 1540), 'Same money.', F('hand', 90), MINT, prog(T, t_same), anchor='mm')
    text(d, (W/2, 1640), 'Different meaning.', F('hand', 90), MINT, prog(T, t_same + 0.9), anchor='mm')
    chrome(img, d, 'World Bank $3.00/day extreme poverty line')

scenes = [ce.Scene(t_hook, hook), ce.Scene(t_take - 0.15, split), ce.Scene(t_thats - 0.15, thats_it), ce.Scene(t_lot - 0.15, two_worlds)]

if __name__ == '__main__':
    if sys.argv[1:] == ['stills']:
        for T in (2.6, t_104 + 1.5, t_thats + 1.8, ce.duration(HERE + '/vo_short.mp3') - 0.5):
            ce.still(scenes, T, f'{HERE}/still_{T:.1f}.png', ce.duration(HERE + '/vo_short.mp3') + 1.5)
    else:
        ce.render(scenes, HERE + '/vo_short.mp3', HERE + '/short.mp4', tail=1.5)
        print(ce.sync_report(c, HERE + '/sync.json'))
