import React from 'react';
import {Composition, Series, Still, AbsoluteFill} from 'remotion';
import {SCENES, W, H, C, Defs, MJ, Title, Grain} from './lib';
import {Trumpet} from './art';
import {Hook, Intro, Tomb, Trumpets, Broadcast, War, Pattern, Heist, Truth, Listen, Outro} from './scenes';

const MAP: Record<string, React.FC> = {hook: Hook, intro: Intro, tomb: Tomb, trumpets: Trumpets, broadcast: Broadcast, war: War, pattern: Pattern,
  heist: Heist, truth: Truth, listen: Listen, outro: Outro};
const TOTAL = SCENES.reduce((a, s) => a + s.frames, 0);

const Main: React.FC = () => (
  <Series>
    {SCENES.map((s) => { const Comp = MAP[s.id]; return <Series.Sequence key={s.id} durationInFrames={s.frames}><Comp /></Series.Sequence>; })}
  </Series>
);

export const Thumb: React.FC = () => (
  <AbsoluteFill style={{background: '#120b08'}}>
    <svg width={1280} height={720} viewBox={`0 0 ${W} ${H}`}>
      <Defs />
      <rect width={W} height={H} fill="url(#fireSky)" />
      <ellipse cx={1200} cy={600} rx={800} ry={520} fill="url(#glow)" opacity={0.8} />
      <Trumpet x={1250} y={560} s={1.5} rot={-14} metal="silver" blow={1} t={0.3} />
      <MJ x={380} y={1240} s={2.0} t={0.5} pose="shock" />
      <Title x={960} y={150} size={170} fill="#fff" sw={30}>PLAY IT = WAR?</Title>
      <g transform="translate(1400,965) rotate(-3)">
        <rect x={-420} y={-72} width={840} height={144} fill={C.red} stroke="#fff" strokeWidth={8} />
        <text x={0} y={6} fontFamily="Archivo Black" fontSize={88} textAnchor="middle" dominantBaseline="middle" fill="#fff">CURSED TRUMPET</text>
      </g>
    </svg>
    <Grain o={0.1} />
  </AbsoluteFill>
);

export const Root: React.FC = () => (
  <>
    <Composition id="Main" component={Main} durationInFrames={TOTAL} fps={30} width={1920} height={1080} />
    {SCENES.map((s) => <Composition key={s.id} id={'S-' + s.id} component={MAP[s.id]} durationInFrames={s.frames} fps={30} width={1920} height={1080} />)}
    <Still id="Thumb" component={Thumb} width={1280} height={720} />
  </>
);
