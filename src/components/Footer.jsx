import { Mail } from "lucide-react";
import Container from "./Container.jsx";
import SocialLinks from "./SocialLinks.jsx";
import { WhatsAppIcon } from "./BrandIcons.jsx";
import { emailLink, personalInfo, whatsappLink } from "../data/portfolio.js";

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-white/[0.08] bg-charcoal/60 pb-24 pt-12 sm:pb-12">
      <Container>
        <div className="flex flex-col gap-8 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-lg font-semibold tracking-tight text-bone">{personalInfo.name}</p>
            <p className="mt-1 text-sm text-ash">{personalInfo.title}</p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <a
              href={emailLink}
              className="inline-flex min-h-11 items-center gap-2 rounded-full border border-white/10 px-4 text-sm text-ash transition-colors hover:border-white/25 hover:text-bone"
            >
              <Mail className="h-4 w-4" aria-hidden="true" />
              <span className="break-all">{personalInfo.email}</span>
            </a>
            <a
              href={whatsappLink}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`WhatsApp ${personalInfo.whatsapp.display} (opens in a new tab)`}
              className="inline-flex min-h-11 items-center gap-2 rounded-full border border-white/10 px-4 text-sm text-ash transition-colors hover:border-whatsapp/40 hover:text-bone"
            >
              <WhatsAppIcon className="h-4 w-4 text-whatsapp" />
              {personalInfo.whatsapp.display}
            </a>
            <SocialLinks />
          </div>
        </div>

        <p className="mt-10 text-sm text-ash/80">
          © {year} {personalInfo.name}. All rights reserved.
        </p>
      </Container>
    </footer>
  );
}
