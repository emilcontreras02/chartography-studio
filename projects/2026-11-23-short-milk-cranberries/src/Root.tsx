import React from 'react';
import {AbsoluteFill, Audio, Composition, Img, Sequence, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import T from './timing.json';
import '@fontsource/archivo-black/latin-400.css';
import '@fontsource/fira-sans/latin-400.css';
import '@fontsource/fira-sans/latin-700.css';

// Cut Short (Nov 23, 2026): #3 milk + #2 cranberries stretch of the Thanksgiving Top 10 long-form, new vertical layouts.
const C = {bg: '#0e1b2e', panel: '#16283f', panel2: '#22365a', cream: '#f6f1e7', muted: '#afb8c6', slate: '#5c7392', mint: '#3fd6a0', amber: '#f2b544', coral: '#ff8a65', red: '#ff5d5d'};
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
    return <circle key={i} cx={x} cy={1920 - y} r={2 + (i % 3)} fill={i % 6 === 0 ? C.coral : '#fff'} opacity={0.07} />;
  });
  return <AbsoluteFill style={{background: `radial-gradient(circle at 50% 35%, #2a2440, ${C.bg} 72%)`}}><svg width={1080} height={1920}>{dots}</svg></AbsoluteFill>;
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
  <div style={{position: 'absolute', top: 1440, left: 70, right: 70, textAlign: 'center', fontFamily: BODY, fontSize: 25, color: C.muted}}>Source: American Farm Bureau Federation, 41st Thanksgiving Dinner Cost Survey (released Nov 18, 2026) · % change vs 2025</div>
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

const Milk: React.FC<{s: number}> = ({s}) => (
  <svg width={s} height={s} viewBox="0 0 100 100"><path d="M32 22 H62 L74 36 V88 H26 V36 Z" fill="#eef2f6" /><rect x={40} y={10} width={16} height={12} rx={3} fill="#4b8fd6" /><rect x={26} y={52} width={48} height={18} fill="#4b8fd6" /></svg>
);
const Cran: React.FC<{s: number}> = ({s}) => (
  <svg width={s} height={s} viewBox="0 0 100 100"><path d="M24 22 H76 L72 88 H28 Z" fill="#f3e6e6" opacity={0.9} />{[[38, 50], [52, 46], [64, 54], [44, 64], [58, 68], [36, 76], [62, 80], [50, 80]].map(([x, y], i) => <circle key={i} cx={x} cy={y} r={7} fill="#c8233f" />)}</svg>
);
const Turkey: React.FC<{s: number}> = ({s}) => (
  <svg width={s} height={s} viewBox="0 0 100 100"><ellipse cx={50} cy={60} rx={36} ry={24} fill="#b8743c" /><ellipse cx={42} cy={52} rx={18} ry={9} fill="#d79a5c" /><rect x={14} y={64} width={18} height={8} rx={4} fill="#a3652f" transform="rotate(-25 23 68)" /><rect x={68} y={64} width={18} height={8} rx={4} fill="#a3652f" transform="rotate(25 77 68)" /><circle cx={14} cy={74} r={6} fill={C.cream} /><circle cx={86} cy={74} r={6} fill={C.cream} /></svg>
);

// hook card: payoff numbers on the first frame
const Hook: React.FC<{dur: number}> = ({dur}) => {
  const f = useCurrentFrame();
  const o = interpolate(f, [dur - 8, dur], [1, 0], clamp);
  return (
    <AbsoluteFill style={{opacity: o}}>
      <div style={{position: 'absolute', top: 250, width: '100%', textAlign: 'center'}}>
        <div style={{fontFamily: HEAD, fontSize: 64, color: C.cream}}>THANKSGIVING 2026</div>
        <div style={{display: 'inline-block', marginTop: 20, background: C.red, color: '#fff', fontFamily: HEAD, fontSize: 100, padding: '6px 30px', borderRadius: 24, transform: 'rotate(-3deg)', lineHeight: 1.05}}>CRANBERRIES<br />+8.8%</div>
        <div style={{fontFamily: HEAD, fontSize: 96, color: C.coral, marginTop: 26}}>MILK +8.6%</div>
        <div style={{fontFamily: HEAD, fontSize: 62, color: C.amber, marginTop: 22}}>not just the turkey?</div>
      </div>
      <Hero pose="shock_shock" x={540} y={1230} h={330} />
    </AbsoluteFill>
  );
};

// one item: icon with a swinging price tag and a rising % meter
const ItemScene: React.FC<{off: number; rank: string; name: string; size: string; price: string; pct: number; pk: string; vk: string; wk: string; why: string; icon: React.ReactNode}> = ({off, rank, name, size, price, pct, pk, vk, wk, why, icon}) => {
  const f = useCurrentFrame();
  const at = (k: string) => Q[k] - off;
  const a = sp(f, 0);
  const meter = interpolate(f, [at(pk), at(pk) + 22], [0, pct], clamp);
  return (
    <AbsoluteFill>
      <div style={{position: 'absolute', top: 230, left: 70, display: 'flex', alignItems: 'center', gap: 24, opacity: a, transform: `translateY(${(1 - a) * 40}px)`}}>
        <div style={{background: C.amber, color: C.bg, fontFamily: HEAD, fontSize: 90, padding: '0 26px', borderRadius: 24}}>{rank}</div>
        <div>
          <div style={{fontFamily: HEAD, fontSize: 82, color: C.cream, lineHeight: 1}}>{name}</div>
          <div style={{fontFamily: BODY, fontWeight: 700, fontSize: 36, color: C.muted}}>{size}</div>
        </div>
      </div>
      <div style={{position: 'absolute', top: 470, left: 90, transform: `scale(${sp(f, 2)})`}}>{icon}</div>
      {/* price tag */}
      <div style={{position: 'absolute', top: 470, left: 470, opacity: fade(f, at(vk)), transform: `rotate(${Math.sin(f / 9) * 3 - 4}deg) scale(${0.8 + 0.2 * sp(f, at(vk))})`, transformOrigin: '0 50%'}}>
        <div style={{width: 500, height: 170, background: C.cream, clipPath: 'polygon(12% 0, 100% 0, 100% 100%, 12% 100%, 0 50%)', display: 'flex', alignItems: 'center', justifyContent: 'center', paddingLeft: 40, fontFamily: HEAD, fontSize: 104, color: C.bg}}>{price}</div>
      </div>
      {/* meter */}
      <div style={{position: 'absolute', top: 690, left: 470, width: 520, opacity: fade(f, at(pk) - 4)}}>
        <div style={{fontFamily: HEAD, fontSize: 120, color: C.coral, lineHeight: 1}}>+{meter.toFixed(1)}%</div>
        <div style={{height: 34, background: C.panel2, borderRadius: 17, marginTop: 10}}><div style={{width: `${(meter / 10.1) * 100}%`, height: 34, background: C.coral, borderRadius: 17}} /></div>
        <div style={{fontFamily: BODY, fontSize: 26, color: C.muted, marginTop: 6}}>vs 2025 · scale: the turkey's +10.1% = full bar</div>
      </div>
      <div style={{position: 'absolute', top: 990, left: 70, right: 70, opacity: fade(f, at(wk)), transform: `translateY(${(1 - sp(f, at(wk))) * 30}px)`}}>
        <div style={{background: C.panel, border: `4px solid ${C.slate}`, borderRadius: 26, padding: '20px 30px', fontFamily: BODY, fontWeight: 700, fontSize: 40, color: C.cream, textAlign: 'center'}}><span style={{color: C.amber}}>WHY? </span>{why}</div>
      </div>
    </AbsoluteFill>
  );
};

const Tie: React.FC<{off: number}> = ({off}) => {
  const f = useCurrentFrame();
  const at = (k: string) => Q[k] - off;
  const tk = at('turkey');
  const bars: [string, number, React.ReactNode][] = [['MILK', 8.6, <Milk s={130} />], ['CRANBERRIES', 8.8, <Cran s={130} />]];
  const tO = fade(f, tk - 4);
  return (
    <AbsoluteFill>
      <div style={{position: 'absolute', top: 240, width: '100%', textAlign: 'center', fontFamily: HEAD, fontSize: 78, color: C.cream, opacity: 1 - tO}}>ALMOST <span style={{color: C.amber}}>TIED</span></div>
      <div style={{position: 'absolute', top: 380, left: 0, right: 0, display: 'flex', justifyContent: 'center', alignItems: 'flex-end', gap: 90, height: 640, opacity: 1 - tO}}>
        {bars.map(([n, v, ic], k) => {
          const g = interpolate(f, [k * 6, k * 6 + 20], [0, 1], clamp);
          return (
            <div key={n} style={{textAlign: 'center', width: 280}}>
              <div style={{fontFamily: HEAD, fontSize: 64, color: C.coral}}>+{v}%</div>
              <div style={{height: v * 48 * g, background: k ? C.coral : C.slate, borderRadius: '18px 18px 0 0', marginTop: 8}} />
              <div style={{display: 'flex', justifyContent: 'center', marginTop: 10}}>{ic}</div>
              <div style={{fontFamily: HEAD, fontSize: 40, color: C.cream}}>{n}</div>
            </div>
          );
        })}
      </div>
      <div style={{position: 'absolute', top: 1120, width: '100%', textAlign: 'center', opacity: fade(f, at('pts')) * (1 - tO)}}>
        <span style={{background: C.amber, color: C.bg, fontFamily: HEAD, fontSize: 50, padding: '10px 30px', borderRadius: 20}}>0.2 points apart</span>
      </div>
      {/* punchline: the turkey isn't alone */}
      <AbsoluteFill style={{opacity: tO}}>
        <div style={{position: 'absolute', top: 250, width: '100%', textAlign: 'center'}}>
          <div style={{fontFamily: HEAD, fontSize: 88, color: C.cream, lineHeight: 1.05}}>THE TURKEY<br />IS <span style={{color: C.coral}}>NOT ALONE</span></div>
        </div>
        <div style={{position: 'absolute', top: 560, left: 0, right: 0, display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 20}}>
          <Milk s={170} /><Turkey s={300} /><Cran s={170} />
        </div>
        <div style={{position: 'absolute', top: 900, width: '100%', textAlign: 'center', fontFamily: HEAD, fontSize: 52, color: C.coral}}>+8.6% · +10.1% · +8.8%</div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

const End: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill style={{alignItems: 'center', paddingTop: 280, textAlign: 'center', opacity: fade(f, 0, 6)}}>
      <div style={{fontFamily: HEAD, fontSize: 72, color: C.cream, lineHeight: 1.1}}>Full Top 10<br />on the channel ↑</div>
      <div style={{fontFamily: HEAD, fontSize: 80, color: C.amber, marginTop: 70, lineHeight: 1.05}}>What's on your<br />table this year?</div>
      <Hero pose="point_smile" x={540} y={1400} h={380} />
    </AbsoluteFill>
  );
};

export const CutShort: React.FC = () => {
  const f = useCurrentFrame();
  const hookEnd = Q.milk + 6;
  const tieStart = Q.tie - 4;
  return (
    <AbsoluteFill>
      <Background />
      <Sequence durationInFrames={hookEnd}><Hook dur={hookEnd} /></Sequence>
      <Sequence from={hookEnd} durationInFrames={Q.s2 - 4 - hookEnd}>
        <ItemScene off={hookEnd} rank="#3" name="Whole milk" size="1 gallon" price="$4.05" pct={8.6} pk="p3" vk="v3" wk="why3" why="demand for powdered protein made from milk (AFBF)" icon={<Milk s={340} />} />
      </Sequence>
      <Sequence from={Q.s2 - 4} durationInFrames={tieStart - (Q.s2 - 4)}>
        <ItemScene off={Q.s2 - 4} rank="#2" name="Cranberries" size="12-oz bag, fresh" price="$2.48" pct={8.8} pk="p2" vk="v2" wk="why2" why="high fuel costs for harvesting + transport (AFBF)" icon={<Cran s={340} />} />
      </Sequence>
      <Sequence from={tieStart} durationInFrames={AUD + 4 - tieStart}><Tie off={tieStart} /></Sequence>
      <Sequence from={AUD + 4}><End /></Sequence>
      {f < AUD + 4 && f >= Q.turkey && <Hero pose="shrug_talk" x={170} y={1235} h={250} from={Q.turkey} />}
      <Brand />
      <Captions />
      {f < AUD + 4 && <Source />}
      <Audio src={staticFile('vo.mp3')} />
    </AbsoluteFill>
  );
};

export const Root: React.FC = () => (
  <Composition id="CutShort" component={CutShort} durationInFrames={TOTAL} fps={FPS} width={1080} height={1920} />
);
