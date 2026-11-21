"use client";
import { useEffect, useRef, useState } from "react";
import Loader from "./Loader";
import Navbar from "./Navbar";
import { ScrollProgress, SideIndicator } from "./Chrome";
import Hero from "@/sections/Hero";
import About from "@/sections/About";
import Skills from "@/sections/Skills";
import Projects from "@/sections/Projects";
import Contact from "@/sections/Contact";
import Footer from "@/sections/Footer";
import { EngineContext } from "@/lib/engine-context";
import { loading, startLoading } from "@/lib/loading";
import { getQuality, prefersReducedMotion, hasHardwareWebGL } from "@/lib/env";
import { ScrollTrigger } from "@/lib/motion";
import { navLinks, type SectionId } from "@/data/portfolio";
import type { Engine } from "@/three/types";

type Phase = "loading" | "exiting" | "ready";

// Created once per page load (guards against StrictMode double effects).
let enginePromise: Promise<Engine> | null = null;
function loadEngine(canvas: HTMLCanvasElement): Promise<Engine> {
  if (!enginePromise) {
    enginePromise = import("@/three/engine").then((m) => {
      loading.done("engine");
      return m.createEngine(canvas, { quality: getQuality(), reduced: prefersReducedMotion() });
    });
  }
  return enginePromise;
}

export default function Portfolio() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [engine, setEngine] = useState<Engine | null>(null);
  const [no3d, setNo3d] = useState(false);
  const [phase, setPhase] = useState<Phase>("loading");
  const [active, setActive] = useState<SectionId>("home");

  useEffect(() => {
    // always start at the top so the hero entrance is seen
    if ("scrollRestoration" in history) history.scrollRestoration = "manual";
    window.scrollTo(0, 0);
    startLoading();
    const canvas = canvasRef.current;
    const fallback = () => {
      setNo3d(true);
      document.documentElement.classList.add("no3d");
      loading.done("engine");
      loading.done("scene");
      loading.done("frame");
    };
    if (!canvas || !hasHardwareWebGL()) {
      fallback();
      return;
    }
    // Start the 3D engine once the browser is idle, so first paint is never blocked.
    const start = () =>
      loadEngine(canvas)
        .then(setEngine)
        .catch((err: unknown) => {
          console.error("[3D] engine unavailable", err);
          fallback();
        });
    const ric = (window as Window & { requestIdleCallback?: (cb: () => void, o?: { timeout: number }) => number }).requestIdleCallback;
    if (ric) ric(start, { timeout: 400 });
    else setTimeout(start, 60);
  }, []);

  useEffect(() => {
    if (phase !== "ready") return;
    document.body.classList.remove("is-loading");
    requestAnimationFrame(() => ScrollTrigger.refresh());
  }, [phase]);

  useEffect(() => {
    const els = navLinks.map((l) => document.getElementById(l.id)).filter((e): e is HTMLElement => !!e);
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => e.isIntersecting && setActive(e.target.id as SectionId));
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

      {!ready && <Loader onExitStart={() => setPhase("exiting")} onDone={() => setPhase("ready")} />}

      <a href="#main" className="fixed left-4 top-4 z-[120] -translate-y-24 rounded-full bg-gold px-4 py-2 text-sm font-semibold text-ink focus:translate-y-0">
        Skip to content
      </a>

      <Navbar active={active} ready={entering} />
      <SideIndicator active={active} />
      <ScrollProgress />

      <main id="main" className="relative z-10">
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
