# Muhammad Fahad Khan — Portfolio

React + Vite + Tailwind CSS v4 + Framer Motion + Lucide + React Router.

Skill and experience pages use real URLs (`/skills/seo`, `/experience/seo-specialist`, ...).
`vercel.json` rewrites every path to `index.html` so those URLs also work when opened directly;
other hosts need the same "single-page app" fallback.

## Run locally

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # production build in /dist
npm run preview  # preview the production build
```

## Where to edit things

| What | File |
| --- | --- |
| Name, title, summary, email, WhatsApp, location | `src/data/portfolio.js` -> `personalInfo` |
| Skills and their pages (`/skills/...`) | `src/data/portfolio.js` -> `skillPages` |
| Experience cards and their pages (`/experience/...`) | `src/data/portfolio.js` -> `experience` |
| Projects (add / edit) | `src/data/portfolio.js` -> `projects` |
| Education | `src/data/portfolio.js` -> `education` |
| GitHub / LinkedIn | `src/data/portfolio.js` -> `socialLinks` |
| Your CV | `public/Muhammad_Fahad_Khan_CV.pdf` (and `cvUrl` in `personalInfo`) |
| "Ask Fahad AI" keywords and answers | `src/lib/assistant.js` (answers are read from `portfolio.js`) |
| Page title, description, Open Graph tags | `index.html` |
| Colors and fonts | `src/index.css` -> `@theme` |

Empty fields (`""` or `[]`) are hidden on the site automatically.

## Deploy to Vercel

1. Push this folder to a GitHub repository.
2. Go to vercel.com -> **Add New -> Project** -> import the repository.
3. Vercel detects Vite automatically (Build: `npm run build`, Output: `dist`). Click **Deploy**.
4. After deploying, add your live URL to the commented `og:url` / `canonical` tags in `index.html`.
