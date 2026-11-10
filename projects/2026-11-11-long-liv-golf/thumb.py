import sys, os
HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.join(HERE, '..', '..'))
import chartography_engine as ce
from PIL import Image, ImageDraw
from chartography_engine import F, MINT, AMBER, CREAM, MUTED, CORAL, BG, PANEL, hand_underline, mascot, logo, fit_font
sys.path.insert(0, HERE)

PAPER = (240, 229, 203); INK = (44, 44, 52); INK2 = (120, 110, 95)
os.makedirs(HERE + '/thumb_options', exist_ok=True)


def stamp(img, center, s, color, size, angle):
    f = F('sansb', size)
    tw = int(ImageDraw.Draw(Image.new('L', (4, 4))).textlength(s, font=f)) + 60
    th = int(size * 1.5)
    lay = Image.new('RGBA', (tw, th), (0, 0, 0, 0))
    dl = ImageDraw.Draw(lay)
    dl.rounded_rectangle([4, 4, tw - 4, th - 4], radius=12, outline=color + (255,), width=9)
    dl.text((tw / 2, th / 2), s, font=f, fill=color + (255,), anchor='mm')
    lay = lay.rotate(angle, expand=True, resample=Image.BICUBIC)
    img.paste(lay, (int(center[0] - lay.width / 2), int(center[1] - lay.height / 2)), lay)


def base():
    img = Image.new('RGB', (1280, 720), BG)
    d = ImageDraw.Draw(img)
    im, m = logo(80)
    img.paste(im, (1170, 30), m)
    return img, d


def opt_a(out):  # Tiger's declined cheque
    img, d = base()
    d.text((60, 50), 'HE SAID NO TO', font=F('sansb', 52), fill=CREAM)
    d.text((50, 110), '$800M', font=F('serifb', 250), fill=MINT)
    # cheque strip
    d.rounded_rectangle([60, 420, 780, 560], radius=14, fill=PAPER)
    d.text((90, 440), 'PAY TO', font=F('sansb', 22), fill=INK2)
    d.text((90, 470), 'TIGER', font=F('serifb', 60), fill=INK)
    stamp(img, (560, 490), 'DECLINED', CORAL, 58, 8)
    d.text((70, 590), '...and HE won?', font=F('handb', 90), fill=AMBER)
    mascot(img, (880, 420), 290)
    img.save(out)


def opt_b(out):  # $5 billion, now gone
    img, d = base()
    d.text((60, 60), 'ONE WALLET SPENT', font=F('sansb', 50), fill=CREAM)
    d.text((50, 120), '$5 BILLION', font=fit_font(d, '$5 BILLION', 'serifb', 200, 1080), fill=MINT)
    stamp(img, (330, 470), 'LIQUIDATED', CORAL, 80, -6)
    d.text((70, 580), 'how?!', font=F('handb', 100), fill=AMBER)
    mascot(img, (880, 420), 290)
    img.save(out)


def opt_c(out):  # cents per dollar
    img, d = base()
    d.text((60, 60), '$5B IN.', font=F('serifb', 150), fill=CREAM)
    d.text((60, 230), 'LEFT:', font=F('sansb', 60), fill=MUTED)
    d.text((50, 290), '10¢?', font=F('serifb', 260), fill=CORAL)
    d.text((70, 600), 'per dollar', font=F('handb', 80), fill=AMBER)
    hand_underline(d, 70, 400, 700, 1.0, MINT, 8)
    mascot(img, (880, 420), 290)
    img.save(out)


opt_a(HERE + '/thumb_options/A_said_no_800M.png')
opt_b(HERE + '/thumb_options/B_5_billion_liquidated.png')
opt_c(HERE + '/thumb_options/C_10_cents_left.png')
# preview grid: full + 320x180
ims = [Image.open(HERE + '/thumb_options/' + f) for f in sorted(os.listdir(HERE + '/thumb_options')) if f.endswith('.png')]
g = Image.new('RGB', (1280 + 340, 720 * len(ims)), (60, 60, 60))
for i, im in enumerate(ims):
    g.paste(im, (0, i * 720)); g.paste(im.resize((320, 180), Image.LANCZOS), (1290, i * 720))
g.save('/tmp/claude-0/thumb_preview.png')
