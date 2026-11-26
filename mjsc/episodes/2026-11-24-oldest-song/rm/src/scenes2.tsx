import React from 'react';
import {useCurrentFrame} from 'remotion';
import {C, FONT, W, H, Stage, Defs, MJ, Stick, Tablet, Title, Tag, Note, Mark, Flame, House, Waves, cue, useT, usePop, prog, clamp, wob, talkAt, rnd, sceneById, SCENES} from './lib';
import musicCue from './music_cue.json';

const fr = (id: string) => sceneById(id).frames;

/* ---------------- the nine-string lyre ---------------- */
/** vib(i) -> 0..1 vibration of string i (1..9) ; lit(i) -> 0..1 glow */
export const Lyre: React.FC<{x: number; y: number; s?: number; t: number; vib?: (i: number) => number}> = ({x, y, s = 1, t, vib = (_i: number) => 0}) => {
  const strings = Array.from({length: 9}).map((_, j) => {
    const i = j + 1, v = clamp(vib(i));
    const bx = -150 + j * 37.5, tx = -130 + j * 33;
    const by = -40, ty = -470 + j * 6;
    const mx = (bx + tx) / 2 + Math.sin(t * 90 + j) * 12 * v, my = (by + ty) / 2;
    return (
      <g key={j}>
        {v > 0.05 && <path d={`M ${bx} ${by} Q ${mx} ${my} ${tx} ${ty}`} stroke={C.fire2} strokeWidth={14} opacity={v * 0.6} fill="none" />}
        <path d={`M ${bx} ${by} Q ${mx} ${my} ${tx} ${ty}`} stroke={v > 0.05 ? '#fff3c4' : '#e9dcc0'} strokeWidth={4} fill="none" />
      </g>
    );
  });
  return (
    <g transform={`translate(${x},${y}) scale(${s})`}>
      {/* arms */}
      <path d="M -190 -40 Q -270 -300 -200 -500 L -160 -500 Q -220 -300 -150 -40 Z" fill="#8a5a2e" stroke={C.ink} strokeWidth={8} strokeLinejoin="round" />
      <path d="M 190 -40 Q 250 -280 170 -470 L 210 -470 Q 290 -280 230 -40 Z" fill="#8a5a2e" stroke={C.ink} strokeWidth={8} strokeLinejoin="round" />
      {/* yoke */}
      <path d="M -250 -500 L 250 -450 L 246 -420 L -254 -470 Z" fill="#a8723d" stroke={C.ink} strokeWidth={8} strokeLinejoin="round" />
      {Array.from({length: 9}).map((_, j) => <circle key={j} cx={-130 + j * 33} cy={-470 + j * 6 + 4} r={8} fill={C.gold} stroke={C.ink} strokeWidth={3} />)}
      {/* sound box */}
      <path d="M -250 -60 L 250 -60 L 220 70 L -220 70 Z" fill="#b07a42" stroke={C.ink} strokeWidth={8} strokeLinejoin="round" />
      <path d="M -230 -30 L 230 -30" stroke="#7a4f27" strokeWidth={5} />
      <circle cx={0} cy={20} r={26} fill="#3a2414" stroke={C.ink} strokeWidth={5} />
      <rect x={-170} y={-52} width={340} height={14} rx={5} fill="#e8c88a" stroke={C.ink} strokeWidth={4} />
      {strings}
    </g>
  );
};

/* ===================== 6. THE DIG (1950s) ===================== */
export const Dig: React.FC = () => {
  const t = useT(); const pop = usePop(); const id = 'dig';
  const k = (n: string) => cue(id, n);
  const shards = Array.from({length: 36});
  const join = clamp((t - k('three')) / 1.6);
  const others = 1 - prog(t, k('except'), 0.6);
  return (
    <Stage frames={fr(id)} zoom={[1, 1.05]}>
      <Defs />
      <rect width={W} height={H} fill="url(#daySky)" />
      <path d={`M 0 560 L ${W} 520 L ${W} ${H} L 0 ${H} Z`} fill="#d7b478" stroke={C.ink} strokeWidth={7} />
      {/* ruined walls + grid strings */}
      {[[220, 700, 260, 90], [600, 650, 200, 150], [1040, 690, 300, 70], [1460, 640, 220, 170], [1720, 760, 180, 90]].map(([x, y, w, h], i) => (
        <g key={i}><rect x={x - w / 2} y={y - h} width={w} height={h} fill={C.stone} stroke={C.ink} strokeWidth={6} />
          {Array.from({length: Math.floor(w / 50)}).map((_, j) => <path key={j} d={`M ${x - w / 2 + j * 50} ${y - h + (j % 2) * 30} l 50 0`} stroke={C.stoneD} strokeWidth={4} />)}</g>
      ))}
      {[0, 1, 2, 3].map((i) => <path key={i} d={`M ${100 + i * 450} 760 L ${200 + i * 450} 1080`} stroke="#fff" strokeWidth={3} opacity={0.7} />)}
      <path d="M 0 860 L 1920 840" stroke="#fff" strokeWidth={3} opacity={0.7} />
      {/* archaeologists brushing */}
      <Stick x={420} y={960} s={0.85} t={t} hat="pith" arms={[[60, 50], [95 + wob(t, 2, 18), 20]]} />
      <Stick x={1250} y={940} s={0.8} t={t} hat="pith" flip arms={[[70, 40], [100 + wob(t, 1.7, 20, 1), 30]]} />
      <Stick x={1620} y={1010} s={0.9} t={t} hat="pith" arms={[[150, 20], [30, 20]]} />
      {/* shards flying up */}
      {t > k('pieces') - 0.2 && shards.map((_, i) => {
        const a = clamp((t - k('pieces') - i * 0.06) / 0.9);
        const gx = 260 + (i % 12) * 115, gy = 170 + Math.floor(i / 12) * 120;
        const sx = 300 + rnd(i) * 1300, sy = 960;
        const isOne = i === 17;
        const xx = sx + (gx - sx) * a, yy = sy + (gy - sy) * a - Math.sin(a * Math.PI) * 120;
        const dim = t > k('broken') ? 0.45 : 1;
        if (isOne && join > 0) return null;
        return (
          <g key={i} transform={`translate(${xx},${yy}) rotate(${rnd(i) * 60 - 30}) scale(${0.9 + (isOne ? 0.25 * prog(t, k('except'), 0.4) : 0)})`} opacity={a > 0 ? (isOne ? 1 : others) : 0}>
            <path d={`M -34 -26 L ${10 + rnd(i) * 20} -34 L 40 ${-4 + rnd(i + 1) * 20} L 14 34 L -38 ${18 - rnd(i + 2) * 20} Z`} fill={isOne && t > k('except') ? C.gold : C.clay} stroke={C.ink} strokeWidth={5} opacity={isOne ? 1 : dim} />
            {t > k('broken') && !isOne && <path d="M -20 -20 L 20 20 M 20 -20 L -20 20" stroke={C.red} strokeWidth={6} opacity={0.8} />}
          </g>
        );
      })}
      <g opacity={others}><Title x={960} y={560} size={110} fill={C.fire2} s={pop(k('hymns'))}>~36 HYMNS</Title></g>
      <g opacity={prog(t, k('broken'), 0.4) * others}><Tag x={960} y={680} text="almost all broken beyond repair" s={pop(k('broken'))} /></g>
      {/* three fragments join */}
      {join > 0 && (
        <g>
          <rect width={W} height={H} fill="rgba(30,18,10,.55)" opacity={join} />
          <g transform="translate(960,560)">
            {[[-1, -1], [1, -0.6], [0, 1]].map(([dx, dy], i) => (
              <g key={i} transform={`translate(${dx * (1 - join) * 420},${dy * (1 - join) * 260})`}>
                <clipPath id={`frag${i}`}><path d={i === 0 ? 'M -300 -400 L 40 -400 L 20 -60 L -300 20 Z' : i === 1 ? 'M 40 -400 L 300 -400 L 300 -20 L 20 -60 Z' : 'M -300 20 L 20 -60 L 300 -20 L 300 400 L -300 400 Z'} /></clipPath>
                <g clipPath={`url(#frag${i})`}><Tablet x={0} y={0} w={420} h={560} glow={0} seed={6} cracks={false} /></g>
              </g>
            ))}
            {join >= 1 && <ellipse cx={0} cy={0} rx={480} ry={420} fill="url(#softglow)" opacity={0.4 + 0.15 * Math.sin(t * 3)} />}
          </g>
          <Title x={960} y={110} size={84} s={pop(k('three'))}>3 FRAGMENTS → 1 TABLET</Title>
          <Title x={1550} y={430} size={150} fill={C.fire2} s={pop(k('name') + 0.8)}>H.6</Title>
          <Title x={1550} y={570} size={52} s={pop(k('h6') - 0.6)}>HURRIAN HYMN</Title>
          <Title x={1550} y={650} size={70} fill={C.fire2} s={pop(k('h6') - 0.2)}>No. 6</Title>
        </g>
      )}
      <g opacity={prog(t, k('year'), 0.4) * (1 - prog(t, k('three') - 0.4, 0.3))}><Tag x={330} y={90} text="1950s · Ugarit's royal palace" s={pop(k('year'))} size={52} /></g>
      <MJ x={140} y={1070} s={0.7} t={t} pose={join > 0 ? 'shock' : 'idle'} talk={talkAt(id, t)} />
    </Stage>
  );
};

/* ===================== 7. WHAT'S ON THE TABLET ===================== */
export const TabletScene: React.FC = () => {
  const t = useT(); const pop = usePop(); const id = 'tablet';
  const k = (n: string) => cue(id, n);
  const hl = t > k('bottom') ? 'colophon' : t > k('music') ? 'bottom' : t > k('top') ? 'top' : null;
  const show = (a: string, b?: string) => prog(t, k(a) - 0.1, 0.4) * (b ? 1 - prog(t, k(b) - 0.2, 0.3) : 1);
  return (
    <Stage frames={fr(id)} zoom={[1, 1.04]} bg={C.sand}>
      <Defs />
      <rect width={W} height={H} fill="#e7cf9c" />
      {Array.from({length: 30}).map((_, i) => <path key={i} d={`M 0 ${i * 40} L ${W} ${i * 40 + 20}`} stroke="#d7bb85" strokeWidth={2} />)}
      <Tablet x={560} y={560} w={520} h={760} glow={0.25} hl={hl as any} seed={6} />
      {/* callouts */}
      <g opacity={show('top', 'double')}>
        <path d="M 860 300 L 1000 300" stroke={C.ink} strokeWidth={8} strokeLinecap="round" markerEnd="" />
        <Title x={1060} y={260} anchor="start" size={92} s={pop(k('top'))}>LYRICS</Title>
        <Tag x={1330} y={390} text="written in Hurrian" s={pop(k('hurrian'))} />
      </g>
      <g opacity={show('double', 'music')}>
        <path d="M 860 445 L 1000 445" stroke={C.ink} strokeWidth={8} strokeLinecap="round" />
        <Title x={1060} y={445} anchor="start" size={80} s={pop(k('double'))}>DOUBLE LINE</Title>
      </g>
      <g opacity={show('music', 'notnotes')}>
        <Title x={1340} y={560} size={170} fill={C.fire2} rot={-4} s={pop(k('music'))}>THE MUSIC</Title>
        {[0, 1, 2].map((i) => <Note key={i} x={1120 + i * 230} y={800 - ((t * 60 + i * 50) % 120)} s={1.2} double={i === 1} />)}
      </g>
      <g opacity={show('notnotes', 'like')}>
        <g transform={`translate(1360,330) scale(${pop(k('notnotes'))})`}>
          <rect x={-380} y={-110} width={760} height={220} rx={20} fill={C.cream} stroke={C.ink} strokeWidth={7} />
          {[0, 1, 2, 3, 4].map((i) => <path key={i} d={`M -340 ${-60 + i * 30} L 340 ${-60 + i * 30}`} stroke={C.ink} strokeWidth={3} />)}
          {[0, 1, 2, 3, 4, 5].map((i) => <Note key={i} x={-260 + i * 100} y={40 - (i % 3) * 30} s={0.8} fill={C.ink} />)}
          <Mark x={330} y={-90} s={0.8} />
        </g>
        <g opacity={prog(t, k('pairs'), 0.4)} transform={`translate(1360,720) scale(${pop(k('pairs'))})`}>
          <rect x={-380} y={-150} width={760} height={300} rx={20} fill={C.cream} stroke={C.ink} strokeWidth={7} />
          {Array.from({length: 9}).map((_, i) => <path key={i} d={`M ${-300 + i * 75} -110 L ${-300 + i * 75} 70`} stroke={[2, 6].includes(i) ? C.terra : C.stoneD} strokeWidth={[2, 6].includes(i) ? 10 : 5} />)}
          <path d="M -150 100 Q 0 150 150 100" stroke={C.terra} strokeWidth={6} fill="none" />
          <text x={0} y={135} fontFamily={FONT.hand} fontWeight={700} fontSize={44} textAnchor="middle" fill={C.ink}>a pair of strings + a number</text>
        </g>
      </g>
      <g opacity={show('like', 'bottom')}>
        {[['qablite', '3'], ['irbute', '1'], ['šahri', '1']].map(([w, n], i) => (
          <g key={i} opacity={prog(t, k('like') + 0.5 + i * 1.1, 0.3)} transform={`translate(1100,${230 + i * 120})`}>
            <text x={0} y={0} fontFamily={FONT.hand} fontWeight={700} fontSize={96} fill={C.ink}>{w}</text>
            <text x={420} y={0} fontFamily={FONT.title} fontSize={84} fill={C.terra} stroke={C.ink} strokeWidth={6} paintOrder="stroke">{n}</text>
          </g>
        ))}
        <g opacity={prog(t, k('tab'), 0.4)} transform={`translate(1300,780) scale(${pop(k('tab'))})`}>
          <rect x={-390} y={-140} width={780} height={250} rx={20} fill="#1f1a17" stroke={C.ink} strokeWidth={7} />
          {['e', 'B', 'G', 'D', 'A', 'E'].map((s, i) => (
            <g key={i}><text x={-360} y={-98 + i * 36} fontFamily="monospace" fontSize={30} fill="#cfc6b8" dominantBaseline="middle">{s}|</text>
              <path d={`M -320 ${-98 + i * 36} L 360 ${-98 + i * 36}`} stroke="#6b625a" strokeWidth={3} />
              {[0, 1, 2, 3].map((j) => (i + j) % 3 === 0 && <text key={j} x={-260 + j * 170 + i * 10} y={-96 + i * 36} fontFamily="monospace" fontWeight={700} fontSize={32} fill={C.fire2} textAnchor="middle" dominantBaseline="middle">{(i * 3 + j * 2) % 8}</text>)}</g>
          ))}
          <Title x={0} y={170} size={50} fill={C.fire2}>≈ AN ANCIENT GUITAR TAB</Title>
        </g>
      </g>
      <g opacity={show('bottom')}>
        <Title x={1360} y={300} size={86} s={pop(k('bottom'))}>THE SIGNATURE</Title>
        <g transform={`translate(1360,520) scale(${pop(k('name'))})`}>
          <rect x={-380} y={-100} width={760} height={200} rx={20} fill={C.paper} stroke={C.ink} strokeWidth={7} />
          <text x={0} y={-24} fontFamily={FONT.body} fontWeight={800} fontSize={40} textAnchor="middle" fill={C.stoneD}>SCRIBE</text>
          <text x={0} y={50} fontFamily={FONT.hand} fontWeight={700} fontSize={96} textAnchor="middle" fill={C.ink}>Ammurabi</text>
        </g>
        <g opacity={prog(t, k('tuning'), 0.4)}><Tag x={1360} y={760} text="+ the lyre tuning to use" s={pop(k('tuning'))} size={60} /></g>
      </g>
      <MJ x={1780} y={1075} s={0.62} t={t} pose={t > k('tab') && t < k('bottom') ? 'shrug' : 'point'} flip talk={talkAt(id, t)} />
    </Stage>
  );
};

/* ===================== 8. THE LYRE ===================== */
export const LyreScene: React.FC = () => {
  const t = useT(); const pop = usePop(); const id = 'lyre';
  const k = (n: string) => cue(id, n);
  const vib = (i: number) => {
    const p = Math.floor(t / 0.7), last = (i * 7 + p * 3) % 9 === 0 || (i + p) % 5 === 0;
    return last ? Math.exp(-(t % 0.7) * 4) : 0;
  };
  const singer = prog(t, k('singer'), 0.5);
  return (
    <Stage frames={fr(id)} zoom={[1, 1.06]} origin="60% 55%">
      <Defs />
      <rect width={W} height={H} fill="#d6863f" />
      <circle cx={1150} cy={560} r={460} fill="#f0b765" stroke={C.ink} strokeWidth={8} />
      <Lyre x={1150} y={880} s={1.25} t={t} vib={vib} />
      <Title x={1150} y={110} size={100} s={pop(k('nine'))}>A NINE-STRING LYRE</Title>
      <g opacity={prog(t, k('nine') + 0.8, 0.4)}><Tag x={1640} y={260} text="the sammûm" s={pop(k('nine') + 0.8)} size={60} /></g>
      <g opacity={prog(t, k('pluck'), 0.4)}><Tag x={680} y={300} text="plucked by hand" s={pop(k('pluck'))} rot={-6} /></g>
      <g opacity={singer}>
        <Stick x={1680} y={1020} s={1} t={t} arms={[[40, 60], [130, 20]]} />
        {[0, 1, 2].map((i) => { const l = (t * 0.5 + i / 3) % 1; return <Note key={i} x={1700 + i * 30 + wob(t, 0.6, 20, i)} y={720 - l * 300} s={0.9} o={Math.sin(l * Math.PI)} />; })}
      </g>
      <MJ x={300} y={1050} s={1} t={t} pose="point" talk={talkAt(id, t)} />
    </Stage>
  );
};

/* ===================== 9. NIKKAL ===================== */
const Tree: React.FC<{x: number; y: number; s?: number; t: number; i: number}> = ({x, y, s = 1, t, i}) => (
  <g transform={`translate(${x},${y}) scale(${s}) rotate(${wob(t, 0.2, 1.5, i)})`}>
    <path d="M -12 0 L -8 -120 L 8 -120 L 12 0 Z" fill="#4a3020" stroke={C.ink} strokeWidth={5} />
    <circle cx={0} cy={-170} r={90} fill="#2d4a3a" stroke={C.ink} strokeWidth={6} />
    {[0, 1, 2, 3, 4].map((j) => <circle key={j} cx={-50 + rnd(i * 9 + j) * 100} cy={-220 + rnd(i * 5 + j) * 100} r={12} fill={C.gold} stroke={C.ink} strokeWidth={3} />)}
  </g>
);
export const Nikkal: React.FC = () => {
  const t = useT(); const pop = usePop(); const id = 'nikkal';
  const k = (n: string) => cue(id, n);
  const tab = prog(t, k('honest') - 0.2, 0.6);
  return (
    <Stage frames={fr(id)} zoom={[1, 1.05]} bg={C.night}>
      <Defs />
      <rect width={W} height={H} fill="url(#nightSky)" />
      {Array.from({length: 70}).map((_, i) => <circle key={i} cx={rnd(i) * W} cy={rnd(i + 50) * 600} r={1.5 + rnd(i + 3) * 2.5} fill="#fff" opacity={0.4 + 0.5 * Math.abs(Math.sin(t * 1.5 + i))} />)}
      {/* moon */}
      <g transform="translate(1500,230)">
        <circle r={170 + 40 * prog(t, k('moon'), 0.6)} fill="url(#softglow)" opacity={0.5} />
        <path d="M 60 -120 A 130 130 0 1 0 60 120 A 100 100 0 1 1 60 -120 Z" fill="#fff3c4" stroke={C.ink} strokeWidth={7} />
      </g>
      <path d={`M 0 820 Q 500 700 960 780 Q 1400 860 ${W} 760 L ${W} ${H} L 0 ${H} Z`} fill="#24382e" stroke={C.ink} strokeWidth={7} />
      {[180, 420, 1440, 1700, 1900].map((x, i) => <Tree key={i} x={x} y={830 + (i % 2) * 40} s={0.9 + rnd(i) * 0.3} t={t} i={i} />)}
      {/* goddess */}
      <g opacity={prog(t, k('goddess') - 0.2, 0.6)} transform={`translate(960,880) scale(${0.9 + 0.1 * pop(k('goddess'))})`}>
        <ellipse cx={0} cy={-260} rx={260} ry={300} fill="url(#softglow)" opacity={0.55} />
        <path d="M -150 0 L -60 -330 L 60 -330 L 150 0 Z" fill="#6e5aa8" stroke={C.ink} strokeWidth={7} strokeLinejoin="round" />
        <path d="M -60 -330 L 0 -200 L 60 -330" fill="none" stroke={C.gold} strokeWidth={8} />
        <Stick x={0} y={-180} s={1.0} t={t} hat="crown" arms={[[60, 50], [60, 50]]} color={C.ink} />
      </g>
      <Title x={960} y={110} size={140} fill="#fff3c4" s={pop(k('goddess') + 0.4)} o={1 - tab}>NIKKAL</Title>
      <g opacity={prog(t, k('orchards'), 0.4) * (1 - tab)}><Tag x={540} y={260} text="goddess of orchards" s={pop(k('orchards'))} /></g>
      <g opacity={prog(t, k('moon'), 0.4) * (1 - tab)}><Tag x={1500} y={460} text="wife of the moon god" s={pop(k('moon'))} rot={4} /></g>
      {/* offerings */}
      <g opacity={prog(t, k('offer'), 0.5)}>
        <Stick x={640} y={1010} s={0.8} t={t} arms={[[120, 10], [120, 10]]} />
        <g transform={`translate(780,990) scale(${pop(k('offer'))})`}>
          <path d="M -70 -20 Q 0 50 70 -20 Z" fill={C.terra} stroke={C.ink} strokeWidth={6} />
          {[-40, -10, 22, 46].map((x, i) => <circle key={i} cx={x} cy={-30 - (i % 2) * 14} r={18} fill={i % 2 ? '#b83a5e' : C.gold} stroke={C.ink} strokeWidth={4} />)}
        </g>
      </g>
      {/* love song or prayer */}
      {(['love', 'prayer'] as const).map((w, i) => (
        <g key={w} transform={`translate(${i ? 1380 : 540},${i ? 640 : 560}) scale(${pop(k(w))})`} opacity={1 - tab}>
          <rect x={-200} y={-60} width={400} height={120} rx={60} fill={C.cream} stroke={C.ink} strokeWidth={7} />
          <text x={0} y={6} fontFamily={FONT.hand} fontWeight={700} fontSize={66} textAnchor="middle" dominantBaseline="middle" fill={C.ink}>{i ? 'a prayer?' : 'a love song?'}</text>
        </g>
      ))}
      {tab > 0 && (
        <g opacity={tab}>
          <rect width={W} height={H} fill="rgba(10,12,30,.75)" />
          <Tablet x={960} y={560} w={420} h={560} glow={0.3} seed={6} />
          {/* flakes falling */}
          {t > k('flakes') - 0.4 && [0, 1, 2, 3, 4, 5].map((i) => {
            const a = clamp((t - k('flakes') + 0.4 - i * 0.15) / 1.6);
            return <path key={i} transform={`translate(${800 + rnd(i) * 320},${330 + rnd(i + 1) * 440 + a * a * 500}) rotate(${a * 200})`} d="M -14 -10 L 12 -14 L 16 8 L -10 14 Z" fill={C.clay} stroke={C.ink} strokeWidth={4} opacity={1 - a * 0.6} />;
          })}
          <Title x={960} y={110} size={78} fill={C.cream} s={pop(k('honest') + 0.6)}>NOBODY CAN FULLY TRANSLATE IT</Title>
          <g opacity={prog(t, k('gaps'), 0.4)}><Tag x={1480} y={760} text="gaps in the clay" s={pop(k('gaps'))} /></g>
        </g>
      )}
      <MJ x={150} y={1070} s={0.7} t={t} pose={t > k('love') && t < k('honest') ? 'shrug' : 'idle'} talk={talkAt(id, t)} />
    </Stage>
  );
};

/* ===================== 10. TIMELINE ===================== */
const yx = (yr: number) => 150 + ((yr + 2700) / 4730) * 1620;
export const Time: React.FC = () => {
  const t = useT(); const pop = usePop(); const id = 'time';
  const k = (n: string) => cue(id, n);
  const gen = prog(t, k('gen') - 0.4, 0.4);
  const marks: {yr: number; label: string; sub: string; at: string}[] = [
    {yr: -2560, label: 'PYRAMIDS', sub: 'c. 2560 BC', at: 'pyr'},
    {yr: -1400, label: 'THIS SONG', sub: 'c. 1400 BC', at: 'written'},
    {yr: 0, label: 'GREEK SONGS', sub: 'Seikilos epitaph', at: 'seik'},
    {yr: 2026, label: 'YOU', sub: 'today', at: 'between'},
  ];
  return (
    <Stage frames={fr(id)} zoom={[1, 1.03]} bg={C.paper}>
      <Defs />
      <rect width={W} height={H} fill="#efdcb2" />
      <Title x={960} y={100} size={100} s={pop(k('persp'))}>HOW OLD IS 3,400 YEARS?</Title>
      <path d={`M 120 620 L ${120 + 1680 * prog(t, k('persp'), 1.2)} 620`} stroke={C.ink} strokeWidth={14} strokeLinecap="round" />
      {marks.map((m, i) => {
        const x = yx(m.yr), s = pop(k(m.at));
        return (
          <g key={i} transform={`translate(${x},620)`} opacity={s > 0 ? 1 : 0}>
            <circle r={22 * Math.min(1.2, s)} fill={i === 1 ? C.gold : C.cream} stroke={C.ink} strokeWidth={6} />
            <g transform={`translate(0,-60) scale(${s})`}>
              {i === 0 && <g><path d="M -150 0 L -60 -160 L 30 0 Z" fill="#e3c27a" stroke={C.ink} strokeWidth={6} strokeLinejoin="round" /><path d="M -10 0 L 60 -120 L 130 0 Z" fill="#d8b46a" stroke={C.ink} strokeWidth={6} strokeLinejoin="round" /></g>}
              {i === 1 && <Tablet x={0} y={-120} w={170} h={220} glow={0.5} seed={6} />}
              {i === 2 && <g>{[-50, 0, 50].map((x) => <rect key={x} x={x - 14} y={-170} width={28} height={170} fill="#f2ece0" stroke={C.ink} strokeWidth={5} />)}<path d="M -90 -170 L 90 -170 L 0 -230 Z" fill="#f2ece0" stroke={C.ink} strokeWidth={5} strokeLinejoin="round" /></g>}
              {i === 3 && <MJ x={0} y={0} s={0.55} t={t} pose="wave" talk={talkAt(id, t)} />}
            </g>
            <text y={84} fontFamily={FONT.title} fontSize={40} textAnchor="middle" fill={C.ink}>{m.label}</text>
            <text y={130} fontFamily={FONT.hand} fontWeight={700} fontSize={42} textAnchor="middle" fill={C.stoneD}>{m.sub}</text>
          </g>
        );
      })}
      {/* brackets */}
      {[[-2560, -1400, 'thousand', '1,100+ years'], [-1400, 0, 'greece', '~1,000+ years']].map(([a, b, c, txt], i) => {
        const p = prog(t, k(c as string), 0.6);
        const x1 = yx(a as number), x2 = yx(b as number);
        return (
          <g key={i} opacity={p}>
            <path d={`M ${x1} 820 L ${x1} 850 L ${x1 + (x2 - x1) * p} 850 L ${x1 + (x2 - x1) * p} 820`} stroke={C.terra} strokeWidth={8} fill="none" strokeLinejoin="round" />
            <text x={(x1 + x2) / 2} y={910} fontFamily={FONT.hand} fontWeight={700} fontSize={52} textAnchor="middle" fill={C.terra}>{txt}</text>
          </g>
        );
      })}
      {gen > 0 && (
        <g opacity={gen}>
          <rect width={W} height={H} fill="rgba(239,220,178,.94)" />
          {Array.from({length: 120}).map((_, i) => {
            const a = clamp((t - k('gen') + 0.4 - i * 0.012) / 0.3);
            const x = 110 + (i % 24) * 74, y = 400 + Math.floor(i / 24) * 130;
            return <Stick key={i} x={x} y={y} s={0.3 * a} t={t} o={a} head={i === 119 ? C.gold : C.cream} />;
          })}
          <Title x={960} y={200} size={110} fill={C.fire2} s={pop(k('gen'))}>100+ GENERATIONS</Title>
          <Tag x={960} y={1010} text="from that scribe... to you" s={pop(k('gen') + 0.8)} />
        </g>
      )}
    </Stage>
  );
};

/* ===================== 11. THE MYSTERY ===================== */
export const Mystery: React.FC = () => {
  const t = useT(); const pop = usePop(); const id = 'mystery';
  const k = (n: string) => cue(id, n);
  const p1 = 1 - prog(t, k('five') - 0.3, 0.4);
  const p2 = prog(t, k('five') - 0.3, 0.4) * (1 - prog(t, k('numbers') - 0.3, 0.4));
  const p3 = prog(t, k('numbers') - 0.3, 0.4);
  const flip = prog(t, k('upside') + 0.3, 1.2);
  return (
    <Stage frames={fr(id)} zoom={[1, 1.04]}>
      <Defs />
      <rect width={W} height={H} fill="#3b2a1f" />
      {/* bookshelf */}
      {[0, 1, 2].map((r) => (
        <g key={r}><rect x={0} y={130 + r * 190} width={W} height={18} fill="#5e4130" />
          {Array.from({length: 40}).map((_, i) => <rect key={i} x={i * 50 + rnd(i + r * 40) * 10} y={30 + r * 190 + rnd(i * 3 + r) * 40} width={36} height={100 - rnd(i * 3 + r) * 40} fill={['#8a3b2c', '#4e6a5a', '#c7a35a', '#5a4f82'][(i + r) % 4]} stroke={C.ink} strokeWidth={3} opacity={0.75} />)}</g>
      ))}
      <rect x={0} y={800} width={W} height={280} fill="#6b4a2b" stroke={C.ink} strokeWidth={8} />
      <g opacity={p1}>
        <Title x={960} y={100} size={120} fill={C.fire2} s={pop(k('catch'))}>THE CATCH</Title>
        <g opacity={prog(t, k('fifty'), 0.4)}><Tag x={960} y={230} text="50+ years of arguing" s={pop(k('fifty'))} size={60} /></g>
        {/* scholars */}
        <g opacity={prog(t, k('seventies'), 0.5)}>
          <Stick x={600} y={900} s={1.1} t={t} arms={[[40, 70], [120, -20]]} />
          <Stick x={1320} y={900} s={1.1} t={t} flip arms={[[30, 60], [110, -10]]} />
          <Tag x={600} y={980} text="Anne Kilmer · UC Berkeley" s={pop(k('kilmer'))} size={44} />
          <Tag x={1320} y={980} text="Marcelle Duchesne-Guillemin" s={pop(k('kilmer') + 0.6)} size={44} rot={3} />
          <Title x={960} y={420} size={90} s={pop(k('seventies'))} o={1 - prog(t, k('perf') - 0.3, 0.3)}>1970s</Title>
          <g opacity={prog(t, k('tuning'), 0.4) * (1 - prog(t, k('perf'), 0.3))}><Lyre x={960} y={760} s={0.55} t={t} vib={(i) => (Math.floor(t * 2) % 9 === i - 1 ? 0.8 : 0)} /></g>
          <g opacity={prog(t, k('perf'), 0.4)}>
            <path d={`M 860 260 L 700 800 L 1220 800 L 1060 260 Z`} fill="#fff6c8" opacity={0.25} />
            <Title x={960} y={420} size={110} fill={C.fire2} s={pop(k('perf'))}>1974</Title>
            <Title x={960} y={540} size={54} s={pop(k('perf') + 0.4)}>FIRST MODERN PERFORMANCE</Title>
          </g>
        </g>
      </g>
      {p2 > 0 && (
        <g opacity={p2}>
          <rect width={W} height={H} fill="#2a1d16" />
          <Title x={960} y={100} size={100} s={pop(k('five'))}>5+ INTERPRETATIONS</Title>
          {[0, 1, 2, 3, 4].map((i) => {
            const a = prog(t, k('five') + 0.3 + i * 0.25, 0.4);
            let d = '';
            for (let x = 0; x <= 1100; x += 10) d += `${x ? 'L' : 'M'} ${x} ${Math.sin(x * (0.012 + i * 0.007) + t * (1 + i * 0.4)) * (20 + i * 6) * (1 + 0.6 * Math.sin(x * 0.004 * (i + 1)))} `;
            return (
              <g key={i} transform={`translate(560,${260 + i * 110})`} opacity={a}>
                <text x={-40} y={10} fontFamily={FONT.hand} fontWeight={700} fontSize={48} textAnchor="end" fill={C.cream}>version {i + 1}</text>
                <path d={d} stroke={['#f2b33d', '#e8562a', '#6fb0c6', '#8fce6a', '#c88ae0'][i]} strokeWidth={8} fill="none" strokeLinecap="round" />
              </g>
            );
          })}
          <g opacity={prog(t, k('diff'), 0.4) * (1 - prog(t, k('upside') - 0.3, 0.3))}><Tag x={960} y={850} text="each one sounds completely different" s={pop(k('diff'))} /></g>
          {/* upside-down scale */}
          <g opacity={prog(t, k('upside') - 0.3, 0.4)}>
            <rect x={0} y={760} width={W} height={320} fill="#2a1d16" />
            <g transform={`translate(960,930) rotate(${180 * flip})`}>
              {[0, 1, 2, 3, 4, 5, 6].map((i) => <rect key={i} x={-330 + i * 96} y={-20 - i * 18} width={76} height={40 + i * 18} rx={8} fill={i === 6 ? C.fire2 : C.cream} stroke={C.ink} strokeWidth={5} />)}
            </g>
            <Tag x={1530} y={900} text="read upside down!" s={pop(k('upside') + 0.5)} rot={5} />
            <Tag x={420} y={900} text="highest ↔ lowest" s={pop(k('lowest'))} rot={-4} />
          </g>
        </g>
      )}
      {p3 > 0 && (
        <g opacity={p3}>
          <rect width={W} height={H} fill="#2a1d16" />
          <g transform={`translate(960,300) scale(${pop(k('numbers'))})`}>
            <text x={-80} y={0} fontFamily={FONT.hand} fontWeight={700} fontSize={150} textAnchor="middle" fill={C.cream}>qablite</text>
            <text x={290} y={0} fontFamily={FONT.title} fontSize={150} textAnchor="middle" fill={C.fire2} stroke={C.ink} strokeWidth={8} paintOrder="stroke">3</text>
          </g>
          <g transform={`translate(560,600) scale(${pop(k('times'))})`}>
            <rect x={-280} y={-70} width={560} height={140} rx={70} fill={C.cream} stroke={C.ink} strokeWidth={7} />
            <text y={8} fontFamily={FONT.title} fontSize={54} textAnchor="middle" dominantBaseline="middle" fill={C.ink}>play it 3 times?</text>
          </g>
          <g transform={`translate(1360,600) scale(${pop(k('beats'))})`}>
            <rect x={-280} y={-70} width={560} height={140} rx={70} fill={C.cream} stroke={C.ink} strokeWidth={7} />
            <text y={8} fontFamily={FONT.title} fontSize={54} textAnchor="middle" dominantBaseline="middle" fill={C.ink}>hold for 3 beats?</text>
          </g>
          <Title x={1500} y={890} size={240} fill={C.fire2} rot={8} s={pop(k('nobody'))}>?</Title>
          <Title x={960} y={880} size={84} s={pop(k('nobody') + 0.3)}>NOBODY KNOWS</Title>
          <MJ x={320} y={1060} s={0.85} t={t} pose="shrug" talk={talkAt(id, t)} />
        </g>
      )}
      {p3 === 0 && p2 === 0 && <MJ x={160} y={1070} s={0.72} t={t} pose="think" talk={talkAt(id, t)} />}
    </Stage>
  );
};

/* ===================== 12. LISTEN ===================== */
const PIECE: [[number, number], number][] = [[[3, 7], 3], [[2, 6], 1], [[3, 7], 3], [[1, 5], 1], [[4, 8], 2], [[5, 9], 1], [[4, 8], 1], [[3, 7], 2],
  [[2, 6], 2], [[1, 5], 2], [[3, 6], 1], [[4, 7], 2], [[3, 7], 3], [[1, 5], 1], [[2, 4], 1], [[1, 5], 3]];
const PLUCKS: [number, number][] = (() => {
  const out: [number, number][] = [];
  const beat = 60 / 66; let at = 0.4;
  for (const [[a, b], n] of PIECE) {
    for (let r = 0; r < n; r++) { out.push([at, a]); out.push([at + 0.06, b]); at += beat; }
    at += beat * 0.35;
    if (at > 31.5 - 3) break;
  }
  out.push([at + 0.2, 1]); out.push([at + 0.32, 8]); out.push([at + 0.45, 5]);
  return out;
})();
export const Listen: React.FC = () => {
  const t = useT(); const pop = usePop(); const id = 'listen';
  const k = (n: string) => cue(id, n);
  let start = 0;
  for (const s of SCENES) { if (s.id === id) break; start += s.dur; }
  const m0 = (musicCue as any).listen_music_start - start;
  const mt = t - m0;
  const vib = (i: number) => {
    let v = 0;
    for (const [at, s] of PLUCKS) if (s === i && mt >= at) v = Math.max(v, Math.exp(-(mt - at) * 2.2));
    return v;
  };
  const dim = prog(t, k('close'), 1.5);
  const playing = mt > 0;
  return (
    <Stage frames={fr(id)} zoom={[1, 1.08]} origin="50% 60%">
      <Defs />
      <rect width={W} height={H} fill="url(#duskSky)" />
      {Array.from({length: 50}).map((_, i) => <circle key={i} cx={rnd(i) * W} cy={rnd(i + 60) * 420} r={1.5 + rnd(i + 2) * 2} fill="#fff" opacity={dim * (0.4 + 0.5 * Math.abs(Math.sin(t + i)))} />)}
      <circle cx={1500} cy={560} r={110} fill="#ffd27a" opacity={0.9 - dim * 0.4} />
      <path d={`M 1000 600 L ${W} 600 L ${W} ${H} L 1000 ${H} Z`} fill="#2c4f6a" />
      <Waves y={680} t={t} color="#ffd9a0" o={0.5} speed={20} /><Waves y={780} t={t * 0.7} color="#ffd9a0" o={0.35} speed={20} />
      {/* palace on the cliff */}
      <path d="M 0 1080 L 0 560 L 300 520 L 760 560 L 1080 700 L 1120 1080 Z" fill="#3a2a35" stroke={C.ink} strokeWidth={7} />
      <g transform="translate(330,540)">
        <rect x={-220} y={-170} width={440} height={170} fill="#4a3442" stroke={C.ink} strokeWidth={6} />
        {[0, 1, 2, 3, 4, 5].map((i) => <rect key={i} x={-190 + i * 70} y={-140} width={22} height={140} fill="#5d4354" stroke={C.ink} strokeWidth={4} />)}
        {[0, 1, 2].map((i) => <rect key={i} x={-120 + i * 100} y={-110} width={30} height={40} fill="#ffb347" opacity={0.7 + 0.3 * Math.sin(t * 2 + i)} />)}
      </g>
      <rect width={W} height={H} fill="#0b0a18" opacity={dim * 0.35} />
      <ellipse cx={1010} cy={720} rx={420} ry={420} fill="url(#softglow)" opacity={0.25 + (playing ? 0.15 * Math.sin(t * 2) : 0)} />
      <Lyre x={1010} y={1000} s={1.15} t={t} vib={vib} />
      {playing && PLUCKS.filter(([at]) => mt >= at && mt - at < 3).map(([at, s], i) => {
        const l = (mt - at) / 3;
        return <Note key={at + '-' + s} x={1010 - 170 + s * 38 + wob(at, 1, 30)} y={420 - l * 300} s={0.8} o={Math.sin(l * Math.PI) * 0.9} double={s % 2 === 0} />;
      })}
      <MJ x={330} y={980} s={0.95} t={t} pose="sit" talk={talkAt(id, t)} />
      <g opacity={prog(t, k('take'), 0.4) * (1 - prog(t, m0 - 0.6, 0.6))}>
        <Title x={960} y={110} size={84} s={pop(k('take'))}>OUR OWN TAKE</Title>
        <Tag x={960} y={225} text="a tribute — not a reconstruction" s={pop(k('tribute'))} size={52} />
      </g>
      <g opacity={prog(t, m0 + 1, 1) * (1 - prog(t, sceneById(id).dur - 3, 1.5))}>
        <text x={960} y={120} fontFamily={FONT.hand} fontWeight={700} fontSize={70} textAnchor="middle" fill="#fff3c4" stroke={C.ink} strokeWidth={8} paintOrder="stroke">Ugarit · c. 1400 BC</text>
        <text x={1640} y={1030} fontFamily={FONT.body} fontWeight={600} fontSize={30} textAnchor="middle" fill="#fff3c4" opacity={0.8}>9-string lyre · our interpretation</text>
      </g>
    </Stage>
  );
};

/* ===================== 13. OUTRO ===================== */
export const Outro: React.FC = () => {
  const t = useT(); const pop = usePop(); const id = 'outro'; const f = useCurrentFrame();
  const k = (n: string) => cue(id, n);
  const seg = (a: string, b: string) => prog(t, k(a) - 0.25, 0.35) * (1 - prog(t, k(b) - 0.3, 0.3));
  const next = prog(t, k('next') - 0.3, 0.5) * (1 - prog(t, k('sub') - 0.3, 0.4));
  const sub = prog(t, k('sub') - 0.3, 0.4);
  const pulse = t > k('war') ? 0.5 + 0.5 * Math.sin(t * 6) : 0;
  return (
    <Stage frames={fr(id)} zoom={[1, 1.03]} bg="#1d1410" dip={14}>
      <Defs />
      <rect width={W} height={H} fill="url(#darkBg)" />
      {/* empires rise and fall */}
      <g opacity={seg('empires', 'burned')}>
        {[0, 1, 2, 3, 4].map((i) => {
          const rise = clamp((t - k('empires') - i * 0.15) / 0.6), fall = clamp((t - k('empires') - 1.2 - i * 0.1) / 0.6);
          return <g key={i} transform={`translate(${560 + i * 200},820) rotate(${fall * (i % 2 ? 70 : -70)})`}><rect x={-30} y={-360 * rise} width={60} height={360 * rise} fill="#f2ece0" stroke={C.ink} strokeWidth={6} /></g>;
        })}
        <Title x={960} y={200} size={100} s={pop(k('empires'))}>EMPIRES ROSE... AND FELL</Title>
      </g>
      <g opacity={seg('burned', 'lang')}>
        {[0, 1, 2, 3, 4, 5].map((i) => <Flame key={i} x={460 + i * 200} y={900} s={1.2} t={t} ph={i} />)}
        <Title x={960} y={200} size={110} fill={C.fire2} s={pop(k('burned'))}>THE CITY BURNED</Title>
      </g>
      <g opacity={seg('lang', 'survived')}>
        <Tablet x={960} y={600} w={420} h={480} o={1 - prog(t, k('lang') + 0.5, 1.6) * 0.85} seed={11} />
        <Title x={960} y={200} size={90} s={pop(k('lang'))}>THE LANGUAGE WAS FORGOTTEN</Title>
      </g>
      <g opacity={seg('survived', 'older')}>
        <Tablet x={960} y={600} w={420} h={520} glow={0.8} seed={6} rot={wob(t, 0.2, 3)} />
        {[0, 1, 2, 3].map((i) => { const l = (t * 0.4 + i / 4) % 1; return <Note key={i} x={760 + i * 130} y={360 - l * 260} o={Math.sin(l * Math.PI)} double={i % 2 === 1} />; })}
        <Title x={960} y={150} size={110} fill={C.fire2} s={pop(k('survived'))}>BUT THE SONG SURVIVED</Title>
        <g opacity={prog(t, k('someone'), 0.4)}><Tag x={960} y={960} text="because someone wrote it down" s={pop(k('someone'))} /></g>
      </g>
      <g opacity={seg('older', 'next')}>
        <Title x={960} y={300} size={100} s={pop(k('older') + 0.4)}>OLDER THAN WRITING</Title>
        <Title x={960} y={480} size={100} s={pop(k('cities'))}>OLDER THAN CITIES</Title>
        <Title x={960} y={660} size={110} fill={C.fire2} s={pop(k('people'))}>AS OLD AS PEOPLE?</Title>
        <MJ x={300} y={1060} s={0.85} t={t} pose="present" talk={talkAt(id, t)} />
      </g>
      {/* next video teaser */}
      {next > 0 && (
        <g opacity={next}>
          <rect width={W} height={H} fill="#2a1a0c" />
          <rect width={W} height={H} fill={C.red} opacity={pulse * 0.18} />
          <path d={`M 1100 900 L 1500 360 L 1900 900 Z`} fill="#8a6a32" stroke={C.ink} strokeWidth={7} />
          <path d={`M 0 900 L ${W} 900 L ${W} ${H} L 0 ${H} Z`} fill="#c8a25a" stroke={C.ink} strokeWidth={7} />
          <ellipse cx={760} cy={600} rx={460} ry={300} fill="url(#glow)" opacity={0.6} />
          {[[-1, '#d9dde0'], [1, '#c98b4a']].map(([d, col], i) => (
            <g key={i} transform={`translate(760,600) rotate(${(d as number) * 28 + wob(t, 0.3, 2)})`} opacity={prog(t, k('trumpets') + i * 0.3, 0.4)}>
              <path d="M -330 -10 L 180 -14 L 330 -90 L 330 90 L 180 14 L -330 10 Z" fill={col as string} stroke={C.ink} strokeWidth={8} strokeLinejoin="round" />
              <rect x={-345} y={-18} width={40} height={36} rx={8} fill={col as string} stroke={C.ink} strokeWidth={6} />
            </g>
          ))}
          <Title x={960} y={110} size={80} fill={C.cream} s={pop(k('next'))}>NEXT ON MJ SOUND CHRONICLES</Title>
          <Title x={1450} y={300} size={100} fill={C.fire2} s={pop(k('trumpets') + 0.3)}>THE CURSED</Title>
          <Title x={1450} y={420} size={100} fill={C.fire2} s={pop(k('trumpets') + 0.5)}>TRUMPETS</Title>
          <Title x={1450} y={530} size={52} s={pop(k('trumpets') + 0.8)}>OF TUTANKHAMUN</Title>
          <g opacity={prog(t, k('war'), 0.3)}><Tag x={1450} y={680} text="play them... and war follows?" s={pop(k('war'))} fill="#f3d0c0" /></g>
        </g>
      )}
      {sub > 0 && (
        <g opacity={sub}>
          <rect width={W} height={H} fill={C.terra} />
          <circle cx={560} cy={560} r={330} fill="#f0a35c" stroke={C.ink} strokeWidth={8} />
          <MJ x={560} y={900} s={1.2} t={t} pose={t > k('mj') ? 'wave' : 'point'} talk={talkAt(id, t)} />
          <g transform={`translate(1300,520) scale(${pop(k('sub')) * (t > k('sub') + 1.2 && t < k('sub') + 1.5 ? 0.93 : 1)})`}>
            <rect x={-300} y={-80} width={600} height={160} rx={30} fill={t > k('sub') + 1.3 ? '#9a9a9a' : C.red} stroke={C.ink} strokeWidth={9} />
            <text y={8} fontFamily={FONT.title} fontSize={72} textAnchor="middle" dominantBaseline="middle" fill="#fff">{t > k('sub') + 1.3 ? 'SUBSCRIBED' : 'SUBSCRIBE'}</text>
          </g>
          {/* cursor */}
          <g transform={`translate(${1500 - 150 * prog(t, k('sub') + 0.3, 0.8)},${760 - 190 * prog(t, k('sub') + 0.3, 0.8)})`} opacity={1 - prog(t, k('sub') + 2.2, 0.4)}>
            <path d="M 0 0 L 0 70 L 18 54 L 32 84 L 44 78 L 30 50 L 54 48 Z" fill="#fff" stroke={C.ink} strokeWidth={5} strokeLinejoin="round" />
          </g>
          <Title x={1310} y={760} size={48} fill={C.cream} s={pop(k('mj'))}>SEE YOU IN THE NEXT CHRONICLE</Title>
          <text x={1300} y={880} fontFamily={FONT.hand} fontWeight={700} fontSize={60} textAnchor="middle" fill={C.cream} opacity={prog(t, k('mj') + 0.6, 0.5)}>MJ Sound Chronicles</text>
        </g>
      )}
    </Stage>
  );
};
