import React from 'react';
import {Composition, Series, Still, AbsoluteFill} from 'remotion';
import {SCENES, W, H, C, Defs, MJ, Tablet, Title, Note, Grain} from './lib';
import {Hook, Intro, Farmer, City, Fire} from './scenes1';
import {Dig, TabletScene, LyreScene, Nikkal, Time, Mystery, Listen, Outro} from './scenes2';

const MAP: Record<string, React.FC> = {hook: Hook, intro: Intro, farmer: Farmer, city: City, fire: Fire, dig: Dig, tablet: TabletScene,
  lyre: LyreScene, nikkal: Nikkal, time: Time, mystery: Mystery, listen: Listen, outro: Outro};
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
      <rect width={W} height={H} fill="url(#darkBg)" />
      {Array.from({length: 16}).map((_, i) => {
        const a = (i / 16) * Math.PI * 2;
        return <path key={i} d={`M 1180 640 L ${1180 + Math.cos(a) * 1400} ${640 + Math.sin(a) * 1400} L ${1180 + Math.cos(a + 0.12) * 1400} ${640 + Math.sin(a + 0.12) * 1400} Z`} fill="#ffb347" opacity={0.08} />;
      })}
      <ellipse cx={1180} cy={640} rx={760} ry={560} fill="url(#glow)" opacity={0.9} />
      <Tablet x={1200} y={670} w={460} h={600} rot={8} glow={0.6} seed={6} />
      {[[880, 420, 1.6, true], [1000, 300, 1.3, false], [1480, 330, 1.5, true], [1580, 520, 1.2, false], [1360, 250, 1.0, false]].map(([x, y, s, d], i) => <Note key={i} x={x as number} y={y as number} s={s as number} double={d as boolean} />)}
      <MJ x={400} y={1240} s={2.0} t={0.5} pose="shock" />
      <Title x={960} y={150} size={180} fill="#fff" sw={32}>3,400 YEARS OLD</Title>
      <g transform="translate(1400,965) rotate(-3)">
        <rect x={-380} y={-72} width={760} height={144} fill={C.red} stroke="#fff" strokeWidth={8} />
        <text x={0} y={6} fontFamily="Archivo Black" fontSize={92} textAnchor="middle" dominantBaseline="middle" fill="#fff">OLDEST SONG</text>
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
