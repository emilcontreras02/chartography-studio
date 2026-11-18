import sys, os
HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.join(HERE, '..', '..'))
import chartography_engine as ce
from chartography_engine import F, MINT, AMBER, CREAM, MUTED, PANEL, CORAL, SLATE, BG
from PIL import Image, ImageDraw
import hero

def base():
    img = Image.new('RGB', (1280, 720), BG); return img, ImageDraw.Draw(img)

def guy(img, pose='point', face='shock', x=1120, h=470, flip=True):
    hero.paste(img, (x, 708), h, pose=pose, face=face, flip=flip, bob=False)

# A: the President's $400,000 on top of a pay ladder, "#1 highest paid" crossed out, someone beats it
img, d = base()
for i in range(4):
    y = 40 + i * 64
    w = 760 - i * 70
    d.rounded_rectangle([40, y, 40 + w, y + 50], radius=12, fill=AMBER if i == 0 else PANEL)
    d.text((60, y + 25), f'#{i + 1}', font=F('sansb', 30), fill=BG if i == 0 else MUTED, anchor='lm')
d.text((130, 65), 'THE PRESIDENT', font=F('sansb', 30), fill=BG, anchor='lm')
d.text((40, 300), '$400,000', font=F('serifb', 165), fill=MINT)
d.text((50, 540), 'HIGHEST PAID', font=F('sansb', 64), fill=CREAM)
wl = d.textlength('HIGHEST PAID', font=F('sansb', 64))
d.line([(40, 578), (60 + wl, 578)], fill=CORAL, width=14)
d.text((60, 640), 'someone beats this...', font=F('hand', 70), fill=AMBER, anchor='lm')
guy(img)
img.save(HERE + '/thumb_options/A_president_beaten.png')

# B: giant TOP 10 government paychecks, #1 is...?
img, d = base()
d.text((40, 0), 'TOP 10', font=F('serifb', 220), fill=CREAM)
d.text((50, 250), 'GOVERNMENT PAYCHECKS', font=F('sansb', 58), fill=MINT)
d.text((50, 360), '#1 IS...?', font=F('serifb', 170), fill=AMBER)
d.text((60, 600), "(it's not who you think)", font=F('hand', 64), fill=CREAM)
guy(img, pose='think', face='worry', flip=False)
img.save(HERE + '/thumb_options/B_top10.png')

# C: x23 the President - who?
img, d = base()
d.text((40, 40), 'x 23', font=F('serifb', 300), fill=CORAL)
d.text((50, 380), "THE PRESIDENT'S PAY", font=F('sansb', 64), fill=CREAM)
d.text((50, 470), '$400,000', font=F('serifb', 110), fill=SLATE)
d.text((60, 650), 'who earns this?', font=F('hand', 80), fill=AMBER, anchor='lm')
guy(img)
img.save(HERE + '/thumb_options/C_x23.png')

for n in ['A_president_beaten', 'B_top10', 'C_x23']:
    im = Image.open(f'{HERE}/thumb_options/{n}.png')
    im.resize((320, 180), Image.LANCZOS).save(f'/tmp/claude-0/{n}_small.png')
