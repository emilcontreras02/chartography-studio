import React from 'react';
import {
  AbsoluteFill, Audio, Composition, Img, Sequence, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig, Easing,
} from 'remotion';
import T from './timing.json';
import '@fontsource/archivo-black/latin-400.css';
import '@fontsource/fira-sans/latin-400.css';
import '@fontsource/fira-sans/latin-700.css';

// Cheap Dad Buys GTA 6 (viral remake, Nov 26, 2026) - Chartography's own family skit; only the "cheap dad" skit idea is borrowed.
// No game art, no logos: the box is a plain box with the text "GTA VI".
const C = {
  bg: '#0e1b2e', panel: '#16283f', cream: '#f6f1e7', muted: '#afb8c6', slate: '#5c7392',
  mint: '#3fd6a0', amber: '#f2b544', coral: '#ff8a65', red: '#ff5d5d', wall: '#1b3150', sofa: '#7a4b3a',
};
const HEAD = "'Archivo Black', sans-serif";
const BODY = "'Fira Sans', sans-serif";
const FPS = 30;
const fr = (s: number) => Math.round(s * FPS);
const S = T.seg.map(fr);
const Q = Object.fromEntries(Object.entries(T.cues).map(([k, v]) => [k, fr(v as number)])) as Record<string, number>;
const TOTAL = fr(T.dur + 2.2);
const clamp = {extrapolateLeft: 'clamp' as const, extrapolateRight: 'clamp' as const};
const sp = (f: number, from: number, damping = 12) => spring({frame: f - from, fps: FPS, config: {damping, stiffness: 150}});

// ---------- shared ----------
const Background: React.FC = () => {
  const f = useCurrentFrame();
  const glow = 0.5 + Math.sin(f / 9) * 0.15; // TV flicker
  return (
    <AbsoluteFill style={{background: `radial-gradient(circle at 50% 45%, #22406a, ${C.bg} 72%)`}}>
      <svg width={1080} height={1920}>
        <rect x={0} y={1150} width={1080} height={420} fill="#13243b" />
        <rect x={0} y={1150} width={1080} height={10} fill="#2a4466" />
        <circle cx={540} cy={700} r={520} fill={C.mint} opacity={0.03 * glow} />
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
  const s = sp(f, delay);
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
  [0, 'Source: Take-Two estimate via The Motley Fool (Nov 20, 2026); price: Microsoft Store, Nov 23, 2026'],
  [S[5], 'Sources: The Motley Fool (Nov 20, 2026); Take-Two (GTA V day one, 2013) via virtwave.com'],
  [S[6], 'Source: The Motley Fool, Nov 20, 2026 (retail sales, not Take-Two revenue)'],
  [S[8], ''],
];
const Source: React.FC = () => {
  const f = useCurrentFrame();
  let s = '';
  for (const [t, txt] of SRC) if (f >= t) s = txt;
  if (!s) return null;
  return <div style={{position: 'absolute', top: 1440, left: 60, right: 60, textAlign: 'center', fontFamily: BODY, fontSize: 25, color: C.muted}}>{s}</div>;
};

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
        <div style={{position: 'absolute', top: 1255, left: 40, right: 40, textAlign: 'center', fontFamily: HEAD, fontSize: 64, lineHeight: 1.15, color: '#fff', WebkitTextStroke: `10px ${C.bg}`, paintOrder: 'stroke fill'}}>
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

// ---------- original family characters (no voices) ----------
type PP = {x: number; y: number; s?: number; hair: 'swoop' | 'bob' | 'spiky' | 'bald'; hairColor?: string; shirt: string; mood?: 'smile' | 'flat' | 'shock' | 'grin'; arm?: number; tag?: string; mustache?: boolean};
const Person: React.FC<PP> = ({x, y, s = 1, hair, hairColor = '#3b2418', shirt, mood = 'smile', arm = 0, tag, mustache}) => {
  const f = useCurrentFrame();
  const bob = Math.sin(f / 8 + x) * 3;
  return (
    <g transform={`translate(${x},${y + bob}) scale(${s})`}>
      <ellipse cx={0} cy={250} rx={95} ry={16} fill="#000" opacity={0.25} />
      <rect x={-42} y={150} width={34} height={100} rx={14} fill="#26344a" />
      <rect x={8} y={150} width={34} height={100} rx={14} fill="#26344a" />
      <path d="M -78 160 Q -80 40 0 30 Q 80 40 78 160 Z" fill={shirt} stroke="#0a0f18" strokeWidth={6} />
      <g transform={`rotate(${-arm} -72 60)`}><rect x={-100} y={52} width={30} height={92} rx={14} fill={shirt} stroke="#0a0f18" strokeWidth={5} /></g>
      <g transform={`rotate(${arm} 72 60)`}><rect x={70} y={52} width={30} height={92} rx={14} fill={shirt} stroke="#0a0f18" strokeWidth={5} /></g>
      <circle cx={0} cy={-30} r={62} fill="#e9c29f" stroke="#0a0f18" strokeWidth={6} />
      {hair === 'swoop' && <path d="M -62 -38 Q -58 -104 4 -98 Q 66 -96 64 -30 Q 40 -70 -8 -62 Q -40 -58 -62 -38 Z" fill={hairColor} stroke="#0a0f18" strokeWidth={4} />}
      {hair === 'bob' && <path d="M -66 10 Q -80 -100 0 -98 Q 80 -100 66 10 L 50 10 Q 56 -56 0 -60 Q -56 -56 -50 10 Z" fill={hairColor} stroke="#0a0f18" strokeWidth={4} />}
      {hair === 'spiky' && <path d="M -60 -50 L -50 -100 L -25 -72 L -5 -110 L 15 -74 L 40 -104 L 48 -64 L 62 -40 Q 0 -78 -60 -50 Z" fill={hairColor} stroke="#0a0f18" strokeWidth={4} />}
      {hair === 'bald' && <path d="M -62 -20 Q -66 -50 -50 -56 L -48 -28 Z M 62 -20 Q 66 -50 50 -56 L 48 -28 Z" fill={hairColor} />}
      <ellipse cx={-21} cy={-30} rx={7} ry={mood === 'shock' ? 11 : 9} fill="#0a0f18" />
      <ellipse cx={21} cy={-30} rx={7} ry={mood === 'shock' ? 11 : 9} fill="#0a0f18" />
      {mustache && <path d="M -26 -4 Q -12 -14 0 -6 Q 12 -14 26 -4 Q 12 4 0 -2 Q -12 4 -26 -4 Z" fill="#3b2418" />}
      {mood === 'smile' && <path d="M -20 6 Q 0 22 20 6" stroke="#0a0f18" strokeWidth={6} fill="none" strokeLinecap="round" />}
      {mood === 'grin' && <path d="M -26 4 Q 0 34 26 4 Z" fill="#fff" stroke="#0a0f18" strokeWidth={5} />}
      {mood === 'flat' && <path d="M -16 8 L 16 8" stroke="#0a0f18" strokeWidth={6} strokeLinecap="round" />}
      {mood === 'shock' && <ellipse cx={0} cy={10} rx={11} ry={14} fill="#0a0f18" />}
      {tag && <text x={0} y={-118} textAnchor="middle" fontFamily={HEAD} fontSize={34} fill={C.amber}>{tag}</text>}
    </g>
  );
};
const Dad: React.FC<Omit<PP, 'hair' | 'shirt'>> = (p) => <Person hair="bald" hairColor="#3b2418" shirt="#c0653a" mustache {...p} />;
const Mom: React.FC<Omit<PP, 'hair' | 'shirt'>> = (p) => <Person hair="bob" hairColor="#5a2d1c" shirt="#3f7fbf" {...p} />;
const Kid: React.FC<Omit<PP, 'hair' | 'shirt'>> = (p) => <Person hair="spiky" hairColor="#2b1a12" shirt="#3fd6a0" s={0.7} {...p} />;

// plain game box with text only (no cover art, no logos)
const GameBox: React.FC<{x: number; y: number; s?: number; rot?: number; price?: number}> = ({x, y, s = 1, rot = 0, price = 0}) => (
  <g transform={`translate(${x},${y}) rotate(${rot}) scale(${s})`}>
    <rect x={-70} y={-95} width={140} height={190} rx={10} fill="#22252e" stroke="#0a0f18" strokeWidth={6} />
    <rect x={-58} y={-82} width={116} height={164} rx={6} fill="#343a48" />
    <text x={0} y={-10} textAnchor="middle" fontFamily={HEAD} fontSize={40} fill={C.cream}>GTA</text>
    <text x={0} y={40} textAnchor="middle" fontFamily={HEAD} fontSize={46} fill={C.amber}>VI</text>
    {price > 0 && (
      <g transform={`translate(66,-96) rotate(14) scale(${price})`}>
        <path d="M -10 -26 L 100 -26 L 120 0 L 100 26 L -10 26 Z" fill={C.amber} stroke="#0a0f18" strokeWidth={4} />
        <circle cx={0} cy={0} r={6} fill="#0a0f18" />
        <text x={56} y={11} textAnchor="middle" fontFamily={HEAD} fontSize={30} fill={C.bg}>$79.99</text>
      </g>
    )}
  </g>
);

const Sofa: React.FC = () => (
  <svg width={1080} height={1920} style={{position: 'absolute'}}>
    <rect x={120} y={980} width={840} height={170} rx={40} fill={C.sofa} stroke="#0a0f18" strokeWidth={6} />
    <rect x={90} y={900} width={110} height={250} rx={40} fill="#8d5a46" stroke="#0a0f18" strokeWidth={6} />
    <rect x={880} y={900} width={110} height={250} rx={40} fill="#8d5a46" stroke="#0a0f18" strokeWidth={6} />
  </svg>
);

// ---------- scenes ----------
const Hook: React.FC<{dur: number}> = ({dur}) => {
  const f = useCurrentFrame();
  const shock = f >= Q.share - 6;
  return (
    <Fade dur={dur}>
      <div style={{position: 'absolute', top: 250, width: '100%', textAlign: 'center'}}>
        <Pop><div style={{display: 'inline-block', background: C.red, color: '#fff', fontFamily: HEAD, fontSize: 112, padding: '4px 34px', borderRadius: 20, transform: 'rotate(-3deg)'}}>$3.79B</div></Pop>
        <Pop delay={4}><div style={{fontFamily: HEAD, fontSize: 64, color: C.cream, marginTop: 14}}>GTA 6 · ONE DAY</div></Pop>
        <Pop delay={Q.share - 4}><div style={{fontFamily: HEAD, fontSize: 52, color: C.amber, marginTop: 10}}>...and Dad bought ONE copy</div></Pop>
      </div>
      <svg width={1080} height={1920} style={{position: 'absolute'}}>
        <Dad x={250} y={830} mood="grin" arm={70} />
        <GameBox x={145} y={700} s={0.8} rot={-12} />
        <Mom x={690} y={860} s={0.9} mood={shock ? 'shock' : 'flat'} />
        <Kid x={470} y={930} mood={shock ? 'shock' : 'smile'} />
      </svg>
      <Hero pose={shock ? 'shock_shock' : 'stand_talk'} x={890} y={1230} h={300} shake={shock ? 6 : 0} />
    </Fade>
  );
};

const Couch: React.FC<{dur: number; off: number}> = ({dur, off}) => {
  const f = useCurrentFrame();
  const at = (k: string) => Q[k] - off;
  const tug = Math.sin(f / 4) * 40; // the single controller goes back and forth
  const tag = sp(f, at('p7999'));
  const more = sp(f, at('paying'));
  return (
    <Fade dur={dur}>
      <div style={{position: 'absolute', top: 250, width: '100%', textAlign: 'center'}}>
        <Pop><div style={{fontFamily: HEAD, fontSize: 84, color: C.cream}}>1 COPY · 3 PLAYERS</div></Pop>
        <div style={{opacity: more, transform: `scale(${more})`, fontFamily: HEAD, fontSize: 52, color: C.mint, marginTop: 10}}>Dad is not the only one paying</div>
      </div>
      <Sofa />
      <svg width={1080} height={1920} style={{position: 'absolute'}}>
        <Dad x={300} y={740} mood="grin" arm={40} />
        <Kid x={540} y={830} mood="flat" arm={60} />
        <Mom x={780} y={760} s={0.9} mood="flat" arm={40} />
        {/* one controller */}
        <g transform={`translate(${540 + tug},700)`}>
          <rect x={-70} y={-30} width={140} height={60} rx={30} fill="#2b2f3a" stroke="#0a0f18" strokeWidth={5} />
          <circle cx={-35} cy={0} r={10} fill={C.mint} /><circle cx={35} cy={0} r={10} fill={C.coral} />
        </g>
        <GameBox x={850} y={600} s={1.0 * tag} price={tag} />
      </svg>
    </Fade>
  );
};

const Billions: React.FC<{dur: number; off: number}> = ({dur, off}) => {
  const f = useCurrentFrame();
  const at = (k: string) => Q[k] - off;
  const n = interpolate(f, [at('b379'), at('b379') + 30], [0, 3.79], {...clamp, easing: Easing.out(Easing.cubic)});
  const lab = sp(f, at('takes'));
  const stacks = Math.floor(interpolate(f, [at('b379'), at('b379') + 40], [0, 9], clamp));
  return (
    <Fade dur={dur}>
      <div style={{position: 'absolute', top: 250, width: '100%', textAlign: 'center'}}>
        <Pop><div style={{fontFamily: BODY, fontWeight: 700, fontSize: 40, color: C.muted}}>DAY ONE · NOV 19, 2026</div></Pop>
        <div style={{fontFamily: HEAD, fontSize: 200, color: C.mint, lineHeight: 1.05}}>${n.toFixed(2)}B</div>
        <div style={{opacity: lab, fontFamily: BODY, fontWeight: 700, fontSize: 36, color: C.cream}}>retail sales, day one (company estimate)</div>
      </div>
      <svg width={1080} height={1920} style={{position: 'absolute'}}>
        {Array.from({length: stacks}, (_, i) => (
          <g key={i} transform={`translate(${130 + (i % 3) * 120},${1100 - Math.floor(i / 3) * 70})`}>
            <rect x={-50} y={-30} width={100} height={60} rx={8} fill="#4fae7c" stroke="#0a0f18" strokeWidth={4} />
            <circle cx={0} cy={0} r={16} fill="none" stroke="#0a0f18" strokeWidth={4} />
          </g>
        ))}
      </svg>
      <Hero pose={f >= at('withb') ? 'shock_shock' : 'think_talk'} x={800} y={1200} h={330} shake={f >= at('withb') && f < at('withb') + 20 ? 8 : 0} />
      {f >= at('withb') && <div style={{position: 'absolute', left: 620, top: 780, width: 360, textAlign: 'center', fontFamily: HEAD, fontSize: 56, color: C.amber, transform: `rotate(-6deg) scale(${sp(f, at('withb'))})`}}>WITH A B!</div>}
    </Fade>
  );
};

const Preorders: React.FC<{dur: number; off: number}> = ({dur, off}) => {
  const f = useCurrentFrame();
  const at = (k: string) => Q[k] - off;
  const shown = Math.floor(interpolate(f, [at('m325'), at('m325') + 40], [0, 65], clamp));
  const tag = sp(f, at('cameout'));
  return (
    <Fade dur={dur}>
      <div style={{position: 'absolute', top: 250, width: '100%', textAlign: 'center'}}>
        <Pop><div style={{fontFamily: HEAD, fontSize: 150, color: C.amber, lineHeight: 1}}>32.5M</div></Pop>
        <Pop delay={6}><div style={{fontFamily: HEAD, fontSize: 52, color: C.cream, marginTop: 8}}>copies sold</div></Pop>
        <div style={{opacity: tag, transform: `scale(${tag})`, display: 'inline-block', marginTop: 16, border: `6px solid ${C.red}`, color: C.red, borderRadius: 16, padding: '4px 24px', fontFamily: HEAD, fontSize: 46}}>BEFORE RELEASE</div>
      </div>
      <svg width={1080} height={1920} style={{position: 'absolute'}}>
        {Array.from({length: shown}, (_, i) => (
          <rect key={i} x={95 + (i % 13) * 70} y={720 + Math.floor(i / 13) * 92} width={50} height={70} rx={6} fill={i % 13 === 6 ? C.amber : '#343a48'} stroke="#0a0f18" strokeWidth={3} />
        ))}
        <text x={540} y={1215} textAnchor="middle" fontFamily={BODY} fontWeight={700} fontSize={32} fill={C.muted}>each box = 500,000 copies</text>
      </svg>
    </Fade>
  );
};

const Compare: React.FC<{dur: number; off: number}> = ({dur, off}) => {
  const f = useCurrentFrame();
  const at = (k: string) => Q[k] - off;
  const big = interpolate(f, [at('x47') - 4, at('x47') + 20], [0, 1], {...clamp, easing: Easing.out(Easing.cubic)});
  const small = interpolate(f, [at('m800'), at('m800') + 14], [0, 1], {...clamp, easing: Easing.out(Easing.cubic)});
  const BH = 560; // bar height for $3.79B
  return (
    <Fade dur={dur}>
      <div style={{position: 'absolute', top: 250, width: '100%', textAlign: 'center'}}>
        <Pop><div style={{fontFamily: HEAD, fontSize: 64, color: C.cream}}>FIRST DAY vs FIRST DAY</div></Pop>
        <div style={{opacity: big, fontFamily: HEAD, fontSize: 120, color: C.mint, lineHeight: 1.05}}>about 4.7x</div>
      </div>
      <svg width={1080} height={1920} style={{position: 'absolute'}}>
        <line x1={120} x2={960} y1={1160} y2={1160} stroke={C.slate} strokeWidth={4} />
        <rect x={250} y={1160 - BH * 0.211 * small} width={220} height={BH * 0.211 * small} rx={10} fill={C.slate} />
        <text x={360} y={1145 - BH * 0.211 * small} textAnchor="middle" fontFamily={HEAD} fontSize={46} fill={C.cream} opacity={small}>$800M+</text>
        <text x={360} y={1205} textAnchor="middle" fontFamily={HEAD} fontSize={36} fill={C.muted} opacity={f >= at('y2013') ? 1 : 0}>GTA V · 2013</text>
        <rect x={610} y={1160 - BH * big} width={220} height={BH * big} rx={10} fill={C.mint} />
        <text x={720} y={1145 - BH * big} textAnchor="middle" fontFamily={HEAD} fontSize={46} fill={C.cream} opacity={big}>$3.79B</text>
        <text x={720} y={1205} textAnchor="middle" fontFamily={HEAD} fontSize={36} fill={C.muted} opacity={big}>GTA VI · 2026</text>
      </svg>
    </Fade>
  );
};

const Catch: React.FC<{dur: number; off: number}> = ({dur, off}) => {
  const f = useCurrentFrame();
  const at = (k: string) => Q[k] - off;
  const cut = interpolate(f, [at('cut'), at('cut') + 18], [0, 1], {...clamp, easing: Easing.out(Easing.cubic)});
  const less = sp(f, at('less'));
  const bill = sp(f, at('split'));
  const snip = interpolate(f, [at('split') + 10, at('split') + 26], [0, 1], clamp);
  return (
    <Fade dur={dur}>
      <div style={{position: 'absolute', top: 250, width: '100%', textAlign: 'center'}}>
        <Pop><div style={{display: 'inline-block', background: C.amber, color: C.bg, fontFamily: HEAD, fontSize: 60, padding: '6px 30px', borderRadius: 16}}>THE CATCH</div></Pop>
        <Pop delay={at('spent')}><div style={{fontFamily: HEAD, fontSize: 54, color: C.cream, marginTop: 16, lineHeight: 1.1}}>$3.79B = what shoppers spent</div></Pop>
      </div>
      <svg width={1080} height={1920} style={{position: 'absolute'}} opacity={1 - bill}>
        {/* the pie of shopper money; slices pull away for stores and console makers (no share claimed) */}
        <circle cx={540} cy={830} r={230} fill={C.mint} stroke="#0a0f18" strokeWidth={6} />
        <g transform={`translate(${cut * 90},${-cut * 40})`}>
          <path d="M 540 830 L 770 830 A 230 230 0 0 0 655 631 Z" fill={C.slate} stroke="#0a0f18" strokeWidth={6} />
          <text x={700} y={600 - 10} textAnchor="middle" fontFamily={HEAD} fontSize={34} fill={C.cream} opacity={cut}>STORES</text>
        </g>
        <g transform={`translate(${-cut * 90},${-cut * 50})`}>
          <path d="M 540 830 L 425 631 A 230 230 0 0 0 310 830 Z" fill={C.coral} stroke="#0a0f18" strokeWidth={6} />
          <text x={340} y={600 - 10} textAnchor="middle" fontFamily={HEAD} fontSize={34} fill={C.cream} opacity={cut}>CONSOLE MAKERS</text>
        </g>
        <text x={640} y={1120} textAnchor="middle" fontFamily={HEAD} fontSize={46} fill={C.amber} opacity={less}>TAKE-TWO KEEPS LESS</text>
      </svg>
      {/* Dad's $80 gets cut too */}
      <div style={{position: 'absolute', top: 640, left: 0, right: 0, display: 'flex', justifyContent: 'center', gap: 20 * snip, opacity: bill}}>
        <div style={{transform: `rotate(${-6 * snip}deg) scale(${bill})`, width: 260, height: 220, background: '#5fae7f', border: '6px solid #0a0f18', borderRadius: '16px 0 0 16px', display: 'flex', alignItems: 'center', justifyContent: 'flex-end', fontFamily: HEAD, fontSize: 110, color: C.bg}}>$8</div>
        <div style={{transform: `rotate(${6 * snip}deg) scale(${bill})`, width: 260, height: 220, background: '#5fae7f', border: '6px solid #0a0f18', borderRadius: '0 16px 16px 0', display: 'flex', alignItems: 'center', justifyContent: 'flex-start', fontFamily: HEAD, fontSize: 110, color: C.bg}}>0</div>
      </div>
      {bill > 0.05 && <div style={{position: 'absolute', top: 900, width: '100%', textAlign: 'center', fontFamily: HEAD, fontSize: 52, color: C.amber, opacity: bill}}>Dad's $80 gets split too</div>}
      <Hero pose={f >= at('split') ? 'shrug_talk' : 'think_worry'} x={180} y={1230} h={260} />
    </Fade>
  );
};

const CTA: React.FC<{dur: number; off: number}> = ({dur, off}) => {
  const f = useCurrentFrame();
  const at = (k: string) => Q[k] - off;
  const pulse = 1 + Math.sin(f / 5) * 0.03;
  const end = fr(T.dur) - off;
  const e = sp(f, end);
  return (
    <Fade dur={dur + 2}>
      <AbsoluteFill style={{alignItems: 'center', paddingTop: 250, textAlign: 'center', opacity: 1 - e}}>
        <Pop><div style={{fontFamily: HEAD, fontSize: 78, color: C.cream, lineHeight: 1.03}}>WOULD YOU BUY IT...</div></Pop>
        <div style={{display: 'flex', gap: 40, marginTop: 50}}>
          <Pop delay={at('dayone')}><div style={{width: 400, height: 220, borderRadius: 30, background: C.panel, border: `7px solid ${C.mint}`, fontFamily: HEAD, fontSize: 64, color: C.mint, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>DAY ONE</div></Pop>
          <Pop delay={at('sale')}><div style={{width: 400, height: 220, borderRadius: 30, background: C.panel, border: `7px solid ${C.amber}`, fontFamily: HEAD, fontSize: 56, color: C.amber, display: 'flex', alignItems: 'center', justifyContent: 'center', lineHeight: 1.05}}>WAIT FOR<br />A SALE</div></Pop>
        </div>
        <Pop delay={at('comments')}><div style={{transform: `scale(${pulse})`, marginTop: 50, background: C.amber, color: C.bg, fontFamily: HEAD, fontSize: 52, padding: '20px 44px', borderRadius: 26}}>Tell us in the comments ↓</div></Pop>
      </AbsoluteFill>
      {e < 0.05 && <Hero pose="point_talk" x={540} y={1240} h={260} />}
      <AbsoluteFill style={{alignItems: 'center', paddingTop: 300, textAlign: 'center', opacity: e}}>
        <div style={{fontFamily: HEAD, fontSize: 70, color: C.cream, lineHeight: 1.1}}>More money stories<br />on the channel ↑</div>
        <div style={{fontFamily: HEAD, fontSize: 80, color: C.amber, marginTop: 60, lineHeight: 1.05}}>So... who gets<br /><span style={{color: C.red}}>the controller?</span></div>
      </AbsoluteFill>
      {e > 0.05 && <Hero pose="point_smile" x={540} y={1400} h={340} from={end} />}
    </Fade>
  );
};

export const CheapDad: React.FC = () => (
  <AbsoluteFill>
    <Background />
    <Sequence durationInFrames={S[1]}><Hook dur={S[1]} /></Sequence>
    <Sequence from={S[1]} durationInFrames={S[2] - S[1]}><Couch dur={S[2] - S[1]} off={S[1]} /></Sequence>
    <Sequence from={S[2]} durationInFrames={S[4] - S[2]}><Billions dur={S[4] - S[2]} off={S[2]} /></Sequence>
    <Sequence from={S[4]} durationInFrames={S[5] - S[4]}><Preorders dur={S[5] - S[4]} off={S[4]} /></Sequence>
    <Sequence from={S[5]} durationInFrames={S[6] - S[5]}><Compare dur={S[6] - S[5]} off={S[5]} /></Sequence>
    <Sequence from={S[6]} durationInFrames={S[8] - S[6]}><Catch dur={S[8] - S[6]} off={S[6]} /></Sequence>
    <Sequence from={S[8]} durationInFrames={TOTAL - S[8]}><CTA dur={TOTAL - S[8]} off={S[8]} /></Sequence>
    <Brand />
    <Captions />
    <Source />
    <Audio src={staticFile('vo.mp3')} />
  </AbsoluteFill>
);

export const Root: React.FC = () => (
  <Composition id="CheapDad" component={CheapDad} durationInFrames={TOTAL} fps={FPS} width={1080} height={1920} />
);
