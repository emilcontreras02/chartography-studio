import sys, os
HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.join(HERE, '..', '..'))
import chartography_engine as ce
from PIL import Image, ImageDraw
from chartography_engine import F, MINT, AMBER, CREAM, MUTED, CORAL, BG, PANEL, EMPTY, hand_underline, mascot, logo, fit_font

GOLD = (232, 190, 92)
os.makedirs(HERE + '/thumb_options', exist_ok=True)


def base():
    img = Image.new('RGB', (1280, 720), BG)
    d = ImageDraw.Draw(img)
    im, m = logo(80)
    img.paste(im, (1170, 30), m)
    return img, d


def bar(d, cx, cy, w, col=GOLD):
    h = w * 0.36
    d.polygon([(cx - w * 0.36, cy - h / 2), (cx + w * 0.36, cy - h / 2), (cx + w / 2, cy + h / 2), (cx - w / 2, cy + h / 2)], fill=col)
    d.line([(cx - w * 0.3, cy - h * 0.25), (cx + w * 0.2, cy - h * 0.25)], fill=(255, 230, 160), width=6)


def opt_a(out):  # crossed-out record + "then this?"
    img, d = base()
    d.text((60, 50), "GOLD'S RECORD", font=F('sansb', 56), fill=CREAM)
    f = F('serifb', 230)
    d.text((50, 110), '$5,600', font=f, fill=GOLD)
    tw = d.textlength('$5,600', font=f)
    d.line([(50, 330), (50 + tw, 210)], fill=CORAL, width=22)
    d.text((70, 420), '-$1,500+', font=F('serifb', 130), fill=CORAL)
    d.text((80, 590), 'the "safe" one?!', font=F('handb', 90), fill=AMBER)
    mascot(img, (900, 420), 290)
    img.save(out)


def opt_b(out):  # safe haven stamp with question
    img, d = base()
    d.text((60, 60), 'THE SAFE HAVEN', font=F('sansb', 56), fill=CREAM)
    d.text((50, 120), '-$1,500', font=F('serifb', 250), fill=CORAL)
    d.text((70, 420), 'per ounce.', font=F('serifb', 90), fill=CREAM)
    d.text((70, 560), 'Who did it?', font=F('handb', 110), fill=AMBER)
    mascot(img, (900, 420), 290)
    img.save(out)


def opt_c(out):  # 0% vs 5%
    img, d = base()
    d.text((60, 60), 'GOLD PAYS YOU', font=F('sansb', 56), fill=CREAM)
    d.text((50, 110), '0%', font=F('serifb', 300), fill=GOLD)
    d.text((560, 210), 'vs', font=F('serif', 90), fill=MUTED)
    d.text((700, 150), '5%?', font=F('serifb', 200), fill=MINT)
    d.text((70, 480), 'Why gold fell', font=F('serifb', 100), fill=CREAM)
    hand_underline(d, 70, 70 + d.textlength('Why gold fell', font=F('serifb', 100)), 610, 1.0, CORAL, 10)
    mascot(img, (900, 420), 290)
    img.save(out)


opt_a(HERE + '/thumb_options/A_record_crossed_out.png')
opt_b(HERE + '/thumb_options/B_minus_1500_who_did_it.png')
opt_c(HERE + '/thumb_options/C_zero_vs_five.png')
ims = [Image.open(HERE + '/thumb_options/' + f) for f in sorted(os.listdir(HERE + '/thumb_options')) if f.endswith('.png')]
g = Image.new('RGB', (1280 + 340, 720 * len(ims)), (60, 60, 60))
for i, im in enumerate(ims):
    g.paste(im, (0, i * 720)); g.paste(im.resize((320, 180), Image.LANCZOS), (1290, i * 720))
g.save('/tmp/claude-0/thumb_preview.png')
