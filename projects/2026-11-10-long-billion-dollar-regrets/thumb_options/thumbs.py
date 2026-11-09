import sys, os
sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', '..', '..'))
from chartography_engine import *
from PIL import Image, ImageDraw
OUT = os.path.dirname(os.path.abspath(__file__))
PAPER = (240, 229, 203); INK = (44, 44, 52)
def paper(d, box, tilt_pts=None):
    x0, y0, x1, y1 = box
    pts = [(x0, y0), (x1, y0), (x1, y1)]
    for i in range(12, -1, -1):
        pts.append((x0 + (x1 - x0) * i / 12, y1 + (12 if i % 2 else 0)))
    d.polygon(pts, fill=PAPER)
def base():
    img = Image.new('RGB', (1280, 720), BG); d = ImageDraw.Draw(img)
    im, m = logo(80); img.paste(im, (1170, 30), m); return img, d
def save(img, name):
    img.save(f'{OUT}/{name}.png'); img.resize((320, 180), Image.LANCZOS).save(f'{OUT}/{name}_small.png')

# A: $800 receipt -> $500 BILLION
img, d = base()
d.text((60, 50), 'SOLD 10% OF APPLE FOR...', font=F('sansb', 46), fill=MINT)
paper(d, (60, 130, 430, 520))
d.text((245, 190), 'RECEIPT 1976', font=F('sansb', 30), fill=INK, anchor='mm')
d.text((245, 340), '$800', font=F('serifb', 130), fill=INK, anchor='mm')
d.line([(470, 330), (580, 330)], fill=AMBER, width=18); d.polygon([(575, 300), (625, 330), (575, 360)], fill=AMBER)
d.text((640, 200), '$500', font=F('serifb', 210), fill=MINT)
d.text((650, 415), 'BILLION', font=F('serifb', 100), fill=MINT)
d.text((70, 590), 'today?!', font=F('handb', 110), fill=AMBER)
mascot(img, (1015, 505), 210)
save(img, 'A_apple_800')

# B: two pizzas
img, d = base()
d.text((60, 50), '2 PIZZAS IN 2010', font=F('sansb', 50), fill=MINT)
paper(d, (60, 130, 470, 500))
d.text((265, 190), 'MAY 22, 2010', font=F('sansb', 30), fill=INK, anchor='mm')
d.text((265, 300), '10,000', font=F('serifb', 100), fill=INK, anchor='mm')
d.text((265, 400), 'BITCOIN', font=F('sansb', 52), fill=INK, anchor='mm')
d.line([(500, 320), (600, 320)], fill=AMBER, width=18); d.polygon([(595, 290), (645, 320), (595, 350)], fill=AMBER)
d.text((660, 190), '$742', font=F('serifb', 200), fill=CORAL)
d.text((670, 400), 'MILLION', font=F('serifb', 92), fill=CORAL)
d.text((70, 580), 'worst dinner ever?', font=F('handb', 96), fill=AMBER)
mascot(img, (1015, 505), 210)
save(img, 'B_pizza_742m')

# C: they said NO
img, d = base()
d.text((60, 50), 'THEY SAID NO TO...', font=F('sansb', 50), fill=MINT)
for i, (yr, amt) in enumerate([('1999', 'GOOGLE $750K'), ('2000', 'NETFLIX $50M')]):
    y = 140 + i * 190
    paper(d, (60, 140 + i * 190, 520, 300 + i * 190))
    d.text((90, y + 30), yr, font=F('sansb', 34), fill=INK)
    d.text((90, y + 85), amt, font=F('sansb', 42), fill=INK)
    d.rounded_rectangle([410, y + 20, 505, y + 80], radius=10, outline=CORAL, width=7)
    d.text((457, y + 50), 'NO', font=F('sansb', 40), fill=CORAL, anchor='mm')
d.text((600, 200), '$3.7', font=F('serifb', 200), fill=MINT)
d.text((610, 405), 'TRILLION', font=F('serifb', 86), fill=MINT)
d.text((70, 580), 'what they missed', font=F('handb', 96), fill=AMBER)
mascot(img, (1015, 505), 210)
save(img, 'C_said_no')
