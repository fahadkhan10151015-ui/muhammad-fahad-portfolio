import { socialLinks } from "../data/portfolio.js";
import { GitHubIcon, LinkedInIcon } from "./BrandIcons.jsx";

const config = {
  github: { label: "GitHub", Icon: GitHubIcon },
  linkedin: { label: "LinkedIn", Icon: LinkedInIcon },
};

/** Renders only the social links that have a real URL in portfolio.js. */
export default function SocialLinks({ className = "" }) {
  const available = Object.entries(socialLinks).filter(([key, url]) => config[key] && url && url.trim());
  if (available.length === 0) return null;

  return (
    <ul className={`flex items-center gap-2 ${className}`}>
      {available.map(([key, url]) => {
        const { label, Icon } = config[key];
        return (
          <li key={key}>
            <a
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`${label} profile (opens in a new tab)`}
              className="grid h-11 w-11 place-items-center rounded-full border border-white/10 text-ash transition-colors hover:border-white/25 hover:text-bone"
            >
              <Icon className="h-[18px] w-[18px]" />
            </a>
          </li>
        );
      })}
    </ul>
  );
}
