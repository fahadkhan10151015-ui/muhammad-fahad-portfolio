import { Suspense, lazy, useEffect } from "react";
import { BrowserRouter, Route, Routes, useLocation } from "react-router-dom";
import { MotionConfig, motion } from "framer-motion";
import Background from "./components/Background.jsx";
import Navbar from "./components/Navbar.jsx";
import Footer from "./components/Footer.jsx";
import FloatingWhatsApp from "./components/FloatingWhatsApp.jsx";
import PortfolioAssistant from "./components/PortfolioAssistant.jsx";
import Home from "./pages/Home.jsx";

// The home page loads with the app; the detail pages are separate files fetched only when visited.
const loadDetailPages = () =>
  Promise.all([import("./pages/SkillPage.jsx"), import("./pages/ExperiencePage.jsx"), import("./pages/HomeSections.jsx")]);
const SkillPage = lazy(() => import("./pages/SkillPage.jsx"));
const ExperiencePage = lazy(() => import("./pages/ExperiencePage.jsx"));
const NotFound = lazy(() => import("./pages/NotFound.jsx"));

/** Scrolls to the top on page changes, or to the #section when the address has one. */
function ScrollManager() {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    if (!hash) {
      window.scrollTo({ top: 0, behavior: "instant" });
      return;
    }
    const id = decodeURIComponent(hash.slice(1));
    let tries = 0;
    let timer;
    const scroll = () => {
      const el = document.getElementById(id);
      if (el) el.scrollIntoView({ block: "start", behavior: "instant" });
      else if (tries++ < 50) timer = setTimeout(scroll, 60);
    };
    timer = setTimeout(scroll, 40);
    return () => clearTimeout(timer);
  }, [pathname, hash]);

  return null;
}

/** Soft fade + rise every time the page changes. */
function AnimatedRoutes() {
  const location = useLocation();

  // Once the home page has finished loading, quietly fetch the detail pages during idle time
  // so opening one feels instant.
  useEffect(() => {
    const idle = window.requestIdleCallback || ((cb) => setTimeout(cb, 2500));
    const cancel = window.cancelIdleCallback || clearTimeout;
    let handle;
    const start = () => {
      handle = idle(loadDetailPages, { timeout: 5000 });
    };
    if (document.readyState === "complete") start();
    else window.addEventListener("load", start, { once: true });
    return () => {
      window.removeEventListener("load", start);
      if (handle) cancel(handle);
    };
  }, []);
  return (
    <motion.div
      key={location.pathname}
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
    >
      <Suspense fallback={<div className="min-h-[100svh]" aria-hidden="true" />}>
        <Routes location={location}>
          <Route path="/" element={<Home />} />
          <Route path="/skills/:slug" element={<SkillPage />} />
          <Route path="/experience/:slug" element={<ExperiencePage />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
    </motion.div>
  );
}

export default function App() {
  return (
    // reducedMotion="user" turns off transform animations for visitors
    // who have "reduce motion" enabled in their OS settings.
    <MotionConfig reducedMotion="user">
      <BrowserRouter>
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[60] focus:rounded-full focus:bg-bone focus:px-4 focus:py-2 focus:text-sm focus:font-medium focus:text-ink"
        >
          Skip to content
        </a>

        <ScrollManager />
        <Background />
        <Navbar />

        <main id="main" tabIndex={-1} className="outline-none">
          <AnimatedRoutes />
        </main>

        <Footer />
        <FloatingWhatsApp />
        <PortfolioAssistant />
      </BrowserRouter>
    </MotionConfig>
  );
}
