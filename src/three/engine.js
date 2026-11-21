/**
 * One WebGL renderer for the whole site.
 * Every section registers a DOM element ("view"); each frame the engine reads
 * the element's rectangle and renders that section's scene into exactly that
 * area of a single fixed canvas (scissor test). One GL context, no duplicated
 * resources, and off-screen scenes cost nothing.
 */
import * as THREE from "three";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";
import { disposeObject } from "./common";
import { buildHero } from "./scenes/hero";
import { buildAbout } from "./scenes/about";
import { buildSkills } from "./scenes/skills";
import { buildContact } from "./scenes/contact";

const BUILDERS = { hero: buildHero, about: buildAbout, skills: buildSkills, contact: buildContact };

export function createEngine(canvas, { quality = "high", reduced = false } = {}) {
  const renderer = new THREE.WebGLRenderer({
    canvas,
    antialias: quality !== "low",
    alpha: true,
    powerPreference: "high-performance",
    stencil: false,
  });
  const maxDpr = quality === "high" ? 1.75 : quality === "medium" ? 1.5 : 1.5;
  let dpr = Math.min(window.devicePixelRatio || 1, maxDpr);
  renderer.setPixelRatio(dpr);
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.05;
  renderer.setClearColor(0x000000, 0);
  renderer.autoClear = false;
  if (quality === "high") {
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  }

  const pmrem = new THREE.PMREMGenerator(renderer);
  const envMap = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
  pmrem.dispose();

  const ctx = { renderer, envMap, quality, reduced };
  const views = new Set();
  const pointer = { x: -9999, y: -9999, active: false };
  const external = {};

  const onPointer = (e) => {
    pointer.x = e.clientX;
    pointer.y = e.clientY;
    pointer.active = true;
  };
  const onLeave = () => (pointer.active = false);
  window.addEventListener("pointermove", onPointer, { passive: true });
  window.addEventListener("pointerdown", onPointer, { passive: true });
  document.addEventListener("pointerleave", onLeave);

  // Build scenes lazily when their element approaches the viewport.
  const io = new IntersectionObserver(
    (entries) => {
      for (const en of entries) {
        const v = [...views].find((vv) => vv.el === en.target);
        if (v) v.near = en.isIntersecting;
        if (v && en.isIntersecting && !v.inst) buildView(v);
      }
    },
    { rootMargin: "120% 0px 120% 0px" },
  );

  function buildView(v) {
    try {
      v.inst = BUILDERS[v.key](ctx);
      v.inst.scene.environment = envMap;
      v.inst.camera.aspect = Math.max(0.1, v.el.clientWidth / Math.max(1, v.el.clientHeight));
      v.inst.camera.updateProjectionMatrix();
      const compiled = renderer.compileAsync
        ? renderer.compileAsync(v.inst.scene, v.inst.camera)
        : Promise.resolve(renderer.compile(v.inst.scene, v.inst.camera));
      compiled
        .catch(() => {})
        .then(() => {
          v.compiled = true;
          v.onReady && v.onReady(v.inst);
        });
    } catch (err) {
      console.error(`[3D] failed to build "${v.key}"`, err);
      v.failed = true;
      v.onReady && v.onReady(null);
    }
  }

  // ---------------------------------------------------------------- loop
  let lastT = performance.now();
  let elapsed = 0;
  let raf = 0;
  let running = true;
  let lastW = 0;
  let lastH = 0;
  let wasClear = false;
  // adaptive resolution
  let slowFrames = 0;
  let fastFrames = 0;

  function frame() {
    raf = requestAnimationFrame(frame);
    if (!running) return;
    const now = performance.now();
    const dt = Math.min((now - lastT) / 1000, 0.05);
    lastT = now;
    elapsed += dt;
    const t = elapsed;

    const W = canvas.clientWidth;
    const H = canvas.clientHeight;
    if (W !== lastW || H !== lastH) {
      renderer.setSize(W, H, false);
      lastW = W;
      lastH = H;
    }

    const visible = [];
    for (const v of views) {
      if (!v.inst || !v.compiled) continue;
      const r = v.el.getBoundingClientRect();
      if (r.bottom <= 0 || r.top >= H || r.width < 2 || r.height < 2) continue;
      visible.push([v, r]);
    }

    if (!visible.length) {
      if (!wasClear) {
        renderer.setScissorTest(false);
        renderer.clear();
        wasClear = true;
      }
      return;
    }
    wasClear = false;

    renderer.setScissorTest(false);
    renderer.clear();
    renderer.setScissorTest(true);

    for (const [v, r] of visible) {
      const { scene, camera, update } = v.inst;
      // -1 (below viewport) → 0 (centred) → 1 (scrolled past)
      const progress = (H / 2 - (r.top + r.height / 2)) / (H / 2 + r.height / 2);
      const inside =
        pointer.active && pointer.x >= r.left && pointer.x <= r.right && pointer.y >= r.top && pointer.y <= r.bottom;
      const px = ((pointer.x - r.left) / r.width) * 2 - 1;
      const py = -(((pointer.y - r.top) / r.height) * 2 - 1);

      const aspect = r.width / r.height;
      if (Math.abs(camera.aspect - aspect) > 0.001) {
        camera.aspect = aspect;
        camera.updateProjectionMatrix();
        v.inst.resize && v.inst.resize(r.width, r.height);
      }

      update({
        t,
        dt,
        progress,
        pointer: { x: px, y: py, inside, active: pointer.active, clientX: pointer.x, clientY: pointer.y },
        rect: r,
        external: external[v.key] || {},
      });

      renderer.setViewport(r.left, H - r.bottom, r.width, r.height);
      renderer.setScissor(r.left, H - r.bottom, r.width, r.height);
      renderer.render(scene, camera);
    }

    // Adaptive pixel ratio: protect frame rate on slower GPUs.
    if (dt > 1 / 40) slowFrames++;
    else slowFrames = Math.max(0, slowFrames - 1);
    if (dt < 1 / 58) fastFrames++;
    else fastFrames = 0;
    if (slowFrames > 45 && dpr > 1) {
      dpr = Math.max(1, dpr - 0.25);
      renderer.setPixelRatio(dpr);
      lastW = 0;
      slowFrames = 0;
    } else if (fastFrames > 600 && dpr < Math.min(window.devicePixelRatio || 1, maxDpr)) {
      dpr = Math.min(maxDpr, dpr + 0.25);
      renderer.setPixelRatio(dpr);
      lastW = 0;
      fastFrames = 0;
    }
  }
  raf = requestAnimationFrame(frame);

  const onVis = () => {
    running = !document.hidden;
    if (running) lastT = performance.now();
  };
  document.addEventListener("visibilitychange", onVis);

  return {
    quality,
    /** Register a section element. Returns an unregister function. */
    addView(el, key, onReady) {
      const v = { el, key, onReady, inst: null, compiled: false, near: false };
      views.add(v);
      io.observe(el);
      return () => {
        io.unobserve(el);
        views.delete(v);
        if (v.inst) {
          v.inst.dispose && v.inst.dispose();
          disposeObject(v.inst.scene);
        }
      };
    },
    /** Values a section pushes into its scene (e.g. scroll-scrub progress). */
    setExternal(key, values) {
      external[key] = { ...(external[key] || {}), ...values };
    },
    dispose() {
      cancelAnimationFrame(raf);
      io.disconnect();
      window.removeEventListener("pointermove", onPointer);
      window.removeEventListener("pointerdown", onPointer);
      document.removeEventListener("pointerleave", onLeave);
      document.removeEventListener("visibilitychange", onVis);
      for (const v of views) if (v.inst) disposeObject(v.inst.scene);
      views.clear();
      envMap.dispose();
      renderer.dispose();
    },
  };
}
