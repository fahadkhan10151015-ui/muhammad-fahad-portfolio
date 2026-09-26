/**
 * ==================================================================
 *  PORTFOLIO CONTENT
 *  ------------------------------------------------------------------
 *  This is the ONLY file you need to edit to update your website.
 *  Change the text inside the quotes, save, and the site updates.
 *  The "Ask Fahad AI" assistant also reads its answers from here.
 *
 *  Tips:
 *  - Empty text ("") or empty lists ([]) are hidden automatically.
 *  - Icon names come from https://lucide.dev/icons — the ones you can
 *    use are listed in src/components/Icon.jsx (add more there).
 * ==================================================================
 */

/* ------------------------------------------------------------------
 * 1. PERSONAL INFORMATION
 * ------------------------------------------------------------------ */
export const personalInfo = {
  name: "Muhammad Fahad Khan",
  initials: "MF",
  title: "Computer Science Student | Full-Stack & Mobile Developer",
  summary:
    "Computer Science student with hands-on experience in full-stack web development, iOS development, programming, databases, and SEO. Skilled in C#, Java, C++, ASP.NET MVC, SQL Server, Windows Forms, and front-end/back-end web development. Experienced in building responsive, user-friendly web and mobile applications.",
  status: "", // optional short status line under the hero (leave empty to hide)
  location: "Rawalpindi, Pakistan",

  email: "fahadkhan10151015@gmail.com",

  whatsapp: {
    display: "03350947538", // shown on the website
    international: "923350947538", // used for the wa.me link (no + or spaces)
  },

  // Your CV lives at: public/Muhammad_Fahad_Khan_CV.pdf
  cvUrl: "/Muhammad_Fahad_Khan_CV.pdf",
  cvDownloadName: "Muhammad_Fahad_Khan_CV.pdf",
};

// Built automatically from the values above — no need to edit.
export const whatsappLink = `https://wa.me/${personalInfo.whatsapp.international}`;
export const emailSubject = "Portfolio Inquiry — Muhammad Fahad Khan";
export const emailLink = `mailto:${personalInfo.email}?subject=${encodeURIComponent(emailSubject)}`;

// Page addresses (used by cards, buttons and the assistant).
export const skillPath = (slug) => `/skills/${slug}`;
export const experiencePath = (slug) => `/experience/${slug}`;

/* ------------------------------------------------------------------
 * 2. SOCIAL LINKS
 *    Paste your full profile URL between the quotes.
 *    Buttons only appear on the site when a URL is filled in.
 * ------------------------------------------------------------------ */
export const socialLinks = {
  github: "",
  linkedin: "",
};

/* ------------------------------------------------------------------
 * 3. NAVIGATION (id must match a section id on the home page)
 * ------------------------------------------------------------------ */
export const navLinks = [
  { id: "home", label: "Home" },
  { id: "about", label: "About" },
  { id: "experience", label: "Experience" },
  { id: "skills", label: "Skills" },
  { id: "projects", label: "Projects" },
  { id: "education", label: "Education" },
  { id: "contact", label: "Contact" },
];

/* ------------------------------------------------------------------
 * 4. ABOUT — focus areas shown next to your summary
 * ------------------------------------------------------------------ */
export const aboutHighlights = [
  { label: "Full-Stack Web Development", icon: "Layers" },
  { label: "iOS Development", icon: "Smartphone" },
  { label: "Programming", icon: "Terminal" },
  { label: "Databases", icon: "Database" },
  { label: "SEO", icon: "Search" },
  { label: "Front-End Development", icon: "LayoutTemplate" },
  { label: "Back-End Development", icon: "Server" },
  { label: "Responsive Applications", icon: "MonitorSmartphone" },
];

/* ------------------------------------------------------------------
 * 5. SKILLS — every entry has its own page at /skills/<slug>
 *
 *    core: true      -> shown as a main card at the top of the Skills section
 *    summary         -> one or two sentences on the card
 *    tags            -> small chips on the card
 *    page.intro      -> large paragraph under the page title
 *    page.overview   -> more paragraphs
 *    page.sections   -> [{ id, title, icon, text, items: [] }]
 *                       items can be plain text or { title, text, to }
 *    page.workflow   -> optional step-by-step strip { title, text, steps: [{ title, text, icon }] }
 *    page.projectIds / experienceSlugs / skillSlugs -> related work
 *
 *    Only list technologies and claims you can back up. No results,
 *    rankings, traffic or other statistics are claimed anywhere.
 * ------------------------------------------------------------------ */
export const skillPages = [
  /* ------------------------------ SEO ------------------------------ */
  {
    slug: "seo",
    core: true,
    title: "SEO",
    icon: "Search",
    summary: "On-page, off-page and technical SEO — keyword targeting, content optimization and search visibility.",
    tags: ["On-Page SEO", "Off-Page SEO", "Technical SEO"],
    page: {
      eyebrow: "Core skill",
      intro:
        "Experienced in search engine optimization with practical knowledge of on-page, off-page, and technical SEO. My SEO work focuses on website structure, keyword targeting, content optimization, search visibility, technical accessibility, and organic search optimization.",
      overview: [
        "Search engine optimization is about making a website easier for search engines to find and understand, while keeping it clear and useful for the people who visit it. Good SEO is a mix of content, structure and technical foundations, so my approach covers all three: on-page, off-page and technical SEO, supported by ongoing research and analysis.",
        "I have worked on SEO for an e-commerce website, for Machinez e-commerce, and I am doing SEO work for a medical website, as well as working as an SEO Specialist at Augmenteck.",
      ],
      sections: [
        {
          id: "on-page-seo",
          title: "On-Page SEO",
          icon: "FileText",
          text: "On-page SEO is about making every page clear to both search engines and visitors. It starts with understanding what people search for and the intent behind those searches, then reflecting that in titles, descriptions, headings, content, images and internal links, so each page has a clear focus and a logical place in the site.",
          items: [
            "Keyword Research",
            "Keyword Targeting",
            "Search Intent",
            "Title Tag Optimization",
            "Meta Description Optimization",
            "Heading Structure",
            "Content Optimization",
            "Keyword Placement",
            "Internal Linking",
            "URL Optimization",
            "Image Optimization",
            "Image Alt Text",
            "Content Structure",
            "Search-Friendly Page Optimization",
          ],
        },
        {
          id: "off-page-seo",
          title: "Off-Page SEO",
          icon: "Link2",
          text: "Off-page SEO covers the signals that come from outside the website itself. It centres on link building and backlink development, and on external link strategies that strengthen the authority of a website over time. The aim is a healthy, relevant link profile rather than shortcuts.",
          items: [
            "Link Building",
            "Backlink Development",
            "Off-Page Optimization",
            "External Link Strategies",
            "Website Authority Improvement",
          ],
        },
        {
          id: "technical-seo",
          title: "Technical SEO",
          icon: "Wrench",
          text: "Technical SEO makes sure search engines can reach, crawl and index a website properly. It looks at how the site is structured, how easily bots and users can move through it, how it behaves on mobile devices and how well it performs, so that great content is not held back by technical problems.",
          items: [
            "Website Crawlability",
            "Search Engine Accessibility",
            "Indexing",
            "Site Structure",
            "Technical Website Optimization",
            "Technical SEO Analysis",
            "Mobile-Friendly Considerations",
            "Website Performance Considerations",
          ],
        },
        {
          id: "seo-analysis",
          title: "SEO Analysis & Research",
          icon: "SearchCheck",
          text: "Analysis and research keep SEO work grounded in evidence instead of guesswork. It includes researching keywords and competitors, auditing websites, reviewing search visibility and content, and using what is learned to keep improving a website's organic search performance step by step. SEO is an ongoing process, so analysis continues after each round of optimization.",
          items: [
            "Keyword Research",
            "Competitor Analysis",
            "SEO Audits",
            "Search Visibility Analysis",
            "Organic Search Optimization",
            "Content Analysis",
            "Website Optimization",
            "Ongoing SEO Improvement",
          ],
        },
      ],
      workflow: {
        title: "SEO workflow",
        text: "A simple, repeatable cycle that keeps SEO work structured.",
        steps: [
          { title: "Research", icon: "Compass", text: "Understand the website, its audience, target keywords and search intent." },
          { title: "Analyze", icon: "SearchCheck", text: "Audit the website and review competitors and current search visibility." },
          { title: "Optimize", icon: "Wrench", text: "Apply on-page, off-page and technical improvements." },
          { title: "Improve", icon: "TrendingUp", text: "Refine content and structure based on what the analysis shows." },
          { title: "Monitor", icon: "Activity", text: "Keep reviewing search visibility and organic performance, then repeat." },
        ],
      },
      projectIds: ["ecommerce-seo", "medical-seo", "machinez-seo"],
      experienceSlugs: ["seo-specialist"],
      skillSlugs: ["digital-marketing"],
    },
  },

  /* --------------------------- Full-Stack -------------------------- */
  {
    slug: "full-stack-development",
    core: true,
    title: "Full-Stack Development",
    icon: "Layers",
    summary: "Responsive web applications built with React, ASP.NET MVC, C# and SQL Server.",
    tags: ["React", "ASP.NET MVC", "SQL Server"],
    page: {
      eyebrow: "Core skill",
      intro:
        "Full-stack development means working on both sides of a web application: the interface people see and the logic and data behind it. I build responsive, user-friendly web applications using React on the front end, ASP.NET MVC with C# on the back end, and SQL Server for data.",
      overview: [
        "Working across the whole stack helps me think about an application end to end — how a screen looks and feels, how the server handles requests, and how information is stored and retrieved. My professional title, Full-Stack & Mobile Developer, reflects that web and mobile work sit together.",
      ],
      sections: [
        {
          id: "front-end",
          title: "Front-End",
          icon: "LayoutTemplate",
          text: "The front end is everything a visitor sees and interacts with. I focus on clean, modern, responsive interfaces that feel natural to use on phones, tablets and desktops.",
          items: ["React", "Responsive Web Development", "Modern Web UI", "User-Friendly Interfaces"],
        },
        {
          id: "back-end",
          title: "Back-End",
          icon: "Server",
          text: "The back end holds the application logic: handling requests, applying rules and connecting the interface to stored data. I build it with ASP.NET MVC and C#.",
          items: ["ASP.NET MVC", "C#"],
        },
        {
          id: "database",
          title: "Database",
          icon: "Database",
          text: "Applications need reliable data storage. I use SQL Server to store and manage application data.",
          items: ["SQL Server"],
        },
        {
          id: "development-areas",
          title: "Development areas",
          icon: "Layers",
          text: "These three areas come together in full-stack work. The Complaint Management System is an example: ASP.NET MVC and C# provide the application logic, and SQL Server stores the complaints and staff assignments.",
          items: ["Front-End Development", "Back-End Development", "Responsive Web Development"],
        },
      ],
      projectIds: ["complaint-management", "perfume-website"],
      experienceSlugs: ["full-stack-developer"],
      skillSlugs: ["programming", "ios-development"],
    },
  },

  /* ------------------------------- iOS ----------------------------- */
  {
    slug: "ios-development",
    core: true,
    title: "iOS Development",
    icon: "Smartphone",
    summary: "iOS application development, including the Course Evaluation iOS App.",
    tags: ["iOS apps", "Mobile"],
    page: {
      eyebrow: "Core skill",
      intro:
        "iOS development is the mobile side of my work as a Full-Stack & Mobile Developer. I have developed an iOS application for course evaluation, designed to provide a mobile-based way for students to evaluate courses.",
      overview: [
        "Mobile apps put an application directly in the user's hands, so they need to feel clear, simple and comfortable to use. That mindset carries over from my front-end and user-interface work on the web.",
      ],
      sections: [
        {
          id: "mobile-development",
          title: "Mobile development",
          icon: "Smartphone",
          text: "iOS development focuses on building applications for Apple's mobile devices. It is one of the skills that makes my profile both full-stack and mobile.",
          items: ["iOS Development", "Mobile-based user experience"],
        },
        {
          id: "featured-project",
          title: "Featured project",
          icon: "Layers",
          text: "Course Evaluation iOS App — Fahad developed an iOS application for course evaluation.",
          items: [{ title: "Course Evaluation iOS App", text: "iOS Development" }],
        },
      ],
      projectIds: ["course-evaluation"],
      skillSlugs: ["full-stack-development"],
    },
  },

  /* ------------------------ Digital Marketing ---------------------- */
  {
    slug: "digital-marketing",
    core: true,
    title: "Digital Marketing",
    icon: "Megaphone",
    summary: "Facebook and Instagram advertising, audience targeting and social media promotion.",
    tags: ["Facebook Ads", "Instagram Ads", "Strategy"],
    page: {
      eyebrow: "Core skill",
      intro:
        "Digital marketing experience includes social media marketing, paid advertising, audience targeting, and promotional activities across platforms such as Facebook and Instagram. I have worked in a professional digital marketing role with Prime Company.",
      overview: [
        "Digital marketing is about reaching the right people online with the right message. My work sits mainly in paid social media and social media marketing, supported by a clear digital marketing strategy.",
      ],
      sections: [
        {
          id: "paid-advertising",
          title: "Paid advertising",
          icon: "Megaphone",
          text: "Paid social media advertising puts a message in front of a chosen audience on platforms such as Facebook and Instagram. It relies on clear campaign planning and careful audience choices.",
          items: ["Facebook Ads", "Instagram Ads", "Paid Social Media Campaigns"],
        },
        {
          id: "social-media",
          title: "Social media",
          icon: "Share2",
          text: "Beyond ads, social media work includes marketing a brand or product on social platforms, managing its presence and promoting it to its audience.",
          items: ["Social Media Marketing", "Social Media Management", "Social Media Promotion"],
        },
        {
          id: "audience-strategy",
          title: "Audience & strategy",
          icon: "Target",
          text: "Knowing who a campaign is for shapes everything else. Audience targeting and an overall digital marketing strategy keep the work focused and consistent.",
          items: ["Audience Targeting", "Digital Marketing Strategy"],
        },
      ],
      experienceSlugs: ["digital-marketing"],
      skillSlugs: ["social-media-marketing", "seo"],
    },
  },

  /* ---------------------- Social Media Marketing ------------------- */
  {
    slug: "social-media-marketing",
    core: true,
    title: "Social Media Marketing",
    icon: "Share2",
    summary: "Social media management, promotion and paid campaigns across Facebook and Instagram.",
    tags: ["Facebook", "Instagram", "Management"],
    page: {
      eyebrow: "Core skill",
      intro:
        "Social media marketing means using social platforms to promote products and brands and to connect with an audience. My experience covers Facebook and Instagram marketing, social media management, promotion and paid social media campaigns.",
      overview: [
        "I approach social media as both a communication channel and a promotion channel: keeping a presence organised and consistent, and using paid campaigns and audience targeting when a message needs to reach further.",
      ],
      sections: [
        {
          id: "platforms",
          title: "Platforms",
          icon: "Share2",
          text: "Facebook and Instagram are the platforms I have worked with for marketing and promotion.",
          items: ["Facebook Marketing", "Instagram Marketing"],
        },
        {
          id: "management-content",
          title: "Management & content",
          icon: "Users",
          text: "Managing social media means keeping a brand's presence organised, while content promotion helps the right posts and messages reach the right people.",
          items: ["Social Media Management", "Social Media Promotion", "Content Promotion"],
        },
        {
          id: "paid-strategy",
          title: "Paid campaigns & strategy",
          icon: "Target",
          text: "Paid social media campaigns and audience targeting extend the reach of organic work, guided by an overall social media strategy.",
          items: ["Paid Social Media Campaigns", "Audience Targeting", "Social Media Strategy"],
        },
      ],
      experienceSlugs: ["digital-marketing"],
      skillSlugs: ["digital-marketing"],
    },
  },

  /* ----------------------------- MS Office ------------------------- */
  {
    slug: "ms-office",
    core: true,
    title: "MS Office",
    icon: "FileSpreadsheet",
    summary: "Document creation, formatting and spreadsheet work in MS Word and MS Excel.",
    tags: ["MS Word", "MS Excel"],
    page: {
      eyebrow: "Core skill",
      intro:
        "Comfortable with everyday professional office work in Microsoft Word and Microsoft Excel, from creating and formatting documents to working with spreadsheets.",
      overview: [
        "These tools support almost every other kind of work I do — from writing and organising information to keeping data tidy and easy to read.",
      ],
      sections: [
        {
          id: "ms-word",
          title: "MS Word",
          icon: "FileText",
          text: "Word is used for creating and formatting documents so that they are clear, consistent and professional.",
          items: ["Document Creation", "Document Formatting"],
        },
        {
          id: "ms-excel",
          title: "MS Excel",
          icon: "FileSpreadsheet",
          text: "Excel is used for spreadsheet work: organising, entering and working with data in a structured way.",
          items: ["Spreadsheet Work"],
        },
        {
          id: "productivity",
          title: "Office productivity",
          icon: "ListChecks",
          text: "General office productivity means using these tools efficiently for day-to-day professional tasks.",
          items: ["General Office Productivity"],
        },
      ],
      skillSlugs: ["digital-marketing"],
    },
  },

  /* ---------------------------- Programming ------------------------ */
  {
    slug: "programming",
    core: false,
    title: "Programming",
    icon: "Braces",
    summary: "C#, Java and C++ for programming practice and academic projects.",
    tags: ["C#", "Java", "C++"],
    page: {
      eyebrow: "Programming",
      intro:
        "C#, Java and C++ are the programming languages I use for programming practice and academic projects. They form the foundation for the web, desktop and console applications I have built.",
      overview: [
        "Programming is the base that my full-stack and desktop work is built on. Each language is connected to specific projects in this portfolio.",
      ],
      sections: [
        {
          id: "languages",
          title: "Languages",
          icon: "Braces",
          text: "The three languages I work with, and where I use them.",
          items: [
            {
              title: "C#",
              text: "Used with ASP.NET MVC for web back ends and with Windows Forms for desktop applications.",
              to: "/skills/full-stack-development",
            },
            { title: "Java", text: "Used for console-based programming projects and problem solving." },
            { title: "C++", text: "Used for console-based programming projects and problem solving." },
          ],
        },
        {
          id: "connections",
          title: "Where they are used",
          icon: "Layers",
          text: "How the languages connect to the technologies and projects in this portfolio.",
          items: [
            "C# → ASP.NET MVC",
            "C# → Windows Forms",
            "Java → Programming Projects",
            "C++ → Programming Projects",
          ],
        },
      ],
      projectIds: ["console-projects", "course-registration", "complaint-management"],
      skillSlugs: ["full-stack-development"],
    },
  },
];

export const coreSkills = skillPages.filter((s) => s.core);

// Technology chips shown under the core skills; each one links to a page that covers it.
export const technologies = [
  { label: "C#", to: "/skills/programming" },
  { label: "Java", to: "/skills/programming" },
  { label: "C++", to: "/skills/programming" },
  { label: "React", to: "/skills/full-stack-development" },
  { label: "ASP.NET MVC", to: "/skills/full-stack-development" },
  { label: "SQL Server", to: "/skills/full-stack-development" },
  { label: "Windows Forms", to: "/skills/programming" },
  { label: "Photography", to: "/experience/photographer" },
];

/* ------------------------------------------------------------------
 * 6. EXPERIENCE — every entry has its own page at /experience/<slug>
 *    Order here is the order on the site.
 *    date: leave "" to hide (no dates have been provided).
 * ------------------------------------------------------------------ */
export const experience = [
  {
    slug: "seo-specialist",
    role: "SEO Specialist",
    company: "Augmenteck",
    icon: "Search",
    date: "",
    summary: "Search engine optimization across on-page, off-page and technical SEO.",
    page: {
      eyebrow: "Experience",
      intro:
        "SEO Specialist at Augmenteck, working on search engine optimization: improving how websites are structured, optimized and presented to search engines so they can be found through organic search.",
      overview: [
        "The areas below describe the SEO work I am experienced in. No rankings, traffic or other results are claimed — this page explains what the work covers.",
      ],
      sections: [
        {
          id: "on-page-seo",
          title: "On-Page SEO",
          icon: "FileText",
          text: "Optimizing individual pages so that their purpose is clear to search engines and visitors.",
          items: ["Keyword Research", "Content Optimization", "Internal Linking", "URL Optimization", "Image Optimization"],
        },
        {
          id: "off-page-seo",
          title: "Off-Page SEO",
          icon: "Link2",
          text: "Working on signals from outside the website, mainly links pointing to it.",
          items: ["Link Building", "Backlinks"],
        },
        {
          id: "technical-seo",
          title: "Technical SEO",
          icon: "Wrench",
          text: "Making sure search engines can access, crawl and index a website properly.",
          items: ["Crawlability", "Indexing", "Site Structure", "Mobile Considerations", "Performance Considerations"],
        },
        {
          id: "seo-analysis",
          title: "Analysis & optimization",
          icon: "SearchCheck",
          text: "Reviewing a website and its competitors, then using the findings to keep improving.",
          items: ["SEO Audits", "Competitor Analysis", "Search Visibility", "Organic Optimization"],
        },
      ],
      projectIds: [],
      skillSlugs: ["seo"],
    },
  },
  {
    slug: "photographer",
    role: "Photographer",
    company: "A telecommunication",
    icon: "Camera",
    date: "",
    summary: "Photography role at A telecommunication.",
    page: {
      eyebrow: "Experience",
      intro: "Photographer at A telecommunication. Photography is also one of my skills.",
      overview: [
        "Photography is one of my listed skills, alongside my development, SEO and digital marketing work.",
      ],
      sections: [
        {
          id: "role",
          title: "Role",
          icon: "Camera",
          text: "Photographer at A telecommunication.",
          items: ["Photography"],
        },
      ],
      skillSlugs: [],
    },
  },
  {
    slug: "full-stack-developer",
    role: "Full-Stack Developer",
    company: "Digital Teach Company",
    icon: "Layers",
    date: "",
    summary: "Full-stack web development covering both the front end and the back end.",
    page: {
      eyebrow: "Experience",
      intro:
        "Full-Stack Developer at Digital Teach Company. Full-stack development covers both sides of a web application: the user-facing interface (the front end) and the server-side logic and data handling (the back end).",
      overview: [
        "This page describes the role in general terms. It does not list specific projects, clients or results.",
      ],
      sections: [
        {
          id: "role-focus",
          title: "Role focus",
          icon: "Layers",
          text: "The areas that make up full-stack development.",
          items: ["Front-End Development", "Back-End Development", "Responsive Web Development"],
        },
        {
          id: "technologies",
          title: "Full-stack technologies I work with",
          icon: "Braces",
          text: "The technologies from my full-stack skill set.",
          items: ["React", "ASP.NET MVC", "C#", "SQL Server"],
        },
      ],
      projectIds: ["complaint-management"],
      skillSlugs: ["full-stack-development", "programming"],
    },
  },
  {
    slug: "digital-marketing",
    role: "Digital Marketing",
    company: "Prime Company",
    icon: "Megaphone",
    date: "",
    summary: "Professional digital marketing across Facebook and Instagram.",
    page: {
      eyebrow: "Experience",
      intro:
        "Professional Digital Marketing work with Prime Company, including social media marketing, paid advertising, audience targeting, and promotional activities across platforms such as Facebook and Instagram.",
      overview: [
        "No ad budgets, campaign results or other statistics are claimed. This page describes the areas the work covered.",
      ],
      sections: [
        {
          id: "paid-advertising",
          title: "Paid advertising",
          icon: "Megaphone",
          text: "Paid social media advertising on Facebook and Instagram.",
          items: ["Facebook Ads", "Instagram Ads", "Paid Social Media Campaigns"],
        },
        {
          id: "social-media",
          title: "Social media",
          icon: "Share2",
          text: "Marketing, managing and promoting a presence on social platforms.",
          items: ["Social Media Marketing", "Social Media Management", "Social Media Promotion"],
        },
        {
          id: "audience-strategy",
          title: "Audience & digital marketing",
          icon: "Target",
          text: "Choosing who a campaign is for and keeping the overall digital marketing work focused.",
          items: ["Audience Targeting", "Digital Marketing"],
        },
      ],
      skillSlugs: ["digital-marketing", "social-media-marketing"],
    },
  },
];

/* ------------------------------------------------------------------
 * 7. EDUCATION
 *    current: true shows a "live" indicator next to the status.
 * ------------------------------------------------------------------ */
export const education = [
  {
    institution: "Arid Agriculture University",
    degree: "Bachelor of Science in Computer Science (BSCS)",
    status: "In Progress — 6th Semester",
    current: true,
  },
  {
    institution: "Superior Group of College",
    degree: "HSSC",
    status: "2023",
    current: false,
  },
  {
    institution: "Bright Hall School",
    degree: "SSC",
    status: "2021",
    current: false,
  },
];

/* ------------------------------------------------------------------
 * 8. PROJECTS
 *    To add a project, copy one { ... } block, paste it at the end,
 *    and change the text. Numbers (01, 02...) are added automatically.
 *
 *    type      -> which filter tab it belongs to: "web" | "ios" | "programming" | "seo"
 *    category  -> the label shown on the card
 *    icon      -> a name listed in src/components/Icon.jsx
 *    featured  -> true shows it in the hero's "Selected work" list
 *    liveUrl / repoUrl: leave "" to hide the button. Only add a URL
 *    when you really have one.
 * ------------------------------------------------------------------ */
export const projectFilters = [
  { id: "all", label: "All" },
  { id: "web", label: "Web Development" },
  { id: "ios", label: "iOS" },
  { id: "programming", label: "Programming" },
  { id: "seo", label: "SEO" },
];

export const projects = [
  {
    id: "complaint-management",
    title: "Complaint Management System",
    type: "web",
    category: "Web Development",
    icon: "Server",
    description:
      "Developed a basic complaint management system using ASP.NET MVC and SQL Server for managing complaints and staff assignments.",
    tech: ["ASP.NET MVC", "SQL Server"],
    liveUrl: "",
    repoUrl: "",
    featured: true,
  },
  {
    id: "course-registration",
    title: "Course Registration System",
    type: "programming",
    category: "Desktop Application",
    icon: "Monitor",
    description:
      "Created a desktop-based course registration system with basic student and course management features.",
    tech: ["C#", "Windows Forms"],
    liveUrl: "",
    repoUrl: "",
  },
  {
    id: "console-projects",
    title: "Console-Based Programming Projects",
    type: "programming",
    category: "Programming",
    icon: "Terminal",
    description:
      "Built small console applications in Java, C++, and C# for practice and problem solving.",
    tech: ["Java", "C++", "C#"],
    liveUrl: "",
    repoUrl: "",
  },
  {
    id: "course-evaluation",
    title: "Course Evaluation iOS App",
    type: "ios",
    category: "iOS Development",
    icon: "Smartphone",
    description: "Fahad developed an iOS application for course evaluation.",
    tech: [],
    liveUrl: "",
    repoUrl: "",
    featured: true,
  },
  {
    id: "perfume-website",
    title: "Perfume E-commerce Website",
    type: "web",
    category: "Web Development",
    icon: "ShoppingBag",
    description:
      "Fahad developed a responsive perfume e-commerce website using React with a modern and user-friendly interface.",
    tech: ["React"],
    liveUrl: "",
    repoUrl: "",
    featured: true,
  },
  {
    id: "ecommerce-seo",
    title: "E-commerce SEO Project",
    type: "seo",
    category: "SEO",
    icon: "TrendingUp",
    description:
      "Fahad has worked on SEO for an e-commerce website, focusing on search visibility and organic performance.",
    tech: [],
    liveUrl: "",
    repoUrl: "",
  },
  {
    id: "medical-seo",
    title: "Medical Website SEO",
    type: "seo",
    category: "SEO",
    icon: "Stethoscope",
    description: "Fahad is doing SEO work for this medical website.",
    tech: [],
    liveUrl: "https://techeramedsystems.com/",
    linkLabel: "techeramedsystems.com", // text on the link button (defaults to "View live")
    repoUrl: "",
  },
  {
    id: "machinez-seo",
    title: "Machinez E-commerce SEO",
    type: "seo",
    category: "SEO / E-commerce",
    icon: "Search",
    description: "Fahad has worked on SEO for Machinez e-commerce.",
    tech: [],
    liveUrl: "",
    repoUrl: "",
  },
];

/* ------------------------------------------------------------------
 * 9. CONTACT SECTION TEXT
 * ------------------------------------------------------------------ */
export const contact = {
  heading: "Let's Build Something Together",
  text: "Have a project in mind or want to connect? Reach out by email or WhatsApp.",
};
