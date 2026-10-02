export const profile = {
  name: "Moamen Ali",
  role: "Senior Full Stack Developer",
  statement:
    "I build scalable web applications, enterprise platforms, APIs, and digital products — from architecture to production.",
  seoDescription:
    "Senior Full Stack Developer building scalable web applications, enterprise platforms, APIs, SaaS products, and production systems.",
  // Portrait in /public. Leave src empty to show the MA plate instead.
  // Best: a transparent-background PNG/WebP cutout, about 1000 × 1250.
  avatar: { src: "", alt: "Portrait of Moamen Ali" },
  // Leave a link empty to hide it everywhere on the site.
  links: {
    email: "moamen.ali107@gmail.com",
    linkedin: "",
    github: "",
  },
} as const;

export const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000").replace(/\/$/, "");

export const navItems = [
  { id: "about", label: "About" },
  { id: "work", label: "Work" },
  { id: "engineering", label: "Engineering" },
  { id: "experience", label: "Experience" },
  { id: "contact", label: "Contact" },
] as const;

export const socialLinks = [
  profile.links.email && { label: "Email", href: `mailto:${profile.links.email}` },
  profile.links.linkedin && { label: "LinkedIn", href: profile.links.linkedin },
  profile.links.github && { label: "GitHub", href: profile.links.github },
].filter(Boolean) as { label: string; href: string }[];
