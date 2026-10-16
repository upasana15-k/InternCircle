/**
 * AuraGear — Modern E-Commerce Store Application
 * Capstone Vanilla JavaScript Implementation
 * 
 * Key Features:
 * 1. Dynamic item rendering from JS catalog objects
 * 2. Reactive shopping cart: add, update quantity, remove, count, subtotal, tax, promo code, free shipping meter
 * 3. Modal checkout preview with customer inputs, order summary breakdown, and simulated order placement
 * 4. Confirmation receipt modal with print support
 * 5. Theme toggle (dark/light), live search, category filtering, and wishlist persistence
 */

// --- 1. Product Catalog Data Source ---
const PRODUCTS = [
  {
    id: 'prod-01',
    name: 'AuraSonic Pro ANC Headphones',
    category: 'audio',
    categoryLabel: 'Audio & Sound',
    price: 16999,
    originalPrice: 21999,
    rating: 4.9,
    reviewsCount: 328,
    badge: 'bestseller',
    badgeText: 'Bestseller',
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format&fit=crop&q=80',
    description: 'Flagship hybrid active noise cancelling over-ear headphones with 45-hour battery life and spatial audio immersion.',
    features: ['Hybrid Active Noise Cancelling', '45h Playback', 'Lossless Bluetooth 5.3', 'Comfort Memory Foam'],
    inStock: true
  },
  {
    id: 'prod-02',
    name: 'PulseTrack Horizon Smartwatch',
    category: 'wearables',
    categoryLabel: 'Wearables',
    price: 12499,
    originalPrice: 14999,
    rating: 4.8,
    reviewsCount: 194,
    badge: 'new',
    badgeText: 'New Release',
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&auto=format&fit=crop&q=80',
    description: 'Precision aerospace titanium casing with continuous SpO2 biometric tracking and sapphire crystal AMOLED display.',
    features: ['Titanium Case', '14-Day Battery', 'ECG & SpO2 Biometrics', '5ATM Water Resistant'],
    inStock: true
  },
  {
    id: 'prod-03',
    name: 'KeyCraft V3 Wireless Mechanical Keyboard',
    category: 'desk',
    categoryLabel: 'Desk Setup',
    price: 10999,
    originalPrice: 12999,
    rating: 4.9,
    reviewsCount: 412,
    badge: 'bestseller',
    badgeText: 'Top Rated',
    image: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=800&auto=format&fit=crop&q=80',
    description: 'Gasket-mounted hot-swappable 75% mechanical keyboard with factory-lubed switches and multi-device Bluetooth/2.4GHz.',
    features: ['Gasket Mount Design', 'Hot-Swappable PCB', 'South-Facing RGB', 'Tri-Mode Connectivity'],
    inStock: true
  },
  {
    id: 'prod-04',
    name: 'Aerogrip Master Precision Mouse',
    category: 'desk',
    categoryLabel: 'Desk Setup',
    price: 6799,
    originalPrice: 7999,
    rating: 4.7,
    reviewsCount: 156,
    badge: null,
    badgeText: '',
    image: 'https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?w=800&auto=format&fit=crop&q=80',
    description: 'Ergonomic ultra-lightweight wireless workstation mouse with magnetic infinite scroll wheel and silent tactile switches.',
    features: ['MagSpeed Scroll Wheel', '26,000 DPI Sensor', 'Whisper-Quiet Clicks', '70-Day Battery'],
    inStock: true
  },
  {
    id: 'prod-05',
    name: 'NeoVolt 140W GaN Charging Hub',
    category: 'gadgets',
    categoryLabel: 'Power & Gear',
    price: 5499,
    originalPrice: 6999,
    rating: 4.8,
    reviewsCount: 220,
    badge: 'sale',
    badgeText: '20% OFF',
    image: 'https://images.unsplash.com/photo-1583863788434-e58a36330cf0?w=800&auto=format&fit=crop&q=80',
    description: 'Compact 4-port Gallium Nitride fast charger capable of powering two laptops and two smartphones simultaneously at peak speeds.',
    features: ['140W Total GaN Output', '3x USB-C + 1x USB-A', 'PD 3.1 Certified', 'Intelligent Heat Guard'],
    inStock: true
  },
  {
    id: 'prod-06',
    name: 'VibePod 2 Hi-Res Wireless Earbuds',
    category: 'audio',
    categoryLabel: 'Audio & Sound',
    price: 9299,
    originalPrice: 10999,
    rating: 4.6,
    reviewsCount: 180,
    badge: 'new',
    badgeText: 'Trending',
    image: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=800&auto=format&fit=crop&q=80',
    description: 'Pocket-sized true wireless earbuds with custom graphene drivers, transparency mode, and wireless charging case.',
    features: ['Adaptive ANC', 'Custom 11mm Drivers', 'IPX5 Sweatproof', '32h Total Playtime'],
    inStock: true
  },
  {
    id: 'prod-07',
    name: 'Lumina Bar Pro Screen Lamp',
    category: 'desk',
    categoryLabel: 'Desk Setup',
    price: 4999,
    originalPrice: 6299,
    rating: 4.7,
    reviewsCount: 284,
    badge: null,
    badgeText: '',
    image: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=800&auto=format&fit=crop&q=80',
    description: 'Asymmetric optical monitor light bar preventing glare with wireless desktop dial and ambient color temperature adjustments.',
    features: ['Zero Screen Glare', 'Auto Dimming Sensor', 'Ra95 High Color Index', 'Wireless Puck Control'],
    inStock: true
  },
  {
    id: 'prod-08',
    name: 'TitanCore Rugged MagSafe Power Bank',
    category: 'gadgets',
    categoryLabel: 'Power & Gear',
    price: 4199,
    originalPrice: 4999,
    rating: 4.5,
    reviewsCount: 97,
    badge: null,
    badgeText: '',
    image: 'https://images.unsplash.com/photo-1609081219090-a6d81d3085bf?w=800&auto=format&fit=crop&q=80',
    description: '10,000mAh magnetic portable power bank with fold-out aluminum kickstand and pass-through wireless charging.',
    features: ['Strong N52 Magnets', '15W Fast Wireless', 'Foldable Kickstand', 'Aircraft Aluminum'],
    inStock: true
  },
  {
    id: 'prod-09',
    name: 'AuraLoop Minimalist Smart Ring',
    category: 'wearables',
    categoryLabel: 'Wearables',
    price: 15999,
    originalPrice: 18999,
    rating: 4.8,
    reviewsCount: 142,
    badge: 'new',
    badgeText: 'Next Gen',
    image: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=800&auto=format&fit=crop&q=80',
    description: 'Ultralight titanium smart ring tracking sleep stages, recovery, temperature trends, and daily activity discreetly.',
    features: ['Ultralight 4g Titanium', 'Sleep & HRV Analysis', '7-Day Battery', '100m Waterproof'],
    inStock: true
  },
  {
    id: 'prod-10',
    name: 'StudioBeam 4K HDR Streaming Webcam',
    category: 'desk',
    categoryLabel: 'Desk Setup',
    price: 9999,
    originalPrice: 11999,
    rating: 4.6,
    reviewsCount: 88,
    badge: null,
    badgeText: '',
    image: 'https://images.unsplash.com/photo-1588508065123-287b28e013da?w=800&auto=format&fit=crop&q=80',
    description: 'Ultra HD 4K conference and creator camera with Sony STARVIS sensor, dual noise-cancelling mics, and physical privacy shutter.',
    features: ['Sony STARVIS 4K Sensor', 'AI Auto-Framing', 'Dual Beamforming Mics', 'Magnetic Privacy Cover'],
    inStock: true
  },
  {
    id: 'prod-11',
    name: 'Nomad Armor Leather Tech Folio',
    category: 'gadgets',
    categoryLabel: 'Power & Gear',
    price: 5799,
    originalPrice: 6799,
    rating: 4.9,
    reviewsCount: 115,
    badge: null,
    badgeText: '',
    image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&auto=format&fit=crop&q=80',
    description: 'Full-grain vegetable-tanned leather organizer pouch for cables, dongles, charger blocks, styluses, and power banks.',
    features: ['Full-Grain Horween Leather', 'YKK Waterproof Zippers', 'Elastic Cable Loops', 'RFID Shielded Pocket'],
    inStock: true
  },
  {
    id: 'prod-12',
    name: 'SoundSphere 360 Acoustic Studio Speaker',
    category: 'audio',
    categoryLabel: 'Audio & Sound',
    price: 14999,
    originalPrice: 17999,
    rating: 4.9,
    reviewsCount: 304,
    badge: 'sale',
    badgeText: 'Staff Pick',
    image: 'https://images.unsplash.com/photo-1545454675-3531b543be5d?w=800&auto=format&fit=crop&q=80',
    description: 'Omnidirectional desktop hi-fi speaker with room acoustics calibration, dual passive radiators, and AirPlay 2 / Spotify Connect.',
    features: ['360° Omnidirectional', 'Dual Passive Radiators', 'Wi-Fi & AirPlay 2', 'Nordic Wool Grille'],
    inStock: true
  }
];

// --- 2. Application State ---
const state = {
  products: [...PRODUCTS],
  cart: (JSON.parse(localStorage.getItem('auragear_cart')) || []).map(item => {
    const fresh = PRODUCTS.find(p => p.id === item.id);
    return fresh ? { ...item, price: fresh.price } : item;
  }),
  wishlist: JSON.parse(localStorage.getItem('auragear_wishlist')) || [],
  theme: localStorage.getItem('auragear_theme') || 'dark',
  palette: localStorage.getItem('auragear_palette') || 'cyber-lime',
  activeCategory: 'all',
  searchQuery: '',
  sortBy: 'featured',
  promoCode: null,
  discountRate: 0, // e.g. 0.20 for 20%
  appliedPromoName: '',
  activeQuickViewProduct: null,
  audioEnabled: true
};

// Available Promo Codes
const VALID_PROMOS = {
  'INTERN20': { rate: 0.20, label: 'Intern Special 20% OFF' },
  'SAVE10': { rate: 0.10, label: 'Welcome 10% OFF' },
  'AURA15': { rate: 0.15, label: 'VIP 15% OFF' }
};

// --- 3. DOM Elements Cache ---
const dom = {
  // Theme, Palette & Header
  html: document.documentElement,
  paletteSwitcher: document.getElementById('paletteSwitcher'),
  paletteMenuBtn: document.getElementById('paletteMenuBtn'),
  paletteDropdown: document.getElementById('paletteDropdown'),
  paletteSwatchPreview: document.getElementById('paletteSwatchPreview'),
  themeToggleBtn: document.getElementById('themeToggleBtn'),
  searchInput: document.getElementById('searchInput'),
  clearSearchBtn: document.getElementById('clearSearchBtn'),
  cartTriggerBtn: document.getElementById('cartTriggerBtn'),
  cartCountBadge: document.getElementById('cartCountBadge'),
  cartHeaderTotal: document.getElementById('cartHeaderTotal'),
  wishlistTriggerBtn: document.getElementById('wishlistTriggerBtn'),
  wishlistCountBadge: document.getElementById('wishlistCountBadge'),
  categoryPills: document.getElementById('categoryPills'),
  sortSelect: document.getElementById('sortSelect'),
  resultsCount: document.getElementById('resultsCount'),
  activeFiltersRow: document.getElementById('activeFiltersRow'),
  filterChips: document.getElementById('filterChips'),
  resetAllFiltersBtn: document.getElementById('resetAllFiltersBtn'),

  // Products
  productsGrid: document.getElementById('productsGrid'),
  emptyCatalogState: document.getElementById('emptyCatalogState'),
  resetSearchFromEmptyBtn: document.getElementById('resetSearchFromEmptyBtn'),

  // Cart Drawer
  cartDrawer: document.getElementById('cartDrawer'),
  cartBackdrop: document.getElementById('cartBackdrop'),
  closeCartBtn: document.getElementById('closeCartBtn'),
  cartItemsList: document.getElementById('cartItemsList'),
  drawerItemCount: document.getElementById('drawerItemCount'),
  emptyCartView: document.getElementById('emptyCartView'),
  cartFooter: document.getElementById('cartFooter'),
  shippingMeterText: document.getElementById('shippingMeterText'),
  shippingMeterBar: document.getElementById('shippingMeterBar'),
  startShoppingBtn: document.getElementById('startShoppingBtn'),

  // Promo & Totals
  promoForm: document.getElementById('promoForm'),
  promoInput: document.getElementById('promoInput'),
  applyPromoBtn: document.getElementById('applyPromoBtn'),
  promoFeedback: document.getElementById('promoFeedback'),
  cartSubtotal: document.getElementById('cartSubtotal'),
  cartDiscountRow: document.getElementById('cartDiscountRow'),
  discountPercentLabel: document.getElementById('discountPercentLabel'),
  cartDiscountValue: document.getElementById('cartDiscountValue'),
  cartShipping: document.getElementById('cartShipping'),
  cartTax: document.getElementById('cartTax'),
  cartGrandTotal: document.getElementById('cartGrandTotal'),
  openCheckoutModalBtn: document.getElementById('openCheckoutModalBtn'),

  // Quick View Modal
  quickViewBackdrop: document.getElementById('quickViewBackdrop'),
  quickViewModal: document.getElementById('quickViewModal'),
  quickViewContent: document.getElementById('quickViewContent'),
  closeQuickViewBtn: document.getElementById('closeQuickViewBtn'),

  // Checkout Preview Modal
  checkoutBackdrop: document.getElementById('checkoutBackdrop'),
  checkoutModal: document.getElementById('checkoutModal'),
  closeCheckoutBtn: document.getElementById('closeCheckoutBtn'),
  checkoutForm: document.getElementById('checkoutForm'),
  checkoutSummaryCount: document.getElementById('checkoutSummaryCount'),
  checkoutItemsMiniList: document.getElementById('checkoutItemsMiniList'),
  checkoutSubtotal: document.getElementById('checkoutSubtotal'),
  checkoutDiscountLine: document.getElementById('checkoutDiscountLine'),
  checkoutDiscountPercent: document.getElementById('checkoutDiscountPercent'),
  checkoutDiscountAmount: document.getElementById('checkoutDiscountAmount'),
  checkoutShipping: document.getElementById('checkoutShipping'),
  checkoutTax: document.getElementById('checkoutTax'),
  checkoutFinalAmount: document.getElementById('checkoutFinalAmount'),
  confirmOrderBtn: document.getElementById('confirmOrderBtn'),
  placeOrderBtnText: document.getElementById('placeOrderBtnText'),
  placeOrderSpinner: document.getElementById('placeOrderSpinner'),

  // Receipt Modal
  receiptBackdrop: document.getElementById('receiptBackdrop'),
  receiptModal: document.getElementById('receiptModal'),
  receiptOrderId: document.getElementById('receiptOrderId'),
  receiptDate: document.getElementById('receiptDate'),
  receiptItemsContainer: document.getElementById('receiptItemsContainer'),
  receiptSubtotal: document.getElementById('receiptSubtotal'),
  receiptDiscountRow: document.getElementById('receiptDiscountRow'),
  receiptDiscount: document.getElementById('receiptDiscount'),
  receiptShipping: document.getElementById('receiptShipping'),
  receiptTax: document.getElementById('receiptTax'),
  receiptTotal: document.getElementById('receiptTotal'),
  receiptShippingAddress: document.getElementById('receiptShippingAddress'),
  printReceiptBtn: document.getElementById('printReceiptBtn'),
  finishOrderBtn: document.getElementById('finishOrderBtn'),

  // Toasts
  toastContainer: document.getElementById('toastContainer')
};

// --- 4. Web Audio Synthesizer (Micro-sound effects) ---
const playAudioFeedback = (type = 'click') => {
  if (!state.audioEnabled) return;
  try {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) return;
    const ctx = new AudioContext();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.connect(gain);
    gain.connect(ctx.destination);

    if (type === 'add') {
      osc.frequency.setValueAtTime(440, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.12);
      gain.gain.setValueAtTime(0.08, ctx.currentTime);
      gain.gain.linearRampToValueAtTime(0.001, ctx.currentTime + 0.15);
      osc.start();
      osc.stop(ctx.currentTime + 0.15);
    } else if (type === 'remove') {
      osc.frequency.setValueAtTime(480, ctx.currentTime);
      osc.frequency.linearRampToValueAtTime(220, ctx.currentTime + 0.15);
      gain.gain.setValueAtTime(0.06, ctx.currentTime);
      gain.gain.linearRampToValueAtTime(0.001, ctx.currentTime + 0.15);
      osc.start();
      osc.stop(ctx.currentTime + 0.15);
    } else if (type === 'success') {
      // 2-tone major chime
      osc.frequency.setValueAtTime(523.25, ctx.currentTime); // C5
      osc.frequency.setValueAtTime(659.25, ctx.currentTime + 0.1); // E5
      gain.gain.setValueAtTime(0.08, ctx.currentTime);
      gain.gain.linearRampToValueAtTime(0.001, ctx.currentTime + 0.35);
      osc.start();
      osc.stop(ctx.currentTime + 0.35);
    }
  } catch (e) {
    // Audio context may require explicit user gesture, catch gracefully
  }
};

// --- 5. Helper Formatting Functions ---
const formatCurrency = (amount) => `₹${Math.round(Number(amount)).toLocaleString('en-IN')}`;

const renderStarRating = (rating) => {
  const fullStars = Math.floor(rating);
  const halfStar = rating % 1 >= 0.5 ? 1 : 0;
  const emptyStars = 5 - fullStars - halfStar;
  let starsHtml = '';

  for (let i = 0; i < fullStars; i++) starsHtml += '★';
  if (halfStar) starsHtml += '½';
  for (let i = 0; i < emptyStars; i++) starsHtml += '☆';

  return starsHtml;
};

// --- 6. Toast Notification Engine ---
const showToast = (message, type = 'info') => {
  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;

  let iconSvg = '';
  if (type === 'success') {
    iconSvg = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"></polyline></svg>`;
  } else if (type === 'error') {
    iconSvg = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>`;
  } else {
    iconSvg = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>`;
  }

  toast.innerHTML = `
    <span class="toast-icon">${iconSvg}</span>
    <span>${message}</span>
  `;

  dom.toastContainer.appendChild(toast);

  // Trigger animation
  requestAnimationFrame(() => {
    toast.classList.add('show');
  });

  setTimeout(() => {
    toast.classList.remove('show');
    setTimeout(() => {
      toast.remove();
    }, 300);
  }, 2800);
};

// --- 7. Product Catalog Rendering ---
const getFilteredProducts = () => {
  return state.products.filter(item => {
    // Category match
    const categoryMatch = state.activeCategory === 'all' || item.category === state.activeCategory;

    // Search query match across multiple fields
    const query = state.searchQuery.trim().toLowerCase();
    const searchMatch = !query || 
      item.name.toLowerCase().includes(query) ||
      item.description.toLowerCase().includes(query) ||
      item.categoryLabel.toLowerCase().includes(query) ||
      item.features.some(f => f.toLowerCase().includes(query));

    return categoryMatch && searchMatch;
  }).sort((a, b) => {
    switch (state.sortBy) {
      case 'price-low':
        return a.price - b.price;
      case 'price-high':
        return b.price - a.price;
      case 'rating':
        return b.rating - a.rating;
      case 'name':
        return a.name.localeCompare(b.name);
      default:
        return 0; // featured ordering
    }
  });
};

const renderCatalog = () => {
  const filtered = getFilteredProducts();

  // Update counter & empty state
  dom.resultsCount.innerHTML = `Showing <strong>${filtered.length}</strong> items`;

  if (filtered.length === 0) {
    dom.productsGrid.innerHTML = '';
    dom.emptyCatalogState.classList.remove('hidden');
    return;
  }

  dom.emptyCatalogState.classList.add('hidden');

  dom.productsGrid.innerHTML = filtered.map(product => {
    const isWishlisted = state.wishlist.includes(product.id);
    const badgeHtml = product.badge 
      ? `<span class="card-badge badge-${product.badge}">${product.badgeText}</span>` 
      : '';

    return `
      <article class="product-card" data-id="${product.id}">
        <div class="card-image-wrap">
          ${badgeHtml}
          <div class="card-quick-actions">
            <button class="quick-action-btn wishlist-btn ${isWishlisted ? 'wishlist-active' : ''}" 
                    data-id="${product.id}" 
                    aria-label="${isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}"
                    title="${isWishlisted ? 'Saved in wishlist' : 'Add to wishlist'}">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="${isWishlisted ? 'currentColor' : 'none'}" stroke="currentColor" stroke-width="2">
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
              </svg>
            </button>
            <button class="quick-action-btn quick-view-btn" data-id="${product.id}" aria-label="Quick View" title="Quick View">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                <circle cx="12" cy="12" r="3"></circle>
              </svg>
            </button>
          </div>
          <img class="card-img" src="${product.image}" alt="${product.name}" loading="lazy">
        </div>

        <div class="card-body">
          <span class="card-category">${product.categoryLabel}</span>
          <h3 class="card-title" data-id="${product.id}">${product.name}</h3>
          <p class="card-description">${product.description}</p>
          
          <div class="card-rating">
            <span class="stars">${renderStarRating(product.rating)}</span>
            <span class="rating-score">${product.rating}</span>
            <span class="rating-count">(${product.reviewsCount})</span>
          </div>

          <div class="card-footer">
            <div class="price-wrap">
              <span class="current-price">${formatCurrency(product.price)}</span>
              ${product.originalPrice ? `<span class="original-price">${formatCurrency(product.originalPrice)}</span>` : ''}
            </div>

            <button class="add-to-cart-btn" data-id="${product.id}" aria-label="Add ${product.name} to cart">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path>
                <line x1="3" y1="6" x2="21" y2="6"></line>
                <path d="M16 10a4 4 0 0 1-8 0"></path>
              </svg>
              <span>Add to Cart</span>
            </button>
          </div>
        </div>
      </article>
    `;
  }).join('');

  updateActiveFiltersDisplay();
  init3DTiltCards();
};

const updateActiveFiltersDisplay = () => {
  const hasCategoryFilter = state.activeCategory !== 'all';
  const hasSearchFilter = state.searchQuery.trim().length > 0;

  if (!hasCategoryFilter && !hasSearchFilter) {
    dom.activeFiltersRow.classList.add('hidden');
    return;
  }

  dom.activeFiltersRow.classList.remove('hidden');
  let chips = '';

  if (hasCategoryFilter) {
    const catLabel = document.querySelector(`.category-pill[data-category="${state.activeCategory}"]`)?.textContent.trim() || state.activeCategory;
    chips += `
      <span class="filter-chip">
        Category: ${catLabel}
        <button class="chip-remove-btn" data-action="clear-category" aria-label="Remove category filter">✕</button>
      </span>
    `;
  }

  if (hasSearchFilter) {
    chips += `
      <span class="filter-chip">
        Search: "${state.searchQuery}"
        <button class="chip-remove-btn" data-action="clear-search" aria-label="Remove search filter">✕</button>
      </span>
    `;
  }

  dom.filterChips.innerHTML = chips;
};

// --- 8. Reactive Cart Management ---
const calculateCartTotals = () => {
  const subtotal = state.cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const totalCount = state.cart.reduce((sum, item) => sum + item.quantity, 0);

  // Free delivery threshold at ₹4,000
  const freeShippingThreshold = 4000;
  const isFreeShipping = subtotal >= freeShippingThreshold || subtotal === 0;
  const shippingAmount = isFreeShipping ? 0 : 149; // Flat express delivery

  // Coupon discount
  const discountAmount = Math.round(subtotal * state.discountRate);
  const discountedSubtotal = Math.max(0, subtotal - discountAmount);

  // Taxes (8% standard)
  const taxAmount = discountedSubtotal > 0 ? Math.round(discountedSubtotal * 0.08) : 0;

  // Grand Total
  const grandTotal = discountedSubtotal > 0 ? (discountedSubtotal + shippingAmount + taxAmount) : 0;

  return {
    subtotal,
    totalCount,
    shippingAmount,
    isFreeShipping,
    freeShippingThreshold,
    discountAmount,
    discountedSubtotal,
    taxAmount,
    grandTotal
  };
};

const saveCart = () => {
  localStorage.setItem('auragear_cart', JSON.stringify(state.cart));
};

const updateCartUI = () => {
  const totals = calculateCartTotals();

  // Header & Drawer Badges
  dom.cartCountBadge.textContent = totals.totalCount;
  dom.cartHeaderTotal.textContent = formatCurrency(totals.subtotal);
  dom.drawerItemCount.textContent = `${totals.totalCount} item${totals.totalCount === 1 ? '' : 's'}`;

  // Cart Bump Animation
  dom.cartCountBadge.classList.remove('bump');
  void dom.cartCountBadge.offsetWidth; // Trigger reflow
  dom.cartCountBadge.classList.add('bump');

  // Drawer Empty vs Filled State
  if (state.cart.length === 0) {
    dom.emptyCartView.classList.remove('hidden');
    dom.cartItemsList.classList.add('hidden');
    dom.cartFooter.classList.add('hidden');
    dom.shippingMeterText.innerHTML = `Add <strong>₹4,000</strong> more to unlock <strong>FREE Express Shipping</strong>!`;
    dom.shippingMeterBar.style.width = '0%';
    return;
  }

  dom.emptyCartView.classList.add('hidden');
  dom.cartItemsList.classList.remove('hidden');
  dom.cartFooter.classList.remove('hidden');

  // Free Shipping Progress
  if (totals.isFreeShipping) {
    dom.shippingMeterText.innerHTML = `🎉 <strong style="color: var(--success);">Unlocked!</strong> You qualify for <strong>FREE Express Shipping</strong>!`;
    dom.shippingMeterBar.style.width = '100%';
    dom.shippingMeterBar.classList.add('unlocked');
  } else {
    const diff = Math.round(totals.freeShippingThreshold - totals.subtotal).toLocaleString('en-IN');
    const progress = Math.min(100, Math.round((totals.subtotal / totals.freeShippingThreshold) * 100));
    dom.shippingMeterText.innerHTML = `Add <strong>₹${diff}</strong> more to unlock <strong>FREE Express Shipping</strong>!`;
    dom.shippingMeterBar.style.width = `${progress}%`;
    dom.shippingMeterBar.classList.remove('unlocked');
  }

  // Render Cart Item Cards
  dom.cartItemsList.innerHTML = state.cart.map(item => `
    <div class="cart-item-card" data-id="${item.id}">
      <img src="${item.image}" alt="${item.name}" class="cart-item-thumb">
      <div class="cart-item-info">
        <div class="cart-item-header">
          <h4 class="cart-item-title">${item.name}</h4>
          <button class="item-delete-btn" data-action="delete" data-id="${item.id}" aria-label="Remove item">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <polyline points="3 6 5 6 21 6"></polyline>
              <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
            </svg>
          </button>
        </div>
        <div class="cart-item-price-row">
          <div class="qty-stepper">
            <button class="qty-btn" data-action="decrease" data-id="${item.id}" aria-label="Decrease quantity">−</button>
            <span class="qty-value">${item.quantity}</span>
            <button class="qty-btn" data-action="increase" data-id="${item.id}" aria-label="Increase quantity">+</button>
          </div>
          <span class="cart-item-total">${formatCurrency(item.price * item.quantity)}</span>
        </div>
      </div>
    </div>
  `).join('');

  // Cart Totals display
  dom.cartSubtotal.textContent = formatCurrency(totals.subtotal);

  if (totals.discountAmount > 0) {
    dom.cartDiscountRow.classList.remove('hidden');
    dom.discountPercentLabel.textContent = `${Math.round(state.discountRate * 100)}%`;
    dom.cartDiscountValue.textContent = `-${formatCurrency(totals.discountAmount)}`;
  } else {
    dom.cartDiscountRow.classList.add('hidden');
  }

  dom.cartShipping.textContent = totals.shippingAmount === 0 ? 'FREE' : formatCurrency(totals.shippingAmount);
  dom.cartTax.textContent = formatCurrency(totals.taxAmount);
  dom.cartGrandTotal.textContent = formatCurrency(totals.grandTotal);
};

const addToCart = (productId, quantityToAdd = 1) => {
  const product = state.products.find(p => p.id === productId);
  if (!product) return;

  const existingItem = state.cart.find(item => item.id === productId);

  if (existingItem) {
    existingItem.quantity += quantityToAdd;
  } else {
    state.cart.push({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      quantity: quantityToAdd
    });
  }

  saveCart();
  updateCartUI();
  playAudioFeedback('add');
  showToast(`Added "${product.name}" to cart`, 'success');

  // Trigger transient button styling
  const addBtn = document.querySelector(`.add-to-cart-btn[data-id="${productId}"]`);
  if (addBtn) {
    addBtn.classList.add('added-state');
    const originalText = addBtn.innerHTML;
    addBtn.innerHTML = `
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
        <polyline points="20 6 9 17 4 12"></polyline>
      </svg>
      <span>Added!</span>
    `;
    setTimeout(() => {
      addBtn.classList.remove('added-state');
      addBtn.innerHTML = originalText;
    }, 1200);
  }
};

const updateCartQuantity = (productId, delta) => {
  const cartItem = state.cart.find(item => item.id === productId);
  if (!cartItem) return;

  const newQty = cartItem.quantity + delta;

  if (newQty <= 0) {
    removeCartItem(productId);
  } else {
    cartItem.quantity = newQty;
    saveCart();
    updateCartUI();
    playAudioFeedback('click');
  }
};

const removeCartItem = (productId) => {
  const cardElem = document.querySelector(`.cart-item-card[data-id="${productId}"]`);
  if (cardElem) {
    cardElem.classList.add('removing');
  }

  setTimeout(() => {
    state.cart = state.cart.filter(item => item.id !== productId);
    saveCart();
    updateCartUI();
    playAudioFeedback('remove');
    showToast('Item removed from cart', 'info');
  }, 220);
};

// --- 9. Cart Drawer Open / Close ---
const openCartDrawer = () => {
  dom.cartBackdrop.classList.add('active');
  dom.cartDrawer.classList.add('active');
  dom.cartDrawer.setAttribute('aria-hidden', 'false');
  dom.cartBackdrop.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';
};

const closeCartDrawer = () => {
  dom.cartBackdrop.classList.remove('active');
  dom.cartDrawer.classList.remove('active');
  dom.cartDrawer.setAttribute('aria-hidden', 'true');
  dom.cartBackdrop.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';
};

// --- 10. Promo Code Handler ---
const handlePromoApply = () => {
  const inputCode = dom.promoInput.value.trim().toUpperCase();
  if (!inputCode) {
    dom.promoFeedback.textContent = 'Please enter a coupon code.';
    dom.promoFeedback.className = 'promo-feedback error';
    dom.promoFeedback.classList.remove('hidden');
    return;
  }

  if (VALID_PROMOS[inputCode]) {
    const promo = VALID_PROMOS[inputCode];
    state.promoCode = inputCode;
    state.discountRate = promo.rate;
    state.appliedPromoName = promo.label;

    dom.promoFeedback.textContent = `Applied! ${promo.label}`;
    dom.promoFeedback.className = 'promo-feedback success';
    dom.promoFeedback.classList.remove('hidden');
    showToast(`Coupon "${inputCode}" applied successfully!`, 'success');
    updateCartUI();
  } else {
    dom.promoFeedback.textContent = 'Invalid promo code. Try "INTERN20".';
    dom.promoFeedback.className = 'promo-feedback error';
    dom.promoFeedback.classList.remove('hidden');
  }
};

// --- 11. Wishlist Management ---
const toggleWishlist = (productId) => {
  const index = state.wishlist.indexOf(productId);
  const product = state.products.find(p => p.id === productId);

  if (index > -1) {
    state.wishlist.splice(index, 1);
    showToast(`Removed from favorites`, 'info');
  } else {
    state.wishlist.push(productId);
    showToast(`Saved to favorites`, 'success');
  }

  localStorage.setItem('auragear_wishlist', JSON.stringify(state.wishlist));
  dom.wishlistCountBadge.textContent = state.wishlist.length;
  renderCatalog();
};

// --- 12. Full Product Detail Modal ---
const openQuickView = (productId) => {
  const product = state.products.find(p => p.id === productId);
  if (!product) return;

  state.activeQuickViewProduct = product;
  const isWishlisted = state.wishlist.includes(product.id);

  // Compute discount percentage
  const discountPct = product.originalPrice
    ? Math.round((1 - product.price / product.originalPrice) * 100)
    : 0;

  dom.quickViewContent.innerHTML = `
    <!-- Left: Product Image Panel -->
    <div class="pdp-image-panel">
      <div class="pdp-main-image-wrap">
        <img src="${product.image}" alt="${product.name}" class="pdp-main-img">
        ${product.badge ? `<span class="card-badge badge-${product.badge} pdp-badge">${product.badgeText}</span>` : ''}
        ${discountPct > 0 ? `<span class="pdp-discount-tag">-${discountPct}%</span>` : ''}
      </div>
      <!-- Thumbnail strip (same image, different shade — for demo) -->
      <div class="pdp-thumb-strip">
        <button class="pdp-thumb active" aria-label="View 1">
          <img src="${product.image}" alt="View 1">
        </button>
        <button class="pdp-thumb" aria-label="View 2" style="filter: saturate(0.6) brightness(1.1);">
          <img src="${product.image}" alt="View 2" style="filter: saturate(0.6) brightness(1.1);">
        </button>
        <button class="pdp-thumb" aria-label="View 3" style="filter: hue-rotate(15deg) brightness(0.9);">
          <img src="${product.image}" alt="View 3" style="filter: hue-rotate(15deg) brightness(0.9);">
        </button>
      </div>
    </div>

    <!-- Right: Product Info Panel -->
    <div class="pdp-info-panel">
      <!-- Category & Breadcrumb -->
      <div class="pdp-breadcrumb">
        <span>Store</span>
        <span class="pdp-breadcrumb-sep">›</span>
        <span>${product.categoryLabel}</span>
        <span class="pdp-breadcrumb-sep">›</span>
        <span class="pdp-breadcrumb-active">${product.name}</span>
      </div>

      <!-- Title -->
      <h2 class="pdp-title" id="qvTitle">${product.name}</h2>

      <!-- Rating Row -->
      <div class="pdp-rating-row">
        <span class="stars pdp-stars">${renderStarRating(product.rating)}</span>
        <span class="pdp-rating-score">${product.rating}</span>
        <span class="pdp-rating-divider">|</span>
        <span class="pdp-review-count">${product.reviewsCount.toLocaleString('en-IN')} Reviews</span>
        <span class="pdp-rating-divider">|</span>
        <span class="pdp-stock-badge ${product.inStock ? 'in-stock' : 'out-stock'}">
          ${product.inStock ? '✓ In Stock' : '✗ Out of Stock'}
        </span>
      </div>

      <!-- Price Block -->
      <div class="pdp-price-block">
        <span class="pdp-current-price">${formatCurrency(product.price)}</span>
        ${product.originalPrice ? `
          <span class="pdp-original-price">${formatCurrency(product.originalPrice)}</span>
          <span class="pdp-savings-tag">Save ${formatCurrency(product.originalPrice - product.price)}</span>
        ` : ''}
      </div>
      <p class="pdp-tax-note">Inclusive of all taxes. Free delivery on orders above ₹4,000.</p>

      <!-- Description -->
      <p class="pdp-description">${product.description}</p>

      <!-- Key Features Grid -->
      <div class="pdp-features-section">
        <h4 class="pdp-section-label">Key Features</h4>
        <div class="pdp-features-grid">
          ${product.features.map((f, i) => `
            <div class="pdp-feature-item">
              <span class="pdp-feature-icon">0${i + 1}</span>
              <span class="pdp-feature-text">${f}</span>
            </div>
          `).join('')}
        </div>
      </div>

      <!-- Quantity Selector + CTA -->
      <div class="pdp-quantity-row">
        <div class="pdp-qty-label">Quantity:</div>
        <div class="qty-stepper pdp-qty-stepper">
          <button class="qty-btn pdp-qty-dec" aria-label="Decrease">−</button>
          <span class="qty-value pdp-qty-val">1</span>
          <button class="qty-btn pdp-qty-inc" aria-label="Increase">+</button>
        </div>
      </div>

      <div class="pdp-cta-row">
        <button class="btn btn-primary pdp-add-btn add-from-quickview" data-id="${product.id}">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path>
            <line x1="3" y1="6" x2="21" y2="6"></line>
            <path d="M16 10a4 4 0 0 1-8 0"></path>
          </svg>
          Add to Cart
        </button>
        <button class="pdp-wishlist-btn ${isWishlisted ? 'pdp-wishlist-active' : ''}" 
                data-pdp-wishlist="${product.id}"
                aria-label="${isWishlisted ? 'Remove from wishlist' : 'Save to wishlist'}">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="${isWishlisted ? 'currentColor' : 'none'}" stroke="currentColor" stroke-width="2">
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
          </svg>
          ${isWishlisted ? 'Wishlisted' : 'Wishlist'}
        </button>
      </div>

      <!-- Trust Strip -->
      <div class="pdp-trust-strip">
        <div class="pdp-trust-item">
          <span class="pdp-trust-icon">🚚</span>
          <span>Free Delivery above ₹4,000</span>
        </div>
        <div class="pdp-trust-item">
          <span class="pdp-trust-icon">🔄</span>
          <span>30-Day Returns</span>
        </div>
        <div class="pdp-trust-item">
          <span class="pdp-trust-icon">🛡️</span>
          <span>2-Year Warranty</span>
        </div>
        <div class="pdp-trust-item">
          <span class="pdp-trust-icon">🔒</span>
          <span>Secure Checkout</span>
        </div>
      </div>
    </div>
  `;

  // Quantity stepper logic inside PDP
  let pdpQty = 1;
  const pdpQtyVal = dom.quickViewContent.querySelector('.pdp-qty-val');
  dom.quickViewContent.querySelector('.pdp-qty-dec').addEventListener('click', () => {
    if (pdpQty > 1) { pdpQty--; pdpQtyVal.textContent = pdpQty; }
  });
  dom.quickViewContent.querySelector('.pdp-qty-inc').addEventListener('click', () => {
    if (pdpQty < 10) { pdpQty++; pdpQtyVal.textContent = pdpQty; }
  });

  // Add-to-cart from PDP (with quantity + flying animation)
  dom.quickViewContent.querySelector('.add-from-quickview').addEventListener('click', (e) => {
    const mainImg = dom.quickViewContent.querySelector('.pdp-main-img');
    triggerFlyToCart(mainImg);
    addToCart(product.id, pdpQty);
    closeQuickView();
  });

  // Wishlist from PDP
  const wishBtn = dom.quickViewContent.querySelector('[data-pdp-wishlist]');
  if (wishBtn) {
    wishBtn.addEventListener('click', () => {
      toggleWishlist(product.id);
      closeQuickView();
    });
  }

  // Thumbnail switching & Interactive Pan Zoom
  const mainImg = dom.quickViewContent.querySelector('.pdp-main-img');
  const mainWrap = dom.quickViewContent.querySelector('.pdp-main-image-wrap');

  dom.quickViewContent.querySelectorAll('.pdp-thumb').forEach(thumb => {
    thumb.addEventListener('click', () => {
      dom.quickViewContent.querySelectorAll('.pdp-thumb').forEach(t => t.classList.remove('active'));
      thumb.classList.add('active');
      if (mainImg) {
        mainImg.style.filter = thumb.style.filter || '';
      }
    });
  });

  if (mainWrap && mainImg) {
    mainWrap.addEventListener('mousemove', (e) => {
      const rect = mainWrap.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;
      mainImg.style.transformOrigin = `${x}% ${y}%`;
      mainImg.style.transform = 'scale(1.3)';
    });
    mainWrap.addEventListener('mouseleave', () => {
      mainImg.style.transformOrigin = 'center center';
      mainImg.style.transform = 'scale(1)';
    });
  }

  dom.quickViewBackdrop.classList.add('active');
  dom.quickViewBackdrop.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';
};

const closeQuickView = () => {
  dom.quickViewBackdrop.classList.remove('active');
  dom.quickViewBackdrop.setAttribute('aria-hidden', 'true');
  state.activeQuickViewProduct = null;
  document.body.style.overflow = '';
};

// --- 13. Modal Checkout Preview Workflow ---
const openCheckoutPreviewModal = () => {
  if (state.cart.length === 0) {
    showToast('Your cart is empty. Please add items before checking out.', 'error');
    return;
  }

  // Close cart drawer first
  closeCartDrawer();

  const totals = calculateCartTotals();

  // Populate checkout items mini list
  dom.checkoutSummaryCount.textContent = totals.totalCount;
  dom.checkoutItemsMiniList.innerHTML = state.cart.map(item => `
    <div class="checkout-mini-item">
      <img src="${item.image}" alt="${item.name}" class="mini-item-img">
      <div class="mini-item-meta">
        <h5 class="mini-item-name">${item.name}</h5>
        <span class="mini-item-qty">Qty: ${item.quantity}</span>
      </div>
      <span class="mini-item-price">${formatCurrency(item.price * item.quantity)}</span>
    </div>
  `).join('');

  // Populate breakdown
  dom.checkoutSubtotal.textContent = formatCurrency(totals.subtotal);

  if (totals.discountAmount > 0) {
    dom.checkoutDiscountLine.classList.remove('hidden');
    dom.checkoutDiscountPercent.textContent = `${Math.round(state.discountRate * 100)}%`;
    dom.checkoutDiscountAmount.textContent = `-${formatCurrency(totals.discountAmount)}`;
  } else {
    dom.checkoutDiscountLine.classList.add('hidden');
  }

  dom.checkoutShipping.textContent = totals.shippingAmount === 0 ? 'FREE' : formatCurrency(totals.shippingAmount);
  dom.checkoutTax.textContent = formatCurrency(totals.taxAmount);
  dom.checkoutFinalAmount.textContent = formatCurrency(totals.grandTotal);

  // Open modal
  dom.checkoutBackdrop.classList.add('active');
  dom.checkoutBackdrop.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';
};

const closeCheckoutPreviewModal = () => {
  dom.checkoutBackdrop.classList.remove('active');
  dom.checkoutBackdrop.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';
};

const handleCheckoutSubmit = (e) => {
  e.preventDefault();

  // Simple form validation check
  const firstName = document.getElementById('custFirstName').value.trim();
  const lastName = document.getElementById('custLastName').value.trim();
  const email = document.getElementById('custEmail').value.trim();
  const address = document.getElementById('custAddress').value.trim();
  const city = document.getElementById('custCity').value.trim();
  const zip = document.getElementById('custZip').value.trim();

  if (!firstName || !lastName || !email || !address || !city || !zip) {
    showToast('Please fill out all required customer details.', 'error');
    return;
  }

  // Trigger loading spinner
  dom.confirmOrderBtn.disabled = true;
  dom.placeOrderBtnText.textContent = 'Verifying & Processing...';
  dom.placeOrderSpinner.classList.remove('hidden');

  setTimeout(() => {
    // Generate order data
    const orderNumber = `#AG-${Math.floor(100000 + Math.random() * 900000)}`;
    const fullAddress = `${firstName} ${lastName}, ${address}, ${city}, ${zip}`;
    const totals = calculateCartTotals();

    // Prepare confirmation receipt modal
    dom.receiptOrderId.textContent = orderNumber;
    
    // Delivery estimated 3-5 days ahead
    const now = new Date();
    const estStart = new Date(now.setDate(now.getDate() + 3));
    const estEnd = new Date(now.setDate(now.getDate() + 2));
    const options = { month: 'short', day: 'numeric', year: 'numeric' };
    dom.receiptDate.textContent = `${estStart.toLocaleDateString(undefined, options)} - ${estEnd.toLocaleDateString(undefined, options)}`;

    dom.receiptItemsContainer.innerHTML = state.cart.map(item => `
      <div class="receipt-row-item">
        <span>${item.name} × ${item.quantity}</span>
        <strong>${formatCurrency(item.price * item.quantity)}</strong>
      </div>
    `).join('');

    dom.receiptSubtotal.textContent = formatCurrency(totals.subtotal);
    if (totals.discountAmount > 0) {
      dom.receiptDiscountRow.classList.remove('hidden');
      dom.receiptDiscount.textContent = `-${formatCurrency(totals.discountAmount)}`;
    } else {
      dom.receiptDiscountRow.classList.add('hidden');
    }

    dom.receiptShipping.textContent = totals.shippingAmount === 0 ? 'FREE' : formatCurrency(totals.shippingAmount);
    dom.receiptTax.textContent = formatCurrency(totals.taxAmount);
    dom.receiptTotal.textContent = formatCurrency(totals.grandTotal);
    dom.receiptShippingAddress.textContent = fullAddress;

    // Reset button
    dom.confirmOrderBtn.disabled = false;
    dom.placeOrderBtnText.textContent = 'Confirm & Place Order';
    dom.placeOrderSpinner.classList.add('hidden');

    // Close checkout modal & open receipt
    closeCheckoutPreviewModal();
    openReceiptModal();

    // Clear cart state
    state.cart = [];
    saveCart();
    updateCartUI();
    playAudioFeedback('success');
    triggerConfetti();
    showToast('Order confirmed! Receipt generated.', 'success');
  }, 1200);
};

// --- 14. Confirmation Receipt Modal ---
const openReceiptModal = () => {
  dom.receiptBackdrop.classList.add('active');
  dom.receiptBackdrop.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';
};

const closeReceiptModal = () => {
  dom.receiptBackdrop.classList.remove('active');
  dom.receiptBackdrop.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';
};

// --- 15. Theme & Palette Engine ---
const PALETTE_META = {
  'cyber-lime': { name: 'Cyber Lime', color: '#d4ff00' },
  'solar-flame': { name: 'Solar Flame', color: '#ff5a1f' },
  'cyber-jade': { name: 'Cyber Jade', color: '#00f59b' },
  'nordic-clay': { name: 'Nordic Clay', color: '#d97746' }
};

const applyPalette = (paletteName) => {
  if (!PALETTE_META[paletteName]) paletteName = 'cyber-lime';
  state.palette = paletteName;
  dom.html.setAttribute('data-palette', paletteName);
  localStorage.setItem('auragear_palette', paletteName);

  // Update preview dot & active class in dropdown
  if (dom.paletteSwatchPreview) {
    dom.paletteSwatchPreview.style.background = PALETTE_META[paletteName].color;
    dom.paletteSwatchPreview.style.boxShadow = `0 0 10px ${PALETTE_META[paletteName].color}`;
  }

  document.querySelectorAll('.palette-option').forEach(opt => {
    opt.classList.toggle('active', opt.dataset.palette === paletteName);
  });
};

const applyTheme = (themeName) => {
  state.theme = themeName;
  dom.html.setAttribute('data-theme', themeName);
  localStorage.setItem('auragear_theme', themeName);
};

const toggleTheme = () => {
  const newTheme = state.theme === 'dark' ? 'light' : 'dark';
  applyTheme(newTheme);
  showToast(`Switched to ${newTheme} mode`, 'info');
};

// --- 16. Event Listeners Setup ---
const setupEventListeners = () => {
  // Aesthetic Palette Dropdown Toggle
  if (dom.paletteMenuBtn && dom.paletteDropdown) {
    dom.paletteMenuBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      const isOpen = dom.paletteDropdown.classList.toggle('show');
      dom.paletteMenuBtn.classList.toggle('open', isOpen);
      dom.paletteMenuBtn.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    });

    // Palette Options Selection
    dom.paletteDropdown.addEventListener('click', (e) => {
      const option = e.target.closest('.palette-option');
      if (!option) return;
      const chosenPalette = option.dataset.palette;
      applyPalette(chosenPalette);
      dom.paletteDropdown.classList.remove('show');
      dom.paletteMenuBtn.classList.remove('open');
      dom.paletteMenuBtn.setAttribute('aria-expanded', 'false');
      playAudioFeedback('click');
      showToast(`Aesthetic shifted to ${PALETTE_META[chosenPalette].name}!`, 'success');
    });

    // Close palette dropdown on click outside
    document.addEventListener('click', (e) => {
      if (!dom.paletteSwitcher.contains(e.target)) {
        dom.paletteDropdown.classList.remove('show');
        dom.paletteMenuBtn.classList.remove('open');
        dom.paletteMenuBtn.setAttribute('aria-expanded', 'false');
      }
    });
  }

  // Theme Toggle
  dom.themeToggleBtn.addEventListener('click', toggleTheme);

  // Search input with debounce
  let searchTimeout = null;
  dom.searchInput.addEventListener('input', (e) => {
    clearTimeout(searchTimeout);
    const value = e.target.value;
    dom.clearSearchBtn.classList.toggle('hidden', value.length === 0);

    searchTimeout = setTimeout(() => {
      state.searchQuery = value;
      renderCatalog();
    }, 200);
  });

  dom.clearSearchBtn.addEventListener('click', () => {
    dom.searchInput.value = '';
    dom.clearSearchBtn.classList.add('hidden');
    state.searchQuery = '';
    renderCatalog();
    dom.searchInput.focus();
  });

  // Category Pills
  dom.categoryPills.addEventListener('click', (e) => {
    const pill = e.target.closest('.category-pill');
    if (!pill) return;

    document.querySelectorAll('.category-pill').forEach(btn => btn.classList.remove('active'));
    pill.classList.add('active');

    state.activeCategory = pill.dataset.category;
    renderCatalog();
  });

  // Sort dropdown
  dom.sortSelect.addEventListener('change', (e) => {
    state.sortBy = e.target.value;
    renderCatalog();
  });

  // Active Filter Chips & Reset
  dom.filterChips.addEventListener('click', (e) => {
    const removeBtn = e.target.closest('.chip-remove-btn');
    if (!removeBtn) return;

    const action = removeBtn.dataset.action;
    if (action === 'clear-category') {
      state.activeCategory = 'all';
      document.querySelectorAll('.category-pill').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.category === 'all');
      });
    } else if (action === 'clear-search') {
      state.searchQuery = '';
      dom.searchInput.value = '';
      dom.clearSearchBtn.classList.add('hidden');
    }
    renderCatalog();
  });

  dom.resetAllFiltersBtn.addEventListener('click', () => {
    state.activeCategory = 'all';
    state.searchQuery = '';
    dom.searchInput.value = '';
    dom.clearSearchBtn.classList.add('hidden');
    document.querySelectorAll('.category-pill').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.category === 'all');
    });
    renderCatalog();
  });

  dom.resetSearchFromEmptyBtn.addEventListener('click', () => {
    state.activeCategory = 'all';
    state.searchQuery = '';
    dom.searchInput.value = '';
    dom.clearSearchBtn.classList.add('hidden');
    document.querySelectorAll('.category-pill').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.category === 'all');
    });
    renderCatalog();
  });

  // Catalog Delegated Clicks (Add to cart, Quick View, Wishlist, Full Card Click to PDP)
  dom.productsGrid.addEventListener('click', (e) => {
    // Add to cart button
    const addBtn = e.target.closest('.add-to-cart-btn');
    if (addBtn) {
      e.stopPropagation();
      const card = addBtn.closest('.product-card');
      const img = card ? card.querySelector('.card-img') : null;
      triggerFlyToCart(img);
      addToCart(addBtn.dataset.id, 1);
      return;
    }

    // Wishlist button
    const wishlistBtn = e.target.closest('.wishlist-btn');
    if (wishlistBtn) {
      e.stopPropagation();
      toggleWishlist(wishlistBtn.dataset.id);
      return;
    }

    // Quick view button or clicking anywhere on the product card
    const card = e.target.closest('.product-card');
    if (card && card.dataset.id) {
      openQuickView(card.dataset.id);
      return;
    }
  });

  // Cart Drawer open/close triggers
  dom.cartTriggerBtn.addEventListener('click', openCartDrawer);
  dom.closeCartBtn.addEventListener('click', closeCartDrawer);
  dom.cartBackdrop.addEventListener('click', closeCartDrawer);
  dom.startShoppingBtn.addEventListener('click', closeCartDrawer);

  // Cart Drawer Actions (+ / - / delete)
  dom.cartItemsList.addEventListener('click', (e) => {
    const target = e.target.closest('[data-action]');
    if (!target) return;

    const action = target.dataset.action;
    const productId = target.dataset.id;

    if (action === 'increase') {
      updateCartQuantity(productId, 1);
    } else if (action === 'decrease') {
      updateCartQuantity(productId, -1);
    } else if (action === 'delete') {
      removeCartItem(productId);
    }
  });

  // Promo Code
  dom.promoForm.addEventListener('submit', (e) => {
    e.preventDefault();
    handlePromoApply();
  });

  // Quick View Modal
  dom.closeQuickViewBtn.addEventListener('click', closeQuickView);
  dom.quickViewBackdrop.addEventListener('click', (e) => {
    if (e.target === dom.quickViewBackdrop) closeQuickView();
  });

  dom.quickViewContent.addEventListener('click', (e) => {
    const addBtn = e.target.closest('.add-from-quickview');
    if (addBtn) {
      addToCart(addBtn.dataset.id, 1);
      closeQuickView();
    }
  });

  // Checkout Preview Modal
  dom.openCheckoutModalBtn.addEventListener('click', openCheckoutPreviewModal);
  dom.closeCheckoutBtn.addEventListener('click', closeCheckoutPreviewModal);
  dom.checkoutBackdrop.addEventListener('click', (e) => {
    if (e.target === dom.checkoutBackdrop) closeCheckoutPreviewModal();
  });

  dom.checkoutForm.addEventListener('submit', handleCheckoutSubmit);

  // Payment option styling toggle
  document.querySelectorAll('input[name="paymentMethod"]').forEach(radio => {
    radio.addEventListener('change', () => {
      document.querySelectorAll('.payment-option').forEach(opt => opt.classList.remove('selected'));
      radio.closest('.payment-option').classList.add('selected');
      
      const cardFields = document.getElementById('cardFields');
      if (radio.value === 'card') {
        cardFields.classList.remove('hidden');
      } else {
        cardFields.classList.add('hidden');
      }
    });
  });

  // Receipt Modal actions
  dom.printReceiptBtn.addEventListener('click', () => {
    window.print();
  });

  dom.finishOrderBtn.addEventListener('click', closeReceiptModal);
  dom.receiptBackdrop.addEventListener('click', (e) => {
    if (e.target === dom.receiptBackdrop) closeReceiptModal();
  });

  // Footer category links
  document.querySelectorAll('.filter-link').forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const cat = link.dataset.cat;
      state.activeCategory = cat;
      document.querySelectorAll('.category-pill').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.category === cat);
      });
      renderCatalog();
      window.scrollTo({ top: dom.productsGrid.offsetTop - 100, behavior: 'smooth' });
    });
  });

  // Global Keyboard Shortcuts (Esc closes any open modal / drawer)
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      if (dom.checkoutBackdrop.classList.contains('active')) closeCheckoutPreviewModal();
      if (dom.receiptBackdrop.classList.contains('active')) closeReceiptModal();
      if (dom.quickViewBackdrop.classList.contains('active')) closeQuickView();
      if (dom.cartDrawer.classList.contains('active')) closeCartDrawer();
    }
  });
};

// --- 17. Animated Component Engines ---

// (A) Parabolic Fly-to-Cart Particle Animation
const triggerFlyToCart = (sourceImg) => {
  if (!sourceImg || !dom.cartTriggerBtn) return;
  const startRect = sourceImg.getBoundingClientRect();
  const endRect = dom.cartTriggerBtn.getBoundingClientRect();

  const flyer = document.createElement('div');
  flyer.className = 'flying-cart-item';
  flyer.style.backgroundImage = `url("${sourceImg.src}")`;
  flyer.style.top = `${startRect.top}px`;
  flyer.style.left = `${startRect.left}px`;
  flyer.style.width = `${Math.min(120, startRect.width)}px`;
  flyer.style.height = `${Math.min(120, startRect.height)}px`;

  document.body.appendChild(flyer);

  // Force reflow
  void flyer.offsetWidth;

  flyer.style.transition = 'all 0.65s cubic-bezier(0.2, 0.8, 0.25, 1)';
  flyer.style.top = `${endRect.top + endRect.height / 2 - 16}px`;
  flyer.style.left = `${endRect.left + endRect.width / 2 - 16}px`;
  flyer.style.width = '32px';
  flyer.style.height = '32px';
  flyer.style.opacity = '0.4';
  flyer.style.transform = 'scale(0.4) rotate(20deg)';

  setTimeout(() => {
    flyer.remove();
    dom.cartTriggerBtn.classList.remove('cart-pulse');
    void dom.cartTriggerBtn.offsetWidth;
    dom.cartTriggerBtn.classList.add('cart-pulse');
    setTimeout(() => dom.cartTriggerBtn.classList.remove('cart-pulse'), 450);
  }, 650);
};

// (B) Interactive 3D Perspective Tilt & Holographic Glare for Product Cards
const init3DTiltCards = () => {
  const cards = dom.productsGrid.querySelectorAll('.product-card');
  cards.forEach(card => {
    let glare = card.querySelector('.card-glare');
    if (!glare) {
      glare = document.createElement('div');
      glare.className = 'card-glare';
      card.appendChild(glare);
    }

    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      const rotateX = ((y - centerY) / centerY) * -6.5;
      const rotateY = ((x - centerX) / centerX) * 6.5;

      card.style.transform = `perspective(850px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) translateY(-4px)`;
      glare.style.opacity = '1';
      glare.style.background = `radial-gradient(circle at ${x}px ${y}px, rgba(255, 255, 255, 0.18) 0%, transparent 65%)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
      glare.style.opacity = '0';
    });
  });
};

// (C) Live Sales / Social Proof Activity Ticker
const SALES_EVENTS = [
  { name: 'Rohan M.', city: 'Bengaluru', prodId: 'prod-01', time: '2 mins ago' },
  { name: 'Ananya S.', city: 'Mumbai', prodId: 'prod-02', time: 'Just now' },
  { name: 'Vikram K.', city: 'Hyderabad', prodId: 'prod-03', time: '4 mins ago' },
  { name: 'Pooja D.', city: 'Delhi NCR', prodId: 'prod-06', time: '1 min ago' },
  { name: 'Arjun N.', city: 'Pune', prodId: 'prod-09', time: '5 mins ago' },
  { name: 'Sneha R.', city: 'Chennai', prodId: 'prod-12', time: '3 mins ago' }
];

let salesTickerTimer = null;
let currentSaleIndex = 0;

const initLiveSalesTicker = () => {
  const ticker = document.getElementById('salesTicker');
  const closeBtn = document.getElementById('tickerCloseBtn');
  const img = document.getElementById('tickerProductImg');
  const title = document.getElementById('tickerTitle');
  const meta = document.getElementById('tickerMeta');
  const progress = document.getElementById('tickerProgressBar');

  if (!ticker || !img || !title) return;

  if (closeBtn) {
    closeBtn.addEventListener('click', () => {
      ticker.classList.remove('visible');
      if (salesTickerTimer) clearInterval(salesTickerTimer);
    });
  }

  const showNextSale = () => {
    const sale = SALES_EVENTS[currentSaleIndex % SALES_EVENTS.length];
    currentSaleIndex++;
    const product = PRODUCTS.find(p => p.id === sale.prodId) || PRODUCTS[0];

    img.src = product.image;
    img.alt = product.name;
    title.innerHTML = `<strong>${sale.name}</strong> in ${sale.city} bought <em>${product.name}</em>`;
    meta.textContent = `Verified purchase • ${sale.time}`;

    progress.style.transition = 'none';
    progress.style.width = '100%';

    ticker.classList.add('visible');

    setTimeout(() => {
      progress.style.transition = 'width 5s linear';
      progress.style.width = '0%';
    }, 50);

    setTimeout(() => {
      ticker.classList.remove('visible');
    }, 5500);
  };

  // Start after 3.5 seconds, then repeat every 16 seconds
  setTimeout(showNextSale, 3500);
  salesTickerTimer = setInterval(showNextSale, 16000);
};

// (D) High Performance Physics-based Confetti Engine (Canvas)
const triggerConfetti = () => {
  const canvas = document.getElementById('confettiCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  const colors = ['#d4ff00', '#ff5a1f', '#00f59b', '#38bdf8', '#fbbf24', '#ec4899', '#ffffff'];
  const particles = [];
  const particleCount = 140;

  for (let i = 0; i < particleCount; i++) {
    particles.push({
      x: canvas.width * 0.5 + (Math.random() - 0.5) * 220,
      y: canvas.height * 0.45 + (Math.random() - 0.5) * 90,
      vx: (Math.random() - 0.5) * 18,
      vy: Math.random() * -14 - 5,
      size: Math.random() * 8 + 4,
      color: colors[Math.floor(Math.random() * colors.length)],
      rotation: Math.random() * 360,
      vRot: (Math.random() - 0.5) * 14,
      shape: Math.random() > 0.35 ? 'rect' : 'circle',
      opacity: 1,
      gravity: 0.35 + Math.random() * 0.15,
      drag: 0.96
    });
  }

  let animationFrame;
  const startTime = performance.now();

  const render = (time) => {
    const elapsed = time - startTime;
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    let activeCount = 0;
    particles.forEach(p => {
      p.x += p.vx;
      p.y += p.vy;
      p.vx *= p.drag;
      p.vy = (p.vy + p.gravity) * p.drag;
      p.rotation += p.vRot;

      if (elapsed > 2000) {
        p.opacity = Math.max(0, 1 - (elapsed - 2000) / 1200);
      }

      if (p.opacity > 0 && p.y < canvas.height + 20) {
        activeCount++;
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate((p.rotation * Math.PI) / 180);
        ctx.globalAlpha = p.opacity;
        ctx.fillStyle = p.color;

        if (p.shape === 'rect') {
          ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 0.6);
        } else {
          ctx.beginPath();
          ctx.arc(0, 0, p.size / 2, 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.restore();
      }
    });

    if (activeCount > 0 && elapsed < 3500) {
      animationFrame = requestAnimationFrame(render);
    } else {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      cancelAnimationFrame(animationFrame);
    }
  };

  animationFrame = requestAnimationFrame(render);
};

// --- 18. Initialization ---
const initApp = () => {
  // Apply saved aesthetic palette & theme
  applyPalette(state.palette);
  applyTheme(state.theme);

  // Set initial wishlist count
  dom.wishlistCountBadge.textContent = state.wishlist.length;

  // Render initial catalog
  renderCatalog();

  // Update initial cart status
  updateCartUI();

  // Attach event listeners
  setupEventListeners();

  // Start live sales ticker
  initLiveSalesTicker();

  console.log('✨ AuraGear Mini E-Commerce App Initialized Successfully.');
};

// Start application when DOM is ready
document.addEventListener('DOMContentLoaded', initApp);
