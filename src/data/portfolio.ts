/**
 * ==================================================================
 *  PORTFOLIO CONTENT — the only file you need to edit.
 *  Empty strings ("") hide the related button/link automatically.
 * ==================================================================
 */
import type { IconName } from "@/components/Icon";

/* ---------------------------- 1. PERSONAL ---------------------------- */
export const personal = {
  firstName: "Muhammad",
  lastName: "Fahad Khan",
  fullName: "Muhammad Fahad Khan",
  title: "Full-Stack Developer & SEO Specialist",
  focus: "Websites · Software · Search Growth",
  email: "fahadkhan10151015@gmail.com",
  phone: {
    display: "+92 335 0947538",
    tel: "+923350947538",
    whatsapp: "923350947538", // wa.me format (no + or spaces)
  },
  tagline:
    "I build fast websites and real software products — and make sure people find them. Development and SEO under one roof, so every launch is built to rank.",
} as const;

/** Inbox that receives contact-form messages (via FormSubmit). */
export const CONTACT_EMAIL = personal.email;

/* --------------------------- 2. SOCIAL LINKS ------------------------- */
export const GITHUB_URL = "https://github.com/fahadkhan10151015-ui";
export const LINKEDIN_URL = "https://www.linkedin.com/in/muhammad-fahad-khan-dev/";
export const whatsappLink = `https://wa.me/${personal.phone.whatsapp}`;

export const SITE_URL = "https://muhammad-fahad-portfolio-mocha.vercel.app";

/* ---------------------------- 3. NAVIGATION -------------------------- */
export const navLinks = [
  { id: "home", label: "Home" },
  { id: "about", label: "About" },
  { id: "skills", label: "Skills" },
  { id: "projects", label: "Projects" },
  { id: "contact", label: "Contact" },
] as const;
export type SectionId = (typeof navLinks)[number]["id"];

/* ------------------------------ 4. ABOUT ----------------------------- */
export interface Stat {
  value: number;
  suffix: string;
  label: string;
  icon: IconName;
}

export const about = {
  paragraphs: [
    "I'm a full-stack developer and SEO specialist with more than five years of experience building websites, web applications and desktop software — and getting them found on Google.",
    "Most developers stop at launch and most SEOs can't touch the code. I do both: clean, fast builds with Next.js, React, Python and C#, combined with on-page, technical and e-commerce SEO that turns a website into a source of customers.",
  ],
  stats: [
    { value: 5, suffix: "+", label: "Years Experience", icon: "CalendarClock" },
    { value: 20, suffix: "+", label: "Websites Built", icon: "Globe" },
    { value: 25, suffix: "+", label: "SEO Clients", icon: "Search" },
    { value: 15, suffix: "+", label: "Technologies", icon: "Cpu" },
  ] satisfies Stat[],
};

export interface Service {
  title: string;
  icon: IconName;
  text: string;
  points: string[];
}

export const services: Service[] = [
  {
    title: "Web Development",
    icon: "Globe",
    text: "Fast, responsive websites and web apps — storefronts, business sites and full-stack products.",
    points: ["Next.js & React", "Firebase back ends", "E-commerce & ordering flows"],
  },
  {
    title: "Software Development",
    icon: "MonitorSmartphone",
    text: "Offline desktop software that businesses run every day, with licensing and auto-updates.",
    points: ["Python · PySide6 · SQLite", "Billing, stock & reports", "Windows & macOS installers"],
  },
  {
    title: "SEO",
    icon: "Search",
    text: "On-page, technical and e-commerce SEO for businesses in the UK, US and Malaysia.",
    points: ["Keyword research & on-page", "Technical SEO & site structure", "E-commerce & product SEO"],
  },
];

/** Current SEO engagements (client sites — intentionally not linked). */
export const currentSeo = [
  { client: "Techera Med Systems", detail: "Medical billing & revenue cycle services · USA" },
  { client: "Channel and Fixings", detail: "E-commerce store for construction fixings · UK" },
  { client: "BikaFlora", detail: "Online florist & gift bouquets · Malaysia" },
];

/* ------------------------------ 5. SKILLS ---------------------------- */
export interface SkillGroup {
  title: string;
  icon: IconName;
  items: string[];
}

export const skillGroups: SkillGroup[] = [
  { title: "Languages", icon: "Braces", items: ["JavaScript", "TypeScript", "Python", "C#", "Java", "C++"] },
  { title: "Web Development", icon: "Globe", items: ["Next.js", "React", "ASP.NET MVC", "Responsive Design", "Front-End & Back-End"] },
  { title: "Software & Mobile", icon: "MonitorSmartphone", items: ["PySide6 (Qt)", "Windows Forms", "iOS Development"] },
  { title: "Databases", icon: "Database", items: ["Firebase", "SQL Server", "SQLite"] },
  { title: "SEO & Marketing", icon: "Search", items: ["On-Page SEO", "Technical SEO", "E-commerce SEO", "Keyword Research", "SEO Audits", "Digital Marketing"] },
  { title: "Tools & Delivery", icon: "Wrench", items: ["Git", "GitHub", "GitHub Actions", "Vercel", "PyInstaller", "Inno Setup"] },
];

/** Labels of the 3D technology network (short labels read best in 3D). */
export const networkNodes = [
  "Next.js",
  "React",
  "TypeScript",
  "Python",
  "C#",
  "Java",
  "C++",
  "ASP.NET",
  "Firebase",
  "SQL Server",
  "SQLite",
  "PySide6",
  "iOS",
  "Git",
  "SEO",
];

export const marquee = [
  "Next.js",
  "React",
  "TypeScript",
  "JavaScript",
  "Python",
  "C#",
  "ASP.NET MVC",
  "Firebase",
  "SQL Server",
  "SQLite",
  "PySide6",
  "Git",
  "GitHub Actions",
  "On-Page SEO",
  "Technical SEO",
  "E-commerce SEO",
  "Keyword Research",
];

/* ----------------------------- 6. PROJECTS --------------------------- */
export type ProjectCategory = "SOFTWARE" | "WEB" | "E-COMMERCE" | "SEO";
export type PreviewKind = "pos" | "billing" | "perfume" | "flora" | "industrial" | "seo";

export interface Project {
  id: string;
  title: string;
  description: string;
  category: ProjectCategory[];
  badge: string;
  tags: string[];
  status: "LIVE" | "ONGOING" | "COMPLETED";
  /** Live link — leave "" for client work that must not be linked. */
  url: string;
  github: string;
  /** Optional screenshot in /public, e.g. "/projects/shelfo-pos.webp". */
  image: string;
  preview: { kind: PreviewKind; headline: string[]; accent: number };
}

export const projectFilters: { id: "ALL" | ProjectCategory; label: string }[] = [
  { id: "ALL", label: "All" },
  { id: "SOFTWARE", label: "Software" },
  { id: "WEB", label: "Web" },
  { id: "E-COMMERCE", label: "E-Commerce" },
  { id: "SEO", label: "SEO" },
];

export const projects: Project[] = [
  {
    id: "medibill-pro",
    title: "MediBill Pro",
    description:
      "Offline pharmacy billing & inventory software — barcode billing, batch & expiry tracking, 15+ business reports, licensing and auto-updates. English & Urdu.",
    category: ["SOFTWARE"],
    badge: "Desktop Software",
    tags: ["Python", "PySide6", "SQLite"],
    status: "LIVE",
    url: "",
    github: "",
    image: "",
    preview: { kind: "billing", headline: ["Pharmacy Billing", "& Inventory", "Made Simple"], accent: 1 },
  },
  {
    id: "shelfo-pos",
    title: "Shelfo POS",
    description:
      "Fully offline billing & inventory for general stores and supermarkets — barcode billing, loose items, customer credit, expenses, day closing and profit reports.",
    category: ["SOFTWARE"],
    badge: "Desktop Software",
    tags: ["Windows", "macOS", "Offline"],
    status: "LIVE",
    url: "",
    github: "",
    image: "",
    preview: { kind: "pos", headline: ["Simple Billing", "for Every", "Shop"], accent: 1 },
  },
  {
    id: "perfume-point",
    title: "Perfume Point",
    description: "Full-stack online perfume store with product catalogue, category filters, cart and wishlist, backed by Firebase.",
    category: ["WEB", "E-COMMERCE"],
    badge: "E-Commerce",
    tags: ["Next.js", "Firebase", "Full-Stack"],
    status: "LIVE",
    url: "",
    github: "",
    image: "",
    preview: { kind: "perfume", headline: ["Discover Your", "Signature", "Scent"], accent: 1 },
  },
  {
    id: "bikaflora",
    title: "BikaFlora",
    description:
      "Website for a Kuala Lumpur florist selling soap-flower and gift bouquets, with WhatsApp ordering — and I currently run its SEO.",
    category: ["WEB", "E-COMMERCE", "SEO"],
    badge: "Website + SEO · Ongoing",
    tags: ["Next.js", "E-commerce SEO", "Malaysia"],
    status: "ONGOING",
    url: "",
    github: "",
    image: "",
    preview: { kind: "flora", headline: ["Bouquets That", "Last", "Forever"], accent: 1 },
  },
  {
    id: "allied-spare-solutions",
    title: "Allied Spare Solutions",
    description: "Business website for a UK industrial spare-parts supplier, with a request-for-quote form for trade enquiries.",
    category: ["WEB"],
    badge: "Business Website",
    tags: ["Next.js", "RFQ Form", "UK"],
    status: "LIVE",
    url: "",
    github: "",
    image: "",
    preview: { kind: "industrial", headline: ["Industrial Spare", "Parts, Sourced", "Fast"], accent: 2 },
  },
  {
    id: "techera-seo",
    title: "Techera Med Systems",
    description:
      "Ongoing SEO for a US medical billing & revenue cycle management company — service-page optimisation, technical health and search visibility.",
    category: ["SEO"],
    badge: "SEO · Ongoing",
    tags: ["Technical SEO", "On-Page", "Healthcare"],
    status: "ONGOING",
    url: "",
    github: "",
    image: "",
    preview: { kind: "seo", headline: ["Medical Billing", "Services", "That Rank"], accent: 0 },
  },
  {
    id: "channel-fixings-seo",
    title: "Channel and Fixings",
    description:
      "Ongoing SEO for a UK e-commerce store selling construction fixings, strut channel and anchors to trade customers — category & product SEO.",
    category: ["SEO", "E-COMMERCE"],
    badge: "E-commerce SEO · Ongoing",
    tags: ["Product SEO", "Categories", "UK"],
    status: "ONGOING",
    url: "",
    github: "",
    image: "",
    preview: { kind: "seo", headline: ["Trade Fixings,", "Found on", "Google"], accent: 1 },
  },
  {
    id: "machinez-seo",
    title: "Machinez",
    description: "Completed end-to-end SEO for an e-commerce website — keyword mapping, on-page optimisation and technical fixes.",
    category: ["SEO", "E-COMMERCE"],
    badge: "E-commerce SEO",
    tags: ["On-Page", "Technical", "E-commerce"],
    status: "COMPLETED",
    url: "",
    github: "",
    image: "",
    preview: { kind: "seo", headline: ["E-commerce", "SEO,", "Delivered"], accent: 1 },
  },
];

/* ------------------------------ 7. CONTACT --------------------------- */
export const contactCopy =
  "Need a website, custom software or more traffic from Google? Tell me about your project — or ask for a free SEO audit of your website.";

export const AUDIT_SUBJECT = "Free SEO Audit request";
