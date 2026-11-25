"use client";
/**
 * Phone & tablet versions of the 3D scenes (< 1024 px).
 * Built with CSS 3D transforms + SVG instead of WebGL: rendered at the screen's
 * native resolution (always sharp, text included), animated only with
 * transform/opacity (runs on the GPU compositor, smooth while scrolling) and
 * paused whenever off screen. Desktop keeps the WebGL scenes.
 */
import { useEffect, useRef, type CSSProperties, type ReactNode } from "react";
import { networkNodes } from "@/data/portfolio";

type Vars = CSSProperties & Record<`--${string}`, string | number>;

/** Wrapper: lg:hidden, pauses its animations while off screen. */
function Stage({ children, className = "" }: { children: ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return undefined;
    const io = new IntersectionObserver(([en]) => el.toggleAttribute("data-paused", !en?.isIntersecting), { rootMargin: "80px" });
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return (
    <div ref={ref} aria-hidden className={`m3d pointer-events-none lg:hidden ${className}`}>
      {children}
    </div>
  );
}

/* ================================================================ HERO */
const ROWS = [
  [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2],
  [1.5, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1.5],
  [1.75, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2.25],
  [2.25, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2.75],
  [1.5, 1.5, 1.5, 6.5, 1.5, 1.5, 2],
];
const ACCENT = new Set(["0-0", "0-14", "2-12", "4-3"]);
// keys that "type" in a travelling wave (deterministic so server & client match)
const LIVE = new Set(
  ROWS.flatMap((row, r) => row.map((_, i) => `${r}-${i}`)).filter((k, n) => (n * 7 + 3) % 4 === 0),
);

function Keyboard() {
  return (
    <div className="m3d-kb-wrap">
      <div className="m3d-kb">
        {ROWS.map((row, r) => (
          <div key={r} className="m3d-row">
            {row.map((w, i) => {
              const id = `${r}-${i}`;
              const live = LIVE.has(id);
              const style: Vars = { flexGrow: w, "--d": `${((i * 0.19 + r * 0.31) % 2.8).toFixed(2)}s` };
              return <span key={id} className={`m3d-key${live ? " is-live" : ""}`} data-a={ACCENT.has(id) || undefined} style={style} />;
            })}
          </div>
        ))}
      </div>
      <div className="m3d-kb-glow" />
    </div>
  );
}

function Core({ className = "" }: { className?: string }) {
  return (
    <div className={`m3d-core ${className}`}>
      <div className="m3d-core-glow" />
      <div className="m3d-core-ring m3d-spin-a">
        <i />
      </div>
      <div className="m3d-core-ring m3d-spin-b">
        <i />
      </div>
      <div className="m3d-core-ring m3d-spin-c">
        <i />
      </div>
      <div className="m3d-core-shell" />
      <div className="m3d-gem" />
      {[0, 1, 2, 3, 4, 5].map((k) => (
        <b key={k} className="m3d-spark" style={{ "--k": k } as Vars} />
      ))}
    </div>
  );
}

export function MobileHeroVisual() {
  return (
    <Stage className="absolute inset-0 overflow-hidden">
      <Core className="absolute right-[6%] top-[59%] h-[104px] w-[104px] sm:right-[10%] sm:top-[52%] sm:h-[160px] sm:w-[160px]" />
      <div className="absolute inset-x-[-4%] bottom-[7%] sm:inset-x-[8%]">
        <Keyboard />
      </div>
    </Stage>
  );
}

/* =============================================================== ABOUT */
export function MobileAboutVisual() {
  return (
    <Stage className="relative flex h-full w-full items-center justify-center overflow-hidden">
      <div className="m3d-about">
        <div className="m3d-platform">
          <span />
          <span />
          <span />
        </div>
        <div className="m3d-gear m3d-gear-a" />
        <div className="m3d-gear m3d-gear-c">
          <i />
        </div>
        <div className="m3d-orbit m3d-orbit-a">
          <i />
        </div>
        <div className="m3d-lens">
          <span>&lt;/&gt;</span>
        </div>
      </div>
    </Stage>
  );
}

/* ============================================================== SKILLS */
const TIERS = [
  { y: 20, rx: 26, ry: 7, count: 4, off: 0.4 },
  { y: 50, rx: 36, ry: 9, count: 6, off: 0 },
  { y: 80, rx: 31, ry: 8, count: 5, off: 0.7 },
];

export function MobileSkillsVisual() {
  let n = 0;
  const nodes = TIERS.flatMap((t, ti) =>
    Array.from({ length: t.count }, (_, j) => {
      const a = (j / t.count) * Math.PI * 2 + t.off;
      const label = networkNodes[n++] ?? "";
      const x = 50 + Math.cos(a) * t.rx;
      const y = t.y + Math.sin(a) * t.ry;
      return { label, x, y, ty: t.y, front: Math.sin(a) > -0.2, tier: ti, k: n };
    }),
  );
  return (
    <Stage className="relative h-full w-full overflow-hidden">
      {/* tier plates + spine */}
      {TIERS.map((t) => (
        <div
          key={t.y}
          className="m3d-plate"
          style={{ left: `${50 - t.rx - 6}%`, width: `${(t.rx + 6) * 2}%`, top: `${t.y + 3}%`, height: `${(t.ry + 4) * 2}%`, marginTop: `-${t.ry + 4}%` }}
        />
      ))}
      <div className="m3d-spine" />
      <div className="m3d-crown" />
      {/* cables with flowing data */}
      <svg className="absolute inset-0 h-full w-full" viewBox="0 0 100 100" preserveAspectRatio="none">
        {nodes.map((nd) => (
          <g key={nd.label}>
            <line x1={nd.x} y1={nd.y} x2={50} y2={nd.ty} className="m3d-cable" />
            <line x1={nd.x} y1={nd.y} x2={50} y2={nd.ty} className="m3d-flow" style={{ animationDelay: `${(nd.k * 0.37) % 2}s` }} />
          </g>
        ))}
      </svg>
      {/* technology nodes (real text: always sharp) */}
      {nodes.map((nd) => (
        <span
          key={nd.label}
          className={`m3d-node ${nd.front ? "" : "is-back"}`}
          style={{ left: `${nd.x}%`, top: `${nd.y}%`, "--d": `${((nd.k * 0.41) % 3).toFixed(2)}s` } as Vars}
        >
          {nd.label}
        </span>
      ))}
    </Stage>
  );
}

/* ============================================================= CONTACT */
const LABELS: [string, number, number][] = [
  ["IDEAS", 16, 24],
  ["MESSAGE", 84, 20],
  ["COLLABORATION", 22, 52],
  ["CREATION", 82, 48],
  ["INNOVATION", 20, 80],
  ["SUCCESS", 82, 76],
];

function Tower() {
  // lattice tower in SVG: crisp at any resolution
  const segs = 7;
  const top = 18;
  const bottom = 92;
  const legX = (y: number, side: -1 | 1) => 50 + side * (4 + ((y - top) / (bottom - top)) * 14);
  const ys = Array.from({ length: segs + 1 }, (_, s) => top + ((bottom - top) * s) / segs);
  return (
    <svg className="absolute inset-0 h-full w-full" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid meet">
      <defs>
        <linearGradient id="m3d-leg" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#d9a441" />
          <stop offset="1" stopColor="#3a3a42" />
        </linearGradient>
      </defs>
      {/* base rings */}
      <ellipse cx="50" cy="93" rx="30" ry="4" className="m3d-ring-line" />
      <ellipse cx="50" cy="93" rx="21" ry="2.8" className="m3d-ring-line is-strong" />
      {/* legs */}
      <line x1={legX(top, -1)} y1={top} x2={legX(bottom, -1)} y2={bottom} stroke="url(#m3d-leg)" strokeWidth="1.1" />
      <line x1={legX(top, 1)} y1={top} x2={legX(bottom, 1)} y2={bottom} stroke="url(#m3d-leg)" strokeWidth="1.1" />
      {/* braces */}
      {ys.slice(0, -1).map((y0, s) => {
        const y1 = ys[s + 1] ?? bottom;
        return (
          <g key={s} className="m3d-brace">
            <line x1={legX(y0, -1)} y1={y0} x2={legX(y1, 1)} y2={y1} />
            <line x1={legX(y0, 1)} y1={y0} x2={legX(y1, -1)} y2={y1} />
            <line x1={legX(y1, -1)} y1={y1} x2={legX(y1, 1)} y2={y1} />
          </g>
        );
      })}
      {/* decks + dishes */}
      <line x1={legX(44, -1) - 4} y1="44" x2={legX(44, 1) + 4} y2="44" className="m3d-deck" />
      <line x1={legX(66, -1) - 5} y1="66" x2={legX(66, 1) + 5} y2="66" className="m3d-deck" />
      <path d="M38 40 q-6 3 0 7" className="m3d-dish" />
      <path d="M62 38 q6 3 0 7" className="m3d-dish" />
      {/* mast */}
      <line x1="50" y1={top} x2="50" y2="5" stroke="#8d8d93" strokeWidth="0.8" />
    </svg>
  );
}

export function MobileContactVisual() {
  return (
    <Stage className="relative h-full w-full overflow-hidden">
      <div className="absolute left-1/2 top-[3%] h-[94%] w-[60%] -translate-x-1/2">
        <Tower />
        {/* transmission node + signal waves */}
        <div className="m3d-signal" style={{ left: "50%", top: "9%" }}>
          <span />
          <span />
          <span />
          <b />
        </div>
      </div>
      {/* links to the communication nodes, with data flowing out */}
      <svg className="absolute inset-0 h-full w-full" viewBox="0 0 100 100" preserveAspectRatio="none">
        {LABELS.map(([, x, y], i) => {
          const fromY = 20 + i * 8;
          const d = `M50 ${fromY} Q ${(50 + x) / 2} ${Math.min(fromY, y) - 8} ${x} ${y}`;
          return (
            <g key={i}>
              <path d={d} className="m3d-cable" fill="none" />
              <path d={d} className="m3d-flow" fill="none" style={{ animationDelay: `${i * 0.35}s` }} />
            </g>
          );
        })}
      </svg>
      {LABELS.map(([text, x, y], i) => (
        <span key={text} className="m3d-node is-label" style={{ left: `${x}%`, top: `${y}%`, "--d": `${i * 0.5}s` } as Vars}>
          {text}
        </span>
      ))}
    </Stage>
  );
}
