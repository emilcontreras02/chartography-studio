"""Cut vertical Shorts (1080x1920) from the long-form: blurred fill, video in the middle, hook title on top, CTA at the bottom."""
import os, subprocess
from PIL import Image, ImageDraw, ImageFont

D = os.path.dirname(os.path.abspath(__file__))
SRC = '/home/claude/mjsc/cursed-trumpets/rm/out/Cursed-Trumpets-MJ-Sound-Chronicles.mp4'
F = lambda s: ImageFont.truetype(os.path.join(D, 'Archivo.ttf'), s)
H = lambda s: ImageFont.truetype(os.path.join(D, 'Caveat.ttf'), s)

SHORTS = [
    ('01-the-broadcast-went-wrong', [(150.4, 178.6)], ['THE BROADCAST', 'THAT WENT WRONG']),
    ('02-stolen-cursed-trumpet', [(240.2, 274.2)], ['THE CURSED TRUMPET', 'WAS STOLEN']),
    ('03-play-it-war-follows', [(0.4, 29.0), (218.4, 238.4)], ['PLAY IT AND', 'WAR FOLLOWS?']),
]

def outlined(d, xy, text, font, fill, stroke=14):
    d.text(xy, text, font=font, fill=fill, anchor='mm', stroke_width=stroke, stroke_fill=(42, 29, 20))

def overlay(lines, path):
    im = Image.new('RGBA', (1080, 1920), (0, 0, 0, 0))
    d = ImageDraw.Draw(im)
    for i, (ln, col) in enumerate(zip(lines, [(255, 255, 255), (255, 207, 74)])):
        f = F(96)
        while d.textlength(ln, font=f) > 1000: f = F(f.size - 4)
        outlined(d, (540, 330 + i * 130), ln, f, col)
    # CTA block
    d.rounded_rectangle((190, 1440, 890, 1580), 34, fill=(216, 52, 43), outline=(42, 29, 20), width=8)
    outlined(d, (540, 1512), 'SUBSCRIBE', F(78), (255, 255, 255), 0)
    outlined(d, (540, 1680), 'full story on MJ Sound Chronicles', H(78), (255, 246, 230), 8)
    im.save(path)

for name, segs, title in SHORTS:
    out = os.path.join(D, f'{name}.mp4')
    if os.path.exists(out): continue
    ov = os.path.join(D, f'{name}.png'); overlay(title, ov)
    parts = []
    for i, (a, b) in enumerate(segs):
        p = os.path.join(D, f'{name}.part{i}.mp4')
        dur = b - a
        fade = f'afade=t=in:d=0.25,afade=t=out:st={dur - 0.5:.2f}:d=0.5'
        subprocess.run(['ffmpeg', '-y', '-loglevel', 'error', '-ss', str(a), '-t', f'{dur:.2f}', '-i', SRC, '-i', ov, '-filter_complex',
            '[0:v]split[a][b];[a]scale=-2:1920,crop=1080:1920,boxblur=24:2,eq=brightness=-0.18[bg];'
            '[b]scale=1080:-2[fg];[bg][fg]overlay=0:700[v1];[v1][1:v]overlay=0:0,format=yuv420p,'
            f'fade=t=in:d=0.25,fade=t=out:st={dur - 0.3:.2f}:d=0.3[v]',
            '-map', '[v]', '-map', '0:a', '-af', fade, '-c:v', 'libx264', '-crf', '20', '-preset', 'veryfast', '-r', '30',
            '-c:a', 'aac', '-b:a', '192k', '-ar', '48000', p], check=True)
        parts.append(p)
    lst = os.path.join(D, f'{name}.txt')
    open(lst, 'w').write(''.join(f"file '{p}'\n" for p in parts))
    tmp = out.replace('.mp4', '.tmp.mp4')
    subprocess.run(['ffmpeg', '-y', '-loglevel', 'error', '-f', 'concat', '-safe', '0', '-i', lst, '-c', 'copy', '-movflags', '+faststart', tmp], check=True)
    os.rename(tmp, out)
    for p in parts: os.remove(p)
    os.remove(lst)
    print(name, 'done')
