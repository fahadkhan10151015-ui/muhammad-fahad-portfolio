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
