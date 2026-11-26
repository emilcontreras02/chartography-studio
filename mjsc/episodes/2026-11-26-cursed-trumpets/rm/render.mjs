// node render.mjs stills "hook:12,city:20" | node render.mjs scene <id> | node render.mjs thumb
import {bundle} from '@remotion/bundler';
import {renderStill, renderMedia, selectComposition} from '@remotion/renderer';
import path from 'path'; import fs from 'fs';
const HS = '/opt/pw-browsers/chromium_headless_shell-1243/chrome-headless-shell-linux64/chrome-headless-shell';
const [mode, arg] = process.argv.slice(2);
const cache = '/tmp/mjsc-bundle-ct';
const serveUrl = await bundle({entryPoint: path.resolve('src/index.ts'), outDir: cache});
const opts = {serveUrl, browserExecutable: HS, chromiumOptions: {gl: 'swangle'}};
fs.mkdirSync('out', {recursive: true});
if (mode === 'stills') {
  for (const item of arg.split(',')) {
    const [id, sec] = item.split(':');
    const composition = await selectComposition({...opts, id: 'S-' + id});
    const frame = Math.min(composition.durationInFrames - 1, Math.round(parseFloat(sec) * 30));
    await renderStill({...opts, composition, frame, output: `out/still-${id}-${sec}.jpg`, imageFormat: 'jpeg', jpegQuality: 85});
    console.log('still', id, sec);
  }
} else if (mode === 'scene') {
  for (const id of arg.split(',')) {
    const composition = await selectComposition({...opts, id: 'S-' + id});
    const tmp = `out/scene-${id}.tmp.mp4`;
    await renderMedia({...opts, composition, codec: 'h264', crf: 18, x264Preset: 'veryfast', muted: true, outputLocation: tmp, concurrency: 2,
      onProgress: ({progress}) => { if (Math.round(progress * 100) % 25 === 0) process.stdout.write(`${id} ${Math.round(progress * 100)}%\r`); }});
    fs.renameSync(tmp, `out/scene-${id}.mp4`);
    console.log('scene done', id);
  }
} else if (mode === 'thumb') {
  const composition = await selectComposition({...opts, id: 'Thumb'});
  await renderStill({...opts, composition, output: 'out/thumbnail.png'});
  console.log('thumb');
}
