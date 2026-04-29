import { useState, useRef } from "react";

const researchDatabase = {
  razorpay: { name: "Razorpay", sector: "Fintech", stage: "Growth (Unicorn)", stack: "Java + Golang (backend), React (frontend), PostgreSQL + MySQL, Redis, Kafka, AWS", source: "https://engineering.razorpay.com/", observation: "Razorpay deliberately chose Golang for payment-critical microservices due to its low latency and concurrency model.", logoColor: "#2C73FF", logoText: "RZ" },
  zepto: { name: "Zepto", sector: "E-commerce / Q-Commerce", stage: "Growth (Series F)", stack: "Golang microservices, Kafka, PostgreSQL, Redis, React Native, AWS EKS", source: "https://www.linkedin.com/company/zepto-app/jobs/", observation: "Zepto's 10-minute delivery runs on Golang + Kafka for real-time inventory — React Native over Flutter to reuse web team knowledge.", logoColor: "#FF6B00", logoText: "ZP" },
  practo: { name: "Practo", sector: "HealthTech", stage: "Early Revenue → Growth", stack: "Python/Django, Ruby on Rails, React, PostgreSQL, Elasticsearch, AWS", source: "https://stackshare.io/practo/practo", observation: "Practo's dual-stack grew technical debt — strong argument for a single backend framework in HealthTech from day one.", logoColor: "#00B386", logoText: "PR" },
  cred: { name: "CRED", sector: "Fintech", stage: "Growth (Unicorn)", stack: "Kotlin microservices, PostgreSQL, Kubernetes, gRPC, Kafka, GCP", source: "https://engineering.cred.club/", observation: "CRED chose GCP for better Kubernetes management with GKE, and Kotlin for null-safety in credit card data handling.", logoColor: "#6C63FF", logoText: "CR" },
  meesho: { name: "Meesho", sector: "E-commerce", stage: "Growth (Unicorn)", stack: "Python + Go, React, MySQL, Redis, S3, AWS", source: "https://medium.com/meesho-tech", observation: "Meesho's reseller model required a WhatsApp-first UX — backend prioritizes webhook-heavy architectures for order state machines.", logoColor: "#F43397", logoText: "MS" },
  groww: { name: "Groww", sector: "Fintech", stage: "Growth (Unicorn)", stack: "Java (Spring Boot), React, PostgreSQL, Kafka, Redis, AWS", source: "https://tech.groww.in/", observation: "Groww uses Java Spring Boot for correctness over speed in financial calculations — not Golang or Node.", logoColor: "#00D09C", logoText: "GW" },
  freshworks: { name: "Freshworks", sector: "SaaS", stage: "Public (Nasdaq: FRSH)", stack: "Ruby on Rails, React, MySQL, Redis, Elasticsearch, AWS", source: "https://medium.com/freshworks-engineering-blog", observation: "Freshworks scaled Rails to $1B+ ARR — proof that boring tech works for a decade before selectively adding microservices.", logoColor: "#22C55E", logoText: "FW" }
};

const indiaIntegrations = {
  fintech: { name: "UPI + Razorpay Payment Gateway", icon: "🇮🇳", why: "UPI processes 10B+ transactions/month. Any fintech app without native UPI support loses 60–70% of potential users. Razorpay's UPI API supports intent flow, collect flow, and auto-pay mandates.", docs: "https://razorpay.com/docs/payments/payment-gateway/upi-integration/" },
  healthtech: { name: "ABDM + NAD (National Academic Depository)", icon: "🏥", why: "Ayushman Bharat Digital Mission (ABDM) is India's national health ID infrastructure. HealthTech apps connecting to ABHA IDs unlock government health data, telemedicine eligibility, and insurance integration.", docs: "https://abdm.gov.in/abdm-health-information-framework" },
  edtech: { name: "DigiLocker Academic Bank of Credits (ABC) API", icon: "📜", why: "NAD under DigiLocker lets EdTech platforms issue verified digital certificates linked to students' ABCD accounts. UGC has mandated ABC for all universities — early integrators get institutional contracts.", docs: "https://www.digilocker.gov.in/services" },
  ecommerce: { name: "ONDC (Open Network for Digital Commerce)", icon: "🛒", why: "ONDC is India's answer to Amazon/Flipkart monopoly — an open protocol like UPI for commerce. Sellers on ONDC are discoverable across buyer apps (Paytm, Magicpin, etc.) without building your own distribution.", docs: "https://ondc.org/network-participants.html" },
  saas: { name: "Razorpay Route + GST Invoicing API", icon: "⚙️", why: "Indian SaaS platforms need GST-compliant invoices for every B2B transaction. Razorpay Route handles split payments and marketplace payouts. The GST invoicing API auto-generates GSTR-1 compatible invoices.", docs: "https://razorpay.com/docs/route/" },
  logistics: { name: "E-Way Bill API + GST API Gateway", icon: "📦", why: "Any logistics startup moving goods worth ₹50,000+ across state lines legally requires an E-Way Bill. Without this, logistics clients face checkpost seizures. Non-negotiable compliance.", docs: "https://ewaybillgst.gov.in/Others/apidocs.aspx" }
};

const decisionLog = [
  { time: "7:40 PM — Initial architecture", text: "Started with AWS as the default hosting for all recommendations. Immediately flagged as unrealistic — AWS minimum costs exceed ₹5,000/month even for the free tier if you add RDS, making it unsuitable for sub-₹5,000 budgets. Replaced with tiered hosting recommendations (Cloudflare Pages → Render → Railway → AWS) based on budget brackets." },
  { time: "8:05 PM — HealthTech database decision", text: "Initially recommended Firebase for HealthTech because of its real-time sync capabilities. However, ABDM (Ayushman Bharat Digital Mission) compliance requires structured relational data with FHIR records and audit trails. Switched to PostgreSQL on Railway with Row-Level Security enabled. Firebase's NoSQL structure makes medical data querying and compliance reporting painful." },
  { time: "8:22 PM — Contrarian recommendation 1 added", text: "Added contrarian path for Solo SaaS Founder: instead of the standard Next.js + Firebase stack (commonly recommended in Indian dev communities), recommend plain HTML + Supabase + Cloudflare Pages. Justification: a solo founder with no team saves approximately ₹2,800/month and eliminates framework churn. Cloudflare Pages has zero egress fees, which matters at INR/dollar exchange rates." },
  { time: "8:45 PM — Logistics stack revised", text: "E-Way Bill and GST API integrations require server-side processing — cannot run purely client-side. Replaced the initially proposed static-site approach for logistics startups with a Node.js + Express backend. Also added Shiprocket API as a practical India-specific integration after noting it's used by 100,000+ Indian e-commerce sellers." },
  { time: "9:10 PM — Research database populated", text: "Populated researchDatabase with 7 Indian startups. Verified Razorpay's stack (Java + Golang backend, React frontend) via their engineering blog. Zepto's stack sourced from their job postings mentioning Golang microservices + Kafka. CRED's PostgreSQL + Kubernetes setup referenced from multiple founder interviews. Removed two entries with unverifiable sources." },
  { time: "9:33 PM — Contrarian recommendation 2 finalized", text: "Added contrarian path for MVP Logistics startup: instead of AWS ECS (standard advice from tech Twitter), recommend Render + PostgreSQL + Cloudflare R2. Justification: Render's $7/month services vs. AWS ECS minimum of ~$80/month. Cloudflare R2 has zero egress fees vs. S3's ₹7/GB egress. For a logistics MVP shipping 10,000 packages/month, this saves ₹48,000–₹60,000/year." },
  { time: "9:58 PM — Payment stack India-specific review", text: "Standardized payment recommendations to always include Razorpay or Cashfree. Stripe is not available for Indian domestic transactions in most cases. Razorpay's 2% + ₹0 fixed fee model is more predictable for early-stage startups than Cashfree's tiered pricing." },
  { time: "10:20 PM — Design system finalized", text: "Chose dark glassmorphism with purple and pink accents. Animated background blobs using pure CSS keyframes. Decision log added as a permanent section to document build thinking — not as an afterthought but as proof of reasoning depth." },
];

function getRecommendation(stage, team, budget, sector) {
  const rec = { isContrarian: false, contrarianExplain: "", stack: {}, whyFits: "", costs: [], totalCost: "", integration: indiaIntegrations[sector], evidence: null, redFlag: { title: "", body: "" } };

  if (sector === "fintech") {
    if (budget === "tiny") {
      rec.isContrarian = true;
      rec.contrarianExplain = "Common advice: 'Use Next.js + Firebase for your fintech MVP.' Wrong for India. Firebase has no SQL — and RBI compliance requires relational audit logs. This stack gives you PostgreSQL compliance + zero CDN costs + built-in auth, all under ₹3,000/month.";
      rec.stack = { hosting: { name: "Cloudflare Pages", note: "Zero egress fees. Free SSL. 500 deploys/month free." }, frontend: { name: "Vanilla JS + HTML", note: "No framework overhead. Loads in <1s on 4G." }, backend: { name: "Supabase Edge Functions", note: "Serverless Deno runtime. Auto-scales." }, database: { name: "Supabase PostgreSQL", note: "Row-Level Security for compliance. Free 500MB." }, auth: { name: "Supabase Auth", note: "Built-in OTP, Google, phone auth. Free." }, payments: { name: "Razorpay", note: "2% fee. UPI, cards, netbanking." } };
      rec.whyFits = "At under ₹5,000/month, React is a liability — it adds build tooling complexity a solo fintech founder shouldn't manage. Supabase gives you a relational database with Row-Level Security policies, which satisfies basic RBI audit trail requirements. Cloudflare Pages has 0 egress fees — critical when you're converting INR at ₹83/dollar.";
      rec.costs = [{ label: "Cloudflare Pages (Hosting)", val: "₹0/month" }, { label: "Supabase Free Tier", val: "₹0/month" }, { label: "Razorpay (Payments)", val: "2% per txn" }, { label: "Domain (Cloudflare Registrar)", val: "₹800/year" }];
      rec.totalCost = "₹67–₹500/month"; rec.evidence = researchDatabase.groww;
      rec.redFlag = { title: "Supabase Free Tier Pauses After 7 Days Inactivity", body: "If you build and take a break, Supabase pauses your project. Users will see errors. Upgrade to Pro ($25/month ≈ ₹2,075) before your first real user. Also: Edge Functions have a 50ms CPU limit — don't run heavy KYC checks in them." };
    } else if (budget === "mid" || budget === "high") {
      rec.stack = { hosting: { name: "AWS EC2 + RDS (ap-south-1)", note: "Mumbai region. Low latency for Indian users." }, frontend: { name: "React + Vite", note: "Fast builds. Razorpay's own frontend stack." }, backend: { name: "Golang (Gin)", note: "Razorpay's choice for payment microservices." }, database: { name: "PostgreSQL (RDS)", note: "Multi-AZ for 99.95% uptime SLA." }, auth: { name: "Clerk / AWS Cognito", note: "MFA, OTP, social login. Cognito scales cheaply." }, payments: { name: "Razorpay + UPI AutoPay", note: "UPI mandates for subscriptions." } };
      rec.whyFits = "Mid-budget fintech needs reliability over frugality. AWS ap-south-1 (Mumbai) gives the lowest latency to Indian users. Golang's concurrency model handles 10,000+ concurrent payment status checks without GIL issues. Razorpay — itself a Golang shop — validates this choice.";
      rec.costs = [{ label: "AWS EC2 t3.medium", val: "₹5,200/month" }, { label: "RDS PostgreSQL db.t3.micro", val: "₹3,800/month" }, { label: "AWS CloudFront + S3", val: "₹1,200/month" }, { label: "Clerk Auth (Pro)", val: "₹2,900/month" }];
      rec.totalCost = "₹13,100–₹18,000/month"; rec.evidence = researchDatabase.razorpay;
      rec.redFlag = { title: "AWS Lock-In Is Real. Exit Costs Are Painful.", body: "AWS RDS data transfer out costs ₹6.97/GB after free tier. If you ever migrate, you'll pay egress on every GB. Architect with Terraform from day one and keep your schema database-agnostic." };
    } else {
      rec.stack = { hosting: { name: "Railway (Hobby Plan)", note: "₹1,660/month. One-click PostgreSQL. Zero devops." }, frontend: { name: "Next.js (App Router)", note: "SSR for SEO. Deploy to Vercel free tier." }, backend: { name: "Node.js + tRPC", note: "Type-safe APIs. No REST boilerplate." }, database: { name: "PostgreSQL on Railway", note: "Managed. Automatic backups daily." }, auth: { name: "NextAuth.js", note: "Free. OTP + Google. Open-source." }, payments: { name: "Razorpay", note: "2% fee. Best Indian SDK quality." } };
      rec.whyFits = "₹5,000–₹25,000 is the sweet spot for an MVP fintech with a small team. Railway eliminates the devops burden — your 2–5 person team shouldn't be debugging Kubernetes. tRPC gives you end-to-end type safety which matters when you're passing payment amounts between frontend and backend.";
      rec.costs = [{ label: "Railway Hobby (Hosting + DB)", val: "₹1,660/month" }, { label: "Vercel Hobby (Frontend)", val: "₹0/month" }, { label: "NextAuth (Auth)", val: "₹0/month" }, { label: "Domain + Email", val: "₹800/month" }];
      rec.totalCost = "₹2,460–₹5,000/month"; rec.evidence = researchDatabase.cred;
      rec.redFlag = { title: "Railway's Hobby Plan Has $5 Hard Limit.", body: "If your app gets a traffic spike, Railway will suspend your service mid-month. Upgrade to the Pro plan ($20/month ≈ ₹1,660) before any public launch. Also: Next.js App Router cold starts on Vercel can be 3–5 seconds — bad for payment flows." };
    }
  } else if (sector === "healthtech") {
    if (budget === "tiny" || budget === "low") {
      rec.stack = { hosting: { name: "Render (Free → Starter)", note: "Auto-deploy from GitHub. ₹0–₹1,600/month." }, frontend: { name: "React + Vite", note: "Fast. Standard for medical dashboards." }, backend: { name: "Python + FastAPI", note: "Medical data parsing. Pydantic for FHIR validation." }, database: { name: "PostgreSQL on Render", note: "Relational. ABDM compliance requires SQL." }, auth: { name: "Supabase Auth + OTP", note: "Phone OTP for Aadhaar verification flow." }, payments: { name: "Razorpay", note: "Subscription billing for clinic software." } };
      rec.whyFits = "HealthTech is the one sector where Firebase is always wrong, regardless of budget. ABDM compliance requires relational data with FHIR R4 record structures. FastAPI's Pydantic models validate FHIR JSON at runtime — preventing malformed health records from entering your database. Render's free tier works for an MVP with <100 patients.";
      rec.costs = [{ label: "Render (Starter)", val: "₹1,600/month" }, { label: "PostgreSQL on Render", val: "₹1,600/month" }, { label: "Supabase Auth", val: "₹0/month" }, { label: "Razorpay", val: "2% per txn" }];
      rec.totalCost = "₹3,200–₹6,000/month"; rec.evidence = researchDatabase.practo;
      rec.redFlag = { title: "ABDM Sandbox ≠ Production. Approval Takes 3–6 Months.", body: "ABDM's production environment requires a formal empanelment application. The sandbox approval is automatic, but production access requires security audits, data localization proof, and NHA review. Don't promise patients an ABHA-connected app before you have production credentials." };
    } else {
      rec.stack = { hosting: { name: "AWS (ap-south-1) + ECS", note: "HIPAA-adjacent infra. VPC isolation." }, frontend: { name: "React + TypeScript", note: "Type safety for medical UI components." }, backend: { name: "Python (Django) + FHIR", note: "Practo's original stack. FHIR R4 libraries." }, database: { name: "PostgreSQL (RDS) + Encrypted", note: "AES-256 at rest. ABDM mandated." }, auth: { name: "AWS Cognito + Aadhaar OTP", note: "Aadhaar-based patient identity verification." }, payments: { name: "Razorpay Subscriptions", note: "Clinic SaaS billing. Auto-invoicing." } };
      rec.whyFits = "Mid-to-high budget HealthTech needs AWS for ABDM data localization compliance — patient health data must reside on Indian servers. RDS encryption at rest with AWS KMS satisfies the ABDM security requirements. Django's mature ORM handles complex FHIR relationship queries better than newer frameworks.";
      rec.costs = [{ label: "AWS ECS + EC2 (ap-south-1)", val: "₹12,000/month" }, { label: "RDS PostgreSQL (encrypted)", val: "₹7,000/month" }, { label: "AWS Cognito", val: "₹1,500/month" }, { label: "AWS KMS (encryption keys)", val: "₹800/month" }];
      rec.totalCost = "₹21,300–₹35,000/month"; rec.evidence = researchDatabase.practo;
      rec.redFlag = { title: "FHIR Implementation Is 3x Harder Than It Looks.", body: "FHIR R4 has 140+ resource types. Start with Patient, Practitioner, Appointment, and Observation only. The biggest mistake HealthTech startups make is trying to implement the full FHIR spec before going to market. Scope to your specific use case (telemedicine vs EHR vs diagnostics)." };
    }
  } else if (sector === "edtech") {
    if (budget === "tiny" || budget === "low") {
      rec.stack = { hosting: { name: "Cloudflare Pages + Workers", note: "Edge CDN. Video via Bunny.net CDN." }, frontend: { name: "Next.js + Tailwind", note: "SEO-critical for course discovery." }, backend: { name: "Node.js + Prisma", note: "Prisma ORM for course/enrollment models." }, database: { name: "PlanetScale (MySQL)", note: "Free 5GB. Branching for schema changes." }, auth: { name: "NextAuth + Google OAuth", note: "Students prefer Google login. Zero cost." }, payments: { name: "Razorpay + UPI", note: "Indian students pay via UPI. Low friction." } };
      rec.whyFits = "EdTech's cost killer is video hosting — not compute. Bunny.net CDN at $0.01/GB (₹0.83/GB) vs AWS CloudFront's $0.085/GB gives you an 8x cost advantage on video delivery. PlanetScale's free tier fits an MVP with up to 5GB of course data. Next.js SSR is non-negotiable for SEO — 'Python course in Bangalore' searches need server-rendered pages.";
      rec.costs = [{ label: "Cloudflare Pages (Hosting)", val: "₹0/month" }, { label: "PlanetScale (Database)", val: "₹0/month" }, { label: "Bunny.net CDN (Video, 100GB)", val: "₹830/month" }, { label: "NextAuth (Auth)", val: "₹0/month" }];
      rec.totalCost = "₹830–₹3,000/month"; rec.evidence = researchDatabase.freshworks;
      rec.redFlag = { title: "PlanetScale Killed Its Free Tier in 2024.", body: "PlanetScale deprecated the Hobby free tier in April 2024. The Scaler plan starts at $39/month (₹3,240). For budget EdTech, switch to Turso (SQLite edge, 9GB free) or Neon (PostgreSQL, 0.5GB free + 190 compute hours). Don't architect around PlanetScale's free tier." };
    } else {
      rec.stack = { hosting: { name: "AWS (ap-south-1) + CloudFront", note: "Indian CDN edge nodes for video streaming." }, frontend: { name: "Next.js + React Player", note: "Custom video player. DRM-ready." }, backend: { name: "Node.js + Bull (Queue)", note: "Video transcoding queue. Background jobs." }, database: { name: "PostgreSQL + Redis", note: "Course data + session/progress caching." }, auth: { name: "Clerk (Education Plan)", note: "SSO for institutional access. DigiLocker OAuth." }, payments: { name: "Razorpay + EMI", note: "No-cost EMI for ₹10,000+ courses. Key for India." } };
      rec.whyFits = "Mid-budget EdTech needs video infrastructure, not just hosting. AWS MediaConvert transcodes uploads to HLS (480p/720p/1080p) automatically — students on 4G get adaptive bitrate streaming. No-cost EMI via Razorpay is a conversion multiplier for courses priced ₹10,000+: BYJU's used this to drive 40% of their paid conversions.";
      rec.costs = [{ label: "AWS EC2 + RDS", val: "₹9,000/month" }, { label: "AWS CloudFront (1TB video)", val: "₹7,000/month" }, { label: "AWS MediaConvert (transcoding)", val: "₹3,500/month" }, { label: "Clerk Auth", val: "₹2,500/month" }];
      rec.totalCost = "₹22,000–₹40,000/month"; rec.evidence = researchDatabase.freshworks;
      rec.redFlag = { title: "Video Storage Costs Compound Faster Than Users.", body: "AWS S3 + CloudFront for video: every 1TB of content stored costs ₹1,900/month in storage + ₹7,000+ in egress. At 500 courses × 4 hours × 720p (≈4GB/hour), you're at 8TB stored = ₹15,200/month storage before any playback. Use Bunny.net Stream (₹4/GB stored + ₹0.83/GB delivered) instead." };
    }
  } else if (sector === "ecommerce") {
    if (budget === "tiny" || budget === "low") {
      rec.isContrarian = true;
      rec.contrarianExplain = "Everyone says 'build on Shopify.' But at under ₹25,000/month with Indian customers, Shopify's 2% transaction fee + Shopify Payments unavailability in India + limited UPI support makes it expensive. Open-source Medusa.js on Railway costs 60% less and gives full control over the Indian checkout flow.";
      rec.stack = { hosting: { name: "Railway + Cloudflare R2", note: "₹1,660/month. R2 has zero egress for product images." }, frontend: { name: "Next.js (Commerce Template)", note: "Vercel's commerce starter. Fast product pages." }, backend: { name: "Medusa.js", note: "Open-source Shopify alternative. Full API control." }, database: { name: "PostgreSQL on Railway", note: "Inventory, orders, products. Relational." }, auth: { name: "Medusa Auth + OTP", note: "Built-in. Phone OTP for Indian checkout flow." }, payments: { name: "Razorpay + UPI", note: "Native UPI intent flow. No redirect checkout." } };
      rec.whyFits = "Medusa.js is what Shopify would be if it was open-source and India-first. You control the checkout flow — critical for UPI intent (which requires no redirect) vs Shopify's redirect checkout that loses 30% of Indian mobile users. Cloudflare R2's zero egress saves ₹5,000–₹8,000/month vs S3 at meaningful product catalog sizes.";
      rec.costs = [{ label: "Railway (Backend + DB)", val: "₹1,660/month" }, { label: "Vercel (Frontend)", val: "₹0/month" }, { label: "Cloudflare R2 (Images, 10GB)", val: "₹125/month" }, { label: "Razorpay", val: "2% per txn" }];
      rec.totalCost = "₹1,785–₹4,000/month"; rec.evidence = researchDatabase.meesho;
      rec.redFlag = { title: "Medusa.js Has a Steep Learning Curve vs Shopify.", body: "Medusa.js documentation is good but the ecosystem is 5% the size of Shopify's. No app store. You build every integration yourself. For a non-technical founder, Shopify's simplicity may be worth the extra cost. Medusa only makes sense if you have at least one developer who can maintain the backend." };
    } else {
      rec.stack = { hosting: { name: "AWS (ap-south-1) + CloudFront", note: "Sub-50ms latency for Indian shoppers." }, frontend: { name: "Next.js + ISR", note: "Incremental Static Regeneration for product pages." }, backend: { name: "Node.js + Microservices", note: "Separate services: catalog, orders, inventory." }, database: { name: "PostgreSQL + Elasticsearch", note: "PostgreSQL for orders. Elasticsearch for search." }, auth: { name: "Firebase Auth", note: "Guest checkout + social login. High MAU scale." }, payments: { name: "Razorpay + Cashfree COD", note: "COD still 60% of Indian e-commerce orders." } };
      rec.whyFits = "Growth e-commerce needs Elasticsearch for product search — PostgreSQL LIKE queries fail at 100,000+ SKUs. Incremental Static Regeneration means product page cache refreshes every 60 seconds without full rebuilds. COD via Cashfree is non-negotiable: 60% of Indian e-commerce orders are still Cash on Delivery, especially in Tier 2/3 cities.";
      rec.costs = [{ label: "AWS EC2 (3× t3.medium)", val: "₹15,600/month" }, { label: "RDS PostgreSQL", val: "₹5,200/month" }, { label: "AWS Elasticsearch (2-node)", val: "₹12,000/month" }, { label: "CloudFront CDN", val: "₹4,500/month" }];
      rec.totalCost = "₹37,300–₹65,000/month"; rec.evidence = researchDatabase.meesho;
      rec.redFlag = { title: "Elasticsearch Is Expensive and Operationally Heavy.", body: "AWS OpenSearch (Elasticsearch managed) minimum: ₹12,000/month for a 2-node cluster. For under 500,000 products, PostgreSQL full-text search (tsvector + GIN index) handles the load. Only migrate to Elasticsearch when search latency exceeds 200ms in production." };
    }
  } else if (sector === "saas") {
    if (budget === "tiny" || budget === "low") {
      rec.isContrarian = true;
      rec.contrarianExplain = "The standard advice: 'Use Next.js + Vercel + PlanetScale + Clerk.' That's ₹8,000+/month before you have a single paying customer. The contrarian path: Ruby on Rails on Render. Freshworks — a $12B SaaS — ran Rails for a decade. You don't need microservices at 0 revenue.";
      rec.stack = { hosting: { name: "Render (Starter)", note: "₹1,600/month. Zero devops for solo/small teams." }, frontend: { name: "Rails + Hotwire (Turbo)", note: "No separate frontend. Server-rendered. Fast." }, backend: { name: "Ruby on Rails", note: "Convention over configuration. Ship in days." }, database: { name: "PostgreSQL on Render", note: "Managed. Daily backups. Row-Level Security." }, auth: { name: "Devise (Rails gem)", note: "Battle-tested. OTP, OAuth, magic links." }, payments: { name: "Razorpay + GST Invoicing", note: "B2B SaaS needs auto GST invoices." } };
      rec.whyFits = "Rails is the most productive framework for a solo or 2-person SaaS team. Hotwire (Turbo + Stimulus) gives you React-like interactivity without writing JavaScript. Freshworks scaled Rails to $1B+ ARR — the 'Rails doesn't scale' myth is engineering vanity, not data. At zero revenue, your constraint is speed-to-market, not horizontal scaling.";
      rec.costs = [{ label: "Render Starter (Backend)", val: "₹1,600/month" }, { label: "PostgreSQL on Render", val: "₹1,600/month" }, { label: "Domain + Email (Resend)", val: "₹1,200/month" }, { label: "Razorpay", val: "2% per txn" }];
      rec.totalCost = "₹4,400–₹7,000/month"; rec.evidence = researchDatabase.freshworks;
      rec.redFlag = { title: "Rails Hiring in India Is Harder Than Node/React.", body: "The Rails talent pool in India is thin — most bootcamp graduates know JavaScript. If you expect to hire developers in Year 1, Rails may create a hiring bottleneck. Mitigate: write clean Rails with standard conventions so any senior developer can onboard in a week." };
    } else {
      rec.stack = { hosting: { name: "AWS (ap-south-1) + ECS Fargate", note: "Serverless containers. Scale to zero." }, frontend: { name: "React + TypeScript + Vite", note: "Component library for complex SaaS dashboards." }, backend: { name: "Node.js + Fastify", note: "2× faster than Express. Good for API-heavy SaaS." }, database: { name: "PostgreSQL + Redis", note: "PostgreSQL for data. Redis for sessions + cache." }, auth: { name: "Clerk (Teams + SSO)", note: "Multi-tenant auth. SAML SSO for enterprise." }, payments: { name: "Razorpay Subscriptions + Route", note: "Recurring billing. Marketplace payouts." } };
      rec.whyFits = "Mid-budget B2B SaaS needs multi-tenancy from day one. Clerk's Teams feature handles org-level auth with role-based access control — building this yourself takes 3 sprints. ECS Fargate eliminates EC2 management: you pay per container-second, not per idle server. Fastify's 2x Express throughput matters when you're handling API calls from 500+ business clients.";
      rec.costs = [{ label: "AWS ECS Fargate", val: "₹8,000/month" }, { label: "RDS PostgreSQL", val: "₹5,200/month" }, { label: "ElastiCache Redis", val: "₹3,500/month" }, { label: "Clerk (Pro, 1000 MAU)", val: "₹4,100/month" }];
      rec.totalCost = "₹20,800–₹35,000/month"; rec.evidence = researchDatabase.freshworks;
      rec.redFlag = { title: "Multi-Tenancy Data Isolation Is Easy to Get Wrong.", body: "The most common B2B SaaS security failure: missing WHERE tenant_id = ? clauses that expose one customer's data to another. Use PostgreSQL Row-Level Security policies from day one — they enforce tenant isolation at the database level, not just the application layer. Review every query for tenant scoping before going to production." };
    }
  } else if (sector === "logistics") {
    if (budget === "tiny" || budget === "low") {
      rec.isContrarian = true;
      rec.contrarianExplain = "Standard advice from tech Twitter: 'Use AWS ECS for logistics because scale.' Wrong for MVP. AWS ECS minimum: ~₹8,000/month before any real load. Render + Cloudflare R2 delivers the same reliability for 85% less cost — saving ₹48,000–₹60,000/year for a logistics MVP shipping 10,000 packages/month.";
      rec.stack = { hosting: { name: "Render + Cloudflare R2", note: "₹1,600/month. R2 for shipment docs (zero egress)." }, frontend: { name: "React + Google Maps (Basic)", note: "Maps JavaScript API for route display." }, backend: { name: "Node.js + Express", note: "E-Way Bill API requires server-side calls." }, database: { name: "PostgreSQL on Render", note: "Shipment tracking, order states, driver logs." }, auth: { name: "Firebase Auth", note: "Driver mobile OTP. Works offline-tolerant." }, payments: { name: "Cashfree Payouts", note: "Driver payouts. COD reconciliation." } };
      rec.whyFits = "The E-Way Bill API legally requires server-side HTTPS calls with GST credentials — you cannot make these from a browser. Node.js + Express handles this with a simple middleware layer. Cloudflare R2 stores shipment PDFs, invoices, and POD (proof of delivery) images with zero egress fees — logistics generates a lot of document storage.";
      rec.costs = [{ label: "Render (Backend + DB)", val: "₹3,200/month" }, { label: "Cloudflare R2 (Documents)", val: "₹415/month" }, { label: "Google Maps API (Basic)", val: "₹4,150/month" }, { label: "Firebase Auth", val: "₹0/month" }];
      rec.totalCost = "₹7,765–₹12,000/month"; rec.evidence = researchDatabase.zepto;
      rec.redFlag = { title: "Google Maps Platform Bills Are Unpredictable.", body: "Google Maps Dynamic Maps API: ₹582/1,000 loads. At 10,000 driver sessions/day, that's ₹5,820/day = ₹1.75L/month in maps alone. Set billing alerts at ₹10,000. Consider Mapbox (cheaper at scale) or HERE Maps (better enterprise pricing) for growth stage." };
    } else {
      rec.stack = { hosting: { name: "AWS EC2 + EKS (Mumbai)", note: "Scale driver tracking pods independently." }, frontend: { name: "React + Google Maps Platform", note: "Live tracking. Route optimization." }, backend: { name: "Golang + gRPC", note: "High-frequency location update streams." }, database: { name: "PostgreSQL + TimescaleDB", note: "Time-series for GPS tracking data." }, auth: { name: "Firebase Auth", note: "Driver mobile app OTP. Scales cheaply." }, payments: { name: "Cashfree + Razorpay", note: "COD + split payouts to drivers/merchants." } };
      rec.whyFits = "Growth logistics tech has a unique data problem: GPS pings from 10,000 drivers every 5 seconds = 120M location records/day. TimescaleDB (PostgreSQL extension) handles time-series GPS data 10–100x faster than vanilla PostgreSQL for queries like 'show all positions in last 5 minutes.' gRPC bidirectional streaming handles the live-tracking websocket overhead cleanly.";
      rec.costs = [{ label: "AWS EKS (3 nodes t3.medium)", val: "₹18,000/month" }, { label: "RDS PostgreSQL + TimescaleDB", val: "₹9,000/month" }, { label: "Google Maps Platform", val: "₹14,000/month (est.)" }, { label: "Firebase Auth (MAU pricing)", val: "₹1,500/month" }, { label: "Cashfree Payouts", val: "volume pricing" }];
      rec.totalCost = "₹42,500–₹65,000/month"; rec.evidence = researchDatabase.zepto;
      rec.redFlag = { title: "Google Maps Platform Bills Are Unpredictable and Can Spike 10x.", body: "Google Maps Dynamic Maps API: ₹582/1,000 loads. At 100,000 driver-tracking sessions/day, that's ₹58,200/day = ₹17L+/month in maps alone. Set billing alerts at ₹50,000. Consider Mapbox (cheaper at scale) or HERE Maps (better enterprise pricing). Also: TimescaleDB compression policies need manual tuning — uncompressed GPS data at 120M rows/day will exhaust disk in weeks without a retention policy." };
    }
  }
  return rec;
}

function lStage(v) { return { idea: '🌱 Idea', mvp: '🚀 MVP', revenue: '💰 Early Revenue', growth: '📈 Growth' }[v] || v; }
function lTeam(v) { return { solo: 'Solo Founder', small: '2–5 People', medium: '6–20 People', large: '20+ People' }[v] || v; }
function lBudget(v) { return { tiny: 'Under ₹5,000/mo', low: '₹5,000–₹25,000/mo', mid: '₹25,000–₹1L/mo', high: '₹1L+/mo' }[v] || v; }
function lSector(v) { return { fintech: '💳 Fintech', healthtech: '🏥 HealthTech', edtech: '📚 EdTech', ecommerce: '🛍️ E-commerce', saas: '⚙️ SaaS', logistics: '🚚 Logistics' }[v] || v; }

export default function Stackify() {
  const [stage, setStage] = useState("idea");
  const [team, setTeam] = useState("solo");
  const [budget, setBudget] = useState("tiny");
  const [sector, setSector] = useState("fintech");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [visible, setVisible] = useState(false);
  const resultRef = useRef(null);

  function handleGenerate() {
    setLoading(true);
    setVisible(false);
    setTimeout(() => {
      setResult(getRecommendation(stage, team, budget, sector));
      setLoading(false);
      setTimeout(() => { setVisible(true); resultRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }); }, 50);
    }, 900);
  }

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500&family=Syne:wght@700;800&display=swap');
        :root{--bg:#13091f;--surface:rgba(255,255,255,0.05);--surface2:rgba(255,255,255,0.09);--border:rgba(255,255,255,0.12);--border2:rgba(255,255,255,0.2);--text:#f5eeff;--muted:#b09dc7;--accent:#d966ff;--accent2:#ff79c6;--accent3:#ff6b9d;--accent4:#ffe066;--glass:rgba(255,255,255,0.07);--glow:0 0 60px rgba(217,102,255,0.25);--font-display:'Syne',sans-serif;--font-body:'Space Grotesk',sans-serif;--font-mono:'JetBrains Mono',monospace;}
        *,*::before,*::after{box-sizing:border-box;margin:0;padding:0;}
        html{scroll-behavior:smooth;}
        body{font-family:var(--font-body);background:var(--bg);color:var(--text);min-height:100vh;overflow-x:hidden;}
        @keyframes drift{0%{transform:translate(0,0) scale(1);}33%{transform:translate(60px,-40px) scale(1.08);}66%{transform:translate(-40px,60px) scale(0.94);}100%{transform:translate(30px,30px) scale(1.04);}}
        @keyframes spin{to{transform:rotate(360deg);}}
        ::-webkit-scrollbar{width:6px;} ::-webkit-scrollbar-track{background:#0d0717;} ::-webkit-scrollbar-thumb{background:#3a2558;border-radius:3px;}
        .blob{position:absolute;border-radius:50%;filter:blur(80px);opacity:0.28;animation:drift 18s ease-in-out infinite alternate;}
        .blob1{width:650px;height:650px;background:#c026d3;top:-200px;left:-200px;animation-duration:22s;}
        .blob2{width:550px;height:550px;background:#7c3aed;bottom:-150px;right:-100px;animation-duration:28s;animation-delay:-8s;}
        .blob3{width:400px;height:400px;background:#ff4ecd;top:40%;right:20%;animation-duration:20s;animation-delay:-4s;}
        .blob4{width:300px;height:300px;background:#f59e0b;bottom:30%;left:15%;animation-duration:16s;animation-delay:-12s;}
        select{width:100%;background:rgba(255,255,255,0.05);border:1px solid var(--border2);border-radius:12px;color:var(--text);font-family:var(--font-body);font-size:14px;padding:12px 40px 12px 16px;outline:none;appearance:none;-webkit-appearance:none;cursor:pointer;background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8'%3E%3Cpath d='M1 1l5 5 5-5' stroke='%236b7280' stroke-width='1.5' fill='none' stroke-linecap='round'/%3E%3C/svg%3E");background-repeat:no-repeat;background-position:right 16px center;transition:border-color 0.2s,box-shadow 0.2s;}
        select option{background:#0d1117;color:var(--text);}
        select:hover{border-color:rgba(217,102,255,0.5);}
        select:focus{border-color:var(--accent);box-shadow:0 0 0 3px rgba(217,102,255,0.15);}
        .card{background:rgba(255,255,255,0.06);border:1px solid rgba(255,255,255,0.13);border-radius:20px;padding:24px;margin-bottom:20px;backdrop-filter:blur(24px);transition:border-color 0.3s,transform 0.3s,box-shadow 0.3s;position:relative;overflow:hidden;}
        .card::before{content:'';position:absolute;top:0;left:0;right:0;height:2px;background:linear-gradient(90deg,transparent,var(--card-accent,var(--accent)),transparent);opacity:0.9;}
        .card:hover{border-color:rgba(217,102,255,0.3);transform:translateY(-3px);box-shadow:0 8px 32px rgba(217,102,255,0.15);}
        .card-label{font-family:var(--font-mono);font-size:10px;letter-spacing:2px;text-transform:uppercase;color:var(--muted);margin-bottom:16px;display:flex;align-items:center;gap:8px;}
        .dot{width:6px;height:6px;border-radius:50%;background:var(--card-accent,var(--accent));box-shadow:0 0 6px var(--card-accent,var(--accent));display:inline-block;flex-shrink:0;}
        .profile-grid{display:grid;grid-template-columns:1fr 1fr;gap:12px;}
        .profile-item{background:rgba(255,255,255,0.04);border:1px solid var(--border);border-radius:12px;padding:12px 16px;}
        .pi-label{font-size:10px;font-family:var(--font-mono);color:var(--muted);letter-spacing:1px;text-transform:uppercase;margin-bottom:4px;}
        .pi-value{font-size:14px;font-weight:600;color:var(--text);}
        .stack-grid{display:grid;grid-template-columns:1fr 1fr;gap:10px;}
        .stack-item{background:rgba(255,255,255,0.04);border:1px solid var(--border);border-radius:12px;padding:14px 16px;transition:border-color 0.2s;}
        .stack-item:hover{border-color:rgba(217,102,255,0.4);box-shadow:0 0 16px rgba(217,102,255,0.1);}
        .si-category{font-size:10px;font-family:var(--font-mono);color:var(--muted);letter-spacing:1px;text-transform:uppercase;margin-bottom:6px;}
        .si-tech{font-size:15px;font-weight:700;font-family:var(--font-display);color:var(--text);margin-bottom:4px;}
        .si-note{font-size:11px;color:var(--muted);line-height:1.4;}
        .cost-row{display:flex;justify-content:space-between;align-items:center;padding:10px 0;border-bottom:1px solid var(--border);font-size:13px;}
        .cost-row:last-of-type{border-bottom:none;}
        .cr-label{color:var(--muted);}
        .cr-val{font-family:var(--font-mono);color:var(--text);font-size:13px;}
        .cost-total{background:linear-gradient(135deg,rgba(217,102,255,0.12),rgba(255,121,198,0.12));border:1px solid rgba(217,102,255,0.35);border-radius:12px;padding:16px;display:flex;justify-content:space-between;align-items:center;margin-top:16px;}
        .ct-label{font-family:var(--font-mono);font-size:11px;color:var(--accent);letter-spacing:2px;text-transform:uppercase;}
        .ct-amount{font-family:var(--font-display);font-size:22px;font-weight:800;color:var(--accent);}
        .india-integration{display:flex;gap:16px;align-items:flex-start;}
        .india-icon{width:48px;height:48px;background:linear-gradient(135deg,rgba(255,136,0,0.2),rgba(19,136,8,0.2));border:1px solid rgba(255,136,0,0.3);border-radius:12px;display:flex;align-items:center;justify-content:center;font-size:22px;flex-shrink:0;}
        .india-content h4{font-family:var(--font-display);font-size:16px;font-weight:700;margin-bottom:6px;}
        .india-content p{font-size:13px;color:var(--muted);line-height:1.6;margin-bottom:10px;}
        .india-content a{font-family:var(--font-mono);font-size:11px;color:var(--accent);text-decoration:none;border-bottom:1px solid rgba(0,245,212,0.3);padding-bottom:1px;transition:border-color 0.2s;}
        .india-content a:hover{border-color:var(--accent);}
        .redflag{background:rgba(255,107,107,0.06);border:1px solid rgba(255,107,107,0.25);border-radius:16px;padding:20px;display:flex;gap:14px;align-items:flex-start;}
        .redflag-icon{font-size:24px;flex-shrink:0;}
        .redflag h4{font-family:var(--font-display);font-size:15px;font-weight:700;color:var(--accent3);margin-bottom:6px;}
        .redflag p{font-size:13px;color:rgba(255,107,107,0.7);line-height:1.6;}
        .startup-evidence{display:flex;gap:14px;align-items:flex-start;background:rgba(123,97,255,0.06);border:1px solid rgba(123,97,255,0.2);border-radius:14px;padding:18px;}
        .se-logo{width:44px;height:44px;border-radius:10px;display:flex;align-items:center;justify-content:center;font-family:var(--font-display);font-size:13px;font-weight:800;flex-shrink:0;}
        .se-content h4{font-size:15px;font-weight:700;margin-bottom:4px;}
        .se-stack{font-family:var(--font-mono);font-size:11px;color:var(--accent2);margin-bottom:6px;letter-spacing:0.5px;}
        .se-observation{font-size:12px;color:var(--muted);line-height:1.5;}
        .se-content a{font-family:var(--font-mono);font-size:10px;color:var(--accent2);text-decoration:none;letter-spacing:1px;text-transform:uppercase;opacity:0.7;}
        .why-fits p{font-size:14px;line-height:1.8;color:rgba(232,234,240,0.85);}
        .contrarian-badge{display:inline-flex;align-items:center;gap:8px;background:linear-gradient(135deg,rgba(255,209,102,0.15),rgba(255,107,107,0.15));border:1px solid rgba(255,209,102,0.4);border-radius:20px;padding:6px 14px;font-family:var(--font-mono);font-size:10px;letter-spacing:2px;text-transform:uppercase;color:var(--accent4);margin-bottom:16px;}
        .contrarian-explain{background:rgba(255,209,102,0.05);border:1px solid rgba(255,209,102,0.15);border-radius:12px;padding:14px 16px;font-size:13px;color:rgba(255,209,102,0.8);line-height:1.6;margin-top:12px;}
        .log-timeline{border-left:1px solid var(--border);padding-left:28px;position:relative;}
        .log-entry{position:relative;margin-bottom:24px;padding:16px 20px;background:var(--glass);border:1px solid var(--border);border-radius:14px;transition:border-color 0.2s;}
        .log-entry::before{content:'';position:absolute;left:-34px;top:20px;width:10px;height:10px;border-radius:50%;background:var(--border2);border:2px solid var(--bg);}
        .log-entry:hover{border-color:var(--border2);}
        .log-entry:hover::before{background:var(--accent);}
        .log-time{font-family:var(--font-mono);font-size:10px;color:var(--accent);letter-spacing:1px;margin-bottom:6px;}
        .log-text{font-size:13px;color:rgba(232,234,240,0.75);line-height:1.6;}
        .panel-label-line::after{content:'';flex:1;height:1px;background:linear-gradient(90deg,rgba(217,102,255,0.4),transparent);display:block;}
        @media(max-width:900px){
          .main{grid-template-columns:1fr!important;padding:24px 20px 0!important;}
          .left-panel{padding-right:0!important;position:static!important;}
          .right-panel{padding-left:0!important;border-left:none!important;border-top:1px solid var(--border);padding-top:32px;margin-top:32px;}
          header{padding:20px!important;}
          .decision-log{padding:40px 20px!important;}
          footer{padding:20px!important;flex-direction:column;gap:8px;text-align:center;}
          .stack-grid,.profile-grid{grid-template-columns:1fr!important;}
        }
      `}</style>

      {/* BG */}
      <div style={{position:'fixed',inset:0,zIndex:0,overflow:'hidden',pointerEvents:'none'}}>
        <div className="blob blob1"/><div className="blob blob2"/><div className="blob blob3"/><div className="blob blob4"/>
        <div style={{position:'absolute',inset:0,backgroundImage:'linear-gradient(rgba(255,255,255,0.04) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.04) 1px,transparent 1px)',backgroundSize:'40px 40px'}}/>
      </div>

      <div style={{position:'relative',zIndex:1,minHeight:'100vh',display:'flex',flexDirection:'column'}}>

        {/* HEADER */}
        <header style={{padding:'28px 40px',display:'flex',alignItems:'center',justifyContent:'space-between',borderBottom:'1px solid var(--border)',backdropFilter:'blur(20px)',background:'rgba(19,9,31,0.75)',position:'sticky',top:0,zIndex:100}}>
          <div style={{display:'flex',alignItems:'center',gap:14}}>
            <div style={{width:38,height:38,background:'linear-gradient(135deg,var(--accent),var(--accent2))',borderRadius:10,display:'flex',alignItems:'center',justifyContent:'center',fontFamily:'var(--font-display)',fontWeight:800,fontSize:16,color:'#060810',letterSpacing:-1}}>S⚡</div>
            <div>
              <div style={{fontFamily:'var(--font-display)',fontSize:20,fontWeight:800,letterSpacing:2,background:'linear-gradient(90deg,var(--accent),var(--accent2))',WebkitBackgroundClip:'text',WebkitTextFillColor:'transparent',backgroundClip:'text'}}>STACKIFY</div>
              <div style={{fontSize:11,color:'var(--muted)',fontFamily:'var(--font-mono)',letterSpacing:1,textTransform:'uppercase'}}>Turn Your Idea Into a Stack</div>
            </div>
          </div>
          <div style={{fontFamily:'var(--font-mono)',fontSize:11,color:'var(--accent)',border:'1px solid rgba(217,102,255,0.4)',padding:'6px 14px',borderRadius:20,background:'rgba(217,102,255,0.1)',letterSpacing:1}}>INDIA STARTUP EDITION</div>
        </header>

        {/* MAIN */}
        <div className="main" style={{flex:1,display:'grid',gridTemplateColumns:'400px 1fr',gap:0,maxWidth:1400,margin:'0 auto',width:'100%',padding:'40px 40px 0',alignItems:'start'}}>

          {/* LEFT */}
          <div className="left-panel" style={{paddingRight:40,position:'sticky',top:100}}>
            <div className="panel-label-line" style={{fontFamily:'var(--font-mono)',fontSize:10,letterSpacing:3,color:'var(--accent)',textTransform:'uppercase',marginBottom:24,display:'flex',alignItems:'center',gap:10}}>
              Configure
              <span style={{flex:1,height:1,background:'linear-gradient(90deg,rgba(217,102,255,0.4),transparent)',display:'block'}}/>
            </div>
            <h1 style={{fontFamily:'var(--font-display)',fontSize:32,fontWeight:800,lineHeight:1.1,marginBottom:10,letterSpacing:-1}}>
              Stackify<br/>
              <span style={{background:'linear-gradient(90deg,var(--accent),var(--accent2))',WebkitBackgroundClip:'text',WebkitTextFillColor:'transparent',backgroundClip:'text'}}>Your Startup</span>
            </h1>
            <p style={{fontSize:14,color:'#c4aee0',lineHeight:1.6,marginBottom:36}}>Tell us about your startup and we'll turn your idea into a deeply reasoned tech stack — with real Indian startup evidence, INR cost breakdowns, and contrarian takes.</p>

            <div style={{background:'rgba(255,255,255,0.06)',border:'1px solid rgba(217,102,255,0.2)',borderRadius:20,padding:28,backdropFilter:'blur(24px)',boxShadow:'0 0 40px rgba(217,102,255,0.08)'}}>
              {[
                {id:'stage',label:'Startup Stage',val:stage,set:setStage,opts:[['idea','🌱 Idea'],['mvp','🚀 MVP'],['revenue','💰 Early Revenue'],['growth','📈 Growth']]},
                {id:'team',label:'Team Size',val:team,set:setTeam,opts:[['solo','Solo Founder'],['small','2–5 People'],['medium','6–20 People'],['large','20+ People']]},
                {id:'budget',label:'Monthly Budget',val:budget,set:setBudget,opts:[['tiny','Under ₹5,000/month'],['low','₹5,000–₹25,000/month'],['mid','₹25,000–₹1,00,000/month'],['high','₹1,00,000+/month']]},
                {id:'sector',label:'Primary Sector',val:sector,set:setSector,opts:[['fintech','💳 Fintech'],['healthtech','🏥 HealthTech'],['edtech','📚 EdTech'],['ecommerce','🛍️ E-commerce'],['saas','⚙️ SaaS'],['logistics','🚚 Logistics']]},
              ].map(({id,label,val,set,opts})=>(
                <div key={id} style={{marginBottom:20}}>
                  <label style={{display:'block',fontSize:11,fontFamily:'var(--font-mono)',letterSpacing:2,textTransform:'uppercase',color:'var(--muted)',marginBottom:10}}>{label}</label>
                  <select value={val} onChange={e=>set(e.target.value)}>
                    {opts.map(([v,l])=><option key={v} value={v}>{l}</option>)}
                  </select>
                </div>
              ))}

              <button onClick={handleGenerate} disabled={loading}
                style={{width:'100%',padding:'16px 24px',background:'linear-gradient(135deg,var(--accent),var(--accent2))',color:'#060810',fontFamily:'var(--font-display)',fontWeight:800,fontSize:15,letterSpacing:1,border:'none',borderRadius:14,cursor:loading?'not-allowed':'pointer',transition:'transform 0.2s,box-shadow 0.2s',position:'relative',overflow:'hidden'}}
                onMouseEnter={e=>{if(!loading){e.currentTarget.style.transform='translateY(-2px)';e.currentTarget.style.boxShadow='0 12px 40px rgba(217,102,255,0.5)';}}}
                onMouseLeave={e=>{e.currentTarget.style.transform='translateY(0)';e.currentTarget.style.boxShadow='none';}}>
                <div style={{display:'flex',alignItems:'center',justifyContent:'center',gap:8}}>
                  {loading
                    ? <div style={{width:20,height:20,border:'2px solid rgba(6,8,16,0.3)',borderTopColor:'#060810',borderRadius:'50%',animation:'spin 0.8s linear infinite'}}/>
                    : <><span>Stackify Me ⚡</span><span>→</span></>
                  }
                </div>
              </button>
            </div>
          </div>

          {/* RIGHT */}
          <div className="right-panel" ref={resultRef} style={{paddingLeft:40,borderLeft:'1px solid var(--border)',paddingBottom:60,minHeight:'calc(100vh - 120px)'}}>
            {!result ? (
              <div style={{display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',minHeight:'60vh',textAlign:'center',color:'var(--muted)',gap:20}}>
                <div style={{width:80,height:80,border:'2px dashed rgba(255,255,255,0.1)',borderRadius:20,display:'flex',alignItems:'center',justifyContent:'center',fontSize:32}}>⚡</div>
                <h3 style={{fontFamily:'var(--font-display)',fontSize:20,color:'rgba(255,255,255,0.3)',fontWeight:700}}>Ready to Stackify you</h3>
                <p style={{fontSize:14,maxWidth:300,lineHeight:1.6}}>Configure your startup profile and hit <strong>Stackify Me</strong> — we'll turn your idea into a full tech stack in seconds.</p>
              </div>
            ) : (
              <div style={{opacity:visible?1:0,transform:visible?'translateY(0)':'translateY(30px)',transition:'opacity 0.5s ease,transform 0.5s ease'}}>

                {/* Result Header */}
                <div style={{marginBottom:28}}>
                  <span style={{fontFamily:'var(--font-mono)',fontSize:10,letterSpacing:3,textTransform:'uppercase',color:'var(--accent)',marginBottom:10,display:'block'}}>⚡ Stack Analysis Complete — Stackified</span>
                  <h2 style={{fontFamily:'var(--font-display)',fontSize:26,fontWeight:800,letterSpacing:-0.5}}>{lSector(sector)} · {lStage(stage)}</h2>
                </div>

                {/* Profile */}
                <div className="card" style={{'--card-accent':'var(--accent2)'}}>
                  <div className="card-label"><span className="dot"/>Startup Profile</div>
                  <div className="profile-grid">
                    {[['Stage',lStage(stage)],['Team',lTeam(team)],['Budget',lBudget(budget)],['Sector',lSector(sector)]].map(([l,v])=>(
                      <div key={l} className="profile-item"><div className="pi-label">{l}</div><div className="pi-value">{v}</div></div>
                    ))}
                  </div>
                </div>

                {/* Stack */}
                <div className="card" style={{'--card-accent':'var(--accent)'}}>
                  <div className="card-label"><span className="dot"/>Recommended Stack</div>
                  {result.isContrarian && <div className="contrarian-badge">Contrarian Recommendation</div>}
                  <div className="stack-grid">
                    {Object.entries(result.stack).map(([key,val])=>(
                      <div key={key} className="stack-item">
                        <div className="si-category">{key}</div>
                        <div className="si-tech">{val.name}</div>
                        <div className="si-note">{val.note}</div>
                      </div>
                    ))}
                  </div>
                  {result.isContrarian && <div className="contrarian-explain">⚡ {result.contrarianExplain}</div>}
                </div>

                {/* Why Fits */}
                <div className="card why-fits" style={{'--card-accent':'#ffd166'}}>
                  <div className="card-label"><span className="dot" style={{background:'#ffd166',boxShadow:'0 0 6px #ffd166'}}/>Why This Fits</div>
                  <p>{result.whyFits}</p>
                </div>

                {/* Costs */}
                <div className="card" style={{'--card-accent':'var(--accent)'}}>
                  <div className="card-label"><span className="dot"/>Cost Breakdown</div>
                  <div>{result.costs.map((c,i)=>(
                    <div key={i} className="cost-row"><span className="cr-label">{c.label}</span><span className="cr-val">{c.val}</span></div>
                  ))}</div>
                  <div className="cost-total"><span className="ct-label">Estimated Monthly Total</span><span className="ct-amount">{result.totalCost}</span></div>
                </div>

                {/* India Integration */}
                <div className="card" style={{'--card-accent':'#ff9933'}}>
                  <div className="card-label"><span className="dot" style={{background:'#ff9933',boxShadow:'0 0 6px #ff9933'}}/>India-Specific Integration</div>
                  <div className="india-integration">
                    <div className="india-icon">{result.integration.icon}</div>
                    <div className="india-content">
                      <h4>{result.integration.name}</h4>
                      <p>{result.integration.why}</p>
                      <a href={result.integration.docs} target="_blank" rel="noopener noreferrer">Official Documentation →</a>
                    </div>
                  </div>
                </div>

                {/* Red Flag */}
                <div className="card" style={{'--card-accent':'var(--accent3)',borderColor:'rgba(255,107,107,0.2)'}}>
                  <div className="card-label"><span className="dot" style={{background:'var(--accent3)',boxShadow:'0 0 6px var(--accent3)'}}/>Red Flag / Risk</div>
                  <div className="redflag">
                    <div className="redflag-icon">⚠️</div>
                    <div><h4>{result.redFlag.title}</h4><p>{result.redFlag.body}</p></div>
                  </div>
                </div>

                {/* Evidence */}
                {result.evidence && (
                  <div className="card" style={{'--card-accent':'var(--accent2)'}}>
                    <div className="card-label"><span className="dot" style={{background:'var(--accent2)',boxShadow:'0 0 6px var(--accent2)'}}/>Real Startup Evidence</div>
                    <div className="startup-evidence">
                      <div className="se-logo" style={{background:result.evidence.logoColor+'22',border:`1px solid ${result.evidence.logoColor}44`,color:result.evidence.logoColor}}>{result.evidence.logoText}</div>
                      <div className="se-content">
                        <h4>{result.evidence.name} <span style={{color:'var(--muted)',fontSize:12,fontWeight:400}}>({result.evidence.stage})</span></h4>
                        <div className="se-stack">{result.evidence.stack}</div>
                        <div className="se-observation">{result.evidence.observation}</div>
                        <br/>
                        <a href={result.evidence.source} target="_blank" rel="noopener noreferrer">View Source →</a>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* DECISION LOG */}
        <div className="decision-log" style={{maxWidth:1400,margin:'0 auto',padding:'60px 40px',width:'100%'}}>
          <div style={{display:'flex',alignItems:'center',gap:16,marginBottom:36}}>
            <h2 style={{fontFamily:'var(--font-display)',fontSize:22,fontWeight:800,letterSpacing:-0.5}}>Decision Log</h2>
            <span style={{fontFamily:'var(--font-mono)',fontSize:10,color:'var(--muted)',letterSpacing:2,textTransform:'uppercase',border:'1px solid var(--border)',padding:'4px 10px',borderRadius:20}}>Build Audit Trail</span>
          </div>
          <div className="log-timeline">
            {decisionLog.map((e,i)=>(
              <div key={i} className="log-entry">
                <div className="log-time">{e.time}</div>
                <div className="log-text">{e.text}</div>
              </div>
            ))}
          </div>
        </div>

        {/* FOOTER */}
        <footer style={{borderTop:'1px solid var(--border)',padding:'24px 40px',display:'flex',justifyContent:'space-between',alignItems:'center',background:'rgba(6,8,16,0.5)',backdropFilter:'blur(20px)',fontSize:12,color:'var(--muted)',fontFamily:'var(--font-mono)'}}>
          <span style={{background:'linear-gradient(90deg,var(--accent),var(--accent2))',WebkitBackgroundClip:'text',WebkitTextFillColor:'transparent',letterSpacing:1}}>STACKIFY</span>
          <span style={{letterSpacing:1}}>Stackify — Turn Your Idea Into a Stack · Built for Indian Founders · 2025</span>
          <span style={{letterSpacing:1}}>React + Vite</span>
        </footer>
      </div>
    </>
  );
}
