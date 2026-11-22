// Chartography STORY long-form (PLAN v4): "Why Scam Calls Start With Silence" - follow one (made-up) call from the
// silent ring to the empty account, with the FTC's 2025 fraud numbers. Story-style scenes, original characters, mascot host.
import React from 'react';
import {AbsoluteFill, Audio, Composition, Img, interpolate, spring, staticFile, useCurrentFrame} from 'remotion';
import '@fontsource/archivo-black/latin-400.css';
import '@fontsource/fira-sans/latin-400.css';
import '@fontsource/fira-sans/latin-700.css';
import T from './timing.json';

const C = {bg: '#0e1b2e', panel: '#16283f', panel2: '#22365a', cream: '#f6f1e7', muted: '#afb8c6', slate: '#5c7392', mint: '#3fd6a0', amber: '#f2b544', coral: '#ff8a65', red: '#ff5d5d', ink: '#0b1220', skin: '#f1c9a5'};
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
  ftc: 'Source: FTC testimony to the Joint Economic Committee, Mar 25, 2026 (2025 fraud data) · ftc.gov',
  tsr: 'Source: FTC, "Complying with the Telemarketing Sales Rule" (updated Oct 8, 2026) · ftc.gov',
  imp: 'Source: FTC data release, Jun 15, 2026 (2025 data) · FTC consumer alert, May 7, 2026 · ftc.gov',
  story: 'Ruth is a made-up character · dramatized scene',
  mix: 'Sources: FTC testimony, Mar 25, 2026 · FTC data release, Jun 15, 2026 · ftc.gov',
};

// ---------- shared ----------
const Background: React.FC<{w?: number; h?: number; glow?: string}> = ({w = 1920, h = 1080, glow = '#24395a'}) => {
  const f = useCurrentFrame();
  const dots = Array.from({length: 46}, (_, i) => {
    const x = (i * 347) % w, y = ((i * 211) % h + f * (0.12 + (i % 5) * 0.05)) % h;
    return <circle key={i} cx={x} cy={h - y} r={1.5 + (i % 3)} fill={i % 7 === 0 ? C.amber : '#fff'} opacity={0.05 + (i % 4) * 0.02} />;
  });
  return (
    <AbsoluteFill style={{background: `radial-gradient(circle at 35% 25%, ${glow}, ${C.bg} 72%)`}}>
      <svg width={w} height={h}>{dots}</svg>
    </AbsoluteFill>
  );
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
const Pill: React.FC<{children: React.ReactNode; o: number; bg?: string; color?: string; size?: number; style?: React.CSSProperties}> = ({children, o, bg = C.amber, color = C.bg, size = 36, style}) => (
  <div style={{display: 'inline-block', opacity: o, transform: `scale(${0.85 + 0.15 * o})`, transformOrigin: 'left center', background: bg, color, fontFamily: HEAD, fontSize: size, padding: '10px 24px', borderRadius: 18, ...style}}>{children}</div>
);
const Abs: React.FC<{x: number; y: number; w?: number; o?: number; children: React.ReactNode; style?: React.CSSProperties}> = ({x, y, w, o = 1, children, style}) => (
  <div style={{position: 'absolute', left: x, top: y, width: w, opacity: o, ...style}}>{children}</div>
);

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
    <div style={{position: 'absolute', top: 952, left: 300, right: 300, textAlign: 'center', fontFamily: HEAD, fontSize: 44, color: '#fff', WebkitTextStroke: `8px ${C.bg}`, paintOrder: 'stroke fill'}}>
      {ch.map((w, i) => {
        const on = t >= (w[1] as number) && (i === ch.length - 1 || t < (ch[i + 1][1] as number));
        return <span key={i} style={{display: 'inline-block', margin: '0 6px', padding: '0 8px', borderRadius: 10, background: on ? (w[3] === 'hero' ? C.mint : C.amber) : 'transparent', color: on ? C.bg : '#fff', WebkitTextStroke: on ? '0px' : `8px ${C.bg}`}}>{w[0] as string}</span>;
      })}
    </div>
  );
};

// ---------- characters (original, simple outlined round-head style) ----------
type Mood = 'smile' | 'worry' | 'shock' | 'flat';
const Face: React.FC<{mood: Mood}> = ({mood}) => (
  <g>
    <ellipse cx={82} cy={78} rx={6} ry={mood === 'shock' ? 10 : 8} fill={C.ink} />
    <ellipse cx={118} cy={78} rx={6} ry={mood === 'shock' ? 10 : 8} fill={C.ink} />
    {mood === 'smile' && <path d="M84 104 Q100 118 116 104" stroke={C.ink} strokeWidth={5} fill="none" strokeLinecap="round" />}
    {mood === 'worry' && <><path d="M86 112 Q100 102 114 112" stroke={C.ink} strokeWidth={5} fill="none" strokeLinecap="round" /><path d="M72 62 L90 58 M128 62 L110 58" stroke={C.ink} strokeWidth={4} strokeLinecap="round" /></>}
    {mood === 'shock' && <ellipse cx={100} cy={112} rx={9} ry={12} fill={C.ink} />}
    {mood === 'flat' && <path d="M88 108 H112" stroke={C.ink} strokeWidth={5} strokeLinecap="round" />}
  </g>
);
// Ruth: made-up retiree - grey bun, round glasses, purple cardigan
const Ruth: React.FC<{x: number; y: number; h?: number; mood?: Mood; from?: number; shake?: boolean; phone?: boolean}> = ({x, y, h = 420, mood = 'smile', from = 0, shake, phone}) => {
  const f = useCurrentFrame();
  const s = sp(f, from);
  const w = h * (200 / 300);
  const dx = shake ? Math.sin(f * 2.4) * 5 : 0;
  return (
    <svg width={w} height={h} viewBox="0 0 200 300" style={{position: 'absolute', left: x - w / 2 + dx, top: y - h + (1 - s) * 40, opacity: s, overflow: 'visible', filter: 'drop-shadow(0 12px 12px rgba(0,0,0,.35))'}}>
      <path d="M40 300 V200 Q40 150 100 150 Q160 150 160 200 V300 Z" fill="#7b5ea7" stroke={C.ink} strokeWidth={6} />
      <path d="M100 150 V300" stroke="#5d4585" strokeWidth={6} />
      <circle cx={100} cy={84} r={62} fill={C.skin} stroke={C.ink} strokeWidth={6} />
      <path d="M40 80 Q44 20 100 20 Q156 20 160 80 Q140 44 100 46 Q60 44 40 80 Z" fill="#c9ccd3" stroke={C.ink} strokeWidth={5} />
      <circle cx={100} cy={14} r={18} fill="#c9ccd3" stroke={C.ink} strokeWidth={5} />
      <circle cx={82} cy={78} r={15} fill="none" stroke={C.ink} strokeWidth={4} />
      <circle cx={118} cy={78} r={15} fill="none" stroke={C.ink} strokeWidth={4} />
      <path d="M97 78 H103" stroke={C.ink} strokeWidth={4} />
      <Face mood={mood} />
      <circle cx={74} cy={100} r={7} fill="#f3a3a3" opacity={0.6} /><circle cx={126} cy={100} r={7} fill="#f3a3a3" opacity={0.6} />
      {phone && <g><rect x={140} y={60} width={34} height={60} rx={7} fill="#2b3a55" stroke={C.ink} strokeWidth={4} /><rect x={145} y={68} width={24} height={40} rx={3} fill="#9fd8ff" /></g>}
    </svg>
  );
};
// A headset caller (scam crew / call-center worker): faceless-ish, dim hoodie, original design
const Caller: React.FC<{x: number; y: number; h?: number; mood?: Mood; from?: number; dark?: boolean}> = ({x, y, h = 300, mood = 'flat', from = 0, dark}) => {
  const f = useCurrentFrame();
  const s = sp(f, from);
  const w = h * (200 / 300);
  return (
    <svg width={w} height={h} viewBox="0 0 200 300" style={{position: 'absolute', left: x - w / 2, top: y - h + (1 - s) * 30, opacity: s, overflow: 'visible'}}>
      <path d="M36 300 V205 Q36 150 100 150 Q164 150 164 205 V300 Z" fill={dark ? '#1d2638' : '#3b4c6b'} stroke={C.ink} strokeWidth={6} />
      <circle cx={100} cy={84} r={60} fill={dark ? '#556079' : '#d9b08c'} stroke={C.ink} strokeWidth={6} />
      <path d="M40 84 Q40 18 100 18 Q160 18 160 84" fill="none" stroke={C.ink} strokeWidth={9} />
      <rect x={30} y={70} width={20} height={36} rx={8} fill="#222" />
      <rect x={150} y={70} width={20} height={36} rx={8} fill="#222" />
      <path d="M40 104 Q50 132 84 128" stroke="#222" strokeWidth={6} fill="none" />
      <circle cx={86} cy={128} r={6} fill="#222" />
      <Face mood={mood} />
    </svg>
  );
};

const Phone: React.FC<{x: number; y: number; w?: number; ring?: boolean; children?: React.ReactNode; tint?: string}> = ({x, y, w = 300, ring, children, tint = '#13233a'}) => {
  const f = useCurrentFrame();
  const h = w * 1.95;
  const r = ring ? Math.sin(f * 1.7) * 4 : 0;
  return (
    <div style={{position: 'absolute', left: x - w / 2, top: y, width: w, height: h, transform: `rotate(${r}deg)`, background: '#1b2333', border: `8px solid ${C.ink}`, borderRadius: w * 0.14, boxShadow: '0 20px 40px rgba(0,0,0,.45)'}}>
      <div style={{position: 'absolute', inset: 14, borderRadius: w * 0.1, background: tint, overflow: 'hidden', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center'}}>{children}</div>
      {ring && [0, 1, 2].map((i) => {
        const p = ((f + i * 10) % 30) / 30;
        return <div key={i} style={{position: 'absolute', left: -40 - p * 60, top: h * 0.35 - p * 40, width: 30 + p * 60, height: 80 + p * 80, border: `5px solid ${C.amber}`, borderRight: 'none', borderTop: 'none', borderBottom: 'none', borderRadius: '50%', opacity: 1 - p}} />;
      })}
    </div>
  );
};

const Bubble: React.FC<{x: number; y: number; o: number; children: React.ReactNode; bg?: string; color?: string; size?: number; w?: number}> = ({x, y, o, children, bg = C.cream, color = C.bg, size = 40, w}) => (
  <div style={{position: 'absolute', left: x, top: y, width: w, opacity: o, transform: `scale(${0.8 + 0.2 * o})`, transformOrigin: 'left bottom', background: bg, color, fontFamily: HEAD, fontSize: size, padding: '14px 26px', borderRadius: 26, borderBottomLeftRadius: 6, boxShadow: '0 10px 24px rgba(0,0,0,.35)'}}>{children}</div>
);

// ---------- scenes ----------
const ColdOpen: React.FC = () => {
  const f = useCurrentFrame();
  const ringing = f < cx('pick');
  const ended = f >= cx('click0');
  const tick = f >= cx('three0') ? '3' : f >= cx('two0') ? '2' : f >= cx('one') ? '1' : '';
  return (
    <AbsoluteFill>
      {/* night window */}
      <div style={{position: 'absolute', left: 120, top: 120, width: 360, height: 420, background: 'linear-gradient(#0a1424, #1a2d4a)', border: `10px solid ${C.ink}`, borderRadius: 12}}>
        <div style={{position: 'absolute', left: 230, top: 50, width: 70, height: 70, borderRadius: 35, background: '#f6eccb', boxShadow: '0 0 40px #f6eccb'}} />
        <div style={{position: 'absolute', left: 170, top: 0, width: 10, height: '100%', background: C.ink}} /><div style={{position: 'absolute', top: 200, left: 0, width: '100%', height: 10, background: C.ink}} />
      </div>
      <div style={{position: 'absolute', left: 0, right: 0, top: 830, height: 20, background: '#4a3423', borderTop: `6px solid ${C.ink}`}} />
      <Phone x={820} y={150} w={330} ring={ringing} tint={ended ? '#3a1620' : '#13233a'}>
        {!ended ? (
          <>
            <div style={{fontFamily: BODY, fontWeight: 700, fontSize: 26, color: C.muted}}>{f < cx('pick') ? 'incoming call' : 'connected'}</div>
            <div style={{fontFamily: HEAD, fontSize: 38, color: C.cream, marginTop: 10, opacity: fade(f, cx('unknown'))}}>UNKNOWN<br />NUMBER</div>
            <div style={{fontFamily: HEAD, fontSize: 120, color: C.amber, marginTop: 30, height: 140}}>{tick}</div>
            <div style={{fontFamily: BODY, fontWeight: 700, fontSize: 26, color: C.muted, opacity: fade(f, cx('one'))}}>...silence...</div>
          </>
        ) : (
          <>
            <div style={{fontFamily: HEAD, fontSize: 46, color: C.red}}>CALL<br />ENDED</div>
            <div style={{fontFamily: BODY, fontWeight: 700, fontSize: 30, color: C.cream, marginTop: 16}}>0:03</div>
          </>
        )}
      </Phone>
      <Bubble x={1060} y={260} o={fade(f, cx('hello0'), 6)} size={64}>Hello?</Bubble>
      <Abs x={1060} y={430} o={fade(f, cx('click0'), 4)}><div style={{fontFamily: HEAD, fontSize: 80, color: C.red, transform: 'rotate(-6deg)'}}>*click*</div></Abs>
      {f >= cx('who') - 6 && <Hero pose="shock_shock" x={1620} y={940} h={600} from={cx('who') - 6} shake />}
    </AbsoluteFill>
  );
};

const PATH = [
  {k: 'silent', label: 'the silent ring'},
  {k: 'text', label: 'the second call'},
  {k: 'move', label: 'the transfer'},
  {k: 'empty', label: 'the empty account'},
];
const PathIcon: React.FC<{k: string; s?: number; bad?: boolean}> = ({k, s = 110, bad}) => {
  const col = bad ? C.red : C.cream;
  const v = (el: React.ReactNode) => <svg width={s} height={s} viewBox="0 0 100 100">{el}</svg>;
  if (k === 'silent') return v(<g><rect x={30} y={10} width={40} height={80} rx={8} fill="none" stroke={col} strokeWidth={6} /><text x={50} y={60} fontSize={30} textAnchor="middle" fill={col} fontFamily="Archivo Black">...</text></g>);
  if (k === 'text') return v(<g><path d="M14 20 H86 V66 H44 L26 84 V66 H14 Z" fill="none" stroke={col} strokeWidth={6} strokeLinejoin="round" /><text x={50} y={54} fontSize={34} textAnchor="middle" fill={col} fontFamily="Archivo Black">!</text></g>);
  if (k === 'move') return v(<g><circle cx={30} cy={50} r={18} fill="none" stroke={col} strokeWidth={6} /><text x={30} y={60} fontSize={26} textAnchor="middle" fill={col} fontFamily="Archivo Black">$</text><path d="M54 50 H90 M76 36 L90 50 L76 64" stroke={col} strokeWidth={7} fill="none" strokeLinecap="round" /></g>);
  return v(<g><path d="M14 40 L50 16 L86 40 Z" fill="none" stroke={col} strokeWidth={6} strokeLinejoin="round" /><rect x={20} y={44} width={60} height={8} fill={col} />{[26, 44, 62].map((xx) => <rect key={xx} x={xx} y={56} width={10} height={24} fill={col} />)}<rect x={14} y={82} width={72} height={8} fill={col} /></g>);
};

const Hook: React.FC = () => {
  const f = useCurrentFrame();
  const n = interpolate(f, [cx('b159') - 4, cx('b159') + 24], [0, 15.9], clamp);
  return (
    <AbsoluteFill>
      <Abs x={0} y={110} w={1920} style={{textAlign: 'center'}}>
        <Pill o={fade(f, cx('filter'))} bg={C.panel2} color={C.cream} size={40} style={{transformOrigin: 'center'}}>The silence isn't the scam. <span style={{color: C.amber}}>It's the filter.</span></Pill>
      </Abs>
      <Abs x={0} y={230} w={1920} o={fade(f, cx('b159') - 4)} style={{textAlign: 'center'}}>
        <div style={{fontFamily: HEAD, fontSize: 190, color: C.red, lineHeight: 1}}>${n.toFixed(1)} BILLION</div>
        <div style={{fontFamily: BODY, fontWeight: 700, fontSize: 40, color: C.cream, marginTop: 8}}>reported lost to fraud by Americans in 2025 · a record (FTC)</div>
      </Abs>
      <Abs x={0} y={520} w={1920} style={{textAlign: 'center'}}>
        <Pill o={fade(f, cx('day'))} size={48} style={{transformOrigin: 'center'}}>= about $43.6 MILLION A DAY</Pill>
      </Abs>
      <div style={{position: 'absolute', top: 680, left: 230, right: 230, display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
        {PATH.map((p, i) => {
          const o = fade(f, cx('follow') + i * 12);
          const last = i === PATH.length - 1;
          return (
            <React.Fragment key={p.k}>
              <div style={{textAlign: 'center', opacity: o, transform: `translateY(${(1 - o) * 20}px)`}}>
                <div style={{background: C.panel, border: `4px solid ${last && f >= cx('empty') ? C.red : C.slate}`, borderRadius: 24, padding: 14}}><PathIcon k={p.k} s={100} bad={last && f >= cx('empty')} /></div>
                <div style={{fontFamily: BODY, fontWeight: 700, fontSize: 28, color: C.cream, marginTop: 8}}>{p.label}</div>
              </div>
              {!last && <div style={{flex: 1, height: 6, margin: '0 20px 40px', background: C.slate, opacity: fade(f, cx('follow') + i * 12 + 8)}} />}
            </React.Fragment>
          );
        })}
      </div>
      <Abs x={1420} y={570} o={fade(f, cx('small'))}><div style={{fontFamily: BODY, fontWeight: 700, fontStyle: 'italic', fontSize: 40, color: C.amber, transform: 'rotate(-4deg)'}}>...and it's too small?</div></Abs>
    </AbsoluteFill>
  );
};

const CHAPTERS = [
  {k: 'ch1', n: 1, title: 'The Silent Ring'},
  {k: 'ch2', n: 2, title: 'The Machine in the Back Room'},
  {k: 'ch3', n: 3, title: 'The Second Call'},
  {k: 'ch4', n: 4, title: 'Moving the Money'},
  {k: 'ch5', n: 5, title: 'The $15.9 Billion Ledger'},
  {k: 'ch6', n: 6, title: 'Never Ever'},
];
const ChapterCard: React.FC = () => {
  const f = useCurrentFrame();
  const c = CHAPTERS.find((ch) => f >= cx(ch.k) - 6 && f < cx(ch.k) + 66);
  if (!c) return null;
  const a = cx(c.k) - 6;
  const o = Math.min(fade(f, a, 6), 1 - fade(f, a + 62, 10));
  return (
    <AbsoluteFill style={{background: 'rgba(8,14,26,0.92)', opacity: o, alignItems: 'center', justifyContent: 'center'}}>
      <div style={{fontFamily: HEAD, fontSize: 40, letterSpacing: 10, color: C.amber}}>CHAPTER {c.n}</div>
      <div style={{fontFamily: HEAD, fontSize: 104, color: C.cream, marginTop: 10}}>{c.title}</div>
      <div style={{height: 8, width: 700 * fade(f, a + 6, 20), background: C.amber, borderRadius: 4, marginTop: 20}} />
    </AbsoluteFill>
  );
};

const RuthScene: React.FC = () => {
  const f = useCurrentFrame();
  const late = f >= cx('dinner') - 6;
  const worried = f >= cx('keeps');
  return (
    <AbsoluteFill>
      {/* living room: lamp glow, sofa, window */}
      <div style={{position: 'absolute', left: 140, top: 140, width: 300, height: 330, background: 'linear-gradient(#0b1626, #1d3150)', border: `10px solid ${C.ink}`, borderRadius: 10}} />
      <div style={{position: 'absolute', left: 860, top: 120, width: 420, height: 420, borderRadius: 210, background: 'radial-gradient(circle, rgba(242,181,68,.28), rgba(242,181,68,0) 70%)'}} />
      <div style={{position: 'absolute', left: 1030, top: 220, width: 80, height: 60, background: C.amber, clipPath: 'polygon(20% 0, 80% 0, 100% 100%, 0 100%)'}} /><div style={{position: 'absolute', left: 1066, top: 280, width: 8, height: 500, background: C.ink}} />
      <div style={{position: 'absolute', left: 420, top: 640, width: 560, height: 190, background: '#7a3e3e', border: `8px solid ${C.ink}`, borderRadius: 40}} />
      <div style={{position: 'absolute', left: 0, right: 0, top: 830, height: 20, background: '#4a3423', borderTop: `6px solid ${C.ink}`}} />
      <Ruth x={700} y={800} h={470} mood={worried ? 'worry' : 'smile'} from={cx('ruth') - 6} phone={worried} />
      <Abs x={140} y={520} o={fade(f, cx('madeup'))}><Pill o={1} bg={C.panel2} color={C.cream} size={30}>RUTH · <span style={{color: C.amber}}>made-up character</span></Pill></Abs>
      {/* package */}
      <Abs x={1180} y={690} o={fade(f, cx('package'))}>
        <svg width={150} height={130} viewBox="0 0 150 130"><rect x={5} y={20} width={140} height={105} fill="#c9935a" stroke={C.ink} strokeWidth={6} /><rect x={65} y={20} width={20} height={105} fill="#e2c08f" /><rect x={5} y={10} width={140} height={22} fill="#b47e45" stroke={C.ink} strokeWidth={6} /></svg>
        <div style={{fontFamily: BODY, fontWeight: 700, fontSize: 26, color: C.cream}}>holiday package?</div>
      </Abs>
      {!late && [['h1', 'Hello?'], ['sil1', '...'], ['clk1', '*click*']].map(([k, t], i) => (
        <Bubble key={k} x={1380} y={180 + i * 150} o={fade(f, cx(k), 6)} size={52} bg={k === 'clk1' ? C.red : C.cream} color={k === 'clk1' ? '#fff' : C.bg}>{t}</Bubble>
      ))}
      {late && [['dinner', 'at dinner'], ['show', 'during her show'], ['area', 'a "local" number'], ['driver', 'the delivery driver?'], ['grandson', 'her grandson?']].map(([k, t], i) => (
        <Bubble key={k} x={1360} y={130 + i * 118} o={fade(f, cx(k), 6)} size={38} bg={i > 2 ? C.amber : C.panel2} color={i > 2 ? C.bg : C.cream}>{t}</Bubble>
      ))}
    </AbsoluteFill>
  );
};

const DialerScene: React.FC = () => {
  const f = useCurrentFrame();
  const phones = [0, 1, 2, 3, 4];
  const st = (i: number) => (f >= cx('waiting') && (i === 2 || i === 4) ? 'wait' : f >= cx('hung') && (i === 0 || i === 3) ? 'hung' : f >= cx('first') && i === 1 ? 'won' : f >= cx('several') ? 'dial' : 'off');
  const mx = 860, my = 470;
  return (
    <AbsoluteFill>
      <svg width={1920} height={1080} style={{position: 'absolute'}}>
        {phones.map((i) => {
          const s = st(i);
          if (s === 'off') return null;
          const py = 150 + i * 150;
          return <line key={i} x1={mx + 170} y1={my} x2={1380} y2={py + 50} stroke={s === 'won' ? C.mint : s === 'hung' ? C.red : s === 'wait' ? C.amber : C.slate} strokeWidth={s === 'won' ? 10 : 6} strokeDasharray={s === 'dial' ? '16 12' : undefined} strokeDashoffset={-f * 3} />;
        })}
        {f >= cx('first') && <line x1={mx - 170} y1={my} x2={470} y2={560} stroke={C.mint} strokeWidth={10} />}
      </svg>
      <Abs x={110} y={110} o={fade(f, 0)}><div style={{fontFamily: HEAD, fontSize: 48, color: C.cream}}>WHAT THE SILENCE USUALLY IS</div></Abs>
      {/* the dialer machine */}
      <div style={{position: 'absolute', left: mx - 170, top: my - 130, width: 340, height: 260, background: '#203250', border: `8px solid ${C.ink}`, borderRadius: 24, opacity: fade(f, cx('dialer') - 4), display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center'}}>
        <div style={{display: 'flex', gap: 10}}>{[0, 1, 2, 3].map((i) => <div key={i} style={{width: 34, height: 34, borderRadius: 17, background: (Math.floor(f / 6) + i) % 4 === 0 ? C.mint : '#35507a'}} />)}</div>
        <div style={{fontFamily: HEAD, fontSize: 34, color: C.cream, marginTop: 18, textAlign: 'center', lineHeight: 1.1}}>PREDICTIVE<br />DIALER</div>
      </div>
      {/* one free salesperson */}
      <Caller x={380} y={800} h={340} from={cx('free') - 6} mood={f >= cx('first') ? 'smile' : 'flat'} />
      <Abs x={220} y={820} o={fade(f, cx('free'))}><Pill o={1} bg={C.panel2} color={C.cream} size={28}>1 free salesperson</Pill></Abs>
      {phones.map((i) => {
        const s = st(i);
        const py = 150 + i * 150;
        return (
          <div key={i} style={{position: 'absolute', left: 1380, top: py, display: 'flex', alignItems: 'center', gap: 18, opacity: fade(f, cx('several') + i * 4)}}>
            <div style={{width: 60, height: 100, background: '#1b2333', border: `6px solid ${C.ink}`, borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
              <div style={{width: 30, height: 56, borderRadius: 4, background: s === 'won' ? C.mint : s === 'hung' ? C.red : s === 'wait' ? C.amber : '#9fd8ff'}} />
            </div>
            <div style={{fontFamily: HEAD, fontSize: 34, color: s === 'won' ? C.mint : s === 'hung' ? C.red : s === 'wait' ? C.amber : C.muted}}>
              {s === 'won' ? 'connected' : s === 'hung' ? 'hung up on' : s === 'wait' ? '...silence' : 'ringing'}
            </div>
          </div>
        );
      })}
      <Abs x={560} y={200} o={fade(f, cx('several'))} w={640} style={{textAlign: 'center'}}><div style={{fontFamily: BODY, fontWeight: 700, fontSize: 32, color: C.cream}}>calls several people at once<br /><span style={{color: C.amber}}>for every salesperson who is free</span></div></Abs>
    </AbsoluteFill>
  );
};

const RulesScene: React.FC = () => {
  const f = useCurrentFrame();
  const t2 = cx('twosec');
  const sweep = interpolate(f, [t2, t2 + 60], [0, 359.5], clamp);
  const heroOn = f >= SEG[6] - 6;
  const rules: [string, React.ReactNode][] = [
    ['pct3', <>Max <b style={{color: C.amber}}>3%</b> of calls abandoned per campaign</>],
    ['rings', <>Ring <b style={{color: C.amber}}>15 seconds</b> or <b style={{color: C.amber}}>4 rings</b></>],
    ['msg', <>Nobody free? Play a message: <b style={{color: C.amber}}>seller's name + number</b></>],
  ];
  return (
    <AbsoluteFill>
      <Abs x={110} y={110} o={fade(f, cx('rules'))}>
        <div style={{fontFamily: HEAD, fontSize: 54, color: C.cream}}>THE RULES <span style={{color: C.muted}}>(for real telemarketers)</span></div>
        <div style={{fontFamily: BODY, fontWeight: 700, fontSize: 32, color: C.amber, opacity: fade(f, cx('tsr'))}}>FTC Telemarketing Sales Rule</div>
      </Abs>
      {/* stopwatch */}
      <Abs x={150} y={290} o={fade(f, cx('abandoned'))}>
        <svg width={380} height={380} viewBox="0 0 200 200">
          <rect x={88} y={4} width={24} height={18} rx={4} fill={C.cream} />
          <circle cx={100} cy={112} r={80} fill={C.panel} stroke={C.cream} strokeWidth={10} />
          <path d={`M100 112 L100 32 A80 80 0 ${sweep > 180 ? 1 : 0} 1 ${100 + 80 * Math.sin((sweep * Math.PI) / 180)} ${112 - 80 * Math.cos((sweep * Math.PI) / 180)} Z`} fill={C.red} opacity={0.8} />
          <text x={100} y={128} textAnchor="middle" fontFamily="Archivo Black" fontSize={44} fill={C.cream}>{f >= t2 ? '2 s' : ''}</text>
        </svg>
      </Abs>
      <Abs x={560} y={330} w={heroOn ? 760 : 1200} o={fade(f, cx('abandoned'))}>
        <div style={{fontFamily: BODY, fontWeight: 700, fontSize: 38, color: C.cream, lineHeight: 1.3}}>A call is <span style={{color: C.red}}>"abandoned"</span> if you answer and no live person comes on within</div>
        <div style={{fontFamily: HEAD, fontSize: 96, color: C.red, opacity: fade(f, t2)}}>2 SECONDS</div>
      </Abs>
      <div style={{position: 'absolute', left: 560, top: 640, width: heroOn ? 760 : 1200}}>
        {rules.map(([k, t]) => (
          <div key={k} style={{opacity: fade(f, cx(k)), transform: `translateX(${(1 - fade(f, cx(k))) * 30}px)`, fontFamily: BODY, fontWeight: 700, fontSize: 34, color: C.cream, marginBottom: 16, display: 'flex', gap: 14}}>
            <span style={{color: C.mint}}>✓</span><span>{t}</span>
          </div>
        ))}
      </div>
      {heroOn && <Hero pose="think_talk" x={1640} y={1000} h={600} from={SEG[6] - 6} flip />}
    </AbsoluteFill>
  );
};

const SortScene: React.FC = () => {
  const f = useCurrentFrame();
  const s0 = cx('sorting');
  const nums = Array.from({length: 9}, (_, i) => i);
  return (
    <AbsoluteFill>
      <Abs x={140} y={130} o={fade(f, cx('realbiz'))}>
        <div style={{background: C.panel, border: `4px solid ${C.slate}`, borderRadius: 24, padding: '24px 34px', width: 520}}>
          <div style={{fontFamily: HEAD, fontSize: 40, color: C.cream}}>RULE BOOK</div>
          <div style={{fontFamily: BODY, fontWeight: 700, fontSize: 30, color: C.muted}}>2 seconds · 3% · 4 rings · message</div>
        </div>
        <div style={{position: 'absolute', left: -20, top: 60, width: 640, height: 12, background: C.red, transform: 'rotate(-12deg)', opacity: fade(f, cx('dontfollow'))}} />
        <div style={{fontFamily: HEAD, fontSize: 40, color: C.red, marginTop: 20, opacity: fade(f, cx('dontfollow'))}}>scammers: no rules</div>
      </Abs>
      {/* sorting machine */}
      <div style={{position: 'absolute', left: 900, top: 180, opacity: fade(f, s0 - 4)}}>
        <svg width={520} height={560} viewBox="0 0 520 560">
          <path d="M60 40 H460 L330 230 V330 H190 V230 Z" fill="#203250" stroke={C.ink} strokeWidth={8} />
          <rect x={150} y={330} width={220} height={120} rx={14} fill="#2c4470" stroke={C.ink} strokeWidth={8} />
          <text x={260} y={402} textAnchor="middle" fontFamily="Archivo Black" fontSize={34} fill={C.cream}>SORTER</text>
          <path d="M260 450 V520" stroke={C.amber} strokeWidth={10} />
        </svg>
        {nums.map((i) => {
          const t = (f - s0 - i * 9) % 80;
          if (f < s0 + i * 9) return null;
          const y = interpolate(t, [0, 60], [-60, 260], clamp);
          return <div key={i} style={{position: 'absolute', left: 150 + ((i * 53) % 120), top: y, whiteSpace: 'nowrap', fontFamily: HEAD, fontSize: 24, color: C.cream, opacity: t < 60 ? 1 : 0}}>{`•••-•••-${String(1000 + ((i * 1913) % 9000)).slice(0, 4)}`}</div>;
        })}
        <div style={{position: 'absolute', left: 150, top: 540, opacity: fade(f, cx('live'))}}><Pill o={1} bg={C.amber} size={40}>"LIVE"?</Pill></div>
      </div>
      <Abs x={140} y={520} w={700} o={fade(f, cx('experts'))}>
        <div style={{fontFamily: BODY, fontWeight: 700, fontSize: 36, color: C.cream, lineHeight: 1.3}}>Some security experts warn: answering <span style={{color: C.amber}}>may</span> tell the caller your number is live.</div>
        <div style={{fontFamily: BODY, fontWeight: 700, fontStyle: 'italic', fontSize: 30, color: C.muted, marginTop: 14, opacity: fade(f, cx('prove'))}}>Not provable for any one number.</div>
      </Abs>
      <Abs x={140} y={790} o={fade(f, cx('data'))}><Pill o={1} bg={C.panel2} color={C.cream} size={34}>What happens next → <span style={{color: C.mint}}>the FTC's data</span></Pill></Abs>
    </AbsoluteFill>
  );
};

const SecondCall: React.FC = () => {
  const f = useCurrentFrame();
  const callOn = f >= cx('call3');
  const stats: [string, string, string][] = [
    ['nine', '#1', 'reported scam · 9 years in a row'],
    ['million1', '1M+', 'imposter reports in 2025'],
    ['b35', '$3.5B+', 'lost to imposters in 2025'],
    ['onein3', '~1 in 3', 'fraud reports was an imposter'],
  ];
  return (
    <AbsoluteFill>
      <Phone x={330} y={120} w={330} tint={callOn ? '#14301f' : '#13233a'}>
        {!callOn ? (
          <div style={{opacity: fade(f, cx('text3')), padding: 18}}>
            <div style={{fontFamily: BODY, fontWeight: 700, fontSize: 22, color: C.muted, marginBottom: 10}}>new message</div>
            <div style={{background: C.cream, color: C.bg, fontFamily: BODY, fontWeight: 700, fontSize: 26, borderRadius: 18, padding: 16, textAlign: 'left'}}><b style={{color: C.red}}>ALERT:</b> unusual activity on your account. Call us now.</div>
            <div style={{fontFamily: BODY, fontSize: 18, color: C.muted, marginTop: 8}}>(made-up example)</div>
          </div>
        ) : (
          <>
            <div style={{fontFamily: BODY, fontWeight: 700, fontSize: 24, color: C.muted}}>incoming call</div>
            <div style={{fontFamily: HEAD, fontSize: 34, color: C.cream, marginTop: 8, lineHeight: 1.1}}>"BANK FRAUD<br />DEPT."</div>
            <div style={{fontFamily: HEAD, fontSize: 90, color: C.amber}}>?</div>
          </>
        )}
      </Phone>
      <Caller x={720} y={760} h={330} dark from={cx('bankvoice') - 6} mood="smile" />
      <Abs x={560} y={790} o={fade(f, cx('fast'))}><Bubble x={0} y={0} o={1} size={34} bg={C.red} color="#fff" w={300}>"Act fast!"</Bubble></Abs>
      <Abs x={1000} y={110} o={fade(f, cx('trick'))}><div style={{fontFamily: HEAD, fontSize: 56, color: C.cream}}>IMPOSTER SCAMS</div></Abs>
      <div style={{position: 'absolute', left: 1000, top: 200, width: 820}}>
        {stats.map(([k, big, small]) => {
          const o = fade(f, cx(k));
          return (
            <div key={k} style={{display: 'flex', alignItems: 'center', gap: 24, opacity: o, transform: `translateX(${(1 - o) * 40}px)`, background: C.panel, border: `4px solid ${C.slate}`, borderRadius: 22, padding: '12px 24px', marginBottom: 16}}>
              <div style={{fontFamily: HEAD, fontSize: 60, color: k === 'b35' ? C.red : C.amber, width: 250}}>{big}</div>
              <div style={{fontFamily: BODY, fontWeight: 700, fontSize: 32, color: C.cream}}>{small}</div>
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

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

const SoftCTA: React.FC = () => {
  const f = useCurrentFrame();
  const a = SEG[9];
  return (
    <AbsoluteFill>
      <Abs x={160} y={220}><div style={{fontFamily: HEAD, fontSize: 80, color: C.cream, lineHeight: 1.05, opacity: fade(f, a)}}>Already surprised?</div></Abs>
      <SubButton at={cx('sub1')} x={160} y={400} size={70} />
      <Abs x={160} y={600} o={fade(f, a + 50)}><div style={{fontFamily: HEAD, fontSize: 54, color: C.amber}}>...the next part gets worse.</div></Abs>
      <Hero pose="point_talk" x={1520} y={1000} h={680} from={a - 4} flip />
    </AbsoluteFill>
  );
};

const Impersonators: React.FC = () => {
  const f = useCurrentFrame();
  const W = 600;
  const bars: [string, string, number, string, string][] = [
    ['biz', 'Business impersonators', 1.0, 'nearly $1B', C.coral],
    ['gov', 'Government impersonators', 0.92, 'about $920M', C.amber],
  ];
  return (
    <AbsoluteFill>
      <Abs x={120} y={110} o={fade(f, cx('costliest'))}>
        <div style={{fontFamily: HEAD, fontSize: 50, color: C.cream}}>WHO THEY PRETEND TO BE <span style={{color: C.muted, fontSize: 34}}>· reported losses, 2025</span></div>
        <div style={{fontFamily: BODY, fontWeight: 700, fontSize: 32, color: C.amber, marginTop: 6}}>FTC: the costliest scams often start with a fake bank security alert</div>
      </Abs>
      <div style={{position: 'absolute', left: 120, top: 290}}>
        {bars.map(([k, n, v, l, col]) => {
          const g = interpolate(f, [cx(k) - 2, cx(k) + 20], [0, 1], clamp);
          return (
            <div key={k} style={{marginBottom: 40, opacity: fade(f, cx(k) - 4)}}>
              <div style={{fontFamily: BODY, fontWeight: 700, fontSize: 36, color: C.cream}}>{n}</div>
              <div style={{display: 'flex', alignItems: 'center', gap: 24, marginTop: 8}}>
                <div style={{height: 70, width: W * v * g, background: col, borderRadius: 14}} />
                <div style={{fontFamily: HEAD, fontSize: 52, color: col, opacity: fade(f, cx(k) + 14)}}>{l}</div>
              </div>
            </div>
          );
        })}
      </div>
      <Abs x={120} y={590} o={fade(f, cx('bankimp'))}><Pill o={1} bg={C.panel2} color={C.cream} size={30}>costliest of the business imposters: <span style={{color: C.coral}}>fake banks</span></Pill></Abs>
      {/* toll text */}
      <Abs x={1310} y={250} o={fade(f, cx('p40'))}>
        <div style={{fontFamily: HEAD, fontSize: 110, color: C.red, lineHeight: 1}}>+40%</div>
        <div style={{fontFamily: BODY, fontWeight: 700, fontSize: 30, color: C.cream, width: 480}}>government-imposter reports (FTC alert, May 2026)</div>
      </Abs>
      <Abs x={1310} y={480} o={fade(f, cx('tolls'))}>
        <div style={{background: C.cream, color: C.bg, fontFamily: BODY, fontWeight: 700, fontSize: 30, borderRadius: 20, borderBottomLeftRadius: 6, padding: '16px 22px', width: 460}}>"Unpaid toll. Pay now to avoid a fee." <span style={{color: C.slate, fontSize: 22}}>(made-up example)</span></div>
      </Abs>
      <Abs x={120} y={720} o={fade(f, cx('texts'))}><Pill o={1} bg={C.amber} size={38}>#1 reported first contact: TEXT MESSAGES</Pill></Abs>
    </AbsoluteFill>
  );
};

const MoveMoney: React.FC = () => {
  const f = useCurrentFrame();
  const flow = f >= cx('leaves');
  return (
    <AbsoluteFill>
      <Ruth x={330} y={820} h={440} mood="worry" from={cx('ch4') + 60} phone shake={f >= cx('shaking') && f < cx('leaves')} />
      <Bubble x={460} y={170} o={fade(f, cx('donthang'), 6)} size={38} bg={C.red} color="#fff">"Don't hang up."</Bubble>
      <Bubble x={460} y={270} o={fade(f, cx('branch'), 6)} size={38} bg={C.red} color="#fff">"Don't tell anyone at the branch."</Bubble>
      {/* savings vault */}
      <Abs x={640} y={430} o={fade(f, cx('savings') - 4)}>
        <svg width={240} height={240} viewBox="0 0 100 100"><rect x={8} y={8} width={84} height={84} rx={10} fill="#3a4f74" stroke={C.ink} strokeWidth={5} /><circle cx={50} cy={50} r={24} fill="none" stroke={C.cream} strokeWidth={5} /><path d="M50 26 V74 M26 50 H74" stroke={C.cream} strokeWidth={4} /></svg>
        <div style={{fontFamily: BODY, fontWeight: 700, fontSize: 28, color: C.cream, textAlign: 'center'}}>Ruth's savings</div>
      </Abs>
      {flow && [0, 1, 2, 3, 4].map((i) => {
        const p = ((f - cx('leaves') + i * 9) % 45) / 45;
        return <div key={i} style={{position: 'absolute', left: 900 + p * 360, top: 520 - Math.sin(p * Math.PI) * 60, fontFamily: HEAD, fontSize: 44, color: C.mint, opacity: 1 - p}}>$</div>;
      })}
      <Abs x={1230} y={150} o={fade(f, cx('paymeth'))}><div style={{fontFamily: HEAD, fontSize: 40, color: C.cream, width: 600}}>HIGHEST-LOSS PAYMENT METHODS <span style={{color: C.muted, fontSize: 28}}>(FTC, 2025)</span></div></Abs>
      {[['bankpay', '#1', 'BANK PAYMENTS', C.red], ['crypto', '#2', 'CRYPTOCURRENCY', C.coral]].map(([k, r, n, col], i) => (
        <div key={k} style={{position: 'absolute', left: 1230, top: 330 + i * 170, display: 'flex', alignItems: 'center', gap: 20, opacity: fade(f, cx(k)), transform: `scale(${0.9 + 0.1 * fade(f, cx(k))})`}}>
          <div style={{background: col, color: '#fff', fontFamily: HEAD, fontSize: 56, borderRadius: 18, padding: '6px 22px'}}>{r}</div>
          <div style={{fontFamily: HEAD, fontSize: 42, color: C.cream}}>{n}</div>
        </div>
      ))}
    </AbsoluteFill>
  );
};

const Investment: React.FC = () => {
  const f = useCurrentFrame();
  const heroOn = f >= SEG[13] - 6;
  const part = interpolate(f, [cx('b79') - 4, cx('b79') + 26], [0, 7.9 / 15.9], clamp);
  const R = 170, Cc = 2 * Math.PI * R;
  return (
    <AbsoluteFill>
      <Abs x={120} y={110} o={fade(f, cx('biggest'))}><div style={{fontFamily: HEAD, fontSize: 50, color: C.cream}}>THE BIGGEST LOSSES: <span style={{color: C.red, opacity: fade(f, cx('invest'))}}>INVESTMENT SCAMS</span></div></Abs>
      <div style={{position: 'absolute', left: 170, top: 300, opacity: fade(f, cx('invest') - 4)}}>
        <svg width={460} height={460} viewBox="0 0 460 460">
          <circle cx={230} cy={230} r={R} fill="none" stroke={C.panel2} strokeWidth={70} />
          <circle cx={230} cy={230} r={R} fill="none" stroke={C.red} strokeWidth={70} strokeDasharray={`${Cc * part} ${Cc}`} transform="rotate(-90 230 230)" />
          <text x={230} y={222} textAnchor="middle" fontFamily="Archivo Black" fontSize={58} fill={C.red}>$7.9B+</text>
          <text x={230} y={268} textAnchor="middle" fontFamily="Fira Sans" fontWeight={700} fontSize={26} fill={C.cream}>of $15.9B (2025)</text>
        </svg>
        <div style={{textAlign: 'center', fontFamily: HEAD, fontSize: 42, color: C.amber, opacity: fade(f, cx('half'))}}>about HALF</div>
      </div>
      <div style={{position: 'absolute', left: 760, top: 340, width: heroOn ? 760 : 1000}}>
        <div style={{opacity: fade(f, cx('avg')), background: C.panel, border: `4px solid ${C.slate}`, borderRadius: 22, padding: '18px 28px', marginBottom: 24}}>
          <div style={{fontFamily: BODY, fontWeight: 700, fontSize: 30, color: C.muted}}>average investment-scam loss</div>
          <div style={{fontFamily: HEAD, fontSize: 70, color: C.cream, opacity: fade(f, cx('k10'))}}>$10,000+</div>
        </div>
        <div style={{opacity: fade(f, cx('contact')), background: C.panel, border: `4px solid ${C.slate}`, borderRadius: 22, padding: '18px 28px'}}>
          <div style={{fontFamily: BODY, fontWeight: 700, fontSize: 30, color: C.muted}}>contact method with the highest losses</div>
          <div style={{fontFamily: HEAD, fontSize: 58, color: C.coral, opacity: fade(f, cx('social'))}}>SOCIAL MEDIA <span style={{color: C.cream, opacity: fade(f, cx('b2'))}}>$2B+</span></div>
        </div>
      </div>
      {heroOn && <Hero pose="shrug_talk" x={1680} y={1000} h={560} from={SEG[13] - 6} flip />}
    </AbsoluteFill>
  );
};

const Chain: React.FC = () => {
  const f = useCurrentFrame();
  const steps: [string, string, string, string][] = [
    ['checks', 'silent', 'THE SILENT CALL', 'checks who picks up'],
    ['builds', 'text', 'THE TEXT / 2ND CALL', 'builds the story'],
    ['transfer', 'move', 'THE TRANSFER', 'the money disappears'],
  ];
  return (
    <AbsoluteFill>
      <Abs x={0} y={140} w={1920} style={{textAlign: 'center'}}><div style={{fontFamily: HEAD, fontSize: 60, color: C.cream, opacity: fade(f, SEG[14])}}>THE CALL IS JUST THE DOOR</div></Abs>
      <div style={{position: 'absolute', left: 150, right: 150, top: 330, display: 'flex', justifyContent: 'space-between'}}>
        {steps.map(([k, ic, t, d], i) => {
          const o = fade(f, cx(k) - 4);
          return (
            <div key={k} style={{width: 480, opacity: o, transform: `translateY(${(1 - o) * 30}px)`, background: C.panel, border: `5px solid ${i === 2 ? C.red : C.slate}`, borderRadius: 28, padding: 30, textAlign: 'center'}}>
              <div style={{fontFamily: HEAD, fontSize: 30, color: C.amber}}>STEP {i + 1}</div>
              <div style={{display: 'flex', justifyContent: 'center', margin: '14px 0'}}><PathIcon k={ic} s={130} bad={i === 2} /></div>
              <div style={{fontFamily: HEAD, fontSize: 38, color: C.cream}}>{t}</div>
              <div style={{fontFamily: BODY, fontWeight: 700, fontSize: 32, color: i === 2 ? C.red : C.muted, marginTop: 6}}>{d}</div>
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

const Ledger: React.FC = () => {
  const f = useCurrentFrame();
  const yrs: [string, number, string, string][] = [['2021', 6, '>$6B', 'b6'], ['2022', 9, '~$9B', 'b9'], ['2023', 10, '>$10B', 'b10'], ['2024', 12, '>$12B', 'b12'], ['2025', 15.9, '$15.9B', 'lost159']];
  const H = 460 / 15.9;
  return (
    <AbsoluteFill>
      <div style={{position: 'absolute', left: 110, top: 110, display: 'flex', gap: 22}}>
        {[['reports3', '3M', 'fraud reports (2025)'], ['lost159', '$15.9B', 'reported lost'], ['p25', '+~25%', 'vs 2024 (2.6M reports)']].map(([k, b, s]) => (
          <div key={k} style={{opacity: fade(f, cx(k)), background: C.panel, border: `4px solid ${C.slate}`, borderRadius: 20, padding: '10px 22px'}}>
            <div style={{fontFamily: HEAD, fontSize: 52, color: k === 'lost159' ? C.red : C.amber}}>{b}</div>
            <div style={{fontFamily: BODY, fontWeight: 700, fontSize: 24, color: C.cream}}>{s}</div>
          </div>
        ))}
      </div>
      <div style={{position: 'absolute', left: 170, top: 330, height: 560, width: 1100, display: 'flex', alignItems: 'flex-end', gap: 50, borderBottom: `4px solid ${C.slate}`}}>
        {yrs.map(([y, v, l, k]) => {
          const g = interpolate(f, [cx(k) - 2, cx(k) + 18], [0, 1], clamp);
          const last = y === '2025';
          return (
            <div key={y} style={{width: 170, textAlign: 'center'}}>
              <div style={{fontFamily: HEAD, fontSize: 40, color: last ? C.red : C.cream, opacity: g}}>{l}</div>
              <div style={{height: v * H * g, background: last ? C.red : C.slate, borderRadius: '14px 14px 0 0', marginTop: 6}} />
              <div style={{position: 'absolute', top: 570, width: 170, fontFamily: HEAD, fontSize: 32, color: C.muted, opacity: g}}>{y}</div>
            </div>
          );
        })}
      </div>
      <Abs x={1330} y={340} o={fade(f, cx('everyyear'))}><Pill o={1} bg={C.panel2} color={C.cream} size={32}>up every year for 6 years</Pill></Abs>
      <Abs x={1330} y={450} o={fade(f, cx('p430'))}>
        <div style={{fontFamily: HEAD, fontSize: 104, color: C.red, lineHeight: 1}}>+~430%</div>
        <div style={{fontFamily: BODY, fontWeight: 700, fontSize: 32, color: C.cream}}>since 2020</div>
      </Abs>
      <Abs x={1330} y={640} w={520} o={fade(f, cx('k100'))}><div style={{fontFamily: BODY, fontWeight: 700, fontSize: 30, color: C.amber, lineHeight: 1.3}}>FTC: driven by more people reporting losses of $100,000+</div></Abs>
      <Abs x={170} y={300} o={fade(f, cx('b6'))}><div style={{fontFamily: BODY, fontSize: 22, color: C.muted}}>"more than" values drawn at their floor</div></Abs>
    </AbsoluteFill>
  );
};

const Iceberg: React.FC = () => {
  const f = useCurrentFrame();
  const heroOn = f >= SEG[17] - 6;
  const dots = 1000, hi = 48;
  return (
    <AbsoluteFill>
      <Abs x={110} y={110} o={fade(f, cx('twist'))}><div style={{fontFamily: HEAD, fontSize: 58, color: C.amber}}>THE TWIST: <span style={{color: C.cream}}>only the reported part</span></div></Abs>
      {/* 1,000 victims, 48 complained */}
      <div style={{position: 'absolute', left: 110, top: 230, width: 600, opacity: fade(f, cx('p48') - 6)}}>
        <svg width={600} height={380} viewBox="0 0 600 375">
          {Array.from({length: dots}, (_, i) => {
            const c = i % 40, r = Math.floor(i / 40);
            const on = i < hi && f >= cx('p48') + Math.floor(i / 4);
            return <circle key={i} cx={8 + c * 15} cy={8 + r * 15} r={5.2} fill={on ? C.amber : '#3a4b68'} />;
          })}
        </svg>
        <div style={{fontFamily: HEAD, fontSize: 64, color: C.amber}}>4.8%</div>
        <div style={{fontFamily: BODY, fontWeight: 700, fontSize: 28, color: C.cream, opacity: fade(f, cx('bbb'))}}>of mass-market fraud victims complained to the BBB or a government agency (study cited by the FTC)</div>
      </div>
      {/* iceberg */}
      <div style={{position: 'absolute', left: 720, top: 200, width: 1000, height: 700, opacity: fade(f, cx('estimate') - 10)}}>
        <svg width="100%" height="100%" viewBox="0 0 1000 700" preserveAspectRatio="xMidYMid meet">
          <rect x={0} y={170} width={1000} height={530} fill="#123a5c" opacity={0.6} />
          <path d="M430 170 L500 60 L560 110 L600 170 Z" fill={C.cream} stroke={C.ink} strokeWidth={6} />
          <path d="M430 170 L600 170 L840 330 L780 560 L520 680 L260 560 L170 330 Z" fill="#9fc6e4" opacity={interpolate(f, [cx('b1959') - 4, cx('b1959') + 20], [0.15, 0.85], clamp)} stroke={C.ink} strokeWidth={6} />
          <text x={510} y={40} textAnchor="middle" fontFamily="Archivo Black" fontSize={38} fill={C.cream}>reported 2024: $12B+</text>
        </svg>
        <div style={{position: 'absolute', left: 0, right: 0, top: 290, textAlign: 'center', opacity: fade(f, cx('b1959'))}}>
          <div style={{fontFamily: HEAD, fontSize: 56, color: C.bg, lineHeight: 1}}>UP TO</div>
          <div style={{fontFamily: HEAD, fontSize: 96, color: C.bg, lineHeight: 1}}>$195.9B</div>
          <div style={{fontFamily: BODY, fontWeight: 700, fontSize: 26, color: C.bg, width: 460, margin: '8px auto 0'}}>FTC estimate for 2024, incl. unreported fraud</div>
        </div>
      </div>
      {heroOn && <Hero pose="shock_shock" x={1800} y={1000} h={420} from={SEG[17] - 6} shake />}
    </AbsoluteFill>
  );
};

const NeverEver: React.FC = () => {
  const f = useCurrentFrame();
  const steps: [string, string, string, boolean][] = [['tooknothing', 'silent', 'silent call: took nothing', false], ['later', 'text', 'the 2nd call / text', true], ['later', 'move', 'the urgent transfer', true]];
  return (
    <AbsoluteFill>
      <div style={{position: 'absolute', left: 120, top: 130, display: 'flex', gap: 30}}>
        {steps.map(([k, ic, t, bad], i) => (
          <div key={i} style={{width: 330, textAlign: 'center', opacity: fade(f, cx(k) + i * 8), background: C.panel, border: `4px solid ${bad ? C.red : C.mint}`, borderRadius: 24, padding: 20}}>
            <div style={{display: 'flex', justifyContent: 'center'}}><PathIcon k={ic} s={100} bad={bad} /></div>
            <div style={{fontFamily: BODY, fontWeight: 700, fontSize: 28, color: bad ? C.red : C.mint, marginTop: 8}}>{t}</div>
          </div>
        ))}
      </div>
      <Abs x={1220} y={120} w={600} o={fade(f, cx('nevercamp'))}>
        <div style={{background: C.amber, color: C.bg, borderRadius: 28, padding: '26px 32px', transform: 'rotate(2deg)'}}>
          <div style={{fontFamily: HEAD, fontSize: 76, lineHeight: 1}}>NEVER EVER</div>
          <div style={{fontFamily: BODY, fontWeight: 700, fontSize: 28, marginTop: 10}}>FTC + partners: what real businesses and government agencies will never ask you to do</div>
        </div>
      </Abs>
      <Abs x={120} y={520} o={fade(f, cx('alerts'))}><div style={{fontFamily: HEAD, fontSize: 44, color: C.cream}}>THIS WEEK'S FTC ALERTS</div></Abs>
      <div style={{position: 'absolute', left: 120, top: 600, display: 'flex', gap: 30}}>
        {[['grandkid', 'Grandkid scams (Nov 18)'], ['search', 'Fake holiday search results (Nov 19)']].map(([k, t]) => (
          <div key={k} style={{opacity: fade(f, cx(k)), background: C.panel2, borderRadius: 20, padding: '18px 28px', fontFamily: BODY, fontWeight: 700, fontSize: 34, color: C.cream}}>⚠ {t}</div>
        ))}
      </div>
    </AbsoluteFill>
  );
};

const Close: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill>
      <Abs x={140} y={200} o={fade(f, cx('rep'))}><div style={{fontFamily: HEAD, fontSize: 130, color: C.red, lineHeight: 1}}>$15.9B</div><div style={{fontFamily: HEAD, fontSize: 50, color: C.cream}}>reported.</div></Abs>
      <Abs x={140} y={470} o={fade(f, cx('unrep'))}><div style={{fontFamily: HEAD, fontSize: 60, color: C.amber}}>Maybe far more, unreported.</div></Abs>
      <Phone x={1400} y={110} w={300}>
        <div style={{fontFamily: HEAD, fontSize: 70, color: C.amber}}>...</div>
      </Phone>
      <Bubble x={1080} y={730} o={fade(f, cx('hello9'), 6)} size={52}>Hello? Anyone there?</Bubble>
    </AbsoluteFill>
  );
};

const CTA: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill>
      <Abs x={110} y={130} w={1100}><div style={{fontFamily: HEAD, fontSize: 72, color: C.cream, lineHeight: 1.05}}>Ever answered a call and heard <span style={{color: C.amber}}>only silence?</span></div></Abs>
      <Abs x={110} y={360} o={fade(f, cx('comments'))}><Pill o={1} size={42}>What happened next? Tell us in the comments ↓</Pill></Abs>
      <Abs x={110} y={480} o={fade(f, cx('followmoney'))}><div style={{fontFamily: HEAD, fontSize: 70, color: C.amber, transform: 'rotate(-2deg)'}}>"Follow the money."</div></Abs>
      {f >= cx('subscribe') - 4 && <SubButton at={cx('subscribe') - 4} x={110} y={610} size={58} />}
      <Abs x={110} y={780} w={1250} o={fade(f, cx('tomorrow'))}><div style={{fontFamily: BODY, fontWeight: 700, fontSize: 34, color: C.cream}}>Tomorrow: <span style={{color: C.mint}}>what if the world stopped buying America's debt? (day by day)</span></div></Abs>
      <Hero pose={f >= cx('subscribe') ? 'wave_happy' : f >= cx('followmoney') - 4 ? 'point_smile' : 'shrug_talk'} x={1580} y={1010} h={700} from={SEG[20] - 4} />
    </AbsoluteFill>
  );
};

// ---------- timeline ----------
type Sc = {from: number; el: React.ReactNode; src: string; glow?: string};
const SCENES: Sc[] = [
  {from: 0, el: <ColdOpen />, src: 'Dramatized scene', glow: '#1b2a44'},
  {from: cx('nobody') - 6, el: <Hook />, src: SRC.ftc, glow: '#3a2034'},
  {from: cx('ch1') - 6, el: <RuthScene />, src: SRC.story, glow: '#3b2f2a'},
  {from: cx('usually') - 6, el: <DialerScene />, src: SRC.tsr, glow: '#16362e'},
  {from: cx('ch2') - 6, el: <RulesScene />, src: SRC.tsr},
  {from: cx('realbiz') - 6, el: <SortScene />, src: SRC.tsr + ' · "may mark your number as live" = what some security experts warn', glow: '#16362e'},
  {from: cx('ch3') - 6, el: <SecondCall />, src: SRC.imp + ' · Ruth: made-up character', glow: '#2d2440'},
  {from: SEG[9] - 6, el: <SoftCTA />, src: ''},
  {from: cx('costliest') - 6, el: <Impersonators />, src: SRC.imp},
  {from: cx('ch4') - 6, el: <MoveMoney />, src: SRC.ftc + ' · Ruth: made-up character', glow: '#3b2f2a'},
  {from: cx('biggest') - 6, el: <Investment />, src: SRC.ftc},
  {from: SEG[14] - 6, el: <Chain />, src: SRC.mix},
  {from: cx('ch5') - 6, el: <Ledger />, src: SRC.mix},
  {from: cx('twist') - 6, el: <Iceberg />, src: SRC.ftc + ' (Anderson 2021 study; FTC loss estimate)', glow: '#123a5c'},
  {from: cx('ch6') - 6, el: <NeverEver />, src: 'Sources: FTC consumer alerts, Nov 18-19, 2026 · consumer.ftc.gov'},
  {from: cx('rep') - 6, el: <Close />, src: SRC.ftc, glow: '#3a2034'},
  {from: cx('q') - 6, el: <CTA />, src: ''},
];

export const Story: React.FC = () => {
  const f = useCurrentFrame();
  let i = 0;
  SCENES.forEach((s, k) => { if (f >= s.from) i = k; });
  const s = SCENES[i];
  return (
    <AbsoluteFill>
      <Background glow={s.glow} />
      <AbsoluteFill key={i}>{s.el}</AbsoluteFill>
      <ChapterCard />
      <Brand />
      <Captions />
      {s.src && <Source text={s.src} />}
      <Audio src={staticFile('vo.mp3')} />
    </AbsoluteFill>
  );
};

// ---------- thumbnail (1280x720, PLAN v4 fallback: 1-3 big words, $ number in a red box, mascot in a corner) ----------
export const Thumb: React.FC = () => (
  <AbsoluteFill>
    <AbsoluteFill style={{background: 'radial-gradient(circle at 70% 40%, #6b3b1c, #0e1b2e 65%)'}} />
    <div style={{position: 'absolute', left: 50, top: 70, width: 700}}>
      <div style={{fontFamily: HEAD, fontSize: 150, color: C.cream, lineHeight: 0.95}}>HELLO?</div>
      <div style={{fontFamily: HEAD, fontSize: 104, color: C.amber, lineHeight: 1.05}}>...SILENCE</div>
      <div style={{display: 'inline-block', marginTop: 34, background: C.red, color: '#fff', fontFamily: HEAD, fontSize: 116, padding: '4px 26px', borderRadius: 18, transform: 'rotate(-3deg)'}}>$15.9B</div>
    </div>
    <div style={{position: 'absolute', left: 860, top: 50, width: 220, height: 430, background: '#1b2333', border: `10px solid ${C.ink}`, borderRadius: 34, transform: 'rotate(8deg)', boxShadow: '0 0 60px rgba(63,214,160,.45)'}}>
      <div style={{position: 'absolute', inset: 14, borderRadius: 24, background: '#13233a', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: HEAD, fontSize: 90, color: C.mint}}>...</div>
    </div>
    <Img src={staticFile('sprites/hero_shock_shock.png')} style={{position: 'absolute', right: 10, bottom: -10, height: 330, width: 198}} />
  </AbsoluteFill>
);

export const Root: React.FC = () => (
  <>
    <Composition id="Story" component={Story} durationInFrames={END} fps={FPS} width={1920} height={1080} />
    <Composition id="Thumb" component={Thumb} durationInFrames={1} fps={FPS} width={1280} height={720} />
  </>
);
