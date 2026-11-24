import React from 'react';
import {AbsoluteFill, Audio, Composition, Img, Sequence, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import T from './timing.json';
import '@fontsource/archivo-black/latin-400.css';
import '@fontsource/fira-sans/latin-400.css';
import '@fontsource/fira-sans/latin-700.css';

// Cut Short (Nov 27, 2026): the China stretch ($563.9B, lowest since 2008; Japan 5 drops) of the Nov 25 US-debt Day-by-Day long-form, new vertical layouts.
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
  <div style={{position: 'absolute', top: 1440, left: 70, right: 70, textAlign: 'center', fontFamily: BODY, fontSize: 25, color: C.muted}}>Source: US Treasury TIC data, holdings as of Sep 2026 (released Nov 18, 2026) · Reuters, Nov 19, 2026</div>
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


// a stack of plain bond certificates; n = how many are still there
const Bonds: React.FC<{n: number; total: number; w: number}> = ({n, total, w}) => {
  const f = useCurrentFrame();
  return (
    <div style={{display: 'flex', flexDirection: 'column-reverse', alignItems: 'center', gap: 8}}>
      {Array.from({length: total}, (_, i) => {
        const on = i < n;
        return (
          <div key={i} style={{width: w, height: 46, borderRadius: 6, background: on ? C.cream : 'transparent', border: `4px ${on ? 'solid' : 'dashed'} ${on ? C.ink2 : C.slate}`, transform: `rotate(${on ? Math.sin(i * 1.7 + f / 20) * 2 : 0}deg)`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: HEAD, fontSize: 20, color: C.ink2, letterSpacing: 3, opacity: on ? 1 : 0.5}}>
            {on ? 'US TREASURY' : ''}
          </div>
        );
      })}
    </div>
  );
};

// 1 hook card: payoff number at 0.0 s
const Hook: React.FC<{dur: number}> = ({dur}) => {
  const f = useCurrentFrame();
  const o = interpolate(f, [dur - 8, dur], [1, 0], clamp);
  const n = Math.round(interpolate(f, [0, Q.least], [10, 7], clamp));
  return (
    <AbsoluteFill style={{opacity: o}}>
      <div style={{position: 'absolute', top: 250, width: '100%', textAlign: 'center'}}>
        <div style={{fontFamily: HEAD, fontSize: 76, color: C.amber}}>CHINA IS SELLING?</div>
        <div style={{marginTop: 24}}><Badge bg={C.red} fg="#fff" size={136} rot={-2}>$563.9B</Badge></div>
        <div style={{fontFamily: HEAD, fontSize: 54, color: C.cream, marginTop: 20}}>OF US TREASURIES</div>
      </div>
      <div style={{position: 'absolute', top: 690, left: 70, width: 470, height: 520, display: 'flex', alignItems: 'flex-end', justifyContent: 'center'}}><Bonds n={n} total={10} w={330} /></div>
      <div style={{position: 'absolute', top: 720, right: 60, width: 420, textAlign: 'center', opacity: fade(f, Q.least), transform: `scale(${sp(f, Q.least)}) rotate(4deg)`}}>
        <div style={{border: `7px solid ${C.mint}`, borderRadius: 24, padding: '14px 10px', fontFamily: HEAD, fontSize: 54, color: C.mint, lineHeight: 1.1}}>LOWEST<br />SINCE 2008</div>
      </div>
      <Hero pose="shock_shock" x={790} y={1225} h={330} from={-20} />
    </AbsoluteFill>
  );
};

// 2 September alone: Aug vs Sep columns (from zero)
const Shrink: React.FC<{off: number}> = ({off}) => {
  const f = useCurrentFrame();
  const at = (k: string) => Q[k] - off;
  const H = 430;
  const g = interpolate(f, [0, 14], [0, 1], clamp);
  const col = (v: number, c: string, lab: string, sub: string, show: number) => (
    <div style={{textAlign: 'center', width: 300}}>
      <div style={{fontFamily: HEAD, fontSize: 64, color: c === C.coral ? C.coral : C.cream, opacity: fade(f, show)}}>${v.toFixed(1)}B</div>
      <div style={{height: H * (v / 600) * g, background: c, border: `5px solid ${C.ink2}`, borderRadius: '18px 18px 0 0', marginTop: 10}} />
      <div style={{fontFamily: HEAD, fontSize: 46, color: C.cream, marginTop: 12}}>{lab}</div>
      <div style={{fontFamily: BODY, fontWeight: 700, fontSize: 30, color: C.muted}}>{sub}</div>
    </div>
  );
  return (
    <AbsoluteFill>
      <div style={{position: 'absolute', top: 250, width: '100%', textAlign: 'center', fontFamily: HEAD, fontSize: 66, color: C.cream}}>SEPTEMBER ALONE</div>
      <div style={{position: 'absolute', top: 345, width: '100%', textAlign: 'center', opacity: fade(f, at('pct')), transform: `scale(${sp(f, at('pct'))})`}}><Badge bg={C.coral} size={76} rot={-3}>ABOUT -4.5%</Badge></div>
      <div style={{position: 'absolute', top: 1185, left: 140, right: 140, height: 6, background: C.cream, opacity: 0.5}} />
      <div style={{position: 'absolute', top: 470, left: 0, right: 0, height: 715, display: 'flex', justifyContent: 'center', alignItems: 'flex-end', gap: 90}}>
        {col(590.7, C.slate, 'AUG', '2026', at('b591'))}
        {col(563.9, C.coral, 'SEP', '2026', 0)}
      </div>
    </AbsoluteFill>
  );
};

// 3 fourth drop in a row: four tiles
const Fourth: React.FC<{off: number}> = ({off}) => {
  const f = useCurrentFrame();
  const at = (k: string) => Q[k] - off;
  return (
    <AbsoluteFill>
      <div style={{position: 'absolute', top: 260, width: '100%', textAlign: 'center', fontFamily: HEAD, fontSize: 64, color: C.cream}}>CHINA'S HOLDINGS</div>
      <div style={{position: 'absolute', top: 345, width: '100%', textAlign: 'center', fontFamily: BODY, fontWeight: 700, fontSize: 40, color: C.muted}}>monthly change, in a row</div>
      <div style={{position: 'absolute', top: 480, left: 60, right: 60, display: 'flex', justifyContent: 'center', gap: 26}}>
        {[1, 2, 3, 4].map((i) => {
          const t = at('fourth') - 24 + i * 6;
          const last = i === 4;
          return (
            <div key={i} style={{width: 210, height: 330, borderRadius: 26, background: last ? C.red : C.panel2, border: `5px solid ${C.ink2}`, textAlign: 'center', opacity: fade(f, t), transform: `translateY(${(1 - sp(f, t)) * 60 + (last ? 30 : 0)}px)`}}>
              <div style={{fontFamily: HEAD, fontSize: 150, color: last ? '#fff' : C.coral, lineHeight: 1.3}}>↓</div>
              <div style={{fontFamily: HEAD, fontSize: 64, color: '#fff'}}>{i}</div>
            </div>
          );
        })}
      </div>
      <div style={{position: 'absolute', top: 900, width: '100%', textAlign: 'center', opacity: fade(f, at('fourth') + 4)}}>
        <div style={{fontFamily: HEAD, fontSize: 92, color: C.red, lineHeight: 1.05}}>4 DROPS</div>
        <div style={{fontFamily: HEAD, fontSize: 56, color: C.cream}}>the 4th: September 2026</div>
      </div>
    </AbsoluteFill>
  );
};

// 4 Japan: five straight cuts, peak vs now
const Japan: React.FC<{off: number}> = ({off}) => {
  const f = useCurrentFrame();
  const at = (k: string) => Q[k] - off;
  const bar = (lab: string, sub: string, v: number, val: string, c: string, t: number) => (
    <div style={{marginBottom: 34, opacity: fade(f, t)}}>
      <div style={{fontFamily: HEAD, fontSize: 40, color: C.cream}}>{lab} <span style={{fontFamily: BODY, fontWeight: 700, fontSize: 30, color: C.muted}}>{sub}</span></div>
      <div style={{display: 'flex', alignItems: 'center', gap: 20, marginTop: 8}}>
        <div style={{height: 90, width: 640 * (v / 1.325) * interpolate(f, [t, t + 14], [0, 1], clamp), background: c, border: `5px solid ${C.ink2}`, borderRadius: '0 18px 18px 0'}} />
        <div style={{fontFamily: HEAD, fontSize: 56, color: c}}>{val}</div>
      </div>
    </div>
  );
  return (
    <AbsoluteFill>
      <div style={{position: 'absolute', top: 250, width: '100%', textAlign: 'center'}}>
        <div style={{fontFamily: HEAD, fontSize: 72, color: C.amber}}>AND JAPAN?</div>
        <div style={{fontFamily: BODY, fontWeight: 700, fontSize: 38, color: C.muted, marginTop: 4}}>the biggest foreign holder</div>
      </div>
      <div style={{position: 'absolute', top: 440, width: '100%', display: 'flex', justifyContent: 'center', gap: 16}}>
        {[0, 1, 2, 3, 4].map((i) => <div key={i} style={{width: 130, height: 130, borderRadius: 65, background: C.coral, border: `5px solid ${C.ink2}`, fontFamily: HEAD, fontSize: 80, color: C.bg, textAlign: 'center', lineHeight: '120px', opacity: fade(f, 8 + i * 10), transform: `scale(${sp(f, 8 + i * 10)})`}}>↓</div>)}
      </div>
      <div style={{position: 'absolute', top: 600, width: '100%', textAlign: 'center', fontFamily: HEAD, fontSize: 54, color: C.cream, opacity: fade(f, at('five'))}}>5 MONTHS STRAIGHT</div>
      <div style={{position: 'absolute', top: 730, left: 90, right: 60}}>
        {bar('PEAK', 'Nov 2021', 1.325, '~$1.3T', C.slate, at('peak'))}
        {bar('NOW', 'Sep 2026', 1.063, '$1.06T', C.coral, at('nov21'))}
      </div>
    </AbsoluteFill>
  );
};

// 5 quietly backing away: two lender cards slide off
const Away: React.FC<{off: number}> = ({off}) => {
  const f = useCurrentFrame();
  const at = (k: string) => Q[k] - off;
  const m = interpolate(f, [at('away'), at('away') + 30], [0, 1], clamp);
  const card = (name: string, val: string, dir: number) => (
    <div style={{width: 400, padding: '30px 10px', borderRadius: 30, background: C.panel, border: `6px solid ${C.coral}`, textAlign: 'center', transform: `translateX(${dir * m * 140}px) rotate(${dir * m * 6}deg)`, opacity: 1 - m * 0.55}}>
      <div style={{fontFamily: HEAD, fontSize: 60, color: C.cream}}>{name}</div>
      <div style={{fontFamily: HEAD, fontSize: 62, color: C.coral}}>{val} ↓</div>
    </div>
  );
  return (
    <AbsoluteFill>
      <div style={{position: 'absolute', top: 260, width: '100%', textAlign: 'center', fontFamily: HEAD, fontSize: 60, color: C.cream}}>2 OF AMERICA'S<br />BIGGEST LENDERS</div>
      <div style={{position: 'absolute', top: 520, width: '100%', display: 'flex', justifyContent: 'center', gap: 40, opacity: fade(f, 0)}}>
        {card('CHINA', '$563.9B', -1)}
        {card('JAPAN', '$1.06T', 1)}
      </div>
      <div style={{position: 'absolute', top: 900, width: '100%', textAlign: 'center', opacity: fade(f, at('away') - 2)}}><Badge bg={C.amber} size={70} rot={-2}>QUIETLY BACKING AWAY</Badge></div>
    </AbsoluteFill>
  );
};

const End: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill style={{alignItems: 'center', paddingTop: 280, textAlign: 'center', opacity: fade(f, 0, 6)}}>
      <div style={{fontFamily: HEAD, fontSize: 72, color: C.cream, lineHeight: 1.1}}>Full story on<br />the channel ↑</div>
      <div style={{fontFamily: HEAD, fontSize: 74, color: C.amber, marginTop: 70, lineHeight: 1.05}}>So how much does<br />China hold now?</div>
      <Hero pose="point_smile" x={540} y={1400} h={380} />
    </AbsoluteFill>
  );
};

export const CutShort: React.FC = () => {
  const f = useCurrentFrame();
  const a = Q.sept - 4, b = Q.fourth - 8, c = Q.japan - 4, d = Q.two - 6, e = AUD + 4;
  return (
    <AbsoluteFill>
      <Background />
      <Sequence durationInFrames={a}><Hook dur={a} /></Sequence>
      <Sequence from={a} durationInFrames={b - a}><Shrink off={a} /></Sequence>
      <Sequence from={b} durationInFrames={c - b}><Fourth off={b} /></Sequence>
      <Sequence from={c} durationInFrames={d - c}><Japan off={c} /></Sequence>
      <Sequence from={d} durationInFrames={e - d}><Away off={d} /></Sequence>
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
