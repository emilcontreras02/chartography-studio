import sys, os, math
sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', '..', '..'))
from chartography_engine import *
from PIL import Image, ImageDraw
OUT = os.path.dirname(os.path.abspath(__file__))
def base():
    img = Image.new('RGB', (1280, 720), BG); d = ImageDraw.Draw(img)
    im, m = logo(80); img.paste(im, (1170, 30), m); return img, d
def save(img, name):
    img.save(f'{OUT}/{name}.png'); img.resize((320, 180), Image.LANCZOS).save(f'{OUT}/{name}_small.png')
def bubble(d, cx, cy, r):
    d.ellipse([cx - r, cy - r, cx + r, cy + r], outline=MINT, width=12)
    d.arc([cx - r * 0.85, cy - r * 0.85, cx + r * 0.85, cy + r * 0.85], 205, 240, fill=CREAM, width=14)

# A: the $1T bubble and a pin
img, d = base()
bubble(d, 430, 380, 300)
d.text((430, 330), '$1', font=F('serifb', 190), fill=MINT, anchor='mm')
d.text((430, 470), 'TRILLION', font=F('serifb', 76), fill=MINT, anchor='mm')
d.line([(760, 110), (690, 200)], fill=CREAM, width=10)   # pin
d.ellipse([742, 86, 786, 130], fill=CORAL)
d.text((790, 180), 'AI', font=F('serifb', 150), fill=CREAM)
d.text((790, 330), 'POP?', font=F('serifb', 150), fill=CORAL)
mascot(img, (1015, 505), 210)
save(img, 'A_bubble_pin')

# B: the gauge in the red
img, d = base()
cx, cy, r = 400, 470, 300
d.arc([cx - r, cy - r, cx + r, cy + r], 180, 360, fill=SLATE, width=60)
d.arc([cx - r, cy - r, cx + r, cy + r], 180, 180 + 180 * 0.85, fill=CORAL, width=60)
ang = math.radians(180 + 180 * 0.85)
d.line([(cx, cy), (cx + math.cos(ang) * r * 0.8, cy + math.sin(ang) * r * 0.8)], fill=CREAM, width=14)
d.ellipse([cx - 22, cy - 22, cx + 22, cy + 22], fill=CREAM)
d.text((cx, cy + 90), 'BUBBLE METER', font=F('sansb', 44), fill=MUTED, anchor='mm')
d.text((740, 140), 'AI', font=F('serifb', 160), fill=CREAM)
d.text((740, 310), '-$3T', font=F('serifb', 150), fill=CORAL)
d.text((740, 500), 'in 1 day', font=F('handb', 80), fill=AMBER)
mascot(img, (1015, 505), 210)
save(img, 'B_bubble_meter')
