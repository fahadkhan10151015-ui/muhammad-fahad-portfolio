/**
 * ABOUT — Mechanical Orbital Code System.
 * Geared gimbal rings, segmented arcs and orbital paths around an engineered
 * lens core with a physically extruded </> symbol, above a calibrated platform.
 */
import * as THREE from "three";
import { mat, addLights, glowSprite, particleMaterial, circleLine, damp, clamp01, mulberry } from "../common";

function toothedRing(radius, tube, teeth, material, toothMat, outward = true) {
  const g = new THREE.Group();
  g.add(new THREE.Mesh(new THREE.TorusGeometry(radius, tube, 10, 120), material));
  const tGeo = new THREE.BoxGeometry(0.07, 0.11, tube * 1.7);
  const im = new THREE.InstancedMesh(tGeo, toothMat, teeth);
  const d = new THREE.Object3D();
  for (let i = 0; i < teeth; i++) {
    const a = (i / teeth) * Math.PI * 2;
    const r = radius + (outward ? tube + 0.04 : -tube - 0.04);
    d.position.set(Math.cos(a) * r, Math.sin(a) * r, 0);
    d.rotation.set(0, 0, a + Math.PI / 2);
    d.updateMatrix();
    im.setMatrixAt(i, d.matrix);
  }
  g.add(im);
  return g;
}

function codeSymbol(material) {
  const g = new THREE.Group();
  const extrude = { depth: 0.12, bevelEnabled: true, bevelThickness: 0.02, bevelSize: 0.018, bevelSegments: 2, curveSegments: 1 };
  const lt = new THREE.Shape();
  [
    [0.14, 0.38],
    [-0.3, 0],
    [0.14, -0.38],
    [0.14, -0.23],
    [-0.12, 0],
    [0.14, 0.23],
  ].forEach(([x, y], i) => (i ? lt.lineTo(x, y) : lt.moveTo(x, y)));
  lt.closePath();
  const slash = new THREE.Shape();
  [
    [-0.17, -0.42],
    [-0.05, -0.42],
    [0.17, 0.42],
    [0.05, 0.42],
  ].forEach(([x, y], i) => (i ? slash.lineTo(x, y) : slash.moveTo(x, y)));
  slash.closePath();

  const ltGeo = new THREE.ExtrudeGeometry(lt, extrude);
  const a = new THREE.Mesh(ltGeo, material);
  a.position.x = -0.5;
  const b = new THREE.Mesh(new THREE.ExtrudeGeometry(slash, extrude), material);
  const c = new THREE.Mesh(ltGeo, material);
  c.rotation.y = Math.PI;
  c.position.set(0.5, 0, 0.12);
  g.add(a, b, c);
  g.position.z = -0.06;
  return g;
}

export function buildAbout({ quality, reduced }) {
  const low = quality === "low";
  const rand = mulberry(21);
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(34, 1, 0.1, 60);
  camera.position.set(0, 2.4, 12);
  addLights(scene, { key: 2.4, rim: 1.8 });

  const root = new THREE.Group();
  scene.add(root);

  /* ---------------------------------------------------------- platform */
  const platform = new THREE.Group();
  platform.position.y = -2.05;
  root.add(platform);
  const disc = new THREE.Mesh(
    new THREE.CylinderGeometry(3.7, 3.85, 0.16, 96),
    new THREE.MeshStandardMaterial({ color: "#060607", metalness: 0.55, roughness: 0.55, envMapIntensity: 0.12 }),
  );
  disc.position.y = -0.08;
  platform.add(disc);
  const step = new THREE.Mesh(
    new THREE.CylinderGeometry(4.5, 4.6, 0.1, 96),
    new THREE.MeshStandardMaterial({ color: "#060608", metalness: 0.5, roughness: 0.6, envMapIntensity: 0.15 }),
  );
  step.position.y = -0.2;
  platform.add(step);
  [1.2, 1.8, 2.45, 3.05, 3.6].forEach((r, i) => {
    const l = circleLine(r, 128, mat.line(i === 4 ? 0.55 : 0.14 + i * 0.03));
    l.position.y = 0.005;
    platform.add(l);
  });
  const rim = new THREE.Mesh(new THREE.TorusGeometry(3.7, 0.018, 6, 160), mat.goldEmissive(2.2));
  rim.rotation.x = Math.PI / 2;
  platform.add(rim);
  // calibration ticks
  const tickPts = [];
  for (let i = 0; i < 120; i++) {
    const a = (i / 120) * Math.PI * 2;
    const long = i % 10 === 0;
    const r0 = long ? 3.15 : 3.28;
    tickPts.push(
      new THREE.Vector3(Math.cos(a) * r0, 0.006, Math.sin(a) * r0),
      new THREE.Vector3(Math.cos(a) * 3.45, 0.006, Math.sin(a) * 3.45),
    );
  }
  const ticks = new THREE.LineSegments(new THREE.BufferGeometry().setFromPoints(tickPts), mat.line(0.4));
  platform.add(ticks);
  const floorGlow = glowSprite(7, 0.18);
  floorGlow.position.y = 0.1;
  platform.add(floorGlow);

  /* ------------------------------------------------- mechanical system */
  const system = new THREE.Group();
  system.position.y = 0.25;
  root.add(system);

  const metal = mat.gunmetal();
  const metalB = new THREE.MeshStandardMaterial({ color: "#26262c", metalness: 0.9, roughness: 0.26 });
  const goldMat = mat.gold();

  const gimbalA = toothedRing(2.25, 0.055, 72, metal, metalB, true);
  const gimbalB = toothedRing(1.82, 0.05, 56, metalB, goldMat, false);
  const gimbalC = new THREE.Mesh(new THREE.TorusGeometry(1.45, 0.022, 8, 120), goldMat);
  const gA = new THREE.Group();
  const gB = new THREE.Group();
  const gC = new THREE.Group();
  gA.add(gimbalA);
  gB.add(gimbalB);
  gC.add(gimbalC);
  system.add(gA, gB, gC);

  // segmented arcs (gold, emissive)
  const arcs = new THREE.Group();
  const arcMat = mat.goldEmissive(1.4);
  for (let i = 0; i < 4; i++) {
    const arc = new THREE.Mesh(new THREE.TorusGeometry(2.7, 0.03, 6, 48, Math.PI / 3.2), arcMat);
    arc.rotation.z = (i / 4) * Math.PI * 2;
    arcs.add(arc);
  }
  arcs.rotation.x = Math.PI / 2;
  system.add(arcs);

  // orbital paths with travelling nodes
  const orbits = [
    { a: 3.1, b: 1.25, tilt: new THREE.Euler(0.35, 0, 0.18), speed: 0.4 },
    { a: 2.9, b: 1.6, tilt: new THREE.Euler(-0.55, 0.3, -0.4), speed: -0.3 },
  ];
  const orbitNodes = [];
  orbits.forEach((o) => {
    const pts = new THREE.EllipseCurve(0, 0, o.a, o.b).getPoints(140).map((p) => new THREE.Vector3(p.x, 0, p.y).applyEuler(o.tilt));
    system.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints(pts), mat.line(0.2)));
    const node = new THREE.Mesh(new THREE.SphereGeometry(0.075, 16, 12), mat.goldEmissive(3));
    const halo = glowSprite(0.7, 0.7);
    node.add(halo);
    system.add(node);
    orbitNodes.push({ node, o });
  });

  /* --------------------------------------------------------- core lens */
  const core = new THREE.Group();
  system.add(core);
  const lens = new THREE.Mesh(new THREE.CylinderGeometry(0.98, 0.98, 0.34, 48), metal);
  lens.rotation.x = Math.PI / 2;
  core.add(lens);
  const face = new THREE.Mesh(
    new THREE.CircleGeometry(0.88, 48),
    new THREE.MeshStandardMaterial({ color: "#060608", metalness: 0.9, roughness: 0.18, envMapIntensity: 1.4 }),
  );
  face.position.z = 0.172;
  core.add(face);
  const bezel = new THREE.Mesh(new THREE.TorusGeometry(0.93, 0.045, 10, 64), goldMat);
  bezel.position.z = 0.17;
  core.add(bezel);
  const bezelBack = bezel.clone();
  bezelBack.position.z = -0.17;
  core.add(bezelBack);
  // inner mechanism: gear behind the lens
  const gear = toothedRing(1.12, 0.04, 36, metalB, metalB, true);
  gear.position.z = -0.05;
  core.add(gear);
  const symbolMat = new THREE.MeshStandardMaterial({
    color: "#e0ad4a",
    metalness: 1,
    roughness: 0.25,
    emissive: "#ffb540",
    emissiveIntensity: 0.55,
  });
  const symbol = codeSymbol(symbolMat);
  symbol.scale.setScalar(0.72);
  symbol.position.z = 0.19;
  core.add(symbol);
  const backSymbol = codeSymbol(symbolMat);
  backSymbol.scale.setScalar(0.72);
  backSymbol.rotation.y = Math.PI;
  backSymbol.position.z = -0.19;
  core.add(backSymbol);
  const coreGlow = glowSprite(3.6, 0.35);
  coreGlow.position.z = -0.3;
  core.add(coreGlow);

  // spokes connecting core to gimbal C
  const spokePts = [];
  for (let i = 0; i < 6; i++) {
    const a = (i / 6) * Math.PI * 2;
    spokePts.push(new THREE.Vector3(Math.cos(a) * 1.0, Math.sin(a) * 1.0, 0), new THREE.Vector3(Math.cos(a) * 1.43, Math.sin(a) * 1.43, 0));
  }
  core.add(new THREE.LineSegments(new THREE.BufferGeometry().setFromPoints(spokePts), mat.line(0.45)));

  const light = new THREE.PointLight("#ffb547", 10, 9, 1.6);
  light.position.set(0, 0.2, 1.2);
  system.add(light);

  /* --------------------------------------------------------- particles */
  const n = low ? 70 : 150;
  const pPos = new Float32Array(n * 3);
  const pSpeed = new Float32Array(n);
  for (let i = 0; i < n; i++) {
    const a = rand() * Math.PI * 2;
    const r = 1 + rand() * 3.2;
    pPos.set([Math.cos(a) * r, -2 + rand() * 5, Math.sin(a) * r], i * 3);
    pSpeed[i] = 0.15 + rand() * 0.35;
  }
  const pGeo = new THREE.BufferGeometry();
  pGeo.setAttribute("position", new THREE.BufferAttribute(pPos, 3));
  const motes = new THREE.Points(pGeo, particleMaterial(0.045, 0.6));
  root.add(motes);

  let tiltX = 0;
  let tiltY = 0;

  function update({ t, dt, progress, pointer }) {
    const s = reduced ? 0.15 : 1;
    const enter = clamp01(1 + progress * 1.6); // 0 far below → 1 near centre
    const exit = clamp01(progress * 1.4);

    tiltX = damp(tiltX, pointer.inside ? -pointer.y * 0.18 : 0, 3, dt);
    tiltY = damp(tiltY, pointer.inside ? pointer.x * 0.35 : 0, 3, dt);

    root.rotation.set(tiltX + exit * 0.4, tiltY + (1 - enter) * -0.9, 0);
    root.position.y = (1 - enter) * -1.2 + exit * 0.6;
    root.scale.setScalar((0.82 + enter * 0.18) * (camera.aspect < 0.85 ? 0.82 : 1));

    // gimbals: each spins on its own axis like a mechanical instrument
    gA.rotation.set(0.35 + Math.sin(t * 0.3 * s) * 0.15, t * 0.25 * s, 0);
    gimbalA.rotation.z = t * 0.2 * s;
    gB.rotation.set(Math.PI / 2 - 0.4, 0.5 + t * 0.12 * s, 0);
    gimbalB.rotation.z = -t * 0.32 * s;
    gC.rotation.set(-0.25, 0, t * 0.5 * s);
    gimbalC.rotation.x = Math.PI / 2 + Math.sin(t * 0.5 * s) * 0.5;
    arcs.rotation.z = -t * 0.18 * s;

    core.rotation.y = Math.sin(t * 0.45 * s) * 0.55;
    core.position.y = Math.sin(t * 0.8) * 0.06;
    gear.rotation.z = t * 0.6 * s;

    orbitNodes.forEach(({ node, o }, i) => {
      const a = t * o.speed * s + i * 2;
      node.position.set(Math.cos(a) * o.a, 0, Math.sin(a) * o.b).applyEuler(o.tilt);
    });

    const arr = pGeo.attributes.position.array;
    for (let i = 0; i < n; i++) {
      arr[i * 3 + 1] += pSpeed[i] * dt * s;
      if (arr[i * 3 + 1] > 3) arr[i * 3 + 1] = -2;
    }
    pGeo.attributes.position.needsUpdate = true;

    camera.lookAt(0, 0.05, 0);
  }

  return { scene, camera, update };
}

