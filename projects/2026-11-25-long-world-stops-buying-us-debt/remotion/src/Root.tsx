// Chartography STORY long-form (PLAN v4, Day by Day): "What If the World Stopped Buying US Debt?" - a labeled SCENARIO
// (Day 1 ... Day 30) where every number is real and dated (Treasury TIC, Treasury Debt to the Penny, CBO, Fed). Mascot host.
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
  tic: 'Source: US Treasury, TIC major foreign holders (Sep 2026, released Nov 18, 2026) · ticdata.treasury.gov',
  ticr: 'Sources: US Treasury TIC (Sep 2026) · Reuters via Hedgeweek, Nov 19, 2026',
  penny: 'Source: US Treasury, Debt to the Penny (Nov 19, 2026) · CBO Monthly Budget Review (Nov 9, 2026)',
  cbo: 'Source: CBO Monthly Budget Review, Nov 9, 2026 (fiscal year 2026)',
  rates: 'Sources: 10-yr yield, The Closing Print (Nov 20, 2026) · 30-yr mortgage, Investing.com (week of Nov 16-20, 2026)',
  mix: 'Rough shares from mixed dates: Treasury Debt to the Penny (Nov 19) · TIC (Sep) · Fed holdings, FRED via govspending.org (week of Nov 18, 2026)',
  scen: 'SCENARIO - imagined, not a prediction',
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
const Bubble: React.FC<{x: number; y: number; o: number; children: React.ReactNode; bg?: string; color?: string; size?: number; w?: number}> = ({x, y, o, children, bg = C.cream, color = C.bg, size = 40, w}) => (
  <div style={{position: 'absolute', left: x, top: y, width: w, opacity: o, transform: `scale(${0.8 + 0.2 * o})`, transformOrigin: 'left bottom', background: bg, color, fontFamily: HEAD, fontSize: size, padding: '14px 26px', borderRadius: 26, borderBottomLeftRadius: 6, boxShadow: '0 10px 24px rgba(0,0,0,.35)'}}>{children}</div>
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

const Scenario: React.FC<{x?: number; y?: number; o?: number; label?: string}> = ({x = 110, y = 100, o = 1, label = 'SCENARIO'}) => (
  <div style={{position: 'absolute', left: x, top: y, opacity: o, border: `5px solid ${C.red}`, color: C.red, fontFamily: HEAD, fontSize: 34, letterSpacing: 4, padding: '6px 20px', borderRadius: 12, transform: 'rotate(-3deg)', background: 'rgba(255,93,93,0.08)'}}>{label}</div>
);
const Title: React.FC<{y?: number; o?: number; children: React.ReactNode; sub?: string}> = ({y = 110, o = 1, children, sub}) => (
  <div style={{position: 'absolute', left: 110, top: y, opacity: o}}>
    <div style={{fontFamily: HEAD, fontSize: 62, color: C.cream, lineHeight: 1.05}}>{children}</div>
    {sub && <div style={{fontFamily: BODY, fontWeight: 700, fontSize: 30, color: C.muted, marginTop: 6}}>{sub}</div>}
  </div>
);
const Building: React.FC<{x: number; y: number; w: number}> = ({x, y, w}) => (
  <svg style={{position: 'absolute', left: x, top: y}} width={w} height={w * 0.62} viewBox="0 0 400 250">
    <path d="M20 70 L200 10 L380 70 Z" fill="#d9d2c3" stroke={C.ink} strokeWidth={6} strokeLinejoin="round" />
    <rect x={30} y={70} width={340} height={20} fill="#cfc7b6" stroke={C.ink} strokeWidth={5} />
    {[50, 110, 170, 230, 290, 340].map((cx0) => <rect key={cx0} x={cx0} y={92} width={22} height={118} fill="#e9e3d6" stroke={C.ink} strokeWidth={4} />)}
    <rect x={20} y={210} width={360} height={30} fill="#cfc7b6" stroke={C.ink} strokeWidth={5} />
  </svg>
);
const Bond: React.FC<{w: number; crack?: number}> = ({w, crack = 0}) => (
  <svg width={w} height={w * 0.32} viewBox="0 0 250 80">
    <rect x={4} y={4} width={242} height={72} rx={8} fill="#e8e1c9" stroke={C.ink} strokeWidth={5} />
    <rect x={14} y={14} width={222} height={52} rx={4} fill="none" stroke="#6f8f6a" strokeWidth={3} />
    <text x={125} y={50} textAnchor="middle" fontFamily="Archivo Black" fontSize={22} fill="#43603f">US TREASURY</text>
    {crack > 0 && <path d={`M120 4 L132 ${24 * crack + 4} L118 ${44 * crack + 4} L134 ${76 * crack}`} stroke={C.ink} strokeWidth={4} fill="none" />}
  </svg>
);

// ---------- scenes ----------
const ColdOpen: React.FC = () => {
  const f = useCurrentFrame();
  const rows: [string, string][] = [['US banks & funds', 'bids in'], ['Bids from overseas', '...']];
  return (
    <AbsoluteFill>
      <Scenario o={fade(f, 0, 6)} label="SCENARIO · DAY 1" />
      <Building x={110} y={300} w={640} />
      <Abs x={110} y={720} o={fade(f, cx('wash'))}><div style={{fontFamily: BODY, fontWeight: 700, fontSize: 32, color: C.muted}}>Washington, D.C. (illustration)</div></Abs>
      <div style={{position: 'absolute', left: 860, top: 210, width: 760, background: C.ink, border: `6px solid ${C.slate}`, borderRadius: 26, padding: 34, opacity: fade(f, cx('auction') - 4)}}>
        <div style={{fontFamily: HEAD, fontSize: 46, color: C.amber}}>TREASURY AUCTION</div>
        <div style={{fontFamily: BODY, fontWeight: 700, fontSize: 30, color: C.muted, marginTop: 4, opacity: fade(f, cx('borrow'))}}>borrowing, like every week</div>
        {rows.map(([a, b], i) => {
          const empty = i === 1 && f >= cx('overseas');
          return (
            <div key={a} style={{display: 'flex', justifyContent: 'space-between', marginTop: 26, opacity: fade(f, cx('borrow') + 20 + i * 14), fontFamily: HEAD, fontSize: 40, color: C.cream}}>
              <span>{a}</span>
              <span style={{color: empty ? C.red : C.mint, opacity: empty && Math.floor(f / 8) % 2 ? 0.25 : 1}}>{empty ? 'NONE' : b}</span>
            </div>
          );
        })}
      </div>
      {f >= cx('wait0') - 6 && <Hero pose="shock_shock" x={1560} y={1000} h={420} from={cx('wait0') - 6} shake />}
    </AbsoluteFill>
  );
};

const Hook: React.FC = () => {
  const f = useCurrentFrame();
  const n = interpolate(f, [cx('t92') - 4, cx('t92') + 24], [0, 9.2], clamp);
  return (
    <AbsoluteFill>
      <Abs x={0} y={110} w={1920} o={fade(f, cx('real') - 4)} style={{textAlign: 'center'}}><Pill o={1} bg={C.mint} size={38} style={{transformOrigin: 'center'}}>REAL</Pill></Abs>
      <Abs x={0} y={210} w={1920} o={fade(f, cx('t92') - 4)} style={{textAlign: 'center'}}>
        <div style={{fontFamily: HEAD, fontSize: 200, color: C.amber, lineHeight: 1}}>${n.toFixed(1)} TRILLION</div>
        <div style={{fontFamily: BODY, fontWeight: 700, fontSize: 40, color: C.cream, marginTop: 8}}>of US Treasury debt held by investors outside the US (Sep 2026)</div>
      </Abs>
      <Abs x={0} y={520} w={1920} o={fade(f, cx('china0'))} style={{textAlign: 'center'}}>
        <Pill o={1} bg={C.red} color="#fff" size={46} style={{transformOrigin: 'center'}}>China's pile: lowest since 2008</Pill>
      </Abs>
      <div style={{position: 'absolute', top: 680, left: 0, right: 0, display: 'flex', justifyContent: 'center', gap: 60}}>
        <div style={{opacity: fade(f, cx('everynum')), background: C.panel, border: `5px solid ${C.mint}`, borderRadius: 22, padding: '18px 30px', fontFamily: HEAD, fontSize: 38, color: C.mint}}>REAL = a number + its date</div>
        <div style={{opacity: fade(f, cx('marked')), background: C.panel, border: `5px solid ${C.red}`, borderRadius: 22, padding: '18px 30px', fontFamily: HEAD, fontSize: 38, color: C.red}}>SCENARIO = imagined</div>
      </div>
      <Abs x={1180} y={830} o={fade(f, cx('scariest'))}><div style={{fontFamily: BODY, fontWeight: 700, fontStyle: 'italic', fontSize: 40, color: C.amber, transform: 'rotate(-3deg)'}}>...the scary part isn't in the headlines?</div></Abs>
    </AbsoluteFill>
  );
};

const Pile: React.FC = () => {
  const f = useCurrentFrame();
  const H = 640 / 40.7;
  const g = interpolate(f, [cx('t407') - 6, cx('t407') + 20], [0, 1], clamp);
  const n = 40.7 * g;
  const split = f >= cx('t329') - 4;
  const ang = interpolate(f, [cx('p100') - 4, cx('p100') + 30], [-90, 90], clamp);
  return (
    <AbsoluteFill>
      <Title sub="as of Nov 19, 2026">THE PILE</Title>
      <div style={{position: 'absolute', left: 170, top: 290, width: 300, height: 640, display: 'flex', flexDirection: 'column', justifyContent: 'flex-end'}}>
        <div style={{height: 7.8 * H * g, background: split ? C.slate : C.red, borderRadius: '14px 14px 0 0', border: `5px solid ${C.ink}`, borderBottom: 'none'}} />
        <div style={{height: 32.9 * H * g, background: split ? C.mint : C.red, border: `5px solid ${C.ink}`}} />
      </div>
      <Abs x={500} y={280} o={g}><div style={{fontFamily: HEAD, fontSize: 96, color: C.red, lineHeight: 1}}>${n.toFixed(1)}T</div><div style={{fontFamily: BODY, fontWeight: 700, fontSize: 30, color: C.cream}}>total federal debt</div></Abs>
      <Abs x={500} y={500} o={fade(f, cx('t78'))}><div style={{fontFamily: HEAD, fontSize: 52, color: C.slate}}>$7.8T</div><div style={{fontFamily: BODY, fontWeight: 700, fontSize: 28, color: C.cream}}>owed to itself (trust funds)</div></Abs>
      <Abs x={500} y={700} o={fade(f, cx('t329'))}><div style={{fontFamily: HEAD, fontSize: 64, color: C.mint}}>$32.9T</div><div style={{fontFamily: BODY, fontWeight: 700, fontSize: 28, color: C.cream, opacity: fade(f, cx('public'))}}>held by the public: investors, banks,<br />funds, other countries, the Fed</div></Abs>
      <div style={{position: 'absolute', left: 1130, top: 250, width: 640, opacity: fade(f, cx('cbo') - 4)}}>
        <svg width={640} height={360} viewBox="0 0 640 360">
          <path d="M60 330 A260 260 0 0 1 580 330" fill="none" stroke={C.panel2} strokeWidth={48} />
          <path d="M60 330 A260 260 0 0 1 580 330" fill="none" stroke={C.red} strokeWidth={48} strokeDasharray={`${817 * (ang + 90) / 180} 900`} />
          <line x1={320} y1={330} x2={320 + 230 * Math.sin(ang * Math.PI / 180)} y2={330 - 230 * Math.cos(ang * Math.PI / 180)} stroke={C.cream} strokeWidth={10} strokeLinecap="round" />
          <circle cx={320} cy={330} r={18} fill={C.cream} />
        </svg>
        <div style={{textAlign: 'center', fontFamily: HEAD, fontSize: 84, color: C.red, opacity: fade(f, cx('p100'))}}>100% OF GDP</div>
        <div style={{textAlign: 'center', fontFamily: BODY, fontWeight: 700, fontSize: 30, color: C.cream}}>debt held by the public vs the whole US economy (CBO)</div>
        <div style={{textAlign: 'center', marginTop: 16}}><Pill o={fade(f, cx('y1946'))} size={40} style={{transformOrigin: 'center'}}>highest since 1946</Pill></div>
      </div>
      {f >= cx('hero100') - 6 && <Hero pose="shock_shock" x={1800} y={1010} h={330} from={cx('hero100') - 6} shake />}
    </AbsoluteFill>
  );
};

const HOLD: [string, number, string][] = [['Japan', 1063.1, 'japan'], ['United Kingdom', 985.8, 'uk'], ['China', 563.9, 'china2'], ['Belgium*', 507.9, 'belgium'], ['Cayman Islands*', 486.8, 'belgium'], ['Canada', 467.7, 'belgium'], ['Luxembourg*', 445.0, 'belgium']];
const Holders: React.FC = () => {
  const f = useCurrentFrame();
  const W = 900 / 1063.1;
  return (
    <AbsoluteFill>
      <Scenario x={1400} y={110} o={fade(f, cx('thin') - 6)} label="DAY 1: BIDS THIN" />
      <Title o={fade(f, cx('list') - 10)} sub="US Treasuries held, September 2026 (billions of dollars)">WHO ARE THE BUYERS?</Title>
      <div style={{position: 'absolute', left: 110, top: 300}}>
        {HOLD.map(([n, v, k], i) => {
          const t0 = cx(k) + (i > 3 ? (i - 3) * 8 : 0);
          const g = interpolate(f, [t0 - 4, t0 + 14], [0, 1], clamp);
          return (
            <div key={n} style={{display: 'flex', alignItems: 'center', height: 82, opacity: g > 0 ? 1 : 0}}>
              <div style={{width: 380, fontFamily: HEAD, fontSize: 38, color: n === 'China' ? C.red : C.cream}}>{n}</div>
              <div style={{width: v * W * g, height: 54, background: n === 'China' ? C.red : i < 2 ? C.amber : C.slate, borderRadius: 10}} />
              <div style={{marginLeft: 18, fontFamily: HEAD, fontSize: 38, color: C.cream, opacity: g}}>${v.toFixed(1)}B</div>
            </div>
          );
        })}
      </div>
      <Abs x={1180} y={880} o={fade(f, cx('range'))}><div style={{fontFamily: BODY, fontWeight: 700, fontSize: 26, color: C.muted}}>* custody locations - see next</div></Abs>
    </AbsoluteFill>
  );
};

const Custody: React.FC = () => {
  const f = useCurrentFrame();
  const g = interpolate(f, [cx('official') - 4, cx('official') + 20], [0, 1], clamp);
  return (
    <AbsoluteFill>
      <Title sub="Treasury's warning about its own table">BELGIUM? THE CAYMAN ISLANDS?</Title>
      <div style={{position: 'absolute', left: 140, top: 300, display: 'flex', alignItems: 'center', gap: 40, opacity: fade(f, cx('custody') - 6)}}>
        <div style={{width: 300, height: 260, background: C.panel2, border: `6px solid ${C.ink}`, borderRadius: 24, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
          <svg width={180} height={180} viewBox="0 0 100 100"><circle cx={50} cy={50} r={36} fill="none" stroke={C.amber} strokeWidth={7} /><circle cx={50} cy={50} r={8} fill={C.amber} />{[0, 60, 120, 180, 240, 300].map((a) => <line key={a} x1={50} y1={50} x2={50 + 28 * Math.cos(a * Math.PI / 180)} y2={50 + 28 * Math.sin(a * Math.PI / 180)} stroke={C.amber} strokeWidth={5} />)}</svg>
        </div>
        <div>
          <div style={{fontFamily: HEAD, fontSize: 52, color: C.cream}}>where the bonds are <span style={{color: C.mint}}>kept</span></div>
          <div style={{fontFamily: HEAD, fontSize: 52, color: C.red, opacity: fade(f, cx('owns'))}}>is not always who <span style={{textDecoration: 'underline'}}>owns</span> them</div>
        </div>
      </div>
      <div style={{position: 'absolute', left: 140, top: 660, width: 1640, opacity: fade(f, cx('official') - 6)}}>
        <div style={{fontFamily: BODY, fontWeight: 700, fontSize: 30, color: C.muted, marginBottom: 10}}>All foreign holders: $9,241.2B (Sep 2026)</div>
        <div style={{display: 'flex', height: 96, borderRadius: 16, overflow: 'hidden', border: `5px solid ${C.ink}`}}>
          <div style={{width: `${39.8 * g}%`, background: C.amber, display: 'flex', alignItems: 'center', paddingLeft: 18, fontFamily: HEAD, fontSize: 30, color: C.bg, whiteSpace: 'nowrap'}}>{f >= cx('t367') ? 'govts & central banks: $3.67T' : ''}</div>
          <div style={{flex: 1, background: f >= cx('private') ? C.slate : C.panel, display: 'flex', alignItems: 'center', paddingLeft: 24, fontFamily: HEAD, fontSize: 36, color: C.cream, whiteSpace: 'nowrap'}}>{f >= cx('private') ? 'private investors abroad (the rest)' : ''}</div>
        </div>
      </div>
    </AbsoluteFill>
  );
};

const Day2: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill>
      <Scenario label="SCENARIO · DAY 2" />
      <div style={{position: 'absolute', left: 200, top: 220, width: 1000, background: '#efe9da', border: `8px solid ${C.ink}`, borderRadius: 10, padding: '30px 44px', transform: `rotate(-2deg) scale(${sp(f, cx('headlines') - 6)})`}}>
        <div style={{fontFamily: HEAD, fontSize: 34, color: '#555', borderBottom: '4px solid #333', paddingBottom: 6}}>THE DAILY LEDGER · imaginary newspaper</div>
        <div style={{fontFamily: HEAD, fontSize: 104, color: C.ink, lineHeight: 1, marginTop: 20}}>WHO FILLS<br />THE GAP?</div>
        <div style={{display: 'flex', gap: 20, marginTop: 24}}>{[0, 1, 2].map((i) => <div key={i} style={{flex: 1, height: 14, background: '#bbb', borderRadius: 7}} />)}</div>
        <div style={{display: 'flex', gap: 20, marginTop: 14}}>{[0, 1].map((i) => <div key={i} style={{flex: 1, height: 14, background: '#bbb', borderRadius: 7}} />)}</div>
      </div>
      <Abs x={1260} y={260} o={fade(f, cx('twistq'))}><div style={{fontFamily: BODY, fontWeight: 700, fontStyle: 'italic', fontSize: 44, color: C.amber, transform: 'rotate(3deg)', width: 520}}>hold on to this question...</div></Abs>
      <Hero pose="think_worry" x={1520} y={1000} h={520} from={cx('gap') - 10} />
    </AbsoluteFill>
  );
};

const China: React.FC = () => {
  const f = useCurrentFrame();
  const Bars: React.FC<{d: [string, number, string][]; max: number; col: string; at: number[]}> = ({d, max, col, at}) => (
    <div style={{display: 'flex', alignItems: 'flex-end', gap: 40, height: 420}}>
      {d.map(([l, v, lab], i) => {
        const g = interpolate(f, [at[i] - 4, at[i] + 16], [0, 1], clamp);
        return (
          <div key={l} style={{width: 200, textAlign: 'center'}}>
            <div style={{fontFamily: HEAD, fontSize: 40, color: C.cream, opacity: g}}>{lab}</div>
            <div style={{height: (v / max) * 330 * g, background: i ? col : C.slate, borderRadius: '12px 12px 0 0', marginTop: 6}} />
            <div style={{fontFamily: BODY, fontWeight: 700, fontSize: 28, color: C.muted, marginTop: 8, opacity: g}}>{l}</div>
          </div>
        );
      })}
    </div>
  );
  return (
    <AbsoluteFill>
      <Scenario x={1380} y={110} o={Math.min(fade(f, cx('day7') - 6), 1 - fade(f, cx('onthemove') + 20))} label="SCENARIO · DAY 7" />
      <Title o={fade(f, cx('onthemove'))}>REAL LIFE: TWO BIG LENDERS BACK AWAY</Title>
      <div style={{position: 'absolute', left: 130, top: 290, opacity: fade(f, cx('b564') - 6)}}>
        <div style={{fontFamily: HEAD, fontSize: 52, color: C.red}}>CHINA</div>
        <Bars d={[['Aug 2026', 590.7, '$590.7B'], ['Sep 2026', 563.9, '$563.9B']]} max={1325} col={C.red} at={[cx('b591'), cx('b564')]} />
      </div>
      <Abs x={640} y={330} o={fade(f, cx('least08'))}><Pill o={1} bg={C.red} color="#fff" size={40}>lowest since 2008</Pill></Abs>
      <Abs x={640} y={430} o={fade(f, cx('p45'))}><div style={{fontFamily: HEAD, fontSize: 80, color: C.red}}>-4.5%</div><div style={{fontFamily: BODY, fontWeight: 700, fontSize: 28, color: C.cream}}>in one month</div></Abs>
      <Abs x={640} y={600} o={fade(f, cx('fourth'))}><Pill o={1} bg={C.panel2} color={C.cream} size={32}>4th monthly drop in a row</Pill></Abs>
      <div style={{position: 'absolute', left: 1240, top: 290, opacity: fade(f, cx('japan5') - 6)}}>
        <div style={{fontFamily: HEAD, fontSize: 52, color: C.amber}}>JAPAN</div>
        <Bars d={[['peak, Nov 2021', 1325, '~$1.33T'], ['Sep 2026', 1063.1, '$1.06T']]} max={1325} col={C.amber} at={[cx('peak'), cx('peak') + 20]} />
      </div>
      <Abs x={1240} y={800} o={fade(f, cx('japan5'))}><Pill o={1} bg={C.panel2} color={C.cream} size={32}>5 monthly drops in a row</Pill></Abs>
      <Abs x={130} y={880} o={fade(f, cx('backing'))}><div style={{fontFamily: BODY, fontWeight: 700, fontStyle: 'italic', fontSize: 36, color: C.amber}}>(bars to the same scale)</div></Abs>
    </AbsoluteFill>
  );
};

const NotSoFast: React.FC = () => {
  const f = useCurrentFrame();
  const pts: [number, number, string][] = [[0, 9238.2, 'Sep 2025'], [4, 9487.3, 'Feb 2026 record'], [8, 9316.7, 'Aug 2026'], [12, 9241.2, 'Sep 2026']];
  const X0 = 140, XW = 1000 / 12, Y = (v: number) => 860 - (v - 9100) * (420 / 450);
  const p = interpolate(f, [cx('t924') - 10, cx('record') + 20], [0, 1], clamp);
  const shown = Math.max(1, Math.ceil(p * pts.length));
  return (
    <AbsoluteFill>
      {f < cx('notsofast') + 10 && <Hero pose="shrug_talk" x={1560} y={1000} h={520} from={cx('leaving') - 6} />}
      <Title o={fade(f, cx('notsofast'))} sub="all foreign holdings of US Treasuries (selected months, $ billions)">NOT SO FAST</Title>
      <svg width={1920} height={1080} style={{position: 'absolute', left: 0, top: 0, opacity: fade(f, cx('t924') - 10)}}>
        <line x1={X0} y1={Y(9100)} x2={X0 + 1000} y2={Y(9100)} stroke={C.slate} strokeWidth={3} />
        <polyline points={pts.slice(0, shown).map(([m, v]) => `${X0 + m * XW},${Y(v)}`).join(' ')} fill="none" stroke={C.amber} strokeWidth={8} strokeDasharray="18 10" />
        {pts.slice(0, shown).map(([m, v, l], i) => (
          <g key={l}>
            <circle cx={X0 + m * XW} cy={Y(v)} r={14} fill={i === 1 ? C.mint : C.amber} stroke={C.ink} strokeWidth={4} />
            <text x={X0 + m * XW} y={Y(v) - 30} textAnchor="middle" fontFamily="Archivo Black" fontSize={30} fill={C.cream}>${v.toLocaleString('en-US')}</text>
            <text x={X0 + m * XW} y={Y(9100) + 40} textAnchor="middle" fontFamily="Fira Sans" fontWeight={700} fontSize={24} fill={C.muted}>{l}</text>
          </g>
        ))}
      </svg>
      <div style={{position: 'absolute', left: 1260, top: 300, width: 560, display: 'flex', flexDirection: 'column', gap: 26}}>
        <div style={{opacity: fade(f, cx('b808')), background: C.panel, border: `4px solid ${C.mint}`, borderRadius: 20, padding: '16px 24px'}}><div style={{fontFamily: HEAD, fontSize: 56, color: C.mint}}>+$80.8B</div><div style={{fontFamily: BODY, fontWeight: 700, fontSize: 28, color: C.cream}}>net foreign purchases of Treasuries (Sep)</div></div>
        <div style={{opacity: fade(f, cx('yearago')), fontFamily: BODY, fontWeight: 700, fontSize: 30, color: C.cream}}>still ~0.3% above a year earlier</div>
        <div style={{opacity: fade(f, cx('sellbuy')), fontFamily: HEAD, fontSize: 40, color: C.amber}}>China & Japan sell. Others buy.</div>
        <div style={{opacity: fade(f, cx('b261')), background: C.panel, border: `4px solid ${C.slate}`, borderRadius: 20, padding: '16px 24px'}}><div style={{fontFamily: HEAD, fontSize: 52, color: C.cream}}>$261.0B</div><div style={{fontFamily: BODY, fontWeight: 700, fontSize: 26, color: C.cream}}>net flow into the US, all investments Treasury tracks (Sep)</div></div>
      </div>
    </AbsoluteFill>
  );
};

const SoftCTA: React.FC = () => {
  const f = useCurrentFrame();
  const a = SEG[13];
  return (
    <AbsoluteFill>
      <Abs x={160} y={220}><div style={{fontFamily: HEAD, fontSize: 80, color: C.cream, lineHeight: 1.05, opacity: fade(f, a)}}>Already surprised?</div></Abs>
      <SubButton at={cx('sub1')} x={160} y={400} size={70} />
      <Abs x={160} y={600} o={fade(f, a + 50)}><div style={{fontFamily: HEAD, fontSize: 54, color: C.amber}}>...the next part gets worse.</div></Abs>
      <Hero pose="point_talk" x={1520} y={1000} h={680} from={a - 4} flip />
    </AbsoluteFill>
  );
};

const RatesScen: React.FC = () => {
  const f = useCurrentFrame();
  const tilt = interpolate(f, [cx('betterdeal'), cx('yield') + 20], [0, -14], clamp);
  return (
    <AbsoluteFill>
      <Scenario label="SCENARIO · DAY 14" o={fade(f, cx('day14') - 6)} />
      <div style={{position: 'absolute', left: 260, top: 380, width: 900, transform: `rotate(${tilt}deg)`, transformOrigin: '50% 100%'}}>
        <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end'}}>
          <div style={{textAlign: 'center'}}>
            <div style={{display: 'flex', gap: 8}}>{[0, 1, 2, 3].map((i) => <div key={i} style={{width: 46, height: 70, borderRadius: '23px 23px 8px 8px', background: i < 2 ? C.slate : 'transparent', border: `4px dashed ${i < 2 ? C.ink : C.slate}`}} />)}</div>
            <div style={{fontFamily: HEAD, fontSize: 36, color: C.cream, marginTop: 8}}>fewer buyers</div>
          </div>
          <div style={{textAlign: 'center'}}>
            <div style={{fontFamily: HEAD, fontSize: 70, color: C.red}}>YIELD ↑</div>
            <div style={{fontFamily: BODY, fontWeight: 700, fontSize: 30, color: C.cream, opacity: fade(f, cx('yield'))}}>the interest rate on the bond</div>
          </div>
        </div>
        <div style={{height: 18, background: C.amber, borderRadius: 9, marginTop: 10}} />
      </div>
      <svg style={{position: 'absolute', left: 660, top: 590}} width={100} height={110}><path d="M50 0 L100 110 L0 110 Z" fill={C.slate} stroke={C.ink} strokeWidth={5} /></svg>
      <div style={{position: 'absolute', left: 1250, top: 330, width: 560, textAlign: 'center', opacity: fade(f, cx('kitchen') - 6)}}>
        <svg width={260} height={220} viewBox="0 0 100 85"><path d="M10 40 L50 8 L90 40 V82 H10 Z" fill="#e6b56f" stroke={C.ink} strokeWidth={4} strokeLinejoin="round" /><rect x={40} y={52} width={20} height={30} fill={C.panel} /></svg>
        <div style={{fontFamily: HEAD, fontSize: 42, color: C.cream, opacity: fade(f, cx('mortgage10'))}}>mortgage rates tend to follow the 10-year yield</div>
      </div>
    </AbsoluteFill>
  );
};

const RealRates: React.FC = () => {
  const f = useCurrentFrame();
  const Card: React.FC<{at: number; big: string; col: string; l1: string; l2: string}> = ({at, big, col, l1, l2}) => (
    <div style={{width: 470, opacity: fade(f, at - 4), transform: `translateY(${(1 - fade(f, at - 4)) * 20}px)`, background: C.panel, border: `5px solid ${col}`, borderRadius: 26, padding: '24px 30px'}}>
      <div style={{fontFamily: BODY, fontWeight: 700, fontSize: 28, color: C.muted}}>{l1}</div>
      <div style={{fontFamily: HEAD, fontSize: 96, color: col, lineHeight: 1.1}}>{big}</div>
      <div style={{fontFamily: BODY, fontWeight: 700, fontSize: 28, color: C.cream}}>{l2}</div>
    </div>
  );
  return (
    <AbsoluteFill>
      <Title sub="the real numbers this month">REAL NUMBERS</Title>
      <div style={{position: 'absolute', left: 110, top: 300, display: 'flex', gap: 40, alignItems: 'center'}}>
        <Card at={cx('p515')} big="5.15%" col={C.slate} l1="10-year yield" l2="a week earlier" />
        <div style={{fontFamily: HEAD, fontSize: 80, color: C.cream, opacity: fade(f, cx('p515') + 6)}}>→</div>
        <Card at={cx('p492')} big="4.92%" col={C.amber} l1="10-year yield" l2="Nov 20, 2026 close" />
        <Card at={cx('p735')} big="7.35%" col={C.coral} l1="30-yr mortgage, avg" l2="week of Nov 16-20, 2026" />
      </div>
      <Abs x={110} y={700} o={fade(f, cx('swing'))}><div style={{fontFamily: BODY, fontWeight: 700, fontStyle: 'italic', fontSize: 40, color: C.amber}}>rates can swing this much in days</div></Abs>
      <Abs x={110} y={790} o={fade(f, cx('strike'))}><div style={{display: 'flex', alignItems: 'center', gap: 20}}><div style={{border: `4px solid ${C.red}`, color: C.red, fontFamily: HEAD, fontSize: 28, padding: '4px 14px', borderRadius: 10}}>SCENARIO</div><div style={{fontFamily: HEAD, fontSize: 40, color: C.cream}}>a buyers' strike pushes these <span style={{color: C.red}}>UP</span>, not down</div></div></Abs>
    </AbsoluteFill>
  );
};

const Day21: React.FC = () => {
  const f = useCurrentFrame();
  const opts: [string, string, number][] = [['US banks & funds?', 'banks', cx('banks')], ['The Federal Reserve?', 'fed', cx('fedin')]];
  return (
    <AbsoluteFill>
      <Scenario label="SCENARIO · DAY 21" />
      <Title y={200}>SOMEONE HAS TO FILL THE GAP</Title>
      <div style={{position: 'absolute', left: 110, top: 380, display: 'flex', gap: 40}}>
        {opts.map(([t, k, at]) => (
          <div key={k} style={{width: 520, opacity: fade(f, at - 4), background: C.panel, borderRadius: 26, padding: 30, border: `6px solid ${k === 'fed' && f >= cx('fedowner') ? C.mint : C.slate}`}}>
            <div style={{fontFamily: HEAD, fontSize: 48, color: C.cream}}>{t}</div>
            {k === 'fed' && <div style={{fontFamily: BODY, fontWeight: 700, fontSize: 32, color: C.mint, marginTop: 10, opacity: fade(f, cx('fedowner'))}}>already one of the biggest owners</div>}
          </div>
        ))}
      </div>
      {f >= SEG[17] - 6 && <>
        <Hero pose="think_talk" x={1560} y={1000} h={430} from={SEG[17] - 6} />
        <Bubble x={1300} y={400} o={fade(f, SEG[17], 6)} size={36} w={520}>My mortgage... tied to bond buyers in Tokyo?</Bubble>
      </>}
    </AbsoluteFill>
  );
};

const Bill: React.FC = () => {
  const f = useCurrentFrame();
  const bars: [string, number, string, number, string][] = [['Net interest', 1142, '$1,142B', cx('t114'), C.red], ['Medicare', 1069, '$1,069B', cx('medicare'), C.slate], ['Military (Defense Dept.)', 917, '$917B', cx('military'), C.slate]];
  const W = 640 / 1142;
  const day = interpolate(f, [cx('b31') - 4, cx('b31') + 24], [0, 3.1], clamp);
  return (
    <AbsoluteFill>
      <Abs x={110} y={100} o={fade(f, cx('notscen'))}><div style={{border: `5px solid ${C.mint}`, color: C.mint, fontFamily: HEAD, fontSize: 34, letterSpacing: 4, padding: '6px 20px', borderRadius: 12}}>REAL · NOT A SCENARIO</div></Abs>
      {f < cx('notscen') && <Scenario label="SCENARIO · DAY 30" />}
      <Title y={190} sub="federal spending, fiscal year 2026">THE BILL</Title>
      <div style={{position: 'absolute', left: 110, top: 380}}>
        {bars.map(([n, v, l, at, col]) => {
          const g = interpolate(f, [at - 4, at + 16], [0, 1], clamp);
          return (
            <div key={n} style={{display: 'flex', alignItems: 'center', height: 110, opacity: g > 0 ? 1 : 0}}>
              <div style={{width: 300, fontFamily: HEAD, fontSize: 34, color: C.cream, lineHeight: 1.05}}>{n}</div>
              <div style={{width: v * W * g, height: 74, background: col, borderRadius: 12}} />
              <div style={{marginLeft: 16, fontFamily: HEAD, fontSize: 44, color: col === C.red ? C.red : C.cream, opacity: g}}>{l}</div>
            </div>
          );
        })}
      </div>
      <Abs x={420} y={330} o={fade(f, cx('b114'))}><Pill o={1} bg={C.panel2} color={C.cream} size={30}>+$114B (+11.1%) vs FY2025</Pill></Abs>
      <div style={{position: 'absolute', left: 1400, top: 360, width: 460, opacity: fade(f, cx('b31') - 4)}}>
        <div style={{fontFamily: HEAD, fontSize: 104, color: C.red, lineHeight: 1}}>${day.toFixed(1)}B</div>
        <div style={{fontFamily: BODY, fontWeight: 700, fontSize: 32, color: C.cream}}>of interest, every day (about)</div>
      </div>
      <div style={{position: 'absolute', left: 1400, top: 545, width: 460, opacity: fade(f, cx('t54') - 4), display: 'flex', alignItems: 'center', gap: 20}}>
        <svg width={150} height={150} viewBox="0 0 100 100"><circle cx={50} cy={50} r={44} fill={C.panel2} stroke={C.amber} strokeWidth={6} /><path d={`M50 50 L50 6 A44 44 0 0 1 ${50 + 44 * Math.sin(0.21 * 2 * Math.PI)} ${50 - 44 * Math.cos(0.21 * 2 * Math.PI)} Z`} fill={C.red} opacity={fade(f, cx('c21'))} /></svg>
        <div><div style={{fontFamily: HEAD, fontSize: 64, color: C.amber, opacity: fade(f, cx('c21'))}}>21¢</div><div style={{fontFamily: BODY, fontWeight: 700, fontSize: 26, color: C.cream}}>of every $1 collected ($5.4T) went to interest</div></div>
      </div>
      <Abs x={110} y={760} o={fade(f, cx('deficit'))}><Pill o={1} bg={C.coral} size={40}>and still a deficit of almost $2 trillion ($1,992B)</Pill></Abs>
      {f >= SEG[20] - 6 && <Hero pose="shock_shock" x={1780} y={1010} h={250} from={SEG[20] - 6} shake />}
    </AbsoluteFill>
  );
};

const OWN: [string, number, string, string][] = [['Foreign investors', 23, C.amber, 'p23'], ['The Federal Reserve', 11, C.mint, 'p11'], ['Government trust funds', 19, C.slate, 'p19'], ['Everyone else in the US: households, funds, banks, states', 47, '#8fb8e8', 'p47']];
const Owners: React.FC = () => {
  const f = useCurrentFrame();
  let acc = 0;
  const R = 230, CIRC = 2 * Math.PI * R;
  return (
    <AbsoluteFill>
      <Title sub="share of all $40.7T federal debt (roughly)">WHO REALLY OWNS IT?</Title>
      <svg width={620} height={620} style={{position: 'absolute', left: 150, top: 300}} viewBox="0 0 620 620">
        <circle cx={310} cy={310} r={R} fill="none" stroke={C.panel} strokeWidth={110} />
        {OWN.map(([n, v, col, k]) => {
          const g = interpolate(f, [cx(k) - 4, cx(k) + 14], [0, 1], clamp);
          const el = <circle key={n} cx={310} cy={310} r={R} fill="none" stroke={col} strokeWidth={110} strokeDasharray={`${CIRC * v / 100 * g} ${CIRC}`} strokeDashoffset={-CIRC * acc / 100} transform="rotate(-90 310 310)" />;
          acc += v;
          return el;
        })}
        <text x={310} y={330} textAnchor="middle" fontFamily="Archivo Black" fontSize={60} fill={C.cream} opacity={fade(f, cx('slice'))}>$40.7T</text>
      </svg>
      <div style={{position: 'absolute', left: 900, top: 330, width: 900, display: 'flex', flexDirection: 'column', gap: 24}}>
        {OWN.map(([n, v, col, k]) => (
          <div key={n} style={{display: 'flex', alignItems: 'center', gap: 22, opacity: fade(f, cx(k) - 4)}}>
            <div style={{width: 210, fontFamily: HEAD, fontSize: 64, color: col}}>~{v}%</div>
            <div style={{fontFamily: BODY, fontWeight: 700, fontSize: 32, color: C.cream, width: 660}}>{n}{k === 'p11' ? ' ($4.59T)' : ''}</div>
          </div>
        ))}
      </div>
      <Abs x={900} y={860} o={fade(f, cx('rough'))}><div style={{fontFamily: BODY, fontWeight: 700, fontStyle: 'italic', fontSize: 28, color: C.muted}}>rough shares: Sep-Nov 2026 data mixed</div></Abs>
    </AbsoluteFill>
  );
};

const FedVs: React.FC = () => {
  const f = useCurrentFrame();
  const H = 470 / 4.59;
  const g1 = interpolate(f, [cx('fun') + 20, cx('fun') + 44], [0, 1], clamp);
  const g2 = interpolate(f, [cx('combined') - 30, cx('combined')], [0, 1], clamp);
  const parts: [string, number, string][] = [['China', 0.5639, C.red], ['UK', 0.9858, C.slate], ['Japan', 1.0631, C.amber]];
  return (
    <AbsoluteFill>
      <Title sub="US Treasuries held (Fed: week of Nov 18; others: Sep 2026)">ONE OWNER VS THREE COUNTRIES</Title>
      <div style={{position: 'absolute', left: 300, top: 290, height: 560, display: 'flex', alignItems: 'flex-end', gap: 160}}>
        <div style={{width: 280, textAlign: 'center'}}>
          <div style={{fontFamily: HEAD, fontSize: 56, color: C.mint, opacity: g1}}>$4.59T</div>
          <div style={{height: 4.59 * H * g1, background: C.mint, borderRadius: '16px 16px 0 0', border: `5px solid ${C.ink}`}} />
          <div style={{position: 'absolute', top: 566, width: 280, fontFamily: HEAD, fontSize: 34, color: C.cream}}>The Fed</div>
        </div>
        <div style={{width: 280, textAlign: 'center'}}>
          <div style={{fontFamily: HEAD, fontSize: 56, color: C.cream, opacity: g2}}>$2.61T</div>
          <div style={{display: 'flex', flexDirection: 'column'}}>
            {parts.map(([n, v, col]) => <div key={n} style={{height: v * H * g2, background: col, border: `4px solid ${C.ink}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: HEAD, fontSize: 30, color: C.bg, overflow: 'hidden'}}>{n}</div>)}
          </div>
          <div style={{position: 'absolute', top: 566, marginLeft: -80, width: 440, whiteSpace: 'nowrap', fontFamily: HEAD, fontSize: 34, color: C.cream}}>Japan + UK + China</div>
        </div>
      </div>
      <Abs x={1300} y={420} o={fade(f, cx('x18'))}><div style={{fontFamily: HEAD, fontSize: 170, color: C.amber, lineHeight: 1, transform: `scale(${sp(f, cx('x18'))})`}}>~1.8x</div></Abs>
    </AbsoluteFill>
  );
};

const Close: React.FC = () => {
  const f = useCurrentFrame();
  const a = cx('pressure');
  return (
    <AbsoluteFill>
      {f < cx('mostly') + 20 && <Hero pose="shrug_talk" x={960} y={1000} h={600} from={SEG[23] - 6} />}
      {f < cx('mostly') + 20 && <Bubble x={1180} y={260} o={fade(f, SEG[23], 6)} size={46} w={600}>America mostly owes money to... America?</Bubble>}
      <Abs x={110} y={130} o={fade(f, cx('harder'))}><div style={{fontFamily: HEAD, fontSize: 54, color: C.cream, opacity: f < cx('mostly') + 20 ? 0 : 1}}>A sudden collapse? <span style={{color: C.amber}}>Harder than it sounds.</span></div></Abs>
      <Abs x={110} y={270} o={fade(f, a)}><div style={{fontFamily: HEAD, fontSize: 80, color: C.red}}>THE REAL PRESSURE: THE BILL</div></Abs>
      <div style={{position: 'absolute', left: 110, top: 420, display: 'flex', gap: 40, alignItems: 'center', opacity: fade(f, cx('biggerthan') - 4)}}>
        <div style={{background: C.panel, border: `5px solid ${C.red}`, borderRadius: 24, padding: '20px 30px'}}><div style={{fontFamily: HEAD, fontSize: 72, color: C.red}}>$1,142B</div><div style={{fontFamily: BODY, fontWeight: 700, fontSize: 28, color: C.cream}}>interest, FY2026</div></div>
        <div style={{fontFamily: HEAD, fontSize: 90, color: C.cream}}>&gt;</div>
        <div style={{background: C.panel, border: `5px solid ${C.slate}`, borderRadius: 24, padding: '20px 30px'}}><div style={{fontFamily: HEAD, fontSize: 72, color: C.cream}}>$1,069B</div><div style={{fontFamily: BODY, fontWeight: 700, fontSize: 28, color: C.cream}}>Medicare, FY2026</div></div>
      </div>
      <Abs x={110} y={700} o={fade(f, cx('dec15'))}><Pill o={1} size={40}>Next foreign-holdings report: Dec 15, 2026</Pill></Abs>
      <Abs x={110} y={810} o={fade(f, cx('chinaline'))}><div style={{fontFamily: BODY, fontWeight: 700, fontStyle: 'italic', fontSize: 38, color: C.amber}}>watch China's line ($563.9B in Sep)</div></Abs>
    </AbsoluteFill>
  );
};

const CTA: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill>
      <Abs x={110} y={130} w={1150}><div style={{fontFamily: HEAD, fontSize: 70, color: C.cream, lineHeight: 1.05}}>Who did you think owned <span style={{color: C.amber}}>most of America's debt?</span></div></Abs>
      <Abs x={110} y={360} o={fade(f, cx('comments'))}><Pill o={1} size={42}>Tell us in the comments ↓</Pill></Abs>
      <Abs x={110} y={480} o={fade(f, cx('follow'))}><div style={{fontFamily: HEAD, fontSize: 70, color: C.amber, transform: 'rotate(-2deg)'}}>"Follow the money."</div></Abs>
      {f >= cx('subscribe') - 4 && <SubButton at={cx('subscribe') - 4} x={110} y={610} size={58} />}
      <Abs x={110} y={780} w={1250} o={fade(f, cx('friday'))}><div style={{fontFamily: BODY, fontWeight: 700, fontSize: 36, color: C.cream}}>Friday: <span style={{color: C.mint}}>Nvidia without its founder - the money story</span></div></Abs>
      <Hero pose={f >= cx('subscribe') ? 'wave_happy' : f >= cx('follow') - 4 ? 'point_smile' : 'think_talk'} x={1580} y={1010} h={700} from={SEG[25] - 4} />
    </AbsoluteFill>
  );
};

const CHAPTERS = [
  {k: 'ch1', n: 1, title: 'The Pile'},
  {k: 'ch2', n: 2, title: 'The Empty Auction'},
  {k: 'ch3', n: 3, title: 'China Walks Away'},
  {k: 'ch4', n: 4, title: 'Rates Climb'},
  {k: 'ch5', n: 5, title: 'The Bill'},
  {k: 'ch6', n: 6, title: 'Who Really Owns It'},
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

// ---------- timeline ----------
type Sc = {from: number; el: React.ReactNode; src: string; glow?: string};
const SCENES: Sc[] = [
  {from: 0, el: <ColdOpen />, src: SRC.scen + ' · illustration', glow: '#3a2034'},
  {from: cx('real') - 6, el: <Hook />, src: SRC.ticr},
  {from: cx('ch1') - 6, el: <Pile />, src: SRC.penny},
  {from: cx('ch2') - 6, el: <Holders />, src: SRC.tic, glow: '#2d2440'},
  {from: SEG[7] - 6, el: <Custody />, src: SRC.tic},
  {from: cx('day2') - 6, el: <Day2 />, src: SRC.scen, glow: '#3a2034'},
  {from: cx('ch3') - 6, el: <China />, src: SRC.ticr, glow: '#3a1f24'},
  {from: SEG[11] - 6, el: <NotSoFast />, src: SRC.ticr + ' · Treasury press release, Nov 18, 2026'},
  {from: SEG[13] - 6, el: <SoftCTA />, src: ''},
  {from: cx('ch4') - 6, el: <RatesScen />, src: SRC.scen, glow: '#3a2034'},
  {from: cx('realnum') - 6, el: <RealRates />, src: SRC.rates, glow: '#16362e'},
  {from: cx('day21') - 6, el: <Day21 />, src: SRC.scen, glow: '#3a2034'},
  {from: cx('ch5') - 6, el: <Bill />, src: SRC.cbo + ' · per-day and 21¢ = our math'},
  {from: cx('ch6') - 6, el: <Owners />, src: SRC.mix, glow: '#16362e'},
  {from: cx('fun') - 6, el: <FedVs />, src: 'Sources: Fed holdings (FRED TREAST via govspending.org, week of Nov 18) · US Treasury TIC (Sep 2026)'},
  {from: SEG[23] - 6, el: <Close />, src: SRC.cbo + ' · next TIC release: Treasury, Nov 18, 2026'},
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

// ---------- thumbnail (1280x720 fallback: 1-3 big words, $ number in a red box, mascot in a corner) ----------
export const Thumb: React.FC = () => (
  <AbsoluteFill>
    <AbsoluteFill style={{background: 'radial-gradient(circle at 72% 45%, #6b3b1c, #0e1b2e 65%)'}} />
    <div style={{position: 'absolute', left: 50, top: 70, width: 640}}>
      <div style={{fontFamily: HEAD, fontSize: 150, color: C.cream, lineHeight: 0.95}}>NO</div>
      <div style={{fontFamily: HEAD, fontSize: 118, color: C.amber, lineHeight: 1.05}}>BUYERS?</div>
      <div style={{display: 'inline-block', marginTop: 40, background: C.red, color: '#fff', fontFamily: HEAD, fontSize: 120, padding: '4px 26px', borderRadius: 18, transform: 'rotate(-3deg)'}}>$9.2T</div>
    </div>
    <div style={{position: 'absolute', left: 820, top: 120, display: 'flex', flexDirection: 'column-reverse', gap: 0, transform: 'rotate(-4deg)', filter: 'drop-shadow(0 0 40px rgba(63,214,160,.35))'}}>
      {[0, 1, 2, 3, 4, 5].map((i) => <div key={i} style={{marginLeft: (i % 2) * 24 - 12}}><Bond w={280} crack={i === 3 ? 1 : 0} /></div>)}
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
