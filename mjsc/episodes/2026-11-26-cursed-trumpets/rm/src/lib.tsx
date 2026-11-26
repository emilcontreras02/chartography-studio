import React from 'react';
import {useCurrentFrame, spring, interpolate, Easing, AbsoluteFill, Img, staticFile} from 'remotion';
import '@fontsource/archivo-black';
import '@fontsource/fira-sans/600.css';
import '@fontsource/fira-sans/800.css';
import '@fontsource/caveat/700.css';
import timing from './timing.json';
import cuesJson from './cues.json';

export const FPS = 30;
export const W = 1920, H = 1080;
export const C = {
  ink: '#2a1d14', sand: '#ecd3a0', sand2: '#e2c086', clay: '#c99a63', clayD: '#9c6b3c', clayL: '#ddb784', terra: '#c4572e',
  sea: '#2f7b86', seaD: '#1f5560', sky1: '#f8dfb0', sky2: '#9fd0d6', night: '#141c34', night2: '#2a2f5a', fire: '#ff7a1a',
  fire2: '#ffcf4a', gold: '#f2b33d', orange: '#e8562a', cream: '#fff6e6', green: '#6f9a4a', greenD: '#4b7234', stone: '#b9a68a',
  stoneD: '#8c7a62', red: '#d8342b', paper: '#f4e6c8', white: '#ffffff', blue: '#3b6fb6',
};
export const FONT = {title: 'Archivo Black', body: 'Fira Sans', hand: 'Caveat'};

type Scene = {id: string; dur: number; head: number; frames: number; words: [string, number][]; env: number[]};
export const SCENES = timing as unknown as Scene[];
export const sceneById = (id: string) => SCENES.find((s) => s.id === id)!;
const CUES = cuesJson as Record<string, Record<string, number>>;
export const cue = (scene: string, key: string) => {
  const v = CUES[scene]?.[key];
  if (v === undefined) throw new Error('missing cue ' + scene + '.' + key);
  return v;
};

export const useT = () => useCurrentFrame() / FPS;
export const clamp = (x: number, a = 0, b = 1) => Math.max(a, Math.min(b, x));
export const ease = (x: number) => 1 - Math.pow(1 - clamp(x), 3);
/** 0..1 eased progress from time a over d seconds */
export const prog = (t: number, a: number, d = 0.5) => ease((t - a) / d);
/** springy 0..1(overshoot) pop starting at second a */
export const usePop = () => {
  const f = useCurrentFrame();
  return (a: number, damping = 11) => (f < a * FPS ? 0 : spring({frame: f - a * FPS, fps: FPS, config: {damping, mass: 0.55, stiffness: 140}}));
};
export const wob = (t: number, speed = 1, amt = 1, ph = 0) => Math.sin(t * speed * 2 * Math.PI + ph) * amt;

/* ---------------- outlined title text (thumbnail style) ---------------- */
export const Title: React.FC<{x: number; y: number; size: number; children: React.ReactNode; fill?: string; stroke?: string; sw?: number;
  anchor?: 'start' | 'middle' | 'end'; s?: number; rot?: number; o?: number; font?: string; ls?: number}> = ({x, y, size, children, fill = C.white, stroke = C.ink, sw, anchor = 'middle', s = 1, rot = 0, o = 1, font = FONT.title, ls = 0}) => (
  <g transform={`translate(${x},${y}) rotate(${rot}) scale(${s})`} opacity={o}>
    <text x={0} y={0} fontFamily={font} fontSize={size} textAnchor={anchor} fill={fill} stroke={stroke} strokeWidth={sw ?? size * 0.16}
      strokeLinejoin="round" paintOrder="stroke" letterSpacing={ls} dominantBaseline="middle">{children}</text>
  </g>
);

/** paper tag with handwritten label */
export const Tag: React.FC<{x: number; y: number; text: string; s?: number; rot?: number; size?: number; fill?: string; color?: string; w?: number}> = ({x, y, text, s = 1, rot = -3, size = 54, fill = C.paper, color = C.ink, w}) => {
  const ww = w ?? text.length * size * 0.42 + 60;
  return (
    <g transform={`translate(${x},${y}) rotate(${rot}) scale(${s})`}>
      <rect x={-ww / 2 + 6} y={-size * 0.75 + 8} width={ww} height={size * 1.5} rx={10} fill="rgba(0,0,0,.25)" />
      <rect x={-ww / 2} y={-size * 0.75} width={ww} height={size * 1.5} rx={10} fill={fill} stroke={C.ink} strokeWidth={5} />
      <text x={0} y={4} fontFamily={FONT.hand} fontWeight={700} fontSize={size} fill={color} textAnchor="middle" dominantBaseline="middle">{text}</text>
    </g>
  );
};

/* ---------------- full-frame helpers ---------------- */
export const Grain: React.FC<{o?: number}> = ({o = 0.12}) => (
  <AbsoluteFill style={{mixBlendMode: 'overlay', opacity: o, pointerEvents: 'none'}}>
    <Img src={staticFile('grain.png')} style={{width: '100%', height: '100%'}} />
  </AbsoluteFill>
);
export const Vignette: React.FC<{o?: number}> = ({o = 0.45}) => (
  <AbsoluteFill style={{background: `radial-gradient(ellipse at center, rgba(0,0,0,0) 55%, rgba(20,10,0,${o}) 100%)`}} />
);

/** scene wrapper: slow camera push, dip-to-black at both ends */
export const Stage: React.FC<{frames: number; children: React.ReactNode; zoom?: [number, number]; origin?: string; bg?: string; dip?: number}> = ({frames, children, zoom = [1, 1.05], origin = '50% 50%', bg = '#000', dip = 8}) => {
  const f = useCurrentFrame();
  const z = interpolate(f, [0, frames], zoom, {easing: Easing.inOut(Easing.quad)});
  const o = Math.min(clamp(f / dip), clamp((frames - f) / dip));
  return (
    <AbsoluteFill style={{background: bg}}>
      <AbsoluteFill style={{transform: `scale(${z})`, transformOrigin: origin, opacity: o}}>
        <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`}>{children}</svg>
      </AbsoluteFill>
      <AbsoluteFill style={{opacity: o}}><Grain /><Vignette /></AbsoluteFill>
    </AbsoluteFill>
  );
};

/* ---------------- MJ, the channel mascot ---------------- */
type ArmPose = [number, number]; // [upper deg from straight-down (outward +), forearm extra bend deg]
export type Pose = 'idle' | 'point' | 'wave' | 'shrug' | 'think' | 'present' | 'shock' | 'sit';
const POSES: Record<Pose, {l: ArmPose; r: ArmPose}> = {
  idle: {l: [18, 10], r: [18, 10]},
  point: {l: [16, 12], r: [118, -8]},
  wave: {l: [16, 10], r: [150, 35]},
  shrug: {l: [70, 95], r: [70, 95]},
  think: {l: [18, 10], r: [30, 140]},
  present: {l: [70, -10], r: [70, -10]},
  shock: {l: [140, 25], r: [140, 25]},
  sit: {l: [40, 60], r: [40, 60]},
};
const armPts = (sx: number, sy: number, side: number, p: ArmPose, L1 = 70, L2 = 66) => {
  const a1 = (p[0] * Math.PI) / 180, a2 = ((p[0] + p[1]) * Math.PI) / 180;
  const ex = sx + side * Math.sin(a1) * L1, ey = sy + Math.cos(a1) * L1;
  const hx = ex + side * Math.sin(a2) * L2, hy = ey + Math.cos(a2) * L2;
  return {ex, ey, hx, hy};
};

/** MJ: feet at (x,y). talk 0..1 opens the mouth. walk>0 animates legs. */
export const MJ: React.FC<{x: number; y: number; s?: number; pose?: Pose; t: number; talk?: number; walk?: number; flip?: boolean; look?: number; o?: number}> = ({x, y, s = 1, pose = 'idle', t, talk = 0, walk = 0, flip = false, look = 0, o = 1}) => {
  const P = POSES[pose];
  const bob = walk ? Math.abs(Math.sin(t * Math.PI * 2 * 1.6)) * 8 : wob(t, 0.45, 3);
  const sway = (pose === 'wave' ? wob(t, 1.6, 22) : 0);
  const blink = (t % 3.3) < 0.12 ? 0.1 : 1;
  const hipY = -150 - bob, neckY = -262 - bob, headY = -334 - bob;
  const lw = 9;
  const legSw = walk ? Math.sin(t * Math.PI * 2 * 1.6) * 26 : 0;
  const sit = pose === 'sit';
  const legs = sit
    ? [`M -6 ${hipY} L -70 ${hipY + 10} L -78 ${hipY + 110}`, `M 6 ${hipY} L -40 ${hipY + 14} L -44 ${hipY + 112}`]
    : [`M -4 ${hipY} L ${-26 + legSw} -4`, `M 4 ${hipY} L ${26 - legSw} -4`];
  const feet = sit ? [[-86, hipY + 114], [-52, hipY + 116]] : [[-34 + legSw, -2], [34 - legSw, -2]];
  const la = armPts(-2, neckY + 18, -1, P.l);
  const rr: ArmPose = [P.r[0] + (pose === 'wave' ? sway * 0.3 : 0), P.r[1] + sway];
  const ra = armPts(2, neckY + 18, 1, rr);
  const mo = clamp(talk);
  return (
    <g transform={`translate(${x},${y}) scale(${(flip ? -1 : 1) * s},${s})`} opacity={o}>
      <ellipse cx={sit ? -40 : 0} cy={sit ? hipY + 118 : 0} rx={70} ry={12} fill="rgba(0,0,0,.18)" />
      {legs.map((d, i) => <path key={i} d={d} stroke={C.ink} strokeWidth={lw} fill="none" strokeLinecap="round" strokeLinejoin="round" />)}
      {feet.map(([fx, fy], i) => <ellipse key={i} cx={fx + (i ? 6 : -6) * (sit ? 0 : 1)} cy={fy} rx={20} ry={11} fill={C.orange} stroke={C.ink} strokeWidth={5} />)}
      <path d={`M 0 ${neckY} L 0 ${hipY}`} stroke={C.ink} strokeWidth={lw} strokeLinecap="round" />
      {[la, ra].map((a, i) => (
        <g key={i}>
          <path d={`M ${i ? 2 : -2} ${neckY + 18} L ${a.ex} ${a.ey} L ${a.hx} ${a.hy}`} stroke={C.ink} strokeWidth={lw} fill="none" strokeLinecap="round" strokeLinejoin="round" />
          <circle cx={a.hx} cy={a.hy} r={11} fill={C.cream} stroke={C.ink} strokeWidth={5} />
        </g>
      ))}
      {/* head */}
      <g transform={`translate(0,${headY}) rotate(${look})`}>
        <circle r={74} fill={C.cream} stroke={C.ink} strokeWidth={7} />
        {/* hair tuft */}
        <path d="M -18 -72 q 6 -26 22 -8 q 8 -24 24 -2" fill="none" stroke={C.ink} strokeWidth={7} strokeLinecap="round" />
        {/* headphones */}
        <path d="M -80 -4 A 82 86 0 0 1 80 -4" fill="none" stroke={C.ink} strokeWidth={22} strokeLinecap="round" />
        <path d="M -80 -4 A 82 86 0 0 1 80 -4" fill="none" stroke={C.orange} strokeWidth={11} strokeLinecap="round" />
        <rect x={-98} y={-26} width={34} height={56} rx={14} fill={C.orange} stroke={C.ink} strokeWidth={6} />
        <rect x={64} y={-26} width={34} height={56} rx={14} fill={C.orange} stroke={C.ink} strokeWidth={6} />
        {/* face */}
        <g transform={`scale(1,${blink})`}>
          <ellipse cx={-24} cy={-6} rx={9} ry={11} fill={C.ink} />
          <ellipse cx={26} cy={-6} rx={9} ry={11} fill={C.ink} />
          <circle cx={-21} cy={-10} r={3} fill="#fff" /><circle cx={29} cy={-10} r={3} fill="#fff" />
        </g>
        <path d={pose === 'shock' ? 'M -38 -30 l 22 -8 M 16 -38 l 22 8' : 'M -38 -28 l 22 -4 M 16 -32 l 22 4'} stroke={C.ink} strokeWidth={6} strokeLinecap="round" />
        <circle cx={-46} cy={18} r={10} fill="#f4a38a" opacity={0.6} /><circle cx={48} cy={18} r={10} fill="#f4a38a" opacity={0.6} />
        {pose === 'shock'
          ? <ellipse cx={2} cy={30} rx={16} ry={20} fill={C.ink} />
          : mo > 0.08
            ? <g><ellipse cx={2} cy={28} rx={18 + mo * 4} ry={4 + mo * 15} fill={C.ink} /><ellipse cx={2} cy={34 + mo * 6} rx={9} ry={3 + mo * 4} fill="#e66" opacity={mo > 0.3 ? 1 : 0} /></g>
            : <path d="M -16 24 Q 2 40 20 24" fill="none" stroke={C.ink} strokeWidth={6} strokeLinecap="round" />}
      </g>
    </g>
  );
};

/** MJ's mouth opening for this scene at time t (scene-local seconds) */
export const talkAt = (sceneId: string, t: number) => {
  const s = sceneById(sceneId);
  const i = Math.floor((t - s.head) * FPS);
  if (i < 0 || i >= s.env.length) return 0;
  return s.env[i];
};

/* ---------------- generic stick person (side characters) ---------------- */
export const Stick: React.FC<{x: number; y: number; s?: number; t: number; hat?: 'pith' | 'scarf' | 'none' | 'crown' | 'helmet'; walk?: number; arms?: [ArmPose, ArmPose]; flip?: boolean; color?: string; head?: string; o?: number}> = ({x, y, s = 1, t, hat = 'none', walk = 0, arms, flip = false, color = C.ink, head = C.cream, o = 1}) => {
  const legSw = walk ? Math.sin(t * Math.PI * 2 * walk) * 22 : 0;
  const bob = walk ? Math.abs(Math.sin(t * Math.PI * 2 * walk)) * 6 : 0;
  const hipY = -110 - bob, neckY = -195 - bob, headY = -238 - bob;
  const A = arms ?? [[20 + legSw * 0.6, 15], [20 - legSw * 0.6, 15]];
  const la = armPts(0, neckY + 12, -1, A[0], 54, 50), ra = armPts(0, neckY + 12, 1, A[1], 54, 50);
  return (
    <g transform={`translate(${x},${y}) scale(${(flip ? -1 : 1) * s},${s})`} opacity={o}>
      <ellipse cx={0} cy={0} rx={48} ry={9} fill="rgba(0,0,0,.16)" />
      <path d={`M 0 ${hipY} L ${-20 + legSw} -3 M 0 ${hipY} L ${20 - legSw} -3 M 0 ${neckY} L 0 ${hipY}`} stroke={color} strokeWidth={8} strokeLinecap="round" fill="none" />
      <path d={`M 0 ${neckY + 12} L ${la.ex} ${la.ey} L ${la.hx} ${la.hy} M 0 ${neckY + 12} L ${ra.ex} ${ra.ey} L ${ra.hx} ${ra.hy}`} stroke={color} strokeWidth={8} strokeLinecap="round" strokeLinejoin="round" fill="none" />
      <circle cx={0} cy={headY} r={44} fill={head} stroke={C.ink} strokeWidth={6} />
      <circle cx={-12} cy={headY - 2} r={5} fill={C.ink} /><circle cx={14} cy={headY - 2} r={5} fill={C.ink} />
      <path d={`M -10 ${headY + 18} q 12 8 22 0`} stroke={C.ink} strokeWidth={4} fill="none" strokeLinecap="round" />
      {hat === 'pith' && <g><ellipse cx={0} cy={headY - 26} rx={62} ry={12} fill="#e8d8a8" stroke={C.ink} strokeWidth={5} /><path d={`M -38 ${headY - 28} Q 0 ${headY - 86} 38 ${headY - 28} Z`} fill="#e8d8a8" stroke={C.ink} strokeWidth={5} /></g>}
      {hat === 'scarf' && <path d={`M -46 ${headY - 4} Q 0 ${headY - 70} 46 ${headY - 4} L 50 ${headY + 30} L 36 ${headY + 4} Q 0 ${headY - 40} -36 ${headY + 4} Z`} fill="#f1ece0" stroke={C.ink} strokeWidth={5} />}
      {hat === 'helmet' && <path d={`M -46 ${headY - 6} Q 0 ${headY - 80} 46 ${headY - 6} Z`} fill="#9aa3ab" stroke={C.ink} strokeWidth={5} />}
      {hat === 'crown' && <path d={`M -34 ${headY - 34} l 0 -34 l 17 18 l 17 -26 l 17 26 l 17 -18 l 0 34 Z`} fill={C.gold} stroke={C.ink} strokeWidth={5} />}
    </g>
  );
};

/* ---------------- the clay tablet ---------------- */
// deterministic pseudo-random
export const rnd = (i: number) => {
  const x = Math.sin(i * 127.1 + 311.7) * 43758.5453;
  return x - Math.floor(x);
};
const Wedge: React.FC<{x: number; y: number; r: number; k: number}> = ({x, y, r, k}) => {
  const v = Math.floor(rnd(k) * 3);
  const s = 0.8 + rnd(k + 9) * 0.5;
  return (
    <g transform={`translate(${x},${y}) rotate(${v === 2 ? 90 : v === 1 ? 35 : 0}) scale(${s})`}>
      <path d="M -6 -9 L 6 -9 L 0 3 Z" fill={C.clayD} />
      <path d="M 0 3 L 0 15" stroke={C.clayD} strokeWidth={3} strokeLinecap="round" />
    </g>
  );
};
/** Tablet centered at (x,y), size w x h. reveal 0..1 writes the signs in. glow adds firelight. */
export const Tablet: React.FC<{x: number; y: number; w?: number; h?: number; reveal?: number; glow?: number; rot?: number; s?: number; seed?: number; split?: number; cracks?: boolean; hl?: 'top' | 'bottom' | 'colophon' | null; o?: number}> = ({x, y, w = 420, h = 560, reveal = 1, glow = 0, rot = 0, s = 1, seed = 1, split = 0, cracks = true, hl = null, o = 1}) => {
  const rows: React.ReactNode[] = [];
  const top = -h / 2 + 50;
  const lines = Math.floor((h - 100) / 36);
  const dbl = Math.floor(lines * 0.36);
  let k = seed * 1000;
  let count = 0;
  const totalSigns = lines * 9;
  for (let r = 0; r < lines; r++) {
    if (r === dbl) continue;
    const ry = top + r * 36 + 14;
    const per = r === lines - 1 ? 4 : 7 + Math.floor(rnd(k) * 4);
    for (let c = 0; c < per; c++) {
      k++; count++;
      if (count / totalSigns > reveal) continue;
      rows.push(<Wedge key={k} x={-w / 2 + 44 + c * ((w - 88) / 10) + rnd(k) * 10} y={ry} r={1} k={k} />);
    }
  }
  const dy = top + dbl * 36 + 14;
  const edge = `M ${-w / 2 + 30} ${-h / 2} Q 0 ${-h / 2 - 14} ${w / 2 - 30} ${-h / 2} Q ${w / 2 + 6} ${-h / 2} ${w / 2} ${-h / 2 + 34} L ${w / 2 + 8} ${h / 2 - 40} Q ${w / 2} ${h / 2 + 6} ${w / 2 - 40} ${h / 2} Q 0 ${h / 2 + 12} ${-w / 2 + 34} ${h / 2} Q ${-w / 2 - 4} ${h / 2} ${-w / 2} ${h / 2 - 30} L ${-w / 2 - 8} ${-h / 2 + 40} Q ${-w / 2} ${-h / 2} ${-w / 2 + 30} ${-h / 2} Z`;
  return (
    <g transform={`translate(${x},${y}) rotate(${rot}) scale(${s})`} opacity={o}>
      {glow > 0 && <ellipse cx={0} cy={0} rx={w * 0.95} ry={h * 0.85} fill="url(#glow)" opacity={glow} />}
      <path d={edge} transform="translate(12,16)" fill="rgba(0,0,0,.35)" />
      <path d={edge} fill={C.clay} stroke={C.ink} strokeWidth={8} />
      <path d={edge} fill="url(#clayShade)" opacity={0.6} />
      {hl && <rect x={-w / 2 + 14} y={hl === 'top' ? -h / 2 + 18 : hl === 'bottom' ? dy + 14 : h / 2 - 70} width={w - 28} height={hl === 'top' ? dy - (-h / 2 + 18) : hl === 'bottom' ? h / 2 - 86 - dy : 56} rx={12} fill={C.gold} opacity={0.35} stroke={C.gold} strokeWidth={4} />}
      <path d={`M ${-w / 2 + 24} ${dy - 4} L ${w / 2 - 24} ${dy - 4} M ${-w / 2 + 24} ${dy + 6} L ${w / 2 - 24} ${dy + 6}`} stroke={C.clayD} strokeWidth={4} opacity={reveal > 0.3 ? 1 : 0} />
      {rows}
      {cracks && <path d={`M ${-w / 2 + 4} ${-h * 0.12} l 60 18 l 30 -22 l 50 30 M ${w / 2 - 4} ${h * 0.22} l -70 -10 l -26 28 M ${w * 0.1} ${-h / 2 + 2} l -14 60 l 22 30`} stroke={C.ink} strokeWidth={4} fill="none" strokeLinejoin="round" opacity={0.75} />}
      {split > 0 && <path d={`M ${-w / 2} ${-h * 0.05} L ${w * 0.05} ${h * 0.02} L ${w * 0.12} ${h / 2} M ${w * 0.05} ${h * 0.02} L ${w / 2} ${-h * 0.15}`} stroke={C.ink} strokeWidth={6} fill="none" opacity={split} />}
    </g>
  );
};

/** common <defs> */
export const Defs: React.FC = () => (
  <defs>
    <radialGradient id="glow"><stop offset="0" stopColor="#ffcf6a" stopOpacity="0.9" /><stop offset="0.5" stopColor="#ff8a2a" stopOpacity="0.35" /><stop offset="1" stopColor="#ff8a2a" stopOpacity="0" /></radialGradient>
    <radialGradient id="softglow"><stop offset="0" stopColor="#fff2c4" stopOpacity="0.8" /><stop offset="1" stopColor="#fff2c4" stopOpacity="0" /></radialGradient>
    <linearGradient id="clayShade" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#fff" stopOpacity="0.35" /><stop offset="0.5" stopColor="#fff" stopOpacity="0" /><stop offset="1" stopColor="#3a2410" stopOpacity="0.5" /></linearGradient>
    <linearGradient id="daySky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#7fc3d3" /><stop offset="1" stopColor="#f8e2b4" /></linearGradient>
    <linearGradient id="duskSky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#2b2a5c" /><stop offset="0.55" stopColor="#c0566a" /><stop offset="1" stopColor="#f6a95c" /></linearGradient>
    <linearGradient id="nightSky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#0c1128" /><stop offset="1" stopColor="#2a2f5a" /></linearGradient>
    <linearGradient id="fireSky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#1a0f1e" /><stop offset="0.6" stopColor="#7a1f1a" /><stop offset="1" stopColor="#ff7a1a" /></linearGradient>
    <linearGradient id="seaG" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#3e93a0" /><stop offset="1" stopColor="#1f5560" /></linearGradient>
    <linearGradient id="darkBg" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#1d1410" /><stop offset="1" stopColor="#3a2416" /></linearGradient>
  </defs>
);

/** simple music note */
export const Note: React.FC<{x: number; y: number; s?: number; o?: number; fill?: string; double?: boolean}> = ({x, y, s = 1, o = 1, fill = C.gold, double}) => (
  <g transform={`translate(${x},${y}) scale(${s})`} opacity={o}>
    {double
      ? <g><path d="M -14 0 L -14 -56 L 30 -66 L 30 -10" fill="none" stroke={C.ink} strokeWidth={14} strokeLinejoin="round" /><path d="M -14 0 L -14 -56 L 30 -66 L 30 -10" fill="none" stroke={fill} strokeWidth={6} strokeLinejoin="round" /><ellipse cx={-24} cy={2} rx={14} ry={10} fill={fill} stroke={C.ink} strokeWidth={4} transform="rotate(-20 -24 2)" /><ellipse cx={20} cy={-8} rx={14} ry={10} fill={fill} stroke={C.ink} strokeWidth={4} transform="rotate(-20 20 -8)" /></g>
      : <g><path d="M 0 0 L 0 -56 Q 16 -48 22 -30" fill="none" stroke={C.ink} strokeWidth={14} strokeLinecap="round" /><path d="M 0 0 L 0 -56 Q 16 -48 22 -30" fill="none" stroke={fill} strokeWidth={6} strokeLinecap="round" /><ellipse cx={-10} cy={2} rx={15} ry={11} fill={fill} stroke={C.ink} strokeWidth={4} transform="rotate(-20 -10 2)" /></g>}
  </g>
);

/** comic burst */
export const Burst: React.FC<{x: number; y: number; s?: number; text: string; fill?: string; rot?: number}> = ({x, y, s = 1, text, fill = C.fire2, rot = -6}) => {
  const pts: string[] = [];
  for (let i = 0; i < 24; i++) {
    const a = (i / 24) * Math.PI * 2, r = i % 2 ? 120 : 175 + rnd(i) * 30;
    pts.push(`${Math.cos(a) * r * 1.35},${Math.sin(a) * r}`);
  }
  return (
    <g transform={`translate(${x},${y}) rotate(${rot}) scale(${s})`}>
      <polygon points={pts.join(' ')} fill={fill} stroke={C.ink} strokeWidth={8} strokeLinejoin="round" />
      <text x={0} y={6} fontFamily={FONT.title} fontSize={84} textAnchor="middle" dominantBaseline="middle" fill={C.red} stroke={C.ink} strokeWidth={8} paintOrder="stroke">{text}</text>
    </g>
  );
};

/** red X / green check stamp */
export const Mark: React.FC<{x: number; y: number; s?: number; ok?: boolean}> = ({x, y, s = 1, ok}) => (
  <g transform={`translate(${x},${y}) scale(${s})`}>
    {ok
      ? <path d="M -60 0 L -18 44 L 70 -56" fill="none" stroke={C.ink} strokeWidth={36} strokeLinecap="round" strokeLinejoin="round" />
      : <path d="M -55 -55 L 55 55 M 55 -55 L -55 55" stroke={C.ink} strokeWidth={36} strokeLinecap="round" />}
    {ok
      ? <path d="M -60 0 L -18 44 L 70 -56" fill="none" stroke="#5bbd4a" strokeWidth={20} strokeLinecap="round" strokeLinejoin="round" />
      : <path d="M -55 -55 L 55 55 M 55 -55 L -55 55" stroke={C.red} strokeWidth={20} strokeLinecap="round" />}
  </g>
);

/** fire tongue, animated */
export const Flame: React.FC<{x: number; y: number; s?: number; t: number; ph?: number}> = ({x, y, s = 1, t, ph = 0}) => {
  const a = wob(t, 2.3, 10, ph), b = wob(t, 3.1, 14, ph + 1), c = wob(t, 1.7, 8, ph + 2);
  return (
    <g transform={`translate(${x},${y}) scale(${s})`}>
      <path d={`M -60 0 Q -70 -70 ${-20 + a} -120 Q ${-10 + b} -170 ${10 + c} -210 Q ${20 + a} -150 ${45 + b} -120 Q 70 -60 60 0 Z`} fill={C.fire} stroke={C.ink} strokeWidth={6} strokeLinejoin="round" />
      <path d={`M -32 0 Q -36 -50 ${-6 + b * 0.6} -90 Q ${4 + a * 0.5} -120 ${12 + c} -140 Q ${22 + a * 0.4} -90 ${34 + c * 0.4} -60 Q 40 -30 32 0 Z`} fill={C.fire2} />
    </g>
  );
};

/** box building (mudbrick/stone) */
export const House: React.FC<{x: number; y: number; w: number; h: number; fill?: string; dark?: boolean; door?: boolean; win?: number}> = ({x, y, w, h, fill = C.sand2, dark, door = true, win = 2}) => (
  <g transform={`translate(${x},${y})`}>
    <rect x={-w / 2} y={-h} width={w} height={h} fill={dark ? '#2b1d24' : fill} stroke={C.ink} strokeWidth={6} />
    <rect x={-w / 2 - 6} y={-h - 12} width={w + 12} height={14} fill={dark ? '#20151c' : C.clay} stroke={C.ink} strokeWidth={5} />
    {Array.from({length: win}).map((_, i) => <rect key={i} x={-w / 2 + 16 + i * ((w - 32) / win)} y={-h + 22} width={18} height={24} fill={dark ? '#ffb347' : C.ink} opacity={dark ? 0.9 : 0.8} />)}
    {door && <path d={`M -14 0 L -14 -42 Q 0 -56 14 -42 L 14 0 Z`} fill={dark ? '#120b10' : '#6b4a2b'} stroke={C.ink} strokeWidth={4} />}
  </g>
);

/** sailing ship */
export const Ship: React.FC<{x: number; y: number; s?: number; t: number; sail?: string; flip?: boolean; dark?: boolean}> = ({x, y, s = 1, t, sail = C.cream, flip, dark}) => (
  <g transform={`translate(${x},${y + wob(t, 0.5, 5)}) rotate(${wob(t, 0.4, 2)}) scale(${flip ? -s : s},${s})`}>
    <path d="M -110 0 Q -120 -40 -126 -46 L 126 -46 Q 116 -20 100 0 Z" fill={dark ? '#2a1a16' : '#7a4a2a'} stroke={C.ink} strokeWidth={6} strokeLinejoin="round" />
    <path d="M -126 -46 L -150 -70" stroke={C.ink} strokeWidth={6} /><path d="M 0 -46 L 0 -220" stroke={C.ink} strokeWidth={7} />
    <path d="M -90 -206 Q 0 -190 90 -206 Q 100 -130 90 -64 Q 0 -80 -90 -64 Q -100 -130 -90 -206 Z" fill={dark ? '#5b2b2b' : sail} stroke={C.ink} strokeWidth={6} />
    {!dark && <path d="M -90 -150 Q 0 -136 90 -150 M -92 -110 Q 0 -96 92 -110" stroke={C.terra} strokeWidth={8} fill="none" />}
  </g>
);

export const Waves: React.FC<{y: number; t: number; color?: string; o?: number; speed?: number}> = ({y, t, color = '#cde9ea', o = 0.8, speed = 40}) => {
  const off = (t * speed) % 160;
  let d = '';
  for (let x = -160; x < W + 160; x += 160) d += `M ${x + off} ${y} q 40 -16 80 0 `;
  return <path d={d} stroke={color} strokeWidth={6} fill="none" strokeLinecap="round" opacity={o} />;
};

export const Seq: React.FC<{from: number; children: React.ReactNode}> = ({children}) => <>{children}</>;
