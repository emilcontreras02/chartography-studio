import React from 'react';
import {AbsoluteFill, Audio, Composition, Img, Sequence, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import T from './timing.json';
import '@fontsource/archivo-black/latin-400.css';
import '@fontsource/fira-sans/latin-400.css';
import '@fontsource/fira-sans/latin-700.css';

// Cut Short (Nov 23, 2026): the #1 reveal stretch of the Nov 21 'Top 10 Biggest IPOs in History' long-form, new vertical layouts.
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
  return <AbsoluteFill style={{background: `radial-gradient(circle at 50% 30%, #173a4a, ${C.bg} 72%)`}}><svg width={1080} height={1920}>{dots}</svg></AbsoluteFill>;
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
  <div style={{position: 'absolute', top: 1440, left: 70, right: 70, textAlign: 'center', fontFamily: BODY, fontSize: 25, color: C.muted}}>Source: Renaissance Capital, largest global IPOs (deal size, no greenshoe) + Anthropic IPO pricing, Nov 18, 2026 (Yahoo Finance)</div>
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

// 1 hook card: payoff on frame 0
const Hook: React.FC<{dur: number}> = ({dur}) => {
  const f = useCurrentFrame();
  const o = interpolate(f, [dur - 8, dur], [1, 0], clamp);
  return (
    <AbsoluteFill style={{opacity: o}}>
      <div style={{position: 'absolute', top: 250, width: '100%', textAlign: 'center'}}>
        <Badge size={60}>#1 BIGGEST IPO EVER</Badge>
        <div style={{marginTop: 40}}><Badge bg={C.red} fg="#fff" size={150} rot={-3}>$81.3B</Badge></div>
        <div style={{fontFamily: HEAD, fontSize: 84, color: C.cream, marginTop: 34}}>IN ONE EVENING?</div>
        <div style={{fontFamily: BODY, fontWeight: 700, fontSize: 40, color: C.muted, marginTop: 10}}>priced Wed, Nov 18, 2026</div>
      </div>
      <Hero pose="shock_shock" x={540} y={1230} h={330} />
    </AbsoluteFill>
  );
};

// 2 new #1 vs old #1: two towers + gap bracket
const Towers: React.FC<{off: number}> = ({off}) => {
  const f = useCurrentFrame();
  const at = (k: string) => Q[k] - off;
  const H = 600 / 81.3;
  const cols: [string, string, number, string, string][] = [['SpaceX', 'June 2026', 75.0, '$75.0B', C.slate], ['Anthropic', 'Nov 2026', 81.3, '$81.3B', C.mint]];
  return (
    <AbsoluteFill>
      <div style={{position: 'absolute', top: 240, width: '100%', textAlign: 'center', fontFamily: HEAD, fontSize: 70, color: C.cream}}>NEW #1 <span style={{color: C.muted}}>vs</span> OLD #1</div>
      <div style={{position: 'absolute', top: 360, left: 0, right: 0, height: 860, display: 'flex', justifyContent: 'center', alignItems: 'flex-end', gap: 120}}>
        {cols.map(([n, d, v, l, col], i) => {
          const g = interpolate(f, [i * 8, i * 8 + 22], [0, 1], clamp);
          return (
            <div key={n} style={{width: 270, textAlign: 'center'}}>
              <div style={{fontFamily: HEAD, fontSize: 62, color: i ? C.mint : C.cream}}>{l}</div>
              <div style={{height: v * H * g, background: col, borderRadius: '20px 20px 0 0', marginTop: 8}} />
              <div style={{fontFamily: HEAD, fontSize: 44, color: C.cream, marginTop: 10}}>{n}</div>
              <div style={{fontFamily: BODY, fontWeight: 700, fontSize: 30, color: C.muted}}>{d}</div>
            </div>
          );
        })}
      </div>
      <div style={{position: 'absolute', top: 345, left: 0, right: 0, textAlign: 'center', opacity: fade(f, at('six3')), transform: `scale(${sp(f, at('six3'))})`}}>
        <Badge bg={C.amber} size={58} rot={4}>+$6.3B</Badge>
      </div>
    </AbsoluteFill>
  );
};

// 3 valuation: counter to $1.5T, then the last private value as a shorter bar
const Value: React.FC<{off: number}> = ({off}) => {
  const f = useCurrentFrame();
  const at = (k: string) => Q[k] - off;
  const v = interpolate(f, [at('t15') - 6, at('t15') + 18], [0, 1.5], clamp);
  const b2 = interpolate(f, [at('v965'), at('v965') + 18], [0, 1], clamp);
  const W = 860;
  return (
    <AbsoluteFill>
      <div style={{position: 'absolute', top: 250, width: '100%', textAlign: 'center', fontFamily: BODY, fontWeight: 700, fontSize: 44, color: C.muted}}>WHOLE COMPANY, AT $83 A SHARE</div>
      <div style={{position: 'absolute', top: 320, width: '100%', textAlign: 'center', fontFamily: HEAD, fontSize: 190, color: C.mint, lineHeight: 1, opacity: fade(f, at('t15') - 6)}}>${v.toFixed(1)}T</div>
      <div style={{position: 'absolute', top: 540, width: '100%', textAlign: 'center', fontFamily: HEAD, fontSize: 56, color: C.cream, opacity: fade(f, at('t15') + 10)}}>about 1.5 TRILLION</div>
      <div style={{position: 'absolute', top: 760, left: 110, width: W}}>
        <div style={{fontFamily: BODY, fontWeight: 700, fontSize: 36, color: C.cream}}>IPO price value</div>
        <div style={{height: 70, width: W * Math.min(v / 1.5, 1), background: C.mint, borderRadius: 16, marginTop: 8}} />
        <div style={{opacity: fade(f, at('last') - 4), marginTop: 46}}>
          <div style={{fontFamily: BODY, fontWeight: 700, fontSize: 36, color: C.cream}}>Last private valuation (May)</div>
          <div style={{display: 'flex', alignItems: 'center', gap: 20, marginTop: 8}}>
            <div style={{height: 70, width: W * (0.965 / 1.5) * b2, background: C.slate, borderRadius: 16}} />
            <div style={{fontFamily: HEAD, fontSize: 54, color: C.cream, opacity: fade(f, at('v965') + 6)}}>$965B</div>
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};

// 4 stack: #5 + #4 + #3 vs #1, then ticker card
const Stack: React.FC<{off: number}> = ({off}) => {
  const f = useCurrentFrame();
  const at = (k: string) => Q[k] - off;
  const H = 600 / 81.3;
  const blocks: [string, number, string, string][] = [['#5 Alibaba', 21.767, '$21.8B', '#8a5a9e'], ['#4 Saudi Aramco', 25.599, '$25.6B', C.slate], ['#3 SK hynix', 26.507, '$26.5B', '#4b7bb0']];
  const tk = at('shares');
  return (
    <AbsoluteFill>
      <div style={{position: 'absolute', top: 240, width: '100%', textAlign: 'center', fontFamily: HEAD, fontSize: 62, color: C.cream}}>#3 + #4 + #5 <span style={{color: C.muted}}>vs</span> #1</div>
      <div style={{position: 'absolute', top: 340, left: 0, right: 0, height: 760, display: 'flex', justifyContent: 'center', alignItems: 'flex-end', gap: 90}}>
        <div style={{width: 380, display: 'flex', flexDirection: 'column-reverse'}}>
          {blocks.map(([n, v, l, col], i) => {
            const s = sp(f, at('n3') - 20 + i * 7);
            return (
              <div key={n} style={{height: v * H, background: col, borderTop: `4px solid ${C.bg}`, borderRadius: 12, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', opacity: s, transform: `translateY(${(1 - s) * -300}px)`}}>
                <div style={{fontFamily: HEAD, fontSize: 34, color: '#fff'}}>{n}</div>
                <div style={{fontFamily: BODY, fontWeight: 700, fontSize: 32, color: C.cream}}>{l}</div>
              </div>
            );
          })}
          <div style={{fontFamily: HEAD, fontSize: 46, color: C.cream, textAlign: 'center', marginBottom: 10, opacity: fade(f, at('n3'))}}>= $73.9B</div>
        </div>
        <div style={{width: 300, textAlign: 'center'}}>
          <div style={{fontFamily: HEAD, fontSize: 56, color: C.mint}}>$81.3B</div>
          <div style={{height: 81.3 * H * interpolate(f, [0, 20], [0, 1], clamp), background: C.mint, borderRadius: 16, marginTop: 8, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
            <div style={{fontFamily: HEAD, fontSize: 48, color: C.bg}}>#1</div>
          </div>
        </div>
      </div>
      <div style={{position: 'absolute', top: 1128, left: 0, right: 0, textAlign: 'center', opacity: fade(f, tk), transform: `translateY(${(1 - sp(f, tk)) * 40}px)`}}>
        <span style={{display: 'inline-block', background: C.panel, border: `4px solid ${C.mint}`, borderRadius: 22, padding: '8px 30px', fontFamily: HEAD, fontSize: 44, color: C.cream}}>
          Nasdaq · Thu, Nov 19<span style={{color: C.mint, opacity: fade(f, at('ticker'))}}> · ANT</span>
        </span>
      </div>
    </AbsoluteFill>
  );
};

// 5 punchline: the mascot can't believe it
const Punch: React.FC<{off: number}> = ({off}) => {
  const f = useCurrentFrame();
  const at = (k: string) => Q[k] - off;
  return (
    <AbsoluteFill>
      <div style={{position: 'absolute', top: 260, width: '100%', textAlign: 'center'}}>
        <div style={{fontFamily: HEAD, fontSize: 96, color: C.cream, lineHeight: 1.05}}>#3 + #4 + #5</div>
        <div style={{marginTop: 30, opacity: fade(f, at('comb') - 2), transform: `scale(${sp(f, at('comb') - 2)})`}}><Badge bg={C.red} fg="#fff" size={110} rot={-3}>COMBINED?!</Badge></div>
        <div style={{fontFamily: HEAD, fontSize: 56, color: C.mint, marginTop: 40}}>$81.3B &gt; $73.9B</div>
      </div>
      <Hero pose="shock_shock" x={540} y={1225} h={420} from={0} />
    </AbsoluteFill>
  );
};

const End: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill style={{alignItems: 'center', paddingTop: 280, textAlign: 'center', opacity: fade(f, 0, 6)}}>
      <div style={{fontFamily: HEAD, fontSize: 72, color: C.cream, lineHeight: 1.1}}>Full Top 10<br />on the channel ↑</div>
      <div style={{fontFamily: HEAD, fontSize: 80, color: C.amber, marginTop: 70, lineHeight: 1.05}}>One IPO.<br />One number:</div>
      <Hero pose="point_smile" x={540} y={1400} h={380} />
    </AbsoluteFill>
  );
};

export const CutShort: React.FC = () => {
  const f = useCurrentFrame();
  const a = Q.six3 - 10, b = Q.price - 4, c = Q.raised - 4, d = Q.hero - 4, e = AUD + 4;
  return (
    <AbsoluteFill>
      <Background />
      <Sequence durationInFrames={a}><Hook dur={a} /></Sequence>
      <Sequence from={a} durationInFrames={b - a}><Towers off={a} /></Sequence>
      <Sequence from={b} durationInFrames={c - b}><Value off={b} /></Sequence>
      <Sequence from={c} durationInFrames={d - c}><Stack off={c} /></Sequence>
      <Sequence from={d} durationInFrames={e - d}><Punch off={d} /></Sequence>
      <Sequence from={e}><End /></Sequence>
      <Brand />
      {f < d && <Captions />}
      {f < e && <Source />}
      <Audio src={staticFile('vo.mp3')} />
    </AbsoluteFill>
  );
};

export const Root: React.FC = () => (
  <Composition id="CutShort" component={CutShort} durationInFrames={TOTAL} fps={FPS} width={1080} height={1920} />
);
