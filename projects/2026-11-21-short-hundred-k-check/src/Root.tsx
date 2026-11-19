import React from 'react';
import {
  AbsoluteFill, Audio, Composition, Img, Sequence, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig, Easing,
} from 'remotion';
import T from './timing.json';
import '@fontsource/archivo-black/latin-400.css';
import '@fontsource/fira-sans/latin-400.css';
import '@fontsource/fira-sans/latin-700.css';

// Chartography brand palette (chartography_engine.py)
const C = {
  bg: '#0e1b2e', panel: '#16283f', cream: '#f6f1e7', muted: '#afb8c6', slate: '#5c7392',
  mint: '#3fd6a0', amber: '#f2b544', coral: '#ff8a65', red: '#ff5d5d',
};
const HEAD = "'Archivo Black', sans-serif";
const BODY = "'Fira Sans', sans-serif";
const FPS = 30;
const fr = (s: number) => Math.round(s * FPS);
const Q = Object.fromEntries(Object.entries(T.cues).map(([k, v]) => [k, fr(v as number)])) as Record<string, number>;
const TOTAL = fr(T.dur + 1.5);
const clamp = {extrapolateLeft: 'clamp' as const, extrapolateRight: 'clamp' as const};

// ---------- shared ----------
const Background: React.FC = () => {
  const f = useCurrentFrame();
  const dots = Array.from({length: 46}, (_, i) => {
    const x = (i * 263) % 1080;
    const y = ((i * 517) % 1920 + f * (0.3 + (i % 5) * 0.12)) % 1920;
    return <circle key={i} cx={x} cy={1920 - y} r={2 + (i % 3)} fill={i % 7 === 0 ? C.amber : '#ffffff'} opacity={0.07 + (i % 4) * 0.03} />;
  });
  return (
    <AbsoluteFill style={{background: `radial-gradient(circle at 50% 32%, #1d3557, ${C.bg} 72%)`}}>
      <svg width={1080} height={1920}>{dots}</svg>
    </AbsoluteFill>
  );
};

// the full-body mascot (hero.py sprites), with a little bob and a pop-in
const Hero: React.FC<{pose: string; x: number; y: number; h: number; from?: number; flip?: boolean}> = ({pose, x, y, h, from = 0, flip}) => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const s = spring({frame: f - from, fps, config: {damping: 11, stiffness: 160}});
  const bob = Math.sin(f / 7) * 5;
  const w = h * 0.6;
  return (
    <Img src={staticFile(`sprites/hero_${pose}.png`)} style={{
      position: 'absolute', left: x - w / 2, top: y - h + bob + (1 - s) * 80, width: w, height: h,
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

const Source: React.FC = () => (
  <div style={{position: 'absolute', bottom: 70, left: 60, right: 60, textAlign: 'center', fontFamily: BODY, fontSize: 26, color: C.muted}}>
    Sources: Wikipedia, Google ($100,000 check, Aug 1998) · CompaniesMarketCap (market values, Nov 16, 2026 close; Alphabet about $3.4T on Nov 18)
  </div>
);

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
        <div style={{position: 'absolute', top: 1190, left: 290, right: 40, textAlign: 'center', fontFamily: HEAD, fontSize: 70, lineHeight: 1.15, color: '#fff', WebkitTextStroke: `10px ${C.bg}`, paintOrder: 'stroke fill'}}>
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

// ---------- scenes (frames relative to each Sequence start) ----------
// Nov 21, 2026 cut Short: "$100,000 -> $3.5 trillion" (the #1 stretch of "Top 10 Simple Ideas That Made Billions").
const Hook: React.FC<{dur: number}> = ({dur}) => (
  <Fade dur={dur}>
    <AbsoluteFill style={{alignItems: 'center', paddingTop: 250, textAlign: 'center'}}>
      <div style={{background: C.amber, color: C.bg, fontFamily: HEAD, fontSize: 64, padding: '10px 40px', borderRadius: 24}}>#1 SIMPLE IDEA</div>
      <div style={{fontFamily: HEAD, fontSize: 190, color: C.mint, marginTop: 36, lineHeight: 1}}>$100,000</div>
      <div style={{fontFamily: BODY, fontWeight: 700, fontSize: 50, color: C.cream, marginTop: 16}}>ONE CHECK · AUGUST 1998</div>
      <Pop delay={8}><div style={{fontFamily: HEAD, fontSize: 104, color: C.amber, marginTop: 40}}>→ $3.4T+ ?</div></Pop>
    </AbsoluteFill>
  </Fade>
);

const Garage: React.FC<{dur: number}> = ({dur}) => {
  const f = useCurrentFrame();
  const door = interpolate(f, [8, 30], [0, 1], clamp);
  return (
    <Fade dur={dur}>
      <div style={{position: 'absolute', top: 260, width: '100%', textAlign: 'center'}}>
        <Pop><div style={{fontFamily: HEAD, fontSize: 76, color: C.cream}}>THE OFFICE?</div></Pop>
      </div>
      <svg width={1080} height={1920} style={{position: 'absolute', top: 0, left: 0}}>
        <polygon points="240,640 540,440 840,640" fill={C.slate} />
        <rect x={270} y={640} width={540} height={420} fill={C.panel} stroke={C.slate} strokeWidth={10} />
        <rect x={340} y={720} width={400} height={340 * (1 - door * 0.75)} fill={C.cream} opacity={0.9} />
        {[0, 1, 2, 3].map((i) => <line key={i} x1={340} x2={740} y1={720 + i * 80 * (1 - door * 0.75)} y2={720 + i * 80 * (1 - door * 0.75)} stroke={C.slate} strokeWidth={6} />)}
        <rect x={420} y={960 - 20} width={240} height={100} fill={C.amber} opacity={door} rx={10} />
      </svg>
      <div style={{position: 'absolute', top: 950, width: '100%', textAlign: 'center', opacity: door}}>
        <div style={{fontFamily: HEAD, fontSize: 44, color: C.bg}}>DESK</div>
      </div>
      <div style={{position: 'absolute', top: 1090, width: '100%', textAlign: 'center'}}>
        <Pop delay={12}><div style={{fontFamily: HEAD, fontSize: 70, color: C.amber}}>A GARAGE.</div></Pop>
      </div>
    </Fade>
  );
};

const Today: React.FC<{dur: number; off: number}> = ({dur, off}) => {
  const f = useCurrentFrame();
  const w = Q.worth - off;
  const v = interpolate(f, [w, w + 30], [0, 3.5], {...clamp, easing: Easing.out(Easing.cubic)});
  return (
    <Fade dur={dur}>
      <AbsoluteFill style={{alignItems: 'center', paddingTop: 280, textAlign: 'center'}}>
        <Pop><div style={{fontFamily: BODY, fontWeight: 700, fontSize: 52, color: C.muted}}>TODAY: ALPHABET (GOOGLE)</div></Pop>
        <div style={{fontFamily: HEAD, fontSize: 200, color: C.mint, marginTop: 40, lineHeight: 1}}>{f < w ? "$ ?" : `$${v.toFixed(1)}`}</div>
        <div style={{fontFamily: HEAD, fontSize: 110, color: C.mint}}>TRILLION</div>
        <div style={{opacity: interpolate(f, [w + 30, w + 40], [0, 1], clamp), fontFamily: BODY, fontSize: 36, color: C.muted, marginTop: 24}}>market value, Nov 16 close<br />(about $3.4T on Nov 18)</div>
      </AbsoluteFill>
    </Fade>
  );
};

const Times: React.FC<{dur: number; off: number}> = ({dur, off}) => {
  const f = useCurrentFrame();
  const n = 20 * 24;
  const g = interpolate(f, [6, 40], [0, n], clamp);
  return (
    <Fade dur={dur}>
      <AbsoluteFill style={{alignItems: 'center', paddingTop: 260, textAlign: 'center'}}>
        <Pop><div style={{fontFamily: HEAD, fontSize: 150, color: C.amber, lineHeight: 1}}>× 35</div></Pop>
        <Pop delay={6}><div style={{fontFamily: HEAD, fontSize: 92, color: C.amber}}>MILLION</div></Pop>
        <div style={{fontFamily: BODY, fontWeight: 700, fontSize: 40, color: C.cream, marginTop: 10}}>the first check, Nov 16 close</div>
        <svg width={760} height={330} style={{marginTop: 40}}>
          {Array.from({length: n}, (_, i) => (
            <rect key={i} x={(i % 24) * 31.6} y={Math.floor(i / 24) * 16.5} width={26} height={12} rx={3} fill={i === 0 ? C.amber : C.mint} opacity={i < g ? (i === 0 ? 1 : 0.55) : 0} />
          ))}
        </svg>
      </AbsoluteFill>
    </Fade>
  );
};

const Twist: React.FC<{dur: number; off: number}> = ({dur, off}) => {
  const chips: [string, string, string][] = [['button', 'A BUTTON FOR A RIDE', 'Uber'], ['kitchen', 'A FASTER KITCHEN', "McDonald's"], ['dvd', 'A DVD IN AN ENVELOPE', 'Netflix'], ['drink', 'A 5-CENT DRINK', 'Coca-Cola']];
  return (
    <Fade dur={dur + 10}>
      <div style={{position: 'absolute', top: 250, width: '100%', textAlign: 'center'}}>
        <Pop><div style={{fontFamily: HEAD, fontSize: 84, color: C.coral}}>THE TWIST</div></Pop>
      </div>
      <div style={{position: 'absolute', top: 380, left: 90, right: 90}}>
        {chips.map(([k, a, b]) => (
          <Pop key={k} delay={Q[k] - off}>
            <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: C.panel, borderRadius: 22, padding: '16px 30px', marginBottom: 16}}>
              <div style={{fontFamily: HEAD, fontSize: 40, color: C.cream}}>{a}</div>
              <div style={{fontFamily: BODY, fontWeight: 700, fontSize: 34, color: C.muted}}>{b}</div>
            </div>
          </Pop>
        ))}
      </div>
      <div style={{position: 'absolute', top: 870, width: '100%', textAlign: 'center'}}>
        <Pop delay={Q.small - off}><div style={{fontFamily: HEAD, fontSize: 56, color: C.amber}}>ALL STARTED SMALL</div></Pop>
        <Pop delay={Q.eleven - off}><div style={{fontFamily: HEAD, fontSize: 70, color: C.mint, marginTop: 14}}>10 IDEAS ≈ $11 TRILLION</div></Pop>
      </div>
    </Fade>
  );
};

const EndCard: React.FC<{dur: number}> = ({dur}) => (
  <AbsoluteFill style={{alignItems: 'center', paddingTop: 300, textAlign: 'center', background: 'rgba(14,27,46,0.92)'}}>
    <Pop><div style={{fontFamily: HEAD, fontSize: 80, color: C.cream, lineHeight: 1.05}}>FULL TOP 10<br /><span style={{color: C.amber}}>ON THE CHANNEL</span></div></Pop>
    <Pop delay={6}><div style={{fontFamily: BODY, fontWeight: 700, fontSize: 46, color: C.muted, marginTop: 36}}>...and #1 started with one check:</div></Pop>
  </AbsoluteFill>
);

const HeroTrack: React.FC = () => {
  const f = useCurrentFrame();
  const end = fr(T.dur);
  if (f < Q.garage) return <Hero pose="shock_shock" x={180} y={1480} h={400} />;
  if (f >= Q.hero && f < Q.twist - 8) return <Hero key="h" pose="shock_shock" x={180} y={1480} h={400} from={Q.hero} />;
  if (f >= end) return <Hero key="e" pose="point_smile" x={540} y={1480} h={460} from={end} />;
  return <Hero pose={f < Q.hero ? 'point_smile' : 'think_talk'} flip x={170} y={1480} h={340} />;
};

export const CheckShort: React.FC = () => {
  const end = fr(T.dur);
  const st = [0, Q.garage, Q.today, Q.x35, Q.twist - 10, end];
  const D = (i: number) => st[i + 1] - st[i];
  return (
    <AbsoluteFill>
      <Background />
      <Sequence durationInFrames={D(0)}><Hook dur={D(0)} /></Sequence>
      <Sequence from={st[1]} durationInFrames={D(1)}><Garage dur={D(1)} /></Sequence>
      <Sequence from={st[2]} durationInFrames={D(2)}><Today dur={D(2)} off={st[2]} /></Sequence>
      <Sequence from={st[3]} durationInFrames={D(3)}><Times dur={D(3)} off={st[3]} /></Sequence>
      <Sequence from={st[4]} durationInFrames={D(4)}><Twist dur={D(4)} off={st[4]} /></Sequence>
      <Sequence from={end} durationInFrames={TOTAL - end}><EndCard dur={TOTAL - end} /></Sequence>
      <HeroTrack />
      <Brand />
      <Captions />
      <Source />
      <Audio src={staticFile('vo.mp3')} />
    </AbsoluteFill>
  );
};

export const Root: React.FC = () => (
  <Composition id="CheckShort" component={CheckShort} durationInFrames={TOTAL} fps={FPS} width={1080} height={1920} />
);
