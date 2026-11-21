"use client";
import { createContext, useContext, useEffect, useRef, type RefObject } from "react";
import type { Engine, SceneInstance, SceneKey } from "@/three/types";

export const EngineContext = createContext<Engine | null>(null);

export function useEngine(): Engine | null {
  return useContext(EngineContext);
}

/** Registers a DOM element as a 3D view rendered by the shared engine. */
export function useSceneView(
  ref: RefObject<HTMLElement | null>,
  key: SceneKey,
  onReady?: (inst: SceneInstance | null) => void,
): Engine | null {
  const engine = useEngine();
  const cb = useRef(onReady);
  cb.current = onReady;
  useEffect(() => {
    if (!engine || !ref.current) return undefined;
    const el = ref.current;
    const remove = engine.addView(el, key, (inst) => {
      if (inst) requestAnimationFrame(() => requestAnimationFrame(() => el.setAttribute("data-live", "")));
      cb.current?.(inst);
    });
    return () => {
      el.removeAttribute("data-live");
      remove();
    };
  }, [engine, key, ref]);
  return engine;
}
