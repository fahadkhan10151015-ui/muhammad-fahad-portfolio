import { Suspense, lazy, useEffect, useState } from "react";
import Hero from "../sections/Hero.jsx";
import { personalInfo } from "../data/portfolio.js";

const loadSections = () => import("./HomeSections.jsx");
const HomeSections = lazy(loadSections);

export default function Home() {
  // The hero paints first. The sections below it are downloaded and rendered right after,
  // so the first screen doesn't wait for the whole page. A #section link renders them at once.
  const [ready, setReady] = useState(() => window.location.hash.length > 1);

  useEffect(() => {
    document.title = `${personalInfo.name} | Full-Stack & Mobile Developer`;
    if (ready) return;
    let timer;
    const raf = requestAnimationFrame(() => {
      timer = setTimeout(() => setReady(true), 0); // after the first frame has been painted
    });
    return () => {
      cancelAnimationFrame(raf);
      clearTimeout(timer);
    };
  }, [ready]);

  return (
    <>
      <Hero />
      {ready && (
        <Suspense fallback={<div className="min-h-[100svh]" aria-hidden="true" />}>
          <HomeSections />
        </Suspense>
      )}
    </>
  );
}