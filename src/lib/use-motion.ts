"use client";
import { useEffect, useState } from "react";

/**
 * GSAP (+ ScrollTrigger, SplitText) is loaded lazily, after first paint, so it
 * never delays the initial render. Components receive it via useMotion() and
 * simply skip their effects until it has arrived.
 */
export type Motion = typeof import("./motion");

let promise: Promise<Motion> | null = null;
export function loadMotion(): Promise<Motion> {
  if (!promise) promise = import("./motion");
  return promise;
}

export function useMotion(): Motion | null {
  const [motion, setMotion] = useState<Motion | null>(null);
  useEffect(() => {
    let alive = true;
    loadMotion().then((m) => alive && setMotion(m));
    return () => {
      alive = false;
    };
  }, []);
  return motion;
}
