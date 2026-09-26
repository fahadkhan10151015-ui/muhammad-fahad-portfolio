/**
 * "Ask Fahad AI" — a fully local, rule-based portfolio assistant.
 *
 * No AI service, API key, backend or network call is involved. It matches
 * keywords in the visitor's message to an "intent" and answers from the
 * content in src/data/portfolio.js, in English or Roman Urdu.
 *
 * To teach it a new topic: add an entry to `intents` (keywords) and an
 * entry to `answers` (English + Roman Urdu text).
 */
import {
  coreSkills,
  education,
  emailLink,
  experience,
  experiencePath,
  personalInfo,
  projects,
  skillPages,
  skillPath,
  technologies,
  whatsappLink,
} from "../data/portfolio.js";

/* ------------------------------------------------------------------
 * Text helpers
 * ------------------------------------------------------------------ */
const normalize = (s) =>
  s
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();

const escapeRegex = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

// Whole-word match (with an optional plural "s"/"es") on normalized text.
const matcher = (keyword) => new RegExp(`(^| )${escapeRegex(normalize(keyword))}(s|es)?( |$)`);

const joinList = (items, and) =>
  items.length < 2 ? items.join("") : `${items.slice(0, -1).join(", ")}, ${and} ${items[items.length - 1]}`;
const bullets = (lines) => lines.map((l) => `• ${l}`).join("\n");
const itemLabel = (item) => (typeof item === "string" ? item : item.title);

/* ------------------------------------------------------------------
 * Language detection: any Roman Urdu word makes the reply Roman Urdu
 * (which already keeps the English technical terms, so mixed messages
 * get a naturally mixed answer). Otherwise the reply is English.
 * ------------------------------------------------------------------ */
const URDU_WORDS = new Set(
  (
    "hai hain hun hoon kya kon kaun kaise kese kaisay kahan kab kis kitne kitna kitni konsi konsa kaunsi kaunsa " +
    "ke ki ka ko ne se mein aap apne mujhe mujh batao bataye batayen bataiye bataen btao bta banaye banaya banayi " +
    "banai karta karte karti kar karun karu karna kare sakta sakte sakti chahiye chahta chahte rakhte rakhta " +
    "aata aati aate zariye rabta baat parhai padhai taleem wagera kuch sirf bare nahi aur yeh woh wala wali kiya " +
    "kiye hua hue dena dikhao dikhaye tajurba kaam tankhwah parha parhta uski uska uske iski iska cheez"
  ).split(" ")
);

export function detectLanguage(text) {
  const words = normalize(text).split(" ");
  const urdu = words.filter((w) => URDU_WORDS.has(w)).length;
  return urdu > 0 ? "ur" : "en";
}

/* ------------------------------------------------------------------
 * Intents (keyword matching). Weights: heavy 10, strong 4, keys 2, weak 1.
 * Highest score wins; on a tie the earlier intent in this list wins,
 * so specific topics are listed before general ones.
 * ------------------------------------------------------------------ */
const intents = [
  {
    // Things the portfolio does not contain — always answered with "not available".
    id: "unavailable",
    heavy: [
      "salary", "tankhwah", "traffic", "ranking", "rank", "revenue", "conversion", "github", "linkedin",
      "app store", "appstore", "certification", "certificate", "award", "achievement", "percentage",
      "proficiency", "client", "age", "umar", "address", "price", "date", "kab", "when", "years", "year",
      "internship", "intern", "budget", "roas", "leads", "swift", "swiftui", "mongodb", "mongo",
    ],
  },
  {
    id: "contact",
    strong: ["contact", "email", "e mail", "gmail", "whatsapp", "whats app", "rabta", "phone", "baat", "message", "hire", "reach"],
    keys: ["get in touch", "call", "mail"],
  },
  { id: "cv", strong: ["cv", "resume", "curriculum vitae"], weak: ["download"] },
  { id: "seoMedical", strong: ["medical", "cheramed", "techeramed", "techeramedsystems", "med systems"] },
  { id: "seoMachinez", strong: ["machinez"] },
  {
    id: "socialMedia",
    strong: [
      "social media marketing", "social media management", "social media", "facebook marketing",
      "instagram marketing", "facebook", "instagram", "content promotion", "social media strategy",
    ],
    keys: ["smm"],
  },
  {
    id: "digitalMarketing",
    strong: [
      "digital marketing", "marketing", "prime", "prime company", "facebook ads", "instagram ads", "ads",
      "advertising", "paid campaign", "audience targeting",
    ],
    keys: ["campaign", "promotion", "audience"],
  },
  {
    id: "seo",
    strong: [
      "seo", "search engine", "organic", "search visibility", "on page", "off page", "technical seo",
      "keyword research", "backlink", "link building", "internal linking", "crawlability", "seo audit",
    ],
    keys: ["e commerce seo", "ecommerce seo", "keyword", "meta description", "title tag", "competitor analysis", "indexing"],
  },
  { id: "ios", strong: ["ios", "iphone", "course evaluation"], keys: ["mobile app", "mobile development", "mobile", "evaluation"] },
  { id: "perfume", strong: ["perfume", "react", "e commerce website", "ecommerce website"] },
  {
    id: "fullStack",
    strong: [
      "full stack", "fullstack", "digital teach", "front end", "frontend", "back end", "backend", "asp net",
      "dotnet", "mvc", "database", "sql server", "sql",
    ],
    keys: ["responsive", "ui", "server side"],
  },
  { id: "msOffice", strong: ["ms office", "ms word", "ms excel", "microsoft office", "excel"], keys: ["office", "word"] },
  { id: "photography", strong: ["photography", "photographer", "photo"] },
  { id: "web", strong: ["web project", "web development", "website"], keys: ["web app"] },
  {
    id: "projects",
    strong: ["project", "portfolio projects", "kya banaya", "banaye", "banaya", "built"],
    keys: ["complaint", "course registration", "console", "desktop"],
  },
  {
    id: "programming",
    strong: ["programming language", "language", "java", "konsi language", "windows forms", "winforms", "programming", "coding"],
    keys: ["cpp", "csharp"],
  },
  {
    id: "skills",
    strong: ["core skill", "main skill", "top skill", "skill", "technology", "technologies", "tech stack", "tools"],
    keys: ["kya aata hai", "know", "expertise"],
  },
  {
    id: "education",
    strong: [
      "education", "qualification", "degree", "study", "studying", "parhai", "taleem", "padhai", "university",
      "college", "school", "hssc", "ssc", "bscs", "semester", "arid", "bright hall", "superior group",
    ],
    keys: ["parhta", "padhta", "parha"],
  },
  {
    id: "experience",
    strong: ["experience", "tajurba", "job", "augmenteck", "company", "employment", "career", "role"],
    keys: ["worked", "kaam"],
    weak: ["work"],
  },
  {
    id: "profile",
    strong: [
      "who is fahad", "who is he", "who is muhammad", "about fahad", "about him", "about muhammad",
      "fahad ke bare", "fahad kon", "fahad kaun", "introduce", "introduction", "bio", "summary", "profile", "intro",
    ],
    keys: ["name", "title"],
  },
  { id: "greeting", weak: ["hi", "hello", "hey", "salam", "salaam", "assalam", "assalamualaikum", "aoa", "aslam"] },
  { id: "thanks", weak: ["thanks", "thank", "shukriya", "shukria", "jazak allah"] },
].map((intent) => ({
  ...intent,
  scored: [
    ...(intent.heavy || []).map((k) => [matcher(k), 10]),
    ...(intent.strong || []).map((k) => [matcher(k), 4]),
    ...(intent.keys || []).map((k) => [matcher(k), 2]),
    ...(intent.weak || []).map((k) => [matcher(k), 1]),
  ],
}));

export function detectIntent(text) {
  const t = normalize(text);
  let best = null;
  let bestScore = 0;
  for (const intent of intents) {
    const score = intent.scored.reduce((sum, [re, weight]) => sum + (re.test(t) ? weight : 0), 0);
    if (score > bestScore) {
      best = intent.id;
      bestScore = score;
    }
  }
  return best; // null when nothing matched
}

/* ------------------------------------------------------------------
 * Answers (built from src/data/portfolio.js)
 * A link is { label, href } (external / mailto) or { label, to } (a page inside this site).
 * ------------------------------------------------------------------ */
const projectById = (id) => projects.find((p) => p.id === id);
const skillBySlug = (slug) => skillPages.find((s) => s.slug === slug);
const jobBySlug = (slug) => experience.find((e) => e.slug === slug);
const projectLine = (p) =>
  `${p.title} — ${p.tech.length > 0 ? p.tech.join(" + ") : p.category}${p.liveUrl ? ` — ${p.liveUrl}` : ""}`;
const webProjects = projects.filter((p) => p.type === "web");

const links = {
  email: { label: "Email Fahad", href: emailLink },
  whatsapp: { label: "WhatsApp Fahad", href: whatsappLink, external: true },
  cv: { label: "Download CV", href: personalInfo.cvUrl, download: personalInfo.cvDownloadName },
  medical: () => {
    const p = projectById("medical-seo");
    return p?.liveUrl ? { label: `Visit ${p.linkLabel || "website"}`, href: p.liveUrl, external: true } : null;
  },
  skill: (slug) => ({ label: `View ${skillBySlug(slug).title} Details`, to: skillPath(slug) }),
  job: (slug) => ({ label: `View ${jobBySlug(slug).role} Experience`, to: experiencePath(slug) }),
};
const compact = (arr) => arr.filter(Boolean);

const NOT_AVAILABLE = {
  en: "Sorry, this information is not available in Fahad's portfolio.",
  ur: "Sorry, ye information Fahad ke portfolio mein available nahi hai.",
};

// Opening sentence for some skill pages, per language. Others use the page intro / a generic lead.
const LEADS = {
  seo: {
    ur: "Fahad SEO mein kaam karte hain (SEO Specialist — Augmenteck). Unke SEO areas ye hain:",
    en: "Fahad has practical knowledge of on-page, off-page and technical SEO, and works as an SEO Specialist at Augmenteck. His SEO areas:",
  },
  "digital-marketing": {
    ur: "Fahad ke paas Prime Company ke sath professional Digital Marketing ka experience hai (Digital Marketing — Prime Company). Iske areas ye hain:",
    en: "Fahad has professional Digital Marketing experience with Prime Company (Digital Marketing — Prime Company). The areas include:",
  },
  "social-media-marketing": {
    ur: "Social Media Marketing mein Fahad ke areas ye hain:",
    en: "Fahad's Social Media Marketing covers:",
  },
};

/** Answer built from a skill page in the data file. */
function skillAnswer(slug, lang) {
  const s = skillBySlug(slug);
  const sections = s.page.sections.map((sec) => `${sec.title}: ${sec.items.map(itemLabel).join(", ")}`);
  const relatedProjects = (s.page.projectIds || []).map((id) => projectById(id)?.title).filter(Boolean);
  const relatedJobs = (s.page.experienceSlugs || [])
    .map((jslug) => jobBySlug(jslug))
    .filter(Boolean)
    .map((j) => `${j.role} — ${j.company}`);

  const lead =
    LEADS[slug]?.[lang] ?? (lang === "ur" ? `Fahad ki ${s.title} skill ke bare mein:\n${s.page.intro}` : s.page.intro);
  const parts = [lead, bullets(sections)];
  if (relatedProjects.length > 0) parts.push(`Related projects: ${relatedProjects.join(", ")}`);
  if (relatedJobs.length > 0) parts.push(`Related experience: ${relatedJobs.join(", ")}`);

  return {
    text: parts.join("\n"),
    links: compact([
      links.skill(slug),
      ...(s.page.experienceSlugs || []).slice(0, 1).map((jslug) => links.job(jslug)),
      slug === "seo" ? links.medical() : null,
    ]),
  };
}

const skillIntent = (slug) => (lang) => skillAnswer(slug, lang);

const answers = {
  profile: (lang) => ({
    text:
      lang === "ur"
        ? "Fahad Muhammad Fahad Khan hain, jo Computer Science student hain aur full-stack web development, iOS development, programming, databases aur SEO mein experience rakhte hain."
        : `${personalInfo.name} — ${personalInfo.title}.\n\n${personalInfo.summary}`,
    links: [{ label: "View Skills", to: "/#skills" }],
  }),

  skills: (lang) => ({
    text: `${lang === "ur" ? "Fahad ki core skills ye hain:" : "Fahad's core skills are:"}\n${bullets(
      coreSkills.map((s) => `${s.title} — ${s.summary}`)
    )}\n\n${lang === "ur" ? "Programming aur technologies mein" : "Programming & technologies:"} ${joinList(
      technologies.map((t) => t.label),
      lang === "ur" ? "aur" : "and"
    )}${lang === "ur" ? " shamil hain." : "."}`,
    links: [{ label: "View Skills", to: "/#skills" }],
  }),

  projects: (lang) => ({
    text: `${
      lang === "ur"
        ? "Fahad ke portfolio mein ye projects aur kaam shamil hain:"
        : "Here are the projects and work in Fahad's portfolio:"
    }\n${bullets(projects.map(projectLine))}`,
    links: compact([{ label: "View Projects", to: "/#projects" }, links.medical()]),
  }),

  education: (lang) => ({
    text: `${lang === "ur" ? "Fahad ki education ye hai:" : "Fahad's education:"}\n${bullets(
      education.map((e) => `${e.institution} — ${e.degree}, ${e.status}`)
    )}`,
  }),

  experience: (lang) => ({
    text: `${lang === "ur" ? "Fahad ka experience ye hai:" : "Fahad's experience:"}\n${experience
      .map((e, i) => `${i + 1}. ${e.role} — ${e.company}`)
      .join("\n")}`,
    links: experience.map((e) => ({ label: e.role, to: experiencePath(e.slug) })),
  }),

  seo: skillIntent("seo"),
  digitalMarketing: skillIntent("digital-marketing"),
  socialMedia: skillIntent("social-media-marketing"),
  ios: skillIntent("ios-development"),
  fullStack: skillIntent("full-stack-development"),
  msOffice: skillIntent("ms-office"),
  programming: skillIntent("programming"),

  photography: (lang) => {
    const job = jobBySlug("photographer");
    return {
      text:
        lang === "ur"
          ? `Photography Fahad ki skills mein shamil hai, aur unhon ne ${job.company} mein ${job.role} ke taur par kaam kiya hai.`
          : `Photography is one of Fahad's skills, and he has worked as ${job.role} at ${job.company}.`,
      links: [links.job("photographer")],
    };
  },

  seoMedical: (lang) => {
    const p = projectById("medical-seo");
    return {
      text:
        lang === "ur"
          ? `Fahad ek medical website ke liye SEO ka kaam kar rahe hain: ${p.liveUrl}`
          : `Medical Website SEO: Fahad is doing SEO work for a medical website — ${p.liveUrl}`,
      links: compact([links.medical(), links.skill("seo")]),
    };
  },

  seoMachinez: (lang) => ({
    text:
      lang === "ur"
        ? "Fahad ne Machinez e-commerce ke liye SEO par kaam kiya hai."
        : "Fahad has worked on SEO for Machinez e-commerce.",
    links: [links.skill("seo")],
  }),

  perfume: (lang) => {
    const p = projectById("perfume-website");
    return {
      text:
        lang === "ur"
          ? `${p.title}: Fahad ne React ka istemal karke ek responsive perfume e-commerce website develop ki hai, jiska interface modern aur user-friendly hai.`
          : `${p.title}: ${p.description}`,
    };
  },

  web: (lang) => ({
    text: `${lang === "ur" ? "Fahad ke web development projects:" : "Fahad's web development projects:"}\n${bullets(
      webProjects.map(projectLine)
    )}`,
    links: [links.skill("full-stack-development")],
  }),

  contact: (lang) => ({
    text: `${
      lang === "ur"
        ? "Aap Fahad se email ya WhatsApp ke zariye contact kar sakte hain."
        : "You can contact Fahad by email or WhatsApp."
    }\nEmail: ${personalInfo.email}\nWhatsApp: ${personalInfo.whatsapp.display}`,
    links: [links.email, links.whatsapp],
  }),

  cv: (lang) => ({
    text:
      lang === "ur"
        ? "Aap Fahad ka CV neeche diye gaye button se download kar sakte hain."
        : "You can download Fahad's CV using the button below.",
    links: [links.cv],
  }),

  greeting: (lang) => ({
    text:
      lang === "ur"
        ? "Assalam o Alaikum! Aap Fahad ki skills, projects, education, experience, SEO work ya contact information ke bare mein pooch sakte hain."
        : "Hello! Ask me about Fahad's skills, projects, education, experience, SEO work, or contact information.",
  }),

  thanks: (lang) => ({
    text:
      lang === "ur"
        ? "Shukriya! Fahad ke bare mein aur kuch janna ho to zaroor puchein."
        : "You're welcome! Let me know if you'd like to know anything else about Fahad.",
  }),
};

export function replyFor(intent, lang) {
  const build = answers[intent];
  if (!build) return { text: NOT_AVAILABLE[lang], links: [] };
  const { text, links: l = [] } = build(lang);
  return { text, links: l };
}

/** Main entry: message in, { text, links } out. Never calls the network. */
export function getReply(message) {
  const lang = detectLanguage(message);
  const intent = detectIntent(message);
  return replyFor(intent, lang);
}

export const WELCOME_MESSAGE =
  "Hi! I'm Fahad's portfolio assistant. You can ask me about Fahad's skills, projects, education, experience, SEO work, or contact information.";

// Suggested questions shown in the chat. They are answered by the same matcher as typed questions.
export const suggestedQuestions = [
  "Tell me about Fahad",
  "What are his core skills?",
  "Tell me about his SEO skills",
  "What digital marketing experience does he have?",
  "What are his projects?",
  "What is his experience?",
  "How can I contact Fahad?",
];
