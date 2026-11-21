/**
 * CONTACT — 3D Communication Tower / Signal Hub.
 * A lattice transmission tower with antenna mast and dishes. Signal waves
 * radiate from the transmission node; data pulses travel to orbiting
 * communication nodes (IDEAS, MESSAGE, COLLABORATION …).
 */
import * as THREE from "three";
import type { FrameState, SceneContext, SceneInstance } from "../types";
import { C, mat, addLights, labelSprite, particleMaterial, glowSprite, circleLine, damp, clamp01, mulberry } from "../common";

const LABELS = ["IDEAS", "MESSAGE", "COLLABORATION", "CREATION", "INNOVATION", "SUCCESS"];
const BASE_Y = -2.3;
const TOP_Y = 1.9;

function strut(a: THREE.Vector3, b: THREE.Vector3, radius: number, material: THREE.Material): THREE.Mesh {
  const len = a.distanceTo(b);
  const geo = new THREE.CylinderGeometry(radius, radius, len, 6, 1, true);
  geo.translate(0, len / 2, 0);
  geo.rotateX(Math.PI / 2);
  const m = new THREE.Mesh(geo, material);
  m.position.copy(a);
  m.lookAt(b);
  return m;
}

export function buildContact({ quality, reduced }: SceneContext): SceneInstance {
  const low = quality === "low";
  const rand = mulberry(99);
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(36, 1, 0.1, 60);
  camera.position.set(0, 0.8, 11);
  addLights(scene, { key: 2.2, rim: 2 });

  const root = new THREE.Group();
  scene.add(root);
  const tower = new THREE.Group();
  root.add(tower);

  const metal = mat.gunmetal();
  const braceMat = new THREE.MeshStandardMaterial({ color: "#3a3127", metalness: 0.9, roughness: 0.35 });

  /* ------------------------------------------------------- lattice tower */
  const legAt = (y: number, i: number): THREE.Vector3 => {
    const k = (y - BASE_Y) / (TOP_Y - BASE_Y);
    const w = 0.95 * (1 - k) + 0.2 * k;
    const a = (i / 4) * Math.PI * 2 + Math.PI / 4;
    return new THREE.Vector3(Math.cos(a) * w, y, Math.sin(a) * w);
  };
  for (let i = 0; i < 4; i++) tower.add(strut(legAt(BASE_Y, i), legAt(TOP_Y, i), 0.05, metal));

  // braces: one InstancedMesh of unit struts
  const segments = 7;
  const braceGeo = new THREE.CylinderGeometry(0.014, 0.014, 1, 4, 1, true);
  const braceCount = segments * 4 * 3;
  const braces = new THREE.InstancedMesh(braceGeo, braceMat, braceCount);
  const d = new THREE.Object3D();
  const up = new THREE.Vector3(0, 1, 0);
  let bi = 0;
  const setStrut = (a: THREE.Vector3, b: THREE.Vector3) => {
    const dir = b.clone().sub(a);
    d.position.copy(a).addScaledVector(dir, 0.5);
    d.quaternion.setFromUnitVectors(up, dir.clone().normalize());
    d.scale.set(1, dir.length(), 1);
    d.updateMatrix();
    braces.setMatrixAt(bi++, d.matrix);
  };
  for (let s = 0; s < segments; s++) {
    const y0 = BASE_Y + ((TOP_Y - BASE_Y) * s) / segments;
    const y1 = BASE_Y + ((TOP_Y - BASE_Y) * (s + 1)) / segments;
    for (let i = 0; i < 4; i++) {
      const j = (i + 1) % 4;
      setStrut(legAt(y0, i), legAt(y1, j));
      setStrut(legAt(y0, j), legAt(y1, i));
      setStrut(legAt(y1, i), legAt(y1, j));
    }
  }
  tower.add(braces);

  // service decks
  [-0.6, 0.9].forEach((y) => {
    const k = (y - BASE_Y) / (TOP_Y - BASE_Y);
    const w = 0.95 * (1 - k) + 0.2 * k;
    const deck = new THREE.Mesh(new THREE.CylinderGeometry(w * 1.75, w * 1.75, 0.05, 24), metal);
    deck.position.y = y;
    tower.add(deck);
    const ring = circleLine(w * 1.75, 48, mat.line(0.55));
    ring.position.y = y + 0.03;
    tower.add(ring);
  });

  // dishes
  const dishGeo = new THREE.SphereGeometry(0.42, 24, 12, 0, Math.PI * 2, 0, Math.PI / 3.2);
  const dishMat = new THREE.MeshStandardMaterial({ color: "#4a3f2c", metalness: 0.9, roughness: 0.32, side: THREE.DoubleSide, envMapIntensity: 0.6 });
  const dishes = new THREE.Group();
  dishes.position.y = 0.95;
  [0, Math.PI * 0.95].forEach((a, i) => {
    const holder = new THREE.Group();
    holder.rotation.y = a;
    const dish = new THREE.Mesh(dishGeo, dishMat);
    dish.position.set(0.75, i ? -0.2 : 0.15, 0);
    dish.rotation.z = Math.PI / 2 + 0.3;
    const feed = new THREE.Mesh(new THREE.CylinderGeometry(0.01, 0.01, 0.42, 4), braceMat);
    feed.rotation.z = Math.PI / 2;
    feed.position.set(0.97, dish.position.y, 0);
    holder.add(dish, feed);
    dishes.add(holder);
  });
  tower.add(dishes);

  // mast + transmission node
  tower.add(strut(new THREE.Vector3(0, TOP_Y - 0.3, 0), new THREE.Vector3(0, TOP_Y + 1.2, 0), 0.035, metal));
  const node = new THREE.Mesh(new THREE.OctahedronGeometry(0.2), mat.goldEmissive(3.2));
  node.position.y = TOP_Y + 0.55;
  tower.add(node);
  const nodeGlow = glowSprite(2.6, 0.7);
  node.add(nodeGlow);
  const tip = new THREE.Mesh(new THREE.SphereGeometry(0.045, 10, 8), mat.goldEmissive(4));
  tip.position.y = TOP_Y + 1.22;
  tower.add(tip);
  const tipGlow = glowSprite(0.8, 0.9);
  tip.add(tipGlow);
  const light = new THREE.PointLight("#ffb547", 12, 10, 1.6);
  light.position.copy(node.position);
  tower.add(light);

  // base
  const basePlate = new THREE.Mesh(new THREE.CylinderGeometry(2.2, 2.4, 0.12, 64), new THREE.MeshStandardMaterial({ color: "#09090c", metalness: 0.7, roughness: 0.42, envMapIntensity: 0.25 }));
  basePlate.position.y = BASE_Y - 0.06;
  root.add(basePlate);
  [1.4, 2.2, 3.2, 4.3].forEach((r, i) => {
    const l = circleLine(r, 128, mat.line(0.35 - i * 0.06));
    l.position.y = BASE_Y + 0.005;
    root.add(l);
  });

  /* ---------------------------------------------------- signal waves */
  const waveGeo = new THREE.RingGeometry(0.96, 1, 96).rotateX(-Math.PI / 2);
  const waves = Array.from({ length: low ? 3 : 4 }, (_, i) => {
    const m = new THREE.Mesh(
      waveGeo,
      new THREE.MeshBasicMaterial({ color: C.goldHot, transparent: true, opacity: 0, blending: THREE.AdditiveBlending, depthWrite: false, side: THREE.DoubleSide }),
    );
    m.position.y = node.position.y;
    tower.add(m);
    return { m, offset: i / (low ? 3 : 4) };
  });
  // vertical broadcast arcs (front-facing)
  const arcGeo = new THREE.TorusGeometry(1, 0.012, 4, 48, Math.PI * 0.55);
  const arcs = Array.from({ length: 3 }, (_, i) => {
    const m = new THREE.Mesh(arcGeo, new THREE.MeshBasicMaterial({ color: C.gold, transparent: true, opacity: 0, depthWrite: false }));
    m.position.y = node.position.y;
    m.rotation.z = Math.PI / 2 - Math.PI * 0.275;
    tower.add(m);
    const m2 = m.clone();
    m2.material = m.material;
    m2.rotation.z = -Math.PI / 2 - Math.PI * 0.275;
    tower.add(m2);
    return { m, m2, offset: i / 3 };
  });

  /* ----------------------------------------- communication nodes */
  const comms = LABELS.map((text, i) => {
    const a = (i / LABELS.length) * Math.PI * 2 + 0.3;
    const r = 3.3 + (i % 2) * 0.5;
    const y = -1.3 + ((i * 1.37) % 3.2);
    const pos = new THREE.Vector3(Math.cos(a) * r, y, Math.sin(a) * r);
    const g = new THREE.Group();
    g.position.copy(pos);
    const n = new THREE.Mesh(new THREE.OctahedronGeometry(0.11), mat.gold());
    const glow = glowSprite(0.9, 0.55);
    const lbl = labelSprite(text, { size: low ? 0.3 : 0.26 });
    lbl.position.y = 0.38;
    g.add(n, glow, lbl);
    root.add(g);
    // link from tower (node height) to comm node
    const from = new THREE.Vector3(0, i % 2 ? 0.9 : node.position.y, 0);
    const mid = from.clone().lerp(pos, 0.5);
    mid.y += 0.9;
    const curve = new THREE.QuadraticBezierCurve3(from, mid, pos);
    const line = new THREE.Line(new THREE.BufferGeometry().setFromPoints(curve.getPoints(32)), mat.line(0.28));
    root.add(line);
    return { g, n, curve, phase: rand() };
  });
  // ring linking comm nodes
  const ringPts = comms.map((c) => c.g.position.clone());
  ringPts.push(ringPts[0].clone());
  root.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints(new THREE.CatmullRomCurve3(ringPts, true).getPoints(160)), mat.line(0.1)));

  // data pulses along links (both directions)
  const pulseN = comms.length * (low ? 2 : 3);
  const pPos = new Float32Array(pulseN * 3);
  const pGeo = new THREE.BufferGeometry();
  pGeo.setAttribute("position", new THREE.BufferAttribute(pPos, 3));
  const pulses = new THREE.Points(pGeo, particleMaterial(0.16, 1));
  pulses.frustumCulled = false;
  root.add(pulses);
  const pState = Array.from({ length: pulseN }, (_, i) => ({ c: i % comms.length, t: rand(), s: 0.3 + rand() * 0.35, out: i % 2 === 0 }));

  // rising signal particles
  const riseN = low ? 50 : 120;
  const rPos = new Float32Array(riseN * 3);
  for (let i = 0; i < riseN; i++) {
    const a = rand() * Math.PI * 2;
    const r = 0.3 + rand() * 1.4;
    rPos.set([Math.cos(a) * r, BASE_Y + rand() * 5, Math.sin(a) * r], i * 3);
  }
  const rGeo = new THREE.BufferGeometry();
  rGeo.setAttribute("position", new THREE.BufferAttribute(rPos, 3));
  const rise = new THREE.Points(rGeo, particleMaterial(0.04, 0.6));
  root.add(rise);

  const tmp = new THREE.Vector3();
  let rotY = 0;
  let tiltX = 0;

  function update({ t, dt, progress, pointer }: FrameState) {
    const s = reduced ? 0.2 : 1;
    const enter = clamp01(1 + progress * 1.5);
    const mobile = camera.aspect < 0.85;
    rotY = damp(rotY, pointer.inside ? pointer.x * 0.5 : 0, 2.5, dt);
    tiltX = damp(tiltX, pointer.inside ? -pointer.y * 0.1 : 0, 2.5, dt);
    root.rotation.set(0.08 + tiltX, t * 0.12 * s + rotY, 0);
    root.position.y = (1 - enter) * -1.5;
    root.scale.setScalar((mobile ? 0.72 : 1) * (0.85 + enter * 0.15));
    dishes.rotation.y = -t * 0.25 * s;
    node.rotation.y = t * 1.2 * s;
    nodeGlow.material.opacity = 0.55 + Math.sin(t * 3) * 0.15;
    tipGlow.material.opacity = 0.5 + 0.5 * Math.max(0, Math.sin(t * 4));

    waves.forEach((w) => {
      const k = ((t * 0.35 * s + w.offset) % 1 + 1) % 1;
      w.m.scale.setScalar(0.2 + k * 4.2);
      w.m.material.opacity = (1 - k) * 0.55;
    });
    arcs.forEach((a) => {
      const k = ((t * 0.5 * s + a.offset) % 1 + 1) % 1;
      const sc = 0.4 + k * 1.6;
      a.m.scale.setScalar(sc);
      a.m2.scale.setScalar(sc);
      a.m.material.opacity = (1 - k) * 0.7;
    });

    comms.forEach((c, i) => {
      c.g.position.y += Math.sin(t * 0.9 + i) * 0.0015;
      c.n.rotation.y = t * 0.8;
    });
    for (let i = 0; i < pulseN; i++) {
      const p = pState[i];
      p.t += dt * p.s * s;
      if (p.t > 1) p.t -= 1;
      comms[p.c].curve.getPoint(p.out ? p.t : 1 - p.t, tmp);
      pPos.set([tmp.x, tmp.y, tmp.z], i * 3);
    }
    pGeo.attributes.position.needsUpdate = true;

    for (let i = 0; i < riseN; i++) {
      rPos[i * 3 + 1] += dt * 0.5 * s;
      if (rPos[i * 3 + 1] > TOP_Y + 1.5) rPos[i * 3 + 1] = BASE_Y;
    }
    rGeo.attributes.position.needsUpdate = true;

    camera.position.set(0, 0.8, mobile ? 13.5 : 11);
    camera.lookAt(0, 0.1, 0);
  }

  return { scene, camera, update };
}
