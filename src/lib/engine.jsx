import { createContext, useContext, useEffect, useRef } from "react";

export const EngineContext = createContext(null);

export function useEngine() {
  return useContext(EngineContext);
}

/**
 * Registers a DOM element as a 3D view rendered by the shared engine.
 * `onReady(instance)` fires once the scene is built and its shaders compiled.
 */
export function useSceneView(ref, key, onReady) {
  const engine = useEngine();
  const cb = useRef(onReady);
  cb.current = onReady;
  useEffect(() => {
    if (!engine || !ref.current) return undefined;
    return engine.addView(ref.current, key, (inst) => cb.current && cb.current(inst));
  }, [engine, key, ref]);
  return engine;
}
