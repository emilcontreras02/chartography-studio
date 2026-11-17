import sys, os
sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', '..'))
import chartography_engine as ce
from chartography_engine import F, MINT, AMBER, CREAM, MUTED, PANEL, CORAL, SLATE, BG, EMPTY
from PIL import Image, ImageDraw

def hat(d, cx, cy, s, col):
    d.pieslice([cx - s * 0.5, cy - s * 0.45, cx + s * 0.5, cy + s * 0.55], 180, 360, fill=col)
    d.rounded_rectangle([cx - s * 0.7, cy + s * 0.02, cx + s * 0.7, cy + s * 0.16], radius=6, fill=col)
    d.rectangle([cx - s * 0.06, cy - s * 0.45, cx + s * 0.06, cy], fill=BG)

def X(d, cx, cy, s, w=12):
    d.line([(cx - s, cy - s), (cx + s, cy + s)], fill=CORAL, width=w)
    d.line([(cx + s, cy - s), (cx - s, cy + s)], fill=CORAL, width=w)

def base():
    img = Image.new('RGB', (1280, 720), BG); return img, ImageDraw.Draw(img)

# A: '#1 IS...?' + 0.49 + ladder with ? on top
img, d = base()
for r in range(1, 11):
    y = 40 + (r - 1) * 62
    fill = (40, 66, 98) if r == 1 else PANEL
    d.rounded_rectangle([40, y, 300, y + 52], radius=12, fill=fill, outline=AMBER if r == 1 else None, width=4)
    d.text((60, y + 26), f'#{r}', font=F('sansb', 30), fill=AMBER, anchor='lm')
    if r == 1:
        d.text((200, y + 26), '?', font=F('sansb', 44), fill=AMBER, anchor='mm')
    else:
        d.rounded_rectangle([120, y + 18, 120 + 150 - r * 8, y + 34], radius=8, fill=SLATE)
d.text((350, 30), '#1 IS...?', font=F('serifb', 150), fill=CREAM)
d.text((350, 210), '0.49', font=F('serifb', 250), fill=MINT)
d.text((360, 500), 'AI score', font=F('sansb', 40), fill=MUTED)
hat(d, 420, 615, 110, SLATE); X(d, 420, 615, 62)
d.text((510, 600), "it's a desk job...", font=F('hand', 60), fill=AMBER, anchor='lm')
ce.mascot(img, (870, 420), 290)
img.save('thumb_options/A_one_is.png')

# B: giant TOP 10 + crossed-out guess
img, d = base()
d.text((50, 10), 'TOP 10', font=F('serifb', 230), fill=CREAM)
d.text((60, 270), 'jobs AI can already do', font=F('sansb', 56), fill=MINT)
d.text((60, 380), 'FACTORY', font=F('serifb', 130), fill=SLATE)
w = d.textlength('FACTORY', font=F('serifb', 130))
d.line([(50, 450), (70 + w, 450)], fill=CORAL, width=16)
d.text((80, 560), '#1 is... ?', font=F('hand', 110), fill=AMBER)
ce.mascot(img, (870, 420), 290)
img.save('thumb_options/B_top10_crossed.png')

# C: #1 vs #10 gap and 2.86M crowd
img, d = base()
d.text((60, 40), '0.49', font=F('serifb', 230), fill=MINT)
d.text((70, 300), '#1 = ?', font=F('serifb', 110), fill=CREAM)
d.text((620, 90), 'vs', font=F('hand', 90), fill=MUTED)
d.text((760, 60), '0.39', font=F('serifb', 150), fill=SLATE)
d.text((780, 240), '#10', font=F('sansb', 60), fill=MUTED)
d.text((70, 470), '2.86M', font=F('serifb', 140), fill=AMBER)
d.text((80, 640), 'jobs in the middle', font=F('hand', 56), fill=CREAM)
ce.mascot(img, (870, 420), 290)
img.save('thumb_options/C_gap.png')

for n in ['A_one_is', 'B_top10_crossed', 'C_gap']:
    im = Image.open(f'thumb_options/{n}.png')
    sm = im.resize((320, 180), Image.LANCZOS)
    im.paste(Image.new('RGB', (0, 0)), (0, 0))
sheet = Image.new('RGB', (1280 + 340, 720 * 3 + 40), (60, 60, 60))
for i, n in enumerate(['A_one_is', 'B_top10_crossed', 'C_gap']):
    im = Image.open(f'thumb_options/{n}.png')
    sheet.paste(im, (0, i * 740))
    sheet.paste(im.resize((320, 180), Image.LANCZOS), (1290, i * 740))
sheet.save('/tmp/claude-0/thumbs.png')
