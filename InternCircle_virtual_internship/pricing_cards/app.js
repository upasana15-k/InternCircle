/**
 * CloudDock — Developer Cloud & Infrastructure Platform
 * Production Frontend Client & REST API Integration Engine
 * Author: Upasana Kudape (InternCircle Virtual Internship)
 */

// ============================================================================
// 1. Client State
// ============================================================================
const state = {
  isYearly: true,
  currency: 'USD',
  region: 'US',
  theme: 'dark',
  couponApplied: null,
  couponDiscountDecimal: 0,
  activeAccount: {
    planId: 'starter',
    planName: 'Developer',
    unusedDaysCreditUSD: 7.20
  },
  selectedPlan: {
    id: 'pro',
    title: 'Pro Team',
    basePriceMonthlyUSD: 49,
    basePriceYearlyUSD: 39,
    annualBilledUSD: 468,
    specs: '8 vCPU / 32 GB RAM'
  },
  selectedAddons: new Set(),
  calculator: {
    seats: 10,
    containers: 15
  }
};

// Currencies & Regional Tax Rates
const CURRENCIES = {
  USD: { symbol: '$', rate: 1.0 },
  EUR: { symbol: '€', rate: 0.92 },
  GBP: { symbol: '£', rate: 0.79 },
  INR: { symbol: '₹', rate: 83.5 }
};

const REGIONAL_TAX_RATES = {
  US: { name: 'United States', rate: 0.00, label: 'US (0% Tax)' },
  EU: { name: 'European Union', rate: 0.20, label: 'EU (20% VAT)' },
  UK: { name: 'United Kingdom', rate: 0.20, label: 'UK (20% VAT)' },
  IN: { name: 'India', rate: 0.18, label: 'India (18% GST)' }
};

// Platform Tier Definitions (Client Cache & Fallback)
const PLANS_DATA = {
  starter: {
    title: 'Developer',
    monthlyUSD: 15,
    yearlyUSD: 12,
    annualBilledUSD: 144,
    savingsUSD: 36,
    specs: '2 vCPU / 4 GB RAM'
  },
  pro: {
    title: 'Pro Team',
    monthlyUSD: 49,
    yearlyUSD: 39,
    annualBilledUSD: 468,
    savingsUSD: 120,
    specs: '8 vCPU / 32 GB RAM'
  },
  business: {
    title: 'Business',
    monthlyUSD: 99,
    yearlyUSD: 79,
    annualBilledUSD: 948,
    savingsUSD: 240,
    specs: '32 vCPU / 128 GB RAM'
  },
  enterprise: {
    title: 'Enterprise',
    monthlyUSD: 249,
    yearlyUSD: 199,
    annualBilledUSD: 2388,
    savingsUSD: 600,
    specs: 'Custom Dedicated Nodes'
  }
};

// Add-ons Definition
const ADDONS_DATA = {
  dedicated_ip: { name: 'Dedicated Static IPv4', priceMonthlyUSD: 15 },
  daily_snapshots: { name: 'Automated Daily Snapshots', priceMonthlyUSD: 10 },
  edge_cdn: { name: 'Global Anycast Edge CDN', priceMonthlyUSD: 25 },
  soc2_vault: { name: 'SOC2 Compliance Vault', priceMonthlyUSD: 50 }
};

// ============================================================================
// 2. REST API Communication Helper
// ============================================================================
async function apiRequest(endpoint, options = {}) {
  const candidateUrls = [endpoint];
  if (typeof window !== 'undefined' && window.location && window.location.port !== '3000' && window.location.protocol.startsWith('http')) {
    candidateUrls.push(`http://localhost:3000${endpoint}`);
  }

  for (const url of candidateUrls) {
    try {
      const res = await fetch(url, {
        headers: { 'Content-Type': 'application/json' },
        ...options
      });
      if (res.ok) {
        return await res.json();
      }
    } catch (err) {
      // Continue to next candidate URL
    }
  }
  // Graceful offline client fallback
  return null;
}

// ============================================================================
// 3. Billing Cycle Toggle
// ============================================================================
function initBillingToggle() {
  const btnMonthly = document.getElementById('btnMonthlyBilling');
  const btnYearly = document.getElementById('btnYearlyBilling');

  if (!btnMonthly || !btnYearly) return;

  function setBillingCycle(isYearly) {
    state.isYearly = isYearly;
    if (isYearly) {
      btnYearly.classList.add('active');
      btnMonthly.classList.remove('active');
    } else {
      btnMonthly.classList.add('active');
      btnYearly.classList.remove('active');
    }
    updateCardsPricing();
    updateCalculatorOutput();
    updateAddonsSummary();
  }

  btnMonthly.addEventListener('click', () => setBillingCycle(false));
  btnYearly.addEventListener('click', () => setBillingCycle(true));

  setBillingCycle(true);
}

function updateCardsPricing() {
  const curr = CURRENCIES[state.currency];

  // Update Currency Symbols
  document.querySelectorAll('.currency-symbol').forEach(sym => {
    sym.textContent = curr.symbol;
  });

  // Update Card Prices
  Object.keys(PLANS_DATA).forEach(planKey => {
    const card = document.getElementById(`card${capitalize(planKey)}`);
    if (!card) return;

    const data = PLANS_DATA[planKey];
    const priceValEl = card.querySelector('.price-value');
    const captionEl = card.querySelector('.billed-annually-caption');

    const targetUSD = state.isYearly ? data.yearlyUSD : data.monthlyUSD;
    const convertedAmount = Math.round(targetUSD * curr.rate);

    if (priceValEl) {
      priceValEl.classList.remove('animate-swap');
      void priceValEl.offsetWidth; // Trigger reflow
      priceValEl.classList.add('animate-swap');
      priceValEl.textContent = convertedAmount.toLocaleString();
    }

    if (captionEl) {
      if (state.isYearly) {
        const totalYearlyConverted = Math.round(data.annualBilledUSD * curr.rate);
        const savingsConverted = Math.round(data.savingsUSD * curr.rate);
        captionEl.textContent = `Billed ${curr.symbol}${totalYearlyConverted.toLocaleString()} annually (Save ${curr.symbol}${savingsConverted.toLocaleString()})`;
      } else {
        const monthlyTotal = Math.round(data.monthlyUSD * curr.rate);
        captionEl.textContent = `Billed ${curr.symbol}${monthlyTotal.toLocaleString()} monthly`;
      }
    }
  });
}

function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

// ============================================================================
// 4. Modular Add-Ons Manager
// ============================================================================
function initAddonsManager() {
  const checkboxes = document.querySelectorAll('.addon-checkbox');

  checkboxes.forEach(cb => {
    cb.addEventListener('change', (e) => {
      const addonId = e.target.value;
      if (e.target.checked) {
        state.selectedAddons.add(addonId);
      } else {
        state.selectedAddons.delete(addonId);
      }
      updateAddonsSummary();
    });
  });

  updateAddonsSummary();
}

function getAddonsTotalUSD() {
  let total = 0;
  state.selectedAddons.forEach(id => {
    if (ADDONS_DATA[id]) {
      total += ADDONS_DATA[id].priceMonthlyUSD;
    }
  });
  return total;
}

function updateAddonsSummary() {
  const curr = CURRENCIES[state.currency];
  const countEl = document.getElementById('selectedAddonsCount');
  const totalEl = document.getElementById('selectedAddonsTotal');

  const count = state.selectedAddons.size;
  const monthlyUSD = getAddonsTotalUSD();
  const converted = Math.round(monthlyUSD * curr.rate);

  if (countEl) countEl.textContent = `${count} active`;
  if (totalEl) totalEl.textContent = `+${curr.symbol}${converted.toLocaleString()} / mo`;
}

// ============================================================================
// 5. Interactive Infrastructure Cost Calculator
// ============================================================================
function initCalculator() {
  const seatSlider = document.getElementById('seatSlider');
  const computeSlider = document.getElementById('computeSlider');
  const seatDisplay = document.getElementById('seatCountDisplay');
  const computeDisplay = document.getElementById('computeDisplay');
  const configBtn = document.getElementById('calcCustomCheckoutBtn');

  if (!seatSlider || !computeSlider) return;

  function update() {
    state.calculator.seats = parseInt(seatSlider.value, 10);
    state.calculator.containers = parseInt(computeSlider.value, 10);

    seatDisplay.textContent = state.calculator.seats;
    computeDisplay.textContent = state.calculator.containers;

    updateCalculatorOutput();
  }

  seatSlider.addEventListener('input', update);
  computeSlider.addEventListener('input', update);

  if (configBtn) {
    configBtn.addEventListener('click', () => {
      const rec = getRecommendation(state.calculator.seats, state.calculator.containers);
      openCheckoutModal(rec.planKey, `Configured ${rec.planTitle} (${state.calculator.seats} seats, ${state.calculator.containers} containers)`);
    });
  }

  update();
}

function getRecommendation(seats, containers) {
  if (seats <= 3 && containers <= 5) {
    return { planKey: 'starter', planTitle: 'Developer Plan' };
  } else if (seats <= 15 && containers <= 20) {
    return { planKey: 'pro', planTitle: 'Pro Team Plan' };
  } else if (seats <= 40 && containers <= 40) {
    return { planKey: 'business', planTitle: 'Business Plan' };
  } else {
    return { planKey: 'enterprise', planTitle: 'Enterprise Plan' };
  }
}

function updateCalculatorOutput() {
  const curr = CURRENCIES[state.currency];
  const rec = getRecommendation(state.calculator.seats, state.calculator.containers);
  const badge = document.getElementById('calcRecommendedBadge');
  const totalPriceEl = document.getElementById('calcTotalPrice');
  const cycleText = document.getElementById('calcCycleText');
  const savingsAlert = document.getElementById('calcSavingsAlert');
  const baseTierEl = document.getElementById('calcBaseTierPrice');
  const seatAddonEl = document.getElementById('calcSeatAddonPrice');
  const currSym = document.querySelector('.calc-currency-symbol');

  if (!totalPriceEl) return;

  if (currSym) currSym.textContent = curr.symbol;
  if (badge) badge.textContent = `Recommended: ${rec.planTitle}`;

  const planData = PLANS_DATA[rec.planKey];
  const baseUSD = state.isYearly ? planData.yearlyUSD : planData.monthlyUSD;

  const extraSeats = Math.max(0, state.calculator.seats - 5);
  const seatRateUSD = state.isYearly ? 4 : 5;
  const addonSeatsUSD = extraSeats * seatRateUSD;

  const totalMonthlyUSD = baseUSD + addonSeatsUSD;
  const totalConverted = Math.round(totalMonthlyUSD * curr.rate);

  totalPriceEl.textContent = totalConverted.toLocaleString();

  if (state.isYearly) {
    cycleText.textContent = '/mo (annual billing)';
    const annualSavedUSD = Math.round(totalMonthlyUSD * 0.20);
    savingsAlert.textContent = `Includes 20% annual discount (-${curr.symbol}${Math.round(annualSavedUSD * curr.rate)}/mo saved)`;
  } else {
    cycleText.textContent = '/mo (monthly billing)';
    savingsAlert.textContent = 'Switch to annual billing to save 20% upfront';
  }

  baseTierEl.textContent = `${curr.symbol}${Math.round(baseUSD * curr.rate)}/mo`;
  seatAddonEl.textContent = extraSeats > 0 ? `${curr.symbol}${Math.round(addonSeatsUSD * curr.rate)}/mo (${extraSeats} extra)` : 'Included';
}

// ============================================================================
// 6. Specification Matrix Live Search & Category Filtering
// ============================================================================
function initFeatureMatrixControls() {
  const toggleBtn = document.getElementById('toggleMatrixBtn');
  const container = document.getElementById('matrixContainer');
  const searchInput = document.getElementById('matrixSearchInput');
  const filterPills = document.querySelectorAll('.matrix-filter-pills .pill-btn');
  const tableRows = document.querySelectorAll('#matrixTable tbody tr');

  // Toggle Collapse
  if (toggleBtn && container) {
    toggleBtn.addEventListener('click', () => {
      const isCollapsed = container.classList.contains('collapsed');
      if (isCollapsed) {
        container.classList.remove('collapsed');
        toggleBtn.setAttribute('aria-expanded', 'true');
        toggleBtn.querySelector('.toggle-text').textContent = 'Hide Specification Matrix';
      } else {
        container.classList.add('collapsed');
        toggleBtn.setAttribute('aria-expanded', 'false');
        toggleBtn.querySelector('.toggle-text').textContent = 'Show Complete Matrix';
      }
    });
  }

  let activeCategory = 'all';

  function filterTable() {
    const query = (searchInput.value || '').trim().toLowerCase();

    // Auto-expand matrix if user starts searching
    if (query.length > 0 && container && container.classList.contains('collapsed')) {
      container.classList.remove('collapsed');
      if (toggleBtn) {
        toggleBtn.setAttribute('aria-expanded', 'true');
        toggleBtn.querySelector('.toggle-text').textContent = 'Hide Specification Matrix';
      }
    }

    tableRows.forEach(row => {
      const rowCategory = row.getAttribute('data-category');
      const isHeader = row.classList.contains('table-group-header');
      const text = row.textContent.toLowerCase();

      let matchesCategory = activeCategory === 'all' || rowCategory === activeCategory;
      let matchesSearch = query === '' || text.includes(query);

      if (isHeader) {
        // Group header shows if category matches
        row.style.display = (activeCategory === 'all' || rowCategory === activeCategory) ? '' : 'none';
      } else {
        row.style.display = (matchesCategory && matchesSearch) ? '' : 'none';
      }
    });
  }

  if (searchInput) {
    searchInput.addEventListener('input', filterTable);
  }

  filterPills.forEach(pill => {
    pill.addEventListener('click', () => {
      filterPills.forEach(p => p.classList.remove('active'));
      pill.classList.add('active');
      activeCategory = pill.getAttribute('data-filter');
      filterTable();
    });
  });
}

// ============================================================================
// 7. Frequently Asked Questions Accordion
// ============================================================================
function initFAQAccordion() {
  const faqItems = document.querySelectorAll('.faq-item');

  faqItems.forEach(item => {
    const btn = item.querySelector('.faq-question-btn');
    btn.addEventListener('click', () => {
      const isActive = item.classList.contains('active');

      faqItems.forEach(other => {
        other.classList.remove('active');
        other.querySelector('.faq-question-btn').setAttribute('aria-expanded', 'false');
      });

      if (!isActive) {
        item.classList.add('active');
        btn.setAttribute('aria-expanded', 'true');
      }
    });
  });
}

// ============================================================================
// 8. Currency, Region & Theme Controls
// ============================================================================
function initHeaderControls() {
  const currencySelect = document.getElementById('currencySelect');
  const regionSelect = document.getElementById('regionSelect');
  const themeToggleBtn = document.getElementById('themeToggleBtn');
  const bannerUpgradeBtn = document.getElementById('bannerUpgradeBtn');

  // Load saved preferences
  const savedCurrency = localStorage.getItem('clouddock_currency');
  if (savedCurrency && CURRENCIES[savedCurrency]) {
    state.currency = savedCurrency;
    currencySelect.value = savedCurrency;
  }

  const savedRegion = localStorage.getItem('clouddock_region');
  if (savedRegion && REGIONAL_TAX_RATES[savedRegion]) {
    state.region = savedRegion;
    regionSelect.value = savedRegion;
  }

  const savedTheme = localStorage.getItem('clouddock_theme') || 'dark';
  applyTheme(savedTheme);

  // Currency Selector
  currencySelect.addEventListener('change', (e) => {
    state.currency = e.target.value;
    localStorage.setItem('clouddock_currency', state.currency);
    updateCardsPricing();
    updateCalculatorOutput();
    updateAddonsSummary();
    if (document.getElementById('checkoutModal').style.display !== 'none') {
      updateCheckoutModalCalculations();
    }
    showToast(`Currency updated to ${state.currency} (${CURRENCIES[state.currency].symbol})`);
  });

  // Region Selector
  regionSelect.addEventListener('change', (e) => {
    state.region = e.target.value;
    localStorage.setItem('clouddock_region', state.region);
    if (document.getElementById('checkoutModal').style.display !== 'none') {
      updateCheckoutModalCalculations();
    }
    showToast(`Billing region updated: ${REGIONAL_TAX_RATES[state.region].name}`);
  });

  // Theme Toggle
  themeToggleBtn.addEventListener('click', () => {
    const nextTheme = state.theme === 'dark' ? 'light' : 'dark';
    applyTheme(nextTheme);
    showToast(`Switched to ${nextTheme === 'dark' ? 'Dark Slate' : 'Clean Light'} theme`);
  });

  // Banner Upgrade Shortcut
  if (bannerUpgradeBtn) {
    bannerUpgradeBtn.addEventListener('click', () => {
      openCheckoutModal('pro', 'Pro Team');
    });
  }
}

function applyTheme(theme) {
  state.theme = theme;
  document.documentElement.setAttribute('data-theme', theme);
  localStorage.setItem('clouddock_theme', theme);

  const sunIcon = document.querySelector('.theme-sun-icon');
  const moonIcon = document.querySelector('.theme-moon-icon');

  if (theme === 'light') {
    if (sunIcon) sunIcon.style.display = 'none';
    if (moonIcon) moonIcon.style.display = 'block';
  } else {
    if (sunIcon) sunIcon.style.display = 'block';
    if (moonIcon) moonIcon.style.display = 'none';
  }
}

// ============================================================================
// 9. Plan Selection & REST Checkout Integration
// ============================================================================
function initPlanSelection() {
  const selectBtns = document.querySelectorAll('.plan-select-btn');
  const modal = document.getElementById('checkoutModal');
  const closeBtn = document.getElementById('modalCloseBtn');
  const applyCouponBtn = document.getElementById('applyCouponBtn');
  const couponInput = document.getElementById('couponInput');
  const confirmBtn = document.getElementById('modalConfirmBtn');

  // Enterprise Scoping Modal Elements
  const openEntBtn = document.getElementById('openEnterpriseModalBtn');
  const entModal = document.getElementById('enterpriseModal');
  const entCloseBtn = document.getElementById('entModalCloseBtn');
  const entForm = document.getElementById('enterpriseScopeForm');

  // Invoice Success Modal Elements
  const invoiceModal = document.getElementById('invoiceSuccessModal');
  const closeInvoiceBtn = document.getElementById('closeInvoiceModalBtn');

  selectBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const planId = btn.getAttribute('data-plan-id') || 'pro';
      const planTitle = btn.getAttribute('data-plan-title') || 'Pro Team';
      openCheckoutModal(planId, planTitle);
    });
  });

  if (closeBtn) {
    closeBtn.addEventListener('click', closeCheckoutModal);
  }

  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeCheckoutModal();
  });

  // Enterprise Modal Triggers
  if (openEntBtn && entModal) {
    openEntBtn.addEventListener('click', () => {
      entModal.style.display = 'flex';
      document.body.style.overflow = 'hidden';
    });

    if (entCloseBtn) {
      entCloseBtn.addEventListener('click', () => {
        entModal.style.display = 'none';
        document.body.style.overflow = '';
      });
    }

    entModal.addEventListener('click', (e) => {
      if (e.target === entModal) {
        entModal.style.display = 'none';
        document.body.style.overflow = '';
      }
    });

    if (entForm) {
      entForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const company = document.getElementById('entCompanyName').value;
        const workload = document.getElementById('entWorkloadSelect').value;

        // Call backend API /api/enterprise/quote
        const res = await apiRequest('/api/enterprise/quote', {
          method: 'POST',
          body: JSON.stringify({ companyName: company, workloadType: workload })
        });

        const quoteId = res ? res.quote.quoteId : `QUOTE-ENT-${Math.floor(10000 + Math.random() * 90000)}`;

        entModal.style.display = 'none';
        document.body.style.overflow = '';
        showToast(`Enterprise proposal ${quoteId} generated for ${company}! Our solutions team will contact you.`, 5000);
      });
    }
  }

  // Invoice Modal Dismiss
  if (closeInvoiceBtn && invoiceModal) {
    closeInvoiceBtn.addEventListener('click', () => {
      invoiceModal.style.display = 'none';
      document.body.style.overflow = '';
    });
  }

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      if (modal.style.display !== 'none') closeCheckoutModal();
      if (entModal && entModal.style.display !== 'none') {
        entModal.style.display = 'none';
        document.body.style.overflow = '';
      }
    }
  });

  // Coupon Validation via REST Backend API
  if (applyCouponBtn && couponInput) {
    applyCouponBtn.addEventListener('click', async () => {
      const code = couponInput.value.trim().toUpperCase();
      const msg = document.getElementById('couponMessage');

      if (!code) {
        msg.textContent = 'Please enter a promotion code.';
        msg.style.color = 'var(--accent-amber)';
        return;
      }

      // Try Backend validation endpoint
      const res = await apiRequest('/api/coupons/validate', {
        method: 'POST',
        body: JSON.stringify({ code })
      });

      if (res && res.valid) {
        state.couponApplied = res.code;
        state.couponDiscountDecimal = res.discountDecimal;
        msg.textContent = res.message;
        msg.style.color = 'var(--accent-emerald)';
        updateCheckoutModalCalculations();
      } else if (code === 'CLOUD20') {
        // Local client fallback
        state.couponApplied = 'CLOUD20';
        state.couponDiscountDecimal = 0.20;
        msg.textContent = 'Coupon CLOUD20 applied: 20% discount activated.';
        msg.style.color = 'var(--accent-emerald)';
        updateCheckoutModalCalculations();
      } else {
        msg.textContent = res ? res.message : 'Invalid code. Try "CLOUD20" or "STARTUP50".';
        msg.style.color = 'var(--accent-rose)';
      }
    });
  }

  // Payment Method Radios (scoped to .payment-options-grid)
  const paymentLabels = document.querySelectorAll('.payment-options-grid .payment-radio-label');
  const paymentSubforms = document.querySelectorAll('.payment-subform');
  paymentLabels.forEach(label => {
    label.addEventListener('click', () => {
      paymentLabels.forEach(l => l.classList.remove('active'));
      label.classList.add('active');
      const radio = label.querySelector('input');
      if (radio) radio.checked = true;

      // Switch subform view
      const targetId = label.getAttribute('data-target');
      paymentSubforms.forEach(sub => {
        sub.style.display = sub.id === targetId ? 'block' : 'none';
      });
    });
  });

  // Activation Mode Options (14-Day Free Trial vs Simulate Instant Payment)
  const modeLabels = document.querySelectorAll('.checkout-mode-option');
  modeLabels.forEach(label => {
    label.addEventListener('click', () => {
      modeLabels.forEach(l => {
        l.classList.remove('active');
        l.style.borderColor = 'var(--border-subtle)';
        l.style.background = 'var(--bg-page-secondary)';
      });
      label.classList.add('active');
      label.style.borderColor = 'var(--accent-emerald)';
      label.style.background = 'rgba(16,185,129,0.08)';
      const radio = label.querySelector('input');
      if (radio) radio.checked = true;
      updateCheckoutModalCalculations();
    });
  });

  // Confirm Trial / Order via 3D-Secure Gateway or Direct Invoice
  if (confirmBtn) {
    confirmBtn.addEventListener('click', () => {
      const paymentMethod = document.querySelector('input[name="paymentMethod"]:checked')?.value || 'card';
      const checkoutMode = document.querySelector('input[name="checkoutMode"]:checked')?.value || 'trial';

      closeCheckoutModal();

      if (paymentMethod === 'card') {
        // Trigger Realistic 3D-Secure Bank Gateway Authentication Flow
        launchGatewayFlow(paymentMethod, checkoutMode);
      } else {
        // Direct Corporate PO or Wire Transfer Order Confirmation
        completeSubscriptionCheckout(paymentMethod, checkoutMode);
      }
    });
  }

  // Setup live card formatting and brand detection
  setupCardInputFormatting();
}

let gatewayTimerInterval = null;

function setupCardInputFormatting() {
  const cardInput = document.getElementById('cardNumberInput');
  const brandBadge = document.getElementById('cardBrandBadge');
  const expiryInput = document.getElementById('cardExpiryInput');
  const cvcInput = document.getElementById('cardCvcInput');

  if (cardInput) {
    cardInput.addEventListener('input', (e) => {
      let val = e.target.value.replace(/\D/g, '').substring(0, 16);
      let brand = 'VISA';
      let color = 'var(--accent-blue)';
      
      if (val.startsWith('4')) {
        brand = 'VISA';
        color = '#2563eb';
      } else if (/^5[1-5]|^2[2-7]/.test(val)) {
        brand = 'MASTERCARD';
        color = '#ea580c';
      } else if (/^3[47]/.test(val)) {
        brand = 'AMEX';
        color = '#0284c7';
      } else if (/^6011|^65/.test(val)) {
        brand = 'DISCOVER';
        color = '#f59e0b';
      } else if (/^60|^65|^81|^508/.test(val)) {
        brand = 'RUPAY';
        color = '#10b981';
      }

      if (brandBadge) {
        brandBadge.textContent = brand;
        brandBadge.style.color = color;
      }

      // Format in blocks of 4 digits
      const formatted = val.match(/.{1,4}/g)?.join(' ') || val;
      e.target.value = formatted;
    });
  }

  if (expiryInput) {
    expiryInput.addEventListener('input', (e) => {
      let val = e.target.value.replace(/\D/g, '').substring(0, 4);
      if (val.length >= 3) {
        e.target.value = val.substring(0, 2) + '/' + val.substring(2);
      } else {
        e.target.value = val;
      }
    });
  }

  if (cvcInput) {
    cvcInput.addEventListener('input', (e) => {
      e.target.value = e.target.value.replace(/\D/g, '').substring(0, 4);
    });
  }
}

function playSuccessPaymentChime() {
  try {
    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    if (!AudioCtx) return;
    const ctx = new AudioCtx();
    const now = ctx.currentTime;
    
    // First tone
    const osc1 = ctx.createOscillator();
    const gain1 = ctx.createGain();
    osc1.type = 'sine';
    osc1.frequency.setValueAtTime(587.33, now); // D5
    gain1.gain.setValueAtTime(0.12, now);
    gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.3);
    osc1.connect(gain1);
    gain1.connect(ctx.destination);
    osc1.start(now);
    osc1.stop(now + 0.3);

    // Second celebratory higher tone
    const osc2 = ctx.createOscillator();
    const gain2 = ctx.createGain();
    osc2.type = 'sine';
    osc2.frequency.setValueAtTime(880, now + 0.12); // A5
    gain2.gain.setValueAtTime(0.16, now + 0.12);
    gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.6);
    osc2.connect(gain2);
    gain2.connect(ctx.destination);
    osc2.start(now + 0.12);
    osc2.stop(now + 0.6);
  } catch (e) {
    // Non-blocking fallback
  }
}

function startGatewayTimer() {
  if (gatewayTimerInterval) clearInterval(gatewayTimerInterval);
  let secondsLeft = 299; // 04:59
  const timerEl = document.getElementById('gatewayTimer');
  if (!timerEl) return;

  const update = () => {
    const m = Math.floor(secondsLeft / 60);
    const s = secondsLeft % 60;
    timerEl.textContent = `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
    if (secondsLeft <= 0) {
      clearInterval(gatewayTimerInterval);
      timerEl.textContent = 'Expired';
    }
    secondsLeft--;
  };

  update();
  gatewayTimerInterval = setInterval(update, 1000);
}

function launchGatewayFlow(paymentMethod, checkoutMode) {
  const isTrial = checkoutMode !== 'pay_now';
  const curr = CURRENCIES[state.currency] || CURRENCIES.USD;
  const modal = document.getElementById('gatewayModal');
  const otpStep = document.getElementById('gatewayOtpStep');
  const procStep = document.getElementById('gatewayProcessingStep');
  const cardMasked = document.getElementById('gatewayCardMasked');
  const authAmount = document.getElementById('gatewayAuthAmount');
  const txnType = document.getElementById('gatewayTxnType');
  const otpInput = document.getElementById('gatewayOtpInput');
  const autoFillBtn = document.getElementById('autoFillOtpBtn');
  const declineBtn = document.getElementById('simulateDeclineBtn');
  const resendBtn = document.getElementById('resendOtpBtn');
  const cancelBtn = document.getElementById('cancelGatewayBtn');
  const submitBtn = document.getElementById('submitGatewayOtpBtn');
  const errorBox = document.getElementById('gatewayOtpError');
  const bankHeader = document.getElementById('gatewayBankHeader');
  const certSubtitle = document.getElementById('gatewayCertSubtitle');
  const cardHolderDisplay = document.getElementById('gatewayCardHolderDisplay');

  if (!modal) return;

  // Reset steps & errors
  otpStep.style.display = 'block';
  procStep.style.display = 'none';
  if (errorBox) {
    errorBox.style.display = 'none';
    errorBox.textContent = '';
  }

  // Read card input and cardholder
  const rawCard = (document.getElementById('cardNumberInput')?.value || '4242').replace(/\D/g, '');
  const last4 = rawCard.slice(-4) || '4242';
  const cardHolder = document.getElementById('cardHolderName')?.value.trim() || 'Alex Rivera';
  
  if (cardMasked) cardMasked.textContent = `•••• •••• •••• ${last4}`;
  if (cardHolderDisplay) cardHolderDisplay.textContent = cardHolder;

  // Dynamic Bank & Scheme branding based on card bin
  if (rawCard.startsWith('4')) {
    if (bankHeader) bankHeader.textContent = 'Chase Bank · 3D-Secure 2.2';
    if (certSubtitle) certSubtitle.textContent = 'Verified by Visa · PCI-DSS Level 1 Vault';
  } else if (/^5[1-5]|^2[2-7]/.test(rawCard)) {
    if (bankHeader) bankHeader.textContent = 'Citibank N.A. · 3D-Secure 2.2';
    if (certSubtitle) certSubtitle.textContent = 'Mastercard Identity Check · 256-bit TLS';
  } else if (/^3[47]/.test(rawCard)) {
    if (bankHeader) bankHeader.textContent = 'American Express SafeKey';
    if (certSubtitle) certSubtitle.textContent = 'Amex Global Secure Vault · 3DS 2.2';
  } else {
    if (bankHeader) bankHeader.textContent = 'Commercial Bank · 3D-Secure 2.2';
    if (certSubtitle) certSubtitle.textContent = 'Card Scheme Protected · Level 1 Vault';
  }

  // Amount
  if (isTrial) {
    if (authAmount) authAmount.textContent = `${curr.symbol}0.00 ${state.currency} (Zero Charge Auth)`;
    if (txnType) txnType.textContent = 'Subscription e-Mandate Verification';
  } else {
    const finalConverted = getCheckoutTotalConverted();
    if (authAmount) authAmount.textContent = `${curr.symbol}${finalConverted.toLocaleString()} ${state.currency} (Instant Charge)`;
    if (txnType) txnType.textContent = 'Immediate Transaction Charge';
  }

  // Pre-fill OTP
  if (otpInput) otpInput.value = '890493';

  // Start live ticking timer
  startGatewayTimer();

  if (autoFillBtn) {
    autoFillBtn.onclick = () => {
      otpInput.value = '890493';
      if (errorBox) errorBox.style.display = 'none';
      showToast('Sandbox test OTP filled: 890493', 2000);
    };
  }

  if (declineBtn) {
    declineBtn.onclick = () => {
      if (errorBox) {
        errorBox.textContent = '⚠️ Bank 3DS Authentication Failed: Issuing bank declined transaction (Simulated: DECLINED_BY_ISSUER). Click Auto-Fill (890493) to succeed.';
        errorBox.style.display = 'block';
      }
      showToast('Simulated bank decline triggered.', 3000);
    };
  }

  if (resendBtn) {
    resendBtn.onclick = () => {
      startGatewayTimer();
      if (errorBox) errorBox.style.display = 'none';
      showToast('📲 New OTP re-dispatched to registered phone device (+1 8942).', 2500);
    };
  }

  if (cancelBtn) {
    cancelBtn.onclick = () => {
      if (gatewayTimerInterval) clearInterval(gatewayTimerInterval);
      modal.style.display = 'none';
      document.body.style.overflow = '';
      showToast('Transaction cancelled by user.', 3000);
    };
  }

  if (submitBtn) {
    submitBtn.onclick = () => {
      const otp = (otpInput?.value || '').trim();
      if (otp.length < 6) {
        if (errorBox) {
          errorBox.textContent = 'Please enter all 6 digits of the authentication OTP.';
          errorBox.style.display = 'block';
        }
        return;
      }
      
      // Check if user entered an incorrect OTP
      if (otp !== '890493' && otp !== '123456') {
        if (errorBox) {
          errorBox.textContent = '❌ Invalid OTP code. For this sandbox test, use code 890493 or click "Auto-Fill".';
          errorBox.style.display = 'block';
        }
        return;
      }

      if (errorBox) errorBox.style.display = 'none';
      if (gatewayTimerInterval) clearInterval(gatewayTimerInterval);
      runGatewayProcessingAnimation(paymentMethod, checkoutMode);
    };
  }

  modal.style.display = 'flex';
  document.body.style.overflow = 'hidden';
}

async function runGatewayProcessingAnimation(paymentMethod, checkoutMode) {
  const otpStep = document.getElementById('gatewayOtpStep');
  const procStep = document.getElementById('gatewayProcessingStep');
  const modal = document.getElementById('gatewayModal');

  otpStep.style.display = 'none';
  procStep.style.display = 'block';

  const s1 = document.getElementById('procStep1');
  const s2 = document.getElementById('procStep2');
  const s3 = document.getElementById('procStep3');
  const s4 = document.getElementById('procStep4');

  const setStep = (el, iconId, isDone, isActive) => {
    if (!el) return;
    el.classList.remove('step-done', 'step-active');
    const icon = document.getElementById(iconId);
    if (isDone) {
      el.classList.add('step-done');
      if (icon) icon.textContent = '✓';
    } else if (isActive) {
      el.classList.add('step-active');
      if (icon) icon.textContent = '●';
    }
  };

  // Step 1: 3D Secure Cryptographic Signature
  setStep(s1, 'stepIcon1', false, true);
  await delay(600);
  setStep(s1, 'stepIcon1', true, false);

  // Step 2: e-Mandate Authorization or Immediate Charge
  setStep(s2, 'stepIcon2', false, true);
  await delay(650);
  setStep(s2, 'stepIcon2', true, false);

  // Step 3: Kubernetes Container Provisioning
  setStep(s3, 'stepIcon3', false, true);
  await delay(650);
  setStep(s3, 'stepIcon3', true, false);

  // Step 4: Invoice Generation & Token Vault Commit
  setStep(s4, 'stepIcon4', false, true);
  await delay(500);
  setStep(s4, 'stepIcon4', true, false);

  await delay(350);

  // Close Gateway Modal
  modal.style.display = 'none';
  document.body.style.overflow = '';

  // Play audio chime
  playSuccessPaymentChime();

  // Execute Subscription Checkout Commit
  await completeSubscriptionCheckout(paymentMethod, checkoutMode);
}

async function completeSubscriptionCheckout(paymentMethod, checkoutMode) {
  // Call backend or client order record
  const res = await apiRequest('/api/checkout/create-subscription', {
    method: 'POST',
    body: JSON.stringify({
      planId: state.selectedPlan.id,
      billingCycle: state.isYearly ? 'yearly' : 'monthly',
      addons: Array.from(state.selectedAddons),
      couponCode: state.couponApplied,
      region: state.region,
      currency: state.currency,
      paymentMethod: paymentMethod,
      checkoutMode: checkoutMode
    })
  });

  const orderData = res && res.order ? res.order : createClientOrderRecord(paymentMethod, checkoutMode);

  showToast(
    orderData.isTrial
      ? '🎉 3D-Secure Verified! 14-Day Free Trial Activated ($0.00 billed).'
      : '🎉 Payment Successful! Test card charged ' + CURRENCIES[orderData.currency]?.symbol + orderData.grandTotalConverted + '.',
    4500
  );

  showInvoiceSuccess(orderData);
}

function getCheckoutTotalConverted() {
  const curr = CURRENCIES[state.currency] || CURRENCIES.USD;
  const taxInfo = REGIONAL_TAX_RATES[state.region] || REGIONAL_TAX_RATES.US;
  const basePlanUSD = state.isYearly ? state.selectedPlan.annualBilledUSD : state.selectedPlan.basePriceMonthlyUSD;
  const monthlyAddonsUSD = getAddonsTotalUSD();
  const cycleAddonsUSD = state.isYearly ? monthlyAddonsUSD * 12 : monthlyAddonsUSD;
  const grossSubtotalUSD = basePlanUSD + cycleAddonsUSD;

  let discountUSD = 0;
  if (state.couponApplied && state.couponDiscountDecimal > 0) {
    discountUSD = grossSubtotalUSD * state.couponDiscountDecimal;
  }

  let prorationCreditUSD = 0;
  if (state.activeAccount.planId === 'starter' && state.selectedPlan.id !== 'starter') {
    prorationCreditUSD = state.activeAccount.unusedDaysCreditUSD;
  }

  const netSubtotalUSD = Math.max(0, grossSubtotalUSD - discountUSD - prorationCreditUSD);
  const taxAmountUSD = netSubtotalUSD * taxInfo.rate;
  const grandTotalUSD = netSubtotalUSD + taxAmountUSD;
  return Math.round(grandTotalUSD * curr.rate);
}

function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function createClientOrderRecord(paymentMethod, checkoutMode = 'trial') {
  const isTrial = checkoutMode !== 'pay_now';
  const curr = CURRENCIES[state.currency] || CURRENCIES.USD;
  const taxInfo = REGIONAL_TAX_RATES[state.region] || REGIONAL_TAX_RATES.US;
  const basePlanUSD = state.isYearly ? state.selectedPlan.annualBilledUSD : state.selectedPlan.basePriceMonthlyUSD;
  const monthlyAddonsUSD = getAddonsTotalUSD();
  const cycleAddonsUSD = state.isYearly ? monthlyAddonsUSD * 12 : monthlyAddonsUSD;
  const grossSubtotalUSD = basePlanUSD + cycleAddonsUSD;

  let discountUSD = 0;
  if (state.couponApplied && state.couponDiscountDecimal > 0) {
    discountUSD = grossSubtotalUSD * state.couponDiscountDecimal;
  }

  let prorationCreditUSD = 0;
  if (state.activeAccount.planId === 'starter' && state.selectedPlan.id !== 'starter') {
    prorationCreditUSD = state.activeAccount.unusedDaysCreditUSD;
  }

  const netSubtotalUSD = Math.max(0, grossSubtotalUSD - discountUSD - prorationCreditUSD);
  const taxAmountUSD = netSubtotalUSD * taxInfo.rate;
  const grandTotalUSD = netSubtotalUSD + taxAmountUSD;
  const grandTotalConverted = Math.round(grandTotalUSD * curr.rate);

  const appliedAddons = [];
  state.selectedAddons.forEach(id => {
    const addon = ADDONS_DATA[id];
    if (addon) {
      appliedAddons.push({
        id,
        name: addon.name,
        costUSD: state.isYearly ? addon.priceMonthlyUSD * 12 : addon.priceMonthlyUSD
      });
    }
  });

  // Extract payment details from form
  const rawCard = (document.getElementById('cardNumberInput')?.value || '4242').replace(/\D/g, '');
  const cardLast4 = rawCard.slice(-4) || '4242';
  const cardHolder = document.getElementById('cardHolderName')?.value.trim() || 'Authorized Subscriber';
  const poNumber = document.getElementById('poNumberInput')?.value.trim() || 'PO-2026-CORP-948';

  let paymentMethodDisplay = `Visa ending in •••• ${cardLast4}`;
  if (paymentMethod === 'invoice') {
    paymentMethodDisplay = `Corporate PO (${poNumber})`;
  } else if (paymentMethod === 'wire') {
    paymentMethodDisplay = 'SWIFT Wire Transfer Remittance';
  }

  const invoiceId = `INV-${new Date().getFullYear()}-${Math.floor(100000 + Math.random() * 900000)}`;

  const orderRecord = {
    invoiceId,
    timestamp: new Date().toISOString(),
    planId: state.selectedPlan.id,
    planName: state.selectedPlan.title,
    billingCycle: state.isYearly ? 'yearly' : 'monthly',
    paymentMethod: paymentMethod || 'card',
    paymentMethodDisplay,
    cardHolder,
    currency: state.currency,
    exchangeRate: curr.rate,
    grossSubtotalUSD,
    discountUSD,
    couponApplied: state.couponApplied,
    prorationCreditUSD,
    netSubtotalUSD,
    taxAmountUSD,
    taxRate: taxInfo.rate,
    taxName: taxInfo.name,
    grandTotalUSD,
    grandTotalConverted,
    addons: appliedAddons,
    isTrial: isTrial,
    amountChargedTodayUSD: isTrial ? 0 : grandTotalUSD,
    amountChargedTodayConverted: isTrial ? 0 : grandTotalConverted,
    status: isTrial ? 'ACTIVE_TRIAL' : 'PAID_IN_FULL',
    trialEndsAt: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString()
  };

  return orderRecord;
}

function showInvoiceSuccess(order) {
  state.currentOrder = order;
  try {
    localStorage.setItem('clouddock_last_order', JSON.stringify(order));
  } catch (e) {}

  const modal = document.getElementById('invoiceSuccessModal');
  const detailsBox = document.getElementById('invoiceDetailsBox');
  const link = document.getElementById('viewPrintInvoiceLink');
  const downloadBtn = document.getElementById('downloadInvoiceBtn');
  const curr = CURRENCIES[order.currency || state.currency] || CURRENCIES.USD;
  const isTrial = order.isTrial !== false && order.status !== 'PAID_IN_FULL';
  const cycleLabel = order.billingCycle === 'yearly' ? '/ yr' : '/ mo';

  if (!modal || !detailsBox) return;

  if (isTrial) {
    detailsBox.innerHTML = `
      <div style="display:flex; justify-content:space-between; margin-bottom:8px;">
        <span style="color:var(--text-muted);">Invoice Reference:</span>
        <strong class="font-mono text-accent">${order.invoiceId}</strong>
      </div>
      <div style="display:flex; justify-content:space-between; margin-bottom:8px;">
        <span style="color:var(--text-muted);">Provisioned Plan:</span>
        <strong>${order.planName} (${order.billingCycle.toUpperCase()})</strong>
      </div>
      <div style="display:flex; justify-content:space-between; margin-bottom:8px;">
        <span style="color:var(--text-muted);">Charged Today:</span>
        <strong class="font-mono" style="color:var(--accent-emerald); font-size:15px;">${curr.symbol}0.00 (Zero Charge Today)</strong>
      </div>
      <div style="display:flex; justify-content:space-between; margin-bottom:8px;">
        <span style="color:var(--text-muted);">Plan Rate After Trial:</span>
        <strong class="font-mono">${curr.symbol}${(order.grandTotalConverted || 0).toLocaleString()} ${cycleLabel}</strong>
      </div>
      <div style="display:flex; justify-content:space-between;">
        <span style="color:var(--text-muted);">Subscription Status:</span>
        <span style="color:var(--accent-emerald); font-weight:600;">Active 14-Day Free Trial (1st bill in 14 days)</span>
      </div>
    `;
  } else {
    detailsBox.innerHTML = `
      <div style="display:flex; justify-content:space-between; margin-bottom:8px;">
        <span style="color:var(--text-muted);">Invoice Reference:</span>
        <strong class="font-mono text-accent">${order.invoiceId}</strong>
      </div>
      <div style="display:flex; justify-content:space-between; margin-bottom:8px;">
        <span style="color:var(--text-muted);">Provisioned Plan:</span>
        <strong>${order.planName} (${order.billingCycle.toUpperCase()})</strong>
      </div>
      <div style="display:flex; justify-content:space-between; margin-bottom:8px;">
        <span style="color:var(--text-muted);">Amount Paid Today:</span>
        <strong class="font-mono" style="color:var(--accent-emerald); font-size:15px;">${curr.symbol}${(order.grandTotalConverted || 0).toLocaleString()}</strong>
      </div>
      <div style="display:flex; justify-content:space-between;">
        <span style="color:var(--text-muted);">Payment Status:</span>
        <span style="color:var(--accent-emerald); font-weight:600;">Paid in Full (Simulated Payment)</span>
      </div>
    `;
  }

  if (link) {
    link.href = `#view-invoice-${order.invoiceId}`;
    link.onclick = (e) => {
      e.preventDefault();
      openInvoiceDocument(order);
    };
  }

  if (downloadBtn) {
    downloadBtn.onclick = (e) => {
      e.preventDefault();
      downloadInvoiceDocument(order);
    };
  }

  modal.style.display = 'flex';
  document.body.style.overflow = 'hidden';
}

function generateClientInvoiceHTML(order) {
  const invoiceId = order.invoiceId || 'INV-2026-890493';
  const issueDate = order.timestamp ? new Date(order.timestamp).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }) : new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  const curr = CURRENCIES[order.currency] || CURRENCIES.USD;
  const isYearly = order.billingCycle === 'yearly';
  const isTrial = order.isTrial !== false && order.status !== 'PAID_IN_FULL';
  const renewalDate = order.trialEndsAt ? new Date(order.trialEndsAt).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }) : new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>CloudDock Official Statement — ${invoiceId}</title>
  <style>
    :root {
      --primary: #ea580c;
      --primary-dark: #c2410c;
      --text-dark: #0f172a;
      --text-muted: #64748b;
      --bg-cream: #fdf6ef;
      --border: #f0dece;
      --card-bg: #ffffff;
    }
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
      color: var(--text-dark);
      background: var(--bg-cream);
      padding: 40px 20px;
      line-height: 1.5;
    }
    .invoice-card {
      max-width: 780px;
      margin: 0 auto;
      background: var(--card-bg);
      padding: 48px;
      border-radius: 12px;
      border: 1px solid var(--border);
      box-shadow: 0 10px 25px rgba(120,60,20,0.06);
    }
    .header-row {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      border-bottom: 2px solid #1c0f07;
      padding-bottom: 24px;
      margin-bottom: 32px;
    }
    .brand-title {
      font-size: 26px;
      font-weight: 800;
      color: var(--primary);
      letter-spacing: -0.02em;
    }
    .brand-subtitle {
      font-size: 13px;
      color: var(--text-muted);
      margin-top: 4px;
    }
    .meta-col {
      text-align: right;
      font-size: 14px;
      color: #9a6040;
    }
    .invoice-num {
      font-size: 18px;
      font-weight: 700;
      color: #1c0f07;
      font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
      margin-bottom: 4px;
    }
    .badge-paid {
      display: inline-block;
      margin-top: 6px;
      padding: 4px 12px;
      border-radius: 999px;
      background: #ecfdf5;
      color: #059669;
      font-size: 12px;
      font-weight: 700;
      letter-spacing: 0.04em;
    }
    .info-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 32px;
      margin-bottom: 32px;
      font-size: 14px;
    }
    .info-block h4 {
      margin: 0 0 8px 0;
      font-size: 11px;
      text-transform: uppercase;
      letter-spacing: 0.08em;
      color: #9a6040;
      font-weight: 700;
    }
    .info-block p {
      color: #334155;
      line-height: 1.6;
    }
    table {
      width: 100%;
      border-collapse: collapse;
      margin-bottom: 32px;
      font-size: 14px;
    }
    th {
      text-align: left;
      background: #faeee0;
      padding: 12px 16px;
      border-bottom: 1px solid #e4c8a8;
      font-weight: 600;
      color: #78350f;
    }
    td {
      padding: 14px 16px;
      border-bottom: 1px solid var(--border);
    }
    .total-table {
      width: 340px;
      margin-left: auto;
      margin-bottom: 32px;
    }
    .total-table td {
      padding: 8px 12px;
      border: none;
    }
    .grand-total {
      font-size: 18px;
      font-weight: 800;
      color: var(--primary);
      border-top: 2px solid #1c0f07 !important;
    }
    .actions-bar {
      border-top: 1px solid #e2e8f0;
      padding-top: 24px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 16px;
    }
    .btn-action {
      background: linear-gradient(135deg, #f97316, #ea580c, #c2410c);
      color: #fff;
      padding: 10px 22px;
      border-radius: 8px;
      border: none;
      cursor: pointer;
      font-weight: 600;
      font-size: 14px;
      text-decoration: none;
      display: inline-flex;
      align-items: center;
      gap: 8px;
      box-shadow: 0 4px 12px rgba(234,88,12,0.25);
    }
    .btn-action:hover {
      background: linear-gradient(135deg, #ea580c, #c2410c, #9a3412);
    }
    .footer-note {
      font-size: 12px;
      color: var(--text-muted);
      line-height: 1.5;
    }
    @media print {
      .no-print { display: none !important; }
      body { padding: 0; background: #fff; }
      .invoice-card { border: none; box-shadow: none; padding: 0; max-width: 100%; }
    }
  </style>
</head>
<body>
  <div class="invoice-card">
    <div class="header-row">
      <div>
        <div class="brand-title">CloudDock Platform, Inc.</div>
        <div class="brand-subtitle">Developer Cloud Infrastructure & Compute Engine</div>
      </div>
      <div class="meta-col">
        <div class="invoice-num">${invoiceId}</div>
        <div>Date: ${issueDate}</div>
        <div>
          ${isTrial ? `
          <span class="badge-paid" style="background:#ecfdf5; color:#059669; border:1px solid #a7f3d0;">
            14-DAY TRIAL · $0.00 BILLED TODAY
          </span>` : `
          <span class="badge-paid">
            PAID IN FULL
          </span>`}
        </div>
      </div>
    </div>

    <div class="info-grid">
      <div class="info-block">
        <h4>Billed From</h4>
        <p>
          <strong>CloudDock Platform, Inc.</strong><br>
          548 Market Street, Suite 9200<br>
          San Francisco, CA 94104<br>
          Tax ID: <strong>US-EIN-94-3829104</strong>
        </p>
      </div>
      <div class="info-block">
        <h4>Billed To</h4>
        <p>
          <strong>${order.cardHolder || (order.paymentMethod === 'invoice' ? 'Corporate Engineering Account' : 'Authorized Subscriber')}</strong><br>
          Payment Method: <strong>${order.paymentMethodDisplay || (order.paymentMethod || 'card').toUpperCase()}</strong><br>
          Currency: <strong>${order.currency || 'USD'}</strong> (FX Rate: ${order.exchangeRate || 1})<br>
          Subscription ID: <strong>SUB-${invoiceId.replace('INV-', '')}</strong>
        </p>
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
          <td>
            <strong>${order.planName || 'Pro Team'} Plan</strong><br>
            <span style="font-size:12px; color:#64748b;">Cloud compute quotas, container instances & 24/7 SLA</span>
          </td>
          <td>${(order.billingCycle || 'yearly').toUpperCase()}</td>
          <td style="text-align:right;">$${(Number(order.grossSubtotalUSD) || (isYearly ? 468 : 49)).toFixed(2)}</td>
        </tr>
        ${Array.isArray(order.addons) && order.addons.length > 0 ? order.addons.map(a => `
        <tr>
          <td>
            <strong>${a.name || 'Modular Add-on'}</strong><br>
            <span style="font-size:12px; color:#64748b;">Provisioned compute add-on feature</span>
          </td>
          <td>${(order.billingCycle || 'yearly').toUpperCase()}</td>
          <td style="text-align:right;">$${(Number(a.costUSD) || 0).toFixed(2)}</td>
        </tr>`).join('') : ''}
        ${Number(order.discountUSD) > 0 ? `
        <tr>
          <td style="color:#d97706;">
            <strong>Promotional Discount (${order.couponApplied || 'PROMO'})</strong>
          </td>
          <td>Promo</td>
          <td style="text-align:right; color:#d97706;">-$${Number(order.discountUSD).toFixed(2)}</td>
        </tr>` : ''}
        ${Number(order.prorationCreditUSD) > 0 ? `
        <tr>
          <td style="color:#ea580c;">
            <strong>Proration Balance Credit</strong> (Previous Developer Tier)
          </td>
          <td>Proration</td>
          <td style="text-align:right; color:#ea580c;">-$${Number(order.prorationCreditUSD).toFixed(2)}</td>
        </tr>` : ''}
        ${isTrial ? `
        <tr style="background:#f0fdf4; color:#059669; font-weight:600;">
          <td>
            <strong>14-Day Free Trial Evaluation Waiver (100% off today)</strong><br>
            <span style="font-size:12px; color:#166534;">Zero payment charged today; full cloud quota provisioned</span>
          </td>
          <td>TRIAL</td>
          <td style="text-align:right; color:#059669;">-$${(Number(order.grandTotalUSD) || 460.8).toFixed(2)}</td>
        </tr>` : ''}
      </tbody>
    </table>

    <table class="total-table">
      <tr>
        <td>Plan Commitment:</td>
        <td style="text-align:right; font-weight:600;">$${(Number(order.grandTotalUSD) || 460.8).toFixed(2)}</td>
      </tr>
      ${isTrial ? `
      <tr>
        <td>Trial Evaluation Waiver:</td>
        <td style="text-align:right; color:#059669; font-weight:600;">-$${(Number(order.grandTotalUSD) || 460.8).toFixed(2)}</td>
      </tr>
      <tr class="grand-total" style="color:#059669 !important;">
        <td>Total Charged Today:</td>
        <td style="text-align:right;">$0.00</td>
      </tr>
      <tr>
        <td colspan="2" style="font-size:12px; color:#64748b; padding-top:6px; text-align:right;">
          Scheduled billing of <strong>$${(Number(order.grandTotalUSD) || 460.8).toFixed(2)}</strong> starts on <strong>${renewalDate}</strong>
        </td>
      </tr>` : `
      <tr class="grand-total">
        <td>Total Paid:</td>
        <td style="text-align:right;">$${(Number(order.grandTotalUSD) || 460.8).toFixed(2)}</td>
      </tr>`}
      ${order.currency && order.currency !== 'USD' && order.grandTotalConverted ? `
      <tr>
        <td style="font-size:12px; color:#64748b; padding-top:6px;">Plan Value in ${order.currency}:</td>
        <td style="text-align:right; font-size:12px; font-weight:700; color:#ea580c; padding-top:6px;">
          ${curr.symbol}${(order.grandTotalConverted || 0).toLocaleString()}
        </td>
      </tr>` : ''}
    </table>

    <div class="actions-bar no-print">
      <div class="footer-note">
        ${isTrial ?
          `Official Trial Statement: $0.00 charged today. 14-day zero-risk trial active. Regular billing starts ${renewalDate} unless cancelled.` :
          `Official Tax Invoice: Payment verified. Thank you for building on CloudDock.`
        }
      </div>
      <div style="display:flex; gap:10px;">
        <button class="btn-action" onclick="window.print()">
          🖨 Print Official Invoice
        </button>
      </div>
    </div>
  </div>
</body>
</html>`;
}

function openInvoiceDocument(order) {
  const currentOrder = order || state.currentOrder || getStoredOrder() || createClientOrderRecord('card');
  const html = generateClientInvoiceHTML(currentOrder);
  try {
    const blob = new Blob([html], { type: 'text/html;charset=utf-8' });
    const blobUrl = URL.createObjectURL(blob);
    const win = window.open(blobUrl, '_blank');
    if (!win || win.closed || typeof win.closed === 'undefined') {
      const directWin = window.open('', '_blank');
      if (directWin) {
        directWin.document.open();
        directWin.document.write(html);
        directWin.document.close();
      } else {
        window.location.href = blobUrl;
      }
    }
  } catch (e) {
    const directWin = window.open('', '_blank');
    if (directWin) {
      directWin.document.open();
      directWin.document.write(html);
      directWin.document.close();
    }
  }
}

function downloadInvoiceDocument(order) {
  const currentOrder = order || state.currentOrder || getStoredOrder() || createClientOrderRecord('card');
  const html = generateClientInvoiceHTML(currentOrder);
  const blob = new Blob([html], { type: 'text/html;charset=utf-8' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = `${currentOrder.invoiceId || 'CloudDock-Tax-Invoice'}.html`;
  document.body.appendChild(a);
  a.click();
  setTimeout(() => {
    URL.revokeObjectURL(a.href);
    a.remove();
  }, 100);
}

function getStoredOrder() {
  try {
    const saved = localStorage.getItem('clouddock_last_order');
    if (saved) return JSON.parse(saved);
  } catch (e) {}
  return null;
}

function openCheckoutModal(planId, customTitle) {
  const modal = document.getElementById('checkoutModal');
  const planData = PLANS_DATA[planId] || PLANS_DATA.pro;

  state.selectedPlan = {
    id: planId,
    title: customTitle || planData.title,
    basePriceMonthlyUSD: planData.monthlyUSD,
    basePriceYearlyUSD: planData.yearlyUSD,
    annualBilledUSD: planData.annualBilledUSD,
    specs: planData.specs
  };

  document.getElementById('modalPlanTitle').textContent = `${state.selectedPlan.title} Subscription`;
  document.getElementById('modalSelectedPlan').textContent = `${planData.title} Tier`;
  document.getElementById('modalSeats').textContent = planData.specs;

  updateCheckoutModalCalculations();
  modal.style.display = 'flex';
  document.body.style.overflow = 'hidden';
}

function closeCheckoutModal() {
  const modal = document.getElementById('checkoutModal');
  modal.style.display = 'none';
  document.body.style.overflow = '';
}

function updateCheckoutModalCalculations() {
  const curr = CURRENCIES[state.currency];
  const taxInfo = REGIONAL_TAX_RATES[state.region] || REGIONAL_TAX_RATES.US;

  const cadenceEl = document.getElementById('modalSelectedCadence');
  const basePriceEl = document.getElementById('modalBasePrice');
  const addonsLine = document.getElementById('modalAddonsLine');
  const addonsPriceEl = document.getElementById('modalAddonsPrice');
  const prorationLine = document.getElementById('prorationLine');
  const prorationAmount = document.getElementById('prorationAmount');
  const taxLineLabel = document.getElementById('taxLineLabel');
  const taxAmountDisplay = document.getElementById('taxAmountDisplay');
  const discountLine = document.getElementById('discountLine');
  const discountValEl = document.getElementById('modalDiscountVal');
  const finalTotalEl = document.getElementById('modalFinalTotal');

  const baseUSD = state.isYearly ? state.selectedPlan.basePriceYearlyUSD : state.selectedPlan.basePriceMonthlyUSD;
  const baseConverted = Math.round(baseUSD * curr.rate);

  cadenceEl.textContent = state.isYearly ? 'Annual (20% Discount Applied)' : 'Monthly Billing';
  basePriceEl.textContent = `${curr.symbol}${baseConverted.toLocaleString()} / mo`;

  // Base plan price for billing cycle
  let grossPlanUSD = state.isYearly ? state.selectedPlan.annualBilledUSD : state.selectedPlan.basePriceMonthlyUSD;

  // Modular Add-ons calculation
  const monthlyAddonsUSD = getAddonsTotalUSD();
  const cycleAddonsUSD = state.isYearly ? monthlyAddonsUSD * 12 : monthlyAddonsUSD;

  if (cycleAddonsUSD > 0) {
    addonsLine.style.display = 'flex';
    addonsPriceEl.textContent = `+${curr.symbol}${Math.round(cycleAddonsUSD * curr.rate).toLocaleString()}`;
  } else {
    addonsLine.style.display = 'none';
  }

  let subtotalUSD = grossPlanUSD + cycleAddonsUSD;

  // Coupon Discount
  let discountUSD = 0;
  if (state.couponApplied && state.couponDiscountDecimal > 0) {
    discountUSD = subtotalUSD * state.couponDiscountDecimal;
    discountLine.style.display = 'flex';
    discountValEl.textContent = `-${curr.symbol}${Math.round(discountUSD * curr.rate).toLocaleString()}`;
  } else {
    discountLine.style.display = 'none';
  }

  // Proration Credit (if upgrading from Starter)
  let prorationUSD = 0;
  if (state.activeAccount.planId === 'starter' && state.selectedPlan.id !== 'starter') {
    prorationUSD = state.activeAccount.unusedDaysCreditUSD;
    prorationLine.style.display = 'flex';
    prorationAmount.textContent = `-${curr.symbol}${Math.round(prorationUSD * curr.rate).toLocaleString()}`;
  } else {
    prorationLine.style.display = 'none';
  }

  const netSubtotalUSD = Math.max(0, subtotalUSD - discountUSD - prorationUSD);

  // Regional Tax Calculation
  const taxAmountUSD = netSubtotalUSD * taxInfo.rate;
  taxLineLabel.textContent = `Estimated Tax (${taxInfo.name} ${(taxInfo.rate * 100).toFixed(0)}%)`;
  taxAmountDisplay.textContent = `+${curr.symbol}${Math.round(taxAmountUSD * curr.rate).toLocaleString()}`;

  const grandTotalUSD = netSubtotalUSD + taxAmountUSD;
  const finalConverted = Math.round(grandTotalUSD * curr.rate);
  const suffix = state.isYearly ? '/ yr' : '/ mo';

  const modeRadio = document.querySelector('input[name="checkoutMode"]:checked');
  const isTrial = !modeRadio || modeRadio.value === 'trial';

  const futurePlanRateEl = document.getElementById('modalPlanRecurringTotal');
  const trialWaiverLine = document.getElementById('trialWaiverLine');
  const trialWaiverVal = document.getElementById('modalTrialWaiverVal');
  const captionEl = document.getElementById('modalNextBillingCaption');
  const confirmBtn = document.getElementById('modalConfirmBtn');

  if (futurePlanRateEl) {
    futurePlanRateEl.textContent = `${curr.symbol}${finalConverted.toLocaleString()} ${suffix}`;
  }

  if (isTrial) {
    if (trialWaiverLine) trialWaiverLine.style.display = 'flex';
    if (trialWaiverVal) trialWaiverVal.textContent = `-${curr.symbol}${finalConverted.toLocaleString()} (100% off today)`;
    finalTotalEl.textContent = `${curr.symbol}0.00`;
    finalTotalEl.style.color = 'var(--accent-emerald)';
    if (confirmBtn) confirmBtn.textContent = 'Start 14-Day Free Trial ($0.00 Today)';
    if (captionEl) {
      captionEl.textContent = `Zero charge today. First billing of ${curr.symbol}${finalConverted.toLocaleString()} starts after 14-day trial.`;
    }
  } else {
    if (trialWaiverLine) trialWaiverLine.style.display = 'none';
    finalTotalEl.textContent = `${curr.symbol}${finalConverted.toLocaleString()} ${suffix}`;
    finalTotalEl.style.color = '';
    if (confirmBtn) confirmBtn.textContent = `Simulate Payment & Pay ${curr.symbol}${finalConverted.toLocaleString()} Now`;
    if (captionEl) {
      captionEl.textContent = `Simulated immediate test charge of ${curr.symbol}${finalConverted.toLocaleString()}.`;
    }
  }
}

// ============================================================================
// 10. Toast Notification Engine
// ============================================================================
function showToast(message, duration = 3500) {
  const container = document.getElementById('toastContainer');
  if (!container) return;

  const toast = document.createElement('div');
  toast.className = 'toast-notification';
  toast.innerHTML = `<span>${message}</span>`;

  container.appendChild(toast);

  setTimeout(() => {
    toast.style.transition = 'opacity 0.25s ease, transform 0.25s ease';
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(8px)';
    setTimeout(() => {
      toast.remove();
    }, 250);
  }, duration);
}

// ============================================================================
// 11. Scroll-Reveal Animation Engine
// ============================================================================
function initScrollReveal() {
  // Graceful fallback for environments without IntersectionObserver
  if (!('IntersectionObserver' in window)) {
    document.querySelectorAll('[data-reveal], [data-reveal-group]').forEach(el => {
      el.classList.add('is-revealed');
    });
    return;
  }

  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-revealed');
          // Stop observing once revealed — no re-animation on scroll back up
          revealObserver.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.10,        // Trigger when 10% of element is visible
      rootMargin: '0px 0px -48px 0px'  // Fires slightly before bottom edge
    }
  );

  // Observe all [data-reveal] and [data-reveal-group] elements
  document.querySelectorAll('[data-reveal], [data-reveal-group]').forEach(el => {
    revealObserver.observe(el);
  });
}

function initInvoiceActions() {
  const link = document.getElementById('viewPrintInvoiceLink');
  const downloadBtn = document.getElementById('downloadInvoiceBtn');

  if (link) {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      openInvoiceDocument(state.currentOrder || getStoredOrder());
    });
  }

  if (downloadBtn) {
    downloadBtn.addEventListener('click', (e) => {
      e.preventDefault();
      downloadInvoiceDocument(state.currentOrder || getStoredOrder());
    });
  }
}

// ============================================================================
// 12. Initialization Lifecycle
// ============================================================================
document.addEventListener('DOMContentLoaded', () => {
  initBillingToggle();
  initAddonsManager();
  initCalculator();
  initFeatureMatrixControls();
  initFAQAccordion();
  initHeaderControls();
  initPlanSelection();
  initScrollReveal();
  initInvoiceActions();

  console.log('CloudDock Architecture Engine & REST Client Loaded Successfully.');
});
