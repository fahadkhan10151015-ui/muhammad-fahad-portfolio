/**
 * HERO — interactive 3D keyboard + Digital Core.
 * Concept: Keyboard → Code → Digital Core. Keys rise in a damped wave under
 * the cursor; code particles stream from the active key into the core.
 */
import * as THREE from "three";
import type { FrameState, SceneContext, SceneInstance } from "../types";
import { RoundedBoxGeometry } from "three/examples/jsm/geometries/RoundedBoxGeometry.js";
import { C, mat, addLights, glowSprite, particleMaterial, damp, clamp01, easeOutCubic, mulberry } from "../common";

const ROWS = [
  [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2],
  [1.5, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1.5],
  [1.75, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2.25],
  [2.25, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2.75],
  [1.5, 1.5, 1.5, 6.5, 1.5, 1.5, 2],
];
// accent (gold) keys: [row, index]
const ACCENT = new Set(["0-0", "0-14", "2-12", "4-3"]);
const KEY_H = 0.42;
const REST_Y = KEY_H / 2 + 0.03;

function easeOutBack(t: number): number {
  const c1 = 1.5;
  const c3 = c1 + 1;
  return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2);
}

function roundedGlowTexture(): THREE.CanvasTexture {
  const s = 128;
  const c = document.createElement("canvas");
  c.width = c.height = s;
  const g = c.getContext("2d") as CanvasRenderingContext2D;
  g.shadowColor = "rgba(255,190,90,1)";
  g.shadowBlur = 22;
  g.fillStyle = "rgba(255,206,120,1)";
  g.beginPath();
  g.roundRect(26, 26, s - 52, s - 52, 14);
  g.fill();
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  return t;
}

export function buildHero({ quality, reduced }: SceneContext): SceneInstance {
  const low = quality === "low";
  const scene = new THREE.Scene();
  scene.fog = new THREE.Fog("#060608", 20, 40);

  const camera = new THREE.PerspectiveCamera(32, 1.8, 0.1, 80);
  camera.position.set(0, 8.5, 14);

  const keyLight = addLights(scene, { key: 3.2, rim: 2.2 });
  // soft frontal fill so key caps read clearly against the dark floor
  const fill = new THREE.DirectionalLight("#fff4e0", 0.7);
  fill.position.set(2, 6, 12);
  scene.add(fill);
  if (quality === "high") {
    keyLight.castShadow = true;
    keyLight.shadow.mapSize.set(1024, 1024);
    const sc = keyLight.shadow.camera;
    sc.left = -11;
    sc.right = 11;
    sc.top = 8;
    sc.bottom = -8;
    sc.near = 1;
    sc.far = 30;
    keyLight.shadow.bias = -0.0008;
    keyLight.shadow.normalBias = 0.02;
  }

  /* --------------------------------------------------------- floor */
  const floor = new THREE.Mesh(
    new THREE.PlaneGeometry(80, 80),
    new THREE.MeshStandardMaterial({ color: "#070709", metalness: 0.3, roughness: 0.8, envMapIntensity: 0.15 }),
  );
  floor.rotation.x = -Math.PI / 2;
  floor.position.y = -0.52;
  floor.receiveShadow = true;
  floor.visible = false; // the page atmosphere is the floor; keeps the scene inky

  /* ------------------------------------------------------ keyboard */
  const kb = new THREE.Group();
  scene.add(kb);

  const base = new THREE.Mesh(
    new RoundedBoxGeometry(17.1, 0.5, 5.9, 3, 0.2),
    new THREE.MeshStandardMaterial({ color: "#121216", metalness: 0.8, roughness: 0.4, envMapIntensity: 0.7 }),
  );
  base.position.y = -0.25;
  base.receiveShadow = true;
  base.castShadow = quality === "high";
  kb.add(base);

  const trim = new THREE.Mesh(new THREE.BoxGeometry(16.6, 0.025, 0.025), mat.goldEmissive(1.4));
  trim.position.set(0, 0.0, 2.93);
  kb.add(trim);
  const frame = new THREE.LineLoop(
    new THREE.BufferGeometry().setFromPoints([
      new THREE.Vector3(-8.25, 0.01, -2.7),
      new THREE.Vector3(8.25, 0.01, -2.7),
      new THREE.Vector3(8.25, 0.01, 2.7),
      new THREE.Vector3(-8.25, 0.01, 2.7),
    ]),
    mat.line(0.22),
  );
  kb.add(frame);

  // Build key list
  interface Key { w: number; x: number; z: number; accent: boolean; elev: number; press: number; mesh: THREE.InstancedMesh; index: number }
  const keys: Key[] = [];
  ROWS.forEach((row, r) => {
    let x = -8;
    row.forEach((w, i) => {
      keys.push({ w, x: x + w / 2, z: (r - 2) * 1.02, accent: ACCENT.has(`${r}-${i}`), elev: 0, press: 0, mesh: null as unknown as THREE.InstancedMesh, index: 0 });
      x += w;
    });
  });

  // One InstancedMesh per key width (correct bevels, few draw calls)
  const keyMat = new THREE.MeshStandardMaterial({ color: "#ffffff", metalness: 0.68, roughness: 0.34, envMapIntensity: 1 });
  const groups = new Map<number, Key[]>();
  for (const k of keys) {
    if (!groups.has(k.w)) groups.set(k.w, []);
    groups.get(k.w)?.push(k);
  }
  const keyMeshes: THREE.InstancedMesh[] = [];
  const normal = new THREE.Color("#26262d");
  const accent = new THREE.Color("#a67a28");
  for (const [w, list] of groups) {
    const geo = new RoundedBoxGeometry(w - 0.16, KEY_H, 0.84, 2, 0.1);
    const im = new THREE.InstancedMesh(geo, keyMat, list.length);
    im.castShadow = quality === "high";
    im.receiveShadow = quality === "high";
    list.forEach((k, i) => {
      k.mesh = im;
      k.index = i;
      im.setColorAt(i, k.accent ? accent : normal);
    });
    kb.add(im);
    keyMeshes.push(im);
  }

  // Under-glow quads (light leaking from the cavity as a key rises)
  const glowMat = new THREE.MeshBasicMaterial({
    map: roundedGlowTexture(),
    transparent: true,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
  });
  const glowGeo = new THREE.PlaneGeometry(1, 1).rotateX(-Math.PI / 2);
  const glows = new THREE.InstancedMesh(glowGeo, glowMat, keys.length);
  const dummy = new THREE.Object3D();
  const black = new THREE.Color(0, 0, 0);
  keys.forEach((k, i) => {
    dummy.position.set(k.x, 0.015, k.z);
    dummy.scale.set(k.w * 1.25, 1, 1.25);
    dummy.updateMatrix();
    glows.setMatrixAt(i, dummy.matrix);
    glows.setColorAt(i, black);
  });
  kb.add(glows);

  /* -------------------------------------------------- circuit traces */
  const traces: THREE.Vector3[][] = [];
  const rand = mulberry(7);
  const traceCount = low ? 16 : 30;
  for (let i = 0; i < traceCount; i++) {
    const side = i % 4;
    let p = new THREE.Vector3();
    if (side === 0) p.set(-9 + rand() * 18, -0.5, -3.3);
    if (side === 1) p.set(-9 + rand() * 18, -0.5, 3.3);
    if (side === 2) p.set(-8.9, -0.5, -2.6 + rand() * 5.2);
    if (side === 3) p.set(8.9, -0.5, -2.6 + rand() * 5.2);
    const pts = [p.clone()];
    let dir =
      side === 0 ? new THREE.Vector3(0, 0, -1) : side === 1 ? new THREE.Vector3(0, 0, 1) : side === 2 ? new THREE.Vector3(-1, 0, 0) : new THREE.Vector3(1, 0, 0);
    for (let s = 0; s < 4; s++) {
      p = p.clone().addScaledVector(dir, 0.8 + rand() * 2.6);
      pts.push(p.clone());
      // turn 45° / 90° like PCB routing
      const turn = rand() < 0.5 ? 1 : -1;
      if (rand() < 0.6) dir = new THREE.Vector3(dir.z * turn, 0, -dir.x * turn).lerp(dir, 0.5).normalize();
    }
    traces.push(pts);
  }
  const traceGeo = new THREE.BufferGeometry();
  const segs: THREE.Vector3[] = [];
  traces.forEach((pts) => {
    for (let i = 0; i < pts.length - 1; i++) segs.push(pts[i], pts[i + 1]);
  });
  traceGeo.setFromPoints(segs);
  const traceLines = new THREE.LineSegments(traceGeo, mat.line(0.16));
  kb.add(traceLines);
  // trace end pads
  const padGeo = new THREE.CircleGeometry(0.07, 12).rotateX(-Math.PI / 2);
  const pads = new THREE.InstancedMesh(padGeo, new THREE.MeshBasicMaterial({ color: C.gold, transparent: true, opacity: 0.5 }), traces.length);
  traces.forEach((pts, i) => {
    dummy.position.copy(pts[pts.length - 1]);
    dummy.position.y += 0.005;
    dummy.scale.setScalar(1);
    dummy.updateMatrix();
    pads.setMatrixAt(i, dummy.matrix);
  });
  kb.add(pads);

  // pulses running along traces
  const pulseCount = low ? 10 : 22;
  const pulseGeo = new THREE.BufferGeometry();
  const pulsePos = new Float32Array(pulseCount * 3);
  pulseGeo.setAttribute("position", new THREE.BufferAttribute(pulsePos, 3));
  const pulses = new THREE.Points(pulseGeo, particleMaterial(0.22, 0.9));
  const pulseState = Array.from({ length: pulseCount }, (_, i) => ({
    trace: i % traces.length,
    t: rand(),
    speed: 0.12 + rand() * 0.18,
  }));
  kb.add(pulses);

  /* ----------------------------------------------------- digital core */
  const core = new THREE.Group();
  scene.add(core);

  const inner = new THREE.Mesh(new THREE.OctahedronGeometry(0.62, 0), mat.gold());
  core.add(inner);
  const innerGlow = glowSprite(4.2, 0.55);
  core.add(innerGlow);

  const shellGeo = new THREE.IcosahedronGeometry(1.28, 1);
  const shell = new THREE.Mesh(
    shellGeo,
    new THREE.MeshStandardMaterial({
      color: "#0d0d11",
      metalness: 0.95,
      roughness: 0.12,
      transparent: true,
      opacity: 0.28,
      flatShading: true,
      envMapIntensity: 1.6,
      depthWrite: false,
    }),
  );
  core.add(shell);
  const shellWire = new THREE.LineSegments(new THREE.EdgesGeometry(shellGeo), mat.line(0.55, C.goldHot));
  core.add(shellWire);

  const cageGeo = new THREE.DodecahedronGeometry(2.05, 0);
  const cage = new THREE.LineSegments(new THREE.EdgesGeometry(cageGeo), mat.line(0.2));
  core.add(cage);
  // nodes on cage vertices
  const cageVerts: THREE.Vector3[] = [];
  const pos = cageGeo.attributes.position;
  const seen = new Set();
  for (let i = 0; i < pos.count; i++) {
    const v = new THREE.Vector3().fromBufferAttribute(pos, i);
    const key = v.toArray().map((n) => n.toFixed(2)).join(",");
    if (!seen.has(key)) {
      seen.add(key);
      cageVerts.push(v);
    }
  }
  const nodeMesh = new THREE.InstancedMesh(new THREE.BoxGeometry(0.09, 0.09, 0.09), mat.goldEmissive(2), cageVerts.length);
  cageVerts.forEach((v, i) => {
    dummy.position.copy(v);
    dummy.scale.setScalar(1);
    dummy.updateMatrix();
    nodeMesh.setMatrixAt(i, dummy.matrix);
  });
  cage.add(nodeMesh);

  // data bands: chips orbiting on three tilted paths
  const bands = [
    { r: 2.55, tilt: new THREE.Euler(1.2, 0, 0.35), n: 16, speed: 0.35 },
    { r: 2.85, tilt: new THREE.Euler(-0.5, 0.4, 1.1), n: 12, speed: -0.26 },
    { r: 2.3, tilt: new THREE.Euler(0.2, 0, -1.25), n: 10, speed: 0.45 },
  ];
  const chipCount = bands.reduce((a, b) => a + b.n, 0);
  const chipMat = new THREE.MeshStandardMaterial({ color: "#ffffff", metalness: 0.9, roughness: 0.3 });
  const chips = new THREE.InstancedMesh(new THREE.BoxGeometry(0.16, 0.05, 0.1), chipMat, chipCount);
  {
    let i = 0;
    const cGold = new THREE.Color("#d4a041");
    const cDark = new THREE.Color("#2b2b31");
    bands.forEach((b) => {
      for (let j = 0; j < b.n; j++) chips.setColorAt(i++, j % 3 === 0 ? cGold : cDark);
    });
  }
  core.add(chips);
  bands.forEach((b) => {
    const pts: THREE.Vector3[] = [];
    for (let i = 0; i <= 128; i++) {
      const a = (i / 128) * Math.PI * 2;
      pts.push(new THREE.Vector3(Math.cos(a) * b.r, 0, Math.sin(a) * b.r).applyEuler(b.tilt));
    }
    core.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints(pts), mat.line(0.13)));
  });

  // halo particles
  const haloN = low ? 120 : 260;
  const haloPos = new Float32Array(haloN * 3);
  for (let i = 0; i < haloN; i++) {
    const v = new THREE.Vector3().randomDirection().multiplyScalar(2.2 + rand() * 1.6);
    haloPos.set([v.x, v.y, v.z], i * 3);
  }
  const haloGeo = new THREE.BufferGeometry();
  haloGeo.setAttribute("position", new THREE.BufferAttribute(haloPos, 3));
  const halo = new THREE.Points(haloGeo, particleMaterial(0.05, 0.7));
  core.add(halo);

  const coreLight = new THREE.PointLight("#ffb547", 10, 8, 1.8);
  core.add(coreLight);

  /* ------------------------------------------- key → core code stream */
  const streamN = low ? 50 : 110;
  const streamPos = new Float32Array(streamN * 3);
  const streamGeo = new THREE.BufferGeometry();
  streamGeo.setAttribute("position", new THREE.BufferAttribute(streamPos, 3));
  const stream = new THREE.Points(streamGeo, particleMaterial(0.07, 0.95));
  stream.frustumCulled = false;
  scene.add(stream);
  const streamState = Array.from({ length: streamN }, () => ({
    t: rand(),
    speed: 0.35 + rand() * 0.45,
    o: new THREE.Vector3(),
    jitter: new THREE.Vector3((rand() - 0.5) * 0.8, (rand() - 0.5) * 0.8, (rand() - 0.5) * 0.8),
    alive: false,
  }));

  /* ------------------------------------------------------------ state */
  const ray = new THREE.Raycaster();
  const ndc = new THREE.Vector2();
  const inv = new THREE.Matrix4();
  const localRay = new THREE.Ray();
  const plane = new THREE.Plane(new THREE.Vector3(0, 1, 0), -KEY_H);
  const hit = new THREE.Vector3();
  const tmp = new THREE.Vector3();
  const tmpColor = new THREE.Color();
  const look = new THREE.Vector3();
  const camTarget = new THREE.Vector3();
  const kbBase = new THREE.Vector3();
  const coreBase = new THREE.Vector3();
  let kbScale = 0.8;
  let started = reduced;
  let intro = reduced ? 1 : 0;
  let pressTimer = 0;
  let hotKey = keys[20];
  let parX = 0;
  let parY = 0;
  let hoverAmt = 0;

  function layout(aspect: number) {
    if (aspect < 0.8) {
      // phones (portrait)
      kbBase.set(0.2, -1.6, 2.8);
      coreBase.set(1.6, 3.7, -1.5);
      kbScale = 0.5;
      camTarget.set(0, 1.6, 0);
    } else if (aspect < 1.3) {
      kbBase.set(0.6, -1.2, 2.2);
      coreBase.set(3.0, 3.8, -1.2);
      kbScale = 0.62;
      camTarget.set(0.4, 1.2, 0);
    } else {
      kbBase.set(3.4, -0.9, 1.4);
      coreBase.set(5.4, 2.6, -1.2);
      kbScale = 0.68;
      camTarget.set(1.6, 1.3, 0);
    }
  }
  layout(1.8);

  function update({ t, dt, progress, pointer }: FrameState) {
    layout(camera.aspect);
    if (started && intro < 1) intro = Math.min(1, intro + dt / 2.2);
    const exit = clamp01(progress) * (reduced ? 0.4 : 1);

    // camera: subtle parallax + recede on exit
    parX = damp(parX, pointer.inside ? pointer.x : 0, 2.5, dt);
    parY = damp(parY, pointer.inside ? pointer.y : 0, 2.5, dt);
    camera.position.set(parX * 0.9, 8.5 + parY * 0.5 + exit * 2.5, 14 + exit * 5);
    look.copy(camTarget).y += exit * -1.2;
    camera.lookAt(look);

    // keyboard pose
    kb.scale.setScalar(kbScale);
    kb.position.set(kbBase.x, kbBase.y - (1 - easeOutCubic(intro)) * 2 - exit * 1.5, kbBase.z - exit * 3);
    kb.rotation.set(0.02, -0.16 + parX * 0.04, 0);
    kb.updateMatrixWorld();

    // pointer → keyboard plane
    let hx = 999;
    let hz = 999;
    hoverAmt = damp(hoverAmt, pointer.inside ? 1 : 0, 4, dt);
    if (pointer.inside) {
      ndc.set(pointer.x, pointer.y);
      ray.setFromCamera(ndc, camera);
      inv.copy(kb.matrixWorld).invert();
      localRay.copy(ray.ray).applyMatrix4(inv);
      if (localRay.intersectPlane(plane, hit)) {
        hx = hit.x;
        hz = hit.z;
      }
    }

    // idle "typing" so the keyboard is alive without a cursor (touch devices)
    pressTimer -= dt;
    if (!reduced && pressTimer <= 0) {
      pressTimer = pointer.inside ? 0.35 : 0.11 + Math.random() * 0.12;
      const k = keys[(Math.random() * keys.length) | 0];
      k.press = pointer.inside ? 0.18 : 0.38;
    }

    const maxH = reduced ? 0.22 : 0.62;
    const sigma2 = 2 * 1.15 * 1.15;
    let best = -1;
    let bestVal = 0;
    for (let i = 0; i < keys.length; i++) {
      const k = keys[i];
      const dx = k.x - hx;
      const dz = k.z - hz;
      const wave = maxH * Math.exp(-(dx * dx + dz * dz) / sigma2);
      k.press = damp(k.press, 0, 3.2, dt);
      const target = Math.max(wave, k.press);
      k.elev = damp(k.elev, target, 9, dt);

      // intro cascade
      const delay = ((k.x + 8) / 16) * 0.55 + (k.z + 2) * 0.04;
      const ki = easeOutCubic(clamp01((intro * 1.6 - delay) / 0.6));

      dummy.position.set(k.x, REST_Y + k.elev - (1 - ki) * 1.2, k.z);
      dummy.scale.set(1, Math.max(0.001, ki), 1);
      dummy.updateMatrix();
      k.mesh.setMatrixAt(k.index, dummy.matrix);

      const glow = Math.min(1, k.elev / 0.4) * ki;
      tmpColor.copy(C.goldHot).multiplyScalar(glow * 1.25);
      glows.setColorAt(i, tmpColor);

      if (k.elev > bestVal) {
        bestVal = k.elev;
        best = i;
      }
    }
    keyMeshes.forEach((m) => (m.instanceMatrix.needsUpdate = true));
    if (glows.instanceColor) glows.instanceColor.needsUpdate = true;
    if (best >= 0 && bestVal > 0.12) hotKey = keys[best];

    // circuit pulses
    for (let i = 0; i < pulseCount; i++) {
      const p = pulseState[i];
      p.t += p.speed * dt * (reduced ? 0.3 : 1);
      if (p.t > 1) {
        p.t = 0;
        p.trace = (Math.random() * traces.length) | 0;
      }
      const pts = traces[p.trace];
      const f = p.t * (pts.length - 1);
      const s = Math.min(pts.length - 2, Math.floor(f));
      tmp.lerpVectors(pts[s], pts[s + 1], f - s);
      pulsePos.set([tmp.x, tmp.y + 0.02, tmp.z], i * 3);
    }
    pulseGeo.attributes.position.needsUpdate = true;

    // core
    const ci = easeOutBack(clamp01((intro - 0.3) / 0.7));
    core.position.set(coreBase.x, coreBase.y + Math.sin(t * 0.9) * 0.12 + exit * 2.2, coreBase.z - exit * 2);
    const coreScale = Math.max(0.001, ci) * (camera.aspect < 0.8 ? 0.6 : 0.82) * (1 - exit * 0.35);
    core.scale.setScalar(coreScale);
    const spin = reduced ? 0.15 : 1;
    inner.rotation.set(t * 0.6 * spin, t * 0.9 * spin, 0);
    shell.rotation.set(-t * 0.18 * spin, t * 0.22 * spin, 0);
    shellWire.rotation.copy(shell.rotation);
    cage.rotation.set(t * 0.08 * spin, -t * 0.12 * spin, t * 0.05 * spin);
    halo.rotation.y = t * 0.05 * spin;
    innerGlow.material.opacity = 0.45 + Math.sin(t * 2.2) * 0.12 + hoverAmt * 0.15;
    coreLight.intensity = 8 + Math.sin(t * 2.2) * 2 + hoverAmt * 4;

    let ci2 = 0;
    bands.forEach((b) => {
      for (let j = 0; j < b.n; j++) {
        const a = (j / b.n) * Math.PI * 2 + t * b.speed * spin;
        dummy.position.set(Math.cos(a) * b.r, 0, Math.sin(a) * b.r).applyEuler(b.tilt);
        dummy.rotation.set(b.tilt.x, -a, b.tilt.z);
        dummy.scale.setScalar(1);
        dummy.updateMatrix();
        chips.setMatrixAt(ci2++, dummy.matrix);
      }
    });
    chips.instanceMatrix.needsUpdate = true;
    dummy.rotation.set(0, 0, 0);

    // code stream: active key → core
    core.updateMatrixWorld();
    const coreWorld = core.position;
    const origin = tmp.set(hotKey.x, REST_Y + hotKey.elev + 0.3, hotKey.z).applyMatrix4(kb.matrixWorld);
    const streamOn = intro > 0.8 ? 1 : 0;
    for (let i = 0; i < streamN; i++) {
      const s = streamState[i];
      s.t += dt * s.speed * (reduced ? 0.25 : 1) * (0.6 + hoverAmt * 0.8);
      if (s.t >= 1 || !s.alive) {
        s.t = s.alive ? 0 : Math.random();
        s.alive = true;
        s.o.copy(origin);
        s.o.x += (Math.random() - 0.5) * 0.5;
        s.o.z += (Math.random() - 0.5) * 0.5;
      }
      const u = s.t;
      // quadratic bezier with a lifted control point
      const cx = (s.o.x + coreWorld.x) / 2 + s.jitter.x;
      const cy = Math.max(s.o.y, coreWorld.y) + 1.6 + s.jitter.y;
      const cz = (s.o.z + coreWorld.z) / 2 + s.jitter.z;
      const a = (1 - u) * (1 - u);
      const b = 2 * (1 - u) * u;
      const c = u * u;
      streamPos[i * 3] = a * s.o.x + b * cx + c * coreWorld.x;
      streamPos[i * 3 + 1] = (a * s.o.y + b * cy + c * coreWorld.y) * streamOn + (1 - streamOn) * -50;
      streamPos[i * 3 + 2] = a * s.o.z + b * cz + c * coreWorld.z;
    }
    streamGeo.attributes.position.needsUpdate = true;
    stream.material.opacity = (0.35 + hoverAmt * 0.6) * (1 - exit);
  }

  return {
    scene,
    camera,
    update,
    start() {
      started = true;
    },
  };
}
