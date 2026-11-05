import sys; sys.path.insert(0,'/home/claude/chartography-studio')
import chartography_engine as ce
from chartography_engine import *
from PIL import Image, ImageDraw
OUT=sys.argv[1]
def base():
    img=Image.new('RGB',(1280,720),BG); d=ImageDraw.Draw(img)
    im,m=logo(80); img.paste(im,(1170,30),m); return img,d
def stamp(img,name):
    img.save(f'{OUT}/{name}.png')
    sm=img.resize((320,180),Image.LANCZOS); sm.save(f'{OUT}/{name}_small.png')

# A: the drop  $104 -> $20?
img,d=base()
d.text((70,60),"ELON SPLITS $869B WITH YOU",font=F('sansb',44),fill=MINT)
d.text((60,130),"$104",font=F('serifb',250),fill=CREAM)
# arrow down-right
d.line([(625,335),(700,405)],fill=CORAL,width=18); d.polygon([(675,428),(728,430),(722,376)],fill=CORAL)
d.text((740,300),"$20?",font=F('serifb',200),fill=CORAL)
d.text((70,540),"...then it crashes",font=F('handb',120),fill=AMBER)
hand_underline(d,80,700,680,1.0,AMBER,10)
stamp(img,'A_drop')

# B: giant tower vs tiny coin
img,d=base()
d.rounded_rectangle([90,90,330,660],radius=24,fill=MINT)
d.text((210,370),"$869B",font=F('serifb',72),fill=BG,anchor='mm')
coin(d,520,615,34)
d.text((520,540),"YOU",font=F('sansb',34),fill=MUTED,anchor='mm')
d.text((640,120),"Your share:",font=F('sansb',56),fill=MUTED)
d.text((630,170),"$104",font=F('serifb',250),fill=AMBER)
d.text((640,470),"That's it?!",font=F('handb',130),fill=CREAM)
stamp(img,'B_tower')

# C: question + catch
img,d=base()
d.text((70,70),"IF ELON GAVE IT ALL AWAY...",font=F('sansb',46),fill=MINT)
d.text((60,150),"$104",font=F('serifb',270),fill=AMBER)
d.text((780,250),"each.",font=F('serif',120),fill=CREAM)
d.rounded_rectangle([70,520,820,660],radius=26,fill=CORAL)
d.text((445,590),"BUT THERE'S A CATCH",font=F('sansb',58),fill=BG,anchor='mm')
d.text((850,470),"?",font=F('serifb',190),fill=CORAL)
stamp(img,'C_catch')
