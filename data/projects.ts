export type DiagramNode = { id: string; label: string; x: number; y: number; note?: string };
export type Diagram = {
  nodes: DiagramNode[];
  edges: [string, string][];
  frame?: { label: string; x: number; y: number; w: number; h: number };
};

export type Project = {
  slug: string;
  name: string;
  summary: string;
  role: string;
  context: string;
  tags: string[];
  problem?: string;
  challenges?: string[];
  contribution: string[];
  diagram?: Diagram;
  link?: string;
};

// Diagram coordinates live in a 520 × 260 viewBox; x/y are node centres.
export const projects: Project[] = [
  {
    slug: "idraak",
    name: "IDRAAK PSP",
    summary: "Software platform for Alzheimer's disease screening and assessment workflows.",
    role: "API architecture, integrations & infrastructure",
    context: "Healthcare platform",
    tags: ["Laravel", "REST API", "MySQL", "Webhooks", "Cloud"],
    problem:
      "Hospitals, healthcare professionals, patients and caregivers each need their own view of one assessment journey — while a doctor-facing mobile app and external laboratories feed data into it.",
    challenges: [
      "Multi-step MRI, blood and PET workflows with strict role-based access at every step.",
      "Reliable inbound webhooks from Neurocode and external laboratories.",
      "Keeping queries fast as assessment and patient data grows.",
    ],
    contribution: [
      "Designed the REST API consumed by the doctor mobile app.",
      "Built role-based access for hospitals, HCPs, patients and caregivers.",
      "Implemented assessment workflows and hospital / HCP management.",
      "Integrated external laboratories and Neurocode webhooks.",
      "Optimized database queries and indexing.",
      "Owned production infrastructure, deployment and security hardening.",
    ],
    diagram: {
      nodes: [
        { id: "app", label: "Doctor app", x: 66, y: 70, note: "Mobile client on the REST API" },
        { id: "portal", label: "HCP portal", x: 66, y: 190, note: "Blade portal for hospitals and HCPs" },
        { id: "api", label: "REST API", x: 196, y: 130, note: "Laravel · role-based access" },
        { id: "flows", label: "Assessments", x: 326, y: 70, note: "MRI, blood and PET workflows" },
        { id: "db", label: "MySQL", x: 326, y: 190, note: "Optimized schema and queries" },
        { id: "labs", label: "Labs", x: 456, y: 70, note: "External laboratory integration" },
        { id: "neuro", label: "Neurocode", x: 456, y: 190, note: "Inbound webhooks" },
      ],
      edges: [
        ["app", "api"],
        ["portal", "api"],
        ["api", "flows"],
        ["api", "db"],
        ["labs", "flows"],
        ["neuro", "db"],
      ],
    },
  },
  {
    slug: "orvi-events",
    name: "Orvi Events",
    summary: "Interactive event platform — registration, QR check-in, live sessions and real-time polls.",
    role: "Backend, frontend & deployment",
    context: "Event platform",
    tags: ["Laravel", "Next.js", "Socket.IO", "HLS"],
    problem:
      "Events spread across branches, speakers and live sessions need one system for registration, on-site check-in and real-time audience interaction.",
    challenges: [
      "Real-time polls and interactive sessions over WebSockets during live events.",
      "Streaming with HLS alongside virtual meeting integration.",
      "Image-heavy event pages that loaded slowly on attendee devices.",
    ],
    contribution: [
      "Built Laravel APIs for registration, attendees, speakers and branches.",
      "Implemented React / Next.js attendee interfaces with QR-based flows.",
      "Delivered real-time polls and sessions with Node.js and Socket.IO.",
      "Optimized image and event loading.",
      "Handled deployment, reporting and production improvements.",
    ],
    diagram: {
      nodes: [
        { id: "web", label: "Next.js app", x: 66, y: 130, note: "Attendee interface with GSAP motion" },
        { id: "api", label: "Laravel API", x: 196, y: 70, note: "Registration, speakers, branches" },
        { id: "ws", label: "Socket.IO", x: 196, y: 190, note: "Node.js real-time layer" },
        { id: "qr", label: "QR check-in", x: 326, y: 30, note: "QR-based attendee experience" },
        { id: "reports", label: "Reports", x: 326, y: 100, note: "Attendance and event reporting" },
        { id: "polls", label: "Live polls", x: 326, y: 165, note: "Votes pushed over WebSockets" },
        { id: "sessions", label: "Sessions", x: 326, y: 230, note: "Interactive presentations" },
        { id: "db", label: "MySQL", x: 456, y: 65, note: "Events, attendees, results" },
        { id: "hls", label: "HLS / meet", x: 456, y: 230, note: "Streams and virtual meetings" },
      ],
      edges: [
        ["web", "api"],
        ["web", "ws"],
        ["api", "qr"],
        ["api", "reports"],
        ["api", "db"],
        ["ws", "polls"],
        ["ws", "sessions"],
        ["sessions", "hls"],
      ],
    },
  },
  {
    slug: "orvi-billing",
    name: "Orvi Billing",
    summary: "Multi-tenant SaaS billing platform with isolated tenants and granular permissions.",
    role: "Architecture & full-stack implementation",
    context: "SaaS product",
    tags: ["Laravel 12", "Next.js", "Redis", "Docker"],
    problem:
      "Many organizations share one billing product. Each must see only its own data, with roles and permissions defined per tenant.",
    challenges: [
      "Tenant isolation across the database, cache and queued jobs.",
      "Role and permission management scoped to each tenant.",
      "Billing work that must run reliably outside the request cycle.",
    ],
    contribution: [
      "Designed the multi-tenant architecture and tenant isolation.",
      "Built authentication, RBAC and the API for the Next.js front end.",
      "Implemented billing workflows on queues.",
      "Added Redis caching and a Dockerized environment.",
    ],
    diagram: {
      nodes: [
        { id: "a", label: "Tenant A", x: 66, y: 60 },
        { id: "b", label: "Tenant B", x: 66, y: 130 },
        { id: "c", label: "Tenant C", x: 66, y: 200 },
        { id: "web", label: "Next.js", x: 196, y: 130, note: "Tenant-aware front end" },
        { id: "api", label: "Laravel 12", x: 326, y: 130, note: "Tenant scope · auth · RBAC" },
        { id: "db", label: "MySQL", x: 456, y: 60, note: "Tenant-isolated data" },
        { id: "cache", label: "Redis", x: 456, y: 130, note: "Cache keys namespaced per tenant" },
        { id: "jobs", label: "Queues", x: 456, y: 200, note: "Billing workflows run async" },
      ],
      edges: [
        ["a", "web"],
        ["b", "web"],
        ["c", "web"],
        ["web", "api"],
        ["api", "db"],
        ["api", "cache"],
        ["api", "jobs"],
      ],
      frame: { label: "Docker", x: 262, y: 22, w: 252, h: 216 },
    },
  },
  {
    slug: "orvi-ai",
    name: "Orvi AI",
    summary: "Retrieval-augmented assistant that answers questions from existing business data.",
    role: "Backend APIs & data processing",
    context: "Internal product",
    tags: ["RAG", "Backend APIs", "Data processing"],
    problem: "Information spread across existing business systems was slow to find and hard to query.",
    challenges: [
      "Preparing and chunking source data so retrieval returns useful context.",
      "Grounding answers in retrieved content rather than model guesses.",
      "Connecting to systems that were never designed for it.",
    ],
    contribution: [
      "Built the backend APIs and data-processing pipeline.",
      "Implemented the retrieval flow: ingest, index, retrieve, generate.",
      "Integrated the assistant with existing business systems.",
    ],
    diagram: {
      nodes: [
        { id: "src", label: "Sources", x: 66, y: 70, note: "Existing business systems" },
        { id: "proc", label: "Processing", x: 196, y: 70, note: "Clean, chunk, enrich" },
        { id: "index", label: "Index", x: 326, y: 70, note: "Searchable embeddings" },
        { id: "client", label: "Business app", x: 66, y: 190 },
        { id: "api", label: "Backend API", x: 196, y: 190, note: "Request handling and auth" },
        { id: "ret", label: "Retrieval", x: 326, y: 190, note: "Relevant context for the query" },
        { id: "llm", label: "Model", x: 456, y: 190, note: "Answer generated from context" },
      ],
      edges: [
        ["src", "proc"],
        ["proc", "index"],
        ["client", "api"],
        ["api", "ret"],
        ["index", "ret"],
        ["ret", "llm"],
      ],
    },
  },
  {
    slug: "commerce-lms-erp",
    name: "Commerce, LMS & ERP",
    summary: "Ecommerce platforms for multiple clients, learning management and ERP systems.",
    role: "Full-stack implementation & maintenance",
    context: "Nori Solutions / CodeStan",
    tags: ["Ecommerce", "LMS", "ERP"],
    contribution: [
      "Built and maintained ecommerce platforms serving multiple clients.",
      "Worked on learning management and ERP systems.",
      "Delivered business applications and internal tools end to end.",
    ],
  },
  {
    slug: "fixawy-payments",
    name: "Fixawy & payments",
    summary: "Service marketplace with a mobile platform, plus payment-related systems.",
    role: "Full-stack development (part-time)",
    context: "Daldart",
    tags: ["Marketplace", "Mobile API", "Payments"],
    contribution: [
      "Shipped production features for the Fixawy marketplace and mobile platform.",
      "Worked on PSP and payment-related systems.",
    ],
  },
];

export const experiences = {
  intro: "Client-facing interactive work where motion, performance and delivery dates all matter.",
  items: [
    { name: "Orvi Interactive", kind: "Interactive experiences" },
    { name: "GHP Shop", kind: "Online store" },
    { name: "Interactive Cases", kind: "Interactive presentations" },
    { name: "Cosyntx Counter", kind: "Live counter" },
    { name: "Event experiences", kind: "Digital events" },
    { name: "Campaigns", kind: "Interactive campaigns" },
  ],
  focus: ["Interactive UI", "Animation", "Performance", "Responsive layouts", "API integration"],
};
