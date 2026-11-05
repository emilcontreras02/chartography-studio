import sys; sys.path.insert(0,'/home/claude/chartography-studio')
from chartography_engine import *
from PIL import Image, ImageDraw
OUT=sys.argv[1]
img=Image.new('RGB',(1280,720),BG); d=ImageDraw.Draw(img)
d.text((70,55),"ELON SPLITS $869B WITH YOU",font=F('sansb',44),fill=MINT)
f1=F('serifb',240); d.text((60,105),"$104",font=f1,fill=CREAM); print('104',d.textbbox((60,105),"$104",font=f1))
d.line([(598,378),(648,418)],fill=CORAL,width=16); d.polygon([(628,440),(678,440),(668,392)],fill=CORAL)
f2=F('serifb',170); d.text((690,270),"$20?",font=f2,fill=CORAL); print('20',d.textbbox((690,270),"$20?",font=f2))
fh=F('handb',112); d.text((70,545),"...then it crashes",font=fh,fill=AMBER); print('hand',d.textbbox((70,545),"...then it crashes",font=fh))
hand_underline(d,80,690,678,1.0,AMBER,10)
m=Image.open('assets/mascot_sticker.png'); w=400; m=m.resize((w,int(m.height*w/m.width)),Image.LANCZOS)
x,y=1280-w+10,720-m.height+40; print('mascot',x,y,x+w,y+m.height)
img.paste(m,(x,y),m)
img.save(OUT+'/elon_mascot.png'); img.resize((320,180),Image.LANCZOS).save(OUT+'/elon_mascot_small.png')
