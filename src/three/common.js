import * as THREE from "three";

/* Palette — black / gunmetal / gold. No cyan, violet or purple. */
export const C = {
  gold: new THREE.Color("#e6b04a"),
  goldHot: new THREE.Color("#ffcf6e"),
  goldDeep: new THREE.Color("#9c6a1c"),
  ember: new THREE.Color("#ff9a3c"),
  ink: new THREE.Color("#060608"),
  metal: new THREE.Color("#1b1b20"),
  metalLight: new THREE.Color("#2a2a31"),
  bone: new THREE.Color("#f4efe4"),
};

export const mat = {
  gunmetal: () =>
    new THREE.MeshStandardMaterial({ color: C.metal, metalness: 0.75, roughness: 0.38, envMapIntensity: 0.9 }),
  darkMatte: () =>
    new THREE.MeshStandardMaterial({ color: "#0e0e12", metalness: 0.4, roughness: 0.62, envMapIntensity: 0.6 }),
  gold: () =>
    new THREE.MeshStandardMaterial({
      color: "#d9a441",
      metalness: 1,
      roughness: 0.28,
      emissive: "#5a3a08",
      emissiveIntensity: 0.6,
      envMapIntensity: 1.2,
    }),
  goldEmissive: (intensity = 1.6) =>
    new THREE.MeshStandardMaterial({
      color: "#2a1d05",
      emissive: C.goldHot,
      emissiveIntensity: intensity,
      metalness: 0.2,
      roughness: 0.5,
    }),
  line: (opacity = 0.35, color = C.gold) =>
    new THREE.LineBasicMaterial({ color, transparent: true, opacity, depthWrite: false }),
};

let glowTex = null;
/** Soft radial glow texture (shared). */
export function glowTexture() {
  if (glowTex) return glowTex;
  const s = 128;
  const c = document.createElement("canvas");
  c.width = c.height = s;
  const g = c.getContext("2d");
  const grd = g.createRadialGradient(s / 2, s / 2, 0, s / 2, s / 2, s / 2);
  grd.addColorStop(0, "rgba(255,214,130,1)");
  grd.addColorStop(0.25, "rgba(240,176,74,0.55)");
  grd.addColorStop(0.6, "rgba(200,130,40,0.12)");
  grd.addColorStop(1, "rgba(0,0,0,0)");
  g.fillStyle = grd;
  g.fillRect(0, 0, s, s);
  glowTex = new THREE.CanvasTexture(c);
  glowTex.colorSpace = THREE.SRGBColorSpace;
  return glowTex;
}

let dotTex = null;
/** Round particle sprite (shared). */
export function dotTexture() {
  if (dotTex) return dotTex;
  const s = 64;
  const c = document.createElement("canvas");
  c.width = c.height = s;
  const g = c.getContext("2d");
  const grd = g.createRadialGradient(s / 2, s / 2, 0, s / 2, s / 2, s / 2);
  grd.addColorStop(0, "rgba(255,240,200,1)");
  grd.addColorStop(0.35, "rgba(255,200,110,0.8)");
  grd.addColorStop(1, "rgba(0,0,0,0)");
  g.fillStyle = grd;
  g.fillRect(0, 0, s, s);
  dotTex = new THREE.CanvasTexture(c);
  dotTex.colorSpace = THREE.SRGBColorSpace;
  return dotTex;
}

export function glowSprite(scale = 3, opacity = 0.8) {
  const s = new THREE.Sprite(
    new THREE.SpriteMaterial({
      map: glowTexture(),
      color: C.gold,
      transparent: true,
      opacity,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    }),
  );
  s.scale.setScalar(scale);
  return s;
}

export function particleMaterial(size = 0.06, opacity = 0.9) {
  return new THREE.PointsMaterial({
    size,
    map: dotTexture(),
    color: C.goldHot,
    transparent: true,
    opacity,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
    sizeAttenuation: true,
  });
}

/**
 * Text label rendered to a canvas texture → crisp sprite that lives in 3D
 * (no DOM work per frame).
 */
export function labelSprite(text, { size = 0.32, color = "#f4efe4", border = true, mono = true } = {}) {
  const pad = 26;
  const fontPx = 46;
  const font = `${mono ? "500" : "600"} ${fontPx}px ${mono ? '"JetBrains Mono", monospace' : '"Sora Variable", sans-serif'}`;
  const m = document.createElement("canvas").getContext("2d");
  m.font = font;
  const tw = Math.ceil(m.measureText(text).width);
  const w = tw + pad * 2;
  const h = fontPx + pad * 1.4;
  const c = document.createElement("canvas");
  c.width = w;
  c.height = h;
  const g = c.getContext("2d");
  if (border) {
    const r = h / 2.6;
    g.fillStyle = "rgba(10,10,13,0.82)";
    g.strokeStyle = "rgba(230,176,74,0.75)";
    g.lineWidth = 3;
    g.beginPath();
    g.roundRect(2, 2, w - 4, h - 4, r);
    g.fill();
    g.stroke();
  }
  g.font = font;
  g.fillStyle = color;
  g.textBaseline = "middle";
  g.textAlign = "center";
  g.fillText(text, w / 2, h / 2 + 2);
  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 4;
  const sprite = new THREE.Sprite(
    new THREE.SpriteMaterial({ map: tex, transparent: true, depthWrite: false }),
  );
  sprite.scale.set((size * w) / h, size, 1);
  sprite.renderOrder = 10;
  return sprite;
}

export function circleLine(radius, segments = 128, material) {
  const pts = [];
  for (let i = 0; i <= segments; i++) {
    const a = (i / segments) * Math.PI * 2;
    pts.push(new THREE.Vector3(Math.cos(a) * radius, 0, Math.sin(a) * radius));
  }
  return new THREE.Line(new THREE.BufferGeometry().setFromPoints(pts), material);
}

export const damp = (a, b, lambda, dt) => a + (b - a) * (1 - Math.exp(-lambda * dt));
export const clamp01 = (v) => Math.min(1, Math.max(0, v));
export const easeOutCubic = (t) => 1 - Math.pow(1 - t, 3);
export const easeInOut = (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);

/** Standard three-point lighting shared by every scene (consistent world). */
export function addLights(scene, { key = 2.2, rim = 1.4 } = {}) {
  scene.add(new THREE.HemisphereLight("#fff3dd", "#0a0806", 0.35));
  const k = new THREE.DirectionalLight("#fff1d6", key);
  k.position.set(-4, 7, 6);
  scene.add(k);
  const r = new THREE.DirectionalLight("#ffb347", rim);
  r.position.set(6, 2, -6);
  scene.add(r);
  return k;
}

/** Recursively dispose a scene graph. */
export function disposeObject(root) {
  root.traverse((o) => {
    if (o.geometry) o.geometry.dispose();
    const m = o.material;
    if (m) (Array.isArray(m) ? m : [m]).forEach((mm) => {
      if (mm.map && mm.map !== glowTex && mm.map !== dotTex) mm.map.dispose();
      mm.dispose();
    });
  });
}

/** Small deterministic PRNG so scenes look the same on every load. */
export function mulberry(a) {
  return function () {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
