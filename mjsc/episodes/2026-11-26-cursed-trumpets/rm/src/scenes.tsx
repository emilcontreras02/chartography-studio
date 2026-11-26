import React from 'react';
import {useCurrentFrame} from 'remotion';
import {C, FONT, W, H, Stage, Defs, MJ, Stick, Title, Tag, Note, Burst, Mark, Flame, cue, useT, usePop, prog, clamp, wob, talkAt, rnd, sceneById} from './lib';
import {Trumpet, Radio, Mic, Desert, Candle, DateCard, Envelope, Museum, Globe, Bubble, Column, Plane, Mask, Chest, Wheel, Frieze, Car, Horse, Bag, Train, YearGrid} from './art';
import mcue from './music_cue.json';

const fr = (id: string) => sceneById(id).frames;
/** visible from cue a until cue b */
const useVis = (id: string) => {
  const t = useT();
  return (a: string, b?: string) => prog(t, cue(id, a) - 0.25, 0.35) * (b ? 1 - prog(t, cue(id, b) - 0.3, 0.3) : 1);
};
const Dust: React.FC<{t: number; n?: number; color?: string}> = ({t, n = 36, color = '#ffdca0'}) => (
  <g>{Array.from({length: n}).map((_, i) => {
    const x = (rnd(i) * W + t * (8 + rnd(i + 3) * 14)) % W, y = (rnd(i + 7) * H - t * (6 + rnd(i + 5) * 10) + H * 2) % H;
    return <circle key={i} cx={x} cy={y} r={1.5 + rnd(i + 2) * 3} fill={color} opacity={0.25 + 0.35 * Math.abs(Math.sin(t + i))} />;
  })}</g>
);
const Flash: React.FC<{t: number; at: number; color?: string}> = ({t, at, color = '#fff'}) => <rect width={W} height={H} fill={color} opacity={t > at ? Math.max(0, 0.7 - (t - at) * 2.5) : 0} />;

/* ===================== HOOK ===================== */
export const Hook: React.FC = () => {
  const t = useT(); const pop = usePop(); const id = 'hook'; const k = (n: string) => cue(id, n); const vis = useVis(id);
  const A = vis('year', 'trumpets'), B = vis('trumpets', 'less'), Cc = vis('less', 'curse'), D = vis('curse');
  const count = Math.round(150000000 * clamp((t - k('million') + 0.4) / 1.6));
  return (
    <Stage frames={fr(id)} bg="#0c1128" zoom={[1, 1.06]}>
      <Defs />
      <rect width={W} height={H} fill="url(#nightSky)" />
      <g opacity={A}>
        <Globe x={960} y={600} r={230} t={t} waves={prog(t, k('million'), 0.6)} spin={1} />
        {[[300, 940, 0.7], [620, 990, 0.6], [1300, 990, 0.6], [1620, 940, 0.7], [150, 700, 0.5], [1770, 700, 0.5]].map(([x, y, s], i) => (
          <g key={i} opacity={prog(t, k('million') + i * 0.12, 0.3)}><Radio x={x} y={y} s={s} on={1} t={t} waves={1} /></g>
        ))}
        <Title x={960} y={130} size={130} s={pop(k('year'))} fill={C.fire2}>APRIL 1939</Title>
        <g opacity={prog(t, k('million'), 0.3) * (1 - prog(t, k('heard') - 0.3, 0.3))}><Title x={960} y={280} size={78}>{count.toLocaleString('en-US')} LISTENERS</Title></g>
        <g opacity={prog(t, k('heard'), 0.3)}><Tag x={960} y={290} text="a sound silent for 3,000 years" s={pop(k('heard'))} size={64} /></g>
      </g>
      <g opacity={B}>
        <rect width={W} height={H} fill="url(#darkBg)" />
        <ellipse cx={960} cy={560} rx={760} ry={420} fill="url(#glow)" opacity={0.7} />
        <Dust t={t} />
        <Trumpet x={960} y={500} s={1.15 * pop(k('trumpets'))} rot={-14 + wob(t, 0.2, 2)} metal="silver" t={t} />
        <Trumpet x={960} y={640} s={1.05 * pop(k('trumpets') + 0.3)} rot={12 + wob(t, 0.2, 2, 1)} metal="bronze" t={t} />
        <Title x={960} y={140} size={110} s={pop(k('trumpets'))}>TWO TRUMPETS</Title>
        <g opacity={prog(t, k('tomb'), 0.3)}><Tag x={960} y={930} text="from the tomb of Tutankhamun" s={pop(k('tomb'))} size={64} /></g>
      </g>
      <g opacity={Cc}>
        <rect width={W} height={H} fill="url(#fireSky)" />
        <Plane x={((t * 160) % 2400) - 300} y={200} s={1.2} /><Plane x={((t * 160 + 500) % 2400) - 300} y={300} s={0.9} />
        <Column y={1000} t={t} o={prog(t, k('ww2'), 0.6)} />
        <DateCard x={1500} y={360} top="LESS THAN 5 MONTHS" big="SEPT 1939" s={pop(k('less')) * 0.95} />
        <g opacity={prog(t, k('ww2'), 0.2) * (1 - prog(t, k('whisper'), 0.4))}><Burst x={640} y={420} s={pop(k('ww2'))} text="WORLD WAR II" /></g>
        <g opacity={prog(t, k('whisper'), 0.4)}>
          <Trumpet x={640} y={460} s={0.9 * pop(k('every'))} rot={-8} metal="silver" blow={prog(t, k('every') + 0.5, 0.3)} t={t} />
          <g opacity={prog(t, k('whisper'), 0.4) * (1 - prog(t, k('every'), 0.3))}><Title x={640} y={460} size={64} font={FONT.hand} fill={C.cream}>people whisper...</Title></g>
          <Title x={700} y={760} size={110} fill={C.red} stroke="#fff" sw={14} s={pop(k('follows'))}>...A WAR FOLLOWS</Title>
        </g>
        <Flash t={t} at={k('follows')} color={C.red} />
      </g>
      <g opacity={D}>
        <rect width={W} height={H} fill="url(#darkBg)" />
        <g transform={`translate(560,430) scale(${pop(k('curse'))})`}>
          <rect x={-330} y={-200} width={660} height={400} rx={30} fill="#3a1414" stroke={C.ink} strokeWidth={9} />
          <path d="M -40 -150 L 40 -150 L 0 -40 L 60 -40 L -40 130 L -10 10 L -60 10 Z" fill={C.fire2} stroke={C.ink} strokeWidth={6} strokeLinejoin="round" />
          <Title x={0} y={150} size={92} fill={C.red} stroke="#fff" sw={10}>CURSE?</Title>
        </g>
        <Title x={960} y={430} size={80} s={pop(k('coinc') - 0.4)} fill={C.cream}>OR</Title>
        <g transform={`translate(1360,430) scale(${pop(k('coinc'))})`}>
          <rect x={-330} y={-200} width={660} height={400} rx={30} fill="#16324a" stroke={C.ink} strokeWidth={9} />
          {[[-70, -60], [70, -40]].map(([dx, dy], i) => (
            <g key={i} transform={`translate(${dx},${dy}) rotate(${i ? 14 : -10})`}>
              <rect x={-55} y={-55} width={110} height={110} rx={18} fill="#fff" stroke={C.ink} strokeWidth={6} />
              {(i ? [[-25, -25], [25, 25], [0, 0]] : [[-25, -25], [25, 25], [-25, 25], [25, -25]]).map(([a, b], j) => <circle key={j} cx={a} cy={b} r={10} fill={C.ink} />)}
            </g>
          ))}
          <Title x={0} y={150} size={76} fill={C.fire2}>COINCIDENCE?</Title>
        </g>
        <ellipse cx={-200 + 480 * prog(t, k('stick') - 0.2, 1.3)} cy={800} rx={230} ry={300} fill="#f0a35c" stroke={C.ink} strokeWidth={8} />
        <MJ x={-200 + 480 * prog(t, k('stick') - 0.2, 1.3)} y={1060} s={0.85} t={t} walk={t < k('stick') + 1.1 && t > k('stick') - 0.2 ? 1 : 0} pose={t > k('hear') ? 'point' : 'idle'} talk={talkAt(id, t)} />
        <g opacity={prog(t, k('hear'), 0.4)}><Title x={1200} y={920} size={76} fill={C.fire2}>...AND YOU'LL HEAR THEM</Title></g>
      </g>
    </Stage>
  );
};

/* ===================== INTRO ===================== */
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

/* ===================== TOMB 1922 ===================== */
export const Tomb: React.FC = () => {
  const t = useT(); const pop = usePop(); const id = 'tomb'; const k = (n: string) => cue(id, n); const vis = useVis(id);
  const A = vis('year', 'hole'), B = vis('hole', 'tut'), Cc = vis('tut');
  const steps = (t > k('step') ? 2 : 0) + (t > k('another') ? 3 : 0);
  const dig = Math.sin(t * 6) * 20;
  return (
    <Stage frames={fr(id)} bg="#1d1410" zoom={[1, 1.05]}>
      <Defs />
      <g opacity={A}>
        <Desert sky="url(#daySky)" pyr={false} cliffs />
        <DateCard x={330} y={230} top="VALLEY OF THE KINGS" big="NOV 1922" s={pop(k('year')) * 0.85} />
        {/* stairway cut into sand */}
        {Array.from({length: steps}).map((_, i) => <rect key={i} x={1060 + i * 26} y={820 + i * 34} width={340 - i * 52} height={34} fill={i % 2 ? '#a8763e' : '#c08a4a'} stroke={C.ink} strokeWidth={5} opacity={pop(k(i < 2 ? 'step' : 'another') + i * 0.08)} />)}
        <g opacity={prog(t, k('door'), 0.4)} transform={`translate(1230,${1000 - 30 * pop(k('door'))})`}>
          <rect x={-120} y={-200} width={240} height={200} fill="#8c6a42" stroke={C.ink} strokeWidth={8} />
          {[[-60, -150], [40, -120], [-30, -60], [60, -50]].map(([a, b], i) => <ellipse key={i} cx={a} cy={b} rx={26} ry={18} fill={C.terra} stroke={C.ink} strokeWidth={4} />)}
          <Tag x={0} y={-260} text="a sealed door" s={pop(k('door'))} />
        </g>
        <Stick x={760} y={930} s={1.25} t={t} hat="pith" arms={[[60 + dig * 0.5, 40], [80 + dig * 0.5, 20]]} />
        <path d={`M ${800 + dig} ${720} L ${880 + dig * 1.5} 930`} stroke="#6b4a2b" strokeWidth={12} strokeLinecap="round" />
        <g opacity={prog(t, k('carter'), 0.4)}><Tag x={760} y={560} text="Howard Carter" s={pop(k('carter'))} rot={3} /></g>
        <g opacity={prog(t, k('nothing'), 0.3) * (1 - prog(t, k('step'), 0.3))}><Title x={1300} y={500} size={80} s={pop(k('nothing'))}>YEARS OF... NOTHING</Title></g>
      </g>
      <g opacity={B}>
        <rect width={W} height={H} fill="#0e0907" />
        <rect x={360} y={140} width={1200} height={900} fill="#5a432c" stroke={C.ink} strokeWidth={10} />
        <circle cx={1060} cy={460} r={70 * pop(k('hole'))} fill="#000" stroke={C.ink} strokeWidth={6} />
        <circle cx={1060} cy={460} r={60 * prog(t, k('candle'), 0.8)} fill="url(#glow)" />
        <Candle x={980} y={560} s={0.8 * pop(k('candle'))} t={t} />
        <Stick x={760} y={1040} s={1.4} t={t} hat="pith" arms={[[30, 10], [100, 50]]} />
        <g opacity={prog(t, k('asks'), 0.3)}><Bubble x={600} y={240} w={700} text="Can you see anything?" s={pop(k('asks'))} size={46} fill="#e9e2d0" /></g>
        <g opacity={prog(t, k('yes'), 0.3)}><Bubble x={1300} y={780} w={760} text={t > k('wonderful') ? 'Yes... wonderful things!' : 'Yes...'} s={pop(k('yes'))} size={50} tail="l" /></g>
      </g>
      <g opacity={Cc}>
        <rect width={W} height={H} fill="#2a1a0c" />
        <ellipse cx={960} cy={560} rx={900} ry={520} fill="url(#glow)" opacity={0.8} />
        <Dust t={t} color="#ffd27a" />
        <Chest x={360} y={900} s={1.2 * pop(k('gold'))} /><Wheel x={1590} y={780} s={1.2 * pop(k('gold') + 0.3)} /><Chest x={1560} y={1000} s={0.9 * pop(k('gold') + 0.5)} />
        <Mask x={960} y={500} s={1.1 * pop(k('mask') - 0.6)} />
        <Title x={960} y={110} size={96} s={pop(k('tut'))} fill={C.fire2}>TUTANKHAMUN'S TOMB</Title>
        <g opacity={prog(t, k('untouched'), 0.3) * (1 - prog(t, k('trumpets') - 0.8, 0.3))}><Tag x={420} y={300} text="almost untouched" s={pop(k('untouched'))} /></g>
        <g opacity={prog(t, k('objects'), 0.3) * (1 - prog(t, k('trumpets') - 0.8, 0.3))}><Tag x={1500} y={300} text="5,000+ objects" s={pop(k('objects'))} rot={4} /></g>
        <g opacity={prog(t, k('trumpets') - 0.6, 0.5)}>
          <rect width={W} height={H} fill="#000" opacity={0.55} />
          <Trumpet x={960} y={620} s={0.9 * pop(k('trumpets'))} rot={-6} metal="silver" glow={0.6} t={t} />
          <Trumpet x={960} y={820} s={0.85 * pop(k('trumpets') + 0.25)} rot={4} metal="bronze" t={t} />
          <Title x={960} y={380} size={100} s={pop(k('trumpets'))} fill={C.fire2}>...AND TWO TRUMPETS</Title>
        </g>
      </g>
    </Stage>
  );
};

/* ===================== THE TRUMPETS ===================== */
export const Trumpets: React.FC = () => {
  const t = useT(); const pop = usePop(); const id = 'trumpets'; const k = (n: string) => cue(id, n); const vis = useVis(id);
  const A = vis('silver', 'names'), B = vis('names', 'party'), Cc = vis('party');
  const core = prog(t, k('core'), 1.2);
  return (
    <Stage frames={fr(id)} bg={C.sand} zoom={[1, 1.04]}>
      <Defs />
      <rect width={W} height={H} fill={C.paper} />
      {Array.from({length: 14}).map((_, i) => <path key={i} d={`M 0 ${i * 80} L ${W} ${i * 80 + 30}`} stroke={C.sand2} strokeWidth={3} opacity={0.5} />)}
      <g opacity={A}>
        <Trumpet x={1000} y={330} s={pop(k('silver'))} metal="silver" core={t > k('core') - 0.2 ? core : -1} t={t} />
        <Trumpet x={1000} y={700} s={0.92 * pop(k('bronze'))} metal="bronze" t={t} />
        <Title x={330} y={330} size={84} s={pop(k('silver'))} fill="#dfe3e6">SILVER</Title>
        <g transform={`translate(330,700) scale(${pop(k('bronze'))})`}><Title x={0} y={-20} size={80} fill="#e0a060">BRONZE</Title><Title x={0} y={60} size={42} fill={C.cream}>OR COPPER</Title></g>
        <g opacity={prog(t, k('arm'), 0.3) * (1 - prog(t, k('core') - 0.3, 0.3))}>
          <path d="M 680 900 L 1330 900" stroke={C.ink} strokeWidth={8} /><path d="M 680 870 l 0 60 M 1330 870 l 0 60" stroke={C.ink} strokeWidth={8} />
          <Tag x={1005} y={980} text="about 57 cm (22 inches)" s={pop(k('arm'))} />
        </g>
        <g opacity={prog(t, k('core'), 0.4)}><Tag x={560} y={520} text="a wooden core, to keep its shape" s={pop(k('core') + 0.6)} rot={3} /></g>
      </g>
      <g opacity={B}>
        <rect width={W} height={H} fill="#2a1d14" />
        <ellipse cx={960} cy={560} rx={760} ry={420} fill="url(#glow)" opacity={0.5} />
        <Trumpet x={760} y={560} s={2.4} metal="silver" t={t} />
        <Title x={960} y={110} size={84} s={pop(k('names'))}>ENGRAVED WITH THE KING'S NAMES</Title>
        {(['AMUN', 'RA', 'PTAH'] as const).map((g, i) => (
          <g key={g} transform={`translate(${520 + i * 440},880) scale(${pop(k('gods') + 0.5 + i * 0.45)})`}>
            <circle r={88} fill={C.gold} stroke={C.ink} strokeWidth={7} />
            {i === 1 ? <circle r={44} fill={C.red} stroke={C.ink} strokeWidth={6} /> : <Stick x={0} y={70} s={0.5} t={t} hat={i === 0 ? 'crown' : 'helmet'} />}
            <Title x={0} y={130} size={52} fill={C.fire2}>{g}</Title>
          </g>
        ))}
      </g>
      <g opacity={Cc}>
        <rect width={W} height={H} fill="#e2c086" />
        <g opacity={1 - prog(t, k('paint') - 0.3, 0.3)} transform={`translate(960,520) scale(${pop(k('party'))})`}>
          <path d="M -120 120 L 0 -160 L 120 120 Z" fill={C.blue} stroke={C.ink} strokeWidth={8} />
          {[0, 1, 2].map((i) => <circle key={i} cx={-50 + i * 50} cy={60 - i * 60} r={16} fill={C.fire2} stroke={C.ink} strokeWidth={4} />)}
          <Mark x={160} y={-120} s={1} />
          <Title x={0} y={250} size={84}>NOT PARTY INSTRUMENTS</Title>
        </g>
        <g opacity={prog(t, k('paint') - 0.2, 0.4)}>
          <Frieze x={960} y={500} t={t} o={1} />
          <g opacity={prog(t, k('soldiers'), 0.3)}><Tag x={500} y={180} text="trumpets + soldiers" s={pop(k('soldiers'))} /></g>
          <g opacity={prog(t, k('signals'), 0.3)}><Title x={1350} y={180} size={90} fill={C.red} stroke="#fff" sw={12} s={pop(k('signals'))}>TA-TA-TAAA!</Title></g>
          <g opacity={prog(t, k('army'), 0.3)}><Tag x={960} y={800} text="the signal to move" s={pop(k('army'))} rot={2} /></g>
          <g opacity={prog(t, k('war'), 0.3)}><rect width={W} height={H} fill="#000" opacity={0.45} /><Title x={960} y={540} size={130} fill={C.fire2} s={pop(k('war'))}>INSTRUMENTS OF WAR</Title></g>
        </g>
      </g>
    </Stage>
  );
};

/* ===================== THE 1939 BROADCAST ===================== */
export const Broadcast: React.FC = () => {
  const t = useT(); const pop = usePop(); const id = 'broadcast'; const k = (n: string) => cue(id, n); const vis = useVis(id);
  const A = vis('year', 'keating'), B = vis('keating', 'wrong'), Cc = vis('wrong', 'date'), D = vis('date');
  const dark = prog(t, k('power') + 0.3, 0.2);
  return (
    <Stage frames={fr(id)} bg="#141c34" zoom={[1, 1.05]}>
      <Defs />
      <g opacity={A}>
        <rect width={W} height={H} fill="url(#nightSky)" />
        <g opacity={1 - prog(t, k('permission') - 0.3, 0.3)}>
          <Mic x={420} y={1000} s={1.25 * pop(k('bbc'))} />
          <Globe x={1220} y={560} r={250} t={t} waves={prog(t, k('world'), 0.5)} spin={1} />
          <Title x={960} y={110} size={110} s={pop(k('year'))} fill={C.fire2}>1939</Title>
          <g opacity={prog(t, k('world') - 0.4, 0.3)}><Tag x={1220} y={940} text="live, to the whole world" s={pop(k('world') - 0.4)} /></g>
        </g>
        <g opacity={prog(t, k('permission') - 0.3, 0.3)}>
          <Museum x={960} y={950} s={1.2} />
          <g transform={`translate(1500,330) rotate(6) scale(${pop(k('permission'))})`}>
            <rect x={-200} y={-150} width={400} height={300} fill={C.cream} stroke={C.ink} strokeWidth={7} />
            {[0, 1, 2, 3].map((i) => <path key={i} d={`M -150 ${-90 + i * 45} L ${140 - (i % 2) * 70} ${-90 + i * 45}`} stroke={C.stoneD} strokeWidth={8} strokeLinecap="round" />)}
            <g opacity={prog(t, k('permission') + 1.4, 0.15)} transform={`rotate(-14) scale(${1.4 - 0.4 * prog(t, k('permission') + 1.4, 0.15)})`}>
              <rect x={-150} y={60} width={300} height={80} rx={10} fill="none" stroke={C.red} strokeWidth={9} />
              <text x={0} y={104} fontFamily={FONT.title} fontSize={52} fill={C.red} textAnchor="middle" dominantBaseline="middle">APPROVED</text>
            </g>
          </g>
          <Title x={700} y={200} size={80} s={pop(k('permission') - 0.2)}>MONTHS OF PAPERWORK</Title>
        </g>
      </g>
      <g opacity={B}>
        <rect width={W} height={H} fill="#3a2a44" />
        <ellipse cx={960} cy={700} rx={900} ry={360} fill="url(#softglow)" opacity={0.25} />
        <Stick x={600} y={980} s={1.6} t={t} arms={[[20, 10], [60, 70]]} />
        <Mic x={790} y={980} s={0.7} />
        <g opacity={prog(t, k('keating'), 0.3)}><Tag x={560} y={330} text="Rex Keating, presenter" s={pop(k('keating'))} /></g>
        <g opacity={prog(t, k('tappern') - 0.2, 0.4)}>
          <Stick x={1340} y={980} s={1.6} t={t} hat="helmet" arms={[[20, 10], [90, 0]]} color="#3a4a2a" />
          <Trumpet x={1530} y={605} s={0.5} rot={-8} metal="silver" t={t} />
          <Tag x={1380} y={330} text="James Tappern, army bandsman" s={pop(k('tappern'))} rot={3} />
        </g>
      </g>
      <g opacity={Cc}>
        <rect width={W} height={H} fill="#2a1d14" />
        <Title x={960} y={110} size={100} s={pop(k('wrong'))} fill={C.fire2}>THINGS START GOING WRONG</Title>
        <g transform={`translate(330,600) scale(${pop(k('shatter'))})`}>
          <rect x={-270} y={-230} width={540} height={460} rx={24} fill={C.paper} stroke={C.ink} strokeWidth={8} />
          <Trumpet x={0} y={-30} s={0.68} metal="silver" crack={prog(t, k('shatter') + 0.3, 0.2)} t={t} />
          <text x={0} y={170} fontFamily={FONT.hand} fontWeight={700} fontSize={52} textAnchor="middle" fill={C.ink}>it shatters in rehearsal</text>
        </g>
        <g opacity={prog(t, k('shatter') + 0.3, 0.1)}><Burst x={420} y={430} s={0.55} text="CRACK!" /></g>
        <g transform={`translate(960,600) scale(${pop(k('car'))})`}>
          <rect x={-270} y={-230} width={540} height={460} rx={24} fill={C.paper} stroke={C.ink} strokeWidth={8} />
          <g transform="scale(0.5)"><Car x={-140} y={150} shake={t > k('horse') + 0.5 ? wob(t, 6, 6) : 0} /><Horse x={330 - 120 * prog(t, k('horse'), 0.6)} y={150} t={t} s={0.8} /></g>
          <text x={0} y={170} fontFamily={FONT.hand} fontWeight={700} fontSize={52} textAnchor="middle" fill={C.ink}>runaway horse + carriage</text>
        </g>
        <g opacity={prog(t, k('horse') + 0.5, 0.1)}><Burst x={1060} y={430} s={0.55} text="CRASH!" /></g>
        <g transform={`translate(1590,600) scale(${pop(k('power'))})`}>
          <rect x={-270} y={-230} width={540} height={460} rx={24} fill={C.paper} stroke={C.ink} strokeWidth={8} />
          <circle cx={0} cy={-60} r={80} fill={t > k('power') + 0.6 ? '#555' : '#ffe08a'} stroke={C.ink} strokeWidth={7} />
          <rect x={-34} y={20} width={68} height={50} fill="#999" stroke={C.ink} strokeWidth={6} />
          <text x={0} y={170} fontFamily={FONT.hand} fontWeight={700} fontSize={52} textAnchor="middle" fill={C.ink}>the power goes out</text>
        </g>
        <rect width={W} height={H} fill="#000" opacity={dark * 0.9} />
        <Candle x={960} y={760} s={1.6 * pop(k('candle'))} t={t} o={prog(t, k('candle'), 0.3)} />
        <g opacity={prog(t, k('candle'), 0.3)}><Title x={960} y={300} size={110} fill={C.fire2}>BY CANDLELIGHT</Title></g>
      </g>
      <g opacity={D}>
        <rect width={W} height={H} fill="#140c08" />
        <Candle x={300} y={980} s={1.1} t={t} /><Candle x={1650} y={980} s={1.1} t={t} />
        <Stick x={820} y={1010} s={1.7} t={t} hat="helmet" arms={[[20, 10], [92, 0]]} color="#3a4a2a" />
        <Trumpet x={1060} y={615} s={0.62} rot={-6} metal="silver" blow={prog(t, k('date') + 2.5, 0.5)} t={t} />
        <Mic x={1500} y={1010} s={0.8} />
        <DateCard x={420} y={260} top="LIVE ON THE BBC" big="16 APR 1939" s={pop(k('date')) * 0.8} />
        <g opacity={prog(t, k('waves'), 0.5)}><Globe x={1500} y={260} r={130} t={t} waves={1} spin={1} /></g>
      </g>
    </Stage>
  );
};

/* ===================== WAR ===================== */
export const War: React.FC = () => {
  const t = useT(); const pop = usePop(); const id = 'war'; const k = (n: string) => cue(id, n); const vis = useVis(id);
  const A = vis('letters', 'sept'), B = vis('sept');
  return (
    <Stage frames={fr(id)} bg="#1d1410" zoom={[1, 1.06]}>
      <Defs />
      <g opacity={A}>
        <rect width={W} height={H} fill="url(#darkBg)" />
        {Array.from({length: 26}).map((_, i) => {
          const st = k('letters') + i * 0.12; const l = clamp((t - st) / 2.2);
          return t > st ? <Envelope key={i} x={80 + rnd(i) * 1760} y={-80 + l * (500 + rnd(i + 4) * 520)} rot={(rnd(i + 2) - 0.5) * 60 + l * 30} s={0.9} /> : null;
        })}
        <Title x={960} y={110} size={100} s={pop(k('letters'))}>LETTERS POUR IN</Title>
        <g opacity={prog(t, k('trumpets') - 0.3, 0.3)}><Bubble x={620} y={560} w={820} text={'"These are WAR trumpets!"'} s={pop(k('trumpets') - 0.3)} size={52} /></g>
        <g opacity={prog(t, k('curse') - 0.3, 0.3)}><Bubble x={1260} y={820} w={980} text={'"You released the curse of war!"'} s={pop(k('curse') - 0.3)} size={52} tail="r" fill="#f3d0c0" /></g>
      </g>
      <g opacity={B}>
        <rect width={W} height={H} fill="url(#fireSky)" />
        <Plane x={((t * 200) % 2600) - 300} y={180} s={1.3} /><Plane x={((t * 200 + 800) % 2600) - 300} y={280} s={1} /><Plane x={((t * 200 + 1500) % 2600) - 300} y={140} s={0.8} />
        <Column y={1020} t={t} />
        <DateCard x={420} y={330} top="GERMANY INVADES POLAND" big="1 SEPT 1939" s={pop(k('sept')) * 0.9} />
        <g opacity={prog(t, k('begins') - 0.4, 0.3)}><Title x={1300} y={420} size={110} fill={C.fire2} s={pop(k('begins') - 0.4)}>WORLD WAR II</Title></g>
        <g opacity={prog(t, k('deadliest'), 0.3)}><Tag x={1300} y={590} text="the deadliest war in history" s={pop(k('deadliest'))} size={60} /></g>
        <Flash t={t} at={k('begins') - 0.4} color={C.red} />
      </g>
    </Stage>
  );
};

/* ===================== THE PATTERN ===================== */
export const Pattern: React.FC = () => {
  const t = useT(); const pop = usePop(); const id = 'pattern'; const k = (n: string) => cue(id, n); const vis = useVis(id);
  const A = vis('curator', 'y67'), B = vis('y67');
  const nodes = [['1967', 'SIX-DAY WAR', 'y67', 'six'], ['1991', 'GULF WAR', 'y91', 'gulf'], ['2011', 'REVOLUTION', 'y11', 'rev']] as const;
  return (
    <Stage frames={fr(id)} bg="#2a1d14" zoom={[1, 1.04]}>
      <Defs />
      <g opacity={A}>
        <rect width={W} height={H} fill="#5a3a2c" />
        <rect x={0} y={760} width={W} height={320} fill="#3a2418" />
        {[200, 560, 1360, 1720].map((x) => <rect key={x} x={x - 50} y={80} width={100} height={680} fill="#7a5440" stroke={C.ink} strokeWidth={6} />)}
        <g transform="translate(960,700)">
          <rect x={-300} y={-60} width={600} height={60} fill="#2a1a10" stroke={C.ink} strokeWidth={6} />
          <rect x={-280} y={-280} width={560} height={220} fill="rgba(200,230,240,.25)" stroke={C.ink} strokeWidth={6} />
          <Trumpet x={0} y={-170} s={0.75} metal="bronze" t={t} />
        </g>
        <Stick x={520} y={1000} s={1.5} t={t} hat="scarf" arms={[[20, 10], [110, -20]]} />
        <g opacity={prog(t, k('hala'), 0.3)}><Tag x={520} y={420} text="Hala Hassan, curator" s={pop(k('hala'))} /></g>
        <g opacity={prog(t, k('blows') - 0.3, 0.3)}><Bubble x={1200} y={230} w={1100} text={t > k('blows') + 1.6 ? '"...a war occurs."' : '"Whenever someone blows into it..."'} s={pop(k('blows') - 0.3)} size={50} tail="l" /></g>
        <g opacity={prog(t, k('powers'), 0.3) * (1 - prog(t, k('blows') - 0.4, 0.3))}><Title x={1200} y={230} size={84} fill={C.fire2}>"MAGICAL POWERS"</Title></g>
      </g>
      <g opacity={B}>
        <rect width={W} height={H} fill="url(#darkBg)" />
        <path d="M 160 560 L 1760 560" stroke={C.cream} strokeWidth={12} strokeLinecap="round" />
        {nodes.map(([yr, label, a, b], i) => {
          const x = 380 + i * 580;
          return (
            <g key={yr} opacity={prog(t, k(a) - 0.2, 0.3)}>
              <circle cx={x} cy={560} r={30} fill={C.gold} stroke={C.ink} strokeWidth={7} />
              <Title x={x} y={460} size={100} s={pop(k(a))}>{yr}</Title>
              <Trumpet x={x - 10} y={340} s={0.3} metal="bronze" blow={1} t={t} />
              <g opacity={prog(t, k(b), 0.2)}><Burst x={x} y={720} s={0.55 * pop(k(b))} text={label} fill={C.fire2} /></g>
            </g>
          );
        })}
        <g opacity={prog(t, k('photo'), 0.3)}>
          <g transform={`translate(1540,250) scale(${pop(k('photo'))})`}>
            <rect x={-90} y={-60} width={180} height={120} rx={16} fill="#333" stroke={C.ink} strokeWidth={6} />
            <circle r={40} fill="#666" stroke={C.ink} strokeWidth={6} /><rect x={-60} y={-84} width={50} height={26} fill="#333" stroke={C.ink} strokeWidth={5} />
          </g>
        </g>
        <Flash t={t} at={k('photo') + 0.6} />
        <g opacity={prog(t, k('week'), 0.3)}><Tag x={1160} y={920} text="one week later..." s={pop(k('week'))} size={60} /></g>
      </g>
    </Stage>
  );
};

/* ===================== THE HEIST ===================== */
export const Heist: React.FC = () => {
  const t = useT(); const pop = usePop(); const id = 'heist'; const k = (n: string) => cue(id, n); const vis = useVis(id);
  const A = vis('weird', 'checked'), B = vis('checked', 'weeks'), Cc = vis('weeks');
  return (
    <Stage frames={fr(id)} bg="#0c1128" zoom={[1, 1.05]}>
      <Defs />
      <g opacity={A}>
        <rect width={W} height={H} fill="url(#nightSky)" />
        {Array.from({length: 40}).map((_, i) => <circle key={i} cx={rnd(i) * W} cy={rnd(i + 9) * 400} r={2 + rnd(i + 3) * 2} fill="#fff" opacity={0.5} />)}
        <Museum x={960} y={900} s={1.15} night />
        <rect x={0} y={900} width={W} height={180} fill="#1a1420" />
        {Array.from({length: 14}).map((_, i) => <Stick key={i} x={60 + i * 140} y={1060} s={0.6} t={t + i} color="#120c14" head="#2a2030" arms={[[150 + wob(t, 1, 10, i), 20], [20, 10]]} />)}
        <DateCard x={360} y={250} top="CAIRO · REVOLUTION" big="28 JAN 2011" s={pop(k('date')) * 0.8} />
        <g opacity={prog(t, k('thieves'), 0.4)}>
          {[0, 1].map((i) => <Stick key={i} x={1400 + i * 120 - 300 * prog(t, k('thieves'), 2.5)} y={780} s={0.8} t={t} walk={1.2} color="#05050a" head="#111" />)}
          <Tag x={1400} y={420} text="thieves break in" s={pop(k('thieves'))} />
        </g>
      </g>
      <g opacity={B}>
        <rect width={W} height={H} fill="#3a2a2a" />
        <g transform="translate(960,560)">
          <rect x={-480} y={160} width={960} height={90} fill="#2a1a10" stroke={C.ink} strokeWidth={7} />
          <rect x={-460} y={-200} width={920} height={360} fill="rgba(200,230,240,.18)" stroke={C.ink} strokeWidth={7} />
          <g opacity={1 - prog(t, k('missing'), 0.3)}><Trumpet x={0} y={0} s={0.9} metal="bronze" t={t} /></g>
          <g opacity={prog(t, k('missing'), 0.3)}><path d="M -290 -12 L 130 -16 Q 220 -28 300 -100 L 300 100 Q 220 28 130 16 L -290 12 Z" fill="none" stroke={C.cream} strokeWidth={6} strokeDasharray="20 16" /></g>
        </g>
        <Title x={960} y={130} size={90} s={pop(k('checked'))}>THE TUTANKHAMUN COLLECTION</Title>
        <g opacity={prog(t, k('missing'), 0.1)} transform={`translate(960,560) rotate(-12) scale(${1.4 - 0.4 * prog(t, k('missing'), 0.15)})`}>
          <rect x={-320} y={-80} width={640} height={160} rx={14} fill="none" stroke={C.red} strokeWidth={14} />
          <text x={0} y={8} fontFamily={FONT.title} fontSize={110} fill={C.red} textAnchor="middle" dominantBaseline="middle">MISSING</text>
        </g>
        <g opacity={prog(t, k('bronze'), 0.3)}><Tag x={960} y={950} text="the bronze trumpet" s={pop(k('bronze'))} /></g>
        <g opacity={prog(t, k('gone'), 0.2)}><Title x={1600} y={300} size={130} fill={C.fire2} s={pop(k('gone'))} rot={8}>GONE.</Title></g>
      </g>
      <g opacity={Cc}>
        <rect width={W} height={H} fill="#cfc6b4" />
        <g opacity={1 - prog(t, k('bag') - 0.4, 0.3)}>
          <Title x={960} y={120} size={90} s={pop(k('weeks'))}>WEEKS LATER, IT TURNS UP</Title>
          <g transform={`translate(560,560) scale(${pop(k('vault'))})`}>
            <rect x={-220} y={-200} width={440} height={400} rx={20} fill="#8a9299" stroke={C.ink} strokeWidth={9} />
            <circle r={110} fill="#6a7279" stroke={C.ink} strokeWidth={8} />{[0, 1, 2, 3].map((i) => <path key={i} d={`M 0 0 L ${Math.cos(i * 1.57) * 100} ${Math.sin(i * 1.57) * 100}`} stroke={C.ink} strokeWidth={10} />)}
            <Mark x={150} y={-150} s={0.8} /><Title x={0} y={270} size={60}>NOT A VAULT</Title>
          </g>
          <g transform={`translate(1360,560) scale(${pop(k('market'))})`}>
            <rect x={-220} y={-200} width={440} height={400} rx={20} fill="#222" stroke={C.ink} strokeWidth={9} />
            <text x={0} y={20} fontFamily={FONT.title} fontSize={220} fill="#4caf50" textAnchor="middle" dominantBaseline="middle">$</text>
            <Mark x={150} y={-150} s={0.8} /><Title x={0} y={270} size={60}>NOT THE BLACK MARKET</Title>
          </g>
        </g>
        <g opacity={prog(t, k('bag') - 0.4, 0.3)}>
          <rect width={W} height={H} fill="#8a8f94" />
          <rect x={0} y={760} width={W} height={320} fill="#b9b3a6" stroke={C.ink} strokeWidth={6} />
          <rect x={0} y={740} width={W} height={24} fill={C.gold} />
          <g transform={`translate(${960 - 2200 * prog(t, k('metro'), 2.6)},0)`}><Train x={960} y={740} /></g>
          <rect x={700} y={900} width={520} height={30} fill="#6b4a2b" stroke={C.ink} strokeWidth={6} />
          <Bag x={960} y={905} s={pop(k('bag'))} />
          <g transform={`translate(1010,770) rotate(-60)`} opacity={prog(t, k('bag') + 0.6, 0.3)}><Trumpet x={0} y={0} s={0.35} metal="bronze" t={t} /></g>
          <Title x={960} y={130} size={90} s={pop(k('metro'))} fill={C.fire2}>IN A BAG ON THE CAIRO METRO</Title>
          <g opacity={prog(t, k('nobody'), 0.3)}><Title x={960} y={300} size={150} s={pop(k('nobody'))}>???</Title></g>
        </g>
      </g>
    </Stage>
  );
};

/* ===================== THE TRUTH ===================== */
export const Truth: React.FC = () => {
  const t = useT(); const pop = usePop(); const id = 'truth'; const k = (n: string) => cue(id, n); const vis = useVis(id);
  const A = vis('q', 'europe'), B = vis('europe', 'century'), Cc = vis('century', 'egypt'), D = vis('egypt');
  const tl = [['MAR 1939', 'Germany takes Czechoslovakia', 'czech'], ['APR 1939', 'the trumpets are played', 'czech'], ['SEPT 1939', 'war', 'coming']] as const;
  return (
    <Stage frames={fr(id)} bg="#1d1410" zoom={[1, 1.04]}>
      <Defs />
      <g opacity={A}>
        <rect width={W} height={H} fill={C.terra} />
        <MJ x={560} y={1000} s={1.1} t={t} pose="think" talk={talkAt(id, t)} />
        <Title x={1220} y={420} size={110} s={pop(k('q'))}>IS IT REALLY</Title>
        <Title x={1220} y={570} size={130} s={pop(k('q') + 0.3)} fill={C.fire2}>CURSED?</Title>
      </g>
      <g opacity={B}>
        <rect width={W} height={H} fill="url(#darkBg)" />
        <Title x={960} y={120} size={70} s={pop(k('europe'))}>EUROPE WAS ALREADY SLIDING TO WAR</Title>
        <path d="M 200 560 L 1720 560" stroke={C.cream} strokeWidth={12} strokeLinecap="round" />
        {tl.map(([d, label, a], i) => {
          const x = 380 + i * 580, at = k(a) + (i === 1 ? 1.2 : 0);
          return (
            <g key={d} opacity={prog(t, at - 0.2, 0.3)}>
              <circle cx={x} cy={560} r={30} fill={i === 1 ? C.gold : C.red} stroke={C.ink} strokeWidth={7} />
              <Title x={x} y={460} size={76} s={pop(at)}>{d}</Title>
              <Tag x={x} y={680} text={label} s={pop(at + 0.2)} size={46} rot={i % 2 ? 3 : -3} fill={i === 1 ? '#f7e3a6' : C.paper} />
            </g>
          );
        })}
        <g opacity={prog(t, k('coming') + 0.6, 0.3)}><Title x={960} y={900} size={80} fill={C.fire2}>TRUMPET OR NO TRUMPET</Title></g>
      </g>
      <g opacity={Cc}>
        <rect width={W} height={H} fill="#22161a" />
        <YearGrid x={620} y={170} reveal={clamp((t - k('century')) / 3)} />
        <Title x={960} y={90} size={76} s={pop(k('century'))}>THE 1900s: WARS ALMOST EVERY YEAR</Title>
        <g opacity={prog(t, k('any'), 0.3)}><Tag x={340} y={560} text="pick any date..." s={pop(k('any'))} /><Tag x={1600} y={560} text="...a war is close by" s={pop(k('any') + 1.2)} rot={4} /></g>
      </g>
      <g opacity={D}>
        <rect width={W} height={H} fill={C.paper} />
        <g opacity={1 - prog(t, k('love') - 0.3, 0.3)}>
          <Stick x={600} y={980} s={1.6} t={t} hat="pith" arms={[[20, 10], [130, -30]]} />
          <Tag x={600} y={420} text="Egyptologists" s={pop(k('egypt'))} />
          <g transform={`translate(1250,540) rotate(-10) scale(${1.4 - 0.4 * prog(t, k('egypt') + 1.4, 0.15)})`} opacity={prog(t, k('egypt') + 1.4, 0.1)}>
            <rect x={-330} y={-90} width={660} height={180} rx={16} fill="none" stroke={C.red} strokeWidth={14} />
            <text x={0} y={8} fontFamily={FONT.title} fontSize={110} fill={C.red} textAnchor="middle" dominantBaseline="middle">NO CURSE</text>
          </g>
        </g>
        <g opacity={prog(t, k('love') - 0.3, 0.3)}>
          <rect width={W} height={H} fill="#2a1d14" />
          <ellipse cx={1100} cy={560} rx={760} ry={420} fill="url(#glow)" opacity={0.5} />
          <Trumpet x={1150} y={540} s={1.2} rot={-8} metal="silver" blow={prog(t, k('announce'), 0.4)} t={t} />
          <ellipse cx={330} cy={760} rx={250} ry={330} fill="#f0a35c" stroke={C.ink} strokeWidth={8} />
          <MJ x={330} y={1020} s={0.95} t={t} pose={t > k('job') ? 'shrug' : 'present'} talk={talkAt(id, t)} />
          <g opacity={prog(t, k('announce'), 0.3) * (1 - prog(t, k('job') - 0.3, 0.3))}><Title x={1150} y={200} size={90} s={pop(k('announce'))} fill={C.fire2}>MADE TO ANNOUNCE WAR</Title></g>
          <g opacity={prog(t, k('job') - 0.3, 0.3)}><Title x={1150} y={200} size={100} s={pop(k('job') - 0.3)} fill={C.fire2}>JUST DOING THEIR JOB?</Title></g>
          <g opacity={prog(t, k('story'), 0.3)}><Tag x={1150} y={880} text="3,000 years later... still the story" s={pop(k('story'))} /></g>
        </g>
      </g>
    </Stage>
  );
};

/* ===================== LISTEN ===================== */
const NOTES = (mcue as any).notes as [number, number, number][];
const L_START = (mcue as any).listen_scene_start as number;
export const Listen: React.FC = () => {
  const t = useT(); const pop = usePop(); const id = 'listen'; const k = (n: string) => cue(id, n);
  const gt = L_START + t; // global seconds
  const playing = gt > (mcue as any).listen_music_start - 0.4;
  let cur = -1, amp = 0;
  for (const [at, d, n] of NOTES) if (gt >= at && gt < at + d + 0.15) { cur = n; amp = Math.min(1, (gt - at) / 0.05) * (gt < at + d ? 1 : 0.4); }
  const P = prog(t, k('listen') + 0.4, 0.6);
  return (
    <Stage frames={fr(id)} bg="#120b08" zoom={[1, 1.05]} dip={14}>
      <Defs />
      <g opacity={1 - P}>
        <rect width={W} height={H} fill={C.terra} />
        <Trumpet x={1240} y={420} s={0.9} rot={-10} metal="silver" t={t} />
        <Trumpet x={1240} y={640} s={0.85} rot={6} metal="bronze" t={t} />
        <MJ x={450} y={1020} s={1.1} t={t} pose={t > k('case') ? 'shrug' : 'present'} talk={talkAt(id, t)} />
        <g opacity={prog(t, k('real'), 0.3)}><Tag x={1240} y={180} text={t > k('case') ? 'not the real one... just in case' : 'not the real one'} s={pop(k('real'))} size={60} /></g>
        <g opacity={prog(t, k('take'), 0.3)}><Title x={1180} y={880} size={74} s={pop(k('take'))} fill={C.fire2}>OUR OWN TAKE · A TRIBUTE</Title></g>
        <g opacity={prog(t, k('notes'), 0.3)}><Tag x={1240} y={1000} text="3 notes · in rhythm · like an army signal" s={pop(k('notes'))} size={50} rot={2} /></g>
      </g>
      <g opacity={P}>
        <rect width={W} height={H} fill="#140c08" />
        <ellipse cx={960} cy={540} rx={900} ry={500} fill="url(#glow)" opacity={0.25 + amp * 0.45} />
        <Dust t={t} color="#ffd27a" />
        <Trumpet x={860} y={560} s={1.45 + amp * 0.03} rot={-4} metal="silver" blow={playing ? amp : 0} t={t} glow={0.3} />
        {[0, 1, 2].map((n) => (
          <g key={n} transform={`translate(${760 + n * 200},900)`}>
            <circle r={52} fill={cur === n ? C.fire2 : '#3a2a20'} stroke={C.ink} strokeWidth={7} opacity={cur === n ? 1 : 0.7} />
            <text y={4} fontFamily={FONT.title} fontSize={40} textAnchor="middle" dominantBaseline="middle" fill={cur === n ? C.ink : C.cream}>{['LOW', 'MID', 'HIGH'][n]}</text>
          </g>
        ))}
        <Title x={960} y={130} size={100} fill={C.fire2}>LISTEN</Title>
        <text x={960} y={225} fontFamily={FONT.hand} fontWeight={700} fontSize={56} textAnchor="middle" fill={C.cream}>our recreation, not the original recording</text>
      </g>
    </Stage>
  );
};

/* ===================== OUTRO ===================== */
export const Outro: React.FC = () => {
  const t = useT(); const pop = usePop(); const id = 'outro'; const k = (n: string) => cue(id, n); const vis = useVis(id);
  const A = vis('two', 'think'), B = vis('think', 'sub'), S = vis('sub', 'next'), N = vis('next', 'mj'), E = vis('mj');
  return (
    <Stage frames={fr(id)} zoom={[1, 1.03]} bg="#1d1410" dip={14}>
      <Defs />
      <g opacity={A}>
        <rect width={W} height={H} fill="url(#darkBg)" />
        <Title x={960} y={220} size={100} s={pop(k('two'))} fill={C.fire2}>TWO TRUMPETS</Title>
        <Title x={960} y={400} size={90} s={pop(k('silence'))}>3,000 YEARS OF SILENCE</Title>
        <Title x={960} y={580} size={90} s={pop(k('radio'))}>ONE BROADCAST</Title>
        <Title x={960} y={780} size={96} s={pop(k('legend'))} fill={C.red} stroke="#fff" sw={12}>A LEGEND THAT WON'T DIE</Title>
      </g>
      <g opacity={B}>
        <rect width={W} height={H} fill={C.terra} />
        <MJ x={380} y={1020} s={1.05} t={t} pose="point" talk={talkAt(id, t)} />
        <g transform={`translate(1150,500) scale(${pop(k('think'))})`}>
          <rect x={-560} y={-300} width={1120} height={600} rx={36} fill={C.cream} stroke={C.ink} strokeWidth={9} />
          <text x={0} y={-200} fontFamily={FONT.title} fontSize={64} textAnchor="middle" fill={C.ink}>WHAT DO YOU THINK?</text>
          <g transform={`translate(-250,0) scale(${pop(k('curse'))})`}><rect x={-220} y={-80} width={440} height={160} rx={30} fill={C.red} stroke={C.ink} strokeWidth={8} /><text y={8} fontFamily={FONT.title} fontSize={70} textAnchor="middle" dominantBaseline="middle" fill="#fff">CURSE</text></g>
          <g transform={`translate(250,0) scale(${pop(k('curse') + 0.5)})`}><rect x={-220} y={-80} width={440} height={160} rx={30} fill={C.blue} stroke={C.ink} strokeWidth={8} /><text y={8} fontFamily={FONT.title} fontSize={52} textAnchor="middle" dominantBaseline="middle" fill="#fff">COINCIDENCE</text></g>
          <g opacity={prog(t, k('comments'), 0.3)}><text x={0} y={200} fontFamily={FONT.hand} fontWeight={700} fontSize={70} textAnchor="middle" fill={C.ink}>tell me in the comments!</text></g>
        </g>
      </g>
      <g opacity={S}>
        <rect width={W} height={H} fill={C.terra} />
        <circle cx={560} cy={560} r={330} fill="#f0a35c" stroke={C.ink} strokeWidth={8} />
        <MJ x={560} y={900} s={1.2} t={t} pose="point" talk={talkAt(id, t)} />
        <g transform={`translate(1300,520) scale(${pop(k('sub')) * (t > k('sub') + 0.5 && t < k('sub') + 0.7 ? 0.93 : 1)})`}>
          <rect x={-300} y={-80} width={600} height={160} rx={30} fill={t > k('sub') + 0.6 ? '#9a9a9a' : C.red} stroke={C.ink} strokeWidth={9} />
          <text y={8} fontFamily={FONT.title} fontSize={72} textAnchor="middle" dominantBaseline="middle" fill="#fff">{t > k('sub') + 0.6 ? 'SUBSCRIBED' : 'SUBSCRIBE'}</text>
        </g>
      </g>
      <g opacity={N}>
        <rect width={W} height={H} fill="#16102a" />
        {Array.from({length: 10}).map((_, i) => { const l = (t * 0.3 + i / 10) % 1; return <Title key={i} x={200 + rnd(i) * 1500} y={1000 - l * 900} size={60 + rnd(i + 2) * 50} fill={C.fire2} o={Math.sin(l * Math.PI)}>?</Title>; })}
        <g transform="translate(960,600)">
          <rect x={-300} y={-180} width={600} height={360} rx={30} fill="#333" stroke={C.ink} strokeWidth={9} />
          <rect x={-240} y={-130} width={480} height={150} rx={14} fill={C.cream} stroke={C.ink} strokeWidth={6} />
          <text y={-56} fontFamily={FONT.hand} fontWeight={700} fontSize={64} textAnchor="middle" fill={C.ink}>???</text>
          {[-120, 120].map((cx) => <g key={cx}><circle cx={cx} cy={100} r={52} fill={C.cream} stroke={C.ink} strokeWidth={6} /><circle cx={cx} cy={100} r={18} fill="#333" transform={`rotate(${t * 200} ${cx} 100)`} /></g>)}
        </g>
        <Title x={960} y={120} size={72} fill={C.cream} s={pop(k('next'))}>NEXT ON MJ SOUND CHRONICLES</Title>
        <Title x={960} y={260} size={84} fill={C.fire2} s={pop(k('song'))}>THE SONG THE INTERNET</Title>
        <Title x={960} y={950} size={84} fill={C.fire2} s={pop(k('years'))}>SEARCHED FOR 17 YEARS</Title>
      </g>
      <g opacity={E}>
        <rect width={W} height={H} fill={C.terra} />
        <circle cx={560} cy={560} r={330} fill="#f0a35c" stroke={C.ink} strokeWidth={8} />
        <MJ x={560} y={900} s={1.2} t={t} pose="wave" talk={talkAt(id, t)} />
        <Title x={1300} y={440} size={120} fill={C.cream} s={pop(k('mj'))}>MJ SOUND</Title>
        <Title x={1300} y={580} size={96} fill={C.fire2} s={pop(k('mj') + 0.2)}>CHRONICLES</Title>
        <Title x={1300} y={760} size={48} fill={C.cream} s={pop(k('end'))}>SEE YOU IN THE NEXT CHRONICLE</Title>
      </g>
    </Stage>
  );
};
