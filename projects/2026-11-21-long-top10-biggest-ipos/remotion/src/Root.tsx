// Chartography Top 10: The 10 biggest IPOs ever (Nov 21, 2026). Built on templates/remotion-top10, with
// per-item visuals (fifth / timeline / duel / pair / reign / equation), a twist board, a sorted recap chart and 3 thumbnails.
import React from 'react';
import {AbsoluteFill, Audio, Composition, Img, interpolate, spring, staticFile, useCurrentFrame} from 'remotion';
import '@fontsource/archivo-black/latin-400.css';
import '@fontsource/fira-sans/latin-400.css';
import '@fontsource/fira-sans/latin-700.css';
import D from './data.json';
import T from './timing.json';

const C = {bg: '#0e1b2e', panel: '#16283f', panel2: '#22365a', cream: '#f6f1e7', muted: '#afb8c6', slate: '#5c7392', mint: '#3fd6a0', amber: '#f2b544', coral: '#ff8a65'};
const HEAD = "'Archivo Black', sans-serif";
const BODY = "'Fira Sans', sans-serif";
const FPS = 30;
const fr = (s: number) => Math.round(s * FPS);
const clamp = {extrapolateLeft: 'clamp' as const, extrapolateRight: 'clamp' as const};
type Item = {rank: number; name: string; line: string; fact?: string; value: number; label: string; seg: number; viz: string; [k: string]: unknown};
const data = D as unknown as {
  title: string[]; hook: {big: string; big2?: string; small?: string}; valueLabel: string; items: Item[];
  twist: {seg: number; title: string}; recapSeg: number; cta: {seg: number; question: string; next?: string};
  heroPoses?: Record<string, string>; source: string; thumb: {top: string; big: string; bottom: string; pose: string};
};
const X = (T as unknown as {x: Record<string, number>}).x;
const cx = (k: string) => fr(X[k]);
const ITEMS = [...data.items].sort((a, b) => b.rank - a.rank); // 10 -> 1
const SEG = T.seg.map(fr);
const END = fr(T.dur + 2.0);
const itemStart = (i: number) => SEG[ITEMS[i].seg];
const twistStart = SEG[data.twist.seg];
const recapStart = SEG[data.recapSeg];
const ctaStart = SEG[data.cta.seg];
const VALKEY: Record<number, string> = {10: 'e10_val', 9: 'e9_val', 8: 'e8_val', 7: 'e7_val', 6: 'e6_val', 5: 'e5_val', 4: 'e4_val', 3: 'e3_val', 2: 'e2_val', 1: 'e1_val'};

const sp = (f: number, from: number, stiff = 140) => spring({frame: f - from, fps: FPS, config: {damping: 13, stiffness: stiff}});
const fade = (f: number, from: number, len = 10) => interpolate(f, [from, from + len], [0, 1], clamp);
const out = (f: number, at: number, len = 8) => interpolate(f, [at - len, at], [1, 0], clamp);

// ---------- shared pieces ----------
const Background: React.FC<{w?: number; h?: number}> = ({w = 1920, h = 1080}) => {
  const f = useCurrentFrame();
  const dots = Array.from({length: 60}, (_, i) => {
    const x = (i * 347) % w, y = ((i * 211) % h + f * (0.15 + (i % 5) * 0.06)) % h;
    return <circle key={i} cx={x} cy={h - y} r={1.5 + (i % 3)} fill={i % 9 === 0 ? C.amber : '#fff'} opacity={0.06 + (i % 4) * 0.02} />;
  });
  return (
    <AbsoluteFill style={{background: `radial-gradient(circle at 40% 30%, #1d3557, ${C.bg} 70%)`}}>
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
  <div style={{position: 'absolute', top: 34, left: 60, fontFamily: HEAD, fontSize: 26, letterSpacing: 4, color: C.cream, opacity: 0.85}}>
    CHART<span style={{color: C.amber}}>OGRAPHY</span>
  </div>
);
const Source: React.FC = () => (
  <div style={{position: 'absolute', bottom: 18, left: 60, right: 60, textAlign: 'center', fontFamily: BODY, fontSize: 20, color: C.muted, opacity: 0.9}}>{data.source}</div>
);
const Pill: React.FC<{children: React.ReactNode; o: number; bg?: string; color?: string; size?: number; style?: React.CSSProperties}> = ({children, o, bg = C.amber, color = C.bg, size = 40, style}) => (
  <div style={{display: 'inline-block', opacity: o, transform: `scale(${0.85 + 0.15 * o})`, transformOrigin: 'left center', background: bg, color, fontFamily: HEAD, fontSize: size, padding: '10px 26px', borderRadius: 18, ...style}}>{children}</div>
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
    <div style={{position: 'absolute', top: 940, left: 300, right: 300, textAlign: 'center', fontFamily: HEAD, fontSize: 46, color: '#fff', WebkitTextStroke: `8px ${C.bg}`, paintOrder: 'stroke fill'}}>
      {ch.map((w, i) => {
        const on = t >= (w[1] as number) && (i === ch.length - 1 || t < (ch[i + 1][1] as number));
        return <span key={i} style={{display: 'inline-block', margin: '0 6px', padding: '0 8px', borderRadius: 10, background: on ? C.amber : 'transparent', color: on ? C.bg : '#fff', WebkitTextStroke: on ? '0px' : `8px ${C.bg}`}}>{w[0] as string}</span>;
      })}
    </div>
  );
};

// ---------- rank ladder (right) ----------
const Ladder: React.FC<{cur: number}> = ({cur}) => {
  const f = useCurrentFrame();
  return (
    <div style={{position: 'absolute', right: 40, top: 100, width: 360, opacity: fade(f, fr(X.h_ten) - 6)}}>
      <div style={{fontFamily: BODY, fontWeight: 700, fontSize: 22, color: C.muted, letterSpacing: 2, marginBottom: 8}}>BIGGEST IPOs EVER</div>
      {[...ITEMS].reverse().map((it) => {
        const i = ITEMS.indexOf(it);
        const shown = cur >= 0 && f >= itemStart(i);
        const active = i === cur;
        return (
          <div key={it.rank} style={{display: 'flex', alignItems: 'center', height: 66, marginBottom: 8, borderRadius: 14, padding: '0 14px',
            background: active ? C.amber : shown ? C.panel : 'rgba(255,255,255,0.05)', border: shown || active ? 'none' : '2px dashed rgba(255,255,255,0.12)'}}>
            <div style={{fontFamily: HEAD, fontSize: 28, width: 70, color: active ? C.bg : C.amber}}>#{it.rank}</div>
            <div style={{flex: 1, fontFamily: BODY, fontWeight: 700, fontSize: 25, color: active ? C.bg : C.cream, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis'}}>{shown ? it.name : '? ? ?'}</div>
            {shown && <div style={{fontFamily: HEAD, fontSize: 22, color: active ? C.bg : C.mint}}>{it.label}</div>}
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
    <div style={{position: 'absolute', left: 90, top: 150, width: 1360, textAlign: 'center'}}>
      <div style={{transform: `scale(${sp(f, 2)})`, fontFamily: HEAD, fontSize: 160, color: C.mint, lineHeight: 1}}>{data.hook.big}</div>
      <div style={{transform: `scale(${sp(f, 22)})`, fontFamily: HEAD, fontSize: 96, color: C.amber, marginTop: 14}}>{data.hook.big2}</div>
      <div style={{opacity: fade(f, SEG[1] + fr(9)), fontFamily: BODY, fontWeight: 700, fontSize: 46, color: C.cream, marginTop: 26}}>{data.hook.small}</div>
      <div style={{opacity: fade(f, tt), marginTop: 50, transform: `translateY(${(1 - sp(f, tt)) * 30}px)`}}>
        <div style={{fontFamily: HEAD, fontSize: 74, color: C.cream}}>{data.title[0]}</div>
        <div style={{fontFamily: BODY, fontSize: 36, color: C.muted, marginTop: 6}}>{data.title[1]}</div>
      </div>
    </div>
  );
};

// ---------- item visuals ----------
const W = 1300; // viz width
const Fifth: React.FC<{it: Item}> = ({it}) => {
  const f = useCurrentFrame();
  const rule = cx('e10_rule'), fifth = cx('e10_fifth');
  const ruleO = fade(f, rule) * out(f, fifth - 4);
  const fo = fade(f, fifth);
  return (
    <div style={{position: 'relative', height: 330}}>
      {ruleO > 0 && (
        <div style={{position: 'absolute', top: 10, left: 0, width: W - 60, opacity: ruleO, background: C.panel, borderRadius: 24, padding: '28px 36px', border: `3px solid ${C.amber}`}}>
          <div style={{fontFamily: HEAD, fontSize: 40, color: C.amber}}>ONE RULE FOR THIS LIST</div>
          <div style={{fontFamily: BODY, fontWeight: 700, fontSize: 40, color: C.cream, marginTop: 12}}>Cash raised when the shares were first sold.</div>
          <div style={{fontFamily: BODY, fontSize: 34, color: C.muted, marginTop: 8}}>No extra shares sold later. Not the company's value.</div>
        </div>
      )}
      {fo > 0 && (
        <div style={{position: 'absolute', top: 20, left: 0, opacity: fo}}>
          <div style={{fontFamily: BODY, fontWeight: 700, fontSize: 32, color: C.muted, marginBottom: 14}}>what #1 raised, split into 5 equal blocks</div>
          <div style={{display: 'flex', gap: 14}}>
            {[0, 1, 2, 3, 4].map((k) => (
              <div key={k} style={{width: 230, height: 150, borderRadius: 16, background: k === 0 ? C.mint : 'transparent', border: k === 0 ? 'none' : `4px dashed ${C.slate}`,
                opacity: k === 0 ? 1 : fade(f, fifth + 6 + k * 4), display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: HEAD, fontSize: 44, color: C.bg}}>{k === 0 ? it.label : ''}</div>
            ))}
          </div>
          <div style={{fontFamily: HEAD, fontSize: 40, color: C.amber, marginTop: 18, opacity: fade(f, fifth + 26)}}>#10 = about 1/5 of #1 ($81.3B)</div>
        </div>
      )}
    </div>
  );
};

const Timeline: React.FC<{it: Item; t0: number}> = ({it, t0}) => {
  const f = useCurrentFrame();
  const y0 = 1998, y1 = 2026, year = it.year as number;
  const px = (y: number) => ((y - y0) / (y1 - y0)) * (W - 140);
  const cue = it.rank === 9 ? cx('e9_years') : cx('e7_28');
  const gapCue = it.rank === 9 ? cx('e9_gap') : cx('e7_old');
  const g = interpolate(f, [cue, cue + 25], [0, 1], clamp);
  return (
    <div style={{position: 'relative', height: 330, marginLeft: 40}}>
      <div style={{position: 'absolute', top: 170, left: 0, width: W - 140, height: 6, background: C.slate, borderRadius: 3, opacity: fade(f, t0 + 20)}} />
      {[1998, 2002, 2006, 2010, 2014, 2018, 2022, 2026].map((y) => (
        <div key={y} style={{position: 'absolute', top: 190, left: px(y) - 40, width: 80, textAlign: 'center', fontFamily: BODY, fontSize: 26, color: C.muted, opacity: fade(f, t0 + 20)}}>{y}</div>
      ))}
      <div style={{position: 'absolute', top: 152, left: px(year) - 20, width: 40, height: 40, borderRadius: 20, background: C.amber, transform: `scale(${sp(f, t0 + 30)})`}} />
      <div style={{position: 'absolute', top: 150, left: px(year), width: (px(2026) - px(year)) * g, height: 42, borderRadius: 21, background: C.mint, opacity: 0.85}} />
      <div style={{position: 'absolute', top: 245, left: px(year), fontFamily: HEAD, fontSize: 40, color: C.mint, opacity: fade(f, cue + 10)}}>{it.tl as string}</div>
      <div style={{position: 'absolute', top: 40, left: 0, opacity: fade(f, gapCue)}}>
        <Pill o={fade(f, gapCue)} size={36}>{it.rank === 9 ? '+$1.4B more than Enel (#10)' : 'THE OLDEST DEAL ON THE LIST'}</Pill>
      </div>
    </div>
  );
};

const Duel: React.FC<{it: Item; t0: number}> = ({it, t0}) => {
  const f = useCurrentFrame();
  const vmax = Math.max(it.value, it.vsValue as number);
  const v = cx(VALKEY[it.rank]);
  const rows: [string, number, string, string, number][] = [
    [it.vs as string, it.vsValue as number, it.vsLabel as string, C.slate, t0 + 15],
    [it.name, it.value, it.label, C.mint, v],
  ];
  const gc = cx(it.gapCue as string);
  return (
    <div style={{position: 'relative', height: 330}}>
      {rows.map(([n, val, lab, col, at], k) => {
        const g = interpolate(f, [at, at + 22], [0, 1], clamp);
        return (
          <div key={k} style={{position: 'absolute', top: 10 + k * 120, left: 0}}>
            <div style={{fontFamily: BODY, fontWeight: 700, fontSize: 30, color: C.cream, opacity: fade(f, at)}}>{n}</div>
            <div style={{display: 'flex', alignItems: 'center', gap: 18, marginTop: 6}}>
              <div style={{width: Math.max(6, (val / vmax) * 880 * g), height: 62, borderRadius: 12, background: col}} />
              <div style={{fontFamily: HEAD, fontSize: 44, color: col === C.mint ? C.mint : C.cream, opacity: fade(f, at + 12)}}>{lab}</div>
            </div>
          </div>
        );
      })}
      <div style={{position: 'absolute', top: 268, left: 0}}><Pill o={fade(f, gc)} size={36}>{it.gap as string}</Pill></div>
      {it.badge ? <div style={{position: 'absolute', top: 268, left: 560}}><Pill o={fade(f, cx(it.badgeCue as string))} bg={C.coral} size={36}>{it.badge as string}</Pill></div> : null}
    </div>
  );
};

const Pair: React.FC<{t0: number}> = ({t0}) => {
  const f = useCurrentFrame();
  const two = cx('e6_two');
  const cards: [string, string, string, number][] = [['NTT Mobile', 'Oct 1998 · Tokyo', '$18.1B', t0 + 10], ['SoftBank Corp', 'Dec 2018 · Tokyo', '$21.3B', cx('e6_val')]];
  return (
    <div style={{position: 'relative', height: 330}}>
      <div style={{display: 'flex', gap: 40}}>
        {cards.map(([n, s, v, at], k) => (
          <div key={k} style={{width: 460, background: k === 1 ? C.panel2 : C.panel, borderRadius: 24, padding: '24px 30px', opacity: fade(f, at), transform: `translateY(${(1 - sp(f, at)) * 30}px)`, border: k === 1 ? `3px solid ${C.mint}` : 'none'}}>
            <div style={{fontFamily: HEAD, fontSize: 40, color: C.cream}}>{n}</div>
            <div style={{fontFamily: BODY, fontSize: 30, color: C.muted, marginTop: 4}}>{s}</div>
            <div style={{fontFamily: HEAD, fontSize: 64, color: C.mint, marginTop: 8}}>{v}</div>
          </div>
        ))}
        <div style={{alignSelf: 'center', opacity: fade(f, cx('e6_val') + 20)}}><Pill o={1} size={34}>+$3.3B</Pill></div>
      </div>
      <div style={{fontFamily: HEAD, fontSize: 40, color: C.amber, marginTop: 26, opacity: fade(f, two)}}>2 of the top 10 = Japanese phone companies, 20 years apart</div>
    </div>
  );
};

const Reign: React.FC<{t0: number}> = ({t0}) => {
  const f = useCurrentFrame();
  const y0 = 2014, y1 = 2027;
  const px = (y: number) => ((y - y0) / (y1 - y0)) * (W - 120);
  const segs: [string, number, number, string, number][] = [
    ['Alibaba', 2014.7, 2019.92, C.slate, t0 + 15],
    ['Saudi Aramco', 2019.92, 2026.44, C.amber, cx('e4_rec')],
  ];
  return (
    <div style={{position: 'relative', height: 330, marginLeft: 30}}>
      <div style={{fontFamily: BODY, fontWeight: 700, fontSize: 30, color: C.muted, opacity: fade(f, t0 + 10)}}>WHO HELD THE "BIGGEST IPO EVER" RECORD</div>
      {segs.map(([n, a, b, col, at], k) => {
        const g = interpolate(f, [at, at + 30], [0, 1], clamp);
        return (
          <div key={k}>
            <div style={{position: 'absolute', top: 80, left: px(a), width: (px(b) - px(a)) * g, height: 80, borderRadius: 14, background: col}} />
            <div style={{position: 'absolute', top: 100, left: px(a) + 16, fontFamily: HEAD, fontSize: 32, color: C.bg, opacity: fade(f, at + 20), whiteSpace: 'nowrap'}}>{n}</div>
          </div>
        );
      })}
      <div style={{position: 'absolute', top: 92, left: px(2026.5) + 6, fontFamily: HEAD, fontSize: 52, color: C.coral, opacity: fade(f, cx('e4_65') + 30)}}>?</div>
      {[2014, 2016, 2018, 2020, 2022, 2024, 2026].map((y) => (
        <div key={y} style={{position: 'absolute', top: 175, left: px(y) - 40, width: 80, textAlign: 'center', fontFamily: BODY, fontSize: 26, color: C.muted, opacity: fade(f, t0 + 10)}}>{y}</div>
      ))}
      <div style={{position: 'absolute', top: 235, left: 0, display: 'flex', gap: 24}}>
        <Pill o={fade(f, cx('e4_gap'))} bg={C.panel2} color={C.cream} size={32}>+$3.8B vs Alibaba</Pill>
        <Pill o={fade(f, cx('e4_65'))} size={32}>RECORD FOR 6 1/2 YEARS</Pill>
      </div>
    </div>
  );
};

const Equation: React.FC<{it: Item}> = ({it}) => {
  const f = useCurrentFrame();
  const a = cx(it.sharesCue as string), b = cx(it.priceCue as string), v = cx(it.valCue as string), n = cx(it.noteCue as string);
  const isOne = it.rank === 1;
  const stage2 = isOne ? cx('e1_tril') : 1e9;
  const eqO = isOne ? out(f, stage2 - 2) : 1;
  const part = (txt: string, at: number, col: string, size = 76) => (
    <span style={{display: 'inline-block', opacity: fade(f, at), transform: `scale(${0.7 + 0.3 * sp(f, at)})`, fontFamily: HEAD, fontSize: size, color: col, margin: '0 14px'}}>{txt}</span>
  );
  return (
    <div style={{position: 'relative', height: 330}}>
      {eqO > 0 && (
        <div style={{opacity: eqO}}>
          <div style={{display: 'flex', alignItems: 'center', flexWrap: 'nowrap'}}>
            {part(it.shares as string, a, C.cream, 64)}{part('×', b, C.muted, 64)}{part(it.price as string, b, C.cream, 64)}{part('=', v, C.muted, 64)}{part(it.label, v, C.mint, 84)}
          </div>
          <div style={{marginTop: 30, display: 'flex', gap: 24}}>
            <Pill o={fade(f, n)} bg={C.panel2} color={C.cream} size={34}>{it.note as string}</Pill>
            {!isOne && <Pill o={fade(f, cx('e2_3x'))} size={34}>nearly 3x Aramco's old record</Pill>}
            {isOne && <Pill o={fade(f, cx('e1_more'))} size={34}>+$6.3B vs SpaceX</Pill>}
          </div>
          {!isOne && <div style={{marginTop: 24}}><Pill o={fade(f, cx('e2_19'))} bg={C.coral} size={34}>a new record... for 5 months</Pill></div>}
        </div>
      )}
      {isOne && f >= stage2 - 2 && <OneStage2 />}
    </div>
  );
};

const OneStage2: React.FC = () => {
  const f = useCurrentFrame();
  const tr = cx('e1_tril'), pv = cx('e1_priv'), cb = cx('e1_combo');
  const showBars = f >= cb - 4;
  if (!showBars) {
    return (
      <div style={{display: 'flex', gap: 40, opacity: fade(f, tr)}}>
        <div style={{background: C.panel, borderRadius: 24, padding: '24px 34px', width: 560}}>
          <div style={{fontFamily: BODY, fontWeight: 700, fontSize: 30, color: C.muted}}>VALUE AT THE IPO PRICE</div>
          <div style={{fontFamily: HEAD, fontSize: 64, color: C.mint, whiteSpace: 'nowrap'}}>~$1.5 TRILLION</div>
          <div style={{fontFamily: BODY, fontSize: 28, color: C.muted}}>fully diluted</div>
        </div>
        <div style={{background: C.panel, borderRadius: 24, padding: '24px 34px', width: 460, opacity: fade(f, pv)}}>
          <div style={{fontFamily: BODY, fontWeight: 700, fontSize: 30, color: C.muted}}>LAST PRIVATE VALUATION</div>
          <div style={{fontFamily: HEAD, fontSize: 80, color: C.cream}}>$965B</div>
        </div>
      </div>
    );
  }
  const g = interpolate(f, [cb, cb + 30], [0, 1], clamp);
  const scale = 900 / 81.3;
  const parts: [string, number, string][] = [['#3 SK hynix', 26.507, C.slate], ['#4 Aramco', 25.599, '#7088aa'], ['#5 Alibaba', 21.767, '#8aa0bf']];
  return (
    <div style={{opacity: fade(f, cb - 4)}}>
      <div style={{display: 'flex', alignItems: 'center', gap: 18}}>
        <div style={{width: 81.3 * scale * g, height: 90, background: C.mint, borderRadius: 12}} />
        <div style={{fontFamily: HEAD, fontSize: 44, color: C.mint}}>#1 $81.3B</div>
      </div>
      <div style={{display: 'flex', alignItems: 'center', gap: 18, marginTop: 24}}>
        <div style={{display: 'flex'}}>
          {parts.map(([n, v, col], k) => (
            <div key={k} style={{width: v * scale * interpolate(f, [cb + 10 + k * 8, cb + 30 + k * 8], [0, 1], clamp), height: 90, background: col, borderRight: `3px solid ${C.bg}`, display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', fontFamily: BODY, fontWeight: 700, fontSize: 24, color: C.bg, whiteSpace: 'nowrap'}}>{n}</div>
          ))}
        </div>
        <div style={{fontFamily: HEAD, fontSize: 44, color: C.cream, opacity: fade(f, cb + 40)}}>$73.9B</div>
      </div>
      <div style={{marginTop: 22}}><Pill o={fade(f, cb + 40)} size={34}>#1 alone &gt; #3 + #4 + #5 combined</Pill></div>
    </div>
  );
};

const ItemCard: React.FC<{i: number}> = ({i}) => {
  const f = useCurrentFrame();
  const it = ITEMS[i];
  const t0 = itemStart(i);
  const a = sp(f, t0), b = sp(f, t0 + 14);
  const vc = cx(VALKEY[it.rank]);
  const big = it.viz !== 'equation';
  let viz: React.ReactNode = null;
  if (it.viz === 'fifth') viz = <Fifth it={it} />;
  else if (it.viz === 'timeline') viz = <Timeline it={it} t0={t0} />;
  else if (it.viz === 'duel') viz = <Duel it={it} t0={t0} />;
  else if (it.viz === 'pair') viz = <Pair t0={t0} />;
  else if (it.viz === 'reign') viz = <Reign t0={t0} />;
  else if (it.viz === 'equation') viz = <Equation it={it} />;
  return (
    <div style={{position: 'absolute', left: 90, top: 120, width: 1380}}>
      <div style={{display: 'flex', alignItems: 'baseline', gap: 28, transform: `translateX(${(1 - a) * -80}px)`, opacity: a}}>
        <div style={{fontFamily: HEAD, fontSize: 190, color: C.amber, lineHeight: 0.9}}>#{it.rank}</div>
        <div>
          <div style={{fontFamily: HEAD, fontSize: 92, color: C.cream, lineHeight: 1}}>{it.name}</div>
          <div style={{opacity: b, fontFamily: BODY, fontWeight: 700, fontSize: 38, color: C.muted, marginTop: 8}}>{it.line}{it.fact ? `  ·  ${it.fact}` : ''}</div>
        </div>
      </div>
      {big && (
        <div style={{display: 'flex', alignItems: 'baseline', gap: 20, marginTop: 18, marginBottom: 16, opacity: fade(f, vc), transform: `scale(${0.8 + 0.2 * sp(f, vc)})`, transformOrigin: 'left'}}>
          <div style={{fontFamily: HEAD, fontSize: 96, color: C.mint, lineHeight: 1}}>{it.label}</div>
          <div style={{fontFamily: BODY, fontSize: 30, color: C.muted}}>{data.valueLabel}</div>
        </div>
      )}
      <div style={{marginTop: big ? 10 : 60}}>{viz}</div>
    </div>
  );
};

// ---------- twist ----------
const Twist: React.FC = () => {
  const f = useCurrentFrame();
  const t0 = twistStart;
  const card = (at: number, title: string, sub: string, lines: [string, string, number][], border: string) => (
    <div style={{width: 520, minHeight: 470, background: C.panel, borderRadius: 26, padding: '26px 30px', border: `4px solid ${border}`, opacity: fade(f, at), transform: `translateY(${(1 - sp(f, at)) * 40}px)`}}>
      <div style={{fontFamily: HEAD, fontSize: 40, color: C.cream, whiteSpace: 'nowrap'}}>{title}</div>
      <div style={{fontFamily: BODY, fontSize: 28, color: C.muted, marginTop: 4}}>{sub}</div>
      {lines.map(([big, small, a2], k) => (
        <div key={k} style={{marginTop: 22, opacity: fade(f, a2)}}>
          <div style={{fontFamily: HEAD, fontSize: 70, color: big.startsWith('-') ? C.coral : C.mint, lineHeight: 1}}>{big}</div>
          <div style={{fontFamily: BODY, fontWeight: 700, fontSize: 28, color: C.cream, marginTop: 4}}>{small}</div>
        </div>
      ))}
    </div>
  );
  return (
    <div style={{position: 'absolute', left: 80, top: 90, width: 1760}}>
      <div style={{transform: `scale(${sp(f, t0)})`, transformOrigin: 'left', fontFamily: HEAD, fontSize: 76, color: C.amber}}>{data.twist.title}</div>
      <div style={{display: 'flex', gap: 34, marginTop: 30}}>
        {card(cx('tw_quarter') - 30, 'Visa (#8)', 'IPO: $17.9B, under 1/4 of #1', [['+2,854%', 'since its IPO (as of May 2026)', cx('tw_visa')]], C.mint)}
        {card(cx('tw_aramco') - 6, 'Saudi Aramco (#4)', 'IPO: $25.6B, Dec 2019', [['-13%', 'below its IPO price', cx('tw_aramco') + 6]], C.coral)}
        {card(cx('tw_fb') - 6, 'Facebook (now #11)', 'IPO: $16.0B, May 2012', [['-47%', 'in its first 3 months', cx('tw_fb47')], ['+1,572%', 'since its IPO (as of May 2026)', cx('tw_fb1572')]], C.amber)}
      </div>
      <div style={{marginTop: 24, opacity: fade(f, cx('tw_end')), fontFamily: HEAD, fontSize: 40, color: C.cream}}>Day one is the loudest day. It's rarely the last word.</div>
    </div>
  );
};

// ---------- recap: sorted bars ----------
const Recap: React.FC = () => {
  const f = useCurrentFrame();
  const t0 = recapStart;
  const sorted = [...ITEMS].sort((a, b) => b.value - a.value);
  return (
    <div style={{position: 'absolute', left: 90, top: 80, width: 1500}}>
      <div style={{fontFamily: HEAD, fontSize: 60, color: C.amber, marginBottom: 14}}>RECAP · {data.title[0]}</div>
      {sorted.map((it, k) => {
        const at = t0 + fr(1.0) + (9 - k) * 14; // revealed 10 -> 1, matching the narration order
        const g = interpolate(f, [at, at + 18], [0, 1], clamp);
        return (
          <div key={it.rank} style={{display: 'flex', alignItems: 'center', height: 60, marginBottom: 6, opacity: fade(f, at)}}>
            <div style={{width: 70, fontFamily: HEAD, fontSize: 32, color: C.amber}}>#{it.rank}</div>
            <div style={{width: 270, fontFamily: BODY, fontWeight: 700, fontSize: 30, color: C.cream, whiteSpace: 'nowrap'}}>{it.name}</div>
            <div style={{width: (it.value / 81.3) * 900 * g, height: 42, borderRadius: 10, background: it.rank <= 2 ? C.mint : C.slate}} />
            <div style={{marginLeft: 16, fontFamily: HEAD, fontSize: 30, color: it.rank <= 2 ? C.mint : C.cream}}>{it.label}</div>
          </div>
        );
      })}
      <div style={{position: 'absolute', right: -280, top: 330, width: 440, display: 'flex', flexDirection: 'column', gap: 18}}>
        <Pill o={fade(f, cx('rc_top2'))} bg={C.mint} size={34}>Top 2: about $156B</Pill>
        <Pill o={fade(f, cx('rc_other'))} bg={C.panel2} color={C.cream} size={34}>Other 8 combined: about $165B</Pill>
      </div>
    </div>
  );
};

const CTA: React.FC = () => {
  const f = useCurrentFrame();
  const sub = SEG[data.cta.seg + 1] ?? ctaStart + 60;
  return (
    <div style={{position: 'absolute', left: 120, top: 170, width: 1150}}>
      <div style={{transform: `scale(${sp(f, ctaStart)})`, transformOrigin: 'left', fontFamily: HEAD, fontSize: 88, color: C.cream, lineHeight: 1.1}}>{data.cta.question}</div>
      <div style={{marginTop: 40}}><Pill o={fade(f, ctaStart + 20)} size={52}>Tell us in the comments ↓</Pill></div>
      <div style={{marginTop: 30}}><Pill o={fade(f, sub + 20)} bg={C.mint} size={52}>SUBSCRIBE to Chartography</Pill></div>
      <div style={{opacity: fade(f, sub + 70), marginTop: 30, fontFamily: BODY, fontWeight: 700, fontSize: 40, color: C.muted}}>{data.cta.next}</div>
    </div>
  );
};

export const Top10: React.FC = () => {
  const f = useCurrentFrame();
  let cur = -1;
  ITEMS.forEach((_, i) => { if (f >= itemStart(i)) cur = i; });
  const inTwist = f >= twistStart && f < recapStart;
  const inRecap = f >= recapStart && f < ctaStart;
  const inCta = f >= ctaStart;
  const inItems = cur >= 0 && !inTwist && !inRecap && !inCta;
  const segIdx = SEG.reduce((acc, s, i) => (f >= s ? i : acc), 0);
  const heroLine = T.who[segIdx] === 'hero' && f < fr(T.segEnd[segIdx]) + 6;
  const pose = (data.heroPoses || {})[String(segIdx)] || (heroLine ? 'shock_shock' : inTwist ? 'think_talk' : 'stand_smile');
  let hero: React.ReactNode;
  if (inCta) hero = <Hero key="cta" pose={segIdx >= 17 ? 'wave_happy' : 'point_talk'} x={1560} y={1010} h={720} from={ctaStart} />;
  else if (heroLine && cur < 0) hero = <Hero key="h0" pose={pose} x={1180} y={1000} h={520} from={0} />;
  else if (heroLine) hero = <Hero key={`h${segIdx}`} pose={pose} x={1700} y={1000} h={600} from={SEG[segIdx]} flip />;
  else if (inTwist) hero = <Hero key="tw" pose="think_talk" x={1730} y={1060} h={330} from={twistStart} />;
  else if (inRecap) hero = null;
  else hero = <Hero pose={pose} x={1230} y={1065} h={250} flip={pose.startsWith('point')} />;
  return (
    <AbsoluteFill>
      <Background />
      {cur < 0 && <Intro />}
      {inItems && <ItemCard key={cur} i={cur} />}
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

// ---------- thumbnails (1280x720) ----------
const Mascot: React.FC<{pose: string; h?: number}> = ({pose, h = 420}) => (
  <Img src={staticFile(`sprites/hero_${pose}.png`)} style={{position: 'absolute', right: 30, bottom: -10, height: h, width: h * 0.6, transform: 'scaleX(-1)'}} />
);
export const ThumbA: React.FC = () => (
  <AbsoluteFill>
    <Background w={1280} h={720} />
    <div style={{position: 'absolute', left: 56, top: 44}}>
      <div style={{display: 'inline-block', background: C.coral, color: C.bg, fontFamily: HEAD, fontSize: 58, padding: '6px 24px', borderRadius: 16}}>#1 JUST CHANGED</div>
      <div style={{fontFamily: HEAD, fontSize: 210, color: C.mint, lineHeight: 1, marginTop: 18}}>$81.3B</div>
      <div style={{fontFamily: HEAD, fontSize: 84, color: C.cream, marginTop: 8}}>in ONE night?</div>
      <div style={{display: 'flex', alignItems: 'center', gap: 18, marginTop: 22}}>
        <div style={{fontFamily: BODY, fontWeight: 700, fontSize: 54, color: C.muted}}>old #1:</div>
        <div style={{position: 'relative', fontFamily: HEAD, fontSize: 76, color: C.amber}}>$75B
          <div style={{position: 'absolute', left: -8, right: -8, top: '48%', height: 10, background: C.coral, transform: 'rotate(-8deg)', borderRadius: 5}} />
        </div>
      </div>
    </div>
    <Mascot pose="point_smile" />
  </AbsoluteFill>
);
export const ThumbB: React.FC = () => (
  <AbsoluteFill>
    <Background w={1280} h={720} />
    <div style={{position: 'absolute', left: 56, top: 40}}>
      <div style={{fontFamily: HEAD, fontSize: 150, color: C.cream, lineHeight: 1}}>TOP 10</div>
      <div style={{fontFamily: HEAD, fontSize: 96, color: C.amber, lineHeight: 1.05}}>IPOs EVER</div>
      <div style={{display: 'flex', alignItems: 'center', gap: 30, marginTop: 34}}>
        <div style={{fontFamily: HEAD, fontSize: 130, color: C.mint}}>#1 = ?</div>
      </div>
      <div style={{fontFamily: BODY, fontWeight: 700, fontSize: 46, color: C.muted, marginTop: 10}}>(it's only been #1 since Nov 18)</div>
    </div>
    <Mascot pose="shock_shock" />
  </AbsoluteFill>
);
export const ThumbC: React.FC = () => (
  <AbsoluteFill>
    <Background w={1280} h={720} />
    <div style={{position: 'absolute', left: 56, top: 50, width: 820}}>
      <div style={{fontFamily: HEAD, fontSize: 70, color: C.cream}}>#1 vs #10</div>
      <div style={{display: 'flex', alignItems: 'center', gap: 20, marginTop: 30}}>
        <div style={{width: 520, height: 120, background: C.mint, borderRadius: 16}} />
        <div style={{fontFamily: HEAD, fontSize: 84, color: C.mint}}>$81.3B</div>
      </div>
      <div style={{display: 'flex', alignItems: 'center', gap: 20, marginTop: 26}}>
        <div style={{width: 105, height: 120, background: C.slate, borderRadius: 16}} />
        <div style={{fontFamily: HEAD, fontSize: 84, color: C.cream}}>$16.5B</div>
      </div>
      <div style={{fontFamily: HEAD, fontSize: 64, color: C.amber, marginTop: 34}}>in ONE night?!</div>
    </div>
    <Mascot pose="point_smile" />
  </AbsoluteFill>
);

export const Root: React.FC = () => (
  <>
    <Composition id="Top10" component={Top10} durationInFrames={END} fps={FPS} width={1920} height={1080} />
    <Composition id="ThumbA" component={ThumbA} durationInFrames={1} fps={FPS} width={1280} height={720} />
    <Composition id="ThumbB" component={ThumbB} durationInFrames={1} fps={FPS} width={1280} height={720} />
    <Composition id="ThumbC" component={ThumbC} durationInFrames={1} fps={FPS} width={1280} height={720} />
  </>
);
