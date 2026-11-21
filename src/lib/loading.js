/**
 * Real loading progress.
 * Every critical resource registers a weighted task; progress is the sum of
 * the finished weights (plus partial progress reported by a task).
 * A safety timeout guarantees the visitor is never stuck on the loader.
 */
const TASKS = {
  fonts: { weight: 15, label: "Loading typography" },
  logo: { weight: 5, label: "Loading brand" },
  engine: { weight: 40, label: "Loading 3D engine" },
  scene: { weight: 25, label: "Building hero scene" },
  frame: { weight: 15, label: "Compiling shaders" },
};

const state = Object.fromEntries(Object.keys(TASKS).map((k) => [k, 0]));
const listeners = new Set();
let forced = false;

function total() {
  if (forced) return 1;
  let sum = 0;
  let max = 0;
  for (const [k, t] of Object.entries(TASKS)) {
    sum += t.weight * state[k];
    max += t.weight;
  }
  return sum / max;
}

function currentLabel() {
  for (const [k, t] of Object.entries(TASKS)) if (state[k] < 1) return t.label;
  return "Entering digital space";
}

function emit() {
  const p = total();
  const label = forced ? "Entering digital space" : currentLabel();
  listeners.forEach((fn) => fn(p, label));
}

export const loading = {
  /** value 0..1 for partial progress of a task */
  report(task, value = 1) {
    if (!(task in state)) return;
    const v = Math.min(1, Math.max(state[task], value));
    if (v === state[task]) return;
    state[task] = v;
    emit();
  },
  done(task) {
    this.report(task, 1);
  },
  /** finish everything (3D unavailable, errors, or timeout) */
  forceComplete() {
    if (forced) return;
    forced = true;
    emit();
  },
  get progress() {
    return total();
  },
  subscribe(fn) {
    listeners.add(fn);
    fn(total(), currentLabel());
    return () => listeners.delete(fn);
  },
};

/** Kick off the tasks that do not depend on React components. */
let started = false;
export function startLoading() {
  if (started) return;
  started = true;

  // Fonts
  const fontLoads = [
    '600 1em "Sora Variable"',
    '400 1em "Manrope Variable"',
    '400 1em "JetBrains Mono"',
  ].map((f) =>
    document.fonts
      ? document.fonts.load(f).then(() => loading.report("fonts", state.fonts + 1 / 3))
      : Promise.resolve(),
  );
  Promise.allSettled(fontLoads).then(() => loading.done("fonts"));

  // Logo
  const img = new Image();
  img.onload = img.onerror = () => loading.done("logo");
  img.src = "/logo.svg";

  // Safety net: never more than 12 s on the loader.
  setTimeout(() => loading.forceComplete(), 12000);
}
