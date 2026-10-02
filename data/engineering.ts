export const ownership: { title: string; body: string; icon: "layers" | "branch" | "server" | "shield" }[] = [
  {
    title: "Architecture",
    icon: "layers",
    body: "Maintainable application structure — APIs, services, repositories, authentication, permissions and integrations designed before they are built.",
  },
  {
    title: "Delivery",
    icon: "branch",
    body: "Requirements broken into Jira tasks, pull requests reviewed, and features carried from development through to production.",
  },
  {
    title: "Infrastructure",
    icon: "server",
    body: "Linux servers, Docker, deployments, SSL, Cloudflare, backups and monitoring — and the troubleshooting when something breaks.",
  },
  {
    title: "Security & performance",
    icon: "shield",
    body: "Secure defaults in code, production issues investigated to the root, and slow paths fixed with better queries, caching and queues.",
  },
];

export type FlowStep = { label: string; note?: string; word?: string };

// The signature flow: what happens to code after it is written.
// `word` lights the matching word in the Engineering heading.
export const shipFlow: FlowStep[] = [
  { label: "Code", note: "Laravel, React, Next.js", word: "Code" },
  { label: "Git", note: "Branches, pull requests, review" },
  { label: "CI/CD", note: "GitHub Actions builds and checks" },
  { label: "Docker", note: "One image for every environment", word: "Container" },
  { label: "Server", note: "Linux, Nginx / Apache, SSL", word: "Server" },
  { label: "Database", note: "Migrations, MySQL / Redis, backups" },
  { label: "Production", note: "Cloudflare, monitoring, troubleshooting", word: "Production" },
];

// And the path a request takes back through the running stack.
export const requestFlow: FlowStep[] = [
  { label: "Cloudflare" },
  { label: "Nginx / Apache" },
  { label: "Laravel / Node.js" },
  { label: "MySQL / Redis" },
];

export const security = [
  { area: "Application", items: ["Input validation", "SQL injection prevention", "XSS", "CSRF", "SSRF awareness", "Secure file uploads"] },
  { area: "Access", items: ["Authentication", "Authorization", "Access control", "API security"] },
  { area: "Servers", items: ["Server hardening", "Secrets management", "TLS everywhere"] },
];
