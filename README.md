# OmniCommerce Enterprise Platform

OmniCommerce Enterprise is a high-capacity, full-stack E-Commerce management platform built with HTML5, CSS3, JavaScript, Node.js, and Express.

---

## Key Features

- **Storefront Web Interface**:
  - Interactive catalog with real-time category filtering, search, dynamic sorting, and price range sliders.
  - Product detail viewer with image gallery, variant options selector (color/size), inventory stock status, and customer reviews.
  - Dynamic shopping cart drawer with coupon validation, dynamic tax computation, and shipping estimation.
  - Multi-step checkout wizard with address formatting, shipping carrier selector, and payment gateway selection (Stripe Mock, PayPal Mock, COD).
  - Customer order history & real-time shipment status tracker.

- **Admin Control Panel & Analytics Dashboard**:
  - Real-time KPI summary (Total Revenue, Orders Count, Customer Count, Average Order Value).
  - Product Manager with full CRUD, category assignment, SKU generation, and stock management.
  - Inventory Manager with reorder alert threshold tracking and warehouse location logging.
  - Order Manager with real-time state machine workflow transitions (`Pending` -> `Paid` -> `Processing` -> `Shipped` -> `Delivered` -> `Cancelled` -> `Refunded`).
  - Analytics & Reports exporter with metrics aggregation.
  - Audit Log viewer tracking security and administrative events.

- **Backend Architecture**:
  - Express REST API with modular controllers, services, repositories, and models.
  - Authentication engine with JWT token issuance, password hashing simulation, and Role-Based Access Control (RBAC).
  - Automated Mock Data Seeder populating realistic products, users, orders, reviews, and transaction logs.
  - Dynamic Tax & Discount Rules engines supporting multi-jurisdiction rate calculations.
  - Standalone Unit & Integration test suites.
  - Automated Zip Packaging utility script.

---

## Project Structure

```
project-1/
├── server.js               # Entry point for express web server
├── package.json            # Scripts & project dependencies
├── .gitignore              # Security gitignore configuration
├── .env.example            # Environment configuration template
├── public/                 # Storefront & Admin HTML, CSS, JS static assets
│   ├── css/                # main.css, storefront.css, admin.css, components.css
│   ├── js/                 # api.js, auth.js, cart.js, storefront.js, checkout.js, admin.js
│   ├── index.html          # Main Storefront Catalog
│   ├── product.html        # Product Detail View
│   ├── cart.html           # Cart Overview
│   ├── checkout.html       # Checkout Wizard
│   ├── orders.html         # Customer Order Tracker
│   └── admin.html          # Admin Dashboard Portal
├── src/                    # Backend Source Code
│   ├── config/             # Environment & System Enums
│   ├── controllers/        # REST Route Controllers
│   ├── middleware/         # Auth, RBAC, Rate Limiting, Audit Log, Error Handlers
│   ├── models/             # Data Models & Schemas
│   ├── repositories/       # Persistent Repository Layer
│   ├── routes/             # Express API Routers
│   ├── services/           # Business Logic Domain Services
│   └── utils/              # Tax, Discount, Validator & Logger utilities
├── scripts/                # Data Seeder & Packaging Scripts
│   ├── seed.js             # High-volume seed data generator
│   └── package-zip.js      # Zip archiving compiler utility
└── tests/                  # Unit and Integration Test Suites
    ├── taxEngine.test.js
    ├── discountEngine.test.js
    ├── orderStateMachine.test.js
    ├── inventoryService.test.js
    └── runTests.js
```

---

## Quick Start Guide

### 1. Install Dependencies
```bash
npm install
```

### 2. Seed Mock Data
```bash
npm run seed
```

### 3. Run Test Suite
```bash
npm run test
```

### 4. Start Application
```bash
npm start
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### 5. Build Package Zip Archive
```bash
npm run build
```
This command runs the data seeder, executes the full test suite, and compiles the entire application into `omnicommerce-enterprise.zip` in the project root.

---

## Security & Compliance

- No GPL / open-source copy-pasting; proprietary modular architecture.
- No hardcoded API keys or sensitive credentials.
- `.gitignore` configured to ensure environment files (`.env`) are never committed.
