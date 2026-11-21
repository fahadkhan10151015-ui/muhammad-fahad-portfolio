# Muhammad Fahad Khan — 3D Portfolio

A cinematic, interactive 3D portfolio built with **React + Vite + Tailwind CSS v4**, **Three.js** (raw WebGL, one shared renderer), **GSAP** (ScrollTrigger + SplitText) and **Lenis** smooth scrolling.

Experience: real-progress **0 → 100 loader** → Hero (**interactive 3D keyboard + Digital Core**) → About (**Mechanical Orbital Code System**) → Skills (**3D Technology Network**, scroll-assembled) → Projects (**automatic 3D rotating exhibition** with filters) → Contact (**3D Communication Tower**).

## Prerequisites

- Node.js **18.18+** (20 or 22 recommended)
- npm 9+

## Install & run

```bash
npm install          # install dependencies
npm run dev          # development server → http://localhost:5173
npm run build        # production build → dist/
npm run preview      # serve the production build locally
```

## Where to edit things

| What | Where |
| --- | --- |
| Name, title, tagline, email, phone, WhatsApp | `src/data/portfolio.js` → `personal` |
| **GitHub URL** | `src/data/portfolio.js` → `GITHUB_URL` (also `index.html` JSON-LD `sameAs`) |
| LinkedIn (hidden while empty) | `src/data/portfolio.js` → `LINKEDIN_URL` |
| About text, statistics, experience, education | `src/data/portfolio.js` → `about`, `experience`, `education` |
| Skills cards, 3D network labels, marquee | `src/data/portfolio.js` → `skillGroups`, `networkNodes`, `marquee` |
| Projects, filters, live / GitHub links | `src/data/portfolio.js` → `projects`, `projectFilters` |
| CV file | `public/Muhammad_Fahad_Khan_CV.pdf` |
| Logo / favicon | `public/logo.svg`, `public/favicon.svg`, `public/apple-touch-icon.png` |
| Social preview image | `public/og.png` |
| Colours & fonts | `src/index.css` (`@theme`) and `src/three/common.js` (3D palette) |
| Page title / SEO meta | `index.html` |

### Project links and images

Each project has `url`, `github` and `image` fields. They are empty on purpose (no links were invented).

- Add a real link → `url: "https://…"` and the card shows an "open" arrow button.
- Add a screenshot → put the file in `public/projects/` (e.g. `public/projects/perfume-point.webp`, ~800×500, WebP) and set `image: "/projects/perfume-point.webp"`. Without an image a styled preview is drawn in code.

## Environment variables (contact form)

The contact form posts to the serverless function `api/contact.js`, which sends email through [Resend](https://resend.com).

1. Copy `.env.example` → `.env` for local use with `vercel dev`, or add the variables in **Vercel → Project → Settings → Environment Variables**:
   - `RESEND_API_KEY` — required to send email
   - `CONTACT_TO_EMAIL` — inbox that receives messages (defaults to fahadkhan10151015@gmail.com)
   - `CONTACT_FROM_EMAIL` — verified sender (defaults to `Portfolio <onboarding@resend.dev>`)
2. Redeploy.

Without `RESEND_API_KEY` the form still works: it validates the input and opens the visitor's email app with the message pre-filled (plus a WhatsApp option). The API key is only used server-side and is never sent to the browser.

## Deployment (Vercel)

The project is connected to Vercel through GitHub — every push to `main` deploys automatically.

For a fresh setup: push the folder to GitHub → vercel.com → **Add New → Project** → import the repo. Vercel detects Vite (build `npm run build`, output `dist`). `vercel.json` adds the SPA rewrite (excluding `/api`) and long-term caching for hashed assets.

Other static hosts (Netlify, Cloudflare Pages) work too; the contact form will use the mail-app fallback unless you port `api/contact.js` to that host's functions.

## Performance notes

- One fixed WebGL canvas renders every section through scissor viewports — one GL context, off-screen scenes cost nothing, and scenes build lazily as they approach the viewport.
- `three` (~150 KB gzip) is loaded with a dynamic import while the loader runs; the first paint ships only React, GSAP/Lenis and the page.
- Pixel ratio is capped and adapts automatically if the frame rate drops; phones get fewer particles and no shadows.
- Fonts are self-hosted (no third-party requests); only Latin subsets download.
- `prefers-reduced-motion` disables smooth scrolling, scroll scrubbing, auto-rotation and heavy 3D motion.
