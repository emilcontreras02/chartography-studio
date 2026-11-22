// Chartography Top 10: the 10 Thanksgiving dinner prices that moved the most in 2026 (AFBF 41st survey, Nov 18, 2026).
// Story touch (PLAN v3): a Thanksgiving table fills up as each rank is revealed; Chip (the mascot) hosts.
import React from 'react';
import {AbsoluteFill, Audio, Composition, Img, interpolate, spring, staticFile, useCurrentFrame} from 'remotion';
import '@fontsource/archivo-black/latin-400.css';
import '@fontsource/fira-sans/latin-400.css';
import '@fontsource/fira-sans/latin-700.css';
import T from './timing.json';

const C = {bg: '#0e1b2e', panel: '#16283f', panel2: '#22365a', cream: '#f6f1e7', muted: '#afb8c6', slate: '#5c7392', mint: '#3fd6a0', amber: '#f2b544', coral: '#ff8a65', red: '#ff5d5d', wood: '#6b4a2f', wood2: '#5a3d26'};
const HEAD = "'Archivo Black', sans-serif";
const BODY = "'Fira Sans', sans-serif";
const FPS = 30;
const fr = (s: number) => Math.round(s * FPS);
const clamp = {extrapolateLeft: 'clamp' as const, extrapolateRight: 'clamp' as const};
const X = (T as unknown as {x: Record<string, number>}).x;
const cx = (k: string) => fr(X[k]);
const SEG = T.seg.map(fr);
const END = fr(T.dur + 2.0);
const SOURCE = 'Source: American Farm Bureau Federation, 41st Thanksgiving Dinner Cost Survey (prices checked early Nov, released Nov 18, 2026) · fb.org';

type Item = {rank: number; name: string; size: string; price: string; pct: number; icon: string; viz: string};
const ITEMS: Item[] = [
  {rank: 10, name: 'Pumpkin pie mix', size: '30-oz can', price: '$4.24', pct: 1.9, icon: 'can', viz: 'rule'},
  {rank: 9, name: 'Frozen peas', size: '1-lb bag', price: '$1.99', pct: -2.0, icon: 'peas', viz: 'dots'},
  {rank: 8, name: 'Pie crusts', size: '2 frozen crusts', price: '$3.28', pct: -2.7, icon: 'crust', viz: 'pie'},
  {rank: 7, name: 'Veggie tray', size: '1 lb carrots & celery', price: '$1.31', pct: -3.7, icon: 'tray', viz: 'cheapest'},
  {rank: 6, name: 'Sweet potatoes', size: '3 lb', price: '$4.20', pct: 5.0, icon: 'potato', viz: 'stairs'},
  {rank: 5, name: 'Stuffing mix', size: '14-oz bag, cubed', price: '$3.91', pct: 5.4, icon: 'box', viz: 'balance'},
  {rank: 4, name: 'Dinner rolls', size: '1 dozen', price: '$3.81', pct: 7.0, icon: 'rolls', viz: 'chain'},
  {rank: 3, name: 'Whole milk', size: '1 gallon', price: '$4.05', pct: 8.6, icon: 'milk', viz: 'tag'},
  {rank: 2, name: 'Cranberries', size: '12-oz bag, fresh', price: '$2.48', pct: 8.8, icon: 'cran', viz: 'duel'},
  {rank: 1, name: 'Turkey', size: '16-lb frozen bird', price: '$23.68', pct: 10.1, icon: 'turkey', viz: 'share'},
];
const startOf = (it: Item) => cx(`s${it.rank}`) - 8;
const twistStart = SEG[15];
const recapStart = SEG[16];
const ctaStart = SEG[17];
const col = (p: number) => (p > 0 ? C.coral : C.mint);
const pctTxt = (p: number) => `${p > 0 ? '+' : '-'}${Math.abs(p).toFixed(1)}%`;

const sp = (f: number, from: number, stiff = 140) => spring({frame: f - from, fps: FPS, config: {damping: 13, stiffness: stiff}});
const fade = (f: number, from: number, len = 10) => interpolate(f, [from, from + len], [0, 1], clamp);

// ---------- shared ----------
const Background: React.FC<{w?: number; h?: number}> = ({w = 1920, h = 1080}) => {
  const f = useCurrentFrame();
  const dots = Array.from({length: 50}, (_, i) => {
    const x = (i * 347) % w, y = ((i * 211) % h + f * (0.12 + (i % 5) * 0.05)) % h;
    return <circle key={i} cx={x} cy={h - y} r={1.5 + (i % 3)} fill={i % 7 === 0 ? C.amber : '#fff'} opacity={0.05 + (i % 4) * 0.02} />;
  });
  return (
    <AbsoluteFill style={{background: `radial-gradient(circle at 35% 25%, #24395a, ${C.bg} 70%)`}}>
      <svg width={w} height={h}>{dots}</svg>
    </AbsoluteFill>
  );
};

const Hero: React.FC<{pose: string; x: number; y: number; h: number; from?: number; flip?: boolean}> = ({pose, x, y, h, from = 0, flip}) => {
  const f = useCurrentFrame();
  const s = sp(f, from, 170);
  const w = h * 0.6;
  return (
    <Img src={staticFile(`sprites/hero_${pose}.png`)} style={{
      position: 'absolute', left: x - w / 2, top: y - h + Math.sin(f / 7) * 4 + (1 - s) * 60, width: w, height: h,
      transform: `scale(${flip ? -s : s}, ${s})`, transformOrigin: '50% 100%', filter: 'drop-shadow(0 14px 14px rgba(0,0,0,.35))',
    }} />
  );
};

const Brand: React.FC = () => (
  <div style={{position: 'absolute', top: 30, left: 60, fontFamily: HEAD, fontSize: 26, letterSpacing: 4, color: C.cream, opacity: 0.85}}>CHART<span style={{color: C.amber}}>OGRAPHY</span></div>
);
const Source: React.FC = () => (
  <div style={{position: 'absolute', bottom: 16, left: 60, right: 60, textAlign: 'center', fontFamily: BODY, fontSize: 20, color: C.muted, opacity: 0.9}}>{SOURCE}</div>
);
const Pill: React.FC<{children: React.ReactNode; o: number; bg?: string; color?: string; size?: number; style?: React.CSSProperties}> = ({children, o, bg = C.amber, color = C.bg, size = 36, style}) => (
  <div style={{display: 'inline-block', opacity: o, transform: `scale(${0.85 + 0.15 * o})`, transformOrigin: 'left center', background: bg, color, fontFamily: HEAD, fontSize: size, padding: '10px 24px', borderRadius: 18, ...style}}>{children}</div>
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
        return <span key={i} style={{display: 'inline-block', margin: '0 6px', padding: '0 8px', borderRadius: 10, background: on ? C.amber : 'transparent', color: on ? C.bg : '#fff', WebkitTextStroke: on ? '0px' : `8px ${C.bg}`}}>{w[0] as string}</span>;
      })}
    </div>
  );
};

// ---------- food icons (simple flat shapes, no brands) ----------
const Icon: React.FC<{kind: string; s?: number}> = ({kind, s = 90}) => {
  const v = (el: React.ReactNode) => <svg width={s} height={s} viewBox="0 0 100 100">{el}</svg>;
  switch (kind) {
    case 'can': return v(<g><rect x={22} y={14} width={56} height={74} rx={8} fill="#e8893a" /><rect x={22} y={36} width={56} height={30} fill={C.cream} /><circle cx={50} cy={51} r={10} fill="#e8893a" /><rect x={47} y={38} width={6} height={6} fill="#4f7a3a" /></g>);
    case 'peas': return v(<g><path d="M20 20 H80 L76 88 H24 Z" fill="#3e8f5a" /><rect x={20} y={14} width={60} height={10} rx={3} fill="#2f6e45" />{[0, 1, 2, 3, 4].map((i) => <circle key={i} cx={32 + i * 9} cy={56 + (i % 2) * 8} r={7} fill="#8fd16a" />)}</g>);
    case 'crust': return v(<g><ellipse cx={50} cy={60} rx={42} ry={18} fill="#c99757" /><ellipse cx={50} cy={54} rx={36} ry={13} fill="#e7c48e" /><ellipse cx={50} cy={44} rx={42} ry={18} fill="#c99757" opacity={0.0} /></g>);
    case 'tray': return v(<g><ellipse cx={50} cy={66} rx={44} ry={18} fill="#9fb4c8" />{[0, 1, 2, 3].map((i) => <rect key={i} x={20 + i * 14} y={34} width={8} height={34} rx={4} fill={i % 2 ? '#7cc36a' : '#f08a30'} transform={`rotate(${-12 + i * 8} ${24 + i * 14} 68)`} />)}</g>);
    case 'potato': return v(<g><ellipse cx={46} cy={58} rx={34} ry={18} fill="#b5562f" transform="rotate(-18 46 58)" /><ellipse cx={62} cy={48} rx={22} ry={13} fill="#c86a3c" transform="rotate(20 62 48)" /></g>);
    case 'box': return v(<g><rect x={24} y={18} width={52} height={70} rx={6} fill="#d1a14b" /><rect x={30} y={36} width={40} height={26} rx={4} fill={C.cream} />{[0, 1, 2].map((i) => <rect key={i} x={36 + i * 11} y={44} width={8} height={8} fill="#c4873c" />)}</g>);
    case 'rolls': return v(<g>{[[30, 60], [52, 52], [72, 62], [42, 72], [62, 74]].map(([x, y], i) => <ellipse key={i} cx={x} cy={y} rx={16} ry={12} fill={i % 2 ? '#d8a05a' : '#c98d47'} />)}</g>);
    case 'milk': return v(<g><path d="M32 22 H62 L74 36 V88 H26 V36 Z" fill="#eef2f6" /><rect x={40} y={10} width={16} height={12} rx={3} fill="#4b8fd6" /><rect x={26} y={52} width={48} height={18} fill="#4b8fd6" /></g>);
    case 'cran': return v(<g><path d="M24 22 H76 L72 88 H28 Z" fill="#f3e6e6" opacity={0.85} />{[[38, 50], [52, 46], [64, 54], [44, 64], [58, 68], [36, 76], [62, 80], [50, 80]].map(([x, y], i) => <circle key={i} cx={x} cy={y} r={7} fill="#c8233f" />)}</g>);
    case 'turkey': return v(<g><ellipse cx={50} cy={60} rx={36} ry={24} fill="#b8743c" /><ellipse cx={42} cy={52} rx={18} ry={9} fill="#d79a5c" /><rect x={14} y={64} width={18} height={8} rx={4} fill="#a3652f" transform="rotate(-25 23 68)" /><rect x={68} y={64} width={18} height={8} rx={4} fill="#a3652f" transform="rotate(25 77 68)" /><circle cx={14} cy={74} r={6} fill={C.cream} /><circle cx={86} cy={74} r={6} fill={C.cream} /></g>);
    default: return null;
  }
};

// ---------- the Thanksgiving table (fills as ranks are revealed) ----------
const TABLE_L = 90, TABLE_W = 1290, TABLE_Y = 790;
const Table: React.FC<{cur: number}> = ({cur}) => {
  const f = useCurrentFrame();
  return (
    <div style={{position: 'absolute', left: TABLE_L, top: TABLE_Y, width: TABLE_W, height: 130}}>
      <div style={{position: 'absolute', left: 0, right: 0, top: 70, height: 26, background: C.wood, borderRadius: 8}} />
      <div style={{position: 'absolute', left: 0, right: 0, top: 96, height: 12, background: C.wood2, borderRadius: '0 0 8px 8px'}} />
      {ITEMS.map((it, i) => {
        const at = cx(`v${it.rank}`);
        if (f < at - 2) return null;
        const s = sp(f, at, 180);
        const active = i === cur;
        return (
          <div key={it.rank} style={{position: 'absolute', left: 10 + i * 127, top: 0, width: 120, textAlign: 'center', transform: `translateY(${(1 - s) * -60}px)`, opacity: Math.min(1, s * 1.4)}}>
            <div style={{display: 'flex', justifyContent: 'center'}}><Icon kind={it.icon} s={active ? 82 : 70} /></div>
            <div style={{position: 'absolute', top: -26, left: 18, right: 18, background: col(it.pct), borderRadius: 10, fontFamily: HEAD, fontSize: 19, color: C.bg, padding: '2px 0', outline: active ? `3px solid ${C.cream}` : 'none'}}>{pctTxt(it.pct)}</div>
          </div>
        );
      })}
    </div>
  );
};

// ---------- rank ladder (right) ----------
const Ladder: React.FC<{cur: number}> = ({cur}) => {
  const f = useCurrentFrame();
  return (
    <div style={{position: 'absolute', right: 40, top: 86, width: 380, opacity: fade(f, cx('h_ten') - 6)}}>
      <div style={{fontFamily: BODY, fontWeight: 700, fontSize: 21, color: C.muted, letterSpacing: 2, marginBottom: 8}}>BIGGEST PRICE MOVES · 2026</div>
      {[...ITEMS].reverse().map((it) => {
        const i = ITEMS.indexOf(it);
        const shown = cur >= 0 && f >= startOf(it);
        const active = i === cur;
        return (
          <div key={it.rank} style={{display: 'flex', alignItems: 'center', height: 62, marginBottom: 8, borderRadius: 14, padding: '0 14px',
            background: active ? C.amber : shown ? C.panel : 'rgba(255,255,255,0.05)', border: shown || active ? 'none' : '2px dashed rgba(255,255,255,0.12)'}}>
            <div style={{fontFamily: HEAD, fontSize: 27, width: 66, color: active ? C.bg : C.amber}}>#{it.rank}</div>
            <div style={{flex: 1, fontFamily: BODY, fontWeight: 700, fontSize: 25, color: active ? C.bg : C.cream, whiteSpace: 'nowrap'}}>{shown ? it.name : '? ? ?'}</div>
            {shown && <div style={{fontFamily: HEAD, fontSize: 22, color: active ? C.bg : col(it.pct)}}>{pctTxt(it.pct)}</div>}
          </div>
        );
      })}
    </div>
  );
};

// ---------- hook ----------
const Intro: React.FC = () => {
  const f = useCurrentFrame();
  const tt = cx('h_ten');
  return (
    <div style={{position: 'absolute', left: 90, top: 120, width: 1340, textAlign: 'center'}}>
      <div style={{transform: `scale(${sp(f, 2)})`, fontFamily: HEAD, fontSize: 170, color: C.mint, lineHeight: 1}}>$58.63</div>
      <div style={{transform: `scale(${sp(f, fr(2.6))})`, fontFamily: HEAD, fontSize: 66, color: C.cream, marginTop: 8, whiteSpace: 'nowrap'}}>THANKSGIVING DINNER FOR 10</div>
      <div style={{opacity: fade(f, SEG[1] + fr(4.5)), marginTop: 16}}><Pill o={1} bg={C.coral} size={46}>UP MORE THAN 6% · 2026</Pill></div>
      <div style={{opacity: fade(f, SEG[1] + fr(13.5)), fontFamily: BODY, fontWeight: 700, fontSize: 40, color: C.cream, marginTop: 22}}>1 item jumped most · 4 got <span style={{color: C.mint}}>cheaper</span></div>
      <div style={{opacity: fade(f, tt), marginTop: 26, transform: `translateY(${(1 - sp(f, tt)) * 30}px)`}}>
        <div style={{fontFamily: HEAD, fontSize: 64, color: C.amber}}>THE 10 PRICES THAT MOVED MOST</div>
        <div style={{fontFamily: BODY, fontSize: 32, color: C.muted, marginTop: 4}}>ranked by % change vs 2025, up or down · AFBF survey, Nov 18, 2026</div>
      </div>
    </div>
  );
};

// ---------- item visuals (area: 1290 x ~300) ----------
const Rule: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <div style={{display: 'flex', gap: 30}}>
      <div style={{width: 760, background: C.panel, borderRadius: 24, padding: '22px 30px', border: `3px solid ${C.amber}`, opacity: fade(f, cx('rule10'))}}>
        <div style={{fontFamily: HEAD, fontSize: 36, color: C.amber}}>THE RULE</div>
        <div style={{fontFamily: BODY, fontWeight: 700, fontSize: 34, color: C.cream, marginTop: 8}}>Ranked by how much the price moved since 2025, up or down</div>
        <div style={{display: 'flex', gap: 20, marginTop: 14}}>
          <Pill o={fade(f, cx('red10'))} bg={C.coral} size={30}>▲ JUMPS</Pill>
          <Pill o={fade(f, cx('green10'))} bg={C.mint} size={30}>▼ DROPS</Pill>
        </div>
      </div>
      <div style={{width: 400, background: C.panel, borderRadius: 24, padding: '22px 26px', opacity: fade(f, cx('eleven')), border: `3px dashed ${C.slate}`}}>
        <div style={{fontFamily: BODY, fontWeight: 700, fontSize: 26, color: C.muted}}>JUST MISSED · #11</div>
        <div style={{fontFamily: HEAD, fontSize: 38, color: C.cream, marginTop: 6}}>Whipping cream</div>
        <div style={{fontFamily: HEAD, fontSize: 60, color: C.mint}}>-1.6%</div>
        <div style={{fontFamily: BODY, fontSize: 24, color: C.muted}}>half pint · $1.84</div>
      </div>
    </div>
  );
};

const Dots: React.FC = () => {
  const f = useCurrentFrame();
  const four = cx('four9');
  const down = [1, 4, 7, 10]; // 4 of the survey's 12 items got cheaper
  return (
    <div style={{display: 'flex', gap: 40, alignItems: 'center'}}>
      <Pill o={fade(f, cx('under9'))} bg={C.panel2} color={C.cream} size={40}>under $2</Pill>
      <div style={{opacity: fade(f, four - 4)}}>
        <div style={{fontFamily: BODY, fontWeight: 700, fontSize: 28, color: C.muted, marginBottom: 10}}>THE SURVEY'S 12 ITEMS</div>
        <div style={{display: 'flex', gap: 12}}>
          {Array.from({length: 12}, (_, i) => {
            const d = down.includes(i);
            return <div key={i} style={{width: 56, height: 56, borderRadius: 28, background: d ? C.mint : C.slate, transform: `scale(${d ? 0.7 + 0.3 * sp(f, four + down.indexOf(i) * 5) : 1})`, opacity: d ? 1 : 0.6}} />;
          })}
        </div>
        <div style={{fontFamily: HEAD, fontSize: 38, color: C.mint, marginTop: 12, opacity: fade(f, four + 18)}}>only 4 got cheaper</div>
      </div>
    </div>
  );
};

const Pie: React.FC = () => {
  const f = useCurrentFrame();
  const u = cx('up8'), d = cx('down8');
  const half = (fill: string, side: 'L' | 'R', at: number, label: string, pct: string) => (
    <div style={{textAlign: 'center', opacity: fade(f, at), transform: `translateX(${(1 - sp(f, at)) * (side === 'L' ? -40 : 40)}px)`}}>
      <svg width={260} height={170} viewBox="0 0 260 170">
        {side === 'L' ? <path d="M250 150 A120 120 0 0 0 10 150 Z" fill={fill} /> : <path d="M10 150 A120 120 0 0 1 250 150 Z" fill="none" stroke={fill} strokeWidth={22} />}
      </svg>
      <div style={{fontFamily: BODY, fontWeight: 700, fontSize: 30, color: C.cream}}>{label}</div>
      <div style={{fontFamily: HEAD, fontSize: 54, color: pct.startsWith('+') ? C.coral : C.mint}}>{pct}</div>
    </div>
  );
  return (
    <div style={{display: 'flex', alignItems: 'center', gap: 50}}>
      <div style={{fontFamily: HEAD, fontSize: 40, color: C.amber, width: 300, opacity: fade(f, cx('pie8'))}}>YOUR PUMPKIN PIE:</div>
      {half('#e8893a', 'L', u, 'the filling (#10)', '+1.9%')}
      {half('#e7c48e', 'R', d, 'the crust (#8)', '-2.7%')}
    </div>
  );
};

const Cheapest: React.FC = () => {
  const f = useCurrentFrame();
  const at = cx('cheap7');
  const rows: [string, number][] = [['Veggie tray', 1.31], ['Whipping cream', 1.84], ['Frozen peas', 1.99], ['Cranberries', 2.48], ['Pie crusts', 3.28]];
  return (
    <div style={{display: 'flex', gap: 40}}>
      <div style={{opacity: fade(f, at - 4)}}>
        <div style={{fontFamily: BODY, fontWeight: 700, fontSize: 26, color: C.muted, marginBottom: 6}}>CHEAPEST ITEMS ON THE TABLE</div>
        {rows.map(([n, v], k) => {
          const g = interpolate(f, [at + k * 4, at + k * 4 + 16], [0, 1], clamp);
          return (
            <div key={n} style={{display: 'flex', alignItems: 'center', height: 44, marginBottom: 4}}>
              <div style={{width: 230, fontFamily: BODY, fontWeight: 700, fontSize: 26, color: k === 0 ? C.mint : C.cream}}>{n}</div>
              <div style={{width: (v / 3.28) * 420 * g, height: 30, borderRadius: 8, background: k === 0 ? C.mint : C.slate}} />
              <div style={{marginLeft: 12, fontFamily: HEAD, fontSize: 26, color: k === 0 ? C.mint : C.cream, opacity: g}}>${v.toFixed(2)}</div>
            </div>
          );
        })}
      </div>
      <div style={{alignSelf: 'center'}}><Pill o={fade(f, cx('drop7'))} bg={C.mint} size={38} style={{whiteSpace: 'nowrap'}}>BIGGEST DROP OF 2026</Pill></div>
    </div>
  );
};

const Stairs: React.FC = () => {
  const f = useCurrentFrame();
  const vals = [5.0, 5.4, 7.0, 8.6, 8.8, 10.1];
  const six = cx('six6'), big = cx('big6');
  return (
    <div style={{display: 'flex', alignItems: 'flex-end', gap: 18, height: 300}}>
      <div style={{width: 400, alignSelf: 'center', marginRight: 20}}>
        <Pill o={fade(f, cx('nodrops') + 4)} bg={C.panel2} color={C.cream} size={30}>no more drops</Pill>
        <div style={{fontFamily: HEAD, fontSize: 36, color: C.coral, marginTop: 16, whiteSpace: 'nowrap', opacity: fade(f, six)}}>6 JUMPS IN A ROW</div>
        <div style={{fontFamily: BODY, fontWeight: 700, fontSize: 28, color: C.muted, marginTop: 6, opacity: fade(f, big)}}>each bigger than the last</div>
      </div>
      {vals.map((v, k) => {
        const at = k === 0 ? cx('p6') : six + 6 + k * 5;
        const g = sp(f, at);
        return (
          <div key={k} style={{textAlign: 'center'}}>
            <div style={{fontFamily: HEAD, fontSize: 26, color: k === 0 ? C.coral : C.muted, opacity: g}}>{k === 0 ? '+5.0%' : `#${6 - k}`}</div>
            <div style={{width: 110, height: v * 22 * g, background: k === 0 ? C.coral : C.slate, borderRadius: '10px 10px 0 0', opacity: k === 0 ? 1 : 0.7}} />
          </div>
        );
      })}
    </div>
  );
};

const Balance: React.FC = () => {
  const f = useCurrentFrame();
  const t = cx('tied5'), p = cx('pic5'), pb = cx('pic5b');
  const tilt = interpolate(f, [pb + 6, pb + 26], [0, -7], clamp);
  if (f < p - 4) {
    return (
      <div style={{opacity: fade(f, t - 4)}}>
        {[['Stuffing mix (#5)', 5.4, C.coral], ['Sweet potatoes (#6)', 5.0, C.slate]].map(([n, v, c], k) => (
          <div key={k} style={{display: 'flex', alignItems: 'center', height: 70, marginBottom: 8}}>
            <div style={{width: 330, fontFamily: BODY, fontWeight: 700, fontSize: 30, color: C.cream}}>{n as string}</div>
            <div style={{width: (v as number) * 120 * interpolate(f, [t, t + 20], [0, 1], clamp), height: 48, background: c as string, borderRadius: 10}} />
            <div style={{marginLeft: 14, fontFamily: HEAD, fontSize: 36, color: c as string}}>+{(v as number).toFixed(1)}%</div>
          </div>
        ))}
        <Pill o={fade(f, t + 20)} size={32}>less than half a point apart</Pill>
      </div>
    );
  }
  return (
    <div style={{position: 'relative', width: 900, height: 300, opacity: fade(f, p - 4)}}>
      <div style={{position: 'absolute', left: 430, top: 150, width: 40, height: 130, background: C.slate, borderRadius: 8}} />
      <div style={{position: 'absolute', left: 60, top: 140, width: 780, height: 14, background: C.cream, borderRadius: 7, transform: `rotate(${tilt}deg)`, transformOrigin: '50% 50%'}}>
        <div style={{position: 'absolute', left: -20, top: -120, width: 260, textAlign: 'center'}}>
          <div style={{display: 'flex', justifyContent: 'center'}}><Icon kind="box" s={90} /></div>
          <div style={{fontFamily: HEAD, fontSize: 32, color: C.coral}}>$3.91</div>
        </div>
        <div style={{position: 'absolute', right: -20, top: -120, width: 300, textAlign: 'center', opacity: fade(f, pb)}}>
          <div style={{display: 'flex', justifyContent: 'center'}}><Icon kind="cran" s={80} /><Icon kind="tray" s={80} /></div>
          <div style={{fontFamily: HEAD, fontSize: 28, color: C.cream}}>$2.48 + $1.31</div>
        </div>
      </div>
      <div style={{position: 'absolute', left: 0, top: 230}}><Pill o={fade(f, pb + 26)} size={30}>1 bag of stuffing &gt; cranberries + veggie tray</Pill></div>
    </div>
  );
};

const Chain: React.FC = () => {
  const f = useCurrentFrame();
  const steps: [string, number][] = [['FARM', cx('why4')], ['FUEL', cx('c_fuel')], ['PROCESSING', cx('c_fuel') + 12], ['PACKAGING', cx('c_pack')], ['TRANSPORT', cx('c_pack') + 14], ['YOUR TABLE', cx('c_pack') + 26]];
  return (
    <div>
      <div style={{fontFamily: BODY, fontWeight: 700, fontSize: 28, color: C.muted, opacity: fade(f, cx('why4') - 4), marginBottom: 14}}>WHY? THE FARM BUREAU POINTS TO COSTS ALONG THE WAY</div>
      <div style={{display: 'flex', alignItems: 'center', gap: 10}}>
        {steps.map(([s, at], k) => (
          <React.Fragment key={s}>
            <div style={{padding: '18px 18px', borderRadius: 16, background: k === 0 || k === 5 ? C.panel2 : C.coral, color: k === 0 || k === 5 ? C.cream : C.bg, fontFamily: HEAD, fontSize: 25, opacity: fade(f, at), transform: `scale(${0.8 + 0.2 * sp(f, at)})`}}>{s}</div>
            {k < steps.length - 1 && <div style={{fontFamily: HEAD, fontSize: 30, color: C.muted, opacity: fade(f, at + 4)}}>→</div>}
          </React.Fragment>
        ))}
      </div>
      <div style={{marginTop: 22}}><Pill o={fade(f, cx('bread4'))} bg={C.panel2} color={C.cream} size={30}>bread twice: stuffing +5.4% · rolls +7.0%</Pill></div>
    </div>
  );
};

const Tag: React.FC<{it: Item}> = ({it}) => {
  const f = useCurrentFrame();
  const swing = Math.sin(f / 9) * 4;
  return (
    <div style={{display: 'flex', alignItems: 'center', gap: 50}}>
      <div style={{transform: `rotate(${swing - 6}deg)`, transformOrigin: '0% 50%', opacity: fade(f, cx('v3'))}}>
        <div style={{position: 'relative', width: 420, height: 200, background: C.cream, borderRadius: '24px 24px 24px 24px', clipPath: 'polygon(14% 0, 100% 0, 100% 100%, 14% 100%, 0 50%)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', paddingLeft: 50}}>
          <div style={{fontFamily: HEAD, fontSize: 84, color: C.bg, lineHeight: 1}}>{it.price}</div>
          <div style={{fontFamily: BODY, fontWeight: 700, fontSize: 28, color: C.slate}}>{it.size}</div>
        </div>
      </div>
      <div style={{width: 560}}>
        <Pill o={fade(f, cx('why3'))} bg={C.panel2} color={C.cream} size={30}>AFBF: demand for powdered protein made from milk</Pill>
      </div>
    </div>
  );
};

const Duel: React.FC = () => {
  const f = useCurrentFrame();
  const rows: [string, number, number][] = [['Whole milk (#3)', 8.6, cx('s2')], ['Cranberries (#2)', 8.8, cx('p2')]];
  return (
    <div>
      {rows.map(([n, v, at], k) => {
        const g = interpolate(f, [at, at + 22], [0, 1], clamp);
        return (
          <div key={k} style={{display: 'flex', alignItems: 'center', height: 74, marginBottom: 6, opacity: fade(f, at)}}>
            <div style={{width: 300, fontFamily: BODY, fontWeight: 700, fontSize: 30, color: C.cream}}>{n}</div>
            <div style={{width: v * 72 * g, height: 52, borderRadius: 10, background: k === 1 ? C.coral : C.slate}} />
            <div style={{marginLeft: 14, fontFamily: HEAD, fontSize: 38, color: k === 1 ? C.coral : C.cream}}>+{v.toFixed(1)}%</div>
          </div>
        );
      })}
      <div style={{display: 'flex', gap: 20, marginTop: 12}}>
        <Pill o={fade(f, cx('why2'))} bg={C.panel2} color={C.cream} size={28}>AFBF: high fuel costs for harvest + transport</Pill>
        <Pill o={fade(f, cx('tie2'))} size={28}>0.2 points apart</Pill>
      </div>
    </div>
  );
};

const Share: React.FC = () => {
  const f = useCurrentFrame();
  const sh = cx('share1'), hf = cx('half'), ex = cx('exp');
  if (f >= ex - 6) {
    const card = (t: string, v: string, c: string, at: number, sub: string) => (
      <div style={{width: 380, background: C.panel, borderRadius: 24, padding: '20px 26px', border: `4px solid ${c}`, opacity: fade(f, at), transform: `translateY(${(1 - sp(f, at)) * 30}px)`}}>
        <div style={{fontFamily: BODY, fontWeight: 700, fontSize: 26, color: C.muted}}>{t}</div>
        <div style={{fontFamily: HEAD, fontSize: 70, color: c, lineHeight: 1.05}}>{v}</div>
        <div style={{fontFamily: BODY, fontSize: 24, color: C.muted}}>{sub}</div>
      </div>
    );
    return (
      <div style={{display: 'flex', gap: 30}}>
        {card('EXPANDED MENU', '$81.72', C.amber, ex, '+ ham, potatoes, green beans')}
        {card('NORTHEAST', '$61.57', C.coral, cx('ne'), 'classic dinner for 10')}
        {card('SOUTH', '$54.33', C.mint, cx('south'), 'classic dinner for 10')}
      </div>
    );
  }
  const g = interpolate(f, [sh, sh + 30], [0, 1], clamp);
  const full = 1100;
  return (
    <div>
      <div style={{display: 'flex', gap: 24, marginBottom: 20}}>
        <Pill o={fade(f, cx('lb1'))} bg={C.panel2} color={C.cream} size={32}>$1.48 a pound</Pill>
        <Pill o={fade(f, cx('why1'))} bg={C.panel2} color={C.cream} size={28}>AFBF: higher production costs + a flock still recovering</Pill>
      </div>
      <div style={{opacity: fade(f, sh - 4)}}>
        <div style={{fontFamily: BODY, fontWeight: 700, fontSize: 26, color: C.muted, marginBottom: 8}}>THE WHOLE CLASSIC DINNER FOR 10: $58.63</div>
        <div style={{position: 'relative', width: full, height: 74, background: C.panel2, borderRadius: 12, overflow: 'hidden'}}>
          <div style={{width: (23.68 / 58.63) * full * g, height: 74, background: C.coral}} />
          <div style={{position: 'absolute', left: 20, top: 14, fontFamily: HEAD, fontSize: 36, color: C.bg, opacity: fade(f, sh + 20)}}>TURKEY $23.68</div>
          <div style={{position: 'absolute', right: 20, top: 14, fontFamily: HEAD, fontSize: 36, color: C.cream, opacity: fade(f, sh + 26)}}>everything else</div>
          <div style={{position: 'absolute', left: full / 2 - 2, top: 0, width: 4, height: 74, background: C.cream, opacity: fade(f, hf - 30) * 0.8}} />
        </div>
        <div style={{display: 'flex', marginTop: 8}}>
          <div style={{marginLeft: full / 2 - 60, fontFamily: BODY, fontWeight: 700, fontSize: 24, color: C.cream, opacity: fade(f, hf - 30)}}>half</div>
        </div>
      </div>
    </div>
  );
};

const ItemCard: React.FC<{i: number}> = ({i}) => {
  const f = useCurrentFrame();
  const it = ITEMS[i];
  const t0 = startOf(it);
  const a = sp(f, t0), b = sp(f, t0 + 12);
  const vc = cx(`v${it.rank}`), pc = cx(`p${it.rank}`);
  let viz: React.ReactNode = null;
  if (it.viz === 'rule') viz = <Rule />;
  else if (it.viz === 'dots') viz = <Dots />;
  else if (it.viz === 'pie') viz = <Pie />;
  else if (it.viz === 'cheapest') viz = <Cheapest />;
  else if (it.viz === 'stairs') viz = <Stairs />;
  else if (it.viz === 'balance') viz = <Balance />;
  else if (it.viz === 'chain') viz = <Chain />;
  else if (it.viz === 'tag') viz = <Tag it={it} />;
  else if (it.viz === 'duel') viz = <Duel />;
  else if (it.viz === 'share') viz = <Share />;
  return (
    <div style={{position: 'absolute', left: 90, top: 86, width: 1330}}>
      <div style={{display: 'flex', alignItems: 'center', gap: 26, transform: `translateX(${(1 - a) * -80}px)`, opacity: a}}>
        <div style={{fontFamily: HEAD, fontSize: 150, color: C.amber, lineHeight: 0.9}}>#{it.rank}</div>
        <Icon kind={it.icon} s={120} />
        <div>
          <div style={{fontFamily: HEAD, fontSize: 76, color: C.cream, lineHeight: 1}}>{it.name}</div>
          <div style={{opacity: b, fontFamily: BODY, fontWeight: 700, fontSize: 34, color: C.muted, marginTop: 6}}>{it.size}</div>
        </div>
      </div>
      <div style={{display: 'flex', alignItems: 'baseline', gap: 28, marginTop: 14, height: 110}}>
        <div style={{fontFamily: HEAD, fontSize: 96, color: col(it.pct), lineHeight: 1, opacity: fade(f, pc), transform: `scale(${0.8 + 0.2 * sp(f, pc)})`, transformOrigin: 'left'}}>{pctTxt(it.pct)}</div>
        <div style={{fontFamily: HEAD, fontSize: 60, color: C.cream, opacity: fade(f, vc)}}>{it.price}</div>
        <div style={{fontFamily: BODY, fontSize: 26, color: C.muted, opacity: fade(f, pc)}}>vs 2025 survey</div>
      </div>
      <div style={{marginTop: 18, height: 310}}>{viz}</div>
    </div>
  );
};

// ---------- twist ----------
const Twist: React.FC = () => {
  const f = useCurrentFrame();
  const t0 = twistStart;
  const n = interpolate(f, [cx('tw586'), cx('tw586') + 24], [0, 5.86], clamp);
  const usda = cx('twusda');
  const g = interpolate(f, [cx('tw6c'), cx('tw6c') + 30], [0, 1], clamp);
  const W = 1500;
  return (
    <div style={{position: 'absolute', left: 90, top: 80, width: 1740}}>
      <div style={{transform: `scale(${sp(f, t0)})`, transformOrigin: 'left', fontFamily: HEAD, fontSize: 72, color: C.amber}}>THE TWIST</div>
      {f < usda - 6 ? (
        <div style={{display: 'flex', gap: 50, marginTop: 30, alignItems: 'center'}}>
          <div style={{background: C.panel, borderRadius: 28, padding: '30px 46px', border: `4px solid ${C.mint}`, opacity: fade(f, cx('tw586') - 6)}}>
            <div style={{fontFamily: BODY, fontWeight: 700, fontSize: 32, color: C.muted}}>PER PERSON</div>
            <div style={{fontFamily: HEAD, fontSize: 150, color: C.mint, lineHeight: 1}}>${n.toFixed(2)}</div>
            <div style={{fontFamily: BODY, fontSize: 28, color: C.muted}}>about · $58.63 ÷ 10</div>
          </div>
          <div style={{opacity: fade(f, cx('tw542'))}}>
            <div style={{fontFamily: HEAD, fontSize: 64, color: C.cream}}>$5.42 BELOW</div>
            <div style={{fontFamily: BODY, fontWeight: 700, fontSize: 36, color: C.muted, marginTop: 6}}>the 2022 record</div>
            <div style={{position: 'relative', display: 'inline-block', fontFamily: HEAD, fontSize: 84, color: C.amber, marginTop: 10, opacity: fade(f, cx('tw6405'))}}>$64.05</div>
          </div>
        </div>
      ) : (
        <div style={{marginTop: 30, opacity: fade(f, usda - 6)}}>
          <div style={{fontFamily: HEAD, fontSize: 52, color: C.cream}}>EVERY $1 YOU SPEND ON FOOD</div>
          <div style={{display: 'flex', width: W, height: 120, marginTop: 20, borderRadius: 16, overflow: 'hidden'}}>
            <div style={{width: W * 0.055 * g + 6, background: C.mint}} />
            <div style={{flex: 1, background: C.slate, opacity: fade(f, cx('twrest')), display: 'flex', alignItems: 'center', paddingLeft: 30, fontFamily: HEAD, fontSize: 36, color: C.bg}}>processing · packaging · transport · the store</div>
          </div>
          <div style={{display: 'flex', gap: 30, marginTop: 20, alignItems: 'center'}}>
            <Pill o={fade(f, cx('tw6c') + 10)} bg={C.mint} size={44}>less than 6¢ → the farm</Pill>
            <div style={{fontFamily: BODY, fontSize: 28, color: C.muted, opacity: fade(f, cx('tw6c') + 10)}}>USDA estimate, cited by AFBF</div>
          </div>
          <div style={{fontFamily: HEAD, fontSize: 50, color: C.amber, marginTop: 34, opacity: fade(f, cx('twrich'))}}>Pricier turkey does NOT mean a richer farmer</div>
        </div>
      )}
    </div>
  );
};

// ---------- recap: diverging bars ----------
const Recap: React.FC = () => {
  const f = useCurrentFrame();
  const zero = 640, unit = 62;
  const sorted = [...ITEMS].sort((a, b) => b.pct - a.pct);
  return (
    <div style={{position: 'absolute', left: 90, top: 70, width: 1500}}>
      <div style={{fontFamily: HEAD, fontSize: 54, color: C.amber}}>RECAP · THANKSGIVING 2026 vs 2025</div>
      <div style={{fontFamily: BODY, fontWeight: 700, fontSize: 30, color: C.muted, opacity: fade(f, cx('rc73')), marginBottom: 10}}>7 went up · 3 went down</div>
      <div style={{position: 'relative', height: 640}}>
        <div style={{position: 'absolute', left: 300 + zero - 300, top: 0, width: 3, height: 630, background: C.muted, opacity: 0.5}} />
        {sorted.map((it, k) => {
          const at = cx(`rc${it.rank}`);
          const g = interpolate(f, [at, at + 14], [0, 1], clamp);
          const w = Math.abs(it.pct) * unit * g;
          const up = it.pct > 0;
          return (
            <div key={it.rank} style={{position: 'absolute', top: k * 63, left: 0, width: 1500, height: 56, opacity: fade(f, at)}}>
              <div style={{position: 'absolute', left: 0, width: 300, top: 10, fontFamily: BODY, fontWeight: 700, fontSize: 28, color: C.cream, whiteSpace: 'nowrap'}}><span style={{fontFamily: HEAD, color: C.amber}}>#{it.rank}</span> {it.name}</div>
              <div style={{position: 'absolute', top: 6, height: 44, borderRadius: 8, background: col(it.pct), left: up ? zero : zero - w, width: w}} />
              <div style={{position: 'absolute', top: 8, fontFamily: HEAD, fontSize: 30, color: col(it.pct), left: up ? zero + w + 12 : zero - w - 120, width: 110, textAlign: up ? 'left' : 'right'}}>{pctTxt(it.pct)}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

const CTA: React.FC = () => {
  const f = useCurrentFrame();
  const sub = cx('sub');
  const pulse = 1 + Math.sin(f / 5) * 0.04;
  return (
    <div style={{position: 'absolute', left: 110, top: 130, width: 1150}}>
      <div style={{transform: `scale(${sp(f, ctaStart)})`, transformOrigin: 'left', fontFamily: HEAD, fontSize: 84, color: C.cream, lineHeight: 1.1}}>Which price surprised you most?</div>
      <div style={{marginTop: 34}}><Pill o={fade(f, cx('comments'))} size={48}>Tell us in the comments ↓</Pill></div>
      <div style={{marginTop: 34, fontFamily: HEAD, fontSize: 70, color: C.amber, opacity: fade(f, cx('follow')), transform: `rotate(-2deg)`}}>"Follow the money."</div>
      <div style={{marginTop: 30, opacity: fade(f, sub), transform: `scale(${f >= sub ? pulse : 1})`, transformOrigin: 'left', display: 'inline-block', background: C.red, color: '#fff', fontFamily: HEAD, fontSize: 58, padding: '18px 44px', borderRadius: 20}}>▶ SUBSCRIBE</div>
      <div style={{opacity: fade(f, cx('wed')), marginTop: 26, fontFamily: BODY, fontWeight: 700, fontSize: 40, color: C.cream}}>Tomorrow: <span style={{color: C.mint}}>why so many scam calls start with silence</span></div>
    </div>
  );
};

export const Top10: React.FC = () => {
  const f = useCurrentFrame();
  let cur = -1;
  ITEMS.forEach((it, i) => { if (f >= startOf(it)) cur = i; });
  const inTwist = f >= twistStart && f < recapStart;
  const inRecap = f >= recapStart && f < ctaStart;
  const inCta = f >= ctaStart;
  const inItems = cur >= 0 && !inTwist && !inRecap && !inCta;
  const segIdx = SEG.reduce((acc, s, i) => (f >= s ? i : acc), 0);
  const heroLine = T.who[segIdx] === 'hero' && f < fr(T.segEnd[segIdx]) + 6;
  const POSES: Record<number, string> = {0: 'shock_shock', 6: 'shrug_talk', 9: 'point_talk', 13: 'think_worry', 17: 'shrug_smile', 19: 'point_smile'};
  let hero: React.ReactNode;
  if (inCta) hero = <Hero key="cta" pose={f >= cx('sub') ? 'wave_happy' : f >= cx('follow') - 4 ? 'point_smile' : 'shrug_smile'} x={1560} y={1010} h={720} from={ctaStart} />;
  else if (heroLine && cur < 0) hero = <Hero key="h0" pose="shock_shock" x={1660} y={1000} h={560} from={0} />;
  else if (heroLine) hero = <Hero key={`h${segIdx}`} pose={POSES[segIdx] || 'shock_shock'} x={1690} y={1000} h={600} from={SEG[segIdx]} flip />;
  else if (inTwist) hero = <Hero key="tw" pose="think_talk" x={1730} y={1060} h={330} from={twistStart} />;
  else if (inRecap) hero = <Hero key="rc" pose="point_talk" x={1760} y={1060} h={300} from={recapStart} flip />;
  else hero = <Hero pose={cur >= 0 && ITEMS[cur].pct < 0 ? 'cheer_happy' : 'stand_smile'} x={1440} y={1060} h={220} />;
  return (
    <AbsoluteFill>
      <Background />
      {cur < 0 && <Intro />}
      {inItems && <ItemCard key={cur} i={cur} />}
      {inItems && <Table cur={cur} />}
      {!inRecap && !inCta && !inTwist && !(heroLine && cur >= 0) && <Ladder cur={cur} />}
      {inTwist && <Twist />}
      {inRecap && <Recap />}
      {inCta && <CTA />}
      {hero}
      <Brand />
      <Captions />
      <Source />
      <Audio src={staticFile('vo.mp3')} />
    </AbsoluteFill>
  );
};

// ---------- thumbnail (1280x720) - PLAN v3: one thumbnail, 2-4 huge words, the $ number in a red box ----------
export const Thumb: React.FC = () => (
  <AbsoluteFill>
    <Background w={1280} h={720} />
    <div style={{position: 'absolute', left: 50, top: 40, width: 820}}>
      <div style={{fontFamily: HEAD, fontSize: 92, color: C.cream, lineHeight: 1}}>THANKSGIVING</div>
      <div style={{fontFamily: HEAD, fontSize: 92, color: C.amber, lineHeight: 1.05}}>TOP 10</div>
      <div style={{display: 'flex', alignItems: 'center', gap: 24, marginTop: 26}}>
        <div style={{background: C.red, color: '#fff', fontFamily: HEAD, fontSize: 112, padding: '4px 26px', borderRadius: 18, lineHeight: 1.05, whiteSpace: 'nowrap'}}>#1: +10.1%</div>
      </div>
      <div style={{fontFamily: HEAD, fontSize: 64, color: C.mint, marginTop: 34}}>...but 4 got</div><div style={{fontFamily: HEAD, fontSize: 92, color: C.mint, lineHeight: 1}}>CHEAPER?</div>
    </div>
    <div style={{position: 'absolute', right: 270, top: 330}}><Icon kind="turkey" s={260} /></div>
    <Img src={staticFile('sprites/hero_shock_shock.png')} style={{position: 'absolute', right: 20, bottom: -10, height: 430, width: 258, transform: 'scaleX(-1)'}} />
  </AbsoluteFill>
);

export const Root: React.FC = () => (
  <>
    <Composition id="Top10" component={Top10} durationInFrames={END} fps={FPS} width={1920} height={1080} />
    <Composition id="Thumb" component={Thumb} durationInFrames={1} fps={FPS} width={1280} height={720} />
  </>
);
