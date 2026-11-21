import type * as THREE from "three";
import type { Quality } from "@/lib/env";

export type SceneKey = "hero" | "about" | "skills" | "contact";

export interface PointerState {
  /** -1..1 within the view (x right, y up) */
  x: number;
  y: number;
  inside: boolean;
  active: boolean;
}

export interface FrameState {
  t: number;
  dt: number;
  /** -1 below viewport → 0 centred → 1 scrolled past */
  progress: number;
  pointer: PointerState;
  rect: DOMRect;
  external: ExternalValues;
}

export interface ExternalValues {
  progress?: number;
}

export interface SceneContext {
  renderer: THREE.WebGLRenderer;
  envMap: THREE.Texture;
  quality: Quality;
  reduced: boolean;
}

export interface SceneInstance {
  scene: THREE.Scene;
  camera: THREE.PerspectiveCamera;
  update(state: FrameState): void;
  start?(): void;
  dispose?(): void;
}

export type SceneBuilder = (ctx: SceneContext) => SceneInstance;

export interface Engine {
  quality: Quality;
  addView(el: HTMLElement, key: SceneKey, onReady?: (inst: SceneInstance | null) => void): () => void;
  setExternal(key: SceneKey, values: ExternalValues): void;
  dispose(): void;
}
