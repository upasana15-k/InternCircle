# 🛍️ AuraGear — Interactive Mini E-Commerce App & Capstone Showcase

A sleek, modern, and reactive tech & lifestyle mini e-commerce web application built with **Modern Semantic HTML5**, **Vanilla CSS3 (Glassmorphism, Dark/Light Themes, Flex/Grid)**, and **Vanilla JavaScript (ES6+ State Management, LocalStorage Persistence, Web Audio API)**.

Developed for the **InternCircle Virtual Internship** — Project: *Interactive Quiz / Mini E-Commerce App*.

---

## 🌟 Key Highlights & Engineering Features

### 1. Dynamic Item Rendering from JS Objects
- **Data-Driven Architecture**: Fully rendered from structured JavaScript objects (`PRODUCTS` dataset) featuring Indian Rupee (`₹`) native pricing, high-resolution imagery, descriptive copy, star ratings, category taxonomy, tags, badges, and stock availability.
- **Whole-Product Detail Page (PDP) Modal**:
  - Clicking **anywhere** on a product card opens a comprehensive two-column product detail modal.
  - Interactive pan-and-zoom lens on product image hover.
  - Multi-view thumbnail carousel with active neon glow switching.
  - Live stock status with pulsating radar indicator.
  - Savings breakdown badge, reviews tally, and key feature spec cards with sequential indices (`01`, `02`, `03`...).
  - Quantity stepper (`− 1 +`), Add-to-Cart with flying particle animation, and Wishlist bookmarking.
  - Built-in trust strip (Free Delivery above ₹4,000, 30-Day Returns, 2-Year Warranty, Secure Checkout).
- **Real-Time Filtering & Search**:
  - Instant debounced multi-field search querying product names, descriptions, categories, and feature arrays.
  - Category filter pills with active indicator states (Audio, Wearables, Desk Setup, Power & Gear).
  - Dynamic sort engine supporting *Featured*, *Price: Low to High*, *Price: High to Low*, *Highest Rating*, and *A-Z*.

### 2. Interactive Shopping Cart & Live Rupee Calculations
- **Reactive State Management**:
  - Real-time increment and decrement quantity steppers (`+` / `−`).
  - Item removal with smooth slide-out CSS exit animations.
  - Floating cart indicator in header with an animated bounce/bump counter badge.
- **Accurate Financial Calculations (Indian Rupees - ₹)**:
  - **Dynamic Item Count**: Cumulative sum of all selected quantities.
  - **Subtotal**: Real-time multiplication of unit price by item quantities in `₹`.
  - **Free Shipping Threshold**: Dynamic progress meter calculating progress toward free delivery (`₹4,000` benchmark), displaying remaining rupee difference. Unlocks an energetic celebration shimmer bar upon reaching the threshold.
  - **Flat Express Shipping**: ₹149 delivery for orders under ₹4,000; FREE above ₹4,000.
  - **Estimated Sales Tax**: Auto-computed standard 8% rate.
  - **Promo Code Discounts**: Interactive coupon voucher engine supporting `INTERN20` (20% off), `SAVE10` (10% off), and `AURA15` (15% off) with validation feedback.
  - **LocalStorage Persistence**: Cart items and customer favorites are automatically saved to `localStorage`, preserving customer state across page refreshes.

### 3. Animated Components & Portfolio WOW Factor
- 🕹️ **Interactive 3D Perspective Tilt & Holographic Glare**: Product cards track cursor position in 3D perspective space with a dynamic radial holographic light sheen that glides across the card surface.
- 🚀 **Parabolic Fly-to-Cart Particle Effect**: Clicking "Add to Cart" triggers a glowing clone of the product thumbnail that arcs across the screen directly into the header's cart button, triggering a cart arrival pulse.
- ⚡ **Live Sales & Social Proof Activity Ticker**: Ambient animated notification pill that periodically slides into the viewport showcasing simulated real-time verified customer purchases across India with countdown progress bar.
- 🎊 **Physics-Driven 60fps Confetti Celebration**: Canvas particle explosion with 140+ colorful streamers and confetti pieces raining down upon completing order checkout.
- ✨ **Celebration Shimmer Progress Bar**: Radiant rainbow/gold gradient animation when unlocking free express shipping.
- 🌓 **High-Contrast Dark & Light Mode Engine**: Total readability in both themes, eliminating white-on-white text issues with tailored contrast tokens and 4 curated aesthetic vibes (*Cyber Lime*, *Solar Flame*, *Cyber Jade*, *Nordic Clay*).
- 🎵 **Synthesized Web Audio Feedback**: Native browser Web Audio API sounds for adding items, deleting items, and completing order checkout without external audio asset dependencies.

---

## 📁 Project File Structure

```
mini_ecommerce/
├── index.html        # Semantic HTML5 markup, header, catalog, drawer cart, checkout & receipt modals
├── style.css         # Modern CSS3 with custom variables, glassmorphism, responsive breakpoints & print styles
├── app.js            # Reactive state management, DOM rendering, cart math, modal workflows & audio
└── README.md         # Comprehensive project documentation
```

---

## 🚀 How to Run Locally

1. Navigate to the project directory:
   ```bash
   cd mini_ecommerce
   ```
2. Open `index.html` directly in any web browser, or launch using VS Code **Live Server** (`http://127.0.0.1:5500/mini_ecommerce/index.html`).

---

## 💡 Promo Codes for Testing

You can enter and test the following discount codes in the cart drawer:
- **`INTERN20`** — Grants **20% OFF** the order subtotal.
- **`SAVE10`** — Grants **10% OFF** the order subtotal.
- **`AURA15`** — Grants **15% OFF** the order subtotal.
