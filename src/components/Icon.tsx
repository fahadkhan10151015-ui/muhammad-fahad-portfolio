import type { SVGProps } from "react";
import {
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  Braces,
  CalendarClock,
  Check,
  Cpu,
  Database,
  Globe,
  Loader2,
  Mail,
  Menu,
  MessageCircle,
  MonitorSmartphone,
  Phone,
  RefreshCw,
  Search,
  SearchCheck,
  Send,
  TriangleAlert,
  Wrench,
  X,
  Briefcase,
  Radio,
  type LucideIcon,
} from "lucide-react";

type BrandProps = { size?: number; strokeWidth?: number } & SVGProps<SVGSVGElement>;

/* Brand marks (Lucide no longer ships them). */
function Github({ size = 18, strokeWidth: _s, ...rest }: BrandProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" {...rest}>
      <path d="M12 .5a11.5 11.5 0 0 0-3.64 22.41c.58.1.79-.25.79-.56v-2c-3.2.7-3.88-1.37-3.88-1.37-.53-1.33-1.3-1.69-1.3-1.69-1.04-.71.08-.7.08-.7 1.16.08 1.77 1.19 1.77 1.19 1.03 1.76 2.7 1.25 3.36.96.1-.75.4-1.25.73-1.54-2.56-.29-5.25-1.28-5.25-5.69 0-1.26.45-2.29 1.18-3.1-.12-.29-.51-1.46.11-3.05 0 0 .97-.31 3.17 1.18a11 11 0 0 1 5.77 0c2.2-1.49 3.17-1.18 3.17-1.18.62 1.59.23 2.76.11 3.05.74.81 1.18 1.84 1.18 3.1 0 4.42-2.7 5.39-5.27 5.68.41.36.78 1.06.78 2.14v3.17c0 .31.21.67.8.56A11.5 11.5 0 0 0 12 .5Z" />
    </svg>
  );
}
function Linkedin({ size = 18, strokeWidth: _s, ...rest }: BrandProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" {...rest}>
      <path d="M20.45 20.45h-3.56v-5.57c0-1.33-.02-3.04-1.85-3.04-1.85 0-2.14 1.45-2.14 2.94v5.67H9.35V9h3.41v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28ZM5.34 7.43a2.06 2.06 0 1 1 0-4.13 2.06 2.06 0 0 1 0 4.13ZM7.12 20.45H3.56V9h3.56v11.45ZM22.22 0H1.77C.79 0 0 .77 0 1.73v20.54C0 23.23.79 24 1.77 24h20.45c.98 0 1.78-.77 1.78-1.73V1.73C24 .77 23.2 0 22.22 0Z" />
    </svg>
  );
}

const ICONS = {
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  Braces,
  Briefcase,
  CalendarClock,
  Check,
  Cpu,
  Database,
  Globe,
  Loader2,
  Mail,
  Menu,
  MessageCircle,
  MonitorSmartphone,
  Phone,
  Radio,
  RefreshCw,
  Search,
  SearchCheck,
  Send,
  TriangleAlert,
  Wrench,
  X,
} satisfies Record<string, LucideIcon>;

export type IconName = keyof typeof ICONS | "Github" | "Linkedin";

interface IconProps {
  name: IconName;
  size?: number;
  strokeWidth?: number;
  className?: string;
}

export default function Icon({ name, size = 18, strokeWidth = 1.6, className }: IconProps) {
  if (name === "Github") return <Github size={size} className={className} aria-hidden focusable="false" />;
  if (name === "Linkedin") return <Linkedin size={size} className={className} aria-hidden focusable="false" />;
  const C = ICONS[name];
  return <C size={size} strokeWidth={strokeWidth} className={className} aria-hidden="true" focusable="false" />;
}
