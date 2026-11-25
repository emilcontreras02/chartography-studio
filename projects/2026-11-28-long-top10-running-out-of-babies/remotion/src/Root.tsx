// Chartography Top 10 long-form (16:9) + thumbnail, driven by data.json (content) and timing.json (voice timing).
import React from 'react';
import {AbsoluteFill, Audio, Composition, Img, interpolate, spring, staticFile, useCurrentFrame} from 'remotion';
import '@fontsource/archivo-black/latin-400.css';
import '@fontsource/fira-sans/latin-400.css';
import '@fontsource/fira-sans/latin-700.css';
import D from './data.json';
import T from './timing.json';

const C = {ink: '#0b1220', bg: '#0e1b2e', panel: '#16283f', cream: '#f6f1e7', muted: '#afb8c6', slate: '#5c7392', mint: '#3fd6a0', amber: '#f2b544', coral: '#ff8a65', red: '#ff5d5d'};
const HEAD = "'Archivo Black', sans-serif";
const BODY = "'Fira Sans', sans-serif";
const FPS = 30;
const fr = (s: number) => Math.round(s * FPS);
const clamp = {extrapolateLeft: 'clamp' as const, extrapolateRight: 'clamp' as const};
type Item = {rank: number; name: string; line: string; fact?: string; value: number; label: string; seg: number};
const data = D as unknown as {
  title: string[]; hook: {big: string; big2?: string; small?: string}; valueLabel: string; items: Item[];
  twist?: {seg: number; title: string; lines: [string, string][]}; recapSeg?: number; cta: {seg: number; question: string; next?: string};
  heroPoses?: Record<string, string>; source: string; thumb: {top: string; big: string; bottom: string; pose: string};
};
const ITEMS = [...data.items].sort((a, b) => b.rank - a.rank); // 10 -> 1
const SEG = T.seg.map(fr);
const END = fr(T.dur + 2.0);
const MAXV = Math.max(...ITEMS.map((i) => i.value));
const itemStart = (i: number) => SEG[ITEMS[i].seg];
const twistStart = data.twist ? SEG[data.twist.seg] : null;
const recapStart = data.recapSeg !== undefined ? SEG[data.recapSeg] : null;
const ctaStart = SEG[data.cta.seg];

const X = (T as unknown as {x: Record<string, number>}).x;
const cx = (k: string) => fr(X[k]);
const sp = (f: number, from: number, stiff = 140) => spring({frame: f - from, fps: FPS, config: {damping: 13, stiffness: stiff}});

// ---------- shared pieces ----------
const Background: React.FC = () => {
  const f = useCurrentFrame();
  const dots = Array.from({length: 60}, (_, i) => {
    const x = (i * 347) % 1920, y = ((i * 211) % 1080 + f * (0.15 + (i % 5) * 0.06)) % 1080;
    return <circle key={i} cx={x} cy={1080 - y} r={1.5 + (i % 3)} fill={i % 9 === 0 ? C.amber : '#fff'} opacity={0.06 + (i % 4) * 0.02} />;
  });
  return (
    <AbsoluteFill style={{background: `radial-gradient(circle at 40% 30%, #1d3557, ${C.bg} 70%)`}}>
      <svg width={1920} height={1080}>{dots}</svg>
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
  <div style={{position: 'absolute', top: 34, left: 60, fontFamily: HEAD, fontSize: 26, letterSpacing: 4, color: C.cream, opacity: 0.85}}>
    CHART<span style={{color: C.amber}}>OGRAPHY</span>
  </div>
);
const Source: React.FC = () => (
  <div style={{position: 'absolute', bottom: 18, left: 60, right: 60, textAlign: 'center', fontFamily: BODY, fontSize: 20, color: C.muted, opacity: 0.9}}>{data.source}</div>
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
    <div style={{position: 'absolute', top: 930, left: 300, right: 300, textAlign: 'center', fontFamily: HEAD, fontSize: 50, color: '#fff', WebkitTextStroke: `8px ${C.bg}`, paintOrder: 'stroke fill'}}>
      {ch.map((w, i) => {
        const on = t >= (w[1] as number) && (i === ch.length - 1 || t < (ch[i + 1][1] as number));
        return <span key={i} style={{display: 'inline-block', margin: '0 6px', padding: '0 8px', borderRadius: 10, background: on ? C.amber : 'transparent', color: on ? C.bg : '#fff', WebkitTextStroke: on ? '0px' : `8px ${C.bg}`}}>{w[0] as string}</span>;
      })}
    </div>
  );
};

// ---------- scenes ----------
const Intro: React.FC = () => {
  const f = useCurrentFrame();
  const s2 = SEG[1] ?? 60;
  return (
    <AbsoluteFill style={{alignItems: 'center', justifyContent: 'center', textAlign: 'center', paddingBottom: 160}}>
      <div style={{transform: `scale(${sp(f, 0)})`, fontFamily: HEAD, fontSize: 150, color: C.amber, lineHeight: 1}}>{data.hook.big}</div>
      {data.hook.big2 && <div style={{transform: `scale(${sp(f, 26)})`, fontFamily: HEAD, fontSize: 120, color: C.mint, marginTop: 12}}>{data.hook.big2}</div>}
      {data.hook.small && <div style={{opacity: sp(f, 44), fontFamily: BODY, fontWeight: 700, fontSize: 48, color: C.muted, marginTop: 18}}>{data.hook.small}</div>}
      <div style={{opacity: interpolate(f, [s2, s2 + 12], [0, 1], clamp), marginTop: 40}}>
        <div style={{fontFamily: HEAD, fontSize: 84, color: C.cream}}>{data.title[0]}</div>
        {data.title[1] && <div style={{fontFamily: BODY, fontSize: 40, color: C.muted, marginTop: 6}}>{data.title[1]}</div>}
      </div>
      <div style={{display: 'flex', gap: 40, marginTop: 34}}>
        <div style={{opacity: interpolate(f, [cx('world') - 4, cx('world') + 6], [0, 1], clamp), background: C.panel, border: `4px solid ${C.slate}`, borderRadius: 18, padding: '10px 26px', fontFamily: HEAD, fontSize: 40, color: C.cream}}>World: about 2.2</div>
        <div style={{opacity: interpolate(f, [cx('usa') - 4, cx('usa') + 6], [0, 1], clamp), background: C.panel, border: `4px solid ${C.mint}`, borderRadius: 18, padding: '10px 26px', fontFamily: HEAD, fontSize: 40, color: C.mint}}>USA: about 1.6</div>
      </div>
    </AbsoluteFill>
  );
};

const Ladder: React.FC<{cur: number}> = ({cur}) => {
  const f = useCurrentFrame();
  return (
    <div style={{position: 'absolute', right: 50, top: 110, width: 330}}>
      {ITEMS.map((it, i) => {
        const shown = f >= itemStart(i);
        const active = i === cur;
        return (
          <div key={it.rank} style={{display: 'flex', alignItems: 'center', height: 70, marginBottom: 8, borderRadius: 14, padding: '0 16px',
            background: active ? C.amber : shown ? C.panel : 'rgba(255,255,255,0.04)', transform: `scale(${active ? 1.04 : 1})`}}>
            <div style={{fontFamily: HEAD, fontSize: 30, width: 84, color: active ? C.bg : C.amber}}>#{it.rank}</div>
            <div style={{fontFamily: BODY, fontWeight: 700, fontSize: 28, color: active ? C.bg : C.cream, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis'}}>{shown ? it.name : '? ? ?'}</div>
          </div>
        );
      })}
    </div>
  );
};

const ItemCard: React.FC<{i: number}> = ({i}) => {
  const f = useCurrentFrame();
  const it = ITEMS[i];
  const t0 = itemStart(i);
  const a = sp(f, t0), b = sp(f, t0 + 18), c = sp(f, cx('v' + it.rank) - 4, 90);
  const barW = (it.value / MAXV) * 1050 * c;
  return (
    <div style={{position: 'absolute', left: 90, top: 190, width: 1360}}>
      <div style={{display: 'flex', alignItems: 'baseline', gap: 30, transform: `translateX(${(1 - a) * -80}px)`, opacity: a}}>
        <div style={{fontFamily: HEAD, fontSize: 220, color: C.amber, lineHeight: 0.9}}>#{it.rank}</div>
        <div style={{fontFamily: HEAD, fontSize: 104, color: C.cream, lineHeight: 1}}>{it.name}</div>
      </div>
      <div style={{opacity: b, fontFamily: BODY, fontWeight: 700, fontSize: 58, color: C.cream, marginTop: 30}}>{it.line}</div>
      {it.fact && <div style={{opacity: b, fontFamily: BODY, fontSize: 44, color: C.muted, marginTop: 12}}>{it.fact}</div>}
      <div style={{marginTop: 50, opacity: c}}>
        <div style={{fontFamily: BODY, fontSize: 30, color: C.muted, marginBottom: 10}}>{data.valueLabel}</div>
        <div style={{display: 'flex', alignItems: 'center', gap: 24}}>
          <div style={{width: Math.max(8, barW), height: 90, borderRadius: 14, background: C.mint}} />
          <div style={{fontFamily: HEAD, fontSize: 100, color: C.mint}}>{it.label}</div>
        </div>
      </div>
    </div>
  );
};

const Twist: React.FC = () => {
  const f = useCurrentFrame();
  const t0 = twistStart ?? 0;
  return (
    <AbsoluteFill style={{padding: '140px 120px', alignItems: 'flex-start'}}>
      <div style={{transform: `scale(${sp(f, t0)})`, transformOrigin: 'left', fontFamily: HEAD, fontSize: 110, color: C.coral}}>{data.twist?.title}</div>
      {(data.twist?.lines || []).map((l, i) => (
        <div key={i} style={{opacity: sp(f, cx('tw' + i) - 4), fontFamily: BODY, fontWeight: 700, fontSize: 50, color: i === 0 ? C.mint : i === 3 ? C.amber : C.cream, marginTop: 22}}>{l[0]}</div>
      ))}
    </AbsoluteFill>
  );
};

const Recap: React.FC = () => {
  const f = useCurrentFrame();
  const t0 = recapStart ?? 0;
  return (
    <AbsoluteFill style={{padding: '110px 120px'}}>
      <div style={{fontFamily: HEAD, fontSize: 72, color: C.amber, marginBottom: 20}}>RECAP · births per woman, 2023</div>
      <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', columnGap: 60, rowGap: 14}}>
        {ITEMS.map((it, i) => (
          <div key={it.rank} style={{opacity: sp(f, t0 + i * 8), display: 'flex', alignItems: 'center', gap: 20, background: C.panel, borderRadius: 14, padding: '10px 20px'}}>
            <div style={{fontFamily: HEAD, fontSize: 36, color: C.amber, width: 70}}>#{it.rank}</div>
            <div style={{fontFamily: BODY, fontWeight: 700, fontSize: 34, color: C.cream, flex: 1}}>{it.name}</div>
            <div style={{fontFamily: HEAD, fontSize: 34, color: C.mint}}>{it.label}</div>
          </div>
        ))}
      </div>
    </AbsoluteFill>
  );
};

const CTA: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill style={{alignItems: 'center', justifyContent: 'center', textAlign: 'center', paddingBottom: 180}}>
      <div style={{transform: `scale(${sp(f, ctaStart)})`, fontFamily: HEAD, fontSize: 84, color: C.cream, maxWidth: 1500, lineHeight: 1.1}}>{data.cta.question}</div>
      <div style={{opacity: sp(f, ctaStart + 20), marginTop: 40, background: C.amber, color: C.bg, fontFamily: HEAD, fontSize: 52, padding: '20px 46px', borderRadius: 24}}>Tell us in the comments ↓</div>
      <div style={{opacity: sp(f, cx('follow') - 4), marginTop: 36, fontFamily: HEAD, fontSize: 64, color: C.amber, transform: 'rotate(-2deg)'}}>"Follow the money."</div>
      <div style={{transform: `scale(${sp(f, cx('subscribe') - 4)})`, marginTop: 30, background: C.red, color: '#fff', fontFamily: HEAD, fontSize: 58, padding: '16px 44px', borderRadius: 24}}>▶ SUBSCRIBE</div>
      {data.cta.next && <div style={{opacity: sp(f, cx('monday') - 4), marginTop: 30, fontFamily: BODY, fontWeight: 700, fontSize: 38, color: C.mint, maxWidth: 1000}}>{data.cta.next}</div>}
    </AbsoluteFill>
  );
};

export const Top10: React.FC = () => {
  const f = useCurrentFrame();
  let cur = -1;
  ITEMS.forEach((_, i) => { if (f >= itemStart(i)) cur = i; });
  const inTwist = twistStart !== null && f >= twistStart && (recapStart === null || f < recapStart) && f < ctaStart;
  const inRecap = recapStart !== null && f >= recapStart && f < ctaStart;
  const inCta = f >= ctaStart;
  const inItems = cur >= 0 && !inTwist && !inRecap && !inCta;
  // mascot: big on his own lines, small otherwise
  const segIdx = SEG.reduce((acc, s, i) => (f >= s ? i : acc), 0);
  const heroLine = T.who[segIdx] === 'hero' && f < fr(T.segEnd[segIdx]) + 6;
  const pose = (data.heroPoses || {})[String(segIdx)] || (heroLine ? 'shock_shock' : inCta ? 'point_talk' : 'stand_smile');
  return (
    <AbsoluteFill>
      <Background />
      {cur < 0 && !inCta && <Intro />}
      {inItems && <ItemCard key={cur} i={cur} />}
      {(inItems || cur >= 0) && !inRecap && !inCta && !inTwist && <Ladder cur={cur} />}
      {inTwist && <Twist />}
      {inRecap && <Recap />}
      {inCta && <CTA />}
      {heroLine && !inRecap
        ? <Hero key={`h${segIdx}`} pose={pose} x={inItems ? 1300 : inCta ? 1690 : 1500} y={inItems ? 1070 : 1000} h={inItems ? 300 : 560} from={SEG[segIdx]} flip />
        : <Hero pose={pose} x={160} y={1060} h={300} flip={pose.startsWith('point')} />}
      <Brand />
      <Captions />
      <Source />
      <Audio src={staticFile('vo.mp3')} />
    </AbsoluteFill>
  );
};

export const Thumb: React.FC = () => (
  <AbsoluteFill>
    <AbsoluteFill style={{background: 'radial-gradient(circle at 68% 50%, #6b3b1c, #0e1b2e 62%)'}} />
    <div style={{position: 'absolute', left: 50, top: 50, width: 720}}>
      <div style={{fontFamily: HEAD, fontSize: 92, color: C.cream, lineHeight: 1}}>SOUTH KOREA</div>
      <div style={{display: 'inline-block', marginTop: 26, background: C.red, color: '#fff', fontFamily: HEAD, fontSize: 210, lineHeight: 1, padding: '6px 30px', borderRadius: 22, transform: 'rotate(-3deg)'}}>0.72</div>
      <div style={{fontFamily: HEAD, fontSize: 58, color: C.cream, marginTop: 22}}>BABIES PER WOMAN</div>
      <div style={{fontFamily: HEAD, fontSize: 66, color: C.mint, marginTop: 12}}>...then UP?</div>
    </div>
    <svg style={{position: 'absolute', left: 760, top: 170}} width={330} height={300} viewBox="0 0 330 300">
      <ellipse cx={165} cy={150} rx={150} ry={130} fill={C.amber} opacity={0.18} />
      <path d="M 40 120 Q 165 260 290 120 Z" fill="#c98a4a" stroke={C.ink} strokeWidth={8} />
      <path d="M 70 200 L 50 270 M 260 200 L 280 270" stroke={C.ink} strokeWidth={10} strokeLinecap="round" />
      <path d="M 30 270 Q 165 300 300 270" stroke={C.ink} strokeWidth={10} fill="none" />
      <text x={165} y={70} textAnchor="middle" fontFamily="Archivo Black" fontSize={60} fill={C.cream}>?</text>
    </svg>
    <Img src={staticFile('sprites/hero_shock_shock.png')} style={{position: 'absolute', right: 10, bottom: -10, height: 280, width: 168}} />
  </AbsoluteFill>
);

export const Root: React.FC = () => (
  <>
    <Composition id="Top10" component={Top10} durationInFrames={END} fps={FPS} width={1920} height={1080} />
    <Composition id="Thumb" component={Thumb} durationInFrames={1} fps={FPS} width={1280} height={720} />
  </>
);
