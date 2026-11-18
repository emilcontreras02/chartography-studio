// Why rails had gaps - the 3D set (HyperFrames, seek protocol). Every frame is a pure function of t.
// The world: a desert plateau on a canyon edge. Boss's track (x = 0) has a gap every 12 m (one 39-ft rail);
// his track (x = 7) has none. Winter until 15.0 s, July after. The 2D mascot (hero.py sprites) is a billboard.
import * as THREE from './lib/three.module.js';

const W = 1080, H = 1920;
const canvas = document.getElementById('world');
const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, preserveDrawingBuffer: true });
renderer.setSize(W, H, false);
renderer.setPixelRatio(1);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.outputColorSpace = THREE.SRGBColorSpace;

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(42, W / H, 0.03, 4000);

// ---------- helpers ----------
const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
const prog = (t, t0, d) => clamp((t - t0) / d, 0, 1);
const ease = (k) => k * k * (3 - 2 * k);
const lerp = (a, b, k) => a + (b - a) * k;
function hash(i) { const x = Math.sin(i * 127.1 + 311.7) * 43758.5453; return x - Math.floor(x); }
function noise(x, z) { return Math.sin(x * 0.11 + z * 0.07) * 0.5 + Math.sin(x * 0.31 - z * 0.23) * 0.25 + Math.sin(x * 0.9 + z * 0.77) * 0.12; }
function speckle(base, spots, n, size, seed) {
  const c = document.createElement('canvas'); c.width = c.height = size;
  const g = c.getContext('2d'); g.fillStyle = base; g.fillRect(0, 0, size, size);
  for (let i = 0; i < n; i++) {
    g.fillStyle = spots[Math.floor(hash(seed + i * 3) * spots.length)];
    g.beginPath(); g.arc(hash(seed + i * 3 + 1) * size, hash(seed + i * 3 + 2) * size, 0.8 + hash(i + seed) * 2.6, 0, 7); g.fill();
  }
  const t = new THREE.CanvasTexture(c); t.wrapS = t.wrapT = THREE.RepeatWrapping; t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 8;
  return t;
}
const STRATA = [[0.78, 0.36, 0.22], [0.86, 0.50, 0.30], [0.70, 0.30, 0.20], [0.92, 0.62, 0.40], [0.62, 0.26, 0.18], [0.84, 0.44, 0.26]];
function rock(w, h, d, seg, seed, rough) {
  const g = new THREE.BoxGeometry(w, h, d, seg, Math.max(4, Math.round(h / 1.5)), seg);
  const p = g.attributes.position, cols = [];
  for (let i = 0; i < p.count; i++) {
    let x = p.getX(i), y = p.getY(i), z = p.getZ(i);
    const top = y > h / 2 - 0.01;
    if (!top) {
      const n = noise(x + seed * 13, z + y * 1.7 + seed * 7) * rough + Math.sin(y * 0.9 + seed) * rough * 0.35;
      if (Math.abs(x) > w / 2 - 0.01) x += Math.sign(x) * n;
      if (Math.abs(z) > d / 2 - 0.01) z += Math.sign(z) * n;
    }
    p.setXYZ(i, x, y, z);
    const yy = y + h / 2;
    const c = top ? [0.80, 0.52, 0.34] : STRATA[Math.floor(yy * 0.11 + Math.sin(yy * 0.05 + seed) * 0.6 + seed + 1000) % STRATA.length];
    cols.push(...c);
  }
  g.setAttribute('color', new THREE.Float32BufferAttribute(cols, 3));
  g.computeVertexNormals();
  const m = new THREE.Mesh(g, new THREE.MeshStandardMaterial({ vertexColors: true, roughness: 0.95, flatShading: true }));
  m.castShadow = true; m.receiveShadow = true;
  return m;
}

// ---------- sky, light, weather ----------
const skyMat = new THREE.ShaderMaterial({
  side: THREE.BackSide, depthWrite: false, fog: false,
  uniforms: { top: { value: new THREE.Color() }, hor: { value: new THREE.Color() } },
  vertexShader: 'varying vec3 vp; void main(){ vp = normalize(position); gl_Position = projectionMatrix*modelViewMatrix*vec4(position,1.0); }',
  fragmentShader: 'uniform vec3 top; uniform vec3 hor; varying vec3 vp; void main(){ float k = pow(clamp(vp.y,0.0,1.0),0.5); gl_FragColor = vec4(mix(hor, top, k),1.0); }',
});
scene.add(new THREE.Mesh(new THREE.SphereGeometry(3000, 32, 16), skyMat));
scene.fog = new THREE.Fog(0xffffff, 140, 1100);
const hemi = new THREE.HemisphereLight(0xbfdcff, 0x8a5a3a, 0.9); scene.add(hemi);
const sun = new THREE.DirectionalLight(0xffffff, 2.6);
sun.castShadow = true; sun.shadow.mapSize.set(4096, 4096);
Object.assign(sun.shadow.camera, { left: -40, right: 40, top: 40, bottom: -40, near: 1, far: 320 });
sun.shadow.bias = -0.0004;
scene.add(sun, sun.target);
const sunDisc = new THREE.Mesh(new THREE.CircleGeometry(60, 48), new THREE.MeshBasicMaterial({ color: 0xfff1b8, fog: false, transparent: true }));
scene.add(sunDisc);
const glow = new THREE.Mesh(new THREE.CircleGeometry(160, 48), new THREE.MeshBasicMaterial({ color: 0xffd27a, fog: false, transparent: true, opacity: 0.25 }));
scene.add(glow);
// clouds
const cloudMat = new THREE.MeshLambertMaterial({ color: 0xffffff, fog: false, emissive: 0x777777 });
for (let i = 0; i < 16; i++) {
  const cl = new THREE.Group();
  for (let j = 0; j < 5; j++) {
    const b = new THREE.Mesh(new THREE.SphereGeometry(20 + (j % 3) * 8, 14, 10), cloudMat);
    b.position.set(j * 24 - 48, (j % 2) * 7, (j % 3) * 9); b.scale.y = 0.42; cl.add(b);
  }
  const a = i / 16 * Math.PI * 2 + 0.3;
  cl.position.set(Math.cos(a) * 1000, 300 + (i % 4) * 70, Math.sin(a) * 1000); cl.lookAt(0, cl.position.y, 0);
  scene.add(cl);
}
// snow: seeded flakes that fall as a function of t
const NS = 4200;
const snowGeo = new THREE.BufferGeometry();
const snowBase = new Float32Array(NS * 3);
for (let i = 0; i < NS; i++) { snowBase[i * 3] = hash(i) * 80 - 30; snowBase[i * 3 + 1] = hash(i + 9000) * 30; snowBase[i * 3 + 2] = hash(i + 19000) * 80 - 60; }
snowGeo.setAttribute('position', new THREE.BufferAttribute(new Float32Array(NS * 3), 3));
const snow = new THREE.Points(snowGeo, new THREE.PointsMaterial({ color: 0xffffff, size: 0.16, transparent: true, opacity: 0.95 }));
scene.add(snow);

// ---------- ground ----------
const plateau = rock(260, 100, 900, 160, 1, 1.4); plateau.position.set(-7 + 130, -50.1, -300); scene.add(plateau);
const floor = new THREE.Mesh(new THREE.PlaneGeometry(4000, 4000), new THREE.MeshStandardMaterial({ color: 0x9a5a36, roughness: 1 }));
floor.rotation.x = -Math.PI / 2; floor.position.y = -95; floor.receiveShadow = true; scene.add(floor);
const far = rock(120, 110, 1100, 120, 3, 4); far.position.set(-140, -36, -350); scene.add(far);
for (const [x, z, w, h, s] of [[-300, -700, 160, 150, 7], [220, -900, 200, 120, 9], [-60, -1150, 260, 170, 11], [420, -520, 120, 90, 13]]) {
  const m = rock(w, h, w * 0.8, 10, s, 6); m.position.set(x, -95 + h / 2, z); scene.add(m);
}
const sandMat = new THREE.MeshStandardMaterial({ map: speckle('#c99a6a', ['#b98a5e', '#d4a878', '#ad7f56', '#dcb68c'], 26000, 1024, 5), roughness: 1 });
sandMat.map.repeat.set(40, 150);
const sandTex = sandMat.map;
const snowTex = speckle('#eef2f7', ['#dfe6ef', '#ffffff', '#cdd7e3', '#f7f9fc'], 20000, 1024, 15); snowTex.repeat.set(40, 150);
const sand = new THREE.Mesh(new THREE.PlaneGeometry(252, 900), sandMat);
sand.rotation.x = -Math.PI / 2; sand.position.set(-6 + 126, 0.02, -300); sand.receiveShadow = true; scene.add(sand);
// a few desert rocks and shrubs near the tracks for depth
const shrubMat = new THREE.MeshStandardMaterial({ color: 0x6f7a3a, roughness: 1, flatShading: true });
const pebMat = new THREE.MeshStandardMaterial({ color: 0x9b6b4a, roughness: 1, flatShading: true });
for (let i = 0; i < 70; i++) {
  const x = 10 + hash(i + 50) * 60, z = 30 - hash(i + 80) * 200;
  const s = 0.3 + hash(i + 120) * 0.9;
  const m = new THREE.Mesh(i % 3 ? new THREE.DodecahedronGeometry(s, 0) : new THREE.IcosahedronGeometry(s * 0.8, 0), i % 3 ? pebMat : shrubMat);
  m.position.set(x, s * 0.35, z); m.rotation.set(hash(i) * 3, hash(i + 1) * 3, 0); m.castShadow = true; m.receiveShadow = true; scene.add(m);
}

// ---------- tracks ----------
const steel = new THREE.MeshStandardMaterial({ color: 0xc9ccd2, metalness: 0.35, roughness: 0.38, emissive: 0x000000 });
const steelHot = new THREE.MeshStandardMaterial({ color: 0xc9ccd2, metalness: 0.35, roughness: 0.38, emissive: 0xff5a1a, emissiveIntensity: 0 });
const tieMat = new THREE.MeshStandardMaterial({ color: 0x5b3a24, roughness: 0.9 });
const ballMat = new THREE.MeshStandardMaterial({ map: speckle('#8d8076', ['#6f625a', '#a89a8e', '#5a4e48', '#b9aa9c'], 9000, 512, 9), roughness: 1 });
ballMat.map.repeat.set(1, 80);
const ballTex = ballMat.map;
const ballSnow = speckle('#e4e9f0', ['#b9b2ab', '#ffffff', '#cfd6df', '#8d8076'], 9000, 512, 21); ballSnow.repeat.set(1, 80);
const Z0 = -300, Z1 = 60, L = 12;
function ballast(x) {
  const b = new THREE.Mesh(new THREE.BoxGeometry(4.2, 0.5, Z1 - Z0), ballMat);
  b.position.set(x, 0.25, (Z0 + Z1) / 2); b.receiveShadow = true; scene.add(b);
}
function ties(x) {
  const n = Math.floor((Z1 - Z0) / 0.7);
  const m = new THREE.InstancedMesh(new THREE.BoxGeometry(2.7, 0.18, 0.26), tieMat, n);
  m.castShadow = true; m.receiveShadow = true; scene.add(m);
  return { mesh: m, n, x };
}
// boss's track: one mesh per 12 m rail, its length set from the gap each frame
ballast(0);
const bossTies = ties(0);
const bossRails = [];
for (let z = Z0; z < Z1; z += L) for (const sx of [-0.72, 0.72]) {
  const r = new THREE.Mesh(new THREE.BoxGeometry(0.09, 0.17, 1), steel);
  r.castShadow = true; r.userData = { z, sx }; scene.add(r); bossRails.push(r);
}
const plateMat = new THREE.MeshStandardMaterial({ color: 0x3d434d, metalness: 0.5, roughness: 0.5 });
for (let z = Z0; z < Z1; z += L) for (const sx of [-0.72, 0.72]) for (const side of [-1, 1]) {
  const p = new THREE.Mesh(new THREE.BoxGeometry(0.03, 0.11, 0.62), plateMat);
  p.position.set(sx + side * 0.065, 0.72, z); p.castShadow = true; scene.add(p);
}
// his track: two continuous rails that can buckle (sun kink)
ballast(7);
const hisTies = ties(7);
const hisRailGeo = [], hisRails = [];
for (const sx of [-0.72, 0.72]) {
  const g = new THREE.BoxGeometry(0.09, 0.17, Z1 - Z0, 1, 1, 720);
  g.translate(7 + sx, 0.75, (Z0 + Z1) / 2);
  const m = new THREE.Mesh(g, steelHot); m.castShadow = true; scene.add(m);
  hisRailGeo.push({ g, base: g.attributes.position.array.slice() }); hisRails.push(m);
}
const KZ = -34;
const kinkAt = (z, A) => A * Math.exp(-(((z - KZ) / 10) ** 2)) * Math.sin((z - KZ) / 4.2);
const M4 = new THREE.Matrix4();
function setTies(T, dxFn) { for (let i = 0; i < T.n; i++) { const z = Z0 + i * 0.7; M4.makeTranslation(T.x + dxFn(z), 0.58, z); T.mesh.setMatrixAt(i, M4); } T.mesh.instanceMatrix.needsUpdate = true; }
setTies(bossTies, () => 0);

// ---------- a little train (old steam engine, then a modern one) ----------
function train(body, stripe) {
  const g = new THREE.Group();
  const mb = new THREE.MeshStandardMaterial({ color: body, roughness: 0.5, metalness: 0.2 });
  const ms = new THREE.MeshStandardMaterial({ color: stripe, roughness: 0.6 });
  const dark = new THREE.MeshStandardMaterial({ color: 0x1b2230, roughness: 0.7 });
  const add = (geo, mat, x, y, z) => { const m = new THREE.Mesh(geo, mat); m.position.set(x, y, z); m.castShadow = true; g.add(m); return m; };
  for (let c = 0; c < 3; c++) {
    const z = c * 9.5;
    add(new THREE.BoxGeometry(2.6, 2.6, 8.6), mb, 0, 2.55, z);
    add(new THREE.BoxGeometry(2.64, 0.35, 8.64), ms, 0, 2.0, z);
    for (let w = 0; w < 4; w++) { const wh = add(new THREE.CylinderGeometry(0.42, 0.42, 2.0, 18), dark, 0, 1.25, z - 3 + w * 2); wh.rotation.z = Math.PI / 2; }
    for (let k = 0; k < 4; k++) add(new THREE.BoxGeometry(2.66, 0.7, 1.1), new THREE.MeshStandardMaterial({ color: 0xbfe3ff, roughness: 0.2, metalness: 0.4 }), 0, 3.15, z - 3 + k * 2);
  }
  return g;
}
const oldTrain = train(0x2a3d5c, 0xf2b84b); oldTrain.position.x = 0; scene.add(oldTrain);
const newTrain = train(0xe9eef4, 0x2272b4); newTrain.position.x = 7; scene.add(newTrain);

// ---------- the mascot (2D billboard) ----------
const loader = new THREE.TextureLoader();
const tex = {};
const SPRITES = ['shrug_talk', 'think_talk', 'stand_talk', 'stand_smile', 'cheer_happy', 'shock_shock', 'shrug_smile', 'wave_talk', 'wave_happy', 'point_smile', 'think_worry', 'stand_worry'];
const heroGeo = new THREE.PlaneGeometry(1.14, 1.9); heroGeo.translate(0, 0.95, 0);
const heroMat = new THREE.MeshBasicMaterial({ transparent: true, alphaTest: 0.5, side: THREE.DoubleSide, fog: false });
const heroDepth = new THREE.MeshDepthMaterial({ depthPacking: THREE.RGBADepthPacking, alphaTest: 0.5 });
const hero = new THREE.Mesh(heroGeo, heroMat); hero.castShadow = true; hero.customDepthMaterial = heroDepth; scene.add(hero);
const ready = Promise.all(SPRITES.map(async (n) => { const t = await loader.loadAsync(`assets/sprites/hero_${n}.png`); t.colorSpace = THREE.SRGBColorSpace; tex[n] = t; }));

// ---------- shots: [t0, t1, camFrom, camTo, lookFrom, lookTo, fov] ----------
const S = [
  [0.0, 2.0, [1.75, 1.75, -10.7], [1.6, 1.62, -11.1], [0.72, 0.76, -12.07], null, 34],          // gap macro
  [2.0, 3.6, [2.9, 1.35, -5.0], [3.0, 1.35, -5.7], [3.6, 1.2, -10], null, 42],                 // mascot medium
  [3.6, 5.05, [4.0, 0.85, -8.0], [3.9, 0.9, -8.4], [3.6, 1.65, -10], null, 46],                // low close-up
  [5.05, 7.6, [-26, 22, 26], [-18, 15, 12], [4, 0, -16], null, 44],                            // winter aerial
  [7.6, 9.6, [7.0, 9.5, -13.98], [7.0, 7.0, -15.98], [7.0, 0, -16], null, 50],                // top-down, his track
  [9.6, 11.3, [8.75, 1.75, -10.7], [8.6, 1.62, -11.1], [7.72, 0.76, -12.07], null, 34],        // his joint: no gap
  [11.3, 15.0, [5.6, 1.3, -6.4], [4.7, 1.25, -6.8], [3.6, 1.3, -10], null, 42],              // cheer
  [15.0, 17.0, [12, 1.1, 10], [10, 1.25, 5], [2, 4, -45], null, 46],                           // JULY wide
  [17.0, 19.0, [1.35, 1.0, -6.0], [1.25, 0.95, -8.0], [0.72, 0.8, -15], null, 40],            // hot rail
  [19.0, 24.0, [1.7, 1.7, -10.8], [1.6, 1.62, -11.1], [0.72, 0.76, -12.07], null, 30],   // rail end grows into the gap
  [24.0, 27.3, [1.75, 1.75, -10.7], [1.6, 1.62, -11.1], [0.72, 0.76, -12.07], null, 34],       // gaps closing
  [27.3, 29.6, [16, 11, -14], [14.5, 9.5, -18], [7, 0, -34], null, 46],                       // kink from above
  [29.6, 32.0, [13.5, 4.5, -20.0], [13.2, 4.4, -21.0], [7.0, 0.5, -34], null, 50],           // kink + shocked mascot
  [32.0, 35.0, [5.2, 1.3, -7.2], [5.0, 1.3, -7.5], [3.6, 1.3, -10], null, 42],                // shrug
  [35.0, 37.6, [2.5, 0.85, -7.5], [2.5, 0.85, -8.2], [0, 1.4, -22], null, 50],                // old train clacks by
  [37.6, 41.0, [22, 12, 0], [22, 12, -30], [7, 0, -24], [7, 0, -54], 46],                      // TODAY: modern train
  [41.0, 46.3, [8.3, 1.05, -8.5], [8.2, 1.02, -10.0], [7.72, 0.8, -16], null, 40],               // heated welded rail
  [46.3, 52.6, [3.6, 1.6, -5.0], [3.6, 1.6, -5.4], [3.6, 2.3, -10], null, 42],               // wave + CTA
];
// mascot: [t0, sprite, x, z]
const HERO = [
  [0, null, 3.6, -10], [2.0, 'shrug_talk', 3.6, -10], [3.6, 'think_talk', 3.6, -10], [5.05, 'stand_smile', 4.2, -12],
  [7.6, null, 3.6, -10], [11.3, 'cheer_happy', 3.6, -10], [15.0, 'stand_worry', 4.4, -14], [17.0, null, 3.6, -10],
  [27.3, 'shock_shock', 10.0, -27], [29.6, 'shock_shock', 14.6, -24.0], [32.0, 'shrug_smile', 3.6, -10],
  [35.0, null, 3.6, -10], [46.3, 'wave_talk', 3.6, -10],
];
const WINTER_END = 15.0;

function camAt(t) {
  let s = S[S.length - 1];
  for (const x of S) if (t >= x[0] && t < x[1]) { s = x; break; }
  const k = prog(t, s[0], s[1] - s[0]);
  const e = ease(k) * 0.6 + k * 0.4;
  const P = (a, b) => (b ? a.map((v, i) => lerp(v, b[i], e)) : a);
  camera.position.set(...P(s[2], s[3]));
  camera.fov = s[6]; camera.updateProjectionMatrix();
  camera.lookAt(...P(s[4], s[5]));
}

function renderAt(t) {
  const summer = t >= WINTER_END;
  // season
  skyMat.uniforms.top.value.setRGB(...(summer ? [0.16, 0.42, 0.86] : [0.40, 0.52, 0.66]));
  skyMat.uniforms.hor.value.setRGB(...(summer ? [0.98, 0.84, 0.62] : [0.84, 0.88, 0.93]));
  scene.fog.color.copy(skyMat.uniforms.hor.value);
  sun.color.setRGB(...(summer ? [1.0, 0.92, 0.78] : [0.86, 0.9, 1.0]));
  sun.intensity = summer ? 3.0 : 1.5;
  hemi.intensity = summer ? 0.85 : 1.15;
  sandMat.map = summer ? sandTex : snowTex; ballMat.map = summer ? ballTex : ballSnow;
  sunDisc.visible = glow.visible = summer;
  // snow
  snow.visible = !summer;
  if (!summer) {
    const a = snowGeo.attributes.position.array;
    for (let i = 0; i < NS; i++) {
      a[i * 3] = snowBase[i * 3] + Math.sin(t * 0.8 + i) * 0.4;
      a[i * 3 + 1] = ((snowBase[i * 3 + 1] - t * (1.2 + hash(i) * 0.8)) % 30 + 30) % 30;
      a[i * 3 + 2] = snowBase[i * 3 + 2];
    }
    snowGeo.attributes.position.needsUpdate = true;
  }
  // boss's gaps: wide in winter, nearly closed by late July (exaggerated so you can see them)
  const gap = summer ? lerp(0.14, 0.02, ease(prog(t, 24.6, 2.0))) : 0.14;
  for (const r of bossRails) {
    let len = L - gap;
    // the rail-growth demo piece (z -24..-12): grows on screen, exaggerated
    if (r.userData.z === -24 && t >= 19.0 && t < 24.0) len = L - 0.14 + 0.12 * ease(prog(t, 20.4, 2.6));
    r.scale.z = len; r.position.set(r.userData.sx, 0.75, r.userData.z + len / 2);
  }
  // his track: straight until July, kinks at ~27.6 s, straight again for "today" (37.6+)
  const A = t >= 37.6 ? 0 : 1.7 * ease(prog(t, 27.6, 1.6));
  for (const { g, base } of hisRailGeo) {
    const p = g.attributes.position.array;
    for (let i = 0; i < p.length; i += 3) p[i] = base[i] + kinkAt(base[i + 2], A);
    g.attributes.position.needsUpdate = true; g.computeBoundingSphere();
  }
  setTies(hisTies, (z) => kinkAt(z, A));
  steelHot.emissiveIntensity = t >= 41.0 && t < 46.3 ? 1.6 * ease(prog(t, 41.6, 1.8)) : 0;
  // trains
  oldTrain.visible = t >= 35.0 && t < 37.6;
  oldTrain.position.z = lerp(-70, 4, prog(t, 35.0, 2.6));
  newTrain.visible = t >= 37.6 && t < 41.0;
  newTrain.position.z = lerp(10, -70, prog(t, 37.6, 3.4));
  // mascot
  let h = HERO[0];
  for (const x of HERO) if (t >= x[0]) h = x;
  hero.visible = !!h[1] && !!tex[h[1]];
  if (hero.visible) {
    heroMat.map = tex[h[1]]; heroDepth.map = tex[h[1]];
    hero.position.set(h[2], 0.5 + Math.abs(Math.sin(t * 2.6)) * 0.02, h[3]);
  }
  camAt(t);
  hero.rotation.y = Math.atan2(camera.position.x - hero.position.x, camera.position.z - hero.position.z);
  // sun follows the camera so shadows stay sharp; the disc sits low in the west
  sun.position.set(camera.position.x + 45, 75, camera.position.z + 25);
  sun.target.position.set(camera.position.x, 0, camera.position.z - 20);
  sunDisc.position.set(-650, 330, -1500); sunDisc.lookAt(camera.position);
  glow.position.copy(sunDisc.position).multiplyScalar(1.001); glow.lookAt(camera.position);
  renderer.render(scene, camera);
}

window.__hf = window.__hf || {};
window.__hf.buildReady = window.__hf.buildReady || {};
window.__hf.buildReady['world'] = ready.then(() => renderAt(0));
window.addEventListener('hf-seek', (e) => renderAt(e.detail.time));
window.__renderAt = renderAt; // for local stills
