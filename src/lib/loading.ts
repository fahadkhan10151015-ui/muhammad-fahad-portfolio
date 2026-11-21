/**
 * Real loading progress: every critical resource is a weighted task.
 * Progress = finished weight / total weight. A safety timeout guarantees the
 * visitor is never stuck on the loader.
 */
const TASKS = {
  fonts: { weight: 15, label: "Loading typography" },
  logo: { weight: 5, label: "Loading brand" },
  engine: { weight: 40, label: "Loading 3D engine" },
  scene: { weight: 25, label: "Building hero scene" },
  frame: { weight: 15, label: "Compiling shaders" },
} as const;

export type TaskName = keyof typeof TASKS;
type Listener = (progress: number, label: string) => void;

const state: Record<TaskName, number> = { fonts: 0, logo: 0, engine: 0, scene: 0, frame: 0 };
const listeners = new Set<Listener>();
let forced = false;
const names = Object.keys(TASKS) as TaskName[];

function total(): number {
  if (forced) return 1;
  let sum = 0;
  let max = 0;
  for (const k of names) {
    sum += TASKS[k].weight * state[k];
    max += TASKS[k].weight;
  }
  return sum / max;
}

function currentLabel(): string {
  if (forced) return "Entering digital space";
  for (const k of names) if (state[k] < 1) return TASKS[k].label;
  return "Entering digital space";
}

function emit() {
  const p = total();
  const l = currentLabel();
  listeners.forEach((fn) => fn(p, l));
}

export const loading = {
  report(task: TaskName, value = 1) {
    const v = Math.min(1, Math.max(state[task], value));
    if (v === state[task]) return;
    state[task] = v;
    emit();
  },
  done(task: TaskName) {
    this.report(task, 1);
  },
  forceComplete() {
    if (forced) return;
    forced = true;
    emit();
  },
  subscribe(fn: Listener): () => void {
    listeners.add(fn);
    fn(total(), currentLabel());
    return () => {
      listeners.delete(fn);
    };
  },
};

let started = false;
export function startLoading() {
  if (started) return;
  started = true;

  const fonts = ['600 1em "Sora Variable"', '400 1em "Manrope Variable"', '400 1em "JetBrains Mono"'];
  let loaded = 0;
  Promise.allSettled(
    fonts.map((f) =>
      document.fonts.load(f).then(() => {
        loaded++;
        loading.report("fonts", loaded / fonts.length);
      }),
    ),
  ).then(() => loading.done("fonts"));
  // Fonts swap in when ready; never hold the loader more than 800 ms for them.
  window.setTimeout(() => loading.done("fonts"), 800);

  const img = new Image();
  img.onload = img.onerror = () => loading.done("logo");
  img.src = "/logo.svg";

  // Safety net: never more than 10 s on the loader.
  window.setTimeout(() => loading.forceComplete(), 10000);
}
