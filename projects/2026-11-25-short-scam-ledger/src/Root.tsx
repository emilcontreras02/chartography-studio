import React from 'react';
import {AbsoluteFill, Audio, Composition, Img, Sequence, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import T from './timing.json';
import '@fontsource/archivo-black/latin-400.css';
import '@fontsource/fira-sans/latin-400.css';
import '@fontsource/fira-sans/latin-700.css';

// Cut Short (Nov 25, 2026): the money-ledger stretch ($15.9B, +25%, ~430% since 2020) of the Nov 24 scam-call story long-form, new vertical layouts.
const C = {bg: '#0e1b2e', panel: '#16283f', panel2: '#22365a', cream: '#f6f1e7', muted: '#afb8c6', slate: '#5c7392', mint: '#3fd6a0', amber: '#f2b544', coral: '#ff8a65', red: '#ff5d5d', ink2: '#0b1220'};
const HEAD = "'Archivo Black', sans-serif";
const BODY = "'Fira Sans', sans-serif";
const FPS = 30;
const fr = (s: number) => Math.round(s * FPS);
const Q = Object.fromEntries(Object.entries(T.cues).map(([k, v]) => [k, fr(v as number)])) as Record<string, number>;
const AUD = fr(T.dur);
const TOTAL = fr(T.dur + 1.6);
const clamp = {extrapolateLeft: 'clamp' as const, extrapolateRight: 'clamp' as const};
const sp = (f: number, at: number) => spring({frame: f - at, fps: FPS, config: {damping: 12, stiffness: 150}});
const fade = (f: number, at: number, len = 8) => interpolate(f, [at, at + len], [0, 1], clamp);

const Background: React.FC = () => {
  const f = useCurrentFrame();
  const dots = Array.from({length: 40}, (_, i) => {
    const x = (i * 263) % 1080, y = ((i * 517) % 1920 + f * (0.3 + (i % 5) * 0.1)) % 1920;
    return <circle key={i} cx={x} cy={1920 - y} r={2 + (i % 3)} fill={i % 6 === 0 ? C.mint : '#fff'} opacity={0.07} />;
  });
  return <AbsoluteFill style={{background: `radial-gradient(circle at 50% 30%, #14324a, ${C.bg} 72%)`}}><svg width={1080} height={1920}>{dots}</svg></AbsoluteFill>;
};

const Hero: React.FC<{pose: string; x: number; y: number; h: number; from?: number; flip?: boolean}> = ({pose, x, y, h, from = 0, flip}) => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const s = spring({frame: f - from, fps, config: {damping: 11, stiffness: 160}});
  const w = h * 0.6;
  return <Img src={staticFile(`sprites/hero_${pose}.png`)} style={{position: 'absolute', left: x - w / 2, top: y - h + Math.sin(f / 7) * 5 + (1 - s) * 80, width: w, height: h, transform: `scale(${flip ? -s : s}, ${s})`, transformOrigin: '50% 100%', filter: 'drop-shadow(0 18px 18px rgba(0,0,0,.35))'}} />;
};

const Brand: React.FC = () => (
  <div style={{position: 'absolute', top: 96, left: 0, right: 0, textAlign: 'center', fontFamily: HEAD, fontSize: 30, color: C.cream, letterSpacing: 5, opacity: 0.85}}>CHART<span style={{color: C.amber}}>OGRAPHY</span></div>
);
const Source: React.FC = () => (
  <div style={{position: 'absolute', top: 1440, left: 70, right: 70, textAlign: 'center', fontFamily: BODY, fontSize: 25, color: C.muted}}>Source: FTC testimony to the Joint Economic Committee, Mar 25, 2026 (reported fraud losses, 2025 data)</div>
);

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
    <div style={{position: 'absolute', top: 1250, left: 40, right: 40, textAlign: 'center', fontFamily: HEAD, fontSize: 64, lineHeight: 1.15, color: '#fff', WebkitTextStroke: `10px ${C.bg}`, paintOrder: 'stroke fill'}}>
      {ch.map((w, i) => {
        const on = t >= (w[1] as number) && (i === ch.length - 1 || t < (ch[i + 1][1] as number));
        return <span key={i} style={{display: 'inline-block', margin: '0 8px', padding: '0 10px', borderRadius: 14, background: on ? C.amber : 'transparent', color: on ? C.bg : (w[4] ? C.coral : '#fff'), WebkitTextStroke: on ? '0px' : `10px ${C.bg}`}}>{w[0] as string}</span>;
      })}
    </div>
  );
};

const Badge: React.FC<{children: React.ReactNode; bg?: string; fg?: string; size?: number; rot?: number}> = ({children, bg = C.amber, fg = C.bg, size = 56, rot = 0}) => (
  <span style={{display: 'inline-block', background: bg, color: fg, fontFamily: HEAD, fontSize: size, padding: '6px 26px', borderRadius: 20, transform: `rotate(${rot}deg)`, lineHeight: 1.1}}>{children}</span>
);
const money = (v: number) => v.toFixed(1);

// a ringing phone whose screen shows a cash drain
const Phone: React.FC<{s: number}> = ({s}) => {
  const f = useCurrentFrame();
  const wob = Math.sin(f / 2.2) * (f % 40 < 18 ? 5 : 0);
  return (
    <svg width={s * 0.6} height={s} viewBox="0 0 120 200" style={{transform: `rotate(${wob}deg)`}}>
      <rect x={6} y={4} width={108} height={192} rx={18} fill={C.ink2} stroke={C.cream} strokeWidth={4} />
      <rect x={16} y={22} width={88} height={150} rx={8} fill="#123a2e" />
      <text x={60} y={92} textAnchor="middle" fontFamily={HEAD} fontSize={34} fill={C.mint}>...</text>
      <text x={60} y={130} textAnchor="middle" fontFamily={BODY} fontWeight={700} fontSize={14} fill={C.muted}>UNKNOWN</text>
      <circle cx={60} cy={184} r={6} fill={C.cream} />
    </svg>
  );
};

// 1 hook card: payoff number at 0.0 s
const Hook: React.FC<{dur: number}> = ({dur}) => {
  const f = useCurrentFrame();
  const o = interpolate(f, [dur - 8, dur], [1, 0], clamp);
  return (
    <AbsoluteFill style={{opacity: o}}>
      <div style={{position: 'absolute', top: 250, width: '100%', textAlign: 'center'}}>
        <div style={{fontFamily: HEAD, fontSize: 58, color: C.cream}}>AMERICANS REPORTED LOSING</div>
        <div style={{marginTop: 26}}><Badge bg={C.red} fg="#fff" size={108} rot={-2}>$15.9 BILLION</Badge></div>
        <div style={{fontFamily: HEAD, fontSize: 70, color: C.amber, marginTop: 22}}>TO FRAUD. IN ONE YEAR.</div>
        <div style={{fontFamily: BODY, fontWeight: 700, fontSize: 40, color: C.muted, marginTop: 14, opacity: fade(f, 4)}}>3 million reports · 2025</div>
      </div>
      <div style={{position: 'absolute', top: 800, left: 170}}><Phone s={360} /></div>
      <Hero pose="shock_shock" x={730} y={1225} h={400} />
    </AbsoluteFill>
  );
};

// 2 2024 vs 2025: two cash stacks
const Stack: React.FC<{n: number; on: number; col: string}> = ({n, on, col}) => (
  <div style={{display: 'flex', flexDirection: 'column-reverse', alignItems: 'center', gap: 6}}>
    {Array.from({length: n}, (_, i) => <div key={i} style={{width: 250, height: 34, borderRadius: 8, background: col, border: `4px solid ${C.ink2}`, opacity: on > i / n ? 1 : 0, transform: `translateY(${on > i / n ? 0 : -30}px)`}} />)}
  </div>
);
const Compare: React.FC<{off: number}> = ({off}) => {
  const f = useCurrentFrame();
  const at = (k: string) => Q[k] - off;
  const g24 = interpolate(f, [at('m26'), at('b12') + 10], [0, 1], clamp);
  const g25 = interpolate(f, [0, 16], [0, 1], clamp);
  return (
    <AbsoluteFill>
      <div style={{position: 'absolute', top: 250, width: '100%', textAlign: 'center', fontFamily: HEAD, fontSize: 66, color: C.cream}}>ONE YEAR LATER</div>
      <div style={{position: 'absolute', top: 345, width: '100%', textAlign: 'center', opacity: fade(f, at('p25')), transform: `scale(${sp(f, at('p25'))})`}}><Badge bg={C.amber} size={72} rot={-3}>ABOUT +25%</Badge></div>
      <div style={{position: 'absolute', top: 470, left: 0, right: 0, height: 720, display: 'flex', justifyContent: 'center', alignItems: 'flex-end', gap: 110}}>
        <div style={{textAlign: 'center'}}>
          <div style={{fontFamily: HEAD, fontSize: 56, color: C.cream, opacity: fade(f, at('b12'))}}>$12B+</div>
          <Stack n={9} on={g24} col={C.slate} />
          <div style={{fontFamily: HEAD, fontSize: 44, color: C.cream, marginTop: 10}}>2024</div>
          <div style={{fontFamily: BODY, fontWeight: 700, fontSize: 30, color: C.muted, opacity: fade(f, at('m26'))}}>2.6M reports</div>
        </div>
        <div style={{textAlign: 'center'}}>
          <div style={{fontFamily: HEAD, fontSize: 56, color: C.mint}}>$15.9B</div>
          <Stack n={12} on={g25} col={C.mint} />
          <div style={{fontFamily: HEAD, fontSize: 44, color: C.cream, marginTop: 10}}>2025</div>
          <div style={{fontFamily: BODY, fontWeight: 700, fontSize: 30, color: C.muted}}>3M reports</div>
        </div>
      </div>
    </AbsoluteFill>
  );
};

// 3 the staircase: every year higher
const Stairs: React.FC<{off: number}> = ({off}) => {
  const f = useCurrentFrame();
  const at = (k: string) => Q[k] - off;
  const steps: [string, number, string, number][] = [['2021', 6, '$6B+', at('b6')], ['2022', 9, '~$9B', at('b9')], ['2023', 10, '$10B+', at('b10')], ['2024', 12, '$12B+', at('b10') + 30], ['2025', 15.9, '$15.9B', at('b10') + 40]];
  const W = 160, U = 42;
  return (
    <AbsoluteFill>
      <div style={{position: 'absolute', top: 250, width: '100%', textAlign: 'center', fontFamily: HEAD, fontSize: 60, color: C.cream}}>UP EVERY YEAR</div>
      <div style={{position: 'absolute', top: 330, width: '100%', textAlign: 'center', fontFamily: BODY, fontWeight: 700, fontSize: 36, color: C.muted}}>reported fraud losses, US</div>
      <div style={{position: 'absolute', left: 115, top: 420, width: 850, height: 760}}>
        {steps.map(([y, v, l, t], i) => {
          const h = v * U * interpolate(f, [t, t + 10], [0, 1], clamp);
          return (
            <div key={y} style={{position: 'absolute', left: i * (W + 10), bottom: 50, width: W, height: h, background: i === 4 ? C.red : i === 3 ? C.coral : C.slate, borderRadius: '14px 14px 0 0', border: `4px solid ${C.ink2}`}}>
              <div style={{position: 'absolute', top: -62, width: '100%', textAlign: 'center', fontFamily: HEAD, fontSize: 38, color: C.cream, opacity: fade(f, t + 4)}}>{l}</div>
            </div>
          );
        })}
        {steps.map(([y, , , t], i) => <div key={'y' + y} style={{position: 'absolute', left: i * (W + 10), bottom: 0, width: W, textAlign: 'center', fontFamily: HEAD, fontSize: 34, color: C.cream, opacity: fade(f, t)}}>{y}</div>)}
      </div>
    </AbsoluteFill>
  );
};

// 4 since 2020: a 430% counter with a rising arrow
const Rocket: React.FC<{off: number}> = ({off}) => {
  const f = useCurrentFrame();
  const at = (k: string) => Q[k] - off;
  const v = Math.round(430 * interpolate(f, [at('p430') - 6, at('p430') + 20], [0, 1], clamp));
  const p = interpolate(f, [0, at('p430') + 20], [0, 1], clamp);
  return (
    <AbsoluteFill>
      <div style={{position: 'absolute', top: 260, width: '100%', textAlign: 'center', fontFamily: HEAD, fontSize: 64, color: C.cream}}>SINCE 2020</div>
      <svg width={1080} height={320} style={{position: 'absolute', top: 360}}>
        <path d={`M120 290 Q 520 270 ${120 + 800 * p} ${290 - 250 * p * p}`} stroke={C.red} strokeWidth={22} fill="none" strokeLinecap="round" />
        <circle cx={120 + 800 * p} cy={290 - 250 * p * p} r={26} fill={C.amber} stroke={C.ink2} strokeWidth={6} />
      </svg>
      <div style={{position: 'absolute', top: 720, left: 0, right: 0, textAlign: 'center'}}>
        <div style={{fontFamily: HEAD, fontSize: 210, color: C.red, lineHeight: 1, WebkitTextStroke: `8px ${C.bg}`, paintOrder: 'stroke fill'}}>+{v}%</div>
        <div style={{fontFamily: HEAD, fontSize: 52, color: C.cream, opacity: fade(f, at('p430'))}}>nearly · 2020 to 2025</div>
      </div>
    </AbsoluteFill>
  );
};

// 5 the big driver: $100,000+ losses
const Driver: React.FC<{off: number}> = ({off}) => {
  const f = useCurrentFrame();
  const at = (k: string) => Q[k] - off;
  return (
    <AbsoluteFill>
      <div style={{position: 'absolute', top: 260, width: '100%', textAlign: 'center', fontFamily: HEAD, fontSize: 60, color: C.cream}}>THE BIG DRIVER?</div>
      <div style={{position: 'absolute', top: 360, width: '100%', textAlign: 'center', fontFamily: BODY, fontWeight: 700, fontSize: 38, color: C.muted}}>per the FTC</div>
      <div style={{position: 'absolute', top: 470, left: 90, right: 90, background: C.panel, border: `6px solid ${C.red}`, borderRadius: 30, padding: '40px 20px', textAlign: 'center', opacity: fade(f, at('k100') - 4), transform: `scale(${0.85 + 0.15 * sp(f, at('k100') - 4)})`}}>
        <div style={{fontFamily: BODY, fontWeight: 700, fontSize: 44, color: C.cream}}>more people losing</div>
        <div style={{fontFamily: HEAD, fontSize: 150, color: C.red, lineHeight: 1.05}}>$100,000</div>
        <div style={{fontFamily: HEAD, fontSize: 60, color: C.amber}}>OR MORE</div>
      </div>
      <Hero pose="think_worry" x={540} y={1230} h={300} from={4} />
    </AbsoluteFill>
  );
};

const End: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill style={{alignItems: 'center', paddingTop: 280, textAlign: 'center', opacity: fade(f, 0, 6)}}>
      <div style={{fontFamily: HEAD, fontSize: 72, color: C.cream, lineHeight: 1.1}}>Full story on<br />the channel ↑</div>
      <div style={{fontFamily: HEAD, fontSize: 74, color: C.amber, marginTop: 70, lineHeight: 1.05}}>So how much did<br />America lose?</div>
      <Hero pose="point_smile" x={540} y={1400} h={380} />
    </AbsoluteFill>
  );
};

export const CutShort: React.FC = () => {
  const f = useCurrentFrame();
  const a = Q.p25 - 4, b = Q.every - 6, c = Q.since - 6, d = Q.ftc - 6, e = AUD + 4;
  return (
    <AbsoluteFill>
      <Background />
      <Sequence durationInFrames={a}><Hook dur={a} /></Sequence>
      <Sequence from={a} durationInFrames={b - a}><Compare off={a} /></Sequence>
      <Sequence from={b} durationInFrames={c - b}><Stairs off={b} /></Sequence>
      <Sequence from={c} durationInFrames={d - c}><Rocket off={c} /></Sequence>
      <Sequence from={d} durationInFrames={e - d}><Driver off={d} /></Sequence>
      <Sequence from={e}><End /></Sequence>
      <Brand />
      <Captions />
      {f < e && <Source />}
      <Audio src={staticFile('vo.mp3')} />
    </AbsoluteFill>
  );
};

export const Root: React.FC = () => (
  <Composition id="CutShort" component={CutShort} durationInFrames={TOTAL} fps={FPS} width={1080} height={1920} />
);
