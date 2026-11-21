"use client";
import { prefersReducedMotion } from "./env";

/** Smooth-scroll to a section and move keyboard focus there (no animation library needed). */
export function scrollToId(id: string) {
  const el = document.getElementById(id);
  if (!el) return;
  el.scrollIntoView({ behavior: prefersReducedMotion() ? "auto" : "smooth", block: "start" });
  el.setAttribute("tabindex", "-1");
  el.focus({ preventScroll: true });
}
