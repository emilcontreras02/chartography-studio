"""Writes index.html (root composition) for the 3D rail-gaps Short: 3D world canvas + overlays + word captions + VO."""
import json, html, os
HERE = os.path.dirname(os.path.abspath(__file__))
DUR = 52.6
cw = json.load(open(f'{HERE}/captions_words.json'))  # [word, start, speaker]
KEYS = {'gap', 'gaps', 'january', 'july', 'thirty-nine', 'hundred', 'degrees', 'third', 'inch', 'sideways', 'sun', 'kink.', 'kink', 'clickety-clack', 'clickety-clack.', 'clickety-clack?', 'welded', 'comments.'}

# 3-word chunks (break at sentence ends)
chunks, cur = [], []
for w in cw:
    cur.append(w)
    if len(cur) == 3 or w[0][-1:] in '.?!,':
        chunks.append(cur); cur = []
if cur: chunks.append(cur)
cap = []
flat = [w for c in chunks for w in c]
nxt = {id(w): (flat[i + 1][1] if i + 1 < len(flat) else 50.9) for i, w in enumerate(flat)}
n = 0
for c in chunks:
    for wi, w in enumerate(c):
        t0 = w[1]; t1 = min(nxt[id(w)], t0 + 1.6)
        if t1 - t0 < 0.04: continue
        spans = []
        for j, x in enumerate(c):
            word = html.escape(x[0])
            k = x[0].lower().strip('.,?!')
            cls = 'on' if j == wi else ('key' if k in {kk.strip('.,?!') for kk in KEYS} else '')
            spans.append(f'<span class="{cls}">{word}</span>')
        cap.append(f'<div id="cap{n}" class="clip cap {w[2]}" data-start="{t0:.2f}" data-duration="{t1 - t0:.2f}" data-track-index="9">{" ".join(spans)}</div>')
        n += 1

page = f'''<!doctype html>
<html lang="en">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=1080, height=1920" />
<script src="lib/gsap.min.js"></script>
<style>
:root {{ --navy:#0b1f3a; --amber:#f2b84b; --mint:#4fd1a5; --coral:#ef6f61; --cream:#fbf4e6; }}
* {{ margin:0; padding:0; box-sizing:border-box; }}
html, body {{ width:1080px; height:1920px; overflow:hidden; background:#000; }}
#root {{ position:relative; width:100%; height:100%; font-family:'Montserrat', sans-serif; }}
#world {{ position:absolute; inset:0; width:1080px; height:1920px; z-index:0; }}
.badge {{ position:absolute; left:80px; top:250px; padding:18px 40px; border-radius:26px; font-weight:900; font-size:64px; letter-spacing:2px; color:var(--navy); z-index:5; box-shadow:0 10px 30px rgba(0,0,0,.35); }}
.hook {{ position:absolute; left:0; right:0; top:230px; text-align:center; z-index:5; font-family:'Archivo Black', sans-serif; font-size:104px; line-height:1.0; color:#fff; text-shadow:0 6px 0 var(--navy), 0 10px 40px rgba(0,0,0,.5); }}
.hook b {{ color:var(--amber); font-weight:400; }}
.card {{ position:absolute; left:70px; right:70px; top:300px; padding:40px 44px; border-radius:36px; background:rgba(11,31,58,.92); color:var(--cream); z-index:5; text-align:center; box-shadow:0 16px 50px rgba(0,0,0,.45); }}
.card h2 {{ font-weight:900; font-size:62px; color:var(--amber); }}
.card .big {{ font-family:'Archivo Black', sans-serif; font-size:116px; color:var(--mint); margin:10px 0; }}
.card p {{ font-weight:700; font-size:40px; }}
.card small {{ display:block; font-weight:400; font-size:30px; color:#9fb0c8; margin-top:12px; }}
.tag {{ position:absolute; left:0; right:0; margin:0 auto; width:fit-content; top:330px; padding:20px 50px; border-radius:24px; background:var(--coral); color:#fff; font-family:'Archivo Black', sans-serif; font-size:78px; z-index:5; white-space:nowrap; }}
.cta {{ position:absolute; left:80px; right:80px; top:300px; padding:46px 40px; border-radius:40px; background:var(--amber); color:var(--navy); text-align:center; z-index:6; box-shadow:0 18px 60px rgba(0,0,0,.45); }}
.cta p {{ font-weight:900; font-size:60px; line-height:1.15; }}
.cta .q {{ font-family:'Archivo Black', sans-serif; font-size:84px; margin:8px 0 14px; }}
.cta small {{ font-weight:700; font-size:44px; }}
.cap {{ position:absolute; left:60px; right:60px; top:1130px; text-align:center; z-index:8; font-weight:900; font-size:86px; line-height:1.1; color:#fff; -webkit-text-stroke:10px var(--navy); paint-order:stroke fill; }}
.cap span {{ display:inline-block; padding:0 10px; border-radius:16px; }}
.cap span.key {{ color:var(--mint); }}
.cap span.on {{ background:var(--amber); color:var(--navy); -webkit-text-stroke:0; }}
.src {{ position:absolute; left:0; right:0; margin:0 auto; width:fit-content; max-width:1000px; bottom:70px; padding:8px 18px; border-radius:12px; background:rgba(11,31,58,.78); text-align:center; z-index:7; font-weight:400; font-size:28px; color:#fff; }}
.logo {{ position:absolute; right:56px; top:96px; z-index:7; font-weight:900; font-size:30px; color:#fff; text-shadow:0 2px 8px rgba(0,0,0,.6); letter-spacing:1px; }}
.note {{ position:absolute; left:0; right:0; top:860px; text-align:center; z-index:5; font-weight:700; font-size:30px; color:#fff; text-shadow:0 2px 8px rgba(0,0,0,.8); }}
</style>
</head>
<body>
<div id="root" data-composition-id="main" data-start="0" data-duration="{DUR}" data-width="1080" data-height="1920">
  <canvas id="world" class="clip" width="1080" height="1920" data-start="0" data-duration="{DUR}" data-track-index="0"></canvas>
  <audio id="vo" src="assets/vo.mp3" data-start="0" data-duration="50.70" data-track-index="10"></audio>

  <div id="hook" class="clip hook" data-start="0" data-duration="2.0" data-track-index="1"><div id="hook-in">WHY DO RAILS<br><b>HAVE GAPS?</b></div></div>
  <div id="jan" class="clip badge" style="background:#9cc8f0" data-start="5.05" data-duration="9.95" data-track-index="2">JANUARY</div>
  <div id="jul" class="clip badge" style="background:var(--coral);color:#fff" data-start="15.0" data-duration="4.0" data-track-index="2">JULY</div>
  <div id="num" class="clip card" data-start="19.1" data-duration="4.9" data-track-index="3"><div id="num-in">
    <h2>ONE 39-FOOT RAIL</h2><p>+100°F of warming</p><div class="big">+0.3 inch</div>
    <small>468 in × 0.0000065 per °F × 100°F ≈ 0.30 in</small></div></div>
  <div id="exag" class="clip note" data-start="20.4" data-duration="3.6" data-track-index="4">growth exaggerated so you can see it</div>
  <div id="kink" class="clip tag" data-start="29.9" data-duration="2.1" data-track-index="3">SUN KINK</div>
  <div id="today" class="clip badge" style="background:var(--mint)" data-start="37.6" data-duration="3.4" data-track-index="2">TODAY: WELDED RAIL</div>
  <div id="sft" class="clip card" data-start="43.0" data-duration="3.3" data-track-index="3"><div id="sft-in">
    <p>heated or stretched, then clamped</p><div class="big" style="color:var(--amber)">~95–109°F</div><p>stress-free temperature (US)</p></div></div>
  <div id="cta" class="clip cta" data-start="46.5" data-duration="{DUR - 46.5:.1f}" data-track-index="5"><div id="cta-in">
    <p>Did you know that's why old trains went</p><div class="q">clickety-clack?</div><small>Tell me in the comments ↓</small></div></div>

  {chr(10).join('  ' + c for c in cap)}

  <div id="src" class="clip src" data-start="0" data-duration="{DUR}" data-track-index="11">Sources: FRA CWR plan (0.0000065/°F) · Wikipedia, Rail stressing · Practical Engineering, Dec 5 2023</div>
  <div id="logo" class="clip logo" data-start="0" data-duration="{DUR}" data-track-index="12">CHARTOGRAPHY</div>
</div>
<script type="module" src="scene3d.js"></script>
<script>
  const tl = gsap.timeline({{ paused: true }});
  const pop = (sel, t) => tl.fromTo(sel, {{ scale: 0.6, opacity: 0, y: 40 }}, {{ scale: 1, opacity: 1, y: 0, duration: 0.35, ease: 'back.out(2)' }}, t);
  pop('#hook-in', 0.05); pop('#num-in', 19.1); pop('#sft-in', 43.0); pop('#cta-in', 46.5);
  tl.fromTo('#jan', {{ x: -400 }}, {{ x: 0, duration: 0.3, ease: 'power3.out' }}, 5.05);
  tl.fromTo('#jul', {{ x: -400 }}, {{ x: 0, duration: 0.3, ease: 'power3.out' }}, 15.0);
  tl.fromTo('#today', {{ x: -600 }}, {{ x: 0, duration: 0.3, ease: 'power3.out' }}, 37.6);
  tl.fromTo('#kink', {{ scale: 2.2, opacity: 0 }}, {{ scale: 1, opacity: 1, duration: 0.25, ease: 'power4.out' }}, 29.9);
  window.__timelines = window.__timelines || {{}};
  window.__timelines["main"] = tl;
  tl.seek(0);
</script>
</body>
</html>
'''
open(f'{HERE}/index.html', 'w').write(page)
print('captions', n)
