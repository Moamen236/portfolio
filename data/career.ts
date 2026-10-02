// Layers drive the scope bar on each timeline entry.
export const layers = ["Frontend", "Backend", "Infrastructure", "Ownership"] as const;
export type Layer = (typeof layers)[number];

export const journey: {
  period: string;
  phase: string;
  role: string;
  company: string;
  detail: string;
  scope: Layer[];
  /** `branch`: ran in parallel with the main line (part-time). */
  lane?: "branch";
  current?: boolean;
}[] = [
  {
    period: "2020 – 2021",
    phase: "Frontend development",
    role: "Frontend Developer",
    company: "Orevan",
    detail: "Landing pages, email templates, admin dashboards and responsive interfaces.",
    scope: ["Frontend"],
  },
  {
    period: "2022 – 2024",
    phase: "Full-stack product work",
    role: "Full Stack Developer",
    company: "Nori Solutions / CodeStan",
    detail: "Multi-client ecommerce, LMS, ERP and internal business tools.",
    scope: ["Frontend", "Backend"],
  },
  {
    period: "2023 – 2024",
    phase: "Payments & marketplace",
    role: "Mid-level Full Stack Developer, part-time",
    company: "Daldart",
    lane: "branch",
    detail: "PSP and payment-related systems, and the Fixawy marketplace platform.",
    scope: ["Frontend", "Backend"],
  },
  {
    period: "2024 – 2025",
    phase: "Corporate engineering",
    role: "Corporate Full Stack Engineer",
    company: "Orevan",
    detail: "APIs, dashboards and enterprise systems — plus architecture and production support.",
    scope: ["Frontend", "Backend", "Infrastructure"],
  },
  {
    period: "2025 – now",
    phase: "Technical ownership",
    role: "Senior Full Stack Developer",
    company: "Orevan",
    detail: "Features owned from requirement to deployment. Jira delivery, pull request review, servers and production stability.",
    scope: ["Frontend", "Backend", "Infrastructure", "Ownership"],
    current: true,
  },
];

export const stack = [
  {
    group: "Backend",
    items: ["PHP", "Laravel", "REST APIs", "MySQL / MariaDB", "Redis", "Queues", "Webhooks", "Auth & RBAC", "Multi-tenancy"],
  },
  {
    group: "Frontend",
    items: ["JavaScript", "React", "Next.js", "HTML & CSS", "Tailwind CSS", "Bootstrap", "GSAP"],
  },
  {
    group: "Infrastructure",
    items: ["Linux", "Docker & Compose", "Nginx", "Apache", "Cloudflare", "Google Cloud", "VPS", "SSL / Certbot", "Bash", "GitHub Actions"],
  },
  {
    group: "Practice",
    items: ["Git & GitHub", "Jira", "Code review", "SOLID", "Design patterns", "API architecture", "OWASP", "Performance tuning"],
  },
];
