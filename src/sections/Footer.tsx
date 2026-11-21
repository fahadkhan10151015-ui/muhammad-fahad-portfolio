"use client";
import { personal, GITHUB_URL, LINKEDIN_URL, whatsappLink, navLinks } from "@/data/portfolio";
import { scrollToId } from "@/lib/motion";
import { requestAudit } from "@/lib/contact-events";
import Icon, { type IconName } from "@/components/Icon";

const social: { label: string; href: string; icon: IconName; external?: boolean }[] = [
  { label: "LinkedIn", href: LINKEDIN_URL, icon: "Linkedin", external: true },
  { label: "GitHub", href: GITHUB_URL, icon: "Github", external: true },
  { label: "Email", href: `mailto:${personal.email}`, icon: "Mail" },
  { label: "WhatsApp", href: whatsappLink, icon: "MessageCircle", external: true },
];

export default function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="relative z-10 border-t border-white/[0.07] bg-ink">
      <div className="mx-auto grid max-w-[1440px] gap-10 px-5 py-14 sm:px-8 md:grid-cols-[1.3fr_1fr_1fr] lg:px-12 xl:pl-24">
        <div>
          <div className="flex items-center gap-4">
            <img src="/logo.svg" alt="" width={48} height={48} className="h-12 w-12" loading="lazy" />
            <div>
              <p className="font-display text-lg font-semibold">{personal.fullName}</p>
              <p className="text-sm text-mute">{personal.title}</p>
            </div>
          </div>
          <p className="mt-6 max-w-[360px] text-sm leading-relaxed text-mute">Crafting digital experiences with passion and precision.</p>
          <a
            href="#contact"
            onClick={(e) => {
              e.preventDefault();
              requestAudit();
            }}
            className="link-underline mt-5 inline-flex items-center gap-2 text-sm font-medium text-gold"
          >
            <Icon name="SearchCheck" size={15} /> Get a free SEO audit
          </a>
        </div>
        <nav aria-label="Footer">
          <p className="font-mono text-[0.64rem] uppercase tracking-[0.22em] text-dim">Navigate</p>
          <ul className="mt-4 grid grid-cols-2 gap-2 text-sm">
            {navLinks.map((l) => (
              <li key={l.id}>
                <a
                  href={`#${l.id}`}
                  onClick={(e) => {
                    e.preventDefault();
                    scrollToId(l.id);
                  }}
                  className="link-underline text-bone/80 hover:text-gold-2"
                >
                  {l.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
        <div>
          <p className="font-mono text-[0.64rem] uppercase tracking-[0.22em] text-dim">Connect</p>
          <ul className="mt-4 space-y-2 text-sm">
            {social.map((s) => (
              <li key={s.label}>
                <a
                  href={s.href}
                  target={s.external ? "_blank" : undefined}
                  rel={s.external ? "noreferrer" : undefined}
                  className="inline-flex items-center gap-2 text-bone/80 hover:text-gold-2"
                >
                  <Icon name={s.icon} size={15} className="text-gold" />
                  <span className="link-underline">{s.label}</span>
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className="border-t border-white/[0.05]">
        <div className="mx-auto flex max-w-[1440px] flex-wrap items-center justify-between gap-3 px-5 py-5 font-mono text-[0.66rem] uppercase tracking-[0.2em] text-dim sm:px-8 lg:px-12 xl:pl-24">
          <span>
            © {year} {personal.fullName}
          </span>
          <button type="button" onClick={() => scrollToId("home")} className="inline-flex items-center gap-2 hover:text-gold-2">
            Back to top <Icon name="ArrowUpRight" size={13} className="-rotate-45" />
          </button>
        </div>
      </div>
    </footer>
  );
}
