// Chartography DOCUMENTARY v5 long-form (Nov 27, 2026): "Nvidia's 11 days without its founder" - the trillion-dollar round trip.
// Every number comes from the Researcher's VERIFIED 2026-11-25 lines (SEC 8-K filings, stocktitan closes, Fortune, Yahoo).
// Caricatures: Jensen Huang and Colette Kress only (loose round-head style, name labels). No logos, no photos.
import React from 'react';
import {AbsoluteFill, Audio, Composition, Img, interpolate, spring, staticFile, useCurrentFrame, Easing} from 'remotion';
import '@fontsource/archivo-black/latin-400.css';
import '@fontsource/fira-sans/latin-400.css';
import '@fontsource/fira-sans/latin-700.css';
import T from './timing.json';

const C = {bg: '#0e1b2e', panel: '#16283f', panel2: '#22365a', cream: '#f6f1e7', muted: '#afb8c6', slate: '#5c7392', mint: '#3fd6a0', amber: '#f2b544', coral: '#ff8a65', red: '#ff5d5d', ink: '#0b1220', skin: '#f1c9a5', paper: '#ece6d6'};
const HEAD = "'Archivo Black', sans-serif";
const BODY = "'Fira Sans', sans-serif";
const FPS = 30;
const fr = (s: number) => Math.round(s * FPS);
const clamp = {extrapolateLeft: 'clamp' as const, extrapolateRight: 'clamp' as const};
const X = (T as unknown as {x: Record<string, number>}).x;
const cx = (k: string) => fr(X[k]);
const SEG = T.seg.map(fr);
const END = fr(T.dur + 2.0);
const sp = (f: number, from: number, stiff = 140) => spring({frame: f - from, fps: FPS, config: {damping: 13, stiffness: stiff}});
const fade = (f: number, from: number, len = 10) => interpolate(f, [from, from + len], [0, 1], clamp);

const SRC = {
  k8: 'Source: Nvidia Form 8-K, Nov 12, 2026 (sec.gov)',
  px: 'Source: NVDA daily closes, stocktitan.net (opened Nov 25, 2026)',
  q3: 'Source: Nvidia Q3 fiscal 2027 results (Nov 17, 2026) via stocktitan.net · per-day profit = our math',
  k23: 'Source: Nvidia press release / 8-K, Nov 23, 2026 (sec.gov)',
  rt: 'Sources: NVDA closes, stocktitan.net (Nov 11-24, 2026) · $ value = our estimate (about 24.2B shares)',
  spx: 'Source: Fortune, Nov 23, 2026',
  reu: 'Source: Reuters report of Nov 20, 2026, via Yahoo Finance · not confirmed by Nvidia; SEC declined to comment',
};

// ---------- shared ----------
const Background: React.FC<{glow?: string}> = ({glow = '#24395a'}) => {
  const f = useCurrentFrame();
  const dots = Array.from({length: 46}, (_, i) => {
    const x = (i * 347) % 1920, y = ((i * 211) % 1080 + f * (0.12 + (i % 5) * 0.05)) % 1080;
    return <circle key={i} cx={x} cy={1080 - y} r={1.5 + (i % 3)} fill={i % 7 === 0 ? C.mint : '#fff'} opacity={0.05 + (i % 4) * 0.02} />;
  });
  return (
    <AbsoluteFill style={{background: `radial-gradient(circle at 35% 25%, ${glow}, ${C.bg} 72%)`}}>
      <svg width={1920} height={1080}>{dots}</svg>
    </AbsoluteFill>
  );
};
// slow documentary push-in on every scene
const Push: React.FC<{from: number; children: React.ReactNode}> = ({from, children}) => {
  const f = useCurrentFrame();
  const z = 1 + Math.min(0.04, (f - from) / 9000);
  return <AbsoluteFill style={{transform: `scale(${z})`, transformOrigin: '50% 45%'}}>{children}</AbsoluteFill>;
};

const Hero: React.FC<{pose: string; x: number; y: number; h: number; from?: number; flip?: boolean; shake?: boolean}> = ({pose, x, y, h, from = 0, flip, shake}) => {
  const f = useCurrentFrame();
  const s = sp(f, from, 170);
  const w = h * 0.6;
  const dx = shake ? Math.sin(f * 2.2) * 4 : 0;
  return (
    <Img src={staticFile(`sprites/hero_${pose}.png`)} style={{
      position: 'absolute', left: x - w / 2 + dx, top: y - h + Math.sin(f / 7) * 4 + (1 - s) * 60, width: w, height: h,
      transform: `scale(${flip ? -s : s}, ${s})`, transformOrigin: '50% 100%', filter: 'drop-shadow(0 14px 14px rgba(0,0,0,.35))',
    }} />
  );
};

const Brand: React.FC = () => (
  <div style={{position: 'absolute', top: 30, left: 60, fontFamily: HEAD, fontSize: 26, letterSpacing: 4, color: C.cream, opacity: 0.85}}>CHART<span style={{color: C.amber}}>OGRAPHY</span></div>
);
const Source: React.FC<{text: string}> = ({text}) => (
  <div style={{position: 'absolute', bottom: 16, left: 60, right: 60, textAlign: 'center', fontFamily: BODY, fontSize: 20, color: C.muted, opacity: 0.9}}>{text}</div>
);
const Pill: React.FC<{children: React.ReactNode; o?: number; bg?: string; color?: string; size?: number; style?: React.CSSProperties}> = ({children, o = 1, bg = C.amber, color = C.bg, size = 36, style}) => (
  <div style={{display: 'inline-block', opacity: o, transform: `scale(${0.85 + 0.15 * o})`, transformOrigin: 'left center', background: bg, color, fontFamily: HEAD, fontSize: size, padding: '10px 24px', borderRadius: 18, ...style}}>{children}</div>
);
const Abs: React.FC<{x: number; y: number; w?: number; o?: number; children: React.ReactNode; style?: React.CSSProperties}> = ({x, y, w, o = 1, children, style}) => (
  <div style={{position: 'absolute', left: x, top: y, width: w, opacity: o, ...style}}>{children}</div>
);
const Bubble: React.FC<{x: number; y: number; o: number; children: React.ReactNode; size?: number; w?: number}> = ({x, y, o, children, size = 44, w}) => (
  <div style={{position: 'absolute', left: x, top: y, width: w, opacity: o, transform: `scale(${0.8 + 0.2 * o})`, transformOrigin: 'left bottom', background: C.cream, color: C.bg, fontFamily: HEAD, fontSize: size, padding: '14px 26px', borderRadius: 26, borderBottomLeftRadius: 6, boxShadow: '0 10px 24px rgba(0,0,0,.35)'}}>{children}</div>
);
const SubButton: React.FC<{at: number; x: number; y: number; size?: number}> = ({at, x, y, size = 64}) => {
  const f = useCurrentFrame();
  const s = sp(f, at, 180);
  const pulse = 1 + Math.max(0, Math.sin((f - at) / 6)) * 0.04;
  return (
    <div style={{position: 'absolute', left: x, top: y, transform: `scale(${s * pulse})`, transformOrigin: 'left center', background: C.red, color: '#fff', fontFamily: HEAD, fontSize: size, padding: '18px 44px', borderRadius: 24, display: 'flex', alignItems: 'center', gap: 22, boxShadow: '0 14px 30px rgba(0,0,0,.4)'}}>
      <span style={{fontSize: size * 0.8}}>▶</span> SUBSCRIBE
    </div>
  );
};
const Num: React.FC<{v: number; d?: number; pre?: string; suf?: string}> = ({v, d = 2, pre = '', suf = ''}) => <>{pre}{v.toLocaleString('en-US', {minimumFractionDigits: d, maximumFractionDigits: d})}{suf}</>;

const CHUNKS: (typeof T.caps)[] = [];
{
  let cur: typeof T.caps = [];
  for (const w of T.caps) {
    cur.push(w);
    if (cur.length === 4 || /[.?!,:]$/.test(w[0] as string)) { CHUNKS.push(cur); cur = []; }
  }
  if (cur.length) CHUNKS.push(cur);
}
const Captions: React.FC = () => {
  const t = useCurrentFrame() / FPS;
  const ch = CHUNKS.find((c) => t >= (c[0][1] as number) && t < (c[c.length - 1][2] as number));
  if (!ch) return null;
  return (
    <div style={{position: 'absolute', top: 960, left: 300, right: 300, textAlign: 'center', fontFamily: HEAD, fontSize: 42, color: '#fff', WebkitTextStroke: `8px ${C.bg}`, paintOrder: 'stroke fill'}}>
      {ch.map((w, i) => {
        const on = t >= (w[1] as number) && (i === ch.length - 1 || t < (ch[i + 1][1] as number));
        return <span key={i} style={{display: 'inline-block', margin: '0 6px', padding: '0 8px', borderRadius: 10, background: on ? (w[3] === 'hero' ? C.mint : C.amber) : 'transparent', color: on ? C.bg : '#fff', WebkitTextStroke: on ? '0px' : `8px ${C.bg}`}}>{w[0] as string}</span>;
      })}
    </div>
  );
};

// ---------- characters: loose round-head caricatures with name labels ----------
type Mood = 'smile' | 'flat' | 'shock' | 'worry';
const Person: React.FC<{x: number; y: number; s?: number; hair: 'swoop' | 'bob'; hairColor: string; jacket: string; shirt: string; glasses?: boolean; label?: string; mood?: Mood; wave?: number; o?: number}> = ({x, y, s = 1, hair, hairColor, jacket, shirt, glasses, label, mood = 'flat', wave = 0, o = 1}) => {
  const f = useCurrentFrame();
  const bob = Math.sin(f / 9) * 3;
  const arm = wave ? Math.sin(f / 4) * 25 * wave : 0;
  return (
    <svg style={{position: 'absolute', left: x - 160 * s, top: y - 140 * s + bob, overflow: 'visible', opacity: o}} width={320 * s} height={520 * s} viewBox="-160 -140 320 520">
      <ellipse cx={0} cy={250} rx={95} ry={16} fill="#000" opacity={0.25} />
      <rect x={-42} y={150} width={34} height={100} rx={14} fill="#1c2433" />
      <rect x={8} y={150} width={34} height={100} rx={14} fill="#1c2433" />
      <path d="M -78 160 Q -80 40 0 30 Q 80 40 78 160 Z" fill={jacket} stroke="#0a0f18" strokeWidth={6} />
      <path d="M -22 36 L 0 92 L 22 36 Z" fill={shirt} />
      <g transform={`rotate(${-arm} -72 60)`}><rect x={-100} y={52} width={30} height={92} rx={14} fill={jacket} stroke="#0a0f18" strokeWidth={5} /></g>
      <rect x={70} y={52} width={30} height={92} rx={14} fill={jacket} stroke="#0a0f18" strokeWidth={5} />
      <circle cx={0} cy={-30} r={62} fill={C.skin} stroke="#0a0f18" strokeWidth={6} />
      {hair === 'swoop' && <path d="M -62 -38 Q -58 -104 4 -98 Q 66 -96 64 -30 Q 40 -70 -8 -62 Q -40 -58 -62 -38 Z" fill={hairColor} stroke="#0a0f18" strokeWidth={4} />}
      {hair === 'bob' && <path d="M -66 10 Q -80 -100 0 -98 Q 80 -100 66 10 L 50 10 Q 56 -56 0 -60 Q -56 -56 -50 10 Z" fill={hairColor} stroke="#0a0f18" strokeWidth={4} />}
      <ellipse cx={-21} cy={-30} rx={7} ry={mood === 'shock' ? 11 : 9} fill="#0a0f18" />
      <ellipse cx={21} cy={-30} rx={7} ry={mood === 'shock' ? 11 : 9} fill="#0a0f18" />
      {glasses && <g fill="none" stroke="#0a0f18" strokeWidth={4}><circle cx={-21} cy={-30} r={17} /><circle cx={21} cy={-30} r={17} /><path d="M -4 -30 L 4 -30" /></g>}
      {mood === 'smile' && <path d="M -20 2 Q 0 20 20 2" stroke="#0a0f18" strokeWidth={6} fill="none" strokeLinecap="round" />}
      {mood === 'flat' && <path d="M -16 6 L 16 6" stroke="#0a0f18" strokeWidth={6} strokeLinecap="round" />}
      {mood === 'worry' && <path d="M -18 10 Q 0 -2 18 10" stroke="#0a0f18" strokeWidth={6} fill="none" strokeLinecap="round" />}
      {mood === 'shock' && <ellipse cx={0} cy={8} rx={11} ry={14} fill="#0a0f18" />}
      {label && (
        <g transform="translate(0, 300)">
          <rect x={-170} y={-30} width={340} height={56} rx={14} fill={C.panel} stroke={C.amber} strokeWidth={3} />
          <text x={0} y={8} textAnchor="middle" fontFamily="Archivo Black" fontSize={30} fill={C.cream}>{label}</text>
        </g>
      )}
    </svg>
  );
};
const Huang: React.FC<{x: number; y: number; s?: number; mood?: Mood; wave?: number; label?: boolean; o?: number}> = ({label = true, ...p}) => (
  <Person {...p} hair="swoop" hairColor="#2a2a2e" jacket="#141414" shirt="#2b2b2b" glasses label={label ? 'Jensen Huang' : undefined} />
);
const Kress: React.FC<{x: number; y: number; s?: number; mood?: Mood; label?: string; o?: number}> = ({label = 'Colette Kress', ...p}) => (
  <Person {...p} hair="bob" hairColor="#c9a46a" jacket="#3c5f8f" shirt={C.cream} label={label} />
);

// office desk with an empty chair
const Chair: React.FC<{x: number; y: number; s?: number; empty?: number}> = ({x, y, s = 1}) => (
  <svg style={{position: 'absolute', left: x, top: y}} width={520 * s} height={420 * s} viewBox="0 0 520 420">
    <rect x={150} y={20} width={220} height={220} rx={40} fill="#2b2f3a" stroke={C.ink} strokeWidth={8} />
    <rect x={120} y={230} width={280} height={50} rx={20} fill="#343a48" stroke={C.ink} strokeWidth={8} />
    <rect x={250} y={280} width={20} height={80} fill={C.ink} />
    <path d="M 160 380 L 260 350 L 360 380" stroke={C.ink} strokeWidth={14} fill="none" strokeLinecap="round" />
    <rect x={0} y={260} width={520} height={30} rx={8} fill="#5a3d2b" stroke={C.ink} strokeWidth={6} opacity={0.0} />
  </svg>
);
const Doc: React.FC<{x: number; y: number; w: number; o?: number; rot?: number; children: React.ReactNode}> = ({x, y, w, o = 1, rot = 0, children}) => (
  <div style={{position: 'absolute', left: x, top: y, width: w, opacity: o, transform: `rotate(${rot}deg) translateY(${(1 - o) * 30}px)`, background: C.paper, borderRadius: 10, padding: '30px 38px', boxShadow: '0 20px 40px rgba(0,0,0,.45)', color: C.ink, fontFamily: BODY}}>{children}</div>
);
const Stamp: React.FC<{x: number; y: number; at: number; children: React.ReactNode; color?: string; size?: number}> = ({x, y, at, children, color = C.red, size = 50}) => {
  const f = useCurrentFrame();
  if (f < at) return null;
  const s = interpolate(f, [at, at + 6], [1.8, 1], {...clamp, easing: Easing.out(Easing.cubic)});
  return <div style={{position: 'absolute', left: x, top: y, transform: `rotate(-8deg) scale(${s})`, border: `7px solid ${color}`, color, fontFamily: HEAD, fontSize: size, padding: '6px 22px', borderRadius: 12, background: 'rgba(255,255,255,0.04)'}}>{children}</div>;
};

// price line chart (closing prices) used in several scenes
const PTS: [string, number][] = [['Oct 6', 239.24], ['Nov 6', 186.64], ['Nov 11', 173.73], ['Nov 12', 166.19], ['Nov 17', 155.46], ['Nov 19', 145.98], ['Nov 20', 125.53], ['Nov 23', 165.05], ['Nov 24', 155.38]];
const PriceChart: React.FC<{x: number; y: number; w: number; h: number; upto: number; prog: number; hi?: number[]}> = ({x, y, w, h, upto, prog, hi = []}) => {
  const lo = 110, top = 250;
  const px = (i: number) => (i / (PTS.length - 1)) * w;
  const py = (v: number) => h - ((v - lo) / (top - lo)) * h;
  const n = Math.max(1, upto * prog);
  const pts: string[] = [];
  for (let i = 0; i <= Math.floor(n) && i < PTS.length; i++) pts.push(`${px(i)},${py(PTS[i][1])}`);
  const fl = Math.floor(n);
  if (fl < upto && fl + 1 < PTS.length) {
    const t = n - fl;
    pts.push(`${px(fl) + (px(fl + 1) - px(fl)) * t},${py(PTS[fl][1]) + (py(PTS[fl + 1][1]) - py(PTS[fl][1])) * t}`);
  }
  return (
    <svg style={{position: 'absolute', left: x, top: y, overflow: 'visible'}} width={w} height={h}>
      {[125, 175, 225].map((v) => <g key={v}><line x1={0} x2={w} y1={py(v)} y2={py(v)} stroke={C.slate} strokeWidth={1.5} strokeDasharray="6 8" opacity={0.5} /><text x={-14} y={py(v) + 8} textAnchor="end" fontFamily="Fira Sans" fontSize={22} fill={C.muted}>${v}</text></g>)}
      <polyline points={pts.join(' ')} fill="none" stroke={C.coral} strokeWidth={8} strokeLinejoin="round" strokeLinecap="round" />
      {PTS.map(([d, v], i) => i <= n ? (
        <g key={d}>
          <circle cx={px(i)} cy={py(v)} r={hi.includes(i) ? 12 : 7} fill={hi.includes(i) ? C.amber : C.cream} />
          <text x={px(i)} y={h + 40} textAnchor="middle" fontFamily="Fira Sans" fontWeight={700} fontSize={22} fill={C.muted}>{d}</text>
          {hi.includes(i) && <text x={px(i)} y={py(v) - 24} textAnchor="middle" fontFamily="Archivo Black" fontSize={32} fill={C.amber}>${v.toFixed(2)}</text>}
        </g>
      ) : null)}
    </svg>
  );
};

// ---------- scenes ----------
const ColdOpen: React.FC = () => {
  const f = useCurrentFrame();
  const yrs = Math.round(interpolate(f, [cx('y33') - 10, cx('y33') + 20], [0, 33], clamp));
  return (
    <AbsoluteFill>
      <Abs x={110} y={110} o={fade(f, 0, 8)}><div style={{fontFamily: HEAD, fontSize: 40, letterSpacing: 6, color: C.amber}}>NOVEMBER 12, 2026</div></Abs>
      <Chair x={170} y={300} s={1.15} />
      <Abs x={170} y={800} o={fade(f, cx('founder'))}><div style={{fontFamily: BODY, fontWeight: 700, fontSize: 32, color: C.muted}}>the CEO's chair (illustration)</div></Abs>
      <Abs x={940} y={260} o={fade(f, cx('y33') - 8)}>
        <div style={{fontFamily: HEAD, fontSize: 240, color: C.cream, lineHeight: 1}}>{yrs}</div>
        <div style={{fontFamily: HEAD, fontSize: 58, color: C.cream}}>YEARS WITH ITS FOUNDER</div>
      </Abs>
      <Abs x={940} y={640} o={fade(f, cx('founder'))}><Pill bg={C.red} color="#fff" size={54}>...then none</Pill></Abs>
    </AbsoluteFill>
  );
};

const Hook: React.FC = () => {
  const f = useCurrentFrame();
  const line = interpolate(f, [cx('seven') - 4, cx('seven') + 40], [0, 1], clamp);
  const pre = cx('monday');
  return (
    <AbsoluteFill>
      {f < pre - 4 ? (
        <>
          <Abs x={110} y={110} o={fade(f, cx('seven') - 4)}><Pill size={40}>7 TRADING DAYS LATER</Pill></Abs>
          <PriceChart x={170} y={300} w={760} h={480} upto={6} prog={line} hi={line > 0.98 ? [2, 6] : []} />
          <Abs x={1060} y={250} o={fade(f, cx('trillion0'))}>
            <div style={{fontFamily: HEAD, fontSize: 64, color: C.cream}}>value lost:</div>
            <div style={{fontFamily: HEAD, fontSize: 170, color: C.red, lineHeight: 1}}>-$1T+</div>
            <div style={{fontFamily: BODY, fontWeight: 700, fontSize: 30, color: C.muted, marginTop: 6}}>more than a trillion dollars (our estimate)</div>
          </Abs>
          {f >= SEG[2] - 6 && <Hero pose="shock_shock" x={1620} y={960} h={420} from={SEG[2] - 6} shake />}
          {f >= SEG[2] - 6 && <Bubble x={880} y={620} o={fade(f, SEG[2] - 4, 6)} size={44} w={460}>A trillion?! In a week and a half?</Bubble>}
        </>
      ) : (
        <>
          <Doc x={200} y={200} w={720} o={fade(f, cx('press') - 6)} rot={-3}>
            <div style={{fontFamily: HEAD, fontSize: 40}}>PRESS RELEASE</div>
            <div style={{fontSize: 30, marginTop: 10, color: '#3a4458'}}>Monday, November 23, 2026</div>
            {[0, 1, 2, 3].map((i) => <div key={i} style={{height: 14, background: '#c9c1ad', borderRadius: 7, marginTop: 22, width: `${90 - i * 12}%`}} />)}
          </Doc>
          <Abs x={1080} y={200} o={fade(f, cx('eleven') - 4)}><div style={{fontFamily: HEAD, fontSize: 200, color: C.amber, lineHeight: 1}}>11</div><div style={{fontFamily: HEAD, fontSize: 70, color: C.cream}}>DAYS</div></Abs>
          <Abs x={1080} y={540} o={fade(f, cx('pricetag'))}>
            <div style={{display: 'inline-flex', alignItems: 'center', transform: 'rotate(-6deg)', background: C.amber, color: C.bg, fontFamily: HEAD, fontSize: 64, padding: '14px 40px 14px 30px', borderRadius: '14px 60px 60px 14px'}}>
              <span style={{width: 22, height: 22, borderRadius: 11, background: C.bg, marginRight: 24}} />ONE MAN = $ ?
            </div>
          </Abs>
        </>
      )}
    </AbsoluteFill>
  );
};

const Filing: React.FC = () => {
  const f = useCurrentFrame();
  const walk = interpolate(f, [cx('notone'), cx('notone') + 50], [0, 1], {...clamp, easing: Easing.inOut(Easing.cubic)});
  return (
    <AbsoluteFill>
      <Doc x={150} y={150} w={860} o={fade(f, cx('short') - 6)} rot={-2}>
        <div style={{fontFamily: HEAD, fontSize: 36}}>FORM 8-K · NOV 12, 2026</div>
        <div style={{fontSize: 34, marginTop: 24, fontWeight: 700, opacity: fade(f, cx('resigns'))}}>Jensen Huang resigns as:</div>
        <div style={{fontSize: 32, marginTop: 8, opacity: fade(f, cx('resigns') + 10)}}>President · Chief Executive Officer · Board member</div>
        <div style={{fontSize: 32, marginTop: 18, fontWeight: 700, color: '#b33', opacity: fade(f, cx('effective'))}}>Effective immediately</div>
        <div style={{fontSize: 34, marginTop: 30, fontWeight: 700, opacity: fade(f, cx('noreason'))}}>Reason: <span style={{display: 'inline-block', width: 300, borderBottom: '4px solid #333'}} /></div>
      </Doc>
      <Stamp x={560} y={560} at={cx('notone')} size={46}>NO REASON GIVEN</Stamp>
      <Huang x={1400 + walk * 380} y={430} s={1.05} mood="flat" o={1 - walk * 0.9} />
      <Abs x={1180} y={180} o={fade(f, cx('effective') + 20) * (1 - walk)}><div style={{fontFamily: BODY, fontStyle: 'italic', fontWeight: 700, fontSize: 30, color: C.muted}}>(dramatized)</div></Abs>
    </AbsoluteFill>
  );
};

const Interim: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill>
      <Kress x={420} y={330} s={1.1} mood="flat" o={fade(f, cx('kress') - 6)} />
      <Abs x={760} y={170} o={fade(f, cx('kress'))}><div style={{fontFamily: HEAD, fontSize: 70, color: C.cream}}>INTERIM CEO</div></Abs>
      <Abs x={760} y={270} o={fade(f, cx('since2013'))}><Pill bg={C.panel2} color={C.cream} size={38}>CFO since 2013</Pill></Abs>
      <div style={{position: 'absolute', left: 760, top: 420, width: 900, background: C.panel, border: `5px solid ${C.slate}`, borderRadius: 24, padding: '24px 34px', opacity: fade(f, cx('jones'))}}>
        <div style={{fontFamily: HEAD, fontSize: 44, color: C.amber}}>HARVEY C. JONES</div>
        <div style={{fontFamily: BODY, fontWeight: 700, fontSize: 34, color: C.cream, marginTop: 6}}>first-ever chair of Nvidia's board</div>
      </div>
      <div style={{position: 'absolute', left: 760, top: 640, display: 'flex', gap: 24, alignItems: 'center', opacity: fade(f, cx('accepted'))}}>
        <div style={{background: C.cream, color: C.bg, fontFamily: HEAD, fontSize: 34, padding: '12px 24px', borderRadius: 14}}>NOV 11</div>
        <div style={{fontFamily: BODY, fontWeight: 700, fontSize: 34, color: C.cream}}>board accepts the resignation</div>
      </div>
      <div style={{position: 'absolute', left: 760, top: 740, display: 'flex', gap: 24, alignItems: 'center', opacity: fade(f, cx('accepted') + 24)}}>
        <div style={{background: C.amber, color: C.bg, fontFamily: HEAD, fontSize: 34, padding: '12px 24px', borderRadius: 14}}>NOV 12</div>
        <div style={{fontFamily: BODY, fontWeight: 700, fontSize: 34, color: C.cream}}>the public finds out</div>
      </div>
    </AbsoluteFill>
  );
};

const Before: React.FC = () => {
  const f = useCurrentFrame();
  const a = fade(f, cx('oct6') - 4, 40);
  return (
    <AbsoluteFill>
      <Abs x={110} y={110} o={fade(f, cx('nightbefore') - 4)}><div style={{fontFamily: HEAD, fontSize: 56, color: C.cream}}>NVIDIA share price, closing</div></Abs>
      <PriceChart x={200} y={300} w={1180} h={480} upto={2} prog={a} hi={[0, 2].filter((i) => (i === 2 ? f >= cx('p17373') : f >= cx('p239')))} />
      <Abs x={1440} y={260} o={fade(f, cx('p17373'))}><div style={{background: C.panel, border: `5px solid ${C.amber}`, borderRadius: 22, padding: '18px 28px'}}><div style={{fontFamily: BODY, fontWeight: 700, fontSize: 28, color: C.muted}}>Nov 11 · the night before</div><div style={{fontFamily: HEAD, fontSize: 70, color: C.amber}}>$173.73</div></div></Abs>
      <Abs x={1440} y={480} o={fade(f, cx('p239'))}><div style={{background: C.panel, border: `5px solid ${C.mint}`, borderRadius: 22, padding: '18px 28px'}}><div style={{fontFamily: BODY, fontWeight: 700, fontSize: 28, color: C.muted}}>Oct 6 · record close</div><div style={{fontFamily: HEAD, fontSize: 70, color: C.mint}}>$239.24</div></div></Abs>
    </AbsoluteFill>
  );
};

const Earnings: React.FC = () => {
  const f = useCurrentFrame();
  const n = interpolate(f, [cx('b1158') - 6, cx('b1158') + 36], [0, 115.8], {...clamp, easing: Easing.out(Easing.cubic)});
  return (
    <AbsoluteFill>
      <Kress x={1560} y={360} s={1.0} mood="smile"  o={fade(f, cx('nov17') - 6)} />
      <Abs x={110} y={110} o={fade(f, cx('nov17') - 6)}><Pill size={40}>NOV 17 · FIRST REPORT AS INTERIM CEO</Pill></Abs>
      <Abs x={110} y={250} o={fade(f, cx('revenue') - 4)}><div style={{fontFamily: HEAD, fontSize: 50, color: C.cream}}>Revenue, one quarter</div></Abs>
      <Abs x={110} y={320} o={fade(f, cx('b1158') - 6)}><div style={{fontFamily: HEAD, fontSize: 220, color: C.mint, lineHeight: 1}}><Num v={n} d={1} pre="$" suf="B" /></div></Abs>
      <div style={{position: 'absolute', left: 110, top: 600, display: 'flex', gap: 30}}>
        <Pill o={fade(f, cx('b1158') + 40)} bg={C.amber} size={44}>A RECORD</Pill>
        <Pill o={fade(f, cx('double'))} bg={C.panel2} color={C.cream} size={44}>+103% vs a year earlier</Pill>
      </div>
    </AbsoluteFill>
  );
};

const Breakdown: React.FC = () => {
  const f = useCurrentFrame();
  const dc = fade(f, cx('b1076') - 4, 30);
  const R = 190, L = 2 * Math.PI * R;
  return (
    <AbsoluteFill>
      <div style={{position: 'absolute', left: 110, top: 130, background: C.panel, border: `5px solid ${C.mint}`, borderRadius: 24, padding: '22px 32px', opacity: fade(f, cx('beats') - 4)}}>
        <div style={{fontFamily: BODY, fontWeight: 700, fontSize: 30, color: C.muted}}>beat its own forecast by</div>
        <div style={{fontFamily: HEAD, fontSize: 90, color: C.mint}}>+$7.8B</div>
      </div>
      <svg style={{position: 'absolute', left: 620, top: 160}} width={480} height={480} opacity={fade(f, cx('datacenters') - 4)}>
        <circle cx={240} cy={240} r={R} fill="none" stroke={C.slate} strokeWidth={70} />
        <circle cx={240} cy={240} r={R} fill="none" stroke={C.mint} strokeWidth={70} strokeDasharray={`${L * 0.93 * dc} ${L}`} transform="rotate(-90 240 240)" />
        <text x={240} y={236} textAnchor="middle" fontFamily="Archivo Black" fontSize={64} fill={C.cream}>$107.6B</text>
        <text x={240} y={286} textAnchor="middle" fontFamily="Fira Sans" fontWeight={700} fontSize={28} fill={C.muted}>data centers (93%)</text>
      </svg>
      <Abs x={640} y={680} o={fade(f, cx('datacenters'))}><div style={{fontFamily: BODY, fontWeight: 700, fontSize: 32, color: C.cream, width: 460, textAlign: 'center'}}>the chips behind AI</div></Abs>
      <div style={{position: 'absolute', left: 1220, top: 160, width: 600, opacity: fade(f, cx('profit') - 4)}}>
        <div style={{fontFamily: HEAD, fontSize: 44, color: C.cream}}>PROFIT</div>
        <div style={{fontFamily: HEAD, fontSize: 130, color: C.amber, lineHeight: 1}}>$65.3B</div>
        <div style={{fontFamily: BODY, fontWeight: 700, fontSize: 28, color: C.muted}}>GAAP net income, one quarter</div>
      </div>
      <div style={{position: 'absolute', left: 1220, top: 470, width: 600, background: C.panel, border: `5px solid ${C.amber}`, borderRadius: 24, padding: '22px 30px', opacity: fade(f, cx('perday') - 4)}}>
        <div style={{fontFamily: HEAD, fontSize: 80, color: C.amber}}>~$717M</div>
        <div style={{fontFamily: BODY, fontWeight: 700, fontSize: 34, color: C.cream}}>of profit a day</div>
      </div>
    </AbsoluteFill>
  );
};

const Falling: React.FC = () => {
  const f = useCurrentFrame();
  const a = fade(f, SEG[11] - 4, 50);
  const last = f >= cx('p12553');
  return (
    <AbsoluteFill>
      <Abs x={110} y={110} o={fade(f, SEG[11] - 4)}><div style={{fontFamily: HEAD, fontSize: 64, color: C.cream}}>And the stock <span style={{color: C.coral}}>keeps falling.</span></div></Abs>
      <PriceChart x={200} y={300} w={1060} h={480} upto={6} prog={a} hi={last ? [2, 6] : [2]} />
      <Abs x={1360} y={260} o={fade(f, cx('p14') - 4)}><div style={{background: C.panel, border: `5px solid ${C.red}`, borderRadius: 22, padding: '18px 28px'}}><div style={{fontFamily: BODY, fontWeight: 700, fontSize: 28, color: C.muted}}>Fri, Nov 20 alone</div><div style={{fontFamily: HEAD, fontSize: 90, color: C.red}}>-14.0%</div></div></Abs>
      <Abs x={1360} y={500} o={fade(f, cx('p277') - 4)}><div style={{background: C.red, borderRadius: 22, padding: '18px 28px'}}><div style={{fontFamily: BODY, fontWeight: 700, fontSize: 28, color: '#fff'}}>Nov 11 → Nov 20</div><div style={{fontFamily: HEAD, fontSize: 100, color: '#fff'}}>-27.7%</div></div></Abs>
    </AbsoluteFill>
  );
};

const SoftCTA: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill>
      <Hero pose="point_talk" x={600} y={1000} h={640} from={SEG[13] - 6} />
      <Bubble x={900} y={260} o={fade(f, SEG[13], 6)} size={48} w={820}>If this already surprised you, hit subscribe. The next part gets stranger.</Bubble>
      {f >= cx('soft') + 20 && <SubButton at={cx('soft') + 20} x={900} y={620} />}
    </AbsoluteFill>
  );
};

const Vote: React.FC = () => {
  const f = useCurrentFrame();
  const hands = f >= cx('unan');
  return (
    <AbsoluteFill>
      <Abs x={110} y={110} o={fade(f, cx('nov22') - 6)}><Pill size={40}>SUNDAY, NOV 22 · THE BOARD VOTES</Pill></Abs>
      <svg style={{position: 'absolute', left: 160, top: 260}} width={1000} height={560}>
        <ellipse cx={500} cy={360} rx={440} ry={130} fill="#5a3d2b" stroke={C.ink} strokeWidth={8} />
        {Array.from({length: 9}, (_, i) => {
          const ang = Math.PI * (0.08 + (i / 8) * 0.84);
          const x0 = 500 - Math.cos(ang) * 470, y0 = 300 - Math.sin(ang) * 150;
          const up = hands ? Math.min(1, (f - cx('unan') - i * 2) / 6) : 0;
          return (
            <g key={i} transform={`translate(${x0},${y0})`}>
              <rect x={-34} y={0} width={68} height={70} rx={24} fill={C.slate} stroke={C.ink} strokeWidth={4} />
              <circle cx={0} cy={-26} r={30} fill="#3a4b66" stroke={C.ink} strokeWidth={4} />
              {up > 0 && <rect x={22} y={-20 - 60 * up} width={18} height={60 * up + 10} rx={8} fill="#3a4b66" stroke={C.ink} strokeWidth={3} />}
            </g>
          );
        })}
      </svg>
      <Stamp x={1240} y={300} at={cx('unan')} color={C.mint} size={70}>UNANIMOUS</Stamp>
      <Abs x={1240} y={460} o={fade(f, cx('bring'))}><div style={{fontFamily: HEAD, fontSize: 66, color: C.cream}}>"Bring him back."</div><div style={{fontFamily: BODY, fontWeight: 700, fontSize: 28, color: C.muted}}>(the decision, in our words)</div></Abs>
      <div style={{position: 'absolute', left: 1240, top: 640, background: C.panel, border: `5px solid ${C.amber}`, borderRadius: 22, padding: '18px 28px', opacity: fade(f, cx('nov23') - 4)}}>
        <div style={{fontFamily: BODY, fontWeight: 700, fontSize: 30, color: C.muted}}>Monday, Nov 23</div>
        <div style={{fontFamily: HEAD, fontSize: 80, color: C.amber, opacity: fade(f, cx('t855') - 4)}}>8:55 AM ET</div>
        <div style={{fontFamily: BODY, fontWeight: 700, fontSize: 30, color: C.cream, opacity: fade(f, cx('goesout'))}}>the announcement goes out</div>
      </div>
    </AbsoluteFill>
  );
};

const Quotes: React.FC = () => {
  const f = useCurrentFrame();
  const Q: [string, string, string][] = [
    ['candor', 'satisfied with respect to Mr. Huang\'s "candor and ability to lead"', C.mint],
    ['input', '"received input from senior levels of the United States government"', C.amber],
    ['nsr', 'reinstatement "poses no national security risk"', C.cream],
  ];
  return (
    <AbsoluteFill>
      <Abs x={110} y={110}><div style={{fontFamily: HEAD, fontSize: 52, color: C.cream}}>What the board's release says</div></Abs>
      {Q.map(([k, q, c], i) => (
        <div key={k} style={{position: 'absolute', left: 110 + i * 60, top: 240 + i * 200, width: 1100, background: C.panel, borderLeft: `14px solid ${c}`, borderRadius: 18, padding: '26px 34px', opacity: fade(f, cx(k) - 6), transform: `translateX(${(1 - fade(f, cx(k) - 6)) * -40}px)`}}>
          <div style={{fontFamily: BODY, fontWeight: 700, fontSize: 40, color: C.cream, lineHeight: 1.25}}>{q}</div>
        </div>
      ))}
      <Huang x={1620} y={420} s={0.95} mood="smile" wave={1} o={fade(f, SEG[16] - 6)} />
    </AbsoluteFill>
  );
};

const Probe: React.FC = () => {
  const f = useCurrentFrame();
  const opens = f >= cx('opens') - 6;
  return (
    <AbsoluteFill>
      {!opens ? (
        <>
          <svg style={{position: 'absolute', left: 150, top: 220}} width={620} height={520} opacity={fade(f, cx('committee') - 6)}>
            <path d="M 20 80 L 220 80 L 260 40 L 600 40 L 600 500 L 20 500 Z" fill="#d6b56d" stroke={C.ink} strokeWidth={8} />
            <rect x={20} y={110} width={580} height={390} fill="#e3c47f" stroke={C.ink} strokeWidth={8} />
            <text x={310} y={260} textAnchor="middle" fontFamily="Archivo Black" fontSize={44} fill={C.ink}>INDEPENDENT</text>
            <text x={310} y={316} textAnchor="middle" fontFamily="Archivo Black" fontSize={44} fill={C.ink}>COMMITTEE</text>
          </svg>
          <Stamp x={240} y={600} at={cx('notfinished')} size={52}>REVIEW ONGOING</Stamp>
          <Abs x={860} y={230} w={950} o={fade(f, cx('foreign') - 10)}><div style={{fontFamily: BODY, fontWeight: 700, fontSize: 40, color: C.cream, lineHeight: 1.3}}>Looking into reports that he was <span style={{color: C.amber}}>"the target of a foreign intelligence effort"</span></div></Abs>
          <div style={{position: 'absolute', left: 860, top: 480, width: 900, background: C.panel, border: `5px solid ${C.slate}`, borderRadius: 22, padding: '20px 28px', opacity: fade(f, cx('newcomm') - 4)}}>
            <div style={{fontFamily: BODY, fontWeight: 700, fontSize: 28, color: C.muted}}>NEW</div>
            <div style={{fontFamily: HEAD, fontSize: 40, color: C.cream}}>National Security & Export Control Committee</div>
          </div>
          <div style={{position: 'absolute', left: 860, top: 690, width: 900, background: C.panel, border: `5px solid ${C.slate}`, borderRadius: 22, padding: '20px 28px', opacity: fade(f, cx('cco') - 4)}}>
            <div style={{fontFamily: BODY, fontWeight: 700, fontSize: 28, color: C.muted}}>HIRING</div>
            <div style={{fontFamily: HEAD, fontSize: 40, color: C.cream}}>its first Chief Compliance Officer</div>
          </div>
        </>
      ) : (
        <AbsoluteFill style={{alignItems: 'center', justifyContent: 'center'}}>
          <svg width={300} height={300} style={{transform: `rotate(${Math.sin(f / 2) * 12}deg)`}}>
            <path d="M 150 30 Q 70 30 70 130 L 60 210 L 240 210 L 230 130 Q 230 30 150 30 Z" fill={C.amber} stroke={C.ink} strokeWidth={8} />
            <circle cx={150} cy={238} r={24} fill={C.amber} stroke={C.ink} strokeWidth={8} />
          </svg>
          <div style={{fontFamily: HEAD, fontSize: 80, color: C.cream, marginTop: 20}}>THE MARKET OPENS</div>
        </AbsoluteFill>
      )}
    </AbsoluteFill>
  );
};

const Jump: React.FC = () => {
  const f = useCurrentFrame();
  const n = interpolate(f, [cx('p3148') - 6, cx('p3148') + 30], [0, 31.48], {...clamp, easing: Easing.out(Easing.cubic)});
  return (
    <AbsoluteFill>
      <Abs x={110} y={110} o={fade(f, cx('close') - 6)}><Pill size={40}>NOV 23 · AT THE CLOSE</Pill></Abs>
      <Abs x={110} y={230} o={fade(f, cx('p3148') - 6)}><div style={{fontFamily: HEAD, fontSize: 240, color: C.mint, lineHeight: 1}}><Num v={n} pre="+" suf="%" /></div></Abs>
      <Abs x={120} y={520} o={fade(f, cx('p16505') - 4)}><div style={{fontFamily: HEAD, fontSize: 90, color: C.cream}}>$125.53 <span style={{color: C.muted}}>→</span> <span style={{color: C.mint}}>$165.05</span></div><div style={{fontFamily: BODY, fontWeight: 700, fontSize: 30, color: C.muted}}>Nov 20 close → Nov 23 close</div></Abs>
      <Huang x={1560} y={380} s={1.1} mood="smile" wave={1} o={fade(f, SEG[20] - 6)} />
    </AbsoluteFill>
  );
};

const RoundTrip: React.FC = () => {
  const f = useCurrentFrame();
  const a = fade(f, cx('lost') - 10, 40);
  const b = fade(f, cx('back') - 4, 20);
  const twist = f >= cx('twist') - 4;
  return (
    <AbsoluteFill>
      <Abs x={110} y={100}><div style={{fontFamily: HEAD, fontSize: 56, color: C.cream}}>The round trip <span style={{fontFamily: BODY, fontWeight: 700, fontSize: 30, color: C.muted}}>(market value, our estimate)</span></div></Abs>
      {!twist ? (
        <div style={{position: 'absolute', left: 160, top: 260, display: 'flex', gap: 120, alignItems: 'flex-end', height: 560}}>
          {[['-$1.17T', 'Nov 11 → Nov 20', '7 trading days', C.red, a], ['+$0.96T', 'Nov 23', '1 day', C.mint, b]].map(([v, d, s, c, o]) => (
            <div key={v as string} style={{textAlign: 'center', opacity: o as number}}>
              <div style={{fontFamily: HEAD, fontSize: 110, color: c as string}}>{v as string}</div>
              <div style={{width: 380, height: 300 * (o as number), background: c as string, borderRadius: 14, margin: '10px auto 0'}} />
              <div style={{fontFamily: HEAD, fontSize: 40, color: C.cream, marginTop: 14}}>{s as string}</div>
              <div style={{fontFamily: BODY, fontWeight: 700, fontSize: 28, color: C.muted}}>{d as string}</div>
            </div>
          ))}
        </div>
      ) : (
        <>
          <PriceChart x={200} y={280} w={1100} h={460} upto={8} prog={1} hi={[2, 7, 8].filter((i) => i !== 8 || f >= cx('nextday'))} />
          <Abs x={1400} y={250} o={fade(f, cx('below') - 4)}><div style={{background: C.panel, border: `5px solid ${C.coral}`, borderRadius: 22, padding: '18px 28px'}}><div style={{fontFamily: BODY, fontWeight: 700, fontSize: 28, color: C.muted}}>Nov 23 vs Nov 11</div><div style={{fontFamily: HEAD, fontSize: 76, color: C.coral}}>about -5%</div><div style={{fontFamily: BODY, fontWeight: 700, fontSize: 26, color: C.cream}}>still below the night before</div></div></Abs>
          <Abs x={1400} y={540} o={fade(f, cx('p586') - 4)}><div style={{background: C.panel, border: `5px solid ${C.red}`, borderRadius: 22, padding: '18px 28px'}}><div style={{fontFamily: BODY, fontWeight: 700, fontSize: 28, color: C.muted}}>Nov 24</div><div style={{fontFamily: HEAD, fontSize: 76, color: C.red}}>-5.86%</div></div></Abs>
          <Hero pose="think_worry" x={1700} y={1000} h={300} from={cx('twist') - 4} />
        </>
      )}
    </AbsoluteFill>
  );
};

const Paradox: React.FC = () => {
  const f = useCurrentFrame();
  const cards: [string, string, string, string][] = [
    ['best', '$115.8B', 'record quarter, founder gone', C.mint],
    ['sold', '-27.7%', 'investors sold anyway', C.red],
    ['onepr', '+31.48%', 'one press release', C.amber],
  ];
  return (
    <AbsoluteFill>
      <Abs x={110} y={110}><div style={{fontFamily: HEAD, fontSize: 60, color: C.cream}}>The <span style={{color: C.amber}}>paradox</span></div></Abs>
      <div style={{position: 'absolute', left: 110, right: 110, top: 300, display: 'flex', gap: 50, justifyContent: 'center'}}>
        {cards.map(([k, v, l, c]) => (
          <div key={k} style={{width: 500, height: 380, background: C.panel, border: `6px solid ${c}`, borderRadius: 30, textAlign: 'center', paddingTop: 70, opacity: fade(f, cx(k) - 6), transform: `translateY(${(1 - fade(f, cx(k) - 6)) * 40}px)`}}>
            <div style={{fontFamily: HEAD, fontSize: 88, color: c}}>{v}</div>
            <div style={{fontFamily: BODY, fontWeight: 700, fontSize: 36, color: C.cream, marginTop: 20, padding: '0 30px'}}>{l}</div>
          </div>
        ))}
      </div>
    </AbsoluteFill>
  );
};

const Wallet: React.FC = () => {
  const f = useCurrentFrame();
  const a = fade(f, cx('p40') - 6, 30);
  const sixw = f >= cx('sixweeks') - 6;
  const squares = Array.from({length: 100}, (_, i) => i);
  return (
    <AbsoluteFill>
      {!sixw ? (
        <>
          <Abs x={110} y={110} o={fade(f, cx('care') - 6)}><div style={{fontFamily: HEAD, fontSize: 56, color: C.cream}}>Never bought a share?</div></Abs>
          <svg style={{position: 'absolute', left: 150, top: 250}} width={560} height={560}>
            {squares.map((i) => <rect key={i} x={(i % 10) * 54} y={Math.floor(i / 10) * 54} width={46} height={46} rx={8} fill={i < 40 * a ? C.amber : C.slate} opacity={i < 40 * a ? 1 : 0.5} />)}
          </svg>
          <Abs x={780} y={260} o={fade(f, cx('top10') - 4)}><div style={{fontFamily: HEAD, fontSize: 130, color: C.amber, lineHeight: 1}}>~40%</div><div style={{fontFamily: BODY, fontWeight: 700, fontSize: 38, color: C.cream, width: 900}}>of the S&P 500 = the 10 biggest US companies</div></Abs>
          <div style={{position: 'absolute', left: 780, top: 560, width: 960, background: C.panel, border: `5px solid ${C.mint}`, borderRadius: 24, padding: '24px 32px', opacity: fade(f, cx('k401') - 4)}}>
            <div style={{fontFamily: HEAD, fontSize: 46, color: C.cream}}>401(k) → S&P 500 index fund</div>
            <div style={{fontFamily: HEAD, fontSize: 46, color: C.mint, marginTop: 8, opacity: fade(f, cx('piece') - 4)}}>→ a small piece of Nvidia</div>
          </div>
          <Hero pose="point_talk" x={1720} y={1000} h={260} from={cx('care') - 6} />
        </>
      ) : (
        <>
          <Abs x={110} y={110}><div style={{fontFamily: HEAD, fontSize: 56, color: C.cream}}>The whole S&P 500, market value</div></Abs>
          <div style={{position: 'absolute', left: 200, top: 300, display: 'flex', gap: 140, alignItems: 'flex-end', height: 520}}>
            {[['-$8T', 'six weeks after the Oct 6 record', C.red, 'roughly', fade(f, cx('t8') - 4, 20), 1], ['+$3T', 'Nov 23, the day he came back', C.mint, 'about', fade(f, cx('t3') - 4, 20), 3 / 8]].map(([v, l, c, q, o, r]) => (
              <div key={v as string} style={{textAlign: 'center', opacity: o as number}}>
                <div style={{fontFamily: BODY, fontWeight: 700, fontSize: 30, color: C.muted}}>{q as string}</div>
                <div style={{fontFamily: HEAD, fontSize: 110, color: c as string}}>{v as string}</div>
                <div style={{width: 420, height: 340 * (r as number) * (o as number), background: c as string, borderRadius: 14, margin: '10px auto 0'}} />
                <div style={{fontFamily: BODY, fontWeight: 700, fontSize: 30, color: C.cream, marginTop: 14, width: 420}}>{l as string}</div>
              </div>
            ))}
          </div>
        </>
      )}
    </AbsoluteFill>
  );
};

const Reuters: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill>
      <Abs x={110} y={110} o={fade(f, cx('questions') - 6)}><div style={{fontFamily: HEAD, fontSize: 60, color: C.cream}}>Still open</div></Abs>
      <div style={{position: 'absolute', left: 110, top: 240, width: 1300, background: C.panel, border: `5px solid ${C.slate}`, borderRadius: 24, padding: '30px 38px', opacity: fade(f, cx('reuters') - 10)}}>
        <div style={{fontFamily: BODY, fontWeight: 700, fontSize: 30, color: C.muted}}>REUTERS REPORTED (Nov 20, citing two people)</div>
        <div style={{fontFamily: BODY, fontWeight: 700, fontSize: 42, color: C.cream, marginTop: 10, lineHeight: 1.3}}>SEC enforcement officials are examining possible irregularities in Nvidia's financial reporting</div>
      </div>
      <div style={{position: 'absolute', left: 110, top: 560, display: 'flex', gap: 40}}>
        <Pill o={fade(f, cx('notconf') - 4)} bg={C.panel2} color={C.cream} size={40}>Nvidia: not confirmed</Pill>
        <Pill o={fade(f, cx('nocomment') - 4)} bg={C.panel2} color={C.cream} size={40}>SEC: declined to comment</Pill>
      </div>
      <Abs x={110} y={700} o={fade(f, cx('reuters'))}><div style={{fontFamily: BODY, fontStyle: 'italic', fontWeight: 700, fontSize: 32, color: C.amber}}>a report, not a finding</div></Abs>
    </AbsoluteFill>
  );
};

const Close: React.FC = () => {
  const f = useCurrentFrame();
  const qOn = f >= cx('q') - 6;
  return (
    <AbsoluteFill>
      {!qOn ? (
        <>
          <Abs x={0} y={170} w={1920} o={fade(f, cx('end11') - 6)} style={{textAlign: 'center'}}><div style={{fontFamily: HEAD, fontSize: 150, color: C.cream}}>11 DAYS</div></Abs>
          <div style={{position: 'absolute', top: 400, left: 0, right: 0, display: 'flex', justifyContent: 'center', gap: 80, fontFamily: HEAD, fontSize: 96}}>
            <span style={{color: C.red, opacity: fade(f, cx('end11') + 20)}}>-$1T+</span>
            <span style={{color: C.mint, opacity: fade(f, cx('end11') + 50)}}>+~$1T</span>
          </div>
          <Abs x={0} y={600} w={1920} o={fade(f, cx('oneperson') - 6)} style={{textAlign: 'center'}}><div style={{fontFamily: HEAD, fontSize: 70, color: C.amber}}>pricing one person?</div></Abs>
          <Abs x={0} y={600} w={1920} o={fade(f, cx('pricingco') - 6) * (1 - fade(f, cx('oneperson') - 8, 4))} style={{textAlign: 'center'}}><div style={{fontFamily: HEAD, fontSize: 70, color: C.muted}}>not pricing a company?</div></Abs>
        </>
      ) : (
        <>
          <Abs x={110} y={180} w={1150}><div style={{fontFamily: HEAD, fontSize: 80, color: C.cream, lineHeight: 1.05}}>Should one person be worth <span style={{color: C.amber}}>$1 trillion</span> to a company?</div></Abs>
          <Abs x={110} y={520} o={fade(f, cx('comments') - 6)}><Pill size={46}>Tell us in the comments ↓</Pill></Abs>
          <Huang x={1500} y={380} s={1.0} mood="flat" label={false} />
        </>
      )}
    </AbsoluteFill>
  );
};

const CTA: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill>
      <Abs x={110} y={180} o={fade(f, cx('follow') - 4)}><div style={{fontFamily: HEAD, fontSize: 90, color: C.amber, transform: 'rotate(-2deg)'}}>"Follow the money."</div></Abs>
      {f >= cx('subscribe') - 4 && <SubButton at={cx('subscribe') - 4} x={110} y={360} size={64} />}
      <Abs x={110} y={560} w={1200} o={fade(f, cx('saturday') - 4)}><div style={{fontFamily: HEAD, fontSize: 48, color: C.cream}}>SATURDAY:</div><div style={{fontFamily: BODY, fontWeight: 700, fontSize: 44, color: C.mint, marginTop: 6}}>The 10 countries running out of babies</div></Abs>
      <Hero pose={f >= cx('subscribe') ? 'wave_happy' : 'point_smile'} x={1560} y={1010} h={700} from={SEG[27] - 4} />
    </AbsoluteFill>
  );
};

const CHAPTERS = [
  {k: 'ch1', n: 1, title: 'The Empty Chair'},
  {k: 'ch2', n: 2, title: 'The Best Quarter Nobody Wanted'},
  {k: 'ch3', n: 3, title: 'The Phone Call'},
  {k: 'ch4', n: 4, title: 'The Round Trip'},
];
const ChapterCard: React.FC = () => {
  const f = useCurrentFrame();
  const c = CHAPTERS.find((ch) => f >= cx(ch.k) - 6 && f < cx(ch.k) + 66);
  if (!c) return null;
  const a = cx(c.k) - 6;
  const o = Math.min(fade(f, a, 6), 1 - fade(f, a + 62, 10));
  return (
    <AbsoluteFill style={{background: 'rgba(8,14,26,0.94)', opacity: o, alignItems: 'center', justifyContent: 'center'}}>
      <div style={{fontFamily: HEAD, fontSize: 40, letterSpacing: 10, color: C.amber}}>CHAPTER {c.n}</div>
      <div style={{fontFamily: HEAD, fontSize: 96, color: C.cream, marginTop: 10}}>{c.title}</div>
      <div style={{height: 8, width: 700 * fade(f, a + 6, 20), background: C.amber, borderRadius: 4, marginTop: 20}} />
    </AbsoluteFill>
  );
};

// ---------- timeline ----------
type Sc = {from: number; el: React.ReactNode; src: string; glow?: string};
const SCENES: Sc[] = [
  {from: 0, el: <ColdOpen />, src: SRC.k8, glow: '#2a2438'},
  {from: cx('seven') - 6, el: <Hook />, src: SRC.rt, glow: '#3a1f24'},
  {from: cx('ch1') - 6, el: <Filing />, src: SRC.k8},
  {from: cx('kress') - 6, el: <Interim />, src: SRC.k8 + ' · Nov 11 board acceptance: stocktitan.net'},
  {from: cx('nightbefore') - 6, el: <Before />, src: SRC.px},
  {from: cx('ch2') - 6, el: <Earnings />, src: SRC.q3, glow: '#16362e'},
  {from: cx('beats') - 6, el: <Breakdown />, src: SRC.q3, glow: '#16362e'},
  {from: SEG[11] - 6, el: <Falling />, src: SRC.px, glow: '#3a1f24'},
  {from: SEG[13] - 6, el: <SoftCTA />, src: ''},
  {from: cx('ch3') - 6, el: <Vote />, src: SRC.k23 + ' · timing: stocktitan.net'},
  {from: SEG[16] - 6, el: <Quotes />, src: SRC.k23},
  {from: cx('reason') - 6, el: <Probe />, src: SRC.k23},
  {from: cx('ch4') - 6, el: <Jump />, src: 'Source: NVDA closes, stocktitan.net (Nov 20 & Nov 23, 2026)', glow: '#16362e'},
  {from: cx('lost') - 10, el: <RoundTrip />, src: SRC.rt},
  {from: cx('best') - 6, el: <Paradox />, src: SRC.q3 + ' · ' + SRC.px},
  {from: cx('care') - 6, el: <Wallet />, src: SRC.spx},
  {from: cx('questions') - 6, el: <Reuters />, src: SRC.reu},
  {from: cx('end11') - 6, el: <Close />, src: SRC.rt},
  {from: SEG[27] - 6, el: <CTA />, src: ''},
];

export const Story: React.FC = () => {
  const f = useCurrentFrame();
  let i = 0;
  SCENES.forEach((s, k) => { if (f >= s.from) i = k; });
  const s = SCENES[i];
  return (
    <AbsoluteFill>
      <Background glow={s.glow} />
      <Push from={s.from}><AbsoluteFill key={i}>{s.el}</AbsoluteFill></Push>
      <ChapterCard />
      <Brand />
      <Captions />
      {s.src && <Source text={s.src} />}
      <Audio src={staticFile('vo.mp3')} />
    </AbsoluteFill>
  );
};

// ---------- thumbnail (Remotion fallback, 1280x720: 1-3 big words, $ number in a red box, mascot in a corner) ----------
export const Thumb: React.FC = () => (
  <AbsoluteFill>
    <AbsoluteFill style={{background: 'radial-gradient(circle at 70% 45%, #6b3b1c, #0e1b2e 65%)'}} />
    <div style={{position: 'absolute', left: 50, top: 60, width: 660}}>
      <div style={{fontFamily: HEAD, fontSize: 150, color: C.cream, lineHeight: 0.95}}>11 DAYS</div>
      <div style={{display: 'inline-block', marginTop: 30, background: C.red, color: '#fff', fontFamily: HEAD, fontSize: 130, padding: '4px 26px', borderRadius: 18, transform: 'rotate(-3deg)'}}>-$1T</div>
      <div style={{fontFamily: HEAD, fontSize: 84, color: C.mint, marginTop: 30}}>...then back?</div>
    </div>
    <svg style={{position: 'absolute', left: 700, top: 120}} width={520} height={380} viewBox="0 0 520 380">
      <polyline points="10,40 120,90 200,140 280,320 360,110 440,170" fill="none" stroke={C.coral} strokeWidth={18} strokeLinejoin="round" strokeLinecap="round" />
      <circle cx={280} cy={320} r={18} fill={C.red} />
    </svg>
    <Huang x={930} y={430} s={0.62} mood="shock" label={false} />
    <Img src={staticFile('sprites/hero_shock_shock.png')} style={{position: 'absolute', right: 6, bottom: -10, height: 260, width: 156}} />
  </AbsoluteFill>
);

export const Root: React.FC = () => (
  <>
    <Composition id="Story" component={Story} durationInFrames={END} fps={FPS} width={1920} height={1080} />
    <Composition id="Thumb" component={Thumb} durationInFrames={1} fps={FPS} width={1280} height={720} />
  </>
);
