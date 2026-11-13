import sys, os, math
HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.join(HERE, '..', '..'))
import chartography_engine as ce
from PIL import Image, ImageDraw
from chartography_engine import F, fit_font, mascot, logo, house, hand_underline, arrow, MINT, AMBER, CREAM, MUTED, CORAL, SLATE, PANEL, BG

Wt, Ht = 1280, 720
os.makedirs(HERE + '/thumb_options', exist_ok=True)


def base():
    img = Image.new('RGB', (Wt, Ht), BG)
    return img, ImageDraw.Draw(img)


def brand(img):
    im, m = logo(80)
    img.paste(im, (1170, 30), m)


def strike(d, x0, y0, x1, y1, col=CORAL, w=12):
    d.line([(x0, y0), (x1, y1)], fill=col, width=w)


# A: price jump + "13% rates?!" twist
def opt_a():
    img, d = base()
    d.text((70, 50), '1985', font=F('sansb', 50), fill=AMBER)
    d.text((60, 100), '$84K', font=F('serifb', 165), fill=AMBER)
    d.text((660, 50), '2026', font=F('sansb', 50), fill=MINT)
    d.text((650, 100), '$393K', font=F('serifb', 165), fill=MINT)
    arrow(d, (520, 205), (625, 205), 1.0, CREAM, 10)
    d.text((70, 330), 'but 13% rates?!', font=F('handb', 80), fill=CORAL)
    d.text((70, 440), 'WHO HAD IT', font=F('serifb', 92), fill=CREAM)
    d.text((70, 545), 'HARDER?', font=F('serifb', 92), fill=CREAM)
    hand_underline(d, 70, 500, 660, 1.0, MINT, 10)
    mascot(img, (860, 410), 290)
    brand(img)
    return img


# B: 38% vs 29% paycheck bite
def opt_b():
    img, d = base()
    d.text((70, 60), "YOUR PARENTS' MORTGAGE ATE", font=F('sansb', 44), fill=MUTED)
    d.text((60, 110), '38%', font=F('serifb', 250), fill=CORAL)
    d.text((620, 170), 'of their pay', font=F('serifb', 66), fill=CREAM)
    d.text((620, 260), 'Today: 29%', font=F('serifb', 66), fill=MINT)
    d.text((70, 470), 'So 1985 was', font=F('serifb', 84), fill=CREAM)
    d.text((70, 570), 'HARDER?', font=F('serifb', 84), fill=AMBER)
    d.text((530, 580), '...or not?', font=F('handb', 64), fill=AMBER)
    mascot(img, (860, 410), 290)
    brand(img)
    return img


# C: 1985 vs 2026 houses with a crossed-out "easier"
def opt_c():
    img, d = base()
    house(d, 90, 300, 220, AMBER)
    d.text((200, 75), '1985', font=F('serifb', 90), fill=AMBER, anchor='ma')
    d.text((200, 490), '$84K', font=F('serifb', 90), fill=CREAM, anchor='ma')
    house(d, 460, 300, 300, MINT)
    d.text((610, 30), '2026', font=F('serifb', 90), fill=MINT, anchor='ma')
    d.text((610, 490), '$393K', font=F('serifb', 90), fill=CREAM, anchor='ma')
    d.text((70, 610), 'EASIER?', font=F('serifb', 80), fill=CREAM)
    w = d.textlength('EASIER?', font=F('serifb', 80))
    strike(d, 60, 665, 80 + w, 630)
    d.text((100 + w, 612), '13% rates...', font=F('handb', 66), fill=CORAL)
    mascot(img, (860, 410), 290)
    brand(img)
    return img


if __name__ == '__main__':
    for name, fn in [('a_price_jump', opt_a), ('b_38_percent', opt_b), ('c_houses', opt_c)]:
        im = fn()
        im.save(f'{HERE}/thumb_options/{name}.png')
        im.resize((320, 180), Image.LANCZOS).save(f'{HERE}/thumb_options/{name}_small.png')
    print('ok')
