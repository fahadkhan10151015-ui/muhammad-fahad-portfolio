/**
 * ==================================================================
 *  PORTFOLIO CONTENT — the only file you need to edit.
 *  All information here comes from Muhammad Fahad Khan's CV.
 *  Empty strings ("") hide the related button/link automatically.
 * ==================================================================
 */

/* ---------------------------- 1. PERSONAL ---------------------------- */
export const personal = {
  firstName: "Muhammad",
  lastName: "Fahad Khan",
  fullName: "Muhammad Fahad Khan",
  title: "Full-Stack Developer & SEO Specialist",
  role: "Computer Science Student",
  location: "Rawalpindi, Pakistan",
  email: "fahadkhan10151015@gmail.com",
  phone: {
    display: "+92 335 0947538",
    tel: "+923350947538",
    whatsapp: "923350947538", // used for wa.me links (no + or spaces)
  },
  cvUrl: "/Muhammad_Fahad_Khan_CV.pdf",
  tagline:
    "I build fast, responsive web applications and real software products, from Next.js storefronts to an offline billing system used by medical stores, and help businesses get found through SEO.",
};

/* --------------------------- 2. SOCIAL LINKS ------------------------- */
// GITHUB_URL: replace with your profile if it ever changes.
export const GITHUB_URL = "https://github.com/fahadkhan10151015-ui";
// Add your LinkedIn profile URL here to show the LinkedIn link ("" hides it).
export const LINKEDIN_URL = "";

export const whatsappLink = `https://wa.me/${personal.phone.whatsapp}`;
export const emailLink = `mailto:${personal.email}?subject=${encodeURIComponent(
  "Portfolio Inquiry — Muhammad Fahad Khan",
)}`;

/* ---------------------------- 3. NAVIGATION -------------------------- */
export const navLinks = [
  { id: "home", label: "Home" },
  { id: "about", label: "About" },
  { id: "skills", label: "Skills" },
  { id: "projects", label: "Projects" },
  { id: "contact", label: "Contact" },
];

/* ------------------------------ 4. ABOUT ----------------------------- */
export const about = {
  paragraphs: [
    "I'm a Computer Science student at PMAS Arid Agriculture University with two years of professional experience as a Full-Stack Developer. I build responsive web applications with Next.js, React and Firebase, and I've shipped a commercial desktop product for medical stores.",
    "Alongside development I work as a freelance SEO Specialist, handling on-page and e-commerce SEO for businesses in Pakistan and the UK. Writing the code and understanding how people find it lets me deliver websites that are both well built and visible.",
  ],
  stats: [
    { value: 7, suffix: "", label: "Projects Built", icon: "FolderKanban" },
    { value: 2, suffix: "+", label: "Years Experience", icon: "CalendarClock" },
    { value: 15, suffix: "+", label: "Technologies", icon: "Cpu" },
    { value: 3, suffix: "", label: "SEO Clients", icon: "Search" },
  ],
};

export const experience = [
  {
    role: "Full-Stack Developer",
    company: "Augmenteck",
    period: "2 Years",
    points: ["Developed full-stack web applications and websites using Next.js, React and Firebase."],
  },
  {
    role: "SEO Specialist",
    company: "Freelance · Remote",
    period: "Ongoing",
    points: [
      "Techera Med Systems — handling SEO for a medical equipment website.",
      "Channel and Fixings — handling SEO for a UK business website.",
      "Machinez — completed SEO for an e-commerce website.",
    ],
  },
  {
    role: "Transcription Agent",
    company: "A Telecommunication",
    period: "2 Years",
    points: ["Reviewed customer calls, selected the correct options and organised call data in the system."],
  },
];

export const education = [
  {
    degree: "BS Computer Science (BSCS)",
    school: "PMAS Arid Agriculture University, Rawalpindi",
    period: "2023 – Present · 7th Semester",
  },
  { degree: "HSSC", school: "Superior Group of Colleges", period: "2023" },
  { degree: "SSC", school: "Bright Hall School", period: "2021" },
];

/* ------------------------------ 5. SKILLS ---------------------------- */
export const skillGroups = [
  { title: "Languages", icon: "Braces", items: ["C#", "Java", "C++", "Python", "JavaScript"] },
  {
    title: "Web Development",
    icon: "Globe",
    items: ["Next.js", "React", "ASP.NET MVC", "Front-End & Back-End", "Responsive Design"],
  },
  {
    title: "Mobile & Desktop",
    icon: "MonitorSmartphone",
    items: ["iOS App Development", "Windows Forms", "PySide6 (Qt)"],
  },
  { title: "Databases", icon: "Database", items: ["SQL Server", "Firebase", "SQLite"] },
  {
    title: "SEO & Marketing",
    icon: "Search",
    items: ["On-Page SEO", "E-commerce SEO", "Digital Marketing"],
  },
  {
    title: "Tools & Other",
    icon: "Wrench",
    items: ["Git", "GitHub", "GitHub Actions", "MS Word", "MS Excel", "Photography"],
  },
];

// Nodes of the 3D technology network (short labels read best in 3D).
export const networkNodes = [
  "Next.js",
  "React",
  "JavaScript",
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
  "JavaScript",
  "Python",
  "C#",
  "Java",
  "C++",
  "ASP.NET MVC",
  "Firebase",
  "SQL Server",
  "SQLite",
  "PySide6",
  "iOS",
  "Windows Forms",
  "Git",
  "GitHub Actions",
  "On-Page SEO",
  "E-commerce SEO",
];

/* ----------------------------- 6. PROJECTS --------------------------- */
/**
 * category: one or more of the filter ids below.
 * url / github: leave "" until you have a real link — buttons appear automatically.
 * image: optional path to a screenshot in /public (e.g. "/projects/perfume-point.webp").
 *        Without an image a styled preview of the project is drawn in code.
 * preview: drives the coded preview (headline + accent layout).
 */
export const projectFilters = [
  { id: "ALL", label: "All" },
  { id: "WEB", label: "Web" },
  { id: "E-COMMERCE", label: "E-Commerce" },
  { id: "DESKTOP", label: "Desktop" },
  { id: "MOBILE", label: "Mobile" },
  { id: "ACADEMIC", label: "Academic" },
];

export const projects = [
  {
    id: "medibill-pro",
    title: "MediBill Pro",
    description:
      "Offline billing & inventory software for medical stores — barcode billing, batch & expiry tracking, 15+ reports, licensing and auto-updates.",
    category: ["DESKTOP"],
    badge: "Desktop · Commercial",
    tags: ["Python", "PySide6", "SQLite", "GitHub Actions"],
    status: "LIVE",
    url: "",
    github: "",
    image: "",
    preview: { kind: "dashboard", headline: ["Pharmacy Billing", "& Inventory", "Made Simple"], accent: 1 },
  },
  {
    id: "perfume-point",
    title: "Perfume Point",
    description:
      "Full-stack online perfume store with product catalogue, category filters, cart and wishlist, backed by Firebase.",
    category: ["WEB", "E-COMMERCE"],
    badge: "E-Commerce",
    tags: ["Next.js", "Firebase", "Full-Stack"],
    status: "LIVE",
    url: "",
    github: "",
    image: "",
    preview: { kind: "store", headline: ["Discover Your", "Signature", "Scent"], accent: 1 },
  },
  {
    id: "bikaflora",
    title: "BikaFlora",
    description: "Responsive online flower shop with a product catalogue and direct WhatsApp ordering.",
    category: ["WEB", "E-COMMERCE"],
    badge: "E-Commerce",
    tags: ["Next.js", "Responsive", "WhatsApp"],
    status: "LIVE",
    url: "",
    github: "",
    image: "",
    preview: { kind: "store", headline: ["Fresh Flowers,", "Delivered", "With Love"], accent: 1 },
  },
  {
    id: "allied-spare-solutions",
    title: "Allied Spare Solutions",
    description:
      "Business website for a UK industrial spare-parts supplier, with a request-for-quote form for enquiries.",
    category: ["WEB"],
    badge: "Business Website",
    tags: ["Next.js", "RFQ Form", "UK Client"],
    status: "LIVE",
    url: "",
    github: "",
    image: "",
    preview: { kind: "corporate", headline: ["Industrial Spare", "Parts, Sourced", "Fast"], accent: 2 },
  },
  {
    id: "course-evaluation",
    title: "Course Evaluation App",
    description: "iOS application that lets students submit structured feedback on their courses.",
    category: ["MOBILE", "ACADEMIC"],
    badge: "iOS · Academic",
    tags: ["iOS", "Mobile UI", "Feedback"],
    status: "ACADEMIC",
    url: "",
    github: "",
    image: "",
    preview: { kind: "mobile", headline: ["Rate Your", "Courses"], accent: 1 },
  },
  {
    id: "complaint-management",
    title: "Complaint Management",
    description: "Web system to log complaints and assign them to staff members, with data stored in SQL Server.",
    category: ["WEB", "ACADEMIC"],
    badge: "Web App · Academic",
    tags: ["ASP.NET MVC", "C#", "SQL Server"],
    status: "ACADEMIC",
    url: "",
    github: "",
    image: "",
    preview: { kind: "table", headline: ["Track Every", "Complaint"], accent: 1 },
  },
  {
    id: "course-registration",
    title: "Course Registration",
    description: "Desktop application for course registration with student and course management features.",
    category: ["DESKTOP", "ACADEMIC"],
    badge: "Desktop · Academic",
    tags: ["C#", "Windows Forms"],
    status: "ACADEMIC",
    url: "",
    github: "",
    image: "",
    preview: { kind: "form", headline: ["Student & Course", "Management"], accent: 0 },
  },
];

/* ------------------------------ 7. CONTACT --------------------------- */
export const contactCopy =
  "Have a project in mind or need help with SEO? I'm always open to discussing new opportunities, freelance work or collaborations. Let's build something great together.";
