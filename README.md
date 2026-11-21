# Muhammad Fahad Khan — 3D Portfolio

A cinematic, interactive 3D portfolio built with **Next.js 15 (App Router) + TypeScript (strict)**, **Tailwind CSS v4**, **Three.js** (one shared WebGL renderer) and **GSAP** (ScrollTrigger + SplitText). It is exported as a fully static site, so every page is pre-rendered HTML served from the CDN.

Experience: real-progress **0 → 100 loader** → Hero (**interactive 3D keyboard + Digital Core**) → About (**Mechanical Orbital Code System**) → Skills (**3D Technology Network**, scroll-assembled) → Projects (**automatic 3D rotating exhibition** with filters) → Contact (**3D Communication Tower**, message form + free SEO audit request).

## Prerequisites

- Node.js **18.18+** (20 or 22 recommended)
- npm 9+

## Install & run

```bash
npm install          # install dependencies
npm run dev          # development server → http://localhost:3000
npm run build        # production build → static site in out/
npm run start        # serve the built out/ folder locally
npm run typecheck    # TypeScript check
```

## Where to edit things

All content lives in **`src/data/portfolio.ts`**.

| What | Where |
| --- | --- |
| Name, title, tagline, email, phone, WhatsApp | `personal` |
| **GitHub URL** | `GITHUB_URL` |
| LinkedIn URL | `LINKEDIN_URL` |
| Live site URL (SEO / Open Graph) | `SITE_URL` |
| About text, statistics, services, current SEO clients | `about`, `services`, `currentSeo` |
| Skills cards, 3D network labels, marquee | `skillGroups`, `networkNodes`, `marquee` |
| Projects and filters | `projects`, `projectFilters` |
| Contact text / inbox | `contactCopy`, `CONTACT_EMAIL` |
| Logo / favicon / social image | `public/logo.svg`, `public/favicon.svg`, `public/apple-touch-icon.png`, `public/og.png` |
| Colours & fonts | `src/app/globals.css` (`@theme`) and `src/three/common.ts` (3D palette) |
| Page title / meta description | `src/app/layout.tsx` |

### Project links and images

Each project has `url`, `github` and `image` fields. Client websites are intentionally **not linked**.

- Add a live link → `url: "https://…"`; the card then shows an "open" arrow button.
- Add a screenshot → put the file in `public/projects/` (e.g. `public/projects/shelfo-pos.webp`, about 800×500, WebP) and set `image: "/projects/shelfo-pos.webp"`. Without an image, a styled preview is drawn in code.

## Contact form → your Gmail (Web3Forms)

The form sends through [Web3Forms](https://web3forms.com) using `WEB3FORMS_KEY` in `src/data/portfolio.ts` (a public access key tied to the inbox). Messages arrive directly in your email. If the key is removed, the form falls back to opening the visitor's email app / WhatsApp with the message pre-filled.

To change the receiving inbox, create a new access key at web3forms.com with the new email and replace `WEB3FORMS_KEY`.

## Deployment (Vercel)

The repo is connected to Vercel; every push to `main` deploys automatically. The Vercel project's framework preset must be **Next.js** (`vercel.json` sets it).

For a fresh setup, push the folder to GitHub, then go to vercel.com → **Add New → Project** and import the repo. Vercel detects Next.js; no settings or env vars are needed. Any static host also works: run `npm run build` and upload `out/`.

## Performance notes

- One fixed WebGL canvas renders every section through scissor viewports. That means a single GL context, scenes that build lazily near the viewport, and zero cost for off-screen sections.
- `three` loads via dynamic import while the loader runs, and only on devices with a real GPU. Software renderers (headless test machines such as PageSpeed Insights, some low-end devices) and Data-Saver users get static renders of each scene from `public/fallback/`, so the page never freezes. Add `?3d` to the URL to force 3D for testing.
- If you change a 3D scene, refresh its fallback image in `public/fallback/` (screenshot of the scene, WebP).
- There's no scroll-jacking (native scrolling), no backdrop blur over the canvas and no full-screen animated overlays, so scrolling stays smooth.
- Pixel ratio is capped (1.5 desktop / 1.25 others) and lowers itself automatically when frames drop. Phones render 3D at 30 fps with fewer particles.
- Fonts are self-hosted, and only the Latin subsets download.
- `prefers-reduced-motion` disables auto-rotation, scroll scrubbing and heavy 3D motion.
