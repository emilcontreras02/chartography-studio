// Chartography 3D world (Nov 18, 2026): a lit, low-poly 3D set where the 2D mascot sprite (hero.py) lives as a
// billboard, filmed with many camera angles - the look of viral "2D characters in a 3D world" story Shorts.
// The page exposes window.W3 = {build(spec), frame(t)}; render.js drives it with Playwright and saves JPEG frames.
import * as THREE from './node_modules/three/build/three.module.js';

const QS = new URLSearchParams(location.search);
const W = +(QS.get('w') || 1080), H = +(QS.get('h') || 1920);
const renderer = new THREE.WebGLRenderer({ antialias: true, preserveDrawingBuffer: true });
renderer.setSize(W, H);
renderer.setPixelRatio(1);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.05;
renderer.outputColorSpace = THREE.SRGBColorSpace;
document.body.appendChild(renderer.domElement);

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(40, W / H, 0.05, 3000);
const loader = new THREE.TextureLoader();

// ---------- helpers ----------
function noise(x, z) {
  return Math.sin(x * 0.11 + z * 0.07) * 0.5 + Math.sin(x * 0.31 - z * 0.23) * 0.25 + Math.sin(x * 0.9 + z * 0.77) * 0.12;
}
const STRATA = [[0.78, 0.36, 0.22], [0.86, 0.50, 0.30], [0.70, 0.30, 0.20], [0.92, 0.62, 0.40], [0.62, 0.26, 0.18], [0.84, 0.44, 0.26]];
function strataColor(y, seed = 0) {
  const i = Math.floor((y * 0.11 + Math.sin(y * 0.05 + seed) * 0.6 + seed + 1000)) % STRATA.length;
  const c = STRATA[i];
  const j = 0.94 + 0.06 * Math.sin(y * 3.1 + seed);
  return [c[0] * j, c[1] * j, c[2] * j];
}
// a rock block with a rough, strata-coloured surface
function rock(w, h, d, seg, seed, rough = 2.2) {
  const g = new THREE.BoxGeometry(w, h, d, seg, Math.max(4, Math.round(h / 1.5)), seg);
  const p = g.attributes.position;
  const cols = [];
  for (let i = 0; i < p.count; i++) {
    let x = p.getX(i), y = p.getY(i), z = p.getZ(i);
    const top = y > h / 2 - 0.01;
    if (!top) {
      const n = noise(x + seed * 13, z + y * 1.7 + seed * 7) * rough + Math.sin(y * 0.9 + seed) * rough * 0.35;
      if (Math.abs(x) > w / 2 - 0.01) x += Math.sign(x) * n;
      if (Math.abs(z) > d / 2 - 0.01) z += Math.sign(z) * n;
    } else {
      y += noise(x * 0.5 + seed, z * 0.5) * 0.12;
    }
    p.setXYZ(i, x, y, z);
    const c = top ? [0.80, 0.50, 0.32] : strataColor(y + h / 2, seed);
    cols.push(...c);
  }
  g.setAttribute('color', new THREE.Float32BufferAttribute(cols, 3));
  g.computeVertexNormals();
  const m = new THREE.Mesh(g, new THREE.MeshStandardMaterial({ vertexColors: true, roughness: 0.95, flatShading: true }));
  m.castShadow = true; m.receiveShadow = true;
  return m;
}

function speckle(base, spots, n, size = 512, rep = 1) {
  const c = document.createElement('canvas'); c.width = c.height = size;
  const g = c.getContext('2d'); g.fillStyle = base; g.fillRect(0, 0, size, size);
  let seed = 7; const rnd = () => (seed = (seed * 16807) % 2147483647) / 2147483647;
  for (let i = 0; i < n; i++) {
    g.fillStyle = spots[Math.floor(rnd() * spots.length)];
    const r = 1 + rnd() * 3.5; g.beginPath(); g.arc(rnd() * size, rnd() * size, r, 0, 7); g.fill();
  }
  const t = new THREE.CanvasTexture(c); t.wrapS = t.wrapT = THREE.RepeatWrapping; t.repeat.set(rep, rep); t.colorSpace = THREE.SRGBColorSpace;
  t.anisotropy = 8; return t;
}

// ---------- sky ----------
let skyMat;
function sky(top, horizon) {
  skyMat = new THREE.ShaderMaterial({
    side: THREE.BackSide, depthWrite: false,
    uniforms: { top: { value: new THREE.Color(...top) }, hor: { value: new THREE.Color(...horizon) } },
    vertexShader: 'varying vec3 vp; void main(){ vp = normalize(position); gl_Position = projectionMatrix*modelViewMatrix*vec4(position,1.0); }',
    fragmentShader: 'uniform vec3 top; uniform vec3 hor; varying vec3 vp; void main(){ float k = pow(clamp(vp.y,0.0,1.0),0.55); gl_FragColor = vec4(mix(hor, top, k),1.0); }',
  });
  const s = new THREE.Mesh(new THREE.SphereGeometry(2000, 32, 16), skyMat);
  scene.add(s);
  // soft clouds
  const cm = new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.85, fog: false });
  for (let i = 0; i < 14; i++) {
    const cl = new THREE.Group();
    for (let j = 0; j < 5; j++) {
      const b = new THREE.Mesh(new THREE.SphereGeometry(18 + (j % 3) * 7, 12, 8), cm);
      b.position.set(j * 22 - 44, (j % 2) * 6, (j % 3) * 8);
      b.scale.y = 0.45;
      cl.add(b);
    }
    const a = i / 14 * Math.PI * 2;
    cl.position.set(Math.cos(a) * 900, 260 + (i % 4) * 60, Math.sin(a) * 900);
    cl.lookAt(0, cl.position.y, 0);
    scene.add(cl);
  }
}

// ---------- the railroad ----------
const rails = [];
function railroad(z0, z1, gap, kinkFn) {
  const ballast = new THREE.Mesh(new THREE.BoxGeometry(4.2, 0.5, z1 - z0), new THREE.MeshStandardMaterial({ map: speckle('#8d8076', ['#6f625a', '#a89a8e', '#5a4e48', '#b9aa9c', '#7d6f66'], 9000, 512, 1), roughness: 1 }));
  ballast.material.map.repeat.set(1, (z1 - z0) / 4); ballast.position.set(0, 0.25, (z0 + z1) / 2); ballast.receiveShadow = true; scene.add(ballast);
  const n = Math.floor((z1 - z0) / 0.7);
  const tie = new THREE.InstancedMesh(new THREE.BoxGeometry(2.7, 0.18, 0.26), new THREE.MeshStandardMaterial({ color: 0x5b3a24, roughness: 0.9 }), n);
  const m = new THREE.Matrix4();
  for (let i = 0; i < n; i++) { const z = z0 + i * 0.7; m.makeTranslation(kinkFn ? kinkFn(z) : 0, 0.58, z); tie.setMatrixAt(i, m); }
  tie.castShadow = true; tie.receiveShadow = true; scene.add(tie);
  const steel = new THREE.MeshStandardMaterial({ color: 0xc9ccd2, metalness: 0.35, roughness: 0.38 });
  const L = 12;  // a 39-foot rail is about 12 m
  for (let z = z0; z < z1; z += L) {
    for (const sx of [-0.72, 0.72]) {
      const len = L - gap;
      const g = new THREE.BoxGeometry(0.09, 0.17, len, 1, 1, kinkFn ? 24 : 1);
      if (kinkFn) {
        const p = g.attributes.position;
        for (let i = 0; i < p.count; i++) p.setX(i, p.getX(i) + kinkFn(z + len / 2 + p.getZ(i)));
        g.computeVertexNormals();
      }
      const r = new THREE.Mesh(g, steel);
      r.position.set(sx, 0.75, z + len / 2);
      r.castShadow = true;
      scene.add(r); rails.push(r);
    }
  }
}

// ---------- 2D actors on billboards ----------
const actors = {};
function actor(name, x, z, h) {
  const geo = new THREE.PlaneGeometry(h * 0.6, h);
  geo.translate(0, h / 2, 0);
  const mat = new THREE.MeshBasicMaterial({ transparent: true, alphaTest: 0.5, side: THREE.DoubleSide, fog: false });
  const mesh = new THREE.Mesh(geo, mat);
  mesh.position.set(x, 0.5, z);
  mesh.castShadow = true;
  mesh.customDepthMaterial = new THREE.MeshDepthMaterial({ depthPacking: THREE.RGBADepthPacking, alphaTest: 0.5 });
  scene.add(mesh);
  actors[name] = { mesh, tex: {} };
}
function setSprite(name, file) {
  const a = actors[name];
  if (!a.tex[file]) { const t = loader.load('sprites/' + file + '.png'); t.colorSpace = THREE.SRGBColorSpace; a.tex[file] = t; }
  a.mesh.material.map = a.tex[file];
  a.mesh.customDepthMaterial.map = a.tex[file];
  a.mesh.material.needsUpdate = true;
}

// ---------- build ----------
let sun, SPEC;
window.W3 = {
  async build(spec) {
    SPEC = spec;
    sky(spec.skyTop || [0.22, 0.48, 0.86], spec.skyHorizon || [0.72, 0.84, 0.96]);
    scene.fog = new THREE.Fog(new THREE.Color(...(spec.skyHorizon || [0.72, 0.84, 0.96])), 120, 900);
    scene.add(new THREE.HemisphereLight(0xbfdcff, 0x8a5a3a, 0.9));
    sun = new THREE.DirectionalLight(0xfff0d8, 2.6);
    sun.position.set(40, 70, 30);
    sun.castShadow = true;
    sun.shadow.mapSize.set(4096, 4096);
    const sc = sun.shadow.camera; sc.left = -45; sc.right = 45; sc.top = 45; sc.bottom = -45; sc.near = 1; sc.far = 300;
    sun.shadow.bias = -0.0004;
    scene.add(sun); scene.add(sun.target);
    // plateau the track runs on (canyon edge at x = -7)
    const plateau = rock(260, 100, 900, 160, 1, 1.4);
    plateau.position.set(-7 + 130, -50, -300);
    scene.add(plateau);
    const sandTex = speckle('#c99a6a', ['#b98a5e', '#d4a878', '#ad7f56', '#dcb68c'], 26000, 1024, 1);
    for (const [x0, x1] of [[2.1, 245], [-7, -2.1]]) {
      const tx = sandTex.clone(); tx.needsUpdate = true; tx.repeat.set((x1 - x0) / 6, 900 / 6);
      const sand = new THREE.Mesh(new THREE.PlaneGeometry(x1 - x0, 900), new THREE.MeshStandardMaterial({ map: tx, roughness: 1 }));
      sand.rotation.x = -Math.PI / 2; sand.position.set((x0 + x1) / 2, 0.45, -300); sand.receiveShadow = true; scene.add(sand);
    }
    // canyon floor + far wall + distant mesas
    const floor = new THREE.Mesh(new THREE.PlaneGeometry(3000, 3000), new THREE.MeshStandardMaterial({ color: 0x9a5a36, roughness: 1 }));
    floor.rotation.x = -Math.PI / 2; floor.position.y = -95; floor.receiveShadow = true; scene.add(floor);
    const far = rock(120, 110, 1100, 120, 3, 4);
    far.position.set(-140, -95 + 55 + 4, -350); scene.add(far);
    for (const [x, z, w, h, s] of [[-300, -700, 160, 150, 7], [220, -900, 200, 120, 9], [-60, -1100, 260, 170, 11], [400, -500, 120, 90, 13]]) {
      const m = rock(w, h, w * 0.8, 10, s, 6); m.position.set(x, -95 + h / 2, z); scene.add(m);
    }
    // desert ground behind (right side), slightly bumpy
    railroad(-420, 40, spec.gap ?? 0.06, spec.kink ? (z) => spec.kink.amp * Math.exp(-(((z - spec.kink.z) / 9) ** 2)) * Math.sin((z - spec.kink.z) / 4) : null);
    for (const a of spec.actors || []) {
      actor(a.name, a.x, a.z, a.h);
      const names = new Set([a.sprite, ...(a.track || []).map(k => k.sprite).filter(Boolean)]);
      for (const n of names) { const t = await loader.loadAsync('sprites/' + n + '.png'); t.colorSpace = THREE.SRGBColorSpace; actors[a.name].tex[n] = t; }
      setSprite(a.name, a.sprite);
    }
    return 'built';
  },
  // shot = {t0, t1, from:[x,y,z], to:[x,y,z], look0:[..], look1:[..], fov}
  frame(t, state) {
    const shots = SPEC.shots;
    let s = shots[shots.length - 1];
    for (const sh of shots) if (t >= sh.t0 && t < sh.t1) { s = sh; break; }
    const k = Math.min(1, Math.max(0, (t - s.t0) / (s.t1 - s.t0)));
    const e = k * k * (3 - 2 * k) * 0.5 + k * 0.5;
    const L = (a, b) => a.map((v, i) => v + (b[i] - v) * e);
    camera.position.set(...L(s.from, s.to || s.from));
    camera.fov = s.fov || 40; camera.updateProjectionMatrix();
    camera.lookAt(...L(s.look0, s.look1 || s.look0));
    // actors: sprite + billboard (yaw only) + idle bob
    for (const [name, st] of Object.entries(state || {})) {
      const a = actors[name]; if (!a) continue;
      if (st.sprite) setSprite(name, st.sprite);
      if (st.x !== undefined) a.mesh.position.x = st.x;
      if (st.z !== undefined) a.mesh.position.z = st.z;
      a.mesh.position.y = 0.5 + Math.abs(Math.sin(t * 2.6)) * 0.02 + (st.hop || 0);
    }
    for (const a of Object.values(actors)) {
      const dx = camera.position.x - a.mesh.position.x, dz = camera.position.z - a.mesh.position.z;
      a.mesh.rotation.y = Math.atan2(dx, dz);
    }
    sun.target.position.set(camera.position.x, 0, camera.position.z - 20);
    sun.position.set(camera.position.x + 40, 70, camera.position.z + 10);
    renderer.render(scene, camera);
    return true;
  },
};
window.W3_DEBUG = () => Object.entries(actors).map(([n, a]) => [n, a.mesh.position.toArray(), !!a.mesh.material.map, a.mesh.material.map && a.mesh.material.map.image && a.mesh.material.map.image.width, scene.children.includes(a.mesh)]);
window.W3_READY = true;
