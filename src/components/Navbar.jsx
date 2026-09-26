import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { Download, Menu, X } from "lucide-react";
import Container from "./Container.jsx";
import useActiveSection from "../hooks/useActiveSection.js";
import { WhatsAppIcon } from "./BrandIcons.jsx";
import { navLinks, personalInfo, whatsappLink } from "../data/portfolio.js";

const ease = [0.22, 1, 0.36, 1];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const onHome = pathname === "/";
  const homeActive = useActiveSection(navLinks.map((l) => l.id));
  // On skill / experience pages, highlight their parent section.
  const active = onHome ? homeActive : pathname.startsWith("/skills") ? "skills" : pathname.startsWith("/experience") ? "experience" : "";
  const hrefFor = (id) => (onHome ? `#${id}` : id === "home" ? "/" : `/#${id}`);

  // Close the mobile menu after any navigation.
  useEffect(() => setOpen(false), [pathname]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e) => e.key === "Escape" && setOpen(false);
    const onResize = () => window.innerWidth >= 1024 && setOpen(false);
    window.addEventListener("keydown", onKey);
    window.addEventListener("resize", onResize);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("resize", onResize);
    };
  }, [open]);

  const solid = scrolled || open;

  // Close the mobile menu first, then scroll, so the closing animation
  // doesn't interrupt the smooth scroll on mobile browsers.
  const goTo = (e, id) => {
    e.preventDefault();
    setOpen(false);
    if (!onHome) {
      navigate(id === "home" ? "/" : `/#${id}`);
      return;
    }
    requestAnimationFrame(() => {
      const target = document.getElementById(id);
      if (!target) return;
      target.scrollIntoView({ block: "start" });
      history.replaceState(null, "", `#${id}`);
    });
  };

  return (
    <motion.header
      initial={{ y: -16, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease }}
      className="fixed inset-x-0 top-0 z-50"
    >
      <div
        className={`border-b transition-[background-color,border-color,backdrop-filter] duration-300 ${
          open
            ? "border-white/10 bg-charcoal/95 backdrop-blur-xl"
            : solid
              ? "border-white/10 bg-charcoal/75 shadow-[0_10px_30px_-20px_rgb(0_0_0/0.9)] backdrop-blur-xl"
              : "border-transparent bg-transparent"
        }`}
      >
        <Container>
          <nav aria-label="Primary" className="flex h-16 items-center justify-between gap-4">
            <a href={hrefFor("home")} className="flex items-center gap-3 rounded-lg" onClick={(e) => goTo(e, "home")}>
              <span className="grid h-9 w-9 place-items-center rounded-[10px] border border-white/15 bg-linear-to-b from-steel to-graphite text-sm font-bold tracking-tight">
                {personalInfo.initials}
              </span>
              <span className="hidden text-[0.95rem] font-medium tracking-tight sm:inline">{personalInfo.name}</span>
              <span className="sr-only sm:hidden">{personalInfo.name}, back to top</span>
            </a>

            <ul className="hidden items-center gap-0.5 lg:flex">
              {navLinks.map((link) => {
                const isActive = active === link.id;
                return (
                  <li key={link.id}>
                    <a
                      href={hrefFor(link.id)}
                      onClick={(e) => goTo(e, link.id)}
                      aria-current={isActive ? "location" : undefined}
                      className={`relative block rounded-full px-3.5 py-2 text-sm transition-colors ${
                        isActive ? "text-bone" : "text-ash hover:text-bone"
                      }`}
                    >
                      {isActive && (
                        <motion.span
                          layoutId="nav-active"
                          className="absolute inset-0 rounded-full border border-white/15 bg-steel/70"
                          transition={{ type: "spring", stiffness: 420, damping: 36 }}
                        />
                      )}
                      <span className="relative">{link.label}</span>
                    </a>
                  </li>
                );
              })}
            </ul>

            <div className="flex items-center gap-2">
              <a
                href={whatsappLink}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`Chat on WhatsApp at ${personalInfo.whatsapp.display} (opens in a new tab)`}
                className="hidden h-10 w-10 place-items-center rounded-full border border-white/15 text-whatsapp transition-colors hover:border-whatsapp/50 hover:bg-white/[0.06] sm:grid"
              >
                <WhatsAppIcon className="h-[18px] w-[18px]" />
              </a>
              <a
                href={personalInfo.cvUrl}
                download={personalInfo.cvDownloadName}
                className="hidden min-h-10 items-center gap-2 rounded-full border border-white/15 px-4 text-sm font-medium text-bone transition-colors hover:border-white/30 hover:bg-white/[0.06] sm:inline-flex"
              >
                <Download className="h-4 w-4" aria-hidden="true" />
                Download CV
              </a>
              <button
                type="button"
                onClick={() => setOpen((v) => !v)}
                aria-label={open ? "Close menu" : "Open menu"}
                aria-expanded={open}
                aria-controls="mobile-menu"
                className="grid h-11 w-11 place-items-center rounded-full border border-white/10 text-bone lg:hidden"
              >
                {open ? <X className="h-5 w-5" aria-hidden="true" /> : <Menu className="h-5 w-5" aria-hidden="true" />}
              </button>
            </div>
          </nav>
        </Container>

        <AnimatePresence initial={false}>
          {open && (
            <motion.div
              id="mobile-menu"
              key="mobile-menu"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.28, ease }}
              className="overflow-hidden lg:hidden"
            >
              <Container className="pb-6 pt-2">
                <motion.ul
                  initial="hidden"
                  animate="show"
                  variants={{ show: { transition: { staggerChildren: 0.035 } } }}
                  className="divide-y divide-white/[0.06]"
                >
                  {navLinks.map((link) => (
                    <motion.li
                      key={link.id}
                      variants={{ hidden: { opacity: 0, x: -8 }, show: { opacity: 1, x: 0 } }}
                    >
                      <a
                        href={hrefFor(link.id)}
                        onClick={(e) => goTo(e, link.id)}
                        aria-current={active === link.id ? "location" : undefined}
                        className={`flex min-h-12 items-center justify-between text-lg ${
                          active === link.id ? "text-bone" : "text-ash"
                        }`}
                      >
                        {link.label}
                        {active === link.id && <span className="h-1.5 w-1.5 rounded-full bg-signal" aria-hidden="true" />}
                      </a>
                    </motion.li>
                  ))}
                </motion.ul>
                <div className="mt-5 grid gap-3 min-[420px]:grid-cols-2">
                  <a
                    href={personalInfo.cvUrl}
                    download={personalInfo.cvDownloadName}
                    onClick={() => setOpen(false)}
                    className="flex min-h-12 items-center justify-center gap-2 rounded-full bg-bone font-medium text-ink"
                  >
                    <Download className="h-4 w-4" aria-hidden="true" />
                    Download CV
                  </a>
                  <a
                    href={whatsappLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => setOpen(false)}
                    className="flex min-h-12 items-center justify-center gap-2 rounded-full border border-whatsapp/40 font-medium text-bone"
                  >
                    <WhatsAppIcon className="h-4 w-4 text-whatsapp" />
                    WhatsApp
                  </a>
                </div>
              </Container>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.header>
  );
}
