"use client";
import { useEffect, useRef, useState, type ChangeEvent, type FormEvent } from "react";
import { personal, GITHUB_URL, LINKEDIN_URL, whatsappLink, contactCopy, CONTACT_EMAIL, AUDIT_SUBJECT, WEB3FORMS_KEY } from "@/data/portfolio";
import { useSceneView } from "@/lib/engine-context";
import { useReveal } from "@/lib/reveal";
import { PREFILL_EVENT, type PrefillDetail } from "@/lib/contact-events";
import { SectionMarker } from "@/components/Chrome";
import Magnetic from "@/components/Magnetic";
import Icon, { type IconName } from "@/components/Icon";

type Mode = "project" | "audit";
type Status = "idle" | "sending" | "sent" | "handoff" | "error";
interface Values {
  name: string;
  email: string;
  website: string;
  subject: string;
  message: string;
  honey: string;
}
type Field = Exclude<keyof Values, "honey">;
type Errors = Partial<Record<Field, string>>;

const EMPTY: Values = { name: "", email: "", website: "", subject: "", message: "", honey: "" };
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const URL_RE = /^(https?:\/\/)?([\w-]+\.)+[a-z]{2,}(\/\S*)?$/i;
/** Finds website addresses typed anywhere in free text (subject / message). */
const URL_IN_TEXT = /(?<![@\w.-])((?:https?:\/\/|www\.)[^\s,;)]+|[a-z0-9-]+(?:\.[a-z0-9-]+)*\.(?:com|net|org|pk|co|io|app|dev|uk|my|ae|us|ca|au|in|store|shop|online|site|info|biz|tech|ai|me)(?:\.[a-z]{2})?(?:\/[^\s,;)]*)?)/gi;

function findWebsites(...texts: string[]): string[] {
  const found = texts.flatMap((t) => t.match(URL_IN_TEXT) ?? []).map((u) => u.replace(/[.!?]+$/, ""));
  const seen = new Set<string>();
  return found.filter((u) => {
    if (u.includes("@")) return false;
    const key = u.toLowerCase().replace(/^https?:\/\//, "").replace(/^www\./, "").replace(/\/$/, "");
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

function validate(v: Values, mode: Mode): Errors {
  const e: Errors = {};
  if (v.name.trim().length < 2) e.name = "Please enter your name.";
  if (!EMAIL_RE.test(v.email.trim())) e.email = "Please enter a valid email address.";
  if (mode === "audit" && !URL_RE.test(v.website.trim())) e.website = "Please enter your website address (e.g. example.com).";
  if (mode === "project" && v.website.trim() && !URL_RE.test(v.website.trim())) e.website = "Please check the website address (e.g. example.com).";
  if (mode === "project" && v.subject.trim().length < 3) e.subject = "Please add a short subject.";
  if (mode === "project" && v.message.trim().length < 10) e.message = "Your message should be at least 10 characters.";
  return e;
}

function ContactCard({ icon, label, value, href, external }: { icon: IconName; label: string; value: string; href: string; external?: boolean }) {
  return (
    <a
      href={href}
      target={external ? "_blank" : undefined}
      rel={external ? "noreferrer" : undefined}
      className="group flex items-center gap-4 rounded-2xl border border-white/[0.07] bg-white/[0.015] p-4 transition-[transform,border-color,background-color] duration-500 hover:-translate-y-1 hover:border-gold/45 hover:bg-gold/[0.04]"
    >
      <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-gold/30 bg-gold/[0.06] text-gold transition-transform duration-500 group-hover:rotate-[-8deg] group-hover:scale-105">
        <Icon name={icon} size={18} />
      </span>
      <span className="min-w-0 flex-1">
        <span className="block font-mono text-[0.62rem] uppercase tracking-[0.22em] text-dim">{label}</span>
        <span className="block truncate text-[0.95rem] text-bone">{value}</span>
      </span>
      <Icon name="ArrowUpRight" size={17} className="shrink-0 text-dim transition-[transform,color] duration-500 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-gold" />
    </a>
  );
}

export default function Contact({ ready }: { ready: boolean }) {
  const root = useRef<HTMLElement>(null);
  const view = useRef<HTMLDivElement>(null);
  const form = useRef<HTMLFormElement>(null);
  const [mode, setMode] = useState<Mode>("project");
  const [values, setValues] = useState<Values>(EMPTY);
  const [errors, setErrors] = useState<Errors>({});
  const [status, setStatus] = useState<Status>("idle");
  useSceneView(view, "contact");
  useReveal(root, ready);

  useEffect(() => {
    const onPrefill = (e: Event) => {
      const d = (e as CustomEvent<PrefillDetail>).detail;
      setStatus("idle");
      setErrors({});
      setMode(d.audit ? "audit" : "project");
      setValues((v) => ({ ...v, subject: d.audit ? "" : d.subject }));
      window.setTimeout(() => form.current?.querySelector<HTMLInputElement>("input[name='name']")?.focus({ preventScroll: true }), 900);
    };
    window.addEventListener(PREFILL_EVENT, onPrefill);
    return () => window.removeEventListener(PREFILL_EVENT, onPrefill);
  }, []);

  const set = (k: keyof Values) => (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const value = e.target.value;
    setValues((v) => ({ ...v, [k]: value }));
    if (k !== "honey" && errors[k]) setErrors((er) => ({ ...er, [k]: undefined }));
  };

  const subjectLine = () => (mode === "audit" ? `${AUDIT_SUBJECT}: ${values.website.trim()}` : values.subject.trim());
  const websites = () => findWebsites(values.website, values.subject, values.message);
  const bodyText = () =>
    [
      mode === "audit" ? "Hi Fahad, I'd like a free SEO audit." : "Hi Fahad,",
      "",
      values.message.trim(),
      "",
      ...websites().map((w) => `Website: ${w}`),
      `Name: ${values.name.trim()}`,
      `Email: ${values.email.trim()}`,
    ]
      .filter((l, i, arr) => !(l === "" && arr[i - 1] === ""))
      .join("\n");
  const mailtoHref = () =>
    `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(`[Portfolio] ${subjectLine()}`)}&body=${encodeURIComponent(bodyText())}`;
  const whatsappHref = () => `${whatsappLink}?text=${encodeURIComponent(`${subjectLine()}\n\n${bodyText()}`)}`;

  const submit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const errs = validate(values, mode);
    setErrors(errs);
    const first = Object.keys(errs)[0];
    if (first) {
      e.currentTarget.querySelector<HTMLElement>(`[name="${first}"]`)?.focus();
      return;
    }
    if (values.honey) {
      setStatus("sent");
      return;
    }
    if (!WEB3FORMS_KEY) {
      // No email service configured: open the visitor's email app with everything pre-filled.
      window.location.href = mailtoHref();
      setStatus("handoff");
      return;
    }
    setStatus("sending");
    try {
      const res = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({
          access_key: WEB3FORMS_KEY,
          subject: `[Portfolio] ${subjectLine()}`,
          from_name: "Portfolio website",
          replyto: values.email.trim(),
          "Request type": mode === "audit" ? "Free SEO audit" : "Project enquiry",
          "Visitor name": values.name.trim(),
          "Visitor email": values.email.trim(),
          ...(websites().length ? { [mode === "audit" ? "Website to audit" : "Website(s)"]: websites().join("  ·  ") } : {}),
          message: bodyText(),
        }),
      });
      const data = (await res.json().catch(() => ({}))) as { success?: boolean; message?: string };
      if (res.ok && data.success) {
        setStatus("sent");
        setValues(EMPTY);
      } else {
        console.warn("[contact] Web3Forms:", res.status, data.message ?? data);
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  };

  const field = (name: Field, label: string, opts: { type?: string; autoComplete?: string; placeholder?: string; textarea?: boolean; optional?: boolean } = {}) => (
    <div>
      <label htmlFor={`f-${name}`} className="mb-2 flex justify-between font-mono text-[0.64rem] uppercase tracking-[0.2em] text-mute">
        {label}
        {opts.optional && <span className="normal-case tracking-normal text-dim">Optional</span>}
      </label>
      {opts.textarea ? (
        <textarea
          id={`f-${name}`}
          name={name}
          rows={4}
          value={values[name]}
          onChange={set(name)}
          aria-invalid={errors[name] ? "true" : "false"}
          aria-describedby={errors[name] ? `e-${name}` : undefined}
          className="field resize-none"
          placeholder={opts.placeholder}
        />
      ) : (
        <input
          id={`f-${name}`}
          name={name}
          type={opts.type ?? "text"}
          autoComplete={opts.autoComplete}
          value={values[name]}
          onChange={set(name)}
          aria-invalid={errors[name] ? "true" : "false"}
          aria-describedby={errors[name] ? `e-${name}` : undefined}
          className="field"
          placeholder={opts.placeholder}
        />
      )}
      {errors[name] && (
        <p id={`e-${name}`} className="mt-1.5 text-xs text-[#f08a6e]">
          {errors[name]}
        </p>
      )}
    </div>
  );

  return (
    <section id="contact" ref={root} aria-labelledby="contact-title" className="relative py-24 sm:py-32">
      <div className="mx-auto max-w-[1440px] px-5 sm:px-8 lg:px-12 xl:pl-24">
        <SectionMarker num="05" label="Contact" />
        <div className="mt-10 grid grid-cols-[minmax(0,1fr)] gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] xl:grid-cols-[minmax(0,1fr)_minmax(0,0.95fr)_minmax(0,1fr)] xl:gap-6">
          <div>
            <p className="eyebrow">Let&apos;s get in touch</p>
            <h2 id="contact-title" data-reveal="words" className="mt-4 font-display text-[clamp(2.6rem,6vw,4.8rem)] font-semibold leading-[0.95] tracking-[-0.03em]">
              Let&apos;s <span className="text-gold-grad">Connect</span>
            </h2>
            <p data-reveal="mask" className="mt-6 max-w-[460px] leading-relaxed text-mute">
              {contactCopy}
            </p>
            <div data-reveal="stagger" className="mt-9 grid grid-cols-[minmax(0,1fr)] gap-3">
              <ContactCard icon="Phone" label="Phone" value={personal.phone.display} href={`tel:${personal.phone.tel}`} />
              <ContactCard icon="MessageCircle" label="WhatsApp" value="Message me on WhatsApp" href={whatsappLink} external />
              <ContactCard icon="Mail" label="Email" value={personal.email} href={`mailto:${personal.email}`} />
              <ContactCard icon="Linkedin" label="LinkedIn" value="Connect on LinkedIn" href={LINKEDIN_URL} external />
              <ContactCard icon="Github" label="GitHub" value="View my GitHub profile" href={GITHUB_URL} external />
            </div>
          </div>

          <div className="relative order-last lg:col-span-2 xl:order-none xl:col-span-1">
            <div ref={view} data-fallback="contact" className="h-[380px] w-full sm:h-[480px] xl:h-full xl:min-h-[640px]" aria-hidden />
            <p className="pointer-events-none absolute inset-x-0 bottom-2 text-center font-mono text-[0.62rem] uppercase tracking-[0.25em] text-dim">
              Signal · Connection · Collaboration
            </p>
          </div>

          <div data-reveal="mask" className="panel gold-edge self-start p-6 sm:p-8">
            <div role="group" aria-label="What would you like?" className="grid grid-cols-2 gap-1 rounded-xl border border-white/10 p-1">
              {(
                [
                  ["project", "Send a message", "Send"],
                  ["audit", "Free SEO audit", "SearchCheck"],
                ] as const
              ).map(([m, label, icon]) => (
                <button
                  key={m}
                  type="button"
                  aria-pressed={mode === m}
                  onClick={() => {
                    setMode(m);
                    setErrors({});
                    if (status !== "sending") setStatus("idle");
                  }}
                  className={`flex h-10 items-center justify-center gap-2 rounded-lg font-mono text-[0.66rem] uppercase tracking-[0.16em] transition-colors ${
                    mode === m ? "bg-gold font-semibold text-ink" : "text-bone/75 hover:text-gold-2"
                  }`}
                >
                  <Icon name={icon} size={14} /> {label}
                </button>
              ))}
            </div>

            {status === "sent" ? (
              <div role="status" className="mt-8 rounded-2xl border border-gold/40 bg-gold/[0.05] p-6">
                <Icon name="Check" size={26} className="text-gold" />
                <p className="mt-3 font-display text-lg font-semibold">Thank you — message received!</p>
                <p className="mt-1 text-sm text-mute">I&apos;ll get back to you by email as soon as possible.</p>
                <button type="button" onClick={() => setStatus("idle")} className="link-underline mt-5 text-sm text-gold">
                  Send another message
                </button>
              </div>
            ) : (
              <form ref={form} noValidate onSubmit={submit} className="mt-6 space-y-4">
                {mode === "audit" && (
                  <p className="rounded-xl border border-gold/25 bg-gold/[0.04] p-3 text-[0.85rem] leading-relaxed text-bone/85">
                    Share your website and I&apos;ll review its on-page, technical and content SEO, then send you the top fixes — free, no
                    obligation.
                  </p>
                )}
                {field("name", "Your Name", { autoComplete: "name", placeholder: "Your full name" })}
                {field("email", "Your Email", { type: "email", autoComplete: "email", placeholder: "you@example.com" })}
                {mode === "audit" ? (
                  field("website", "Your Website", { type: "url", autoComplete: "url", placeholder: "example.com" })
                ) : (
                  <>
                    {field("subject", "Subject", { placeholder: "Website, software, SEO…" })}
                    {field("website", "Your Website", { type: "url", autoComplete: "url", placeholder: "example.com", optional: true })}
                  </>
                )}
                {field("message", mode === "audit" ? "Goals / keywords" : "Your Message", {
                  textarea: true,
                  optional: mode === "audit",
                  placeholder: mode === "audit" ? "What do you want to rank for?" : "Tell me a little about what you need",
                })}
                <input
                  type="text"
                  name="_honey"
                  tabIndex={-1}
                  autoComplete="off"
                  value={values.honey}
                  onChange={set("honey")}
                  className="hidden"
                  aria-hidden
                />
                <Magnetic strength={0.15} className="w-full">
                  <button type="submit" disabled={status === "sending"} className="btn btn-gold w-full disabled:opacity-70">
                    {status === "sending" ? (
                      <>
                        <Icon name="Loader2" size={17} className="animate-spin" /> Sending…
                      </>
                    ) : mode === "audit" ? (
                      <>
                        Request Free Audit <Icon name="SearchCheck" size={16} />
                      </>
                    ) : (
                      <>
                        Send Message <Icon name="Send" size={16} />
                      </>
                    )}
                  </button>
                </Magnetic>
                <div aria-live="polite" className="min-h-[1.25rem] text-sm">
                  {status === "handoff" && (
                    <div className="rounded-xl border border-gold/35 bg-gold/[0.05] p-4 text-bone/90">
                      <p className="font-semibold text-bone">Almost done — press “Send” in your email app.</p>
                      <p className="mt-1 text-mute">Your message is ready to {CONTACT_EMAIL}. Email app didn&apos;t open?</p>
                      <div className="mt-3 flex flex-wrap gap-2">
                        <a href={mailtoHref()} className="btn btn-ghost !h-10 !px-4 !text-xs">
                          <Icon name="Mail" size={15} /> Open email again
                        </a>
                        <a href={whatsappHref()} target="_blank" rel="noreferrer" className="btn btn-gold !h-10 !px-4 !text-xs">
                          <Icon name="MessageCircle" size={15} /> Send on WhatsApp
                        </a>
                      </div>
                    </div>
                  )}
                  {status === "error" && (
                    <p className="flex items-start gap-2 text-[#f08a6e]">
                      <Icon name="TriangleAlert" size={16} className="mt-0.5 shrink-0" />
                      <span>
                        Couldn&apos;t send right now.{" "}
                        <a href={mailtoHref()} className="underline underline-offset-4">
                          Email it instead
                        </a>{" "}
                        or{" "}
                        <a href={whatsappHref()} target="_blank" rel="noreferrer" className="underline underline-offset-4">
                          WhatsApp me
                        </a>
                        .
                      </span>
                    </p>
                  )}
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
