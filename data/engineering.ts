export const ownership = [
  {
    title: "Architecture",
    body: "Maintainable application structure — APIs, services, repositories, authentication, permissions and integrations designed before they are built.",
  },
  {
    title: "Delivery",
    body: "Requirements broken into Jira tasks, pull requests reviewed, and features carried from development through to production.",
  },
  {
    title: "Infrastructure",
    body: "Linux servers, Docker, deployments, SSL, Cloudflare, backups and monitoring — and the troubleshooting when something breaks.",
  },
  {
    title: "Security & performance",
    body: "Secure defaults in code, production issues investigated to the root, and slow paths fixed with better queries, caching and queues.",
  },
];

export const pipeline = {
  // `word` lights up the matching word of the section heading when the step activates.
  deploy: [
    { label: "GitHub", note: "Pull request and code review", word: "Code" },
    { label: "CI/CD", note: "GitHub Actions build and checks" },
    { label: "Docker", note: "One image for every environment", word: "Container" },
    { label: "Linux server", note: "VPS or Google Cloud", word: "Server" },
  ],
  // Cloudflare sits in front; the rest runs on the server.
  edge: { label: "Cloudflare", note: "DNS, TLS, caching, protection" },
  server: {
    label: "On the server, via Docker Compose",
    nodes: [
      { label: "Nginx / Apache", note: "Reverse proxy and SSL" },
      { label: "Laravel / Node.js", note: "Application and workers" },
      { label: "MySQL / Redis", note: "Data, cache and queues", word: "Production" },
    ],
  },
  operations: ["Backups", "Monitoring", "SSL renewal", "Bash automation", "Incident troubleshooting"],
};

export const security = [
  { area: "Application", items: ["Input validation", "SQL injection prevention", "XSS", "CSRF", "SSRF awareness", "Secure file uploads"] },
  { area: "Access", items: ["Authentication", "Authorization", "Access control", "API security"] },
  { area: "Servers", items: ["Server hardening", "Secrets management", "TLS everywhere"] },
];
