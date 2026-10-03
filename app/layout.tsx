import type { Metadata, Viewport } from "next";
import { Schibsted_Grotesk, JetBrains_Mono } from "next/font/google";
import { profile, siteUrl, socialLinks } from "@/data/profile";
import { Intro } from "@/components/identity/Intro";
import { Cursor } from "@/components/animations/Cursor";
import "./globals.css";

const sans = Schibsted_Grotesk({ subsets: ["latin"], variable: "--font-schibsted", display: "swap" });
const mono = JetBrains_Mono({ subsets: ["latin"], variable: "--font-jetbrains", display: "swap", weight: ["400"] });

// Runs before paint: enables JS-only styles, skips the loader for reduced motion,
// and applies the saved theme (or the system one) so there is no flash.
const INIT_SCRIPT = `(function(){var d=document.documentElement,c=d.classList;c.add("js");var t;try{t=localStorage.getItem("theme")}catch(e){}d.dataset.theme=t||(matchMedia("(prefers-color-scheme: dark)").matches?"dark":"light");if(matchMedia("(prefers-reduced-motion: reduce)").matches)c.add("no-intro")})()`;

const title = `${profile.name} — ${profile.role}`;

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title,
  description: profile.seoDescription,
  applicationName: profile.name,
  authors: [{ name: profile.name }],
  alternates: { canonical: "/" },
  openGraph: {
    type: "profile",
    url: "/",
    siteName: profile.name,
    title,
    description: profile.seoDescription,
    locale: "en_US",
  },
  twitter: { card: "summary_large_image", title, description: profile.seoDescription },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f2f3f5" },
    { media: "(prefers-color-scheme: dark)", color: "#0e1117" },
  ],
};

const personLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: profile.name,
  jobTitle: profile.role,
  url: siteUrl,
  email: `mailto:${profile.links.email}`,
  worksFor: { "@type": "Organization", name: "Orevan" },
  sameAs: socialLinks.filter((l) => l.href.startsWith("http")).map((l) => l.href),
  knowsAbout: ["Laravel", "PHP", "React", "Next.js", "REST APIs", "MySQL", "Redis", "Docker", "Linux", "CI/CD"],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${sans.variable} ${mono.variable}`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: INIT_SCRIPT }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(personLd) }} />
      </head>
      <body>
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-[60] focus:rounded focus:bg-ink focus:px-4 focus:py-2 focus:text-paper"
        >
          Skip to content
        </a>
        <Intro />
        {children}
        <Cursor />
      </body>
    </html>
  );
}
