export type Quality = "high" | "medium" | "low";

export const isBrowser = typeof window !== "undefined";

export function prefersReducedMotion(): boolean {
  return isBrowser && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

export function hasFinePointer(): boolean {
  return isBrowser && window.matchMedia("(hover: hover) and (pointer: fine)").matches;
}

/** "high" desktop · "medium" tablet / modest desktop · "low" phones & weak devices */
export function getQuality(): Quality {
  if (!isBrowser) return "low";
  const w = window.innerWidth;
  const cores = navigator.hardwareConcurrency || 4;
  const mem = (navigator as Navigator & { deviceMemory?: number }).deviceMemory ?? 4;
  if (w < 768 || cores <= 2 || mem <= 2) return "low";
  if (w < 1100 || cores <= 4 || mem <= 4) return "medium";
  return "high";
}

export function supportsWebGL(): boolean {
  if (!isBrowser) return false;
  try {
    const c = document.createElement("canvas");
    return !!(c.getContext("webgl2") || c.getContext("webgl"));
  } catch {
    return false;
  }
}

/**
 * True only when WebGL runs on a real GPU. Software renderers (SwiftShader,
 * llvmpipe — used by headless test machines such as PageSpeed Insights and by
 * some low-end devices) render 3D on the CPU and freeze the page, so they get
 * the static fallback instead. Data-saver users get it too.
 * Add ?3d to the URL to force 3D for testing.
 */
export function hasHardwareWebGL(): boolean {
  if (!isBrowser) return false;
  if (new URLSearchParams(window.location.search).has("3d")) return supportsWebGL();
  const conn = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection;
  if (conn?.saveData) return false;
  try {
    const c = document.createElement("canvas");
    const opts = { failIfMajorPerformanceCaveat: true };
    const gl = (c.getContext("webgl2", opts) ?? c.getContext("webgl", opts)) as WebGLRenderingContext | null;
    if (!gl) return false;
    const info = gl.getExtension("WEBGL_debug_renderer_info");
    const renderer = String(info ? gl.getParameter(info.UNMASKED_RENDERER_WEBGL) : gl.getParameter(gl.RENDERER)).toLowerCase();
    gl.getExtension("WEBGL_lose_context")?.loseContext();
    return !/swiftshader|llvmpipe|softpipe|software|basic render/.test(renderer);
  } catch {
    return false;
  }
}
