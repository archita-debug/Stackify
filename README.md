# ⚡ Stackify — Turn Your Idea Into a Stack
 
> Tech Stack Recommender for Indian Startups
 
---
 
## 🚀 Live Demo
 
🔗 [stackify-iota.vercel.app](https://stackify-iota.vercel.app/)
 
---
 
## 📌 What It Does
 
Stackify is a web tool where a founder inputs 4 parameters about their startup and gets a deeply reasoned tech stack recommendation — with real evidence, INR cost breakdowns, India-specific integrations, and contrarian takes.
 
**Inputs:**
- Startup Stage (Idea / MVP / Early Revenue / Growth)
- Team Size (Solo / 2–5 / 6–20 / 20+)
- Monthly Budget (Under ₹5K / ₹5K–₹25K / ₹25K–₹1L / ₹1L+)
- Primary Sector (Fintech / HealthTech / EdTech / E-commerce / SaaS / Logistics)
**Outputs:**
- Full tech stack — Hosting, Frontend, Backend, Database, Auth, Payments
- India-specific integration per sector (UPI, ABDM, DigiLocker, ONDC, GST API, E-Way Bill)
- INR cost breakdown from real pricing pages
- Red flag / constraint specific to that combination
- Contrarian recommendation (flagged + defended with data)
- Real Indian startup evidence with source links
---
 
## 🛠 Tech Stack
 
| Layer | Tool |
|---|---|
| Framework | React 18 + Vite |
| Styling | Plain CSS-in-JS (no Tailwind, no UI libs) |
| Fonts | Space Grotesk · JetBrains Mono · Syne |
| Hosting | Vercel |
| Logic | Client-side JS decision tree (no backend, no API) |
 
---
 
## 📁 Project Structure
 
```
stackify/
├── src/
│   ├── main.jsx          ← React entry point
│   └── Stackify.jsx      ← Full app (data + logic + UI)
├── index.html            ← Vite HTML shell
├── vite.config.js        ← Vite config
├── vercel.json           ← Vercel deployment config
├── package.json
└── .gitignore
```
 
---
 
## 🏃 Run Locally
 
**Requirements:** Node.js v18+
 
```bash
# 1. Unzip and enter folder
unzip stackify.zip
cd stackify
 
# 2. Install dependencies
npm install
 
# 3. Start dev server
npm run dev
 
# 4. Open in browser
# → http://localhost:5173
```
 
---
 
## 🌐 Deploy to Vercel
 
**Option A — Vercel CLI (fastest)**
```bash
cd stackify
npm install
npx vercel
# Hit enter on every prompt — Vite is auto-detected
```
 
**Option B — GitHub + Vercel Dashboard**
```bash
git init
git add .
git commit -m "init stackify"
git remote add origin https://github.com/YOUR_USERNAME/stackify.git
git push -u origin main
```
Then go to [vercel.com/new](https://vercel.com/new) → Import repo → Deploy ✅
 
**Option C — Drag & Drop**
Go to [vercel.com/new](https://vercel.com/new) → drag the `stackify` folder → Deploy ✅
 
---
 
## 🧠 How the Logic Works
 
No AI, no API calls. Everything runs client-side.
 
The recommendation engine is a JavaScript decision tree that maps the 4 inputs to a pre-built stack database. Rules include:
 
| Condition | Rule |
|---|---|
| Budget < ₹5K | Never AWS. Always Cloudflare Pages. |
| HealthTech (any budget) | Always PostgreSQL. Firebase is non-compliant with ABDM. |
| Fintech | Always Razorpay / Cashfree. Stripe unavailable for Indian domestic txns. |
| Logistics | Always Node.js backend. E-Way Bill API requires server-side calls. |
| Solo SaaS + tiny budget | Contrarian: Rails on Render over Next.js + Firebase |
| MVP Logistics + low budget | Contrarian: Render over AWS ECS |
 
---
 
## 🇮🇳 India-Specific Integrations
 
| Sector | Integration |
|---|---|
| Fintech | UPI + Razorpay Payment Gateway |
| HealthTech | ABDM + ABHA Health ID API |
| EdTech | DigiLocker Academic Bank of Credits (ABC) |
| E-commerce | ONDC (Open Network for Digital Commerce) |
| SaaS | Razorpay Route + GST Invoicing API |
| Logistics | E-Way Bill API + GST API Gateway |
 
---
 
## 🔬 Research Sources
 
| Startup | Stack | Source |
|---|---|---|
| Razorpay | Java + Golang, React, PostgreSQL, Kafka, AWS | [engineering.razorpay.com](https://engineering.razorpay.com) |
| Zepto | Golang microservices, Kafka, PostgreSQL, React Native | [LinkedIn Job Postings](https://linkedin.com/company/zepto-app/jobs) |
| Practo | Python/Django, Rails, React, PostgreSQL, AWS | [StackShare](https://stackshare.io/practo/practo) |
| CRED | Kotlin, PostgreSQL, Kubernetes, gRPC, GCP | [engineering.cred.club](https://engineering.cred.club) |
| Meesho | Python + Go, React, MySQL, Redis, AWS | [medium.com/meesho-tech](https://medium.com/meesho-tech) |
| Groww | Java Spring Boot, React, PostgreSQL, Kafka | [tech.groww.in](https://tech.groww.in) |
| Freshworks | Ruby on Rails, React, MySQL, Redis, AWS | [medium.com/freshworks-engineering-blog](https://medium.com/freshworks-engineering-blog) |
 
---
 
## ⚡ Contrarian Recommendations
 
**1. Solo SaaS Founder — Rails on Render (not Next.js + Firebase)**
- Standard advice: Next.js + Vercel + PlanetScale + Clerk = ₹8,000+/month
- Stackify's take: Ruby on Rails on Render = ₹4,400/month
- Evidence: Freshworks (Nasdaq: FRSH, $12B valuation) ran Rails for a decade
**2. MVP Logistics — Render over AWS ECS**
- Standard advice: AWS ECS because "it scales"
- Stackify's take: Render + Cloudflare R2 = ₹7,765/month vs AWS ECS ₹50,000+/month
- Evidence: Render's reliability SLA matches AWS for workloads under 100k req/day
---
 
## 📋 Decision Log
 
| Time | Decision |
|---|---|
| 7:40 PM | Replaced AWS as default hosting with tiered model based on budget |
| 8:05 PM | Switched HealthTech from Firebase to PostgreSQL (ABDM compliance) |
| 8:22 PM | Added contrarian path for Solo SaaS (Rails over Next.js) |
| 8:45 PM | Added Node.js backend for Logistics (E-Way Bill requires server-side) |
| 9:10 PM | Populated research DB with 7 verified Indian startups |
| 9:33 PM | Finalized contrarian path for MVP Logistics (Render over AWS ECS) |
| 9:58 PM | Standardized payments to Razorpay/Cashfree (Stripe unavailable for India) |
| 10:20 PM | Finalized design system — purple/pink glassmorphism, CSS blob animations |
 
---
 
## 👤 Author
 
Built by **Archita Bhalotia**
 
---
 
## 📄 License
 
MIT — free to use, modify, and deploy.
