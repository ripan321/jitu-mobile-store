# 🛒 Jitu Mobile & Electronics — Frontend

> React + Vite frontend for Jitu Mobile Store (MERN Phase 1)

---

## 🚀 How to Run

### Step 1 — Install Node.js (if not already)
Download from: https://nodejs.org (choose **LTS** version)

Verify it works:
```bash
node -v    # should print v18 or higher
npm -v     # should print 9 or higher
```

---

### Step 2 — Open the `client` folder in your terminal

```bash
cd jitu-mobile-store/client
```

---

### Step 3 — Install dependencies

```bash
npm install
```

This downloads React, Vite, React Router, and Lucide Icons into a `node_modules` folder.

---

### Step 4 — Start the development server

```bash
npm run dev
```

Your browser will automatically open at:
```
http://localhost:3000
```

✅ The page hot-reloads instantly whenever you save a file.

---

## 📁 Project Structure

```
client/
├── index.html                   ← HTML entry point
├── vite.config.js               ← Vite config (port 3000)
├── package.json                 ← Dependencies
│
└── src/
    ├── main.jsx                 ← App bootstrap
    ├── App.jsx                  ← Router + context providers
    │
    ├── styles/
    │   ├── global.css           ← Reset + base styles + fonts
    │   └── tokens.js            ← Color/font design tokens
    │
    ├── data/
    │   ├── products.js          ← 12 mock products
    │   ├── categories.js        ← Nav categories + hero slides + repair services
    │   └── locations.js        ← 5 store locations
    │
    ├── context/
    │   ├── LocationContext.jsx  ← Selected store location (global state)
    │   └── CartContext.jsx      ← Shopping cart state
    │
    ├── hooks/
    │   └── useSearch.js         ← Product/service search hook
    │
    ├── utils/
    │   └── helpers.js           ← formatPrice, calcDiscount, getBadgeClass
    │
    ├── components/
    │   ├── layout/
    │   │   ├── Layout.jsx       ← Page wrapper with Outlet
    │   │   ├── PromoStrip.jsx   ← Top "Free Gift" banner
    │   │   ├── Header.jsx       ← Logo + location + search + cart
    │   │   ├── NavBar.jsx       ← Mega menu navigation bar
    │   │   └── Footer.jsx       ← Links + store locations
    │   │
    │   ├── common/
    │   │   └── SearchBar.jsx    ← Product/Service search toggle
    │   │
    │   ├── home/
    │   │   ├── HeroCarousel.jsx     ← Auto-sliding banners
    │   │   ├── DeliveryOptions.jsx  ← Pickup (Free Gift) vs Home Delivery
    │   │   ├── StatsBar.jsx         ← 12 years / 5.0 / 4 stores / 10k customers
    │   │   └── RepairHighlight.jsx  ← Repair services + Book Diagnosis CTA
    │   │
    │   └── products/
    │       ├── ProductGrid.jsx      ← Section with filter + layout switcher
    │       ├── ProductCard.jsx      ← Individual product card
    │       ├── FilterChips.jsx      ← Category filter buttons
    │       └── LayoutSwitcher.jsx   ← 2 / 3 / 4 column toggle
    │
    └── pages/
        ├── HomePage.jsx             ← / (assembles home sections)
        ├── ProductsPage.jsx         ← /products and /products/:category
        ├── RepairServicesPage.jsx   ← /repair
        └── StoreLocatorPage.jsx     ← /stores
```

---

## 🌐 Pages / Routes

| URL | Page |
|-----|------|
| `/` | Homepage (hero, delivery options, products, repair) |
| `/products` | All products listing |
| `/products/mobiles` | Filtered by category |
| `/repair` | Repair services page |
| `/stores` | Store locator |

---

## 🎨 Design System

| Token | Value |
|-------|-------|
| Royal Blue | `#1a237e` |
| Accent Orange | `#ff6f00` |
| Background | `#f4f6fb` |
| Text | `#1c2333` |
| Display font | Syne (Google Fonts) |
| Body font | DM Sans (Google Fonts) |

---

## ⚙️ Other Commands

```bash
npm run build     # Build for production → dist/ folder
npm run preview   # Preview the production build locally
```

---

## 🔜 Phase 2 (Backend — coming soon)
- Express.js REST API
- MongoDB + Mongoose
- JWT Auth
- Product image uploads (Cloudinary)
- Booking & order management
- Payment integration (Razorpay)
