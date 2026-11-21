import { useEffect, useRef, useState } from "react";
import { personal, GITHUB_URL, whatsappLink, contactCopy } from "../data/portfolio";
import { useSceneView } from "../lib/engine";
import { useReveal } from "../lib/reveal";
import { SectionMarker } from "../components/Chrome";
import Magnetic from "../components/Magnetic";
import Icon from "../components/Icon";

const EMPTY = { name: "", email: "", subject: "", message: "", company: "" };
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

function validate(v) {
  const e = {};
  if (v.name.trim().length < 2) e.name = "Please enter your name.";
  if (!EMAIL_RE.test(v.email.trim())) e.email = "Please enter a valid email address.";
  if (v.subject.trim().length < 3) e.subject = "Please add a short subject.";
  if (v.message.trim().length < 10) e.message = "Your message should be at least 10 characters.";
  return e;
}

function ContactCard({ icon, label, value, href, external }) {
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

export default function Contact({ ready }) {
  const root = useRef(null);
  const view = useRef(null);
  const [values, setValues] = useState(EMPTY);
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState("idle"); // idle | sending | sent | mailto | error
  useSceneView(view, "contact");
  useReveal(root, ready);

  useEffect(() => {
    const onPrefill = (e) => setValues((v) => ({ ...v, subject: e.detail?.subject || v.subject }));
    window.addEventListener("contact:prefill", onPrefill);
    return () => window.removeEventListener("contact:prefill", onPrefill);
  }, []);

  const set = (k) => (e) => {
    setValues((v) => ({ ...v, [k]: e.target.value }));
    if (errors[k]) setErrors((er) => ({ ...er, [k]: undefined }));
  };

  const openMail = () => {
    const body = `${values.message}\n\n— ${values.name} (${values.email})`;
    window.location.href = `mailto:${personal.email}?subject=${encodeURIComponent(values.subject)}&body=${encodeURIComponent(body)}`;
  };

  const submit = async (e) => {
    e.preventDefault();
    const errs = validate(values);
    setErrors(errs);
    if (Object.keys(errs).length) {
      const first = Object.keys(errs)[0];
      e.currentTarget.querySelector(`[name="${first}"]`)?.focus();
      return;
    }
    setStatus("sending");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      if (res.ok) {
        setStatus("sent");
        setValues(EMPTY);
        return;
      }
      if (res.status === 501 || res.status === 404) {
        // email service not configured → hand over to the visitor's mail app
        openMail();
        setStatus("mailto");
        return;
      }
      setStatus("error");
    } catch {
      openMail();
      setStatus("mailto");
    }
  };

  const field = (name, label, props = {}) => (
    <div>
      <label htmlFor={`f-${name}`} className="mb-2 block font-mono text-[0.64rem] uppercase tracking-[0.2em] text-mute">
        {label}
      </label>
      {props.textarea ? (
        <textarea
          id={`f-${name}`}
          name={name}
          rows={5}
          value={values[name]}
          onChange={set(name)}
          aria-invalid={errors[name] ? "true" : "false"}
          aria-describedby={errors[name] ? `e-${name}` : undefined}
          className="field resize-none"
          placeholder={props.placeholder}
        />
      ) : (
        <input
          id={`f-${name}`}
          name={name}
          type={props.type || "text"}
          autoComplete={props.autoComplete}
          value={values[name]}
          onChange={set(name)}
          aria-invalid={errors[name] ? "true" : "false"}
          aria-describedby={errors[name] ? `e-${name}` : undefined}
          className="field"
          placeholder={props.placeholder}
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
        <div className="mt-10 grid gap-10 lg:grid-cols-[1fr_1fr] xl:grid-cols-[1fr_0.95fr_1fr] xl:gap-6">
          {/* info */}
          <div>
            <p className="eyebrow">Let's get in touch</p>
            <h2 id="contact-title" data-reveal="words" className="mt-4 font-display text-[clamp(2.6rem,6vw,4.8rem)] font-semibold leading-[0.95] tracking-[-0.03em]">
              Let's <span className="text-gold-grad">Connect</span>
            </h2>
            <p data-reveal="mask" className="mt-6 max-w-[460px] leading-relaxed text-mute">
              {contactCopy}
            </p>
            <div data-reveal="stagger" className="mt-9 grid gap-3">
              <ContactCard icon="Phone" label="Phone" value={personal.phone.display} href={`tel:${personal.phone.tel}`} />
              <ContactCard icon="MessageCircle" label="WhatsApp" value="Message me on WhatsApp" href={whatsappLink} external />
              <ContactCard icon="Mail" label="Email" value={personal.email} href={`mailto:${personal.email}`} />
              <ContactCard icon="Github" label="GitHub" value="View my GitHub profile" href={GITHUB_URL} external />
            </div>
          </div>

          {/* communication tower */}
          <div className="relative order-last lg:col-span-2 xl:order-none xl:col-span-1">
            <div ref={view} className="h-[380px] w-full sm:h-[480px] xl:h-full xl:min-h-[640px]" aria-hidden />
            <p className="pointer-events-none absolute inset-x-0 bottom-2 text-center font-mono text-[0.62rem] uppercase tracking-[0.25em] text-dim">
              Signal · Connection · Collaboration
            </p>
          </div>

          {/* form */}
          <div data-reveal="mask" className="panel gold-edge self-start p-6 sm:p-8">
            <h3 className="flex items-center gap-3 font-mono text-[0.72rem] uppercase tracking-[0.25em] text-gold">
              <Icon name="Send" size={15} /> Send a message
            </h3>
            {status === "sent" ? (
              <div role="status" className="mt-8 rounded-2xl border border-gold/40 bg-gold/[0.05] p-6">
                <Icon name="Check" size={26} className="text-gold" />
                <p className="mt-3 font-display text-lg font-semibold">Message sent — thank you!</p>
                <p className="mt-1 text-sm text-mute">I'll get back to you as soon as possible.</p>
                <button type="button" onClick={() => setStatus("idle")} className="link-underline mt-5 text-sm text-gold">
                  Send another message
                </button>
              </div>
            ) : (
              <form noValidate onSubmit={submit} className="mt-7 space-y-5">
                {field("name", "Your Name", { autoComplete: "name", placeholder: "Your full name" })}
                {field("email", "Your Email", { type: "email", autoComplete: "email", placeholder: "you@example.com" })}
                {field("subject", "Subject", { placeholder: "Project, SEO, collaboration…" })}
                {field("message", "Your Message", { textarea: true, placeholder: "Tell me a little about what you need" })}
                {/* honeypot */}
                <input type="text" name="company" tabIndex={-1} autoComplete="off" value={values.company} onChange={set("company")} className="hidden" aria-hidden />

                <Magnetic strength={0.15} className="w-full">
                  <button type="submit" disabled={status === "sending"} className="btn btn-gold w-full disabled:opacity-70">
                    {status === "sending" ? (
                      <>
                        <Icon name="Loader2" size={17} className="animate-spin" /> Sending…
                      </>
                    ) : (
                      <>
                        Send Message <Icon name="Send" size={16} />
                      </>
                    )}
                  </button>
                </Magnetic>

                <div aria-live="polite" className="min-h-[1.25rem] text-sm">
                  {status === "mailto" && (
                    <p className="text-mute">
                      Your email app has been opened with the message ready to send. Prefer chat?{" "}
                      <a href={whatsappLink} target="_blank" rel="noreferrer" className="text-gold underline underline-offset-4">
                        WhatsApp me
                      </a>
                      .
                    </p>
                  )}
                  {status === "error" && (
                    <p className="flex items-start gap-2 text-[#f08a6e]">
                      <Icon name="TriangleAlert" size={16} className="mt-0.5 shrink-0" />
                      Something went wrong. Please email {personal.email} directly.
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
