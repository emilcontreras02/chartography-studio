// Chartography Top 10 long-form (16:9) + thumbnail, driven by data.json (content) and timing.json (voice timing).
import React from 'react';
import {AbsoluteFill, Audio, Composition, Img, interpolate, spring, staticFile, useCurrentFrame} from 'remotion';
import '@fontsource/archivo-black/latin-400.css';
import '@fontsource/fira-sans/latin-400.css';
import '@fontsource/fira-sans/latin-700.css';
import D from './data.json';
import T from './timing.json';

const C = {bg: '#0e1b2e', panel: '#16283f', cream: '#f6f1e7', muted: '#afb8c6', slate: '#5c7392', mint: '#3fd6a0', amber: '#f2b544', coral: '#ff8a65', red: '#ff5d5d'};
const HEAD = "'Archivo Black', sans-serif";
const BODY = "'Fira Sans', sans-serif";
const FPS = 30;
const fr = (s: number) => Math.round(s * FPS);
const clamp = {extrapolateLeft: 'clamp' as const, extrapolateRight: 'clamp' as const};
type Item = {rank: number; name: string; line: string; fact?: string; value: number; label: string; seg: number};
const data = D as unknown as {
  title: string[]; hook: {big: string; big2?: string; small?: string}; valueLabel: string; items: Item[];
  twist?: {seg: number; title: string; lines: string[]}; recapSeg?: number; cta: {seg: number; question: string; next?: string};
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
      <div style={{transform: `scale(${sp(f, 4)})`, fontFamily: HEAD, fontSize: 150, color: C.amber, lineHeight: 1}}>{data.hook.big}</div>
      {data.hook.big2 && <div style={{transform: `scale(${sp(f, 26)})`, fontFamily: HEAD, fontSize: 120, color: C.mint, marginTop: 12}}>{data.hook.big2}</div>}
      {data.hook.small && <div style={{opacity: sp(f, 44), fontFamily: BODY, fontWeight: 700, fontSize: 48, color: C.muted, marginTop: 18}}>{data.hook.small}</div>}
      <div style={{opacity: interpolate(f, [s2, s2 + 12], [0, 1], clamp), marginTop: 40}}>
        <div style={{fontFamily: HEAD, fontSize: 84, color: C.cream}}>{data.title[0]}</div>
        {data.title[1] && <div style={{fontFamily: BODY, fontSize: 40, color: C.muted, marginTop: 6}}>{data.title[1]}</div>}
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
  const a = sp(f, t0), b = sp(f, t0 + 18), c = sp(f, t0 + 40, 90);
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
        <div key={i} style={{opacity: sp(f, t0 + 20 + i * 45), fontFamily: BODY, fontWeight: 700, fontSize: 54, color: C.cream, marginTop: 26}}>{l}</div>
      ))}
    </AbsoluteFill>
  );
};

const Recap: React.FC = () => {
  const f = useCurrentFrame();
  const t0 = recapStart ?? 0;
  return (
    <AbsoluteFill style={{padding: '110px 120px'}}>
      <div style={{fontFamily: HEAD, fontSize: 72, color: C.amber, marginBottom: 20}}>RECAP · {data.title[0]}</div>
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
      {data.cta.next && <div style={{opacity: sp(f, ctaStart + 40), marginTop: 30, fontFamily: BODY, fontWeight: 700, fontSize: 40, color: C.muted}}>{data.cta.next}</div>}
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
        ? <Hero key={`h${segIdx}`} pose={pose} x={inItems ? 1180 : 1500} y={1000} h={560} from={SEG[segIdx]} flip />
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
    <Background />
    <div style={{position: 'absolute', left: 80, top: 90, width: 1150}}>
      <div style={{fontFamily: HEAD, fontSize: 96, color: C.cream, lineHeight: 1}}>{data.thumb.top}</div>
      <div style={{fontFamily: HEAD, fontSize: 210, color: C.amber, lineHeight: 1, marginTop: 20}}>{data.thumb.big}</div>
      <div style={{display: 'inline-block', marginTop: 40, background: C.mint, color: C.bg, fontFamily: HEAD, fontSize: 64, padding: '14px 34px', borderRadius: 22}}>{data.thumb.bottom}</div>
    </div>
    <Img src={staticFile(`sprites/hero_${data.thumb.pose}.png`)} style={{position: 'absolute', right: 120, bottom: 0, height: 900, width: 540}} />
  </AbsoluteFill>
);

export const Root: React.FC = () => (
  <>
    <Composition id="Top10" component={Top10} durationInFrames={END} fps={FPS} width={1920} height={1080} />
    <Composition id="Thumb" component={Thumb} durationInFrames={1} fps={FPS} width={1920} height={1080} />
  </>
);
