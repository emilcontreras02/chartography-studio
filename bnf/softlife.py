"""Soft Life Talks renderer (Bought & Found YouTube long-form, 16:9).

Usage: python3 softlife.py <episode_dir> <image_dir>
Episode dir needs: script.txt (paragraphs separated by blank lines), vo.mp3, words.json (ce.transcribe),
meta.json: {"title": "...", "chips": {"<para index>": "1 · Protect your first 10 minutes", ...},
            "images": ["host03.jpg", ...]  (one per paragraph, optional)}
Writes final.mp4 (1920x1080, 30 fps) and thumb.jpg.
"""
import json, os, re, subprocess, sys

W, H, FPS = 1920, 1080, 30
XF = 0.8          # crossfade seconds
TAIL = 3.5        # seconds of end card after the last word
LEAD = 0.6        # silence before the voice starts


def run(cmd):
    subprocess.run(cmd, check=True)


def norm(w):
    return re.sub(r"[^a-z0-9']", '', w.lower().replace('’', "'"))


def align(script_words, heard):
    """Give every script word a start time from the transcript (greedy, with lookahead)."""
    times, j = [], 0
    for sw in script_words:
        n = norm(sw)
        hit = None
        for k in range(j, min(j + 4, len(heard))):
            h = heard[k][0]
            if h == n or (n and (h.startswith(n[:4]) or n.startswith(h[:4]))) or n.replace("'", '') == h.replace("'", ''):
                hit = k
                break
        if hit is not None:
            times.append(heard[hit][1])
            j = hit + 1
        else:
            times.append(None)
    # fill gaps by interpolation
    for i, t in enumerate(times):
        if t is None:
            prev = next((times[p] for p in range(i - 1, -1, -1) if times[p] is not None), 0.0)
            nxt = next((times[p] for p in range(i + 1, len(times)) if times[p] is not None), prev + 0.4)
            times[i] = (prev + nxt) / 2
    return times


def ass_time(t):
    t = max(0, t)
    h = int(t // 3600); m = int(t % 3600 // 60); s = t % 60
    return f'{h}:{m:02d}:{s:05.2f}'


def esc(s):
    return s.replace('{', '(').replace('}', ')')


def main(ep, imgdir):
    script = open(os.path.join(ep, 'script.txt')).read().strip()
    meta = json.load(open(os.path.join(ep, 'meta.json')))
    heard = json.load(open(os.path.join(ep, 'words.json')))
    vo = os.path.join(ep, 'vo.mp3')
    dur_vo = float(subprocess.run(['ffprobe', '-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', vo],
                                  capture_output=True, text=True).stdout)
    paras = [p.strip() for p in script.split('\n\n') if p.strip()]
    words, para_of = [], []
    for pi, p in enumerate(paras):
        for w in p.split():
            words.append(w); para_of.append(pi)
    t = [x + LEAD for x in align(words, heard)]
    total = LEAD + dur_vo + TAIL

    # paragraph start times -> image segments
    pstart = []
    for pi in range(len(paras)):
        pstart.append(t[para_of.index(pi)] - 0.3)
    pstart[0] = 0.0
    images = meta.get('images') or sorted(f for f in os.listdir(imgdir) if f.lower().endswith('.jpg') and not f.startswith('_'))
    segs = []
    for pi in range(len(paras)):
        st = pstart[pi]
        en = pstart[pi + 1] if pi + 1 < len(paras) else total
        segs.append((images[pi % len(images)], st, en))

    # 1) one Ken Burns clip per segment (each extended by XF so crossfades overlap)
    clips = []
    for i, (img, st, en) in enumerate(segs):
        d = (en - st) + (XF if i < len(segs) - 1 else 0)
        n = int(round(d * FPS))
        out = os.path.join(ep, f'_seg{i:02d}.mp4')
        zin = i % 2 == 0
        z = f"'1.0+0.08*on/{n}'" if zin else f"'1.08-0.08*on/{n}'"
        # pan direction alternates slightly
        x = "'iw/2-(iw/zoom/2)+%s*on/%d'" % ('20' if i % 3 == 0 else '-20' if i % 3 == 1 else '0', n)
        vf = (f"scale=3840:2160,zoompan=z={z}:x={x}:y='ih/2-(ih/zoom/2)':d={n}:s={W}x{H}:fps={FPS},"
              f"eq=saturation=1.03,format=yuv420p")
        run(['ffmpeg', '-y', '-loglevel', 'error', '-loop', '1', '-i', os.path.join(imgdir, img), '-vf', vf,
             '-frames:v', str(n), '-c:v', 'libx264', '-preset', 'veryfast', '-crf', '18', out])
        clips.append((out, d))

    # 2) crossfade chain
    inputs, fc, prev, off = [], [], '0:v', 0.0
    for i, (c, d) in enumerate(clips):
        inputs += ['-i', c]
    acc = clips[0][1]
    for i in range(1, len(clips)):
        off = acc - XF
        lab = f'v{i}'
        fc.append(f'[{prev}][{i}:v]xfade=transition=fade:duration={XF}:offset={off:.3f}[{lab}]')
        prev = lab
        acc = off + clips[i][1]
    bg = os.path.join(ep, '_bg.mp4')
    run(['ffmpeg', '-y', '-loglevel', 'error', *inputs, '-filter_complex', ';'.join(fc), '-map', f'[{prev}]',
         '-c:v', 'libx264', '-preset', 'veryfast', '-crf', '18', '-t', f'{total:.3f}', bg])

    # 3) subtitles + chips + title + end card (ASS)
    show = meta.get('show', 'Soft Life Talks')
    ass = [
        '[Script Info]', 'ScriptType: v4.00+', f'PlayResX: {W}', f'PlayResY: {H}', 'WrapStyle: 2', '',
        '[V4+ Styles]',
        'Format: Name, Fontname, Fontsize, PrimaryColour, SecondaryColour, OutlineColour, BackColour, Bold, Italic, Underline, StrikeOut, ScaleX, ScaleY, Spacing, Angle, BorderStyle, Outline, Shadow, Alignment, MarginL, MarginR, MarginV, Encoding',
        'Style: Sub,Poppins,62,&H00FFFFFF,&H00FFFFFF,&H00302520,&H8C000000,1,0,0,0,100,100,0,0,1,3.2,2,2,160,160,70,1',
        'Style: Chip,Poppins,46,&H00302520,&H00302520,&H00F2F6FA,&H00F2F6FA,1,0,0,0,100,100,0,0,3,18,0,7,90,90,80,1',
        'Style: Brand,Poppins,34,&H00FFFFFF,&H00FFFFFF,&H00302520,&H64000000,1,0,0,0,100,100,1,0,1,2,1,9,70,70,50,1',
        'Style: Title,Poppins,92,&H00FFFFFF,&H00FFFFFF,&H00302520,&H96000000,1,0,0,0,100,100,0,0,1,4,3,5,180,180,0,1',
        'Style: End,Poppins,64,&H00FFFFFF,&H00FFFFFF,&H00302520,&H96000000,1,0,0,0,100,100,0,0,1,3.5,3,5,200,200,0,1',
        '', '[Events]', 'Format: Layer, Start, End, Style, Name, MarginL, MarginR, MarginV, Effect, Text']
    # caption chunks: up to 6 words, break at punctuation, max ~38 chars
    chunks, cur = [], []
    for i, w in enumerate(words):
        cur.append(i)
        txt = ' '.join(words[k] for k in cur)
        end_punct = re.search(r'[.?!:,;"]$', w)
        nxt_para = i + 1 < len(words) and para_of[i + 1] != para_of[i]
        if len(cur) >= 6 or len(txt) >= 34 or end_punct or nxt_para or i == len(words) - 1:
            chunks.append(cur); cur = []
    for ci, ch in enumerate(chunks):
        st = t[ch[0]]
        en = t[chunks[ci + 1][0]] if ci + 1 < len(chunks) else LEAD + dur_vo
        en = min(en, st + 4.5) if ci + 1 < len(chunks) else en
        txt = esc(' '.join(words[k] for k in ch))
        ass.append(f'Dialogue: 0,{ass_time(st)},{ass_time(en - 0.02)},Sub,,0,0,0,,{{\\fad(80,60)}}{txt}')
    # brand label (whole video except title + end)
    ass.append(f'Dialogue: 0,{ass_time(4.0)},{ass_time(LEAD + dur_vo)},Brand,,0,0,0,,{{\\fad(400,400)}}{esc(show).upper()}')
    # title card over the hook
    ass.append(f'Dialogue: 1,{ass_time(0.2)},{ass_time(3.8)},Title,,0,0,0,,{{\\fad(300,500)\\pos({W//2},{H//2 - 110})}}{esc(meta["title"])}')
    # section chips
    for pi_s, label in meta.get('chips', {}).items():
        pi = int(pi_s)
        st = t[para_of.index(pi)]
        en = (t[para_of.index(pi + 1)] if pi + 1 < len(paras) else LEAD + dur_vo) - 0.4
        ass.append(f'Dialogue: 2,{ass_time(st)},{ass_time(en)},Chip,,0,0,0,,{{\\fad(300,300)}}{esc(label)}')
    # end card
    ass.append(f'Dialogue: 3,{ass_time(LEAD + dur_vo + 0.2)},{ass_time(total)},End,,0,0,0,,{{\\fad(400,300)}}'
               f'New talk every Wednesday and Sunday\\N{{\\fs44}}Subscribe so you don\'t miss the next one')
    assf = os.path.join(ep, 'subs.ass')
    open(assf, 'w').write('\n'.join(ass) + '\n')

    final = os.path.join(ep, 'final.mp4')
    run(['ffmpeg', '-y', '-loglevel', 'error', '-i', bg, '-itsoffset', str(LEAD), '-i', vo,
         '-filter_complex', f"[0:v]ass={assf}[v];[1:a]apad,atrim=0:{total:.3f}[a]", '-map', '[v]', '-map', '[a]',
         '-c:v', 'libx264', '-preset', 'veryfast', '-crf', '20', '-pix_fmt', 'yuv420p', '-c:a', 'aac', '-b:a', '160k',
         '-movflags', '+faststart', '-t', f'{total:.3f}', final])
    for f in os.listdir(ep):
        if f.startswith('_seg') or f == '_bg.mp4':
            os.remove(os.path.join(ep, f))
    json.dump({'duration': round(total, 2), 'para_starts': [round(x, 2) for x in pstart]},
              open(os.path.join(ep, 'timing.json'), 'w'))
    print('final', final, round(total, 1), 's')


if __name__ == '__main__':
    main(sys.argv[1], sys.argv[2])
