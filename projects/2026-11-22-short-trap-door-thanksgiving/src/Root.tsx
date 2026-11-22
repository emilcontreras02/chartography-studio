import React from 'react';
import {
  AbsoluteFill, Audio, Composition, Img, Sequence, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig, Easing,
} from 'remotion';
import T from './timing.json';
import '@fontsource/archivo-black/latin-400.css';
import '@fontsource/fira-sans/latin-400.css';
import '@fontsource/fira-sans/latin-700.css';

// Trap Door Thanksgiving (viral remake, Nov 22, 2026) - Chartography's own game-show floor; only the trap-door idea is borrowed.
const C = {
  bg: '#0e1b2e', panel: '#16283f', cream: '#f6f1e7', muted: '#afb8c6', slate: '#5c7392',
  mint: '#3fd6a0', amber: '#f2b544', coral: '#ff8a65', red: '#ff5d5d', pit: '#060d18',
};
const HEAD = "'Archivo Black', sans-serif";
const BODY = "'Fira Sans', sans-serif";
const FPS = 30;
const fr = (s: number) => Math.round(s * FPS);
const S = T.seg.map(fr);
const Q = Object.fromEntries(Object.entries(T.cues).map(([k, v]) => [k, fr(v as number)])) as Record<string, number>;
const TOTAL = fr(T.dur + 2.2);
const clamp = {extrapolateLeft: 'clamp' as const, extrapolateRight: 'clamp' as const};
const DX = [220, 540, 860]; // door centres
const FLOOR = 1080;          // y of the stage floor (mascot feet)

// ---------- shared ----------
const Background: React.FC = () => {
  const f = useCurrentFrame();
  // spotlight sweep of a game-show stage
  const a = Math.sin(f / 40) * 12;
  return (
    <AbsoluteFill style={{background: `radial-gradient(circle at 50% 40%, #1f3a5f, ${C.bg} 70%)`}}>
      <svg width={1080} height={1920}>
        <polygon points={`${300 + a * 6},0 ${420 + a * 6},0 ${640 + a * 10},${FLOOR} ${160 + a * 10},${FLOOR}`} fill="#ffffff" opacity={0.035} />
        <polygon points={`${660 - a * 6},0 ${780 - a * 6},0 ${920 - a * 10},${FLOOR} ${440 - a * 10},${FLOOR}`} fill={C.amber} opacity={0.03} />
        {Array.from({length: 18}, (_, i) => (
          <circle key={i} cx={30 + i * 60} cy={196} r={7} fill={(i + Math.floor(f / 6)) % 3 === 0 ? C.amber : '#3a5578'} />
        ))}
      </svg>
    </AbsoluteFill>
  );
};

const Hero: React.FC<{pose: string; x: number; y: number; h: number; from?: number; flip?: boolean; shake?: number}> = ({pose, x, y, h, from = 0, flip, shake = 0}) => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const s = spring({frame: f - from, fps, config: {damping: 11, stiffness: 160}});
  const bob = Math.sin(f / 7) * 5;
  const w = h * 0.6;
  const sx = shake ? Math.sin(f * 2.6) * shake : 0;
  return (
    <Img src={staticFile(`sprites/hero_${pose}.png`)} style={{
      position: 'absolute', left: x - w / 2 + sx, top: y - h + bob + (1 - s) * 80, width: w, height: h,
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

const SRC: [number, string][] = [
  [0, ''],
  [S[1], 'Source: American Farm Bureau Federation, Thanksgiving Dinner Cost Survey (released Nov 18, 2026)'],
  [S[4], 'Source: AAA national average, regular unleaded, as of Nov 21, 2026 vs a year earlier'],
  [S[8], 'Source: AAA Thanksgiving travel forecast (travel of 50+ miles, Nov 24-30, 2026)'],
  [S[11], ''],
];
const Source: React.FC = () => {
  const f = useCurrentFrame();
  let s = '';
  for (const [t, txt] of SRC) if (f >= t) s = txt;
  if (!s) return null;
  return (
    <div style={{position: 'absolute', top: 1430, left: f >= S[8] ? 320 : 60, right: 60, textAlign: 'center', fontFamily: BODY, fontSize: 25, color: C.muted}}>{s}</div>
  );
};

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
        <div style={{position: 'absolute', top: 1185, left: f >= S[8] ? 300 : 40, right: 40, textAlign: 'center', fontFamily: HEAD, fontSize: 66, lineHeight: 1.15, color: '#fff', WebkitTextStroke: `10px ${C.bg}`, paintOrder: 'stroke fill'}}>
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

// ---------- stage pieces ----------
// a trap door in the floor: 0 = shut, 1 = swung open (black hole)
const Floor: React.FC<{open?: number[]; glow?: (string | null)[]}> = ({open = [0, 0, 0], glow = [null, null, null]}) => (
  <svg width={1080} height={1920} style={{position: 'absolute'}}>
    <rect x={0} y={FLOOR - 6} width={1080} height={70} fill="#2a4466" />
    <rect x={0} y={FLOOR + 64} width={1080} height={16} fill="#1a2c45" />
    {DX.map((x, i) => {
      const o = open[i];
      return (
        <g key={i}>
          <ellipse cx={x} cy={FLOOR + 28} rx={140} ry={30} fill={C.pit} />
          {/* the lid hinges down */}
          <ellipse cx={x} cy={FLOOR + 28 + o * 40} rx={140} ry={30 * (1 - o * 0.85)} fill={glow[i] || '#c9a36a'} stroke={C.bg} strokeWidth={5} />
          <text x={x} y={FLOOR + 40} fontFamily={HEAD} fontSize={34} fill={C.bg} textAnchor="middle" opacity={1 - o}>{i + 1}</text>
        </g>
      );
    })}
  </svg>
);

// answer sign above each door
const Signs: React.FC<{labels: string[]; delays: number[]; mark?: (string | null)[]}> = ({labels, delays, mark = [null, null, null]}) => (
  <>
    {labels.map((l, i) => (
      <div key={i} style={{position: 'absolute', left: DX[i] - 150, top: 590, width: 300}}>
        <Pop delay={delays[i]}>
          <div style={{height: 150, borderRadius: 26, background: C.panel, border: `6px solid ${mark[i] || C.slate}`, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center'}}>
            <div style={{fontFamily: BODY, fontWeight: 700, fontSize: 28, color: C.muted}}>DOOR {i + 1}</div>
            <div style={{fontFamily: HEAD, fontSize: l.length > 9 ? 36 : 46, color: C.cream, lineHeight: 1.05, marginTop: 4}}>{l}</div>
          </div>
        </Pop>
      </div>
    ))}
  </>
);

const RoundTitle: React.FC<{n: string; q: React.ReactNode; o?: number}> = ({n, q, o = 1}) => (
  <div style={{position: 'absolute', top: 250, width: '100%', textAlign: 'center', opacity: o}}>
    <Pop><div style={{display: 'inline-block', background: C.amber, color: C.bg, fontFamily: HEAD, fontSize: 40, padding: '8px 28px', borderRadius: 16}}>{n}</div></Pop>
    <Pop delay={6}><div style={{fontFamily: HEAD, fontSize: 62, color: C.cream, marginTop: 18, lineHeight: 1.08, padding: '0 50px'}}>{q}</div></Pop>
  </div>
);

// ---------- scenes ----------
const Hook: React.FC<{dur: number}> = ({dur}) => {
  const f = useCurrentFrame();
  const fall = Q.fall;
  const shake = f > fall && f < fall + 16 ? 10 : 0;
  return (
    <Fade dur={dur}>
      <div style={{position: 'absolute', top: 250, width: '100%', textAlign: 'center'}}>
        <Pop><div style={{fontFamily: HEAD, fontSize: 118, color: C.cream, lineHeight: 0.98}}>3 TRAP<br /><span style={{color: C.amber}}>DOORS</span></div></Pop>
        <Pop delay={8}><div style={{fontFamily: HEAD, fontSize: 58, color: C.mint, marginTop: 14}}>3 THANKSGIVING $ QUESTIONS</div></Pop>
        <Pop delay={fall}><div style={{display: 'inline-block', marginTop: 22, padding: '8px 30px', border: `8px solid ${C.red}`, borderRadius: 20, color: C.red, fontFamily: HEAD, fontSize: 60, transform: 'rotate(-4deg)'}}>WRONG = YOU FALL</div></Pop>
      </div>
      <Floor />
      <Hero pose={f < fall ? 'stand_talk' : 'shock_shock'} x={DX[1]} y={FLOOR + 20} h={330} shake={shake} />
    </Fade>
  );
};

const Round1: React.FC<{dur: number; off: number}> = ({dur, off}) => {
  const f = useCurrentFrame();
  const at = (k: string) => Q[k] - off;
  const walk = interpolate(f, [at('pick3'), at('pick3') + 14], [0, 1], {...clamp, easing: Easing.inOut(Easing.cubic)});
  const x = DX[1] + (DX[2] - DX[1]) * walk;
  const safe = f >= at('safe');
  const card = spring({frame: f - at('down37'), fps: FPS, config: {damping: 12, stiffness: 150}});
  const tcard = spring({frame: f - at('up10'), fps: FPS, config: {damping: 12, stiffness: 150}});
  const pose = safe ? 'cheer_happy' : f >= at('pick3') ? 'point_talk' : 'think_talk';
  return (
    <Fade dur={dur}>
      <RoundTitle o={1 - card} n="ROUND 1" q={<>Which food got <span style={{color: C.mint}}>CHEAPER</span> this year?</>} />
      <Signs labels={['TURKEY', 'CRANBERRIES', 'VEGGIE TRAY']} delays={[at('o1'), at('o2'), at('o3')]} mark={[null, null, safe ? C.mint : f >= at('pick3') ? C.amber : null]} />
      <Floor glow={[null, null, safe ? C.mint : null]} />
      <Hero pose={pose} x={x} y={FLOOR + 20} h={300} flip={walk < 1 && f >= at('pick3')} />
      {/* fact cards slide in over the question once the answer is given */}
      <div style={{position: 'absolute', top: 250, left: 0, right: 0, display: 'flex', justifyContent: 'center', gap: 36, opacity: card}}>
        <div style={{transform: `scale(${card})`, width: 450, height: 300, borderRadius: 30, background: C.panel, border: `7px solid ${C.mint}`, textAlign: 'center', paddingTop: 34}}>
          <div style={{fontFamily: HEAD, fontSize: 40, color: C.cream}}>VEGGIE TRAY</div>
          <div style={{fontFamily: HEAD, fontSize: 104, color: C.mint, marginTop: 8}}>-3.7%</div>
          <div style={{fontFamily: BODY, fontSize: 28, color: C.muted}}>1 lb · $1.31</div>
        </div>
        <div style={{opacity: tcard, transform: `scale(${tcard})`, width: 450, height: 300, borderRadius: 30, background: C.panel, border: `7px solid ${C.red}`, textAlign: 'center', paddingTop: 34}}>
          <div style={{fontFamily: HEAD, fontSize: 40, color: C.cream}}>TURKEY</div>
          <div style={{fontFamily: HEAD, fontSize: 104, color: C.red, marginTop: 8}}>+10%</div>
          <div style={{fontFamily: BODY, fontSize: 28, color: C.muted}}>16 lb · $23.68</div>
        </div>
      </div>
      {safe && <div style={{position: 'absolute', left: DX[2] - 120, top: 790, width: 240, textAlign: 'center', fontFamily: HEAD, fontSize: 64, color: C.mint, transform: `scale(${spring({frame: f - at('safe'), fps: FPS})})`}}>SAFE!</div>}
    </Fade>
  );
};

const Round2: React.FC<{dur: number; off: number}> = ({dur, off}) => {
  const f = useCurrentFrame();
  const at = (k: string) => Q[k] - off;
  const walk = interpolate(f, [at('pick1') - 4, at('pick1') + 10], [0, 1], {...clamp, easing: Easing.inOut(Easing.cubic)});
  const x = DX[1] + (DX[0] - DX[1]) * walk;
  const open = interpolate(f, [at('wrong'), at('wrong') + 8], [0, 1], clamp);
  const drop = interpolate(f, [at('wrong') + 6, at('wrong') + 22], [0, 1], {...clamp, easing: Easing.in(Easing.quad)});
  const card = spring({frame: f - at('more67'), fps: FPS, config: {damping: 12, stiffness: 150}});
  const p1 = interpolate(f, [at('p375'), at('p375') + 8], [0, 1], clamp);
  const p2 = interpolate(f, [at('p308'), at('p308') + 8], [0, 1], clamp);
  const pose = f >= at('wrong') ? 'shock_shock' : f >= at('pick1') - 4 ? 'point_talk' : 'think_talk';
  return (
    <Fade dur={dur}>
      <RoundTitle o={1 - card} n="ROUND 2" q={<>Gas: how much more per gallon than <span style={{color: C.amber}}>a year ago?</span></>} />
      <Signs labels={['A DIME', 'ABOUT 57¢', '$2']} delays={[at('d1'), at('d2'), at('d3')]} mark={[f >= at('wrong') ? C.red : f >= at('pick1') ? C.amber : null, f >= at('more67') ? C.mint : null, null]} />
      {/* the mascot drops through door 1; drawn under the floor so he vanishes into the hole */}
      <AbsoluteFill style={{clipPath: drop > 0 ? `inset(0 0 ${1920 - FLOOR - 28}px 0)` : 'none'}}>
        <Hero pose={pose} x={x} y={FLOOR + 20 + drop * 520} h={300} flip={walk < 1 && f >= at('pick1') - 4} shake={f >= at('wrong') && drop === 0 ? 8 : 0} />
      </AbsoluteFill>
      <Floor open={[open, 0, 0]} glow={[f >= at('wrong') ? C.red : null, null, null]} />
      {f >= at('wrong') && drop < 1 && <div style={{position: 'absolute', left: DX[0] - 130, top: 800, width: 260, textAlign: 'center', fontFamily: HEAD, fontSize: 60, color: C.red}}>WRONG!</div>}
      <div style={{position: 'absolute', top: 250, left: 0, right: 0, display: 'flex', justifyContent: 'center', opacity: card}}>
        <div style={{transform: `scale(${card})`, width: 920, height: 300, borderRadius: 30, background: C.panel, border: `7px solid ${C.amber}`, textAlign: 'center', paddingTop: 22}}>
          <div style={{fontFamily: HEAD, fontSize: 120, color: C.amber, lineHeight: 1}}>+57¢<span style={{fontSize: 56, color: C.cream}}> / gal</span></div>
          <div style={{display: 'flex', justifyContent: 'center', gap: 60, marginTop: 22, fontFamily: HEAD, fontSize: 52}}>
            <span style={{opacity: p1, color: C.red}}>$3.66 <span style={{fontFamily: BODY, fontSize: 30, color: C.muted}}>now</span></span>
            <span style={{opacity: p2, color: C.mint}}>$3.09 <span style={{fontFamily: BODY, fontSize: 30, color: C.muted}}>a year ago</span></span>
          </div>
        </div>
      </div>
    </Fade>
  );
};

const Round3: React.FC<{dur: number; off: number}> = ({dur, off}) => {
  const f = useCurrentFrame();
  const at = (k: string) => Q[k] - off;
  const ok = f >= at('correct');
  const climb = interpolate(f, [at('correct'), at('correct') + 24], [0, 1], {...clamp, easing: Easing.out(Easing.back(1.6))});
  const n = interpolate(f, [at('ans'), at('ans') + 20], [0, 81.5], clamp);
  const card = spring({frame: f - at('ans'), fps: FPS, config: {damping: 12, stiffness: 150}});
  const sub = interpolate(f, [at('fewer'), at('fewer') + 10], [0, 1], clamp);
  const rec = interpolate(f, [at('records'), at('records') + 10], [0, 1], clamp);
  const pose = ok ? 'cheer_happy' : f >= at('ans') - 8 ? 'point_talk' : 'think_worry';
  return (
    <Fade dur={dur}>
      <RoundTitle n="FINAL ROUND · FROM THE PIT" q={<>How many Americans travel for <span style={{color: C.amber}}>Thanksgiving?</span></>} />
      <div style={{position: 'absolute', top: 545, left: 0, right: 0, display: 'flex', justifyContent: 'center', opacity: card}}>
        <div style={{transform: `scale(${card})`, width: 690, borderRadius: 30, background: C.panel, border: `7px solid ${ok ? C.mint : C.slate}`, textAlign: 'center', padding: '20px 0 24px'}}>
          <div style={{fontFamily: HEAD, fontSize: 150, color: ok ? C.mint : C.cream, lineHeight: 1}}>{n.toFixed(1)}M</div>
          <div style={{fontFamily: BODY, fontWeight: 700, fontSize: 32, color: C.muted, marginTop: 6}}>travelers, Nov 24-30 (AAA forecast)</div>
          <div style={{fontFamily: BODY, fontWeight: 700, fontSize: 34, color: C.coral, marginTop: 10, opacity: sub}}>-0.1% vs 2025 · <span style={{color: C.amber, opacity: rec}}>ends 3 straight records</span></div>
        </div>
      </div>
      {/* the pit: mascot sits on a cushion of feathers, climbs back up on "correct" */}
      <svg width={1080} height={1920} style={{position: 'absolute'}}>
        <rect x={0} y={FLOOR - 6} width={1080} height={70} fill="#2a4466" opacity={1 - climb} />
        <path d={`M 40 ${FLOOR + 64} L 40 1480 Q 40 1500 60 1500 L 1020 1500 Q 1040 1500 1040 1480 L 1040 ${FLOOR + 64} Z`} fill={C.pit} opacity={0.55} />
        {Array.from({length: 9}, (_, i) => (
          <ellipse key={i} cx={70 + i * 26} cy={1500 - (i % 2) * 10} rx={40} ry={16} fill={i % 2 ? C.amber : C.coral} opacity={0.85} transform={`rotate(${(i % 3 - 1) * 14} ${70 + i * 26} 1500)`} />
        ))}
      </svg>
      <Hero pose={pose} x={110} y={1500 - climb * 400} h={250} />
    </Fade>
  );
};

const CTA: React.FC<{dur: number; off: number}> = ({dur, off}) => {
  const f = useCurrentFrame();
  const pulse = 1 + Math.sin(f / 5) * 0.03;
  const end = fr(T.dur) - off; // end card after the last word
  const e = spring({frame: f - end, fps: FPS, config: {damping: 12, stiffness: 140}});
  return (
    <Fade dur={dur + 2}>
      <AbsoluteFill style={{alignItems: 'center', paddingTop: 250, textAlign: 'center', opacity: 1 - e}}>
        <Pop><div style={{fontFamily: HEAD, fontSize: 96, color: C.cream, lineHeight: 1.03}}>HOW MANY DOORS<br />WOULD YOU <span style={{color: C.amber}}>SURVIVE?</span></div></Pop>
        <div style={{display: 'flex', gap: 26, marginTop: 44}}>
          {['0/3', '1/3', '2/3', '3/3'].map((s, i) => (
            <Pop key={s} delay={8 + i * 4}><div style={{width: 170, height: 130, borderRadius: 24, background: C.panel, border: `6px solid ${i === 3 ? C.mint : C.slate}`, fontFamily: HEAD, fontSize: 54, color: C.cream, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>{s}</div></Pop>
          ))}
        </div>
        <Pop delay={Q.score - off}><div style={{transform: `scale(${pulse})`, marginTop: 44, background: C.amber, color: C.bg, fontFamily: HEAD, fontSize: 54, padding: '20px 44px', borderRadius: 26}}>Comment your score ↓</div></Pop>
      </AbsoluteFill>
      {e < 0.05 && <Hero pose="wave_talk" x={180} y={1500} h={300} />}
      {/* end card + loop line back to the opening */}
      <AbsoluteFill style={{alignItems: 'center', paddingTop: 300, textAlign: 'center', opacity: e}}>
        <div style={{fontFamily: HEAD, fontSize: 70, color: C.cream, lineHeight: 1.1}}>Full Top 10s<br />on the channel ↑</div>
        <div style={{fontFamily: HEAD, fontSize: 84, color: C.amber, marginTop: 60, lineHeight: 1.05}}>3 doors. 3 questions.<br /><span style={{color: C.red}}>Go again?</span></div>
      </AbsoluteFill>
      {e > 0.05 && <Hero pose="point_smile" x={540} y={1480} h={340} from={end} />}
    </Fade>
  );
};

export const TrapDoor: React.FC = () => {
  const ends = [...S.slice(1), TOTAL];
  return (
    <AbsoluteFill>
      <Background />
      <Sequence durationInFrames={S[1]}><Hook dur={S[1]} /></Sequence>
      <Sequence from={S[1]} durationInFrames={S[4] - S[1]}><Round1 dur={S[4] - S[1]} off={S[1]} /></Sequence>
      <Sequence from={S[4]} durationInFrames={S[8] - S[4]}><Round2 dur={S[8] - S[4]} off={S[4]} /></Sequence>
      <Sequence from={S[8]} durationInFrames={S[11] - S[8]}><Round3 dur={S[11] - S[8]} off={S[8]} /></Sequence>
      <Sequence from={S[11]} durationInFrames={TOTAL - S[11]}><CTA dur={TOTAL - S[11]} off={S[11]} /></Sequence>
      <Brand />
      <Captions />
      <Source />
      <Audio src={staticFile('vo.mp3')} />
    </AbsoluteFill>
  );
};

export const Root: React.FC = () => (
  <Composition id="TrapDoor" component={TrapDoor} durationInFrames={TOTAL} fps={FPS} width={1080} height={1920} />
);
