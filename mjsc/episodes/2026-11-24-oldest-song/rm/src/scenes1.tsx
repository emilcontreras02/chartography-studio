import React from 'react';
import {useCurrentFrame} from 'remotion';
import {C, FONT, W, H, Stage, Defs, MJ, Stick, Tablet, Title, Tag, Note, Burst, Mark, Flame, House, Ship, Waves, cue, useT, usePop, prog, clamp, wob, talkAt, rnd, sceneById} from './lib';

const fr = (id: string) => sceneById(id).frames;

const Dust: React.FC<{t: number; n?: number; color?: string}> = ({t, n = 40, color = '#ffdca0'}) => (
  <g>
    {Array.from({length: n}).map((_, i) => {
      const x = (rnd(i) * W + t * (8 + rnd(i + 3) * 14)) % W;
      const y = (rnd(i + 7) * H - t * (6 + rnd(i + 5) * 10) + H * 2) % H;
      return <circle key={i} cx={x} cy={y} r={1.5 + rnd(i + 2) * 3} fill={color} opacity={0.25 + 0.35 * Math.abs(Math.sin(t + i))} />;
    })}
  </g>
);

/* ===================== 1. HOOK ===================== */
export const Hook: React.FC = () => {
  const t = useT(); const pop = usePop(); const id = 'hook';
  const k = (n: string) => cue(id, n);
  const cardsIn = prog(t, k('poem') - 0.3, 0.6), cardsOut = prog(t, k('q1') - 0.4, 0.5);
  const phaseB = cardsIn * (1 - cardsOut);
  const phaseC = prog(t, k('q1') - 0.3, 0.6);
  // tablet travels: center -> card 3 -> right side
  const tx = 960 + (1440 - 960) * phaseB + (1250 - 960) * phaseC * (1 - phaseB);
  const ts = 1 - 0.45 * phaseB - 0.12 * phaseC * (1 - phaseB);
  const ty = 560 - 40 * phaseB;
  const notes = t > k('oldest');
  const mjIn = prog(t, k('stick') - 0.2, 1.4);
  return (
    <Stage frames={fr(id)} bg="#120b08" zoom={[1.0, 1.06]}>
      <Defs />
      <rect width={W} height={H} fill="url(#darkBg)" />
      <ellipse cx={tx} cy={ty} rx={620} ry={520} fill="url(#softglow)" opacity={0.35} />
      <Dust t={t} />
      {/* titles phase A */}
      <g opacity={1 - phaseB}>
        <Title x={960} y={120} size={120} s={pop(k('age'))} o={1 - phaseC}>3,400 YEARS OLD</Title>
        <g opacity={1 - phaseC}><Tag x={330} y={850} text="buried 3,000+ years" s={pop(k('buried'))} rot={-5} /></g>
      </g>
      {/* cards phase B */}
      {phaseB > 0 && (
        <g opacity={phaseB}>
          {[0, 1].map((i) => {
            const x = 470 + i * 480, s = pop(k(i ? 'painting' : 'poem'));
            return (
              <g key={i} transform={`translate(${x},520) scale(${s}) rotate(${i ? 3 : -3})`}>
                <rect x={-200} y={-250} width={400} height={500} rx={24} fill={C.paper} stroke={C.ink} strokeWidth={8} />
                {i === 0 ? (
                  <g>
                    <path d="M -120 -170 L 120 -170 L 120 120 Q 120 160 80 160 L -120 160 Z" fill="#f7ecd2" stroke={C.ink} strokeWidth={6} />
                    {[0, 1, 2, 3, 4, 5].map((j) => <path key={j} d={`M -90 ${-120 + j * 42} L ${70 - (j % 2) * 40} ${-120 + j * 42}`} stroke={C.stoneD} strokeWidth={8} strokeLinecap="round" />)}
                  </g>
                ) : (
                  <g>
                    <rect x={-150} y={-180} width={300} height={320} fill="#7a5a3a" stroke={C.ink} strokeWidth={8} />
                    <rect x={-126} y={-156} width={252} height={272} fill="#e9d1a2" />
                    <Stick x={-20} y={100} s={0.55} t={t} arms={[[40, 60], [60, 40]]} />
                    <path d="M 30 90 L 30 -30 L 80 -40 L 70 90" fill="none" stroke={C.ink} strokeWidth={6} />
                  </g>
                )}
                <text x={0} y={210} fontFamily={FONT.hand} fontWeight={700} fontSize={50} textAnchor="middle" fill={C.ink}>{i ? 'a painting of music' : 'a poem about music'}</text>
                <g transform="translate(120,-170)" opacity={clamp(pop(k(i ? 'painting' : 'poem') + 0.7))}><Mark x={0} y={0} s={0.9} /></g>
              </g>
            );
          })}
          <g transform={`translate(1440,925) scale(${pop(k('actual'))})`}>
            <Title x={0} y={0} size={64} fill={C.fire2}>AN ACTUAL SONG</Title>
            <Mark x={250} y={-90} s={0.7} ok />
          </g>
        </g>
      )}
      <Tablet x={tx} y={ty + wob(t, 0.2, 8)} w={380} h={520} s={ts} rot={wob(t, 0.12, 3)} reveal={clamp(t / 3.5)} glow={0.55} />
      {notes && [0, 1, 2, 3, 4].map((i) => {
        const life = ((t - k('oldest')) * 0.35 + i * 0.2) % 1;
        return <Note key={i} x={tx - 160 + i * 80 + wob(t, 0.5, 20, i)} y={ty - 250 * ts - life * 260} s={0.9 * ts} o={Math.sin(life * Math.PI) * (1 - phaseB * 0.6)} double={i % 2 === 0} />;
      })}
      <g opacity={1 - phaseB}>
        <g opacity={1 - phaseC}><Title x={960} y={975} size={76} fill={C.fire2} s={pop(k('oldest'))}>THE OLDEST SONG EVER FOUND</Title></g>
      </g>
      {/* phase C: questions + MJ */}
      {phaseC > 0 && (
        <g opacity={phaseC}>
          {(['How did it survive?', 'Who wrote it?', 'What did it sound like?'] as const).map((q, i) => (
            <g key={i} transform={`translate(${560},${230 + i * 170}) scale(${pop(k(['q1', 'q2', 'q3'][i]))})`}>
              <rect x={-380} y={-62} width={760} height={124} rx={62} fill={C.cream} stroke={C.ink} strokeWidth={7} />
              <path d="M 300 50 L 360 100 L 250 60 Z" fill={C.cream} stroke={C.ink} strokeWidth={7} strokeLinejoin="round" />
              <text x={0} y={6} fontFamily={FONT.title} fontSize={52} textAnchor="middle" dominantBaseline="middle" fill={C.ink}>{q}</text>
            </g>
          ))}
          <MJ x={-200 + 500 * mjIn} y={1060} s={0.95} t={t} walk={mjIn < 1 ? 1 : 0} pose={t > k('hear') ? 'point' : 'idle'} talk={talkAt(id, t)} />
          <g opacity={prog(t, k('hear'), 0.4)}><Title x={1250} y={1000} size={70} fill={C.fire2}>...AND YOU'LL HEAR IT</Title></g>
        </g>
      )}
    </Stage>
  );
};

/* ===================== 2. INTRO ===================== */
export const Intro: React.FC = () => {
  const t = useT(); const pop = usePop(); const id = 'intro';
  return (
    <Stage frames={fr(id)} bg={C.terra} zoom={[1, 1.03]}>
      <Defs />
      <rect width={W} height={H} fill={C.terra} />
      {Array.from({length: 18}).map((_, i) => <rect key={i} x={-200 + i * 140 + (t * 30) % 140} y={0} width={60} height={H} fill="#d2683c" opacity={0.35} transform="skewX(-20)" />)}
      <circle cx={560} cy={560} r={330} fill="#f0a35c" stroke={C.ink} strokeWidth={8} />
      <MJ x={560} y={900} s={1.25} t={t} pose="wave" talk={talkAt(id, t)} />
      <g transform={`translate(1310,420) scale(${pop(cue(id, 'name') - 1.6)})`}>
        <Title x={0} y={-90} size={150} fill={C.cream}>MJ SOUND</Title>
        <Title x={0} y={70} size={118} fill={C.fire2}>CHRONICLES</Title>
      </g>
      {Array.from({length: 22}).map((_, i) => {
        const h = 20 + Math.abs(Math.sin(t * 5 + i * 0.7)) * 90 * (0.4 + rnd(i) * 0.6);
        return <rect key={i} x={950 + i * 34} y={700 - h / 2} width={20} height={h} rx={10} fill={C.cream} stroke={C.ink} strokeWidth={4} opacity={prog(t, 0.6, 0.6)} />;
      })}
      <g opacity={prog(t, cue(id, 'tag'), 0.5)}>
        <text x={1310} y={850} fontFamily={FONT.hand} fontWeight={700} fontSize={78} textAnchor="middle" fill={C.cream} stroke={C.ink} strokeWidth={10} paintOrder="stroke">the stories behind the sounds</text>
      </g>
    </Stage>
  );
};

/* ===================== 3. FARMER 1928 ===================== */
const DaySea: React.FC<{t: number}> = ({t}) => (
  <g>
    <rect width={W} height={H} fill="url(#daySky)" />
    <circle cx={1620} cy={170} r={80} fill="#fff1b8" stroke={C.ink} strokeWidth={6} />
    {[0, 1, 2].map((i) => <g key={i} transform={`translate(${((i * 700 + t * 12) % 2300) - 200},${120 + i * 60})`}><path d="M 0 0 q 20 -40 60 -20 q 30 -40 80 -6 q 40 -6 36 26 Z" fill="#fff" stroke={C.ink} strokeWidth={5} /></g>)}
    <path d={`M 1150 520 L ${W} 520 L ${W} ${H} L 1150 ${H} Z`} fill="url(#seaG)" />
    <Waves y={600} t={t} /><Waves y={700} t={t * 0.8} o={0.6} />
  </g>
);
export const Farmer: React.FC = () => {
  const t = useT(); const pop = usePop(); const id = 'farmer'; const f = useCurrentFrame();
  const k = (n: string) => cue(id, n);
  const walk = clamp((t - k('farmer')) / (k('clunk') - k('farmer')));
  const fx = 640 + walk * 340;
  const shake = t > k('clunk') && t < k('clunk') + 0.5 ? Math.sin(f * 2.3) * 12 : 0;
  const city = prog(t, k('bigger'), 2.2);
  return (
    <Stage frames={fr(id)} zoom={[1, 1.07]} origin="55% 60%">
      <Defs />
      <g transform={`translate(${shake},0)`}>
        <DaySea t={t} />
        {/* the hill */}
        <path d="M 520 600 Q 820 380 1180 430 Q 1300 450 1380 600 Z" fill="#d6b77a" stroke={C.ink} strokeWidth={7} />
        {/* ghost city rising on the hill */}
        <g opacity={city} transform={`translate(0,${(1 - city) * 60})`}>
          {[[700, 520, 110, 90], [810, 470, 130, 120], [960, 450, 180, 160], [1110, 480, 120, 110], [1230, 540, 100, 80]].map(([x, y, w, h], i) => <House key={i} x={x} y={y} w={w} h={h} fill="#efdcae" win={2} />)}
        </g>
        <g opacity={prog(t, k('hill'), 0.5) * (1 - city)}><Tag x={950} y={380} text="Ras Shamra" s={pop(k('hill'))} /></g>
        {/* field */}
        <path d={`M 0 600 L 1420 600 L 1420 ${H} L 0 ${H} Z`} fill="#c9a064" stroke={C.ink} strokeWidth={7} />
        {Array.from({length: 9}).map((_, i) => <path key={i} d={`M 0 ${640 + i * 50} Q 700 ${630 + i * 52} 1420 ${640 + i * 50}`} stroke="#a77d45" strokeWidth={6} fill="none" />)}
        {/* plowed furrow behind farmer */}
        <path d={`M 560 840 L ${fx + 80} 840`} stroke="#6e4b25" strokeWidth={16} strokeLinecap="round" />
        {/* tomb */}
        {t > k('tomb') - 0.3 && (
          <g transform={`translate(1090,860) scale(${pop(k('tomb') - 0.3)})`}>
            <ellipse cx={0} cy={0} rx={120} ry={46} fill="#2a1b10" stroke={C.ink} strokeWidth={7} />
            <ellipse cx={0} cy={-10} rx={130} ry={60} fill="url(#glow)" opacity={0.5 + 0.2 * Math.sin(t * 4)} />
            {[0, 1, 2].map((i) => <rect key={i} x={-60 + i * 12} y={-14 + i * 12} width={120 - i * 24} height={10} fill="#8c7a62" stroke={C.ink} strokeWidth={3} />)}
          </g>
        )}
        <g opacity={prog(t, k('tomb'), 0.4)}><Tag x={1090} y={990} text="an ancient tomb!" s={pop(k('tomb') + 0.2)} rot={3} /></g>
        {/* plow + farmer */}
        <g transform={`translate(${fx},850)`}>
          <path d="M 70 0 L 150 -10 L 120 30 Z" fill="#6b4a2b" stroke={C.ink} strokeWidth={5} />
          <path d="M 110 0 L 40 -150" stroke="#6b4a2b" strokeWidth={10} strokeLinecap="round" />
          <Stick x={0} y={0} s={0.9} t={t} hat="scarf" walk={walk < 1 && walk > 0 ? 1.2 : 0} arms={[[100, -30], [110, -30]]} />
        </g>
        {t > k('clunk') - 0.05 && t < k('tomb') + 0.2 && <Burst x={1150} y={640} s={0.85 * pop(k('clunk') - 0.05, 8)} text="CLUNK!" />}
        {/* archaeologists */}
        {[0, 1, 2].map((i) => {
          const a = clamp((t - k('arch') - i * 0.3) / 2.2);
          return <Stick key={i} x={-120 + a * (560 + i * 120)} y={1000 - i * 30} s={0.75} t={t} hat="pith" walk={a > 0 && a < 1 ? 1.8 : 0} o={a > 0 ? 1 : 0} />;
        })}
        <Title x={960} y={240} size={150} fill={C.fire2} s={pop(k('name'))}>UGARIT</Title>
      </g>
      <g opacity={prog(t, k('year'), 0.4)}><Tag x={230} y={90} text="1928 · Syria" s={pop(k('year'))} size={60} /></g>
    </Stage>
  );
};

/* ===================== 4. THE CITY ===================== */
const Icon: React.FC<{kind: string; x: number; y: number; s: number}> = ({kind, x, y, s}) => (
  <g transform={`translate(${x},${y}) scale(${s})`}>
    <circle r={78} fill={C.cream} stroke={C.ink} strokeWidth={7} />
    {kind === 'tin' && <path d="M -46 18 L -24 -22 L 46 -22 L 24 18 Z" fill="#b8c2c8" stroke={C.ink} strokeWidth={6} strokeLinejoin="round" />}
    {kind === 'fish' && <g><path d="M -50 0 Q -10 -40 34 0 Q -10 40 -50 0 Z" fill="#6fb0c6" stroke={C.ink} strokeWidth={6} /><path d="M 30 0 L 56 -24 L 56 24 Z" fill="#6fb0c6" stroke={C.ink} strokeWidth={6} strokeLinejoin="round" /><circle cx={-28} cy={-6} r={5} fill={C.ink} /></g>}
    {kind === 'pot' && <path d="M -20 -50 L 20 -50 L 16 -36 Q 52 -10 30 40 L -30 40 Q -52 -10 -16 -36 Z" fill={C.terra} stroke={C.ink} strokeWidth={6} strokeLinejoin="round" />}
    {kind === 'wood' && <g>{[0, 1, 2].map((i) => <g key={i}><rect x={-50} y={-38 + i * 26} width={92} height={22} rx={11} fill="#a0703f" stroke={C.ink} strokeWidth={5} /><circle cx={46} cy={-27 + i * 26} r={11} fill="#d9a86a" stroke={C.ink} strokeWidth={5} /></g>)}</g>}
    <text y={118} fontFamily={FONT.hand} fontWeight={700} fontSize={50} textAnchor="middle" fill={C.ink}>{({tin: 'tin', fish: 'fish', pot: 'pottery', wood: 'timber'} as Record<string, string>)[kind]}</text>
  </g>
);
export const City: React.FC = () => {
  const t = useT(); const pop = usePop(); const id = 'city';
  const k = (n: string) => cue(id, n);
  const mapIn = prog(t, k('egypt') - 0.6, 0.6) * (1 - prog(t, k('clay') - 0.2, 0.5));
  const scribe = prog(t, k('clay') - 0.1, 0.6);
  const route = (a: number) => clamp((t - a) / 1.2);
  const pts = {u: [1270, 430], cy: [1000, 520], eg: [760, 745], hi: [960, 250]};
  return (
    <Stage frames={fr(id)} zoom={[1.03, 1]} origin="50% 50%">
      <Defs />
      <DaySea t={t} />
      <path d="M -20 1080 L -20 560 Q 300 360 700 380 Q 1000 400 1200 600 L 1260 1080 Z" fill="#d8bb80" stroke={C.ink} strokeWidth={7} />
      {/* palace */}
      <g transform="translate(560,430)">
        <rect x={-210} y={-160} width={420} height={160} fill="#efdcae" stroke={C.ink} strokeWidth={7} />
        <rect x={-230} y={-182} width={460} height={26} fill={C.clay} stroke={C.ink} strokeWidth={6} />
        {[0, 1, 2, 3, 4, 5].map((i) => <rect key={i} x={-180 + i * 70} y={-140} width={22} height={140} fill="#d9c08c" stroke={C.ink} strokeWidth={4} />)}
        <path d="M -30 0 L -30 -80 Q 0 -110 30 -80 L 30 0 Z" fill="#6b4a2b" stroke={C.ink} strokeWidth={5} />
      </g>
      {[[160, 640, 150, 120], [330, 600, 120, 100], [860, 560, 140, 120], [1010, 640, 130, 100], [240, 820, 170, 130], [480, 760, 150, 120], [700, 800, 160, 130], [920, 820, 150, 110], [1100, 860, 120, 100], [400, 990, 180, 140], [680, 1010, 170, 130], [960, 1020, 160, 120]].map(([x, y, w, h], i) => <House key={i} x={x} y={y} w={w} h={h} fill={i % 3 ? '#efdcae' : '#e6c98f'} />)}
      {/* harbor ships */}
      <Ship x={1450 + wob(t, 0.03, 120)} y={720} t={t} s={0.8} />
      <Ship x={1760 - ((t * 25) % 500)} y={640} t={t + 1} s={0.55} flip />
      <Ship x={1290 + ((t * 18) % 400)} y={900} t={t + 2} s={0.7} sail="#f3d9a0" />
      <Title x={960} y={130} size={96} s={pop(k('busy'))} o={1 - mapIn}>ONE OF THE BUSIEST PORTS</Title>
      <g opacity={1 - mapIn}><Tag x={1650} y={260} text="Ugarit · c. 1400 BC" s={pop(0.6)} /></g>
      {/* trade map */}
      {mapIn > 0 && (
        <g opacity={mapIn} transform={`translate(0,${(1 - mapIn) * 40})`}>
          <rect x={300} y={90} width={1320} height={900} rx={30} fill={C.paper} stroke={C.ink} strokeWidth={9} />
          <path d="M 330 460 Q 600 520 760 470 Q 900 430 1040 460 Q 1150 470 1200 420 L 1230 600 Q 1150 700 1000 740 Q 800 760 600 720 Q 450 700 330 700 Z" fill="#9fcfd5" stroke={C.ink} strokeWidth={6} />
          <path d="M 940 500 Q 1000 480 1060 505 Q 1030 540 950 535 Z" fill="#d8bb80" stroke={C.ink} strokeWidth={5} />
          <text x={620} y={655} fontFamily={FONT.hand} fontWeight={700} fontSize={46} fill={C.seaD} textAnchor="middle">Mediterranean Sea</text>
          {([['eg', 'egypt', 'EGYPT'], ['cy', 'cyprus', 'CYPRUS'], ['hi', 'hittite', 'HITTITES']] as const).map(([p, c, label]) => {
            const [x1, y1] = pts[p], [x2, y2] = pts.u, r = route(k(c));
            return (
              <g key={p} opacity={r > 0 ? 1 : 0}>
                <path d={`M ${x1} ${y1} L ${x1 + (x2 - x1) * r} ${y1 + (y2 - y1) * r}`} stroke={C.terra} strokeWidth={9} strokeDasharray="22 16" strokeLinecap="round" />
                <circle cx={x1} cy={y1} r={18} fill={C.terra} stroke={C.ink} strokeWidth={5} />
                <Title x={p === 'eg' ? x1 - 150 : x1} y={p === 'hi' ? y1 - 50 : p === 'eg' ? y1 : y1 + 54} size={44} s={pop(k(c))}>{label}</Title>
              </g>
            );
          })}
          <circle cx={pts.u[0]} cy={pts.u[1]} r={30 + Math.sin(t * 4) * 4} fill={C.gold} stroke={C.ink} strokeWidth={6} />
          <Title x={pts.u[0] + 150} y={pts.u[1] - 10} size={52} fill={C.fire2}>UGARIT</Title>
          <Icon kind="tin" x={600} y={850} s={0.75 * pop(k('tin'))} />
          <Icon kind="fish" x={840} y={850} s={0.75 * pop(k('fish') + 0.35)} />
          <Icon kind="pot" x={1080} y={850} s={0.75 * pop(k('pottery'))} />
          <Icon kind="wood" x={1320} y={850} s={0.75 * pop(k('timber'))} />
        </g>
      )}
      {/* scribe close-up */}
      {scribe > 0 && (
        <g opacity={scribe}>
          <rect width={W} height={H} fill="#3a2a1e" />
          <rect x={0} y={760} width={W} height={320} fill="#6b4a2b" stroke={C.ink} strokeWidth={8} />
          <Tablet x={1080} y={600} w={520} h={420} rot={-4} reveal={clamp((t - k('clay')) / 7)} cracks={false} seed={4} />
          {/* hand with reed */}
          {(() => {
            const n = Math.floor((t - k('clay')) * 3);
            const hx = 900 + (rnd(n) * 340), hy = 470 + rnd(n + 1) * 220 - (t * 3 % 1 < 0.5 ? 0 : 14);
            return (
              <g transform={`translate(${hx},${hy})`}>
                <path d="M 0 0 L 160 -170" stroke="#c9a65a" strokeWidth={16} strokeLinecap="round" />
                <path d="M 0 0 L 160 -170" stroke={C.ink} strokeWidth={4} strokeLinecap="round" strokeDasharray="2 30" />
                <circle cx={160} cy={-170} r={26} fill={C.cream} stroke={C.ink} strokeWidth={7} />
                <circle cx={0} cy={0} r={18 + ((t * 3) % 1) * 30} fill="none" stroke={C.fire2} strokeWidth={4} opacity={1 - ((t * 3) % 1)} />
              </g>
            );
          })()}
          <MJ x={300} y={1040} s={0.95} t={t} pose="point" talk={talkAt(id, t)} />
          <Title x={960} y={120} size={100} fill={C.fire2} s={pop(k('cune'))}>CUNEIFORM</Title>
          <g opacity={prog(t, k('cune') + 0.6, 0.4)}><Tag x={960} y={235} text="wedge-shaped writing" s={pop(k('cune') + 0.6)} /></g>
          <g opacity={prog(t, k('reed'), 0.4)}><Tag x={1500} y={930} text="pressed in with a reed" s={pop(k('reed'))} rot={4} /></g>
        </g>
      )}
      {scribe === 0 && <MJ x={150} y={1060} s={0.75} t={t} pose={t > k('busy') ? 'present' : 'idle'} talk={talkAt(id, t)} o={1 - mapIn} />}
    </Stage>
  );
};

/* ===================== 5. FIRE ===================== */
export const Fire: React.FC = () => {
  const t = useT(); const pop = usePop(); const id = 'fire';
  const k = (n: string) => cue(id, n);
  const burn = prog(t, k('year'), 4) * (1 - 0.0);
  const twist = prog(t, k('twist') - 0.3, 0.7);
  const melt = clamp((t - k('rain')) / ((k('mud') + 0.8) - k('rain')));
  const bake = clamp((t - k('baked')) / 2.5);
  return (
    <Stage frames={fr(id)} zoom={[1, 1.05]} bg="#140a0a">
      <Defs />
      <g opacity={1 - twist}>
        <rect width={W} height={H} fill="url(#fireSky)" />
        <ellipse cx={960} cy={900} rx={1200} ry={420} fill="url(#glow)" opacity={0.4 + 0.5 * burn} />
        {[[200, 860, 220, 200], [430, 820, 180, 260], [680, 880, 260, 220], [960, 800, 300, 330], [1240, 870, 240, 230], [1480, 840, 200, 260], [1720, 880, 240, 200]].map(([x, y, w, h], i) => (
          <g key={i}><House x={x} y={y + 120} w={w} h={h} dark /><g opacity={burn}><Flame x={x + (rnd(i) - 0.5) * w * 0.5} y={y + 120 - h} s={0.6 + rnd(i + 2) * 0.6 * burn} t={t} ph={i} /></g></g>
        ))}
        <rect x={0} y={1000} width={W} height={80} fill="#1a0d0a" />
        {/* embers */}
        {Array.from({length: 50}).map((_, i) => {
          const life = (t * (0.15 + rnd(i) * 0.2) + rnd(i + 4)) % 1;
          return <circle key={i} cx={rnd(i + 1) * W + wob(t, 0.3, 30, i)} cy={1000 - life * 900} r={3 + rnd(i) * 4} fill={C.fire2} opacity={(1 - life) * burn} />;
        })}
        <Title x={960} y={110} size={110} fill={C.fire2} s={pop(k('year') + 0.6)}>c. 1185 BC</Title>
        {(['drought', 'famine', 'raiders'] as const).map((w, i) => (
          <Title key={w} x={60} y={260 + i * 120} anchor="start" size={86} rot={-3} s={pop(k(w))} fill={i === 2 ? C.fire2 : C.cream}>{['DROUGHT.', 'FAMINE.', 'RAIDERS FROM THE SEA.'][i]}</Title>
        ))}
        {t > k('raiders') && [0, 1, 2].map((i) => <Ship key={i} x={2100 - clamp((t - k('raiders')) / 4) * (520 - i * 120) - i * 40} y={720 + i * 40} t={t + i} s={0.55} dark flip />)}
        <g opacity={prog(t, k('letters'), 0.4) * (1 - prog(t, k('burned') + 1.2, 0.5))}>
          <Tablet x={1500} y={330} w={260} h={300} rot={6} glow={0.4} s={pop(k('letters'))} seed={9} />
          <Tag x={1500} y={530} text="letters begging for help" s={pop(k('letters') + 0.3)} rot={4} />
        </g>
        <Title x={960} y={560} size={120} s={pop(k('burned') + 0.8)} fill={C.cream}>NEVER REBUILT</Title>
      </g>
      {twist > 0 && (
        <g opacity={twist}>
          <rect width={W} height={H} fill="#2a1c14" />
          <Title x={960} y={110} size={100} fill={C.fire2} s={pop(k('twist'))}>THE TWIST</Title>
          {/* left: rain */}
          <g opacity={prog(t, k('rain') - 0.2, 0.4)}>
            <rect x={90} y={200} width={840} height={780} rx={30} fill="#3c5a6e" stroke={C.ink} strokeWidth={8} />
            {Array.from({length: 40}).map((_, i) => { const yy = (rnd(i) * 700 + t * 700) % 700; return <path key={i} d={`M ${130 + rnd(i + 2) * 760} ${220 + yy} l -10 30`} stroke="#bfe3f0" strokeWidth={5} strokeLinecap="round" />; })}
            <ellipse cx={510} cy={870} rx={160 + melt * 160} ry={22 + melt * 20} fill="#6b4a2b" stroke={C.ink} strokeWidth={6} />
            <g transform={`translate(510,${870 - 170 * (1 - melt)}) scale(${1 + melt * 0.3},${Math.max(0.05, 1 - melt)})`}>
              <Tablet x={0} y={-170 + 170} w={260} h={340} cracks={false} seed={2} />
            </g>
            <Title x={510} y={280} size={70}>RAIN</Title>
            <g opacity={prog(t, k('mud'), 0.4)}><Tag x={510} y={940} text="...back to mud" s={pop(k('mud'))} /></g>
          </g>
          {/* right: fire */}
          <g opacity={prog(t, k('baked') - 0.3, 0.4)}>
            <rect x={990} y={200} width={840} height={780} rx={30} fill="#4a1a12" stroke={C.ink} strokeWidth={8} />
            {[0, 1, 2, 3, 4].map((i) => <Flame key={i} x={1130 + i * 140} y={960} s={0.8} t={t} ph={i * 1.3} />)}
            <Tablet x={1410} y={600} w={260} h={340} glow={0.3 + bake * 0.7} seed={3} />
            <Title x={1410} y={280} size={70}>FIRE</Title>
            <g opacity={bake}><Title x={1410} y={600} size={64} fill={C.fire2} rot={-8} s={pop(k('baked') + 1)}>BAKED HARD!</Title></g>
            <g opacity={prog(t, k('kiln'), 0.4)}><Tag x={1410} y={830} text="like pottery in a kiln" s={pop(k('kiln'))} /></g>
          </g>
          <g opacity={prog(t, k('disaster'), 0.5)}>
            <rect x={0} y={0} width={W} height={H} fill="rgba(20,10,6,.78)" />
            <Title x={960} y={430} size={96} fill={C.cream} s={pop(k('disaster'))}>THE FIRE THAT DESTROYED IT...</Title>
            <Title x={960} y={600} size={110} fill={C.fire2} s={pop(k('read') - 0.6)}>...IS WHY WE CAN READ IT</Title>
          </g>
        </g>
      )}
    </Stage>
  );
};
