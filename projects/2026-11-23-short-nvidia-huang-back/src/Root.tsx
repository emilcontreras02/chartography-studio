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
    Sources: Nvidia 8-K filings, Nov 12 &amp; 23, 2026 · Yahoo Finance (open, Nov 23)
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

// ---------- characters: simple round-head people (loose caricatures, name labels) ----------
type PersonProps = {x: number; y: number; s?: number; hair: 'swoop' | 'bob' | 'none'; hairColor?: string; jacket: string; shirt?: string; label?: string; mood?: 'smile' | 'flat' | 'shock'; wave?: number; dim?: boolean};
const Person: React.FC<PersonProps> = ({x, y, s = 1, hair, hairColor = '#1b1b1f', jacket, shirt = C.cream, label, mood = 'smile', wave = 0, dim}) => {
  const f = useCurrentFrame();
  const bob = Math.sin(f / 8) * 3;
  const arm = wave ? Math.sin(f / 4) * 25 * wave : 0;
  return (
    <g transform={`translate(${x},${y + bob}) scale(${s})`} opacity={dim ? 0.45 : 1}>
      <ellipse cx={0} cy={250} rx={95} ry={16} fill="#000" opacity={0.25} />
      {/* legs */}
      <rect x={-42} y={150} width={34} height={100} rx={14} fill="#1c2433" />
      <rect x={8} y={150} width={34} height={100} rx={14} fill="#1c2433" />
      {/* body */}
      <path d="M -78 160 Q -80 40 0 30 Q 80 40 78 160 Z" fill={jacket} stroke="#0a0f18" strokeWidth={6} />
      <path d="M -22 36 L 0 92 L 22 36 Z" fill={shirt} />
      {/* arms */}
      <g transform={`rotate(${-arm} -72 60)`}><rect x={-100} y={52} width={30} height={92} rx={14} fill={jacket} stroke="#0a0f18" strokeWidth={5} /></g>
      <rect x={70} y={52} width={30} height={92} rx={14} fill={jacket} stroke="#0a0f18" strokeWidth={5} />
      {/* head */}
      <circle cx={0} cy={-30} r={62} fill="#f3d2b3" stroke="#0a0f18" strokeWidth={6} />
      {hair === 'swoop' && <path d="M -62 -38 Q -58 -104 4 -98 Q 66 -96 64 -30 Q 40 -70 -8 -62 Q -40 -58 -62 -38 Z" fill={hairColor} stroke="#0a0f18" strokeWidth={4} />}
      {hair === 'bob' && <path d="M -66 10 Q -80 -100 0 -98 Q 80 -100 66 10 L 50 10 Q 56 -56 0 -60 Q -56 -56 -50 10 Z" fill={hairColor} stroke="#0a0f18" strokeWidth={4} />}
      {/* face */}
      <ellipse cx={-21} cy={-30} rx={7} ry={mood === 'shock' ? 11 : 9} fill="#0a0f18" />
      <ellipse cx={21} cy={-30} rx={7} ry={mood === 'shock' ? 11 : 9} fill="#0a0f18" />
      {mood === 'smile' && <path d="M -20 2 Q 0 20 20 2" stroke="#0a0f18" strokeWidth={6} fill="none" strokeLinecap="round" />}
      {mood === 'flat' && <path d="M -16 6 L 16 6" stroke="#0a0f18" strokeWidth={6} strokeLinecap="round" />}
      {mood === 'shock' && <ellipse cx={0} cy={8} rx={11} ry={14} fill="#0a0f18" />}
      {label && (
        <g transform="translate(0, 300)">
          <rect x={-150} y={-30} width={300} height={56} rx={14} fill={C.panel} stroke={C.amber} strokeWidth={3} />
          <text x={0} y={8} textAnchor="middle" fontFamily={HEAD} fontSize={30} fill={C.cream}>{label}</text>
        </g>
      )}
    </g>
  );
};
const Huang: React.FC<{x: number; y: number; s?: number; mood?: PersonProps['mood']; wave?: number; label?: boolean}> = ({label = true, ...p}) => (
  <Person {...p} hair="swoop" hairColor="#2a2a2e" jacket="#141414" shirt="#2b2b2b" label={label ? 'Jensen Huang' : undefined} />
);

// ---------- scenes (frames are relative to each Sequence start) ----------
const Hook: React.FC<{dur: number}> = ({dur}) => {
  const f = useCurrentFrame();
  const back = Q.back;
  const stamp = spring({frame: f - back, fps: FPS, config: {damping: 9, stiffness: 220}});
  const n = interpolate(f, [2, 26], [0, 30], {...clamp, easing: Easing.out(Easing.cubic)});
  const shake = f > back && f < back + 14 ? Math.sin(f * 2.4) * 10 : 0;
  return (
    <Fade dur={dur}>
      <AbsoluteFill style={{alignItems: 'center', paddingTop: 250, textAlign: 'center', transform: `translateX(${shake}px)`}}>
        <Pop><div style={{fontFamily: HEAD, fontSize: 96, color: C.cream, letterSpacing: 2}}>NVIDIA STOCK</div></Pop>
        <div style={{fontFamily: HEAD, fontSize: 230, color: C.mint, lineHeight: 1, marginTop: 6}}>+{Math.round(n)}%</div>
        <Pop delay={8}><div style={{fontFamily: HEAD, fontSize: 64, color: C.cream, marginTop: 8}}>IN ONE MORNING</div></Pop>
        <div style={{marginTop: 46, opacity: stamp, transform: `scale(${2.2 - 1.2 * stamp}) rotate(-6deg)`, padding: '14px 40px', border: `10px solid ${C.amber}`, borderRadius: 22, color: C.amber, fontFamily: HEAD, fontSize: 84}}>
          THE CEO IS BACK
        </div>
      </AbsoluteFill>
    </Fade>
  );
};

const Calendar: React.FC<{active: number; off?: number}> = ({active}) => {
  const days = Array.from({length: 12}, (_, i) => 12 + i);
  return (
    <div style={{position: 'absolute', top: 200, left: 60, right: 60, display: 'flex', flexWrap: 'wrap', gap: 10, justifyContent: 'center'}}>
      {days.map((d, i) => (
        <div key={d} style={{width: 66, height: 72, borderRadius: 12, background: i <= active ? (i === 0 ? C.coral : d === 23 ? C.mint : C.panel) : '#122033',
          border: `3px solid ${i === active ? C.amber : C.slate}`, color: i <= active && (i === 0 || d === 23) ? C.bg : C.cream, fontFamily: HEAD, fontSize: 30, display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: i <= active ? 1 : 0.35}}>
          {d}
        </div>
      ))}
      <div style={{width: '100%', textAlign: 'center', fontFamily: BODY, fontWeight: 700, fontSize: 32, color: C.muted, marginTop: 4}}>NOVEMBER 2026</div>
    </div>
  );
};

const Exit: React.FC<{dur: number; off: number}> = ({dur, off}) => {
  const f = useCurrentFrame();
  const at = (k: string) => Q[k] - off;
  const walk = interpolate(f, [at('nov12') + 30, at('nov12') + 75], [0, 1], {...clamp, easing: Easing.inOut(Easing.cubic)});
  const docP = spring({frame: f - at('noreason'), fps: FPS, config: {damping: 13, stiffness: 140}});
  const kP = spring({frame: f - at('kress'), fps: FPS, config: {damping: 13, stiffness: 120}});
  return (
    <Fade dur={dur}>
      <Calendar active={0} />
      <svg width={1080} height={1920} style={{position: 'absolute'}}>
        {/* office door */}
        <rect x={700} y={470} width={230} height={420} rx={10} fill="#1d3557" stroke={C.slate} strokeWidth={6} />
        <rect x={735} y={500} width={160} height={56} rx={8} fill={C.cream} />
        <text x={815} y={540} textAnchor="middle" fontFamily={HEAD} fontSize={36} fill={C.bg}>CEO</text>
        <circle cx={900} cy={700} r={10} fill={C.amber} />
        <g opacity={1 - walk}><Huang x={360 + walk * 455} y={680} s={0.95} mood={f > at('nov12') + 20 ? 'flat' : 'smile'} /></g>
        <g opacity={kP} transform={`translate(${(1 - kP) * 200},0)`}>
          <Person x={810} y={680} s={0.95} hair="bob" hairColor="#c9a46b" jacket={C.slate} label="Colette Kress" />
        </g>
      </svg>
      <div style={{position: 'absolute', top: 410, left: 70, opacity: docP * (1 - kP * 0.85), transform: `scale(${0.7 + 0.3 * docP}) rotate(-3deg)`, transformOrigin: 'left top',
        background: C.cream, color: C.bg, borderRadius: 16, padding: '22px 28px', width: 470, boxShadow: '0 14px 40px rgba(0,0,0,.4)'}}>
        <div style={{fontFamily: HEAD, fontSize: 34}}>FORM 8-K · NOV 12</div>
        <div style={{fontFamily: BODY, fontWeight: 700, fontSize: 30, marginTop: 10}}>CEO resigns, effective immediately</div>
        <div style={{fontFamily: BODY, fontWeight: 700, fontSize: 30, marginTop: 8}}>Reason: <span style={{color: '#c0392b'}}>none given</span></div>
      </div>
      <div style={{position: 'absolute', top: 1010, left: 0, right: 0, textAlign: 'center', opacity: kP}}>
        <span style={{fontFamily: HEAD, fontSize: 44, color: C.amber}}>INTERIM CEO</span>
      </div>
    </Fade>
  );
};

const Slide: React.FC<{dur: number; off: number}> = ({dur, off}) => {
  const f = useCurrentFrame();
  const at = (k: string) => Q[k] - off;
  return (
    <Fade dur={dur}>
      <div style={{position: 'absolute', top: 260, left: 0, right: 0, textAlign: 'center'}}>
        <Pop><div style={{fontFamily: HEAD, fontSize: 84, color: C.coral}}>7 DAYS DOWN</div></Pop>
        <Pop delay={4}><div style={{fontFamily: HEAD, fontSize: 52, color: C.cream}}>IN A ROW</div></Pop>
      </div>
      <svg width={1080} height={1920} style={{position: 'absolute'}}>
        {Array.from({length: 7}, (_, i) => {
          const p = spring({frame: f - (at('fell7') - 6 + i * 5), fps: FPS, config: {damping: 14, stiffness: 150}});
          const x = 150 + i * 118, top = 520 + i * 62;
          return (
            <g key={i} opacity={p}>
              <line x1={x + 32} x2={x + 32} y1={top - 30} y2={top + 200} stroke={C.coral} strokeWidth={5} />
              <rect x={x} y={top} width={64} height={170 * p} rx={6} fill={C.coral} />
              <text x={x + 32} y={top + 250} textAnchor="middle" fontFamily={BODY} fontWeight={700} fontSize={26} fill={C.muted}>D{i + 1}</text>
            </g>
          );
        })}
      </svg>
    </Fade>
  );
};

const Twist: React.FC<{dur: number}> = ({dur}) => {
  const f = useCurrentFrame();
  const day = Math.min(23, 12 + Math.floor(interpolate(f, [0, 36], [0, 11], clamp)));
  return (
    <Fade dur={dur}>
      <AbsoluteFill style={{alignItems: 'center', paddingTop: 250, textAlign: 'center'}}>
        <Pop><div style={{fontFamily: HEAD, fontSize: 80, color: C.cream}}>11 DAYS LATER…</div></Pop>
        <div style={{marginTop: 24, width: 300, height: 300, borderRadius: 30, background: C.cream, boxShadow: '0 20px 50px rgba(0,0,0,.45)', overflow: 'hidden'}}>
          <div style={{background: C.coral, color: '#fff', fontFamily: HEAD, fontSize: 40, padding: '12px 0'}}>NOV</div>
          <div style={{fontFamily: HEAD, fontSize: 150, color: C.bg, lineHeight: '220px'}}>{day}</div>
        </div>
      </AbsoluteFill>
      <Hero pose="shock_shock" x={540} y={1180} h={330} from={10} />
    </Fade>
  );
};

const Return: React.FC<{dur: number; off: number}> = ({dur, off}) => {
  const f = useCurrentFrame();
  const at = (k: string) => Q[k] - off;
  const vote = spring({frame: f - at('unanimous'), fps: FPS, config: {damping: 12, stiffness: 140}});
  const walkIn = interpolate(f, [at('unanimous') + 30, at('unanimous') + 70], [0, 1], {...clamp, easing: Easing.out(Easing.cubic)});
  const sw = interpolate(f, [at('bell') - 4, at('bell')], [0, 1], clamp);
  const ring = f > at('bell') && f < at('bell') + 40 ? Math.sin(f * 1.6) * 18 : 0;
  const pctP = interpolate(f, [at('pct32'), at('pct32') + 30], [0, 1], {...clamp, easing: Easing.out(Easing.cubic)});
  const priceP = spring({frame: f - at('p165'), fps: FPS, config: {damping: 12, stiffness: 130}});
  const boardOut = interpolate(f, [at('bell') - 8, at('bell') + 4], [1, 0], clamp);
  return (
    <Fade dur={dur}>
      {/* part 1: the board vote */}
      <div style={{opacity: boardOut}}>
        <div style={{position: 'absolute', top: 240, left: 0, right: 0, textAlign: 'center'}}>
          <Pop><div style={{fontFamily: HEAD, fontSize: 64, color: C.cream}}>THE BOARD VOTES</div></Pop>
          <div style={{marginTop: 10, display: 'inline-block', opacity: vote, transform: `scale(${1.8 - 0.8 * vote}) rotate(-4deg)`, background: C.mint, color: C.bg, fontFamily: HEAD, fontSize: 72, padding: '8px 34px', borderRadius: 18}}>UNANIMOUS</div>
        </div>
        <svg width={1080} height={1920} style={{position: 'absolute'}}>
          <rect x={90} y={820} width={900} height={60} rx={20} fill="#5a3d2b" stroke="#2c1d12" strokeWidth={6} />
          {Array.from({length: 7}, (_, i) => {
            const x = 150 + i * 130, up = vote * (i % 2 ? 1 : 0.92);
            return (
              <g key={i}>
                <circle cx={x} cy={700} r={40} fill="#c7cfdb" stroke="#0a0f18" strokeWidth={4} />
                <path d={`M ${x - 50} 820 Q ${x - 50} 750 ${x} 748 Q ${x + 50} 750 ${x + 50} 820 Z`} fill={C.slate} stroke="#0a0f18" strokeWidth={4} />
                <rect x={x + 34} y={760 - 110 * up} width={20} height={70 + 40 * up} rx={9} fill="#c7cfdb" stroke="#0a0f18" strokeWidth={3} />
              </g>
            );
          })}
          <g opacity={walkIn}><Huang x={1180 - walkIn * 320} y={470} s={0.6} mood="smile" wave={1} label={false} /></g>
        </svg>
        <div style={{position: 'absolute', top: 960, left: 60, right: 60, textAlign: 'center', opacity: walkIn, fontFamily: HEAD, fontSize: 40, lineHeight: 1.2, color: C.amber}}>HUANG REINSTATED<br />EFFECTIVE IMMEDIATELY</div>
      </div>
      {/* part 2: the opening bell + price */}
      <div style={{opacity: sw}}>
        <div style={{position: 'absolute', top: 230, left: 0, right: 0, textAlign: 'center'}}>
          <div style={{fontSize: 120, transform: `rotate(${ring}deg)`, display: 'inline-block'}}>🔔</div>
          <div style={{fontFamily: HEAD, fontSize: 52, color: C.cream}}>AT THE OPENING BELL</div>
          <div style={{fontFamily: HEAD, fontSize: 190, color: C.mint, lineHeight: 1.05, opacity: pctP > 0 ? 1 : 0}}>+{(31.93 * pctP).toFixed(2)}%</div>
          <div style={{marginTop: 18, display: 'inline-flex', alignItems: 'center', gap: 22, opacity: priceP, transform: `scale(${0.6 + 0.4 * priceP})`}}>
            <span style={{fontFamily: HEAD, fontSize: 62, color: C.coral, textDecoration: 'line-through'}}>$125.53</span>
            <span style={{fontFamily: HEAD, fontSize: 62, color: C.cream}}>→</span>
            <span style={{fontFamily: HEAD, fontSize: 78, color: C.bg, background: C.mint, padding: '4px 22px', borderRadius: 16}}>$165.61</span>
          </div>
          <div style={{fontFamily: BODY, fontWeight: 700, fontSize: 32, color: C.muted, marginTop: 14, opacity: priceP}}>per share, at the open · Nov 23</div>
        </div>
      </div>
    </Fade>
  );
};

const Probe: React.FC<{dur: number; off: number}> = ({dur, off}) => {
  const f = useCurrentFrame();
  const at = (k: string) => Q[k] - off;
  const stamp = spring({frame: f - at('foreign'), fps: FPS, config: {damping: 9, stiffness: 200}});
  const glass = Math.sin(f / 10) * 40;
  return (
    <Fade dur={dur}>
      <div style={{position: 'absolute', top: 250, left: 0, right: 0, textAlign: 'center'}}>
        <Pop><div style={{fontFamily: HEAD, fontSize: 70, color: C.cream}}>STILL OPEN</div></Pop>
        <Pop delay={6}><div style={{fontFamily: BODY, fontWeight: 700, fontSize: 38, color: C.muted, marginTop: 6}}>independent board committee</div></Pop>
      </div>
      <svg width={1080} height={1920} style={{position: 'absolute'}}>
        <path d="M 300 560 L 470 560 L 500 600 L 780 600 L 780 960 L 300 960 Z" fill={C.amber} stroke="#0a0f18" strokeWidth={6} />
        <rect x={330} y={630} width={420} height={300} rx={10} fill="#f7d58a" />
        <text x={540} y={720} textAnchor="middle" fontFamily={HEAD} fontSize={36} fill={C.bg}>REVIEW:</text>
        <text x={540} y={770} textAnchor="middle" fontFamily={BODY} fontWeight={700} fontSize={30} fill={C.bg}>reports of a foreign</text>
        <text x={540} y={810} textAnchor="middle" fontFamily={BODY} fontWeight={700} fontSize={30} fill={C.bg}>intelligence effort</text>
        <g transform={`translate(${700 + glass}, 640)`}>
          <circle cx={0} cy={0} r={70} fill="rgba(255,255,255,.15)" stroke={C.cream} strokeWidth={14} />
          <rect x={44} y={44} width={26} height={110} rx={12} fill={C.cream} transform="rotate(-45 44 44)" />
        </g>
      </svg>
      <div style={{position: 'absolute', top: 870, left: 0, right: 0, display: 'flex', justifyContent: 'center', opacity: stamp}}>
        <div style={{transform: `scale(${2 - stamp}) rotate(-8deg)`, border: `9px solid ${C.coral}`, color: C.coral, fontFamily: HEAD, fontSize: 60, padding: '6px 26px', borderRadius: 16, background: 'rgba(14,27,46,.85)'}}>
          INVESTIGATION ONGOING
        </div>
      </div>
    </Fade>
  );
};

const CTA: React.FC<{dur: number}> = ({dur}) => {
  const f = useCurrentFrame();
  const pulse = 1 + Math.sin(f / 5) * 0.03;
  const endCard = f > dur - 50;
  return (
    <Fade dur={dur + 12}>
      <AbsoluteFill style={{alignItems: 'center', paddingTop: 230, textAlign: 'center'}}>
        <Pop><div style={{fontFamily: BODY, fontWeight: 700, fontSize: 44, color: C.muted}}>Out Nov 12 · Back Nov 23</div></Pop>
        <Pop delay={8}><div style={{fontFamily: HEAD, fontSize: 120, color: C.cream, marginTop: 20, lineHeight: 1}}>RIGHT<br /><span style={{color: C.amber}}>CALL?</span></div></Pop>
        <Pop delay={20}><div style={{transform: `scale(${pulse})`, marginTop: 40, background: C.amber, color: C.bg, fontFamily: HEAD, fontSize: 52, padding: '22px 44px', borderRadius: 26}}>Tell me in the comments ↓</div></Pop>
        <div style={{marginTop: 36, opacity: endCard ? 1 : 0, fontFamily: HEAD, fontSize: 44, color: C.mint}}>Full money stories on the channel ↑</div>
      </AbsoluteFill>
    </Fade>
  );
};

// mascot track over the whole film (sits beside the captions, never on top of the scenes)
const HeroTrack: React.FC = () => {
  const f = useCurrentFrame();
  if (f >= S[3] && f < S[4]) return null; // the Twist scene draws its own big mascot
  const pose = f < Q.back ? 'stand_talk' : f < S[1] ? 'shock_shock' : f < S[2] ? 'think_talk' : f < S[3] ? 'think_worry'
    : f < Q.pct32 ? 'stand_talk' : f < S[5] ? 'cheer_happy' : f < S[6] ? 'shrug_talk' : 'point_talk';
  return <Hero pose={pose} flip={pose.startsWith('point')} x={165} y={1560} h={420} />;
};

export const NvidiaShort: React.FC = () => {
  const ends = [...S.slice(1), TOTAL];
  const D = (i: number) => ends[i] - S[i];
  return (
    <AbsoluteFill>
      <Background />
      <Sequence durationInFrames={S[1]}><Hook dur={S[1]} /></Sequence>
      <Sequence from={S[1]} durationInFrames={D(1)}><Exit dur={D(1)} off={S[1]} /></Sequence>
      <Sequence from={S[2]} durationInFrames={D(2)}><Slide dur={D(2)} off={S[2]} /></Sequence>
      <Sequence from={S[3]} durationInFrames={D(3)}><Twist dur={D(3)} /></Sequence>
      <Sequence from={S[4]} durationInFrames={D(4)}><Return dur={D(4)} off={S[4]} /></Sequence>
      <Sequence from={S[5]} durationInFrames={D(5)}><Probe dur={D(5)} off={S[5]} /></Sequence>
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
  <Composition id="NvidiaShort" component={NvidiaShort} durationInFrames={TOTAL} fps={FPS} width={1080} height={1920} />
);
