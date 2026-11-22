import React from 'react';
import {AbsoluteFill, Audio, Composition, Img, Sequence, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import T from './timing.json';
import '@fontsource/archivo-black/latin-400.css';
import '@fontsource/fira-sans/latin-400.css';
import '@fontsource/fira-sans/latin-700.css';

// Cut Short (Nov 24, 2026): the twist stretch ($5.86 a person, under 6 cents to the farm) of the Nov 23 Thanksgiving Top 10 long-form, new vertical layouts.
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
    return <circle key={i} cx={x} cy={1920 - y} r={2 + (i % 3)} fill={i % 6 === 0 ? C.coral : '#fff'} opacity={0.07} />;
  });
  return <AbsoluteFill style={{background: `radial-gradient(circle at 50% 30%, #3a2a1c, ${C.bg} 72%)`}}><svg width={1080} height={1920}>{dots}</svg></AbsoluteFill>;
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
  <div style={{position: 'absolute', top: 1440, left: 70, right: 70, textAlign: 'center', fontFamily: BODY, fontSize: 25, color: C.muted}}>Source: American Farm Bureau Federation, 41st Thanksgiving Dinner Cost Survey (released Nov 18, 2026), incl. USDA farm-share estimate</div>
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


const Plate: React.FC<{s: number; on: number}> = ({s, on}) => (
  <svg width={s} height={s} viewBox="0 0 100 100" style={{opacity: on}}><circle cx={50} cy={50} r={44} fill="#e9e4da" stroke={C.ink2} strokeWidth={4} /><circle cx={50} cy={50} r={30} fill="#f7f3ec" /><ellipse cx={46} cy={48} rx={16} ry={10} fill="#b8743c" /><circle cx={62} cy={58} r={6} fill="#c8233f" /></svg>
);
const Turkey: React.FC<{s: number}> = ({s}) => (
  <svg width={s} height={s} viewBox="0 0 100 100"><ellipse cx={50} cy={60} rx={36} ry={24} fill="#b8743c" stroke={C.ink2} strokeWidth={3} /><ellipse cx={42} cy={52} rx={18} ry={9} fill="#d79a5c" /><rect x={14} y={64} width={18} height={8} rx={4} fill="#a3652f" transform="rotate(-25 23 68)" /><rect x={68} y={64} width={18} height={8} rx={4} fill="#a3652f" transform="rotate(25 77 68)" /><circle cx={14} cy={74} r={6} fill={C.cream} /><circle cx={86} cy={74} r={6} fill={C.cream} /></svg>
);
// original farmer character: straw hat, overalls (no real person)
const Farmer: React.FC<{h: number; from: number}> = ({h, from}) => {
  const f = useCurrentFrame();
  const s = sp(f, from);
  return (
    <svg width={h * 0.66} height={h} viewBox="0 0 200 300" style={{transform: `translateY(${(1 - s) * 40}px)`, opacity: s}}>
      <path d="M40 300 V200 Q40 150 100 150 Q160 150 160 200 V300 Z" fill="#3d6fb0" stroke={C.ink2} strokeWidth={6} />
      <rect x={70} y={170} width={60} height={60} fill="#2f5a92" stroke={C.ink2} strokeWidth={5} />
      <circle cx={100} cy={90} r={58} fill="#e8b98f" stroke={C.ink2} strokeWidth={6} />
      <ellipse cx={100} cy={46} rx={92} ry={18} fill="#e2c26a" stroke={C.ink2} strokeWidth={5} />
      <path d="M52 44 Q56 0 100 0 Q144 0 148 44 Z" fill="#e2c26a" stroke={C.ink2} strokeWidth={5} />
      <ellipse cx={82} cy={88} rx={6} ry={8} fill={C.ink2} /><ellipse cx={118} cy={88} rx={6} ry={8} fill={C.ink2} />
      <path d="M86 120 Q100 110 114 120" stroke={C.ink2} strokeWidth={5} fill="none" strokeLinecap="round" />
    </svg>
  );
};

// 1 hook card: payoff numbers at 0.0 s
const Hook: React.FC<{dur: number}> = ({dur}) => {
  const f = useCurrentFrame();
  const o = interpolate(f, [dur - 8, dur], [1, 0], clamp);
  return (
    <AbsoluteFill style={{opacity: o}}>
      <div style={{position: 'absolute', top: 250, width: '100%', textAlign: 'center'}}>
        <div style={{fontFamily: HEAD, fontSize: 60, color: C.cream}}>THANKSGIVING DINNER</div>
        <div style={{marginTop: 24}}><Badge bg={C.red} fg="#fff" size={120} rot={-3}>$5.86</Badge></div>
        <div style={{fontFamily: HEAD, fontSize: 64, color: C.cream, marginTop: 16}}>A PERSON</div>
        <div style={{fontFamily: HEAD, fontSize: 62, color: C.amber, marginTop: 30}}>THE FARMER GETS<br />UNDER 6¢?</div>
      </div>
      <Hero pose="shock_shock" x={540} y={1235} h={300} />
    </AbsoluteFill>
  );
};

// 2 the table split ten ways
const Split: React.FC<{off: number}> = ({off}) => {
  const f = useCurrentFrame();
  const at = (k: string) => Q[k] - off;
  return (
    <AbsoluteFill>
      <div style={{position: 'absolute', top: 240, width: '100%', textAlign: 'center', fontFamily: HEAD, fontSize: 64, color: C.cream}}>$58.63 <span style={{color: C.muted}}>÷ 10 PEOPLE</span></div>
      <div style={{position: 'absolute', top: 360, left: 90, width: 900, display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 22}}>
        {Array.from({length: 10}, (_, i) => <Plate key={i} s={150} on={fade(f, i * 3, 6)} />)}
      </div>
      <div style={{position: 'absolute', top: 760, width: '100%', textAlign: 'center', opacity: fade(f, at('v586') - 2), transform: `scale(${0.8 + 0.2 * sp(f, at('v586') - 2)})`}}>
        <div style={{fontFamily: HEAD, fontSize: 150, color: C.mint, lineHeight: 1}}>$5.86</div>
        <div style={{fontFamily: HEAD, fontSize: 52, color: C.cream}}>a person (about)</div>
      </div>
    </AbsoluteFill>
  );
};

// 3 vs the 2022 record: two thermometer-style columns
const Record: React.FC<{off: number}> = ({off}) => {
  const f = useCurrentFrame();
  const at = (k: string) => Q[k] - off;
  const H = 600 / 64.05;
  const cols: [string, number, string, string, string][] = [['2022 RECORD', 64.05, '$64.05', C.slate, 'v6405'], ['2026', 58.63, '$58.63', C.mint, 'v542']];
  return (
    <AbsoluteFill>
      <div style={{position: 'absolute', top: 240, width: '100%', textAlign: 'center', fontFamily: HEAD, fontSize: 62, color: C.cream}}>STILL BELOW THE RECORD</div>
      <div style={{position: 'absolute', top: 360, left: 0, right: 0, height: 840, display: 'flex', justifyContent: 'center', alignItems: 'flex-end', gap: 120}}>
        {cols.map(([n, v, l, col, k], i) => {
          const g = interpolate(f, [at(k) - 4, at(k) + 18], [0, 1], clamp);
          return (
            <div key={n} style={{width: 260, textAlign: 'center'}}>
              <div style={{fontFamily: HEAD, fontSize: 60, color: i ? C.mint : C.cream, opacity: g}}>{l}</div>
              <div style={{height: v * H * g, background: col, borderRadius: '22px 22px 0 0', marginTop: 8}} />
              <div style={{fontFamily: HEAD, fontSize: 40, color: C.cream, marginTop: 10}}>{n}</div>
            </div>
          );
        })}
      </div>
      <div style={{position: 'absolute', top: 330, left: 0, right: 0, textAlign: 'center', opacity: fade(f, at('v6405') + 10), transform: `scale(${sp(f, at('v6405') + 10)})`}}>
        <Badge bg={C.amber} size={60} rot={-3}>-$5.42</Badge>
      </div>
    </AbsoluteFill>
  );
};

// 4 the food dollar: a 100-cent strip, under 6 go to the farm
const Dollar: React.FC<{off: number}> = ({off}) => {
  const f = useCurrentFrame();
  const at = (k: string) => Q[k] - off;
  const cells = Array.from({length: 100}, (_, i) => i);
  const labels: [string, string][] = [['proc', 'processing'], ['pack', 'packaging'], ['trans', 'transport'], ['store', 'the store']];
  return (
    <AbsoluteFill>
      <div style={{position: 'absolute', top: 240, width: '100%', textAlign: 'center', fontFamily: HEAD, fontSize: 60, color: C.cream, opacity: fade(f, 0)}}>YOUR FOOD DOLLAR</div>
      <div style={{position: 'absolute', top: 320, width: '100%', textAlign: 'center', fontFamily: BODY, fontWeight: 700, fontSize: 34, color: C.muted, opacity: fade(f, at('usda'))}}>USDA estimate, via the Farm Bureau</div>
      <div style={{position: 'absolute', top: 400, left: 140, width: 800, display: 'flex', flexWrap: 'wrap', gap: 8, opacity: fade(f, 4)}}>
        {cells.map((i) => {
          const farm = i < 5 && f >= at('six');
          const half = i === 5 && f >= at('six');
          const rest = i > 5 && f >= at('rest');
          return <div key={i} style={{width: 72, height: 38, borderRadius: 8, background: half ? `linear-gradient(90deg, ${C.mint} 50%, ${f >= at('rest') ? '#4a5f82' : C.panel2} 50%)` : farm ? C.mint : rest ? '#4a5f82' : C.panel2, transform: farm ? `scale(${1 + 0.15 * Math.sin(f / 5)})` : undefined}} />;
        })}
      </div>
      <div style={{position: 'absolute', top: 900, left: 140, opacity: fade(f, at('six'))}}>
        <span style={{fontFamily: HEAD, fontSize: 86, color: C.mint}}>&lt; 6¢</span>
        <span style={{fontFamily: HEAD, fontSize: 46, color: C.cream}}> to the farm</span>
      </div>
      <div style={{position: 'absolute', top: 1020, left: 140, right: 80, display: 'flex', flexWrap: 'wrap', gap: 14}}>
        {labels.map(([k, t]) => <div key={k} style={{opacity: fade(f, at(k)), background: '#4a5f82', color: C.cream, fontFamily: HEAD, fontSize: 36, padding: '6px 20px', borderRadius: 16}}>{t}</div>)}
      </div>
    </AbsoluteFill>
  );
};

// 5 punchline: pricier turkey, not a rich farmer
const Punch: React.FC<{off: number}> = ({off}) => {
  const f = useCurrentFrame();
  const at = (k: string) => Q[k] - off;
  return (
    <AbsoluteFill>
      <div style={{position: 'absolute', top: 250, width: '100%', textAlign: 'center'}}>
        <div style={{fontFamily: HEAD, fontSize: 80, color: C.coral, lineHeight: 1.05}}>PRICIER TURKEY...</div>
        <div style={{fontFamily: HEAD, fontSize: 80, color: C.cream, lineHeight: 1.05, opacity: fade(f, at('farmer'))}}>NOT A RICH<br />FARMER</div>
      </div>
      <div style={{position: 'absolute', top: 620, left: 130, transform: `scale(${sp(f, 0)})`}}><Turkey s={330} /></div>
      <div style={{position: 'absolute', top: 640, left: 560}}><Farmer h={420} from={at('farmer') - 4} /></div>
    </AbsoluteFill>
  );
};

const End: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill style={{alignItems: 'center', paddingTop: 280, textAlign: 'center', opacity: fade(f, 0, 6)}}>
      <div style={{fontFamily: HEAD, fontSize: 72, color: C.cream, lineHeight: 1.1}}>Full Top 10<br />on the channel ↑</div>
      <div style={{fontFamily: HEAD, fontSize: 76, color: C.amber, marginTop: 70, lineHeight: 1.05}}>So what does dinner<br />cost a person?</div>
      <Hero pose="point_smile" x={540} y={1400} h={380} />
    </AbsoluteFill>
  );
};

export const CutShort: React.FC = () => {
  const f = useCurrentFrame();
  const a = Q.split + 4, b = Q.v542 - 8, c = Q.surprise - 6, d = Q.turkey - 4, e = AUD + 4;
  return (
    <AbsoluteFill>
      <Background />
      <Sequence durationInFrames={a}><Hook dur={a} /></Sequence>
      <Sequence from={a} durationInFrames={b - a}><Split off={a} /></Sequence>
      <Sequence from={b} durationInFrames={c - b}><Record off={b} /></Sequence>
      <Sequence from={c} durationInFrames={d - c}><Dollar off={c} /></Sequence>
      <Sequence from={d} durationInFrames={e - d}><Punch off={d} /></Sequence>
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
