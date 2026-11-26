import React from 'react';
import {C, FONT, W, H, wob, rnd, clamp} from './lib';

/** Ancient Egyptian trumpet, mouthpiece left, bell right. Length ~640 at s=1. blow 0..1 sends sound rays out of the bell. */
export const Trumpet: React.FC<{x: number; y: number; s?: number; rot?: number; metal?: 'silver' | 'bronze'; blow?: number; glow?: number; crack?: number; core?: number; o?: number; t?: number}> = ({x, y, s = 1, rot = 0, metal = 'silver', blow = 0, glow = 0, crack = 0, core = -1, o = 1, t = 0}) => {
  const body = metal === 'silver' ? '#dfe3e6' : '#c98b4a';
  const shade = metal === 'silver' ? '#9fa8ae' : '#8a5426';
  const hi = metal === 'silver' ? '#ffffff' : '#f1c08a';
  const gold = C.gold;
  const tube = 'M -310 -13 L 140 -17 Q 240 -30 320 -105 L 320 105 Q 240 30 140 17 L -310 13 Z';
  return (
    <g transform={`translate(${x},${y}) rotate(${rot}) scale(${s})`} opacity={o}>
      {glow > 0 && <ellipse cx={40} cy={0} rx={520} ry={260} fill="url(#glow)" opacity={glow} />}
      {core >= 0 && (
        <g transform={`translate(${core * -520},${core * 150})`}>
          <path d="M -300 -9 L 140 -12 Q 230 -22 300 -80 L 300 80 Q 230 22 140 12 L -300 9 Z" fill="#a8743e" stroke={C.ink} strokeWidth={6} />
          {[0, 1, 2, 3, 4].map((i) => <path key={i} d={`M ${-260 + i * 90} -6 l 50 0 M ${-240 + i * 90} 5 l 40 0`} stroke="#7a4f25" strokeWidth={3} />)}
          <path d="M 300 -80 Q 330 0 300 80" fill="#c99a63" stroke={C.ink} strokeWidth={6} />
        </g>
      )}
      <path d={tube} transform="translate(10,14)" fill="rgba(0,0,0,.3)" />
      <path d={tube} fill={body} stroke={C.ink} strokeWidth={8} strokeLinejoin="round" />
      <path d="M -300 -6 L 140 -9 Q 230 -20 300 -88" stroke={hi} strokeWidth={6} fill="none" opacity={0.8} />
      <path d="M -300 8 L 140 11 Q 230 24 300 90" stroke={shade} strokeWidth={8} fill="none" opacity={0.7} />
      {/* bell rim */}
      <ellipse cx={320} cy={0} rx={22} ry={108} fill={shade} stroke={C.ink} strokeWidth={8} />
      <ellipse cx={322} cy={0} rx={12} ry={88} fill="#3a2a20" opacity={0.6} />
      {/* rings and mouthpiece */}
      <rect x={-330} y={-24} width={34} height={48} rx={8} fill={gold} stroke={C.ink} strokeWidth={6} />
      <rect x={110} y={-24} width={30} height={48} rx={6} fill={gold} stroke={C.ink} strokeWidth={6} />
      {/* engraved panel with cartouche */}
      <g transform="translate(232,0)">
        <path d="M -40 -34 Q 0 -52 46 -66 L 46 66 Q 0 52 -40 34 Z" fill={gold} opacity={0.55} stroke={C.ink} strokeWidth={4} />
        <rect x={-6} y={-30} width={30} height={60} rx={14} fill="none" stroke={C.ink} strokeWidth={4} />
        <circle cx={9} cy={-16} r={5} fill={C.ink} /><path d="M 2 0 l 14 0 M 2 12 l 14 0" stroke={C.ink} strokeWidth={4} />
      </g>
      {crack > 0 && <path d="M 40 -16 l 14 10 l -10 8 l 16 12 M 60 -16 l -6 14" stroke={C.ink} strokeWidth={5} fill="none" opacity={crack} />}
      {blow > 0 && [0, 1, 2, 3].map((i) => {
        const l = ((t * 1.4 + i / 4) % 1);
        return <path key={i} d={`M ${360 + l * 260} ${-90 - l * 90} Q ${400 + l * 300} 0 ${360 + l * 260} ${90 + l * 90}`} stroke={C.fire2} strokeWidth={14 - l * 8} fill="none" strokeLinecap="round" opacity={blow * Math.sin(l * Math.PI)} />;
      })}
    </g>
  );
};

/** 1930s cathedral radio. on 0..1 lights the dial, waves 0..1 animated rings */
export const Radio: React.FC<{x: number; y: number; s?: number; on?: number; t?: number; waves?: number}> = ({x, y, s = 1, on = 0, t = 0, waves = 0}) => (
  <g transform={`translate(${x},${y}) scale(${s})`}>
    {waves > 0 && [0, 1, 2].map((i) => { const l = (t * 0.7 + i / 3) % 1; return <path key={i} d={`M ${-120 - l * 140} ${-260 - l * 80} Q 0 ${-360 - l * 160} ${120 + l * 140} ${-260 - l * 80}`} stroke={C.fire2} strokeWidth={10} fill="none" opacity={waves * (1 - l)} strokeLinecap="round" />; })}
    <path d="M -130 0 L -130 -170 Q -130 -300 0 -300 Q 130 -300 130 -170 L 130 0 Z" fill="#7a4a24" stroke={C.ink} strokeWidth={8} />
    <path d="M -96 -60 L -96 -170 Q -96 -262 0 -262 Q 96 -262 96 -170 L 96 -60 Z" fill="#d9b884" stroke={C.ink} strokeWidth={6} />
    {[-60, -30, 0, 30, 60].map((dx) => <path key={dx} d={`M ${dx} -240 L ${dx} -66`} stroke="#7a4a24" strokeWidth={8} />)}
    <rect x={-60} y={-46} width={120} height={30} rx={8} fill={on ? '#ffd27a' : '#5a3a1c'} stroke={C.ink} strokeWidth={5} opacity={0.6 + 0.4 * on} />
    <circle cx={-92} cy={-28} r={12} fill={C.gold} stroke={C.ink} strokeWidth={4} /><circle cx={92} cy={-28} r={12} fill={C.gold} stroke={C.ink} strokeWidth={4} />
  </g>
);

/** old broadcast microphone on a stand */
export const Mic: React.FC<{x: number; y: number; s?: number; label?: string}> = ({x, y, s = 1, label = 'BBC'}) => (
  <g transform={`translate(${x},${y}) scale(${s})`}>
    <ellipse cx={0} cy={0} rx={80} ry={16} fill="#3a3a3a" stroke={C.ink} strokeWidth={6} />
    <path d="M 0 0 L 0 -300" stroke="#555" strokeWidth={14} /><path d="M 0 0 L 0 -300" stroke={C.ink} strokeWidth={4} opacity={0.4} />
    <rect x={-70} y={-470} width={140} height={170} rx={60} fill="#cfd3d6" stroke={C.ink} strokeWidth={8} />
    {[0, 1, 2, 3, 4, 5].map((i) => <path key={i} d={`M -50 ${-450 + i * 26} L 50 ${-450 + i * 26}`} stroke="#7e868c" strokeWidth={6} />)}
    <rect x={-56} y={-300} width={112} height={44} rx={8} fill={C.ink} />
    <text x={0} y={-276} fontFamily={FONT.title} fontSize={30} fill="#fff" textAnchor="middle" dominantBaseline="middle">{label}</text>
  </g>
);

/** desert with pyramids or cliffs */
export const Desert: React.FC<{sky?: string; pyr?: boolean; cliffs?: boolean; sun?: number}> = ({sky = 'url(#duskSky)', pyr = true, cliffs = false, sun = 1}) => (
  <g>
    <rect width={W} height={H} fill={sky} />
    <circle cx={1480} cy={420} r={130} fill="#ffd27a" opacity={0.9 * sun} />
    {cliffs && <path d="M 0 700 L 120 520 L 260 560 L 380 430 L 560 470 L 700 380 L 900 450 L 1100 400 L 1300 470 L 1500 420 L 1700 500 L 1920 460 L 1920 800 L 0 800 Z" fill="#b5763e" stroke={C.ink} strokeWidth={7} strokeLinejoin="round" />}
    {pyr && <g>
      <path d="M 980 760 L 1250 420 L 1520 760 Z" fill="#d9a35a" stroke={C.ink} strokeWidth={7} strokeLinejoin="round" /><path d="M 1250 420 L 1320 760 L 1520 760 Z" fill="#b07a3a" />
      <path d="M 1450 760 L 1630 540 L 1810 760 Z" fill="#d9a35a" stroke={C.ink} strokeWidth={7} strokeLinejoin="round" /><path d="M 1630 540 L 1680 760 L 1810 760 Z" fill="#b07a3a" />
    </g>}
    <path d="M 0 740 Q 300 680 640 740 T 1300 730 T 1920 720 L 1920 1080 L 0 1080 Z" fill={C.sand2} stroke={C.ink} strokeWidth={7} />
    <path d="M 0 860 Q 400 800 900 870 T 1920 850 L 1920 1080 L 0 1080 Z" fill={C.sand} />
  </g>
);

export const Candle: React.FC<{x: number; y: number; s?: number; t: number; o?: number}> = ({x, y, s = 1, t, o = 1}) => (
  <g transform={`translate(${x},${y}) scale(${s})`} opacity={o}>
    <ellipse cx={0} cy={-150} rx={260} ry={260} fill="url(#glow)" opacity={0.7 + 0.1 * Math.sin(t * 9)} />
    <rect x={-26} y={-110} width={52} height={110} rx={6} fill={C.cream} stroke={C.ink} strokeWidth={6} />
    <path d={`M 0 -112 Q ${-18 + wob(t, 3, 3)} -140 ${wob(t, 2.3, 4)} -175 Q ${18 + wob(t, 2.7, 3)} -140 0 -112 Z`} fill={C.fire2} stroke={C.fire} strokeWidth={4} />
    <ellipse cx={0} cy={2} rx={60} ry={12} fill={C.gold} stroke={C.ink} strokeWidth={5} />
  </g>
);

/** paper card with a big date */
export const DateCard: React.FC<{x: number; y: number; top: string; big: string; s?: number; rot?: number; fill?: string}> = ({x, y, top, big, s = 1, rot = -4, fill = C.paper}) => (
  <g transform={`translate(${x},${y}) rotate(${rot}) scale(${s})`}>
    <rect x={-260} y={-130} width={520} height={260} rx={18} fill="rgba(0,0,0,.3)" transform="translate(10,12)" />
    <rect x={-260} y={-130} width={520} height={260} rx={18} fill={fill} stroke={C.ink} strokeWidth={8} />
    <rect x={-260} y={-130} width={520} height={70} rx={18} fill={C.red} stroke={C.ink} strokeWidth={8} />
    <text x={0} y={-94} fontFamily={FONT.title} fontSize={Math.min(40, 680 / top.length)} fill="#fff" textAnchor="middle" dominantBaseline="middle">{top}</text>
    <text x={0} y={34} fontFamily={FONT.title} fontSize={Math.min(110, 680 / big.length)} fill={C.ink} textAnchor="middle" dominantBaseline="middle">{big}</text>
  </g>
);

export const Envelope: React.FC<{x: number; y: number; s?: number; rot?: number}> = ({x, y, s = 1, rot = 0}) => (
  <g transform={`translate(${x},${y}) rotate(${rot}) scale(${s})`}>
    <rect x={-80} y={-52} width={160} height={104} rx={6} fill={C.cream} stroke={C.ink} strokeWidth={6} />
    <path d="M -80 -52 L 0 10 L 80 -52" fill="none" stroke={C.ink} strokeWidth={6} strokeLinejoin="round" />
    <rect x={40} y={-40} width={26} height={30} fill={C.red} stroke={C.ink} strokeWidth={3} />
  </g>
);

/** Egyptian Museum style facade */
export const Museum: React.FC<{x: number; y: number; s?: number; night?: boolean}> = ({x, y, s = 1, night}) => {
  const wall = night ? '#6a4a5a' : '#e7a98a', dark = night ? '#3a2834' : '#b9735a';
  return (
    <g transform={`translate(${x},${y}) scale(${s})`}>
      <rect x={-520} y={-300} width={1040} height={300} fill={wall} stroke={C.ink} strokeWidth={8} />
      <rect x={-180} y={-420} width={360} height={420} fill={wall} stroke={C.ink} strokeWidth={8} />
      <path d="M -110 0 L -110 -250 Q 0 -360 110 -250 L 110 0 Z" fill={dark} stroke={C.ink} strokeWidth={7} />
      {[-440, -360, -280, 280, 360, 440].map((cx) => <rect key={cx} x={cx - 22} y={-240} width={44} height={90} rx={20} fill={night ? '#ffb347' : dark} stroke={C.ink} strokeWidth={5} opacity={night ? 0.8 : 1} />)}
      <rect x={-540} y={-318} width={1080} height={26} fill={dark} stroke={C.ink} strokeWidth={6} />
      <rect x={-196} y={-438} width={392} height={26} fill={dark} stroke={C.ink} strokeWidth={6} />
      <text x={0} y={-392} fontFamily={FONT.title} fontSize={30} textAnchor="middle" fill={C.ink}>EGYPTIAN MUSEUM</text>
    </g>
  );
};

/** Globe with continents blobs. waves 0..1 = broadcast rings */
export const Globe: React.FC<{x: number; y: number; r?: number; t: number; waves?: number; spin?: number}> = ({x, y, r = 260, t, waves = 0, spin = 0}) => {
  const off = (t * 40 * spin) % (r * 2);
  return (
    <g transform={`translate(${x},${y})`}>
      {waves > 0 && [0, 1, 2, 3].map((i) => { const l = (t * 0.45 + i / 4) % 1; return <circle key={i} r={r + l * 420} fill="none" stroke={C.fire2} strokeWidth={10 - l * 7} opacity={waves * (1 - l) * 0.8} />; })}
      <clipPath id={`gc${r}`}><circle r={r} /></clipPath>
      <circle r={r} fill={C.sea} stroke={C.ink} strokeWidth={9} />
      <g clipPath={`url(#gc${r})`}>
        {[-1, 0, 1].map((k) => (
          <g key={k} transform={`translate(${k * r * 2 - off},0)`}>
            <path d={`M ${-r * 0.7} ${-r * 0.5} q ${r * 0.3} ${-r * 0.3} ${r * 0.6} ${-r * 0.1} q ${r * 0.1} ${r * 0.4} ${-r * 0.2} ${r * 0.6} q ${-r * 0.3} ${r * 0.1} ${-r * 0.4} ${-r * 0.5} Z`} fill={C.green} stroke={C.ink} strokeWidth={5} />
            <path d={`M ${r * 0.05} ${-r * 0.55} q ${r * 0.4} ${-r * 0.1} ${r * 0.6} ${r * 0.2} q ${-r * 0.05} ${r * 0.9} ${-r * 0.35} ${r * 0.95} q ${-r * 0.3} ${-r * 0.4} ${-r * 0.25} ${-r * 1.15} Z`} fill={C.green} stroke={C.ink} strokeWidth={5} />
          </g>
        ))}
      </g>
      <ellipse cx={-r * 0.35} cy={-r * 0.4} rx={r * 0.25} ry={r * 0.12} fill="#fff" opacity={0.25} transform={`rotate(-30 ${-r * 0.35} ${-r * 0.4})`} />
    </g>
  );
};

/** speech bubble */
export const Bubble: React.FC<{x: number; y: number; w: number; text: string; s?: number; size?: number; tail?: 'l' | 'r'; fill?: string}> = ({x, y, w, text, s = 1, size = 50, tail = 'l', fill = C.cream}) => (
  <g transform={`translate(${x},${y}) scale(${s})`}>
    <rect x={-w / 2} y={-size * 0.95} width={w} height={size * 1.9} rx={size * 0.9} fill={fill} stroke={C.ink} strokeWidth={7} />
    <path d={tail === 'l' ? `M ${-w / 2 + 70} ${size * 0.8} L ${-w / 2 + 30} ${size * 1.9} L ${-w / 2 + 130} ${size * 0.85}` : `M ${w / 2 - 70} ${size * 0.8} L ${w / 2 - 30} ${size * 1.9} L ${w / 2 - 130} ${size * 0.85}`} fill={fill} stroke={C.ink} strokeWidth={7} strokeLinejoin="round" />
    <rect x={-w / 2 + 60} y={size * 0.7} width={100} height={20} fill={fill} transform={tail === 'r' ? `translate(${w - 220},0)` : ''} />
    <text x={0} y={4} fontFamily={FONT.title} fontSize={size} textAnchor="middle" dominantBaseline="middle" fill={C.ink}>{text}</text>
  </g>
);

/** marching soldier silhouettes (no weapons fired, just a column) */
export const Column: React.FC<{y: number; t: number; n?: number; o?: number; color?: string}> = ({y, t, n = 12, o = 1, color = '#1a0c0c'}) => (
  <g opacity={o}>
    {Array.from({length: n}).map((_, i) => {
      const x = ((i * 170 + t * 90) % (W + 340)) - 170;
      const sw = Math.sin(t * Math.PI * 2 * 1.4 + i) * 18;
      return (
        <g key={i} transform={`translate(${x},${y})`}>
          <path d={`M 0 -110 L ${-16 + sw} 0 M 0 -110 L ${16 - sw} 0 M 0 -190 L 0 -110 M 0 -175 L ${-30 - sw * 0.5} -120 M 0 -175 L ${30 + sw * 0.5} -120 M 22 -200 L 22 -150`} stroke={color} strokeWidth={14} strokeLinecap="round" />
          <circle cx={0} cy={-222} r={30} fill={color} />
          <path d="M -40 -232 Q 0 -280 40 -232 Z" fill={color} />
        </g>
      );
    })}
  </g>
);

export const Plane: React.FC<{x: number; y: number; s?: number; color?: string}> = ({x, y, s = 1, color = '#1a0c0c'}) => (
  <g transform={`translate(${x},${y}) scale(${s})`}>
    <path d="M -90 0 L 80 -8 Q 100 0 80 8 L -90 4 Z M -10 -4 L -40 -70 L -16 -70 L 30 -4 Z M -10 4 L -40 70 L -16 70 L 30 4 Z M -80 0 L -100 -30 L -86 -30 L -66 0 Z" fill={color} />
  </g>
);

/** Tutankhamun-style gold mask (generic, simple shapes) */
export const Mask: React.FC<{x: number; y: number; s?: number}> = ({x, y, s = 1}) => (
  <g transform={`translate(${x},${y}) scale(${s})`}>
    <path d="M -150 120 L -170 -60 Q -150 -200 0 -210 Q 150 -200 170 -60 L 150 120 Q 120 180 0 190 Q -120 180 -150 120 Z" fill={C.gold} stroke={C.ink} strokeWidth={8} />
    {[-1, 1].map((d) => [0, 1, 2, 3].map((i) => <path key={d + '' + i} d={`M ${d * (100 + i * 14)} ${-150 + i * 60} L ${d * (130 + i * 12)} ${-120 + i * 60}`} stroke={C.blue} strokeWidth={22} />))}
    <path d="M -90 -150 Q 0 -190 90 -150 L 90 120 Q 0 150 -90 120 Z" fill="#f5c04a" stroke={C.ink} strokeWidth={6} />
    <path d="M -64 -60 q 24 -14 48 0 M 16 -60 q 24 -14 48 0" stroke={C.ink} strokeWidth={10} fill="none" strokeLinecap="round" />
    <ellipse cx={-40} cy={-36} rx={20} ry={10} fill="#fff" stroke={C.ink} strokeWidth={5} /><circle cx={-40} cy={-36} r={7} fill={C.ink} />
    <ellipse cx={40} cy={-36} rx={20} ry={10} fill="#fff" stroke={C.ink} strokeWidth={5} /><circle cx={40} cy={-36} r={7} fill={C.ink} />
    <path d="M 0 -20 L -12 30 L 12 30 Z" fill="#e0a83a" stroke={C.ink} strokeWidth={4} />
    <path d="M -26 66 Q 0 78 26 66" stroke={C.ink} strokeWidth={7} fill="none" strokeLinecap="round" />
    <path d="M -14 120 L -10 210 L 10 210 L 14 120 Z" fill={C.blue} stroke={C.ink} strokeWidth={5} />
    <path d="M -24 -170 q 24 -40 48 0" fill={C.gold} stroke={C.ink} strokeWidth={6} />
  </g>
);

export const Chest: React.FC<{x: number; y: number; s?: number}> = ({x, y, s = 1}) => (
  <g transform={`translate(${x},${y}) scale(${s})`}>
    <rect x={-110} y={-120} width={220} height={120} fill="#c9922f" stroke={C.ink} strokeWidth={7} />
    <path d="M -120 -120 Q 0 -190 120 -120 Z" fill={C.gold} stroke={C.ink} strokeWidth={7} />
    <rect x={-80} y={-96} width={160} height={70} fill={C.blue} stroke={C.ink} strokeWidth={5} opacity={0.8} />
    <circle cx={0} cy={-60} r={14} fill={C.gold} stroke={C.ink} strokeWidth={4} />
  </g>
);

export const Wheel: React.FC<{x: number; y: number; s?: number}> = ({x, y, s = 1}) => (
  <g transform={`translate(${x},${y}) scale(${s})`}>
    <circle r={110} fill="none" stroke={C.ink} strokeWidth={26} /><circle r={110} fill="none" stroke={C.gold} strokeWidth={14} />
    {[0, 1, 2, 3, 4, 5].map((i) => <path key={i} d={`M 0 0 L ${Math.cos(i * Math.PI / 3) * 104} ${Math.sin(i * Math.PI / 3) * 104}`} stroke={C.ink} strokeWidth={10} />)}
    <circle r={22} fill={C.gold} stroke={C.ink} strokeWidth={6} />
  </g>
);

/** stone wall painting frieze: soldiers in profile, one with a trumpet */
export const Frieze: React.FC<{x: number; y: number; t: number; o?: number}> = ({x, y, t, o = 1}) => (
  <g transform={`translate(${x},${y})`} opacity={o}>
    <rect x={-760} y={-260} width={1520} height={460} fill="#e9cf9c" stroke={C.ink} strokeWidth={9} />
    <rect x={-760} y={-260} width={1520} height={40} fill={C.blue} stroke={C.ink} strokeWidth={6} />
    <rect x={-760} y={160} width={1520} height={40} fill={C.terra} stroke={C.ink} strokeWidth={6} />
    {[0, 1, 2, 3, 4, 5].map((i) => {
      const cx = -600 + i * 230, tr = i === 0;
      return (
        <g key={i} transform={`translate(${cx},150)`}>
          <path d="M 0 -150 L -24 0 M 0 -150 L 30 0" stroke="#8a4a2a" strokeWidth={16} strokeLinecap="round" />
          <path d="M -26 -260 L 26 -260 L 18 -150 L -18 -150 Z" fill="#f4f0e4" stroke={C.ink} strokeWidth={5} />
          <circle cx={0} cy={-296} r={30} fill="#8a4a2a" stroke={C.ink} strokeWidth={5} />
          <path d="M -30 -300 Q -10 -340 30 -310 L 30 -280 Z" fill={C.ink} />
          {tr ? <g><path d="M 20 -300 L 120 -330" stroke={C.gold} strokeWidth={12} strokeLinecap="round" /><path d="M 110 -350 L 150 -340 L 120 -310 Z" fill={C.gold} stroke={C.ink} strokeWidth={4} /><path d="M 10 -240 L 60 -300" stroke="#8a4a2a" strokeWidth={14} strokeLinecap="round" /></g>
            : <g><path d="M 10 -240 L 60 -200" stroke="#8a4a2a" strokeWidth={14} strokeLinecap="round" /><path d="M 56 -320 L 56 -100" stroke={C.ink} strokeWidth={8} /><ellipse cx={-40} cy={-210} rx={30} ry={50} fill={C.terra} stroke={C.ink} strokeWidth={5} /></g>}
        </g>
      );
    })}
    {[0, 1, 2].map((i) => { const l = (t * 1.2 + i / 3) % 1; return <path key={i} d={`M ${-430 + l * 120} ${-210 - l * 30} q 20 30 0 60`} stroke={C.red} strokeWidth={8} fill="none" opacity={Math.sin(l * Math.PI)} />; })}
  </g>
);

export const Car: React.FC<{x: number; y: number; s?: number; shake?: number}> = ({x, y, s = 1, shake = 0}) => (
  <g transform={`translate(${x + shake},${y}) scale(${s})`}>
    <path d="M -190 -40 L -170 -110 Q -150 -150 -60 -150 L 40 -150 Q 90 -150 120 -100 L 190 -90 Q 220 -80 220 -40 L 220 -10 L -200 -10 Z" fill="#2e4a6a" stroke={C.ink} strokeWidth={7} strokeLinejoin="round" />
    <path d="M -140 -100 L -126 -136 L -40 -136 L -40 -100 Z M -20 -100 L -20 -136 L 50 -136 Q 80 -130 96 -100 Z" fill="#cde9ea" stroke={C.ink} strokeWidth={5} />
    <circle cx={-120} cy={-10} r={44} fill={C.ink} /><circle cx={-120} cy={-10} r={18} fill="#999" />
    <circle cx={140} cy={-10} r={44} fill={C.ink} /><circle cx={140} cy={-10} r={18} fill="#999" />
    <circle cx={214} cy={-64} r={12} fill="#ffe08a" stroke={C.ink} strokeWidth={4} />
  </g>
);

export const Horse: React.FC<{x: number; y: number; s?: number; t: number}> = ({x, y, s = 1, t}) => {
  const g = Math.sin(t * 14) * 22;
  return (
    <g transform={`translate(${x},${y}) scale(${s})`}>
      <path d={`M -100 -150 L ${-110 + g} 0 M -70 -150 L ${-60 - g} 0 M 70 -150 L ${80 + g} 0 M 100 -150 L ${90 - g} 0`} stroke="#5a3a24" strokeWidth={18} strokeLinecap="round" />
      <ellipse cx={0} cy={-180} rx={130} ry={60} fill="#7a4e2e" stroke={C.ink} strokeWidth={7} />
      <path d="M 100 -210 L 170 -300 L 230 -280 L 200 -250 L 150 -180 Z" fill="#7a4e2e" stroke={C.ink} strokeWidth={7} strokeLinejoin="round" />
      <path d="M 150 -300 L 110 -230 L 130 -230" stroke={C.ink} strokeWidth={10} fill="none" />
      <circle cx={200} cy={-280} r={6} fill={C.ink} />
      <path d="M -130 -200 Q -190 -190 -200 -120" stroke={C.ink} strokeWidth={12} fill="none" strokeLinecap="round" />
      {/* carriage behind */}
      <path d="M -150 -170 L -330 -170" stroke={C.ink} strokeWidth={8} />
      <rect x={-560} y={-320} width={240} height={200} rx={20} fill="#3a2418" stroke={C.ink} strokeWidth={7} />
      <circle cx={-470} cy={-100} r={60} fill="none" stroke={C.ink} strokeWidth={12} /><circle cx={-380} cy={-100} r={44} fill="none" stroke={C.ink} strokeWidth={10} />
    </g>
  );
};

export const Bag: React.FC<{x: number; y: number; s?: number}> = ({x, y, s = 1}) => (
  <g transform={`translate(${x},${y}) scale(${s})`}>
    <path d="M -130 0 Q -170 -120 -90 -190 L 90 -190 Q 170 -120 130 0 Z" fill="#7a8a5a" stroke={C.ink} strokeWidth={8} strokeLinejoin="round" />
    <path d="M -60 -190 Q 0 -280 60 -190" fill="none" stroke={C.ink} strokeWidth={12} />
    <path d="M -100 -100 L 100 -110" stroke="#5a6a3a" strokeWidth={6} />
  </g>
);

export const Train: React.FC<{x: number; y: number; s?: number}> = ({x, y, s = 1}) => (
  <g transform={`translate(${x},${y}) scale(${s})`}>
    <rect x={-700} y={-300} width={1400} height={280} rx={40} fill="#d8dde0" stroke={C.ink} strokeWidth={8} />
    <rect x={-700} y={-120} width={1400} height={40} fill={C.red} />
    {[-560, -340, -120, 100, 320, 540].map((wx) => <rect key={wx} x={wx} y={-260} width={150} height={110} rx={14} fill="#34495e" stroke={C.ink} strokeWidth={6} />)}
    <text x={0} y={-50} fontFamily={FONT.title} fontSize={40} textAnchor="middle" fill={C.ink}>METRO</text>
  </g>
);

/** grid of 100 squares, red = a year with a war somewhere */
export const YearGrid: React.FC<{x: number; y: number; reveal: number}> = ({x, y, reveal}) => (
  <g transform={`translate(${x},${y})`}>
    {Array.from({length: 100}).map((_, i) => {
      const on = clamp(reveal * 100 - i) > 0;
      const war = rnd(i * 3 + 1) > 0.08;
      return <rect key={i} x={(i % 10) * 64} y={Math.floor(i / 10) * 64} width={54} height={54} rx={8} fill={on ? (war ? C.red : C.cream) : 'rgba(255,255,255,.08)'} stroke={C.ink} strokeWidth={4} />;
    })}
  </g>
);
