# EMBER & OAK — Modern Dining

> **Cinematic Restaurant Experience, Complete Admin Dashboard & QR Digital Menu**  
> Built strictly with **HTML5, CSS3, and Vanilla JavaScript** (Zero Frameworks, Zero Backend, 100% Static Hosting Compatible for GitHub Pages & Vercel).

---

## 🌟 Executive Overview

**EMBER & OAK** is an end-to-end, Michelin-caliber restaurant web platform combining an immersive, sensory diner journey with a comprehensive, professional management console for chefs, managers, and restaurant owners.

The platform provides two cohesive, visually unified environments:
1. **Public Dining Flagship (`index.html`, `menu.html`, `qr-menu.html`)**:
   - Dark espresso, warm ivory, charcoal, and muted gold luxury editorial aesthetic.
   - Cinematic 4-stage prologue walkthrough into the dining sanctuary with Web Audio API woodfire synthesis.
   - Sequential signature dish showcase with a perpetual 360° circular orbit, dish inspection, and hover-to-hold interactions.
   - 8-category digital menu with live search, dietary filters, rich add-on customizer, and persistent session cart.
   - Mobile-first contact-free QR menu reading tableside URL parameters (`?table=T01`).
2. **Operations & Admin Dashboard (`admin/`)**:
   - Refined light ivory and crisp white dashboard surfaces accented by a deep espresso navigation sidebar and muted gold highlights.
   - Real-time KPI analytics cards and dependency-free SVG revenue curve charts.
   - Complete Menu Dishes CRUD with instant live sync to public customer menus.
   - Department category management with reassignment safety locks.
   - Live order workflow management (New ➔ Accepted ➔ Preparing ➔ Ready ➔ Completed) with printable kitchen tickets.
   - Table reservation seating manager.
   - Restaurant visual gallery manager.
   - Website content and branding editor.
   - Table QR code generator with printable tent card frames and high-res PNG downloads.
   - Financial reports with RFC 4180 CSV export.
   - Demo authentication system with clear security disclosures.

---

## 📁 Complete Project Architecture

```
restaurant-website/
├── index.html                   # Cinematic flagship homepage (Walkthrough, Hero, Philosophy, Showcase, Menu, Gallery, Booking)
├── menu.html                    # Mobile-first digital menu for smartphone diners scanning table QR codes
├── qr-menu.html                 # Restaurant owner QR code generator & printable tent card designer
├── admin/                       # Complete Restaurant Management Console
│   ├── login.html               # Luxury split-screen manager login with demo credential controls
│   ├── index.html               # Main operations overview, KPI cards, SVG sales curves, active orders table
│   ├── menu-management.html     # Dishes CRUD interface (search, filter, sort, edit modal, pricing, availability)
│   ├── categories.html          # Category management (departments, display icons, assignment integrity)
│   ├── orders.html              # Kitchen & dining room order manager with status transitions & ticket print
│   ├── reservations.html        # Table reservations & seating schedule manager with public form sync
│   ├── gallery.html             # Visual gallery manager (add photos, category tags, featured toggles)
│   ├── website-settings.html    # Brand identity, addresses, hours, hero copy, and tax/fee rates
│   ├── qr-management.html       # Table QR generator (T01-T10, Patio, Bar, VIP, custom), PNG export, tent cards
│   ├── reports.html             # Sales analytics, top dishes ranking, category breakdown, CSV data export
│   └── profile.html             # Manager profile, session inspector, factory database reset tool
├── css/
│   ├── style.css                # Diner flagship styles: typography, woodfire embers, animations, modals, footer
│   ├── menu.css                 # Interactive menu grid, category pills, orbital dish showcase, cart drawer
│   ├── responsive.css           # Mobile breakpoints, tablet adaptions, and print media rules
│   ├── admin.css                # Complete admin design system: sidebar, topbar, tables, forms, modals, toasts
│   └── admin-responsive.css     # Responsive styles for admin panel across desktop, laptop, tablet, and mobile
├── js/
│   ├── menu-data.js             # 28 culinary items, categories, default orders/reservations, and central EmberStore
│   ├── cart.js                  # Persistent session cart, tax/fee math, table ID tracking, demo checkout order sync
│   ├── menu.js                  # Real-time category filtering, search, dietary toggles, dish modal, orbital showcase
│   ├── main.js                  # Walkthrough intro engine, Web Audio synth, scroll reveals, booking form validator
│   ├── qr-menu.js               # Owner QR generation logic, URL builder with table params, PNG download
│   ├── qrcode.min.js            # Bundled pure vanilla JavaScript QR Code library (zero external dependencies)
│   ├── admin-auth.js            # Client-side session guard, login form validation, demo auth controller
│   ├── admin.js                 # Admin shell utilities: sidebar toggle, status switch, notifications, global modals
│   ├── admin-menu.js            # Dishes CRUD controller: validation, live image preview, filter, sort, table/grid
│   ├── admin-orders.js          # Order status transitions, detail inspector drawer, receipt printer
│   ├── admin-reservations.js    # Reservation listing, status updater, manual booking modal, delete guard
│   ├── admin-categories.js      # Category creation, editing, active toggles, dish assignment check
│   ├── admin-gallery.js         # Photo gallery manager with live preview, category tags, featured toggles
│   ├── admin-settings.js        # Website settings controller, brand preview mock, local persistence
│   ├── admin-qr.js              # Admin QR generation engine, table tent card printer, PNG downloader
│   └── admin-reports.js         # Analytics calculator, SVG trend chart, RFC 4180 CSV export generator
├── assets/
│   ├── images/                  # 40+ high-resolution food, interior, chef, cellar, and cocktail photographs
│   └── videos/                  # chef-craft.mp4 (4K woodfire hearth culinary craft video)
└── README.md                    # System documentation and deployment guide
```

---

## 🔑 Demo Admin Credentials

For static demonstration and evaluation, use the following pre-configured demo account:

- **Login URL**: `admin/login.html` (or click "Admin Console" in the footer of any public page)
- **Demo Email**: `admin@emberandoak.com`
- **Demo Password**: `ember123`
- **Quick Fill**: Click the "Auto-Fill" button on `admin/login.html` to populate credentials instantly.

> **Important Security Disclosure:**  
> In compliance with web application security standards, client-side JavaScript authentication is provided solely for demonstration purposes on static web servers. Client-side authentication does not protect business data on untrusted networks. Production restaurant deployments require server-side token validation (such as signed HTTP-only JWTs, OAuth2, or backend sessions).

---

## 💾 Browser Data Architecture (`EmberStore`)

To maintain full functionality on static hosting platforms without a backend server, all administrative changes and customer interactions share a unified client-side storage architecture (`EmberStore` in `js/menu-data.js`):

- **Default Seed Data**: Pre-loaded with 28 gourmet culinary dishes across 8 categories, 6 sample kitchen orders, 5 dinner reservations, 6 gallery photos, and complete restaurant contact metadata.
- **Unified Same-Origin Persistence**: When an administrator adds a dish, adjusts a price, creates a category, or edits restaurant hours in `admin/`, changes are written to `localStorage` under namespaced keys (`eo_menu_items`, `eo_categories`, `eo_orders`, `eo_reservations`, `eo_gallery`, `eo_settings`).
- **Live Customer Sync**: Both `index.html` and `menu.html` automatically read from `EmberStore`. Edits made in the admin console immediately reflect on the public customer website and mobile menu within the same browser profile.
- **Public Ordering & Booking Flow**:
  - Submitting a table reservation on `index.html#reservations` validates the form and instantly pushes a new `pending` reservation into `admin/reservations.html`.
  - Reviewing and confirming a cart order on `index.html` or `menu.html` immediately pushes a new `new` order with table designation into `admin/orders.html`.
- **Factory Reset**: A one-click utility in `admin/profile.html` and `admin/website-settings.html` allows administrators to clear modifications and revert to default seed data at any time.

---

## 🛠️ Admin Dashboard Modules

### 1. Operations Overview (`admin/index.html`)
- **Real-Time KPIs**: Total Menu Items, Available Dishes, Today's Orders, Kitchen Queue Pending, Today's Reservations, and Gross Estimated Revenue.
- **Revenue Trend Curve**: Dependency-free pure SVG chart rendering smooth quadratic curves with gradient fills and hoverable data points.
- **Top Dishes Ranking**: Progress bars displaying relative order frequency for best-selling items.
- **Live Kitchen Feed**: Table of the 5 most recent orders with quick inspection triggers.

### 2. Menu Dishes Management (`admin/menu-management.html`)
- **Full CRUD**: Create, Read, Update, and Delete restaurant dishes.
- **Search & Multi-Filter**: Real-time filtering by dish name, category, and availability (Available / Sold Out).
- **Sorting**: Sort by Name (A–Z / Z–A), Price (Low–High / High–Low), or Category.
- **Display Modes**: Toggle between an information-dense table view and a visual card grid.
- **Form Validation**: Inline validation for required fields, non-negative prices, and discount restrictions. Includes live image URL preview, vegetarian/gluten-free badges, and chef's signature toggles.

### 3. Category Management (`admin/categories.html`)
- Add, edit, activate, or deactivate culinary departments.
- Assign icons/emojis and descriptions.
- **Assignment Guard**: Prevents accidental deletion of categories that currently have dishes assigned to them, requiring reassignment first.

### 4. Kitchen Order Management (`admin/orders.html`)
- **Status Workflow**: Filter and transition orders through `New` ➔ `Accepted` ➔ `Preparing` ➔ `Ready` ➔ `Completed` or `Cancelled`.
- **Inspection Drawer**: Full itemized breakdown with quantities, unit prices, line totals, subtotal, sales tax (8.25%), kitchen fee (5%), and grand total.
- **Printable Kitchen Ticket**: One-click format formatted via `@media print` for commercial thermal ticket printers or kitchen displays.

### 5. Table Reservations (`admin/reservations.html`)
- Complete table reservation roster showing guest name, party size, date, seating time, contact details, and special requests.
- Filter by status: `Pending`, `Confirmed`, `Seated`, `Completed`, `Cancelled`.
- Add manual walk-in or telephone reservations.
- Synchronized with customer bookings from the public homepage.

### 6. Table QR Digital Menu Hub (`admin/qr-management.html` & `qr-menu.html`)
- Generates scannable QR codes for general dining or specific tables (`T01`–`T10`, Patio, Bar, VIP Vault, or custom identifiers).
- Powered by bundled `js/qrcode.min.js` (no external API calls or tracking).
- **Download High-Res PNG**: Exports 300 DPI canvas images for graphic designers.
- **Printable Table Tent Cards**: Formats an elegant, branded printable tent card with restaurant logo, table number, and instructions.

### 7. Website Content Settings (`admin/website-settings.html`)
- Edit restaurant name, tagline, address, reservation phone, email, and dining hours.
- Customize homepage hero headline, description, and background imagery.
- Adjust currency symbol (`$`, `₹`, `€`, `£`), sales tax rate, and kitchen craft fee percentage.
- Live brand card mock updating in real time as administrators type.

### 8. Sales Reports & Analytics (`admin/reports.html`)
- Executive summary metrics: Gross Revenue, Total Orders, Average Order Value (AOV), and Total Kitchen Covers.
- Category revenue distribution table with percentage breakdown.
- Order status distribution.
- **CSV Data Export**: Generates and downloads an RFC 4180 standard CSV file directly from active browser orders (`ember_oak_sales_report_YYYY-MM-DD.csv`).

---

## 🌐 Production Deployment Guide

Because this project uses strictly standard HTML5, CSS3, and Vanilla JavaScript, it requires **no Node.js build process, no npm install, and no complex server configuration**.

### Method 1: Deploy to Vercel via GitHub (Recommended)

#### Step 1: Initialize Git and Push from the Project Root
Open PowerShell or your terminal directly inside the project folder (`restaurant`):

```bash
cd "C:\Users\V AKASH\Downloads\restaurant"

# Initialize local git repository
git init

# Stage all files (.gitattributes, vercel.json, HTML, CSS, JS, Assets)
git add .

# Create initial commit
git commit -m "Ember & Oak: Complete restaurant platform with admin console and Vercel config"

# Rename default branch to main
git branch -M main

# Link to your GitHub repository (replace with your actual GitHub repo URL)
git remote add origin https://github.com/<your-username>/<your-repo-name>.git

# Push to GitHub
git push -u origin main --force
```

> **CRITICAL DEPLOYMENT NOTE:**  
> Ensure your Git repository root contains `index.html`, `menu.html`, `vercel.json`, `css/`, and `js/` directly at `./`. If your GitHub repository encloses them inside a subfolder (e.g. `restaurant/index.html`), configure Vercel's **Root Directory** as explained below.

#### Step 2: Import into Vercel
1. Go to [vercel.com](https://vercel.com) and click **"Add New..." ➔ "Project"**.
2. Select your GitHub repository.
3. In **Project Settings**:
   - **Framework Preset**: Leave as **Other** (Pure Static HTML/CSS/JS).
   - **Root Directory**:
     - If `index.html` is at the repository root: leave as **`./`**.
     - If your GitHub repository contains a subfolder named `restaurant`: click **Edit** and set Root Directory to **`restaurant`**.
   - **Build Command**: Leave empty (no build step needed).
   - **Output Directory**: Leave empty.
4. Click **Deploy**. Your site will be live across Vercel's global CDN in seconds.

---

### Method 2: Deploy directly via Vercel CLI

```bash
cd "C:\Users\V AKASH\Downloads\restaurant"
npm i -g vercel   # If not already installed
vercel --prod
```

---

### Method 3: Deploy to GitHub Pages

1. In your GitHub repository, navigate to **Settings ➔ Pages**.
2. Under **Build and deployment** ➔ **Source**, select **Deploy from a branch**.
3. Choose branch: `main` and folder: `/ (root)`.
4. Click **Save**. Your site will be live at `https://<your-username>.github.io/<your-repo-name>/`.
5. The dynamic base resolver automatically adapts to GitHub Pages subdirectory paths.

---

## 🔒 Static Hosting Limitations & Production Upgrade Path

| Feature | Static Demo Implementation | Production Recommended Solution |
| :--- | :--- | :--- |
| **Authentication** | Frontend session simulation in `sessionStorage` | Server-side OAuth2 / JWT with HTTP-only cookies (e.g. Supabase Auth, Auth0, Firebase) |
| **Data Storage** | Same-origin `localStorage` (per browser profile) | Cloud SQL database (PostgreSQL / MySQL) or BaaS (Supabase, Firebase Firestore) |
| **Kitchen Orders** | Local event dispatch to `EmberStore` | Real-time WebSockets (Socket.io) or Server-Sent Events (SSE) connected to Kitchen Display Systems (KDS) |
| **Payments** | Simulated frontend card validation | Stripe Elements / Razorpay API with server-side webhook verification |
| **Image Uploads** | Local asset paths or external URLs | AWS S3, Cloudinary, or Supabase Storage with pre-signed upload URLs |
| **Cross-Device Sync** | Local to scanning device | Centralized REST / GraphQL API |

---

## ✅ Quality & Verification Checklist

- [x] **Cinematic Homepage**: 4-scene video prologue, Web Audio hearth synth, skip button, and reduced-motion fallback.
- [x] **Orbital Food Showcase**: 360° perpetual forward rotation, central plate zoom on hover to pause, staggered editorial text reveals.
- [x] **Customer Food Menu**: 8 categories, instant filtering without page reloads, dietary flags, rich add-on customizer modal.
- [x] **Frontend Cart**: Item counters, add-on price calculations, tax/fee math, tableside ordering badge.
- [x] **Mobile QR Menu (`menu.html`)**: Reads `?table=T01` parameters, persistent floating bottom cart bar, responsive layout.
- [x] **Owner QR Generator (`qr-menu.html`)**: Live QR generation via bundled pure JS library, PNG export, printable tent card.
- [x] **Admin Authentication (`admin/login.html`)**: Form validation, show/hide password, demo credentials display with auto-fill.
- [x] **Dashboard Overview (`admin/index.html`)**: Dynamic KPIs, SVG revenue trend curve, top dishes ranking, recent orders table.
- [x] **Menu Management (`admin/menu-management.html`)**: Full CRUD, live search, category/availability filters, table/grid view toggle.
- [x] **Category Management (`admin/categories.html`)**: Department ordering, active toggles, dish assignment deletion prevention.
- [x] **Order Management (`admin/orders.html`)**: Status progression, itemized inspection drawer, printable kitchen tickets.
- [x] **Reservation Management (`admin/reservations.html`)**: Status updates, manual booking modal, public homepage booking synchronization.
- [x] **Website Settings (`admin/website-settings.html`)**: Brand copy, addresses, dining hours, financial rates, live preview card.
- [x] **Photo Gallery (`admin/gallery.html`)**: Photo manager with URL previews, categories, and featured highlights.
- [x] **Reports & Analytics (`admin/reports.html`)**: Aggregate metrics, category breakdown, RFC 4180 CSV export download.
- [x] **Admin Profile (`admin/profile.html`)**: Account inspector and complete localStorage database reset utility.
- [x] **Multi-Device Responsiveness**: Tested across Desktop (1440px+), Laptop (1024px), Tablet (768px), and Mobile (375px).
- [x] **Code Quality**: Strictly valid HTML5, CSS3, and Vanilla JavaScript with zero external frameworks.
