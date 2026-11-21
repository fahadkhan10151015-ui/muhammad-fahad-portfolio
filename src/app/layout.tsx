import type { Metadata, Viewport } from "next";
import "@fontsource-variable/manrope/wght.css";
import "./globals.css";
import { SITE_URL, GITHUB_URL, LINKEDIN_URL, personal } from "@/data/portfolio";

const title = "Muhammad Fahad Khan | Full-Stack Developer & SEO Specialist";
const description =
  "Full-stack developer and SEO specialist with 5+ years of experience — 20+ websites built, 25+ SEO clients, custom desktop software. Get a free SEO audit.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title,
  description,
  authors: [{ name: personal.fullName, url: SITE_URL }],
  alternates: { canonical: "/" },
  icons: { icon: "/favicon.svg", apple: "/apple-touch-icon.png" },
  openGraph: {
    type: "website",
    url: SITE_URL,
    title,
    description,
    siteName: personal.fullName,
    images: [{ url: "/og.png", width: 1200, height: 630, alt: personal.fullName }],
  },
  twitter: { card: "summary_large_image", title, description, images: ["/og.png"] },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: "#060608",
  colorScheme: "dark",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: personal.fullName,
  jobTitle: personal.title,
  email: `mailto:${personal.email}`,
  telephone: personal.phone.tel,
  url: SITE_URL,
  sameAs: [LINKEDIN_URL, GITHUB_URL],
  knowsAbout: ["Next.js", "React", "TypeScript", "Python", "C#", "Firebase", "Technical SEO", "E-commerce SEO"],
  makesOffer: { "@type": "Offer", name: "Free SEO audit" },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preload" as="font" href="/fonts/sora-latin.woff2" type="font/woff2" crossOrigin="anonymous" media="(min-width: 1024px)" />
        <link rel="preload" as="image" href="/logo.svg" type="image/svg+xml" />
        <link rel="preload" as="image" href="/fallback/hero-mobile.webp" type="image/webp" media="(max-width: 1023px)" fetchPriority="high" />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      </head>
      <body className="is-loading">{children}</body>
    </html>
  );
}
