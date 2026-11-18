// node render.js spec.json outdir [fps] [stillTimes comma list]
const { chromium } = require('playwright');
const fs = require('fs'), path = require('path'), http = require('http');
const [spec, out, fpsArg, stills] = process.argv.slice(2);
const SPEC = JSON.parse(fs.readFileSync(spec, 'utf8'));
const fps = +(fpsArg || 30);
const root = __dirname;
const types = { '.html': 'text/html', '.js': 'text/javascript', '.png': 'image/png', '.json': 'application/json' };
const srv = http.createServer((q, r) => {
  const p = path.join(root, decodeURIComponent(q.url.split('?')[0]));
  if (!p.startsWith(root) || !fs.existsSync(p)) { r.writeHead(404); return r.end(); }
  r.writeHead(200, { 'Content-Type': types[path.extname(p)] || 'application/octet-stream' }); fs.createReadStream(p).pipe(r);
}).listen(0, async () => {
  const port = srv.address().port;
  const browser = await chromium.launch({ args: ['--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'] });
  const RW = +(process.env.RW || 1080), RH = +(process.env.RH || 1920);
  const page = await browser.newPage({ viewport: { width: RW, height: RH }, deviceScaleFactor: 1 });
  page.on('console', m => { if (m.type() === 'error') console.error('page:', m.text()); });
  await page.goto(`http://127.0.0.1:${port}/index.html?w=${RW}&h=${RH}`);
  await page.waitForFunction('window.W3_READY === true');
  await page.evaluate(s => window.W3.build(s), SPEC);
  await page.waitForTimeout(1500); // textures
  fs.mkdirSync(out, { recursive: true });
  const times = stills ? stills.split(',').map(Number) : [...Array(Math.ceil(SPEC.duration * fps)).keys()].map(i => i / fps);
  const t0 = Date.now();
  for (let i = 0; i < times.length; i++) {
    const t = times[i];
    const st = {};
    for (const a of SPEC.actors || []) {
      let cur = a.track ? a.track[0] : {};
      for (const kf of a.track || []) if (t >= kf.t) cur = kf;
      st[a.name] = cur;
    }
    await page.evaluate(([t, st]) => window.W3.frame(t, st), [t, st]);
    if (i === 0) await page.waitForTimeout(300);
    const b64 = await page.evaluate(() => document.querySelector('canvas').toDataURL('image/jpeg', 0.9).split(',')[1]);
    fs.writeFileSync(path.join(out, stills ? `still_${String(i).padStart(2, '0')}.jpg` : `f${String(i).padStart(5, '0')}.jpg`), Buffer.from(b64, 'base64'));
    if (i % 30 === 0) console.log(`frame ${i}/${times.length} ${((Date.now() - t0) / (i + 1)).toFixed(0)} ms/frame`);
  }
  await browser.close(); srv.close();
});
