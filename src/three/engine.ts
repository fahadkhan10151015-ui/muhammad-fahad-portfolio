/**
 * One WebGL renderer for the whole site. Each section registers a DOM element
 * ("view"); every frame the engine renders that section's scene into exactly
 * that rectangle of a single fixed canvas (scissor test). One GL context, and
 * off-screen scenes cost nothing.
 */
import * as THREE from "three";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";
import { disposeObject } from "./common";
import { buildHero } from "./scenes/hero";
import { buildAbout } from "./scenes/about";
import { buildSkills } from "./scenes/skills";
import { buildContact } from "./scenes/contact";
import type { Engine, ExternalValues, SceneBuilder, SceneContext, SceneInstance, SceneKey } from "./types";
import type { Quality } from "@/lib/env";

const BUILDERS: Record<SceneKey, SceneBuilder> = {
  hero: buildHero,
  about: buildAbout,
  skills: buildSkills,
  contact: buildContact,
};

interface View {
  el: HTMLElement;
  key: SceneKey;
  onReady?: (inst: SceneInstance | null) => void;
  inst: SceneInstance | null;
  compiled: boolean;
  failed: boolean;
}

export function createEngine(canvas: HTMLCanvasElement, opts: { quality: Quality; reduced: boolean }): Engine {
  const { quality, reduced } = opts;
  const renderer = new THREE.WebGLRenderer({
    canvas,
    antialias: quality !== "low",
    alpha: true,
    powerPreference: "high-performance",
    stencil: false,
  });
  // Resolution caps keep fill-rate (the main GPU cost) under control.
  const maxDpr = quality === "high" ? 1.5 : 1.25;
  const deviceDpr = Math.min(window.devicePixelRatio || 1, maxDpr);
  let dpr = deviceDpr;
  renderer.setPixelRatio(dpr);
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.05;
  renderer.setClearColor(0x000000, 0);
  renderer.autoClear = false;

  const pmrem = new THREE.PMREMGenerator(renderer);
  const envMap = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
  pmrem.dispose();

  const ctx: SceneContext = { renderer, envMap, quality, reduced };
  const views = new Set<View>();
  const pointer = { x: -9999, y: -9999, active: false };
  const external: Partial<Record<SceneKey, ExternalValues>> = {};

  const onPointer = (e: PointerEvent) => {
    pointer.x = e.clientX;
    pointer.y = e.clientY;
    pointer.active = true;
  };
  const onLeave = () => {
    pointer.active = false;
  };
  window.addEventListener("pointermove", onPointer, { passive: true });
  window.addEventListener("pointerdown", onPointer, { passive: true });
  document.addEventListener("pointerleave", onLeave);

  // Scenes are built lazily as their section approaches the viewport.
  const io = new IntersectionObserver(
    (entries) => {
      for (const en of entries) {
        if (!en.isIntersecting) continue;
        for (const v of views) if (v.el === en.target && !v.inst && !v.failed) buildView(v);
      }
    },
    { rootMargin: "120% 0px 120% 0px" },
  );

  function buildView(v: View) {
    try {
      const inst = BUILDERS[v.key](ctx);
      v.inst = inst;
      inst.scene.environment = envMap;
      inst.camera.aspect = Math.max(0.1, v.el.clientWidth / Math.max(1, v.el.clientHeight));
      inst.camera.updateProjectionMatrix();
      renderer
        .compileAsync(inst.scene, inst.camera)
        .catch(() => undefined)
        .then(() => {
          v.compiled = true;
          v.onReady?.(inst);
        });
    } catch (err) {
      console.error(`[3D] failed to build "${v.key}"`, err);
      v.failed = true;
      v.onReady?.(null);
    }
  }

  // ------------------------------------------------------------------ loop
  let raf = 0;
  let running = true;
  let lastT = performance.now();
  let elapsed = 0;
  let lastW = 0;
  let lastH = 0;
  let wasClear = false;
  let slowFrames = 0;
  let fastFrames = 0;
  let frameSkip = false;
  // Phones render 3D at 30 fps: smooth enough for ambient motion and keeps
  // the main thread free so scrolling never stutters.
  const halfRate = quality === "low";

  function frame() {
    raf = requestAnimationFrame(frame);
    if (!running) return;
    if (halfRate) {
      frameSkip = !frameSkip;
      if (frameSkip) return;
    }
    const now = performance.now();
    const dt = Math.min((now - lastT) / 1000, 0.066);
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

    const visible: [View, DOMRect][] = [];
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
      const inst = v.inst as SceneInstance;
      const { scene, camera } = inst;
      const progress = (H / 2 - (r.top + r.height / 2)) / (H / 2 + r.height / 2);
      const inside = pointer.active && pointer.x >= r.left && pointer.x <= r.right && pointer.y >= r.top && pointer.y <= r.bottom;
      const aspect = r.width / r.height;
      if (Math.abs(camera.aspect - aspect) > 0.001) {
        camera.aspect = aspect;
        camera.updateProjectionMatrix();
      }
      inst.update({
        t,
        dt,
        progress,
        pointer: {
          x: ((pointer.x - r.left) / r.width) * 2 - 1,
          y: -(((pointer.y - r.top) / r.height) * 2 - 1),
          inside,
          active: pointer.active,
        },
        rect: r,
        external: external[v.key] ?? {},
      });
      renderer.setViewport(r.left, H - r.bottom, r.width, r.height);
      renderer.setScissor(r.left, H - r.bottom, r.width, r.height);
      renderer.render(scene, camera);
    }

    // Adaptive resolution: protect the frame rate on slower GPUs.
    const budget = halfRate ? 1 / 22 : 1 / 45;
    if (dt > budget) slowFrames++;
    else slowFrames = Math.max(0, slowFrames - 1);
    fastFrames = dt < (halfRate ? 1 / 29 : 1 / 58) ? fastFrames + 1 : 0;
    if (slowFrames > 30 && dpr > 0.75) {
      dpr = Math.max(0.75, dpr - 0.25);
      renderer.setPixelRatio(dpr);
      lastW = 0;
      slowFrames = 0;
    } else if (fastFrames > 600 && dpr < deviceDpr) {
      dpr = Math.min(deviceDpr, dpr + 0.25);
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
    addView(el, key, onReady) {
      const v: View = { el, key, onReady, inst: null, compiled: false, failed: false };
      views.add(v);
      io.observe(el);
      return () => {
        io.unobserve(el);
        views.delete(v);
        if (v.inst) {
          v.inst.dispose?.();
          disposeObject(v.inst.scene);
        }
      };
    },
    setExternal(key, values) {
      external[key] = { ...(external[key] ?? {}), ...values };
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
