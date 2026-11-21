export const isBrowser = typeof window !== "undefined";

export function prefersReducedMotion() {
  return isBrowser && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

export function hasFinePointer() {
  return isBrowser && window.matchMedia("(hover: hover) and (pointer: fine)").matches;
}

/** "high" desktop · "medium" tablet / weak desktop · "low" phones */
export function getQuality() {
  if (!isBrowser) return "low";
  const w = window.innerWidth;
  const cores = navigator.hardwareConcurrency || 4;
  const mem = navigator.deviceMemory || 4;
  if (w < 768) return "low";
  if (w < 1100 || cores <= 4 || mem <= 4) return "medium";
  return "high";
}

export function supportsWebGL() {
  if (!isBrowser) return false;
  try {
    const c = document.createElement("canvas");
    return !!(c.getContext("webgl2") || c.getContext("webgl"));
  } catch {
    return false;
  }
}
