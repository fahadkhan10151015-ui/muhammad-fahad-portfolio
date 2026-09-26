import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowUpRight, Check, Copy, Download, Mail } from "lucide-react";
import Section from "../components/Section.jsx";
import Reveal from "../components/Reveal.jsx";
import Button from "../components/Button.jsx";
import SocialLinks from "../components/SocialLinks.jsx";
import { WhatsAppIcon } from "../components/BrandIcons.jsx";
import { contact, emailLink, personalInfo, whatsappLink } from "../data/portfolio.js";

export default function Contact() {
  const [copied, setCopied] = useState(false);

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(personalInfo.email);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      window.location.href = emailLink;
    }
  };

  return (
    <Section id="contact">
      <Reveal>
        <div className="relative overflow-hidden rounded-[2rem] panel p-6 sm:p-10 lg:p-14">
          <div
            aria-hidden="true"
            className="glow pointer-events-none absolute -right-[9rem] -top-[9rem] h-[32rem] w-[32rem] [--glow-color:rgb(37_211_102/0.08)]"
          />

          <div className="relative grid grid-cols-1 gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)] lg:gap-14">
            <div className="flex min-w-0 flex-col">
              <h2
                id="contact-title"
                className="text-[2.25rem] font-semibold leading-[1.02] tracking-[-0.035em] text-bone text-balance sm:text-6xl"
              >
                {contact.heading}
              </h2>
              <p className="mt-5 max-w-md text-lg leading-relaxed text-ash text-pretty">{contact.text}</p>

              <div className="mt-8 flex flex-wrap items-center gap-3 lg:mt-auto lg:pt-10">
                <Button
                  href={personalInfo.cvUrl}
                  download={personalInfo.cvDownloadName}
                  variant="secondary"
                  icon={Download}
                >
                  Download CV
                </Button>
                <SocialLinks />
              </div>
            </div>

            <div className="min-w-0 space-y-4">
              <motion.a
                href={whatsappLink}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`Chat on WhatsApp at ${personalInfo.whatsapp.display} (opens in a new tab)`}
                whileHover={{ y: -3 }}
                whileTap={{ scale: 0.985 }}
                transition={{ duration: 0.2 }}
                className="group relative block overflow-hidden rounded-2xl border border-whatsapp/30 bg-linear-to-br from-whatsapp/[0.16] via-whatsapp/[0.05] to-transparent p-6 transition-colors hover:border-whatsapp/55 sm:p-8"
              >
                <div className="flex items-start justify-between">
                  <span className="grid h-12 w-12 place-items-center rounded-xl bg-whatsapp text-ink">
                    <WhatsAppIcon className="h-6 w-6" />
                  </span>
                  <ArrowUpRight
                    className="h-6 w-6 text-bone/60 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-bone"
                    aria-hidden="true"
                  />
                </div>
                <p className="mt-8 text-2xl font-semibold tracking-tight text-bone sm:text-3xl">Chat on WhatsApp</p>
                <p className="mt-1 text-lg text-bone/70">{personalInfo.whatsapp.display}</p>
              </motion.a>

              <div className="flex items-center gap-3 rounded-2xl border border-white/[0.09] bg-charcoal/80 p-3 pl-4 sm:p-4 sm:pl-5">
                <span className="grid h-10 w-10 shrink-0 place-items-center rounded-[10px] bg-linear-to-br from-steel to-graphite text-bone ring-1 ring-white/10">
                  <Mail className="h-[18px] w-[18px]" aria-hidden="true" />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="text-sm text-ash">Email</p>
                  <a
                    href={emailLink}
                    className="block break-all text-[0.95rem] text-bone underline-offset-4 hover:underline sm:truncate sm:break-normal sm:text-base"
                  >
                    {personalInfo.email}
                  </a>
                </div>
                <button
                  type="button"
                  onClick={copyEmail}
                  aria-label={copied ? "Email address copied" : "Copy email address"}
                  className="grid h-11 w-11 shrink-0 place-items-center rounded-full border border-white/10 text-ash transition-colors hover:border-white/25 hover:text-bone"
                >
                  {copied ? <Check className="h-4 w-4 text-signal" aria-hidden="true" /> : <Copy className="h-4 w-4" aria-hidden="true" />}
                </button>
                <span className="sr-only" aria-live="polite">
                  {copied ? "Email address copied to clipboard" : ""}
                </span>
              </div>
            </div>
          </div>
        </div>
      </Reveal>
    </Section>
  );
}
