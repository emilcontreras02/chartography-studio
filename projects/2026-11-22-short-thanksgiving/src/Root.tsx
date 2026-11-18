import React from 'react';
import {
  AbsoluteFill, Audio, Composition, Img, Sequence, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig, Easing,
} from 'remotion';
import T from './timing.json';
import '@fontsource/archivo-black/latin-400.css';
import '@fontsource/fira-sans/latin-400.css';
import '@fontsource/fira-sans/latin-700.css';

// Chartography brand palette (chartography_engine.py)
const C = {
  bg: '#0e1b2e', panel: '#16283f', cream: '#f6f1e7', muted: '#afb8c6', slate: '#5c7392',
  mint: '#3fd6a0', amber: '#f2b544', coral: '#ff8a65', red: '#ff5d5d',
};
const HEAD = "'Archivo Black', sans-serif";
const BODY = "'Fira Sans', sans-serif";
const FPS = 30;
const fr = (s: number) => Math.round(s * FPS);
const S = T.seg.map(fr);
const Q = Object.fromEntries(Object.entries(T.cues).map(([k, v]) => [k, fr(v as number)])) as Record<string, number>;
const TOTAL = fr(T.dur + 1.6);
const clamp = {extrapolateLeft: 'clamp' as const, extrapolateRight: 'clamp' as const};

// ---------- shared ----------
const Background: React.FC = () => {
  const f = useCurrentFrame();
  const dots = Array.from({length: 46}, (_, i) => {
    const x = (i * 263) % 1080;
    const y = ((i * 517) % 1920 + f * (0.3 + (i % 5) * 0.12)) % 1920;
    return <circle key={i} cx={x} cy={1920 - y} r={2 + (i % 3)} fill={i % 7 === 0 ? C.amber : '#ffffff'} opacity={0.07 + (i % 4) * 0.03} />;
  });
  return (
    <AbsoluteFill style={{background: `radial-gradient(circle at 50% 32%, #1d3557, ${C.bg} 72%)`}}>
      <svg width={1080} height={1920}>{dots}</svg>
    </AbsoluteFill>
  );
};

// the full-body mascot (hero.py sprites), with a little bob and a pop-in
const Hero: React.FC<{pose: string; x: number; y: number; h: number; from?: number; flip?: boolean}> = ({pose, x, y, h, from = 0, flip}) => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const s = spring({frame: f - from, fps, config: {damping: 11, stiffness: 160}});
  const bob = Math.sin(f / 7) * 5;
  const w = h * 0.6;
  return (
    <Img src={staticFile(`sprites/hero_${pose}.png`)} style={{
      position: 'absolute', left: x - w / 2, top: y - h + bob + (1 - s) * 80, width: w, height: h,
      transform: `scale(${flip ? -s : s}, ${s})`, transformOrigin: '50% 100%', filter: 'drop-shadow(0 18px 18px rgba(0,0,0,.35))',
    }} />
  );
};

const Pop: React.FC<{delay?: number; children: React.ReactNode; style?: React.CSSProperties}> = ({delay = 0, children, style}) => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const s = spring({frame: f - delay, fps, config: {damping: 12, stiffness: 140}});
  return <div style={{transform: `scale(${s}) translateY(${(1 - s) * 40}px)`, opacity: Math.min(1, s * 1.5), ...style}}>{children}</div>;
};

const Fade: React.FC<{dur: number; children: React.ReactNode}> = ({dur, children}) => {
  const f = useCurrentFrame();
  return <AbsoluteFill style={{opacity: interpolate(f, [0, 6, dur - 6, dur], [0, 1, 1, 0], clamp)}}>{children}</AbsoluteFill>;
};

const Brand: React.FC = () => (
  <div style={{position: 'absolute', top: 96, left: 0, right: 0, textAlign: 'center', fontFamily: HEAD, fontSize: 30, color: C.cream, letterSpacing: 5, opacity: 0.85}}>
    CHART<span style={{color: C.amber}}>OGRAPHY</span>
  </div>
);

const Source: React.FC = () => (
  <div style={{position: 'absolute', bottom: 70, left: 60, right: 60, textAlign: 'center', fontFamily: BODY, fontSize: 26, color: C.muted}}>
    Source: American Farm Bureau Federation, Thanksgiving Dinner Cost Survey (Nov 18, 2026) · classic meal for 10
  </div>
);

// word-by-word captions, 3-word chunks, active word in an amber box
const CHUNKS: (typeof T.caps)[] = [];
{
  let cur: typeof T.caps = [];
  for (const w of T.caps) {
    cur.push(w);
    if (cur.length === 3 || /[.?!,:]$/.test(w[0] as string)) { CHUNKS.push(cur); cur = []; }
  }
  if (cur.length) CHUNKS.push(cur);
}
const Captions: React.FC = () => {
  const f = useCurrentFrame();
  const t = f / FPS;
  for (const ch of CHUNKS) {
    const t0 = ch[0][1] as number, t1 = ch[ch.length - 1][2] as number;
    if (t >= t0 && t < t1) {
      return (
        <div style={{position: 'absolute', top: 1190, left: 290, right: 40, textAlign: 'center', fontFamily: HEAD, fontSize: 70, lineHeight: 1.15, color: '#fff', WebkitTextStroke: `10px ${C.bg}`, paintOrder: 'stroke fill'}}>
          {ch.map((w, i) => {
            const on = t >= (w[1] as number) && (i === ch.length - 1 || t < (ch[i + 1][1] as number));
            return (
              <span key={i} style={{display: 'inline-block', margin: '0 8px', padding: '0 10px', borderRadius: 14,
                background: on ? C.amber : 'transparent', color: on ? C.bg : (w[4] ? C.mint : '#fff'), WebkitTextStroke: on ? '0px' : `10px ${C.bg}`}}>
                {w[0] as string}
              </span>
            );
          })}
        </div>
      );
    }
  }
  return null;
};

// ---------- scenes (frames are relative to each Sequence start) ----------
const Hook: React.FC<{dur: number}> = ({dur}) => {
  const f = useCurrentFrame();
  const broke = Q.broke;
  const shake = f > broke && f < broke + 14 ? Math.sin(f * 2.4) * 10 : 0;
  const stamp = spring({frame: f - broke, fps: FPS, config: {damping: 9, stiffness: 220}});
  return (
    <Fade dur={dur}>
      <AbsoluteFill style={{alignItems: 'center', paddingTop: 260, textAlign: 'center', transform: `translateX(${shake}px)`}}>
        <Pop><div style={{fontFamily: HEAD, fontSize: 92, color: C.cream, lineHeight: 1.02}}>THANKSGIVING<br />DINNER</div></Pop>
        <Pop delay={10}><div style={{fontFamily: HEAD, fontSize: 112, color: C.mint, marginTop: 16, transform: 'rotate(-3deg)'}}>GOT CHEAPER</div></Pop>
        <Pop delay={22}><div style={{fontFamily: HEAD, fontSize: 72, color: C.cream, marginTop: 14}}>3 YEARS IN A ROW</div></Pop>
        <div style={{marginTop: 34, opacity: stamp, transform: `scale(${2.2 - 1.2 * stamp}) rotate(-6deg)`, padding: '14px 40px', border: `10px solid ${C.red}`, borderRadius: 22, color: C.red, fontFamily: HEAD, fontSize: 96}}>
          …UNTIL NOW
        </div>
      </AbsoluteFill>
    </Fade>
  );
};

const DATA = [
  {y: '2019', v: 48.91}, {y: '2020', v: 46.9}, {y: '2021', v: 53.31}, {y: '2022', v: 64.05},
  {y: '2023', v: 61.17}, {y: '2024', v: 58.08}, {y: '2025', v: 55.18}, {y: '2026', v: 58.63},
];
const Chart: React.FC<{dur: number; off: number}> = ({dur, off}) => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const at = (k: string) => Q[k] - off;
  const base = 1060, maxH = 560, bw = 98, gap = 22;
  const x0 = (1080 - (DATA.length * bw + (DATA.length - 1) * gap)) / 2;
  const sc = (v: number) => (v / 70) * maxH;
  const start = [4, 10, 16, 22, at('fell') + 6, at('fell') + 22, at('fifty5'), at('fifty8')];
  const arrowP = interpolate(f, [at('fifty5') + 8, at('fifty5') + 28], [0, 1], {...clamp, easing: Easing.out(Easing.cubic)});
  const brokeP = spring({frame: f - at('up6'), fps, config: {damping: 10, stiffness: 180}});
  return (
    <Fade dur={dur}>
      <div style={{position: 'absolute', top: 210, width: '100%', textAlign: 'center', opacity: 1 - brokeP}}>
        <Pop><div style={{fontFamily: HEAD, fontSize: 64, color: C.cream}}>THANKSGIVING FOR 10</div></Pop>
        <Pop delay={4}><div style={{fontFamily: BODY, fontSize: 38, color: C.muted, marginTop: 6}}>classic meal, US average</div></Pop>
      </div>
      <svg width={1080} height={1920} style={{position: 'absolute'}}>
        <line x1={40} x2={1040} y1={base} y2={base} stroke={C.slate} strokeWidth={4} />
        {DATA.map((d, i) => {
          const p = spring({frame: f - start[i], fps, config: {damping: 14, stiffness: 90}});
          const h = sc(d.v) * p, x = x0 + i * (bw + gap);
          const color = d.y === '2022' ? C.amber : d.y === '2026' ? C.red : i >= 4 ? C.mint : C.slate;
          return (
            <g key={d.y} opacity={f >= start[i] ? 1 : 0}>
              <rect x={x} y={base - h} width={bw} height={h} rx={10} fill={color} />
              <text x={x + bw / 2} y={base + 50} fontFamily={BODY} fontWeight={700} fontSize={32} fill={C.cream} textAnchor="middle">{d.y}</text>
              <text x={x + bw / 2} y={base - h - 16} fontFamily={HEAD} fontSize={27} fill={C.cream} textAnchor="middle" opacity={p}>${(d.v * p).toFixed(2)}</text>
              {d.y === '2022' && <text x={x + bw / 2} y={base - h - 58} fontFamily={HEAD} fontSize={30} fill={C.amber} textAnchor="middle" opacity={interpolate(f, [at('record'), at('record') + 10], [0, 1], clamp)}>RECORD</text>}
            </g>
          );
        })}
        {(() => {
          const sx = x0 + 4 * (bw + gap) + bw / 2, ex = x0 + 6 * (bw + gap) + bw / 2;
          const sy = base - sc(61.17) - 120, ey = base - sc(55.18) - 80;
          const cx = sx + (ex - sx) * arrowP, cy = sy + (ey - sy) * arrowP;
          return (
            <g opacity={arrowP > 0 ? 1 : 0}>
              <line x1={sx} y1={sy} x2={cx} y2={cy} stroke={C.mint} strokeWidth={9} strokeLinecap="round" />
              <text x={(sx + ex) / 2} y={sy - 30} fontFamily={HEAD} fontSize={34} fill={C.mint} textAnchor="middle" opacity={arrowP}>DOWN 3 YEARS</text>
            </g>
          );
        })()}
      </svg>
      <div style={{position: 'absolute', left: 0, right: 0, top: 215, display: 'flex', justifyContent: 'center', opacity: brokeP}}>
        <div style={{transform: `scale(${1.8 - 0.8 * brokeP}) rotate(-4deg)`, background: C.red, color: '#fff', fontFamily: HEAD, fontSize: 62, padding: '12px 34px', borderRadius: 20, boxShadow: '0 14px 40px rgba(0,0,0,.4)'}}>
          +6% · STREAK BROKEN
        </div>
      </div>
    </Fade>
  );
};

const Question: React.FC<{dur: number}> = ({dur}) => (
  <Fade dur={dur}>
    <AbsoluteFill style={{alignItems: 'center', paddingTop: 330, textAlign: 'center'}}>
      <Pop><div style={{fontFamily: HEAD, fontSize: 104, color: C.cream, lineHeight: 1.05}}>SO WHAT GOT<br /><span style={{color: C.coral}}>PRICIER?</span></div></Pop>
    </AbsoluteFill>
    <Hero pose="think_talk" x={540} y={1150} h={520} />
  </Fade>
);

const ITEMS = [
  {name: 'Turkey (16 lb)', sub: '$23.68', pct: 10.1, cue: 'turkey'},
  {name: 'Cranberries', sub: '$2.48', pct: 8.8, cue: 'cran'},
  {name: 'Whole milk (gal)', sub: '$4.05', pct: 8.6, cue: 'milk'},
  {name: 'Veggie tray', sub: '$1.31', pct: -3.7, cue: 'milk', extra: 30},
  {name: 'Pie crusts', sub: '$3.28', pct: -2.7, cue: 'milk', extra: 40},
];
const Items: React.FC<{dur: number; off: number}> = ({dur, off}) => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const mid = 400, unit = 40;
  return (
    <Fade dur={dur}>
      <div style={{position: 'absolute', top: 210, width: '100%', textAlign: 'center'}}>
        <Pop><div style={{fontFamily: HEAD, fontSize: 64, color: C.cream}}>2026 vs 2025</div></Pop>
        <Pop delay={4}><div style={{fontFamily: BODY, fontSize: 38, color: C.muted, marginTop: 6}}>price change by item</div></Pop>
      </div>
      <svg width={1080} height={1920} style={{position: 'absolute'}}>
        <line x1={mid} x2={mid} y1={400} y2={1100} stroke={C.slate} strokeWidth={3} strokeDasharray="10 10" />
        {ITEMS.map((it, i) => {
          const d = Q[it.cue] - off + (it.extra || 0);
          const p = spring({frame: f - d, fps, config: {damping: 15, stiffness: 110}});
          const y = 420 + i * 136;
          const w = Math.abs(it.pct) * unit * p;
          const up = it.pct > 0;
          const col = up ? C.red : C.mint;
          return (
            <g key={it.name} opacity={f >= d ? Math.min(1, p * 2) : 0}>
              <text x={up ? 60 : mid + 16} y={y + 30} fontFamily={BODY} fontWeight={700} fontSize={44} fill={C.cream} textAnchor="start">{it.name} <tspan fill={C.muted} fontWeight={400}>{it.sub}</tspan></text>
              <rect x={up ? mid : mid - w} y={y + 50} width={w} height={54} rx={8} fill={col} />
              <text x={up ? mid + w + 14 : mid - w - 14} y={y + 92} fontFamily={HEAD} fontSize={46} fill={col} textAnchor={up ? 'start' : 'end'}>{up ? '+' : ''}{it.pct}%</text>
            </g>
          );
        })}
      </svg>
    </Fade>
  );
};

const Region: React.FC<{dur: number; off: number}> = ({dur, off}) => {
  const Card: React.FC<{label: string; val: string; color: string; delay: number}> = ({label, val, color, delay}) => (
    <Pop delay={delay}>
      <div style={{width: 440, height: 380, borderRadius: 36, background: C.panel, border: `6px solid ${color}`, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center'}}>
        <div style={{fontFamily: HEAD, fontSize: 54, color: C.cream}}>{label}</div>
        <div style={{fontFamily: HEAD, fontSize: 96, color, marginTop: 10}}>{val}</div>
      </div>
    </Pop>
  );
  return (
    <Fade dur={dur}>
      <div style={{position: 'absolute', top: 230, width: '100%', textAlign: 'center'}}>
        <Pop><div style={{fontFamily: HEAD, fontSize: 70, color: C.cream}}>WHERE YOU LIVE <span style={{color: C.amber}}>MATTERS</span></div></Pop>
      </div>
      <div style={{position: 'absolute', top: 470, width: '100%', display: 'flex', justifyContent: 'center', gap: 50}}>
        <Card label="NORTHEAST" val="$61.57" color={C.red} delay={Q.ne - off} />
        <Card label="SOUTH" val="$54.33" color={C.mint} delay={Q.south - off} />
      </div>
      <div style={{position: 'absolute', top: 900, width: '100%', textAlign: 'center'}}>
        <Pop delay={Q.south - off + 18}><div style={{fontFamily: BODY, fontWeight: 700, fontSize: 46, color: C.muted}}>Same meal. <span style={{color: C.amber}}>$7.24</span> apart.</div></Pop>
      </div>
    </Fade>
  );
};

const CTA: React.FC<{dur: number}> = ({dur}) => {
  const f = useCurrentFrame();
  const pulse = 1 + Math.sin(f / 5) * 0.03;
  return (
    <Fade dur={dur + 12}>
      <AbsoluteFill style={{alignItems: 'center', paddingTop: 220, textAlign: 'center'}}>
        <Pop><div style={{fontFamily: BODY, fontWeight: 700, fontSize: 42, color: C.muted}}>Still $5.42 below the 2022 record</div></Pop>
        <Pop delay={8}><div style={{fontFamily: HEAD, fontSize: 92, color: C.cream, marginTop: 26, lineHeight: 1.05}}>TURKEY <span style={{color: C.muted, fontSize: 64}}>or</span><br /><span style={{color: C.amber}}>THE SIDES?</span></div></Pop>
        <Pop delay={20}><div style={{transform: `scale(${pulse})`, marginTop: 40, background: C.amber, color: C.bg, fontFamily: HEAD, fontSize: 52, padding: '22px 44px', borderRadius: 26}}>What are you cutting? Comment ↓</div></Pop>
      </AbsoluteFill>
    </Fade>
  );
};

// mascot track over the whole film (sits beside the captions, never on top of the charts)
const HeroTrack: React.FC = () => {
  const f = useCurrentFrame();
  if (f >= S[3] && f < S[4]) return null; // the Question scene draws its own big mascot
  const pose = f < Q.broke ? 'stand_talk' : f < S[1] ? 'shock_shock' : f < Q.up6 ? 'point_smile' : f < S[3] ? 'shock_shock'
    : f < S[5] ? 'think_worry' : f < S[6] ? 'shrug_talk' : 'point_talk';
  return <Hero pose={pose} flip={pose.startsWith('point')} x={165} y={1560} h={420} />;
};

export const ThanksgivingShort: React.FC = () => {
  const ends = [...S.slice(1), TOTAL];
  const D = (i: number) => ends[i] - S[i];
  return (
    <AbsoluteFill>
      <Background />
      <Sequence durationInFrames={S[1]}><Hook dur={S[1]} /></Sequence>
      <Sequence from={S[1]} durationInFrames={S[3] - S[1]}><Chart dur={S[3] - S[1]} off={S[1]} /></Sequence>
      <Sequence from={S[3]} durationInFrames={D(3)}><Question dur={D(3)} /></Sequence>
      <Sequence from={S[4]} durationInFrames={D(4)}><Items dur={D(4)} off={S[4]} /></Sequence>
      <Sequence from={S[5]} durationInFrames={D(5)}><Region dur={D(5)} off={S[5]} /></Sequence>
      <Sequence from={S[6]} durationInFrames={D(6)}><CTA dur={D(6)} /></Sequence>
      <HeroTrack />
      <Brand />
      <Captions />
      <Source />
      <Audio src={staticFile('vo.mp3')} />
    </AbsoluteFill>
  );
};

export const Root: React.FC = () => (
  <Composition id="ThanksgivingShort" component={ThanksgivingShort} durationInFrames={TOTAL} fps={FPS} width={1080} height={1920} />
);
