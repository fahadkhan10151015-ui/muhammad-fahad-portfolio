/**
 * SKILLS — 3D Technology Network / Architecture.
 * A layered hexagonal structure: technology modules dock onto three tiers,
 * cables route data between them and pulses travel along the pathways.
 * Assembly is scrubbed by scroll (pinned section on desktop).
 */
import * as THREE from "three";
import { C, mat, addLights, labelSprite, particleMaterial, glowSprite, damp, clamp01, easeOutCubic, mulberry } from "../common";
import { networkNodes } from "../../data/portfolio";

const TIERS = [
  { y: 1.55, r: 2.25, count: 4, rot: 0 },
  { y: 0, r: 3.05, count: 6, rot: Math.PI / 6 },
  { y: -1.55, r: 2.55, count: 5, rot: 0 },
];

export function buildSkills({ quality, reduced }) {
  const low = quality === "low";
  const rand = mulberry(42);
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(36, 1, 0.1, 60);
  camera.position.set(0, 2.4, 11);
  addLights(scene, { key: 2.2, rim: 1.6 });

  const root = new THREE.Group();
  scene.add(root);

  /* -------------------------------------------------- the architecture */
  const pillarGeo = new THREE.CylinderGeometry(0.3, 0.3, 4.4, 6);
  const pillar = new THREE.Mesh(pillarGeo, mat.gunmetal());
  root.add(pillar);
  root.add(new THREE.LineSegments(new THREE.EdgesGeometry(pillarGeo), mat.line(0.5)));
  const spine = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, 4.6, 8), mat.goldEmissive(2.4));
  root.add(spine);
  const crown = new THREE.Mesh(new THREE.OctahedronGeometry(0.32), mat.gold());
  crown.position.y = 2.55;
  root.add(crown);
  const crownGlow = glowSprite(2.2, 0.5);
  crown.add(crownGlow);

  const plateMat = new THREE.MeshStandardMaterial({
    color: "#101015",
    metalness: 0.9,
    roughness: 0.25,
    transparent: true,
    opacity: 0.55,
    depthWrite: false,
  });
  const plates = TIERS.map((tier) => {
    const g = new THREE.CylinderGeometry(tier.r, tier.r, 0.05, 6);
    const p = new THREE.Mesh(g, plateMat);
    p.position.y = tier.y - 0.32;
    p.rotation.y = tier.rot;
    p.add(new THREE.LineSegments(new THREE.EdgesGeometry(g), mat.line(0.38)));
    root.add(p);
    return p;
  });

  /* -------------------------------------------------------------- nodes */
  const geos = [
    new THREE.BoxGeometry(0.4, 0.4, 0.4),
    new THREE.OctahedronGeometry(0.3),
    new THREE.CylinderGeometry(0.24, 0.24, 0.34, 6),
  ];
  const edges = geos.map((g) => new THREE.EdgesGeometry(g));
  const nodeMat = new THREE.MeshStandardMaterial({ color: "#1c1c22", metalness: 0.85, roughness: 0.3 });
  const nodes = [];
  let ni = 0;
  TIERS.forEach((tier, ti) => {
    for (let j = 0; j < tier.count; j++) {
      const label = networkNodes[ni];
      if (!label) break;
      const a = (j / tier.count) * Math.PI * 2 + tier.rot + ti * 0.4;
      const target = new THREE.Vector3(Math.cos(a) * tier.r * 0.8, tier.y, Math.sin(a) * tier.r * 0.8);
      const group = new THREE.Group();
      const kind = ni % 3;
      const m = new THREE.Mesh(geos[kind], nodeMat);
      const e = new THREE.LineSegments(edges[kind], mat.line(0.9, C.goldHot));
      const dot = new THREE.Mesh(new THREE.SphereGeometry(0.06, 10, 8), mat.goldEmissive(3));
      dot.position.y = 0.32;
      const lbl = labelSprite(label, { size: low ? 0.36 : 0.3 });
      lbl.position.y = 0.66;
      group.add(m, e, dot, lbl);
      root.add(group);
      nodes.push({ group, mesh: m, label: lbl, target, tier: ti, delay: ni / networkNodes.length, spin: (rand() - 0.5) * 0.8 });
      ni++;
    }
  });

  /* ------------------------------------------------------------- cables */
  const cables = [];
  function addCable(a, b, lift, opacity) {
    const mid = a.clone().lerp(b, 0.5);
    mid.y += lift;
    const curve = new THREE.QuadraticBezierCurve3(a.clone(), mid, b.clone());
    const pts = curve.getPoints(28);
    const geo = new THREE.BufferGeometry().setFromPoints(pts);
    const line = new THREE.Line(geo, mat.line(opacity));
    root.add(line);
    cables.push({ curve, geo, count: pts.length });
    return cables.length - 1;
  }
  const nodeCables = nodes.map(() => []);
  nodes.forEach((n, i) => {
    // node → spine
    nodeCables[i].push(addCable(n.target, new THREE.Vector3(0, n.target.y - 0.1, 0), -0.4, 0.35));
    // node → next node in the same tier
    const next = nodes.find((m, k) => k > i && m.tier === n.tier);
    const first = nodes.find((m) => m.tier === n.tier);
    const other = next || first;
    if (other && other !== n) nodeCables[i].push(addCable(n.target, other.target, 0.25, 0.22));
  });
  // cross-tier links
  for (let i = 0; i < nodes.length; i++) {
    const n = nodes[i];
    const below = nodes.filter((m) => m.tier === n.tier + 1);
    if (!below.length) continue;
    let best = below[0];
    for (const m of below) if (m.target.distanceTo(n.target) < best.target.distanceTo(n.target)) best = m;
    nodeCables[i].push(addCable(n.target, best.target, 0, 0.18));
  }

  /* ------------------------------------------------------------- pulses */
  const pulseN = low ? 18 : 40;
  const pPos = new Float32Array(pulseN * 3);
  const pGeo = new THREE.BufferGeometry();
  pGeo.setAttribute("position", new THREE.BufferAttribute(pPos, 3));
  const pulses = new THREE.Points(pGeo, particleMaterial(0.16, 1));
  pulses.frustumCulled = false;
  root.add(pulses);
  const pulseState = Array.from({ length: pulseN }, () => ({ c: (rand() * cables.length) | 0, t: rand(), s: 0.25 + rand() * 0.5, dir: rand() < 0.5 ? 1 : -1 }));
  const tmp = new THREE.Vector3();

  // ambient dust
  const dustN = low ? 60 : 140;
  const dPos = new Float32Array(dustN * 3);
  for (let i = 0; i < dustN; i++) dPos.set([(rand() - 0.5) * 12, (rand() - 0.5) * 7, (rand() - 0.5) * 8], i * 3);
  const dGeo = new THREE.BufferGeometry();
  dGeo.setAttribute("position", new THREE.BufferAttribute(dPos, 3));
  const dust = new THREE.Points(dGeo, particleMaterial(0.035, 0.45));
  scene.add(dust);

  const light = new THREE.PointLight("#ffb547", 8, 10, 1.6);
  root.add(light);

  let build = 0;
  let tiltX = 0;
  let tiltY = 0;

  function update({ t, dt, progress, pointer, external }) {
    const s = reduced ? 0.15 : 1;
    // scroll-scrubbed assembly (pinned on desktop) or viewport-driven elsewhere
    const target = typeof external.progress === "number" ? clamp01(0.4 + external.progress * 0.9) : clamp01((progress + 0.75) / 0.7);
    build = reduced ? 1 : damp(build, target, 6, dt);
    const scrollRot = typeof external.progress === "number" ? external.progress * 1.4 : progress * 0.6;

    tiltX = damp(tiltX, pointer.inside ? -pointer.y * 0.12 : 0, 3, dt);
    tiltY = damp(tiltY, pointer.inside ? pointer.x * 0.3 : 0, 3, dt);
    root.rotation.set(0.12 + tiltX, t * 0.06 * s + scrollRot + tiltY, 0);
    const mobile = camera.aspect < 0.85;
    root.scale.setScalar(mobile ? 0.78 : 1);

    plates.forEach((p, i) => {
      const k = easeOutCubic(clamp01(build * 1.8 - i * 0.15));
      p.scale.set(Math.max(0.001, k), 1, Math.max(0.001, k));
    });

    nodes.forEach((n, i) => {
      const k = easeOutCubic(clamp01((build - n.delay * 0.55) / 0.35));
      n.group.position.set(n.target.x * k, n.target.y, n.target.z * k);
      n.group.scale.setScalar(Math.max(0.001, k));
      n.mesh.rotation.y = t * n.spin * s;
      n.label.material.opacity = clamp01(k * 1.5 - 0.5);
      const ck = clamp01((build - n.delay * 0.55 - 0.25) / 0.3);
      nodeCables[i].forEach((ci) => cables[ci].geo.setDrawRange(0, Math.floor(cables[ci].count * ck)));
    });

    for (let i = 0; i < pulseN; i++) {
      const p = pulseState[i];
      p.t += dt * p.s * s;
      if (p.t > 1) {
        p.t = 0;
        p.c = (Math.random() * cables.length) | 0;
        p.dir = Math.random() < 0.5 ? 1 : -1;
      }
      const cab = cables[p.c];
      const visible = cab.geo.drawRange.count >= cab.count;
      cab.curve.getPoint(p.dir > 0 ? p.t : 1 - p.t, tmp);
      pPos[i * 3] = tmp.x;
      pPos[i * 3 + 1] = visible ? tmp.y : -99;
      pPos[i * 3 + 2] = tmp.z;
    }
    pGeo.attributes.position.needsUpdate = true;

    crown.rotation.y = t * 0.8 * s;
    crownGlow.material.opacity = 0.35 + Math.sin(t * 2) * 0.1;
    dust.rotation.y = t * 0.02;

    camera.position.set(0, 2.4 + (1 - build) * 1.5, (mobile ? 13.5 : 11) + (1 - build) * 2);
    camera.lookAt(0, 0, 0);
  }

  return { scene, camera, update };
}
