import React from 'react';
import {AbsoluteFill, Audio, Composition, Img, interpolate, spring, staticFile, useCurrentFrame, Easing} from 'remotion';
import T from './timing.json';
import '@fontsource/archivo-black/latin-400.css';
import '@fontsource/fira-sans/latin-400.css';
import '@fontsource/fira-sans/latin-700.css';

// CUT Short (Nov 28, 2026) from the Nov 27 long-form "Nvidia's 11 days": the trillion-dollar round trip. New vertical layouts.
const C = {bg: '#0e1b2e', panel: '#16283f', cream: '#f6f1e7', muted: '#afb8c6', slate: '#5c7392', mint: '#3fd6a0', amber: '#f2b544', coral: '#ff8a65', red: '#ff5d5d', ink: '#0b1220'};
const HEAD = "'Archivo Black', sans-serif";
const BODY = "'Fira Sans', sans-serif";
const FPS = 30;
const fr = (s: number) => Math.round(s * FPS);
const Q = Object.fromEntries(Object.entries(T.cues).map(([k, v]) => [k, fr(v as number)])) as Record<string, number>;
const VEND = fr(T.dur);
const TOTAL = VEND + fr(2.4);
const clamp = {extrapolateLeft: 'clamp' as const, extrapolateRight: 'clamp' as const};
const sp = (f: number, from: number, d = 12) => spring({frame: f - from, fps: FPS, config: {damping: d, stiffness: 150}});
const fade = (f: number, from: number, len = 8) => interpolate(f, [from, from + len], [0, 1], clamp);

const Background: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill style={{background: `radial-gradient(circle at 50% 35%, #233f66, ${C.bg} 72%)`}}>
      <svg width={1080} height={1920}>
        {Array.from({length: 14}, (_, i) => <line key={i} x1={0} x2={1080} y1={260 + i * 90} y2={260 + i * 90} stroke="#ffffff" opacity={0.03} />)}
        {Array.from({length: 30}, (_, i) => <circle key={i} cx={(i * 337) % 1080} cy={1920 - (((i * 211) % 1920) + f * (0.3 + (i % 4) * 0.1)) % 1920} r={2 + (i % 3)} fill={i % 5 ? '#fff' : C.mint} opacity={0.07} />)}
      </svg>
    </AbsoluteFill>
  );
};
const Hero: React.FC<{pose: string; x: number; y: number; h: number; from?: number; flip?: boolean}> = ({pose, x, y, h, from = 0, flip}) => {
  const f = useCurrentFrame();
  const s = sp(f, from, 11);
  const w = h * 0.6;
  return <Img src={staticFile(`sprites/hero_${pose}.png`)} style={{position: 'absolute', left: x - w / 2, top: y - h + Math.sin(f / 7) * 5 + (1 - s) * 80, width: w, height: h, transform: `scale(${flip ? -s : s}, ${s})`, transformOrigin: '50% 100%', filter: 'drop-shadow(0 18px 18px rgba(0,0,0,.35))'}} />;
};
const Brand: React.FC = () => (
  <div style={{position: 'absolute', top: 96, left: 0, right: 0, textAlign: 'center', fontFamily: HEAD, fontSize: 30, color: C.cream, letterSpacing: 5, opacity: 0.85}}>CHART<span style={{color: C.amber}}>OGRAPHY</span></div>
);
const Source: React.FC = () => {
  const f = useCurrentFrame();
  if (f >= VEND) return null;
  const s = f < Q.best - 6 ? 'Source: NVDA closes, stocktitan.net (Nov 11-24, 2026) · $ value = our estimate (about 24.2B shares)' : 'Sources: Nvidia Q3 FY2027 results (Nov 17, 2026); NVDA closes, stocktitan.net';
  return <div style={{position: 'absolute', top: 1440, left: 60, right: 60, textAlign: 'center', fontFamily: BODY, fontSize: 25, color: C.muted}}>{s}</div>;
};
const CHUNKS: (typeof T.caps)[] = [];
{
  let cur: typeof T.caps = [];
  for (const w of T.caps) { cur.push(w); if (cur.length === 3 || /[.?!,:]$/.test(w[0] as string)) { CHUNKS.push(cur); cur = []; } }
  if (cur.length) CHUNKS.push(cur);
}
const Captions: React.FC = () => {
  const t = useCurrentFrame() / FPS;
  const ch = CHUNKS.find((c) => t >= (c[0][1] as number) && t < (c[c.length - 1][2] as number));
  if (!ch) return null;
  return (
    <div style={{position: 'absolute', top: 1255, left: 40, right: 40, textAlign: 'center', fontFamily: HEAD, fontSize: 64, lineHeight: 1.15, color: '#fff', WebkitTextStroke: `10px ${C.bg}`, paintOrder: 'stroke fill'}}>
      {ch.map((w, i) => {
        const on = t >= (w[1] as number) && (i === ch.length - 1 || t < (ch[i + 1][1] as number));
        return <span key={i} style={{display: 'inline-block', margin: '0 8px', padding: '0 10px', borderRadius: 14, background: on ? C.amber : 'transparent', color: on ? C.bg : (w[4] ? C.mint : '#fff'), WebkitTextStroke: on ? '0px' : `10px ${C.bg}`}}>{w[0] as string}</span>;
      })}
    </div>
  );
};

// ---------- scenes (absolute frames) ----------
const Hook: React.FC = () => {
  const f = useCurrentFrame();
  const down = interpolate(f, [0, Q.gone + 10], [0, 1], {...clamp, easing: Easing.out(Easing.cubic)});
  const up = interpolate(f, [Q.back - 4, Q.back + 18], [0, 1], {...clamp, easing: Easing.out(Easing.cubic)});
  return (
    <AbsoluteFill>
      <div style={{position: 'absolute', top: 230, width: '100%', textAlign: 'center'}}>
        <div style={{fontFamily: HEAD, fontSize: 56, color: C.cream}}>NVIDIA · 11 DAYS</div>
      </div>
      {/* two stacked "elevator" bars: down then up */}
      <div style={{position: 'absolute', top: 340, left: 80, width: 440, textAlign: 'center'}}>
        <div style={{fontFamily: HEAD, fontSize: 108, color: C.red, transform: `scale(${sp(f, 0)})`}}>-$1.2T</div>
        <div style={{fontFamily: BODY, fontWeight: 700, fontSize: 32, color: C.cream}}>7 trading days</div>
        <div style={{margin: '18px auto 0', width: 200, height: 470 * down, background: `linear-gradient(${C.red}, #7a2b2b)`, borderRadius: 18}} />
      </div>
      <div style={{position: 'absolute', top: 340, left: 560, width: 440, textAlign: 'center', opacity: fade(f, Q.back - 6)}}>
        <div style={{fontFamily: HEAD, fontSize: 108, color: C.mint}}>+$1T</div>
        <div style={{fontFamily: BODY, fontWeight: 700, fontSize: 32, color: C.cream}}>1 day</div>
        <div style={{margin: '18px auto 0', width: 200, height: 400 * up, background: `linear-gradient(#1f6e52, ${C.mint})`, borderRadius: 18, transform: 'translateY(0)'}} />
      </div>
      <div style={{position: 'absolute', top: 1050, left: 60, width: 700, textAlign: 'left', fontFamily: BODY, fontWeight: 700, fontSize: 34, lineHeight: 1.25, color: C.amber, opacity: fade(f, Q.estimate - 4)}}>our estimate: about $1.17T out,<br />about $0.96T back</div>
      <Hero pose="shock_shock" x={900} y={1230} h={260} />
    </AbsoluteFill>
  );
};

const TAGS: [string, string, string, string, string][] = [
  ['twist', 'Nov 11 · night before he left', '$173.73', C.cream, ''],
  ['below', 'Nov 23 · after the +31.48% day', '$165.05', C.amber, 'still about 5% lower'],
  ['p586', 'Nov 24 · the next day', '$155.38', C.red, '-5.86%'],
];
const Twist: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill>
      <div style={{position: 'absolute', top: 240, width: '100%', textAlign: 'center'}}>
        <div style={{display: 'inline-block', background: C.red, color: '#fff', fontFamily: HEAD, fontSize: 70, padding: '6px 34px', borderRadius: 18, transform: `rotate(-3deg) scale(${sp(f, Q.twist)})`}}>THE TWIST</div>
      </div>
      {TAGS.map(([k, d, p, c, note], i) => {
        const o = fade(f, Q[k] - 4);
        return (
          <div key={k} style={{position: 'absolute', left: 120 + i * 40, top: 390 + i * 290, width: 860, opacity: o, transform: `translateX(${(1 - o) * 60}px)`}}>
            <div style={{display: 'flex', alignItems: 'center', background: C.panel, border: `6px solid ${c}`, borderRadius: '20px 90px 90px 20px', padding: '18px 30px'}}>
              <div style={{width: 30, height: 30, borderRadius: 15, background: C.bg, border: `5px solid ${c}`, marginRight: 26}} />
              <div>
                <div style={{fontFamily: BODY, fontWeight: 700, fontSize: 30, color: C.muted}}>{d}</div>
                <div style={{fontFamily: HEAD, fontSize: 88, color: c, lineHeight: 1}}>{p} <span style={{fontSize: 34, whiteSpace: 'nowrap'}}>{note}</span></div>
              </div>
            </div>
          </div>
        );
      })}
    </AbsoluteFill>
  );
};

const Paradox: React.FC = () => {
  const f = useCurrentFrame();
  const tilt = interpolate(f, [Q.b115 - 4, Q.couldnot], [0, 14], {...clamp, easing: Easing.out(Easing.back(1.4))});
  return (
    <AbsoluteFill>
      <div style={{position: 'absolute', top: 240, width: '100%', textAlign: 'center', opacity: fade(f, Q.best - 4)}}>
        <div style={{fontFamily: HEAD, fontSize: 64, color: C.cream}}>BEST QUARTER EVER</div>
        <div style={{fontFamily: HEAD, fontSize: 150, color: C.mint, lineHeight: 1}}>$115.8B</div>
        <div style={{fontFamily: BODY, fontWeight: 700, fontSize: 36, color: C.cream, opacity: fade(f, Q.gonef - 4)}}>...while the founder was gone</div>
        <div style={{display: 'inline-block', marginTop: 16, border: `6px solid ${C.red}`, color: C.red, borderRadius: 16, padding: '4px 22px', fontFamily: HEAD, fontSize: 48, opacity: fade(f, Q.sold - 4)}}>INVESTORS SOLD ANYWAY</div>
      </div>
      {/* a balance: one press release outweighs $115B of sales */}
      <svg style={{position: 'absolute', left: 0, top: 780, overflow: 'visible', opacity: fade(f, Q.onepr - 6)}} width={1080} height={420}>
        <polygon points="540,140 500,400 580,400" fill={C.slate} />
        <g transform={`rotate(${tilt} 540 140)`}>
          <rect x={160} y={130} width={760} height={18} rx={9} fill={C.cream} />
          <g transform="translate(250,40)"><rect x={-90} y={-10} width={180} height={90} rx={10} fill={C.mint} stroke={C.ink} strokeWidth={5} /><text x={0} y={48} textAnchor="middle" fontFamily="Archivo Black" fontSize={34} fill={C.ink}>$115B</text></g>
          <g transform="translate(830,30)"><rect x={-80} y={-20} width={160} height={110} rx={6} fill="#ece6d6" stroke={C.ink} strokeWidth={5} /><text x={0} y={22} textAnchor="middle" fontFamily="Archivo Black" fontSize={22} fill={C.ink}>PRESS</text><text x={0} y={52} textAnchor="middle" fontFamily="Archivo Black" fontSize={22} fill={C.ink}>RELEASE</text></g>
        </g>
        <text x={250} y={250} textAnchor="middle" fontFamily="Fira Sans" fontWeight={700} fontSize={30} fill={C.muted} opacity={fade(f, Q.b115)}>sales</text>
        <text x={830} y={250} textAnchor="middle" fontFamily="Fira Sans" fontWeight={700} fontSize={30} fill={C.muted}>1 page</text>
      </svg>
    </AbsoluteFill>
  );
};

const End: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill style={{alignItems: 'center', paddingTop: 300, textAlign: 'center', opacity: fade(f, VEND, 6)}}>
      <div style={{fontFamily: HEAD, fontSize: 70, color: C.cream, lineHeight: 1.1}}>Full story on<br />the channel ↑</div>
      <div style={{fontFamily: HEAD, fontSize: 86, color: C.red, marginTop: 60, lineHeight: 1.05}}>-$1.2T in 7 days...</div>
      <div style={{fontFamily: HEAD, fontSize: 86, color: C.mint, lineHeight: 1.05}}>then back?</div>
      <Hero pose="point_smile" x={540} y={1440} h={360} from={VEND} />
    </AbsoluteFill>
  );
};

export const RoundTrip: React.FC = () => {
  const f = useCurrentFrame();
  const scene = f < Q.twist - 4 ? <Hook /> : f < Q.best - 6 ? <Twist /> : f < VEND ? <Paradox /> : <End />;
  return (
    <AbsoluteFill>
      <Background />
      {scene}
      <Brand />
      <Captions />
      <Source />
      <Audio src={staticFile('vo.mp3')} />
    </AbsoluteFill>
  );
};

export const Root: React.FC = () => (
  <Composition id="RoundTrip" component={RoundTrip} durationInFrames={TOTAL} fps={FPS} width={1080} height={1920} />
);
