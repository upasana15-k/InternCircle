# ☁️ CloudDock — Developer Cloud & Infrastructure Platform Pricing & Billing Engine

> **InternCircle Virtual Internship — Project 3**  
> **Author:** Upasana Kudape  
> **Architecture:** Full-Stack Commercial SaaS (Stripe / GitHub Style)  
> **Frontend:** Semantic HTML5 · Vanilla CSS3 (Custom Design Tokens, Grid & Flexbox) · ES6+ JavaScript  
> **Backend:** Node.js HTTP/REST API Server (`server.js`) · JSON Persistence Storage (`data/subscriptions.json`)

---

## 🌟 Overview

**CloudDock** is a production-grade developer cloud infrastructure pricing and billing system. It is modeled after industry-standard commercial developer platforms such as **Stripe, GitHub, Docker, and Vercel**.

It combines a clean corporate tech UI with a **real Node.js REST API backend** that handles dynamic tier definitions, modular add-ons, regional tax compliance, promotional coupons, upgrade proration credits, persistent subscription state, and official printable tax invoices.

---

## 🚀 Full-Stack Architecture & Features

### 🔌 1. Real Node.js REST API Backend (`server.js`)
The backend is built with native Node.js (zero external dependencies required) and exposes the following endpoints:

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/plans` | Fetches active compute tiers, vCPU/RAM specs, pricing, and quotas. |
| `GET` | `/api/addons` | Returns modular add-on offerings (Dedicated IP, Snapshots, CDN, SOC2 Vault). |
| `GET` | `/api/currencies` | Returns exchange rates (USD, EUR, GBP, INR) and regional tax rates. |
| `GET` | `/api/subscriptions/active` | Retrieves simulated authenticated user status and recent billing orders. |
| `POST` | `/api/coupons/validate` | Validates promotional codes (`CLOUD20` -> 20%, `STARTUP50` -> 50%, `STUDENT` -> 30%). |
| `POST` | `/api/tax/calculate` | Calculates regional tax obligations (US 0%, EU 20% VAT, UK 20% VAT, IN 18% GST). |
| `POST` | `/api/checkout/create-subscription` | Provisions new subscription, applies proration credit, calculates tax, and commits to database. |
| `POST` | `/api/enterprise/quote` | Scopes enterprise requirements and generates formal proposal ID (`QUOTE-ENT-XXXX`). |
| `GET` | `/api/invoices/:id` | Generates and serves official, printable commercial tax invoice. |

---

### 💳 2. Real Commercial SaaS Features

1. **Segmented Billing Switch (Stripe Style)**:
   - Instant toggle between **Monthly Billing** and **Annual Billing (Save 20%)**.
   - Animated price transitions and clear yearly savings summaries.

2. **Card Ribbon Badges**:
   - **Pro Team Tier**: Solid royal blue diagonal corner ribbon: **`MOST POPULAR`**.
   - **Business Tier**: Solid mint-emerald diagonal corner ribbon: **`BEST VALUE`**.

3. **Active Account Status & Upgrade Proration**:
   - Real-time status banner: detects active user plan (**Developer Tier** at $12/mo).
   - Upgrading to Pro Team automatically applies an instant **-$7.20 proration credit** for unused billing days.

4. **Modular Infrastructure Add-Ons**:
   - Interactive checklist allowing developers to attach modular services:
     - **Dedicated Static IPv4** (`+$15/mo`)
     - **Automated Daily Snapshots** (`+$10/mo`)
     - **Global Anycast Edge CDN** (`+$25/mo`)
     - **SOC2 Compliance Vault** (`+$50/mo`)
   - Toggles recalculate monthly costs in real time and flow into checkout.

5. **Multi-Currency & Regional Tax Engine**:
   - Live price recalculation across **USD ($)**, **EUR (€)**, **GBP (£)**, and **INR (₹)**.
   - Regional tax compliance calculating VAT / GST for United States, European Union, United Kingdom, and India.

6. **Live Search & Category Filter on Specification Matrix**:
   - Instant keyword filtering across 40+ specs (e.g. searching "SSD", "vCPU", "SLA", "SSL").
   - Category filtering pills: **All Specs**, **Compute**, **Security**, and **Support & SLAs**.

7. **Official Tax Invoice Generator & PDF-Ready Printable Receipt**:
   - After confirming subscription, CloudDock issues a unique invoice ID (`INV-2026-XXXXX`).
   - Customers can click **"View & Print Official Tax Invoice"** to inspect a printable commercial invoice with breakdown, tax ID, and billing ledger.

8. **Enterprise Architecture Scoping Drawer**:
   - Scopes custom bare-metal nodes, target cloud regions, and compliance frameworks (SOC2, HIPAA, PCI-DSS, ISO 27001).
   - Generates an instant enterprise proposal ID.

---

## 📂 Project Structure

```text
pricing_cards/
├── server.js              ← Node.js REST API server & static file dispatcher
├── package.json           ← Project metadata and start scripts (npm start / node server.js)
├── index.html             ← Semantic HTML5 layout, pricing cards, add-ons, matrix & modals
├── style.css              ← Clean corporate tech design system (Stripe/GitHub style)
├── app.js                 ← Client state engine, REST API client, add-ons manager & search
├── data/
│   └── subscriptions.json ← Persistent storage for active accounts, subscriptions & orders
└── README.md              ← Comprehensive architecture & internship project documentation
```

---

## 🚀 How to Run Locally

### Option A: Run Full-Stack with REST API Server (Recommended)
```bash
cd d:\projects\InternCircle_virtual_internship\pricing_cards
npm start
```
Then visit **`http://localhost:3000`** in your browser. All REST API endpoints (`/api/plans`, `/api/coupons/validate`, `/api/checkout/create-subscription`) and invoice printing will be fully operational.

### Option B: Open Frontend Directly
You can also open [`index.html`](file:///d:/projects/InternCircle_virtual_internship/pricing_cards/index.html) directly in any browser. The client includes intelligent local fallbacks, so every feature works even offline.

---

© 2026 Upasana Kudape. Built for **InternCircle Virtual Internship** · Project 3: Responsive Product Pricing Cards & Billing Engine.
