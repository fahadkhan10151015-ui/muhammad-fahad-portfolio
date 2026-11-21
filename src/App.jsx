import { useEffect, useRef, useState } from "react";
import Loader from "./components/Loader";
import Navbar from "./components/Navbar";
import { Cursor, ScrollProgress, SideIndicator } from "./components/Chrome";
import Hero from "./sections/Hero";
import About from "./sections/About";
import Skills from "./sections/Skills";
import Projects from "./sections/Projects";
import Contact from "./sections/Contact";
import Footer from "./sections/Footer";
import { EngineContext } from "./lib/engine";
import { loading, startLoading } from "./lib/loading";
import { getQuality, prefersReducedMotion, supportsWebGL } from "./lib/env";
import { startSmoothScroll, ScrollTrigger } from "./lib/motion";
import { navLinks } from "./data/portfolio";

// Created once per page load (guards against React StrictMode double effects).
let enginePromise = null;
function loadEngine(canvas) {
  if (!enginePromise) {
    enginePromise = import("./three/engine.js").then((m) => {
      loading.done("engine");
      return m.createEngine(canvas, { quality: getQuality(), reduced: prefersReducedMotion() });
    });
  }
  return enginePromise;
}

export default function App() {
  const canvasRef = useRef(null);
  const [engine, setEngine] = useState(null);
  const [no3d, setNo3d] = useState(false);
  const [phase, setPhase] = useState("loading"); // loading → exiting → ready
  const [active, setActive] = useState("home");

  useEffect(() => {
    document.getElementById("boot")?.remove();
    startLoading();
    if (!supportsWebGL()) {
      setNo3d(true);
      loading.forceComplete();
      return;
    }
    loadEngine(canvasRef.current)
      .then(setEngine)
      .catch((err) => {
        console.error("[3D] engine unavailable", err);
        setNo3d(true);
        loading.forceComplete();
      });
  }, []);

  useEffect(() => {
    if (phase !== "ready") return;
    document.body.classList.remove("is-loading");
    startSmoothScroll();
    requestAnimationFrame(() => ScrollTrigger.refresh());
  }, [phase]);

  // active section for navbar + side indicator
  useEffect(() => {
    const els = navLinks.map((l) => document.getElementById(l.id)).filter(Boolean);
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => e.isIntersecting && setActive(e.target.id));
      },
      { rootMargin: "-45% 0px -50% 0px" },
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  const ready = phase === "ready";
  const entering = phase !== "loading";

  return (
    <EngineContext.Provider value={engine}>
      <div className="bg-atmos" aria-hidden />
      <canvas
        ref={canvasRef}
        aria-hidden
        className="pointer-events-none fixed inset-0 z-0 h-full w-full"
        style={{ display: no3d ? "none" : "block" }}
      />

      {phase !== "ready" && <Loader onExitStart={() => setPhase("exiting")} onDone={() => setPhase("ready")} />}

      <a
        href="#main"
        className="fixed left-4 top-4 z-[120] -translate-y-24 rounded-full bg-gold px-4 py-2 text-sm font-semibold text-ink focus:translate-y-0"
      >
        Skip to content
      </a>

      <Navbar active={active} ready={entering} />
      <SideIndicator active={active} />
      <ScrollProgress />
      <Cursor />

      <main id="main" className="relative z-10" aria-hidden={!entering}>
        <Hero entering={entering} ready={ready} no3d={no3d} />
        <About ready={ready} />
        <Skills ready={ready} />
        <Projects ready={ready} />
        <Contact ready={ready} />
      </main>
      <Footer />
      <div className="grain" aria-hidden />
    </EngineContext.Provider>
  );
}
