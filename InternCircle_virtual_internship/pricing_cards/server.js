/**
 * CloudDock — Developer Cloud & Infrastructure Platform
 * Production-Grade Node.js REST API & Billing Backend Server
 * Author: Upasana Kudape (InternCircle Virtual Internship)
 */

const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url');

const PORT = process.env.PORT || 3000;
const DATA_DIR = path.join(__dirname, 'data');
const SUBSCRIPTIONS_FILE = path.join(DATA_DIR, 'subscriptions.json');

// Ensure data directory exists
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

// Initialize persistent state if not exists
if (!fs.existsSync(SUBSCRIPTIONS_FILE)) {
  const initialData = {
    activeUser: {
      userId: 'usr_cloud_9482',
      email: 'dev@company.internal',
      currentPlanId: 'starter',
      planName: 'Developer',
      billingCycle: 'yearly',
      basePriceUSD: 12,
      renewalDate: '2026-11-01',
      activeContainers: 3,
      developerSeats: 1
    },
    orders: []
  };
  fs.writeFileSync(SUBSCRIPTIONS_FILE, JSON.stringify(initialData, null, 2));
}

// ----------------------------------------------------------------------------
// Core Database Definitions & Quotas
// ----------------------------------------------------------------------------
const PLANS_DATABASE = {
  starter: {
    id: 'starter',
    name: 'Developer',
    badge: 'Hobby',
    tagline: 'For individual developers, prototypes, and lightweight side projects.',
    monthlyUSD: 15,
    yearlyUSD: 12,
    annualBilledUSD: 144,
    savingsUSD: 36,
    specs: '2 vCPU / 4 GB RAM',
    includedSeats: 1,
    includedContainers: 3,
    storageGB: 50,
    bandwidthGB: 100,
    features: [
      '3 Active Container clusters',
      '2 vCPU & 4 GB RAM allocation',
      '50 GB SSD Block Storage',
      'Community Discord & Docs'
    ]
  },
  pro: {
    id: 'pro',
    name: 'Pro Team',
    badge: 'Production Ready',
    tagline: 'For high-growth software teams running production web applications.',
    isPopular: true,
    monthlyUSD: 49,
    yearlyUSD: 39,
    annualBilledUSD: 468,
    savingsUSD: 120,
    specs: '8 vCPU / 32 GB RAM',
    includedSeats: 10,
    includedContainers: 20,
    storageGB: 500,
    bandwidthGB: 1000,
    features: [
      'Unlimited Active Container clusters',
      '8 vCPU & 32 GB RAM dedicated pool',
      '500 GB NVMe High-IOPS Storage',
      'Custom Domains & Free Automated SSL',
      'Daily Snapshot Backups & Point-in-Time Restore',
      'Priority Technical Email & Slack Support'
    ]
  },
  business: {
    id: 'business',
    name: 'Business',
    badge: 'Scale & Security',
    tagline: 'For mission-critical infrastructure requiring high throughput and compliance.',
    isBestValue: true,
    monthlyUSD: 99,
    yearlyUSD: 79,
    annualBilledUSD: 948,
    savingsUSD: 240,
    specs: '32 vCPU / 128 GB RAM',
    includedSeats: 30,
    includedContainers: 50,
    storageGB: 2000,
    bandwidthGB: 5000,
    features: [
      '32 vCPU & 128 GB RAM compute pool',
      '2 TB NVMe Multi-Region Replicated Storage',
      'SOC2 Type II & HIPAA Compliance Controls',
      'Role-Based Access Control (RBAC) & Audit Logs',
      '99.95% Financially Backed Uptime SLA',
      '1-Hour Priority Incident Response SLA'
    ]
  },
  enterprise: {
    id: 'enterprise',
    name: 'Enterprise',
    badge: 'Custom Infrastructure',
    tagline: 'For large-scale architectures requiring dedicated cloud isolation and governance.',
    monthlyUSD: 249,
    yearlyUSD: 199,
    annualBilledUSD: 2388,
    savingsUSD: 600,
    specs: 'Custom Dedicated Nodes',
    includedSeats: 100,
    includedContainers: 200,
    storageGB: 10000,
    bandwidthGB: 20000,
    features: [
      'Custom Bare-Metal Dedicated Compute Nodes',
      'Single Sign-On (SAML / Okta / Azure AD)',
      'Dedicated Private VPC Peering & Custom Regions',
      '99.99% Enterprise Uptime SLA',
      'Dedicated Technical Account Manager',
      'Custom BAA & Security Audit Reports'
    ]
  }
};

const ADDONS_DATABASE = [
  {
    id: 'dedicated_ip',
    name: 'Dedicated Static IPv4',
    description: 'Reserved clean static IPv4 addresses for whitelist firewalls and mail relays.',
    priceMonthlyUSD: 15,
    unit: 'per IP'
  },
  {
    id: 'daily_snapshots',
    name: 'Daily Automated Snapshots',
    description: 'Automated 1-click snapshots with 30-day point-in-time recovery vault.',
    priceMonthlyUSD: 10,
    unit: 'per cluster'
  },
  {
    id: 'edge_cdn',
    name: 'Global Edge Anycast CDN',
    description: '300+ Edge points of presence with Layer 7 DDoS mitigation and Brotli compression.',
    priceMonthlyUSD: 25,
    unit: 'per domain'
  },
  {
    id: 'soc2_vault',
    name: 'SOC2 Compliance Vault',
    description: 'Immutable audit logs, KMS key management, and cryptographic evidence exports.',
    priceMonthlyUSD: 50,
    unit: 'per workspace'
  },
  {
    id: 'phone_sla',
    name: '24/7 Dedicated SRE Phone SLA',
    description: 'Direct phone line and dedicated Slack channel with 15-minute P1 incident SLA.',
    priceMonthlyUSD: 99,
    unit: 'per org'
  }
];

const PROMO_COUPONS = {
  CLOUD20: { code: 'CLOUD20', discount: 0.20, description: '20% Developer Launch Discount' },
  STARTUP50: { code: 'STARTUP50', discount: 0.50, description: '50% Early-Stage Startup Grant' },
  STUDENT: { code: 'STUDENT', discount: 0.30, description: '30% Education & Student Discount' },
  ANNUALPLUS: { code: 'ANNUALPLUS', discount: 0.15, description: 'Extra 15% Annual Retention Credit' }
};

const REGIONAL_TAX_RATES = {
  US: { name: 'United States', rate: 0.00, label: 'Sales Tax (0%)' },
  EU: { name: 'European Union (VAT)', rate: 0.20, label: 'Standard VAT (20%)' },
  UK: { name: 'United Kingdom (VAT)', rate: 0.20, label: 'UK VAT (20%)' },
  IN: { name: 'India (GST)', rate: 0.18, label: 'Goods & Services Tax GST (18%)' }
};

const CURRENCIES = {
  USD: { symbol: '$', rate: 1.0, name: 'US Dollar' },
  EUR: { symbol: '€', rate: 0.92, name: 'Euro' },
  GBP: { symbol: '£', rate: 0.79, name: 'British Pound' },
  INR: { symbol: '₹', rate: 83.5, name: 'Indian Rupee' }
};

// ----------------------------------------------------------------------------
// MIME Type Map
// ----------------------------------------------------------------------------
const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon'
};

// Helper: Read JSON payload from request
function getRequestBody(req) {
  return new Promise((resolve, reject) => {
    let body = '';
    req.on('data', chunk => {
      body += chunk.toString();
      if (body.length > 1e6) {
        req.connection.destroy();
        reject(new Error('Payload too large'));
      }
    });
    req.on('end', () => {
      try {
        resolve(body ? JSON.parse(body) : {});
      } catch (err) {
        resolve({});
      }
    });
    req.on('error', reject);
  });
}

// Helper: JSON Response
function sendJSON(res, statusCode, data) {
  res.writeHead(statusCode, {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type'
  });
  res.end(JSON.stringify(data, null, 2));
}

// Helper: Load/Save Subscription Data
function readSubscriptions() {
  try {
    return JSON.parse(fs.readFileSync(SUBSCRIPTIONS_FILE, 'utf8'));
  } catch (err) {
    return { activeUser: {}, orders: [] };
  }
}

function writeSubscriptions(data) {
  fs.writeFileSync(SUBSCRIPTIONS_FILE, JSON.stringify(data, null, 2));
}

// ----------------------------------------------------------------------------
// HTTP Request Dispatcher
// ----------------------------------------------------------------------------
const server = http.createServer(async (req, res) => {
  const parsedUrl = url.parse(req.url, true);
  const pathname = parsedUrl.pathname;

  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    res.writeHead(204, {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type'
    });
    res.end();
    return;
  }

  // --------------------------------------------------------------------------
  // REST API Routes
  // --------------------------------------------------------------------------

  // GET /api/plans
  if (req.method === 'GET' && pathname === '/api/plans') {
    return sendJSON(res, 200, {
      status: 'success',
      plans: PLANS_DATABASE,
      updatedAt: new Date().toISOString()
    });
  }

  // GET /api/addons
  if (req.method === 'GET' && pathname === '/api/addons') {
    return sendJSON(res, 200, {
      status: 'success',
      addons: ADDONS_DATABASE
    });
  }

  // GET /api/currencies
  if (req.method === 'GET' && pathname === '/api/currencies') {
    return sendJSON(res, 200, {
      status: 'success',
      currencies: CURRENCIES,
      taxRates: REGIONAL_TAX_RATES
    });
  }

  // GET /api/subscriptions/active
  if (req.method === 'GET' && pathname === '/api/subscriptions/active') {
    const data = readSubscriptions();
    return sendJSON(res, 200, {
      status: 'success',
      activeUser: data.activeUser,
      recentOrders: data.orders.slice(-5)
    });
  }

  // POST /api/coupons/validate
  if (req.method === 'POST' && pathname === '/api/coupons/validate') {
    const body = await getRequestBody(req);
    const code = (body.code || '').trim().toUpperCase();

    if (PROMO_COUPONS[code]) {
      const coupon = PROMO_COUPONS[code];
      return sendJSON(res, 200, {
        valid: true,
        code: coupon.code,
        discountPercentage: Math.round(coupon.discount * 100),
        discountDecimal: coupon.discount,
        description: coupon.description,
        message: `Promotion code ${coupon.code} applied! ${Math.round(coupon.discount * 100)}% off.`
      });
    } else {
      return sendJSON(res, 400, {
        valid: false,
        message: 'Invalid or expired promotional code. Try CLOUD20 or STARTUP50.'
      });
    }
  }

  // POST /api/tax/calculate
  if (req.method === 'POST' && pathname === '/api/tax/calculate') {
    const body = await getRequestBody(req);
    const region = body.region || 'US';
    const subtotalUSD = parseFloat(body.subtotalUSD) || 0;
    const taxInfo = REGIONAL_TAX_RATES[region] || REGIONAL_TAX_RATES.US;
    const taxAmountUSD = subtotalUSD * taxInfo.rate;
    const totalUSD = subtotalUSD + taxAmountUSD;

    return sendJSON(res, 200, {
      region: region,
      regionName: taxInfo.name,
      taxLabel: taxInfo.label,
      taxRate: taxInfo.rate,
      subtotalUSD: Math.round(subtotalUSD * 100) / 100,
      taxAmountUSD: Math.round(taxAmountUSD * 100) / 100,
      totalUSD: Math.round(totalUSD * 100) / 100
    });
  }

  // POST /api/checkout/create-subscription
  if (req.method === 'POST' && pathname === '/api/checkout/create-subscription') {
    const body = await getRequestBody(req);
    const planId = body.planId || 'pro';
    const billingCycle = body.billingCycle === 'monthly' ? 'monthly' : 'yearly';
    const selectedAddonIds = Array.isArray(body.addons) ? body.addons : [];
    const couponCode = (body.couponCode || '').trim().toUpperCase();
    const region = body.region || 'US';
    const currency = body.currency || 'USD';

    const plan = PLANS_DATABASE[planId] || PLANS_DATABASE.pro;
    const curr = CURRENCIES[currency] || CURRENCIES.USD;
    const taxInfo = REGIONAL_TAX_RATES[region] || REGIONAL_TAX_RATES.US;

    // Base price
    const basePlanUSD = billingCycle === 'yearly' ? plan.annualBilledUSD : plan.monthlyUSD;

    // Addons cost
    let addonsTotalUSD = 0;
    const appliedAddons = [];
    selectedAddonIds.forEach(addonId => {
      const addon = ADDONS_DATABASE.find(a => a.id === addonId);
      if (addon) {
        const addonCost = billingCycle === 'yearly' ? addon.priceMonthlyUSD * 12 : addon.priceMonthlyUSD;
        addonsTotalUSD += addonCost;
        appliedAddons.push({
          id: addon.id,
          name: addon.name,
          costUSD: addonCost
        });
      }
    });

    const grossSubtotalUSD = basePlanUSD + addonsTotalUSD;

    // Coupon discount
    let discountUSD = 0;
    let appliedCoupon = null;
    if (couponCode && PROMO_COUPONS[couponCode]) {
      appliedCoupon = PROMO_COUPONS[couponCode];
      discountUSD = grossSubtotalUSD * appliedCoupon.discount;
    }

    // Proration Credit simulation (simulated upgrade from starter)
    const db = readSubscriptions();
    let prorationCreditUSD = 0;
    if (db.activeUser && db.activeUser.currentPlanId === 'starter' && planId !== 'starter') {
      prorationCreditUSD = 7.20; // 18 unused days of starter credited
    }

    const netSubtotalUSD = Math.max(0, grossSubtotalUSD - discountUSD - prorationCreditUSD);
    const taxAmountUSD = netSubtotalUSD * taxInfo.rate;
    const grandTotalUSD = netSubtotalUSD + taxAmountUSD;

    // Order record
    const invoiceId = `INV-${new Date().getFullYear()}-${Math.floor(100000 + Math.random() * 900000)}`;
    const newOrder = {
      invoiceId: invoiceId,
      timestamp: new Date().toISOString(),
      planId: plan.id,
      planName: plan.name,
      billingCycle: billingCycle,
      paymentMethod: body.paymentMethod || 'card',
      currency: currency,
      exchangeRate: curr.rate,
      grossSubtotalUSD: grossSubtotalUSD,
      discountUSD: discountUSD,
      couponApplied: appliedCoupon ? appliedCoupon.code : null,
      prorationCreditUSD: prorationCreditUSD,
      netSubtotalUSD: netSubtotalUSD,
      taxAmountUSD: taxAmountUSD,
      taxRate: taxInfo.rate,
      grandTotalUSD: grandTotalUSD,
      grandTotalConverted: Math.round(grandTotalUSD * curr.rate),
      addons: appliedAddons,
      status: 'ACTIVE_TRIAL',
      trialEndsAt: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString()
    };

    // Update active user state
    db.activeUser = {
      userId: db.activeUser.userId,
      email: body.email || 'developer@cloudteam.org',
      currentPlanId: plan.id,
      planName: plan.name,
      billingCycle: billingCycle,
      basePriceUSD: billingCycle === 'yearly' ? plan.yearlyUSD : plan.monthlyUSD,
      renewalDate: new Date(Date.now() + (billingCycle === 'yearly' ? 365 : 30) * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      activeContainers: plan.includedContainers,
      developerSeats: plan.includedSeats
    };
    db.orders.push(newOrder);
    writeSubscriptions(db);

    return sendJSON(res, 201, {
      status: 'success',
      order: newOrder,
      message: `Successfully provisioned ${plan.name} plan on ${billingCycle} cadence.`
    });
  }

  // POST /api/enterprise/quote
  if (req.method === 'POST' && pathname === '/api/enterprise/quote') {
    const body = await getRequestBody(req);
    const quoteId = `QUOTE-ENT-${Math.floor(10000 + Math.random() * 90000)}`;

    const quoteRecord = {
      quoteId: quoteId,
      timestamp: new Date().toISOString(),
      company: body.companyName || 'Enterprise Architecture Corp',
      contactEmail: body.contactEmail || 'lead.architect@enterprise.org',
      workloadType: body.workloadType || 'Kubernetes & Stateful Containers',
      selectedRegions: body.regions || ['US-East', 'EU-Frankfurt'],
      complianceNeeds: body.compliance || ['SOC2 Type II', 'HIPAA'],
      estimatedMonthlyUSD: 1490,
      slaTier: '99.99% Financially Backed SLA with 15-Minute Dedicated SRE Response',
      status: 'SCOPED_PROPOSAL'
    };

    return sendJSON(res, 200, {
      status: 'success',
      quote: quoteRecord,
      message: `Enterprise quote ${quoteId} generated successfully.`
    });
  }

  // GET /api/invoices/:id
  if (req.method === 'GET' && pathname.startsWith('/api/invoices/')) {
    const invoiceId = pathname.replace('/api/invoices/', '').split('?')[0];
    const db = readSubscriptions();
    let order = db.orders.find(o => o.invoiceId === invoiceId);

    // Fallback: synthesize a placeholder order from the invoice ID
    // (occurs when checkout used the client-side offline fallback path)
    if (!order) {
      const fallbackOrder = db.orders[db.orders.length - 1];
      order = fallbackOrder ? { ...fallbackOrder, invoiceId } : {
        invoiceId,
        timestamp: new Date().toISOString(),
        planId: 'pro',
        planName: 'Pro Team',
        billingCycle: 'yearly',
        paymentMethod: 'card',
        currency: 'USD',
        exchangeRate: 1,
        grossSubtotalUSD: 468,
        discountUSD: 0,
        couponApplied: null,
        prorationCreditUSD: 7.20,
        netSubtotalUSD: 460.80,
        taxAmountUSD: 0,
        taxRate: 0,
        grandTotalUSD: 460.80,
        grandTotalConverted: 460.80,
        addons: [],
        status: 'ACTIVE_TRIAL',
        trialEndsAt: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString()
      };
    }

    const html = generateInvoiceHTML(order);
    res.writeHead(200, {
      'Content-Type': 'text/html; charset=utf-8',
      'Access-Control-Allow-Origin': '*'
    });
    return res.end(html);
  }

  // --------------------------------------------------------------------------
  // Static File Serving
  // --------------------------------------------------------------------------
  let filePath = path.join(__dirname, pathname === '/' ? 'index.html' : pathname);
  const extname = String(path.extname(filePath)).toLowerCase();
  const contentType = MIME_TYPES[extname] || 'application/octet-stream';

  fs.readFile(filePath, (error, content) => {
    if (error) {
      if (error.code === 'ENOENT') {
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end('404 Not Found');
      } else {
        res.writeHead(500);
        res.end(`Server Error: ${error.code}`);
      }
    } else {
      res.writeHead(200, { 'Content-Type': contentType });
      res.end(content, 'utf-8');
    }
  });
});

function generateInvoiceHTML(order) {
  const isTrial = order.status === 'ACTIVE_TRIAL' || order.isTrial;
  const renewalDate = order.trialEndsAt ? new Date(order.trialEndsAt).toLocaleDateString() : new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toLocaleDateString();

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>CloudDock Official Statement — ${order.invoiceId}</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; color: #0f172a; margin: 0; padding: 40px; background: #fdf6ef; }
    .invoice-card { max-width: 760px; margin: 0 auto; background: #ffffff; padding: 48px; border-radius: 8px; border: 1px solid #f0dece; box-shadow: 0 4px 12px rgba(120,60,20,0.07); }
    .header-row { display: flex; justify-content: space-between; border-bottom: 2px solid #1c0f07; padding-bottom: 24px; margin-bottom: 32px; }
    .brand-title { font-size: 24px; font-weight: 800; color: #ea580c; }
    .meta-col { text-align: right; font-size: 14px; color: #9a6040; }
    .invoice-num { font-size: 18px; font-weight: 700; color: #1c0f07; margin-bottom: 4px; }
    .info-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 32px; margin-bottom: 32px; font-size: 14px; }
    .info-block h4 { margin: 0 0 8px 0; font-size: 12px; text-transform: uppercase; letter-spacing: 0.05em; color: #9a6040; }
    table { width: 100%; border-collapse: collapse; margin-bottom: 32px; font-size: 14px; }
    th { text-align: left; background: #faeee0; padding: 12px 16px; border-bottom: 1px solid #e4c8a8; font-weight: 600; }
    td { padding: 12px 16px; border-bottom: 1px solid #f0dece; }
    .total-table { width: 320px; margin-left: auto; margin-bottom: 32px; }
    .total-table td { padding: 8px 12px; border: none; }
    .grand-total { font-size: 18px; font-weight: 800; color: #ea580c; border-top: 2px solid #1c0f07 !important; }
    .print-btn { background: linear-gradient(135deg, #f97316, #ea580c, #c2410c); color: #fff; padding: 10px 20px; border-radius: 6px; border: none; cursor: pointer; font-weight: 600; }
    @media print { .no-print { display: none; } body { padding: 0; background: #fff; } .invoice-card { border: none; box-shadow: none; padding: 0; } }
  </style>
</head>
<body>
  <div class="invoice-card">
    <div class="header-row">
      <div>
        <div class="brand-title">CloudDock Platform, Inc.</div>
        <div style="font-size:13px; color:#64748b; margin-top:4px;">Developer Cloud Infrastructure & Compute Engine</div>
      </div>
      <div class="meta-col">
        <div class="invoice-num">${order.invoiceId}</div>
        <div>Date: ${new Date(order.timestamp).toLocaleDateString()}</div>
        <div>Status: <strong style="color:${isTrial ? '#059669' : '#10b981'};">${isTrial ? 'ACTIVE 14-DAY TRIAL ($0.00)' : 'PAID / ACTIVE'}</strong></div>
      </div>
    </div>

    <div class="info-grid">
      <div class="info-block">
        <h4>Billed From</h4>
        <strong>CloudDock Platform, Inc.</strong><br>
        548 Market Street, Suite 9200<br>
        San Francisco, CA 94104<br>
        Tax ID: US-EIN-94-3829104
      </div>
      <div class="info-block">
        <h4>Billed To</h4>
        <strong>${order.paymentMethod === 'invoice' ? 'Corporate Engineering Account' : 'Subscriber'}</strong><br>
        Payment Method: ${(order.paymentMethod || 'card').toUpperCase()}<br>
        Currency: ${order.currency || 'USD'} (Benchmark USD)<br>
        Subscription ID: SUB-${order.invoiceId.replace('INV-', '')}
      </div>
    </div>

    <table>
      <thead>
        <tr>
          <th>Description</th>
          <th>Cadence</th>
          <th style="text-align:right;">Subtotal (USD)</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td><strong>${order.planName || 'Cloud Compute Tier'} Plan</strong><br><span style="font-size:12px; color:#64748b;">Cloud compute quotas & automated backups</span></td>
          <td>${(order.billingCycle || 'yearly').toUpperCase()}</td>
          <td style="text-align:right;">$${(Number(order.grossSubtotalUSD) || 0).toFixed(2)}</td>
        </tr>
        ${Array.isArray(order.addons) && order.addons.length > 0 ? order.addons.map(a => `
        <tr>
          <td><strong>${a.name || 'Modular Add-on'}</strong><br><span style="font-size:12px; color:#64748b;">Provisioned compute expansion</span></td>
          <td>${(order.billingCycle || 'yearly').toUpperCase()}</td>
          <td style="text-align:right;">$${(Number(a.costUSD) || 0).toFixed(2)}</td>
        </tr>`).join('') : ''}
        ${Number(order.discountUSD) > 0 ? `
        <tr>
          <td style="color:#f59e0b;"><strong>Promotional Discount (${order.couponApplied || 'PROMO'})</strong></td>
          <td>Promo</td>
          <td style="text-align:right; color:#f59e0b;">-$${(Number(order.discountUSD) || 0).toFixed(2)}</td>
        </tr>` : ''}
        ${Number(order.prorationCreditUSD) > 0 ? `
        <tr>
          <td style="color:#ea580c;"><strong>Proration Balance Credit</strong> (Previous Developer Tier)</td>
          <td>Proration</td>
          <td style="text-align:right; color:#ea580c;">-$${(Number(order.prorationCreditUSD) || 0).toFixed(2)}</td>
        </tr>` : ''}
        ${isTrial ? `
        <tr style="background:#f0fdf4; color:#059669; font-weight:600;">
          <td><strong>14-Day Evaluation Trial Waiver (100% off today)</strong><br><span style="font-size:12px; color:#166534;">Zero payment charged today; full cloud capacity provisioned</span></td>
          <td>TRIAL</td>
          <td style="text-align:right; color:#059669;">-$${(Number(order.grandTotalUSD) || 0).toFixed(2)}</td>
        </tr>` : ''}
      </tbody>
    </table>

    <table class="total-table">
      <tr>
        <td>Plan Commitment:</td>
        <td style="text-align:right; font-weight:600;">$${(Number(order.grandTotalUSD) || 0).toFixed(2)}</td>
      </tr>
      ${isTrial ? `
      <tr>
        <td>Trial Waiver:</td>
        <td style="text-align:right; color:#059669; font-weight:600;">-$${(Number(order.grandTotalUSD) || 0).toFixed(2)}</td>
      </tr>
      <tr class="grand-total" style="color:#059669 !important;">
        <td>Total Charged Today:</td>
        <td style="text-align:right;">$0.00</td>
      </tr>
      <tr>
        <td colspan="2" style="font-size:12px; color:#64748b; padding-top:6px; text-align:right;">
          Scheduled billing of <strong>$${(Number(order.grandTotalUSD) || 0).toFixed(2)}</strong> starts on <strong>${renewalDate}</strong>
        </td>
      </tr>` : `
      <tr class="grand-total">
        <td>Total Paid:</td>
        <td style="text-align:right;">$${(Number(order.grandTotalUSD) || 0).toFixed(2)}</td>
      </tr>`}
    </table>

    <div style="border-top:1px solid #e2e8f0; padding-top:24px; display:flex; justify-content:space-between; align-items:center;">
      <span style="font-size:12px; color:#64748b;">
        ${isTrial ? `Official Trial Statement: $0.00 charged today. 14-day zero-risk trial active. Regular billing starts ${renewalDate}.` : `Thank you for building with CloudDock. 14-day money-back guarantee.`}
      </span>
      <button class="print-btn no-print" onclick="window.print()">Print Official Invoice</button>
    </div>
  </div>
</body>
</html>`;
}

// ----------------------------------------------------------------------------
// Start Server
// ----------------------------------------------------------------------------
server.listen(PORT, () => {
  console.log(`CloudDock Billing Backend running on http://localhost:${PORT}`);
});
