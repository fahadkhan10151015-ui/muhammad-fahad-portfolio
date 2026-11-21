"use client";
import { AUDIT_SUBJECT } from "@/data/portfolio";
import { scrollToId } from "./motion";

export interface PrefillDetail {
  subject: string;
  audit?: boolean;
}

export const PREFILL_EVENT = "contact:prefill";

/** Pre-fill the contact form subject and scroll to it. */
export function prefillContact(detail: PrefillDetail) {
  window.dispatchEvent(new CustomEvent<PrefillDetail>(PREFILL_EVENT, { detail }));
  scrollToId("contact");
}

export function requestAudit() {
  prefillContact({ subject: AUDIT_SUBJECT, audit: true });
}
