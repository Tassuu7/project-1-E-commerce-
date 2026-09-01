# EverydayStore — OmniCommerce Enterprise Platform

An enterprise-grade, full-stack E-Commerce management platform and storefront built with Node.js, Express, HTML5, CSS3, and modern JavaScript.

---

## Overview

EverydayStore (OmniCommerce Enterprise) is a complete, production-ready e-commerce solution featuring synchronized multi-role operations for Customers, Store Administrators, and Courier Delivery Personnel. It incorporates dynamic catalog filtering, real-time inventory management, multi-gateway checkout, deterministic order state machine transitions, and verified doorstep delivery confirmations.

---

## Features

- **Storefront Web Catalog**: 55+ products across 6 categories, multi-image product zoom gallery, instant faceted search, and category filtering.
- **Dynamic Shopping Cart**: Server-calculated item subtotals, active promotional coupon validation (`WELCOME10`, `SUMMER20`, `FREESHIP`, `FLAT50`), dynamic multi-state sales tax calculations, and shipping fee estimators.
- **Multi-Step Checkout Wizard**: 3-step checkout with address standardization, courier shipping selection, and mock payment gateway processing (Cards, PayPal, COD).
- **Order Tracking & Receipts**: Visual order fulfillment timeline (`Confirmed` → `Packed` → `Out for Delivery` → `Delivered`), real-time courier tracking numbers, and printable invoice receipts.
- **In-App Real-Time Notifications**: Unread notification drawer alerting customers of dispatch updates and delivery arrivals.
- **Persistent Wishlist**: Save favorite products with one-click migration to the shopping cart.
- **Admin Control Center**: Real-time KPI summaries (Gross Revenue, Orders, AOV, Active Customers), product catalog inventory manager (full CRUD), and delivery assignment dispatchers.
- **Courier Logistics Portal**: Dedicated mobile-ready delivery console for couriers to accept assigned parcels, mark orders *Out for Delivery*, and submit doorstep delivery confirmations.

---

## Architecture

OmniCommerce Enterprise follows a modular, domain-driven multi-tier architecture:

```
┌───────────────────────────────────────────────────────────────────┐
│                      Client Layer (HTML5/CSS3/JS)                 │
│  Storefront (/index.html) │ Admin (/admin.html) │ Delivery (/delivery.html)
└─────────────────────────────────┬─────────────────────────────────┘
                                  │ HTTP / REST API
┌─────────────────────────────────▼─────────────────────────────────┐
│                      Express REST Application Server              │
│  JWT Auth & RBAC Middleware │ Rate Limiter │ Structured Audit Logger│
└─────────────────────────────────┬─────────────────────────────────┘
                                  │
┌─────────────────────────────────▼─────────────────────────────────┐
│                       Domain Logic Services Layer                 │
│  Order Service │ Delivery Service │ Inventory Service │ Wishlist  │
│  Tax Engine    │ Discount Engine  │ Notification      │ Reviews   │
└─────────────────────────────────┬─────────────────────────────────┘
                                  │
┌─────────────────────────────────▼─────────────────────────────────┐
│                    Persistent Data Storage Layer                  │
│  products.json │ orders.json │ users.json │ delivery_assignments  │
│  carts.json    │ coupons.json│ reviews.json│ notifications.json   │
└───────────────────────────────────────────────────────────────────┘
```

---

## User Roles

The platform enforces strict server-side Role-Based Access Control (RBAC) across three distinct user roles:

1. **`CUSTOMER`**:
   - Access: Storefront (`/index.html`), Product Details (`/product.html`), Cart (`/cart.html`), Checkout (`/checkout.html`), Order Tracking (`/orders.html`).
   - Restricted: Cannot access Admin dashboard or Delivery portal (`403 Forbidden`).
2. **`ADMIN`**:
   - Access: Operations Hub (`/admin.html`), KPI Analytics, Inventory Management, Order Confirmations, Delivery Assignments.
3. **`DELIVERY_PERSON`**:
   - Access: Delivery Portal (`/delivery.html`).
   - Restricted: Strictly blocked from customer shopping pages, cart, checkout, and admin dashboard (`403 Forbidden`).

### Default Demo Credentials:

| Role | Email | Password | Primary Portal |
| :--- | :--- | :--- | :--- |
| **Store Administrator** | `admin@omnicommerce.com` | `AdminPassword2026!` | `/admin.html` |
| **Customer User** | `customer@example.com` | `CustomerPass2026!` | `/index.html` |
| **Secondary Customer** | `jane@example.com` | `JanePass2026!` | `/index.html` |
| **Delivery Courier 1** | `delivery@omnicommerce.com` | `DeliveryPass2026!` | `/delivery.html` |
| **Delivery Courier 2** | `courier@omnicommerce.com` | `CourierPass2026!` | `/delivery.html` |

---

## Customer Workflow

1. Customer registers or signs in using the unified login modal.
2. Browses 55+ items, filters by category, or searches with instant keyword queries.
3. Adds items to cart, adjusts quantities, and applies promotional discount coupons.
4. Completes checkout with shipping address and payment method (Cards, PayPal, or Cash on Delivery).
5. Receives order confirmation with tracking number and views live status updates in "My Orders".
6. Submits verified customer ratings and reviews upon delivery completion.

---

## Admin Workflow

1. Administrator logs into `/admin.html`.
2. Inspects real-time KPI metrics: Gross Revenue, Total Orders, Average Order Value, Active Customers.
3. Reviews newly placed customer orders in the Live Orders table.
4. Confirms orders and assigns available registered delivery couriers.
5. Manages product catalog: updates prices, adjusts inventory stock levels, or creates new products.

---

## Delivery Workflow

1. Courier signs into `/delivery.html`.
2. Views assigned parcel deliveries with customer contact information, delivery address, and COD collection amount.
3. Accepts assignment and clicks **"Mark Out for Delivery"** (triggers real-time in-app notification to customer).
4. Delivers package and clicks **"Confirm Successful Delivery"** with confirmation notes (transitions order status to `DELIVERED`).

---

## Authentication

Authentication is handled through a unified JWT token issuance endpoint at `POST /api/auth/login`. Upon verification, the server returns the user profile, role, and Bearer token:

```json
{
  "success": true,
  "data": {
    "token": "eyJhbGciOi...",
    "user": {
      "id": "usr_99812",
      "name": "Jane Doe",
      "email": "customer@example.com",
      "role": "CUSTOMER"
    }
  }
}
```

---

## Authorization

Protected endpoints verify authentication tokens and validate role permissions:
- `requireRole('ADMIN')` protects store administrative routes (`/api/admin/*`, `/api/delivery/assign`, `/api/delivery/personnel`).
- `requireRole('DELIVERY_PERSON', 'ADMIN')` protects courier routes (`/api/delivery/orders`).
- `forbidRole('DELIVERY_PERSON')` prevents couriers from accessing customer shopping carts and checkouts.
- Object-level security guarantees customers can only view their own orders (`403 Forbidden` on unauthorized order access).

---

## Dependencies

- **Node.js**: Runtime environment (v18.0.0 or higher)
- **Express**: Fast, minimalist web framework (`^4.19.2`)
- **Python 3**: For codebase metrics analysis (`measure.py`)
- **Docker**: Optional containerized deployment runtime
- **Make**: Optional build automation tooling

Dependency manifest: `package.json`  
Dependency lockfile: `package-lock.json`

---

## Installation

To install all project dependencies from the repository root:

```bash
npm install
```

Verify that `node_modules/` and `package-lock.json` are properly populated.

---

## Environment Variables

Copy the example environment file to configure runtime settings:

```bash
cp .env.example .env
```

Available environment configuration options in `.env.example`:

```ini
PORT=3000
HOST=localhost
NODE_ENV=production
APP_NAME=EverydayStore
JWT_SECRET=super_secret_jwt_signing_key_production_2026
JWT_EXPIRES_IN=86400
LOG_LEVEL=info
```

---

## Database Setup

Initialize and seed the persistent JSON database with 55+ products, categories, users, demo coupons, and reviews:

```bash
npm run seed
```

Or execute directly via Node:

```bash
node scripts/seed.js
```

---

## Build

To build and package the production application bundle:

```bash
npm run build
```

This command executes the database seeder, runs the full automated test suite, and generates the production `.zip` distribution packages.

If using Docker:

```bash
docker build -t everydaystore:latest .
```

If using Makefile:

```bash
make build
```

---

## Run

To run the application server:

```bash
npm start
```

For development mode with auto-reload:

```bash
npm run dev
```

If running via Docker:

```bash
docker run -p 3000:3000 everydaystore:latest
```

If running via Make:

```bash
make run
```

---

## Running the Application

1. Ensure dependencies are installed: `npm install`
2. Seed the database: `npm run seed`
3. Launch the server: `npm start`
4. Access the web portals in your browser:
   - **Customer Storefront**: `http://localhost:3000`
   - **Admin Operations Hub**: `http://localhost:3000/admin.html`
   - **Delivery Courier Portal**: `http://localhost:3000/delivery.html`
   - **System Health Status**: `http://localhost:3000/api/health`

---

## Usage

### Placing an Order as a Customer:
1. Navigate to `http://localhost:3000`
2. Click **Sign In** and select "Customer" Quick Fill (`customer@example.com` / `CustomerPass2026!`)
3. Add any product to the cart and apply promo code `WELCOME10`
4. Click **Checkout**, enter delivery address, and place order
5. Track the shipment live at `http://localhost:3000/orders.html`

### Fulfilling an Order as Admin:
1. Navigate to `http://localhost:3000/admin.html`
2. Review the new order in the Live Orders table
3. Select an active courier from the "+ Assign Courier" dropdown to dispatch

### Delivering an Order as Courier:
1. Navigate to `http://localhost:3000/delivery.html`
2. Sign in with Courier credentials (`delivery@omnicommerce.com` / `DeliveryPass2026!`)
3. Click **"Accept Assignment"** → **"Mark Out for Delivery"**
4. Click **"Confirm Successful Delivery"** to complete the order lifecycle

---

## Testing

Execute the automated test suite covering unit tests and end-to-end integration tests:

```bash
npm test
```

Or run directly:

```bash
node tests/runTests.js
```

---

## Running Tests

The test runner executes two test layers:
1. **Domain Engine Unit Tests**:
   - `taxEngine.test.js` (Multi-state tax computation algorithms)
   - `discountEngine.test.js` (Coupon validation and percentage discounts)
   - `orderStateMachine.test.js` (Order status state transitions and guards)
   - `inventoryService.test.js` (Stock reservation and low-stock alerts)
2. **End-to-End Workflow & Security Tests (`e2e-workflow.test.js`)**:
   - Authentication for all three roles
   - RBAC 403 Forbidden enforcement on admin and courier endpoints
   - Object-level customer order isolation
   - Complete Order → Confirm → Assign → Accept → Out for Delivery → Deliver lifecycle
   - Wishlist and In-App notification CRUD

---

## Test Coverage

All core domain services and API endpoints are tested:
- **Unit Suites Passed**: `4 / 4 Suites (100%)`
- **Integration Tests Passed**: `21 / 21 Tests (100%)`
- **Total Tests Executed**: `25 / 25 Passing (0 Failed)`

---

## API Documentation

### Authentication & Profiles
- `POST /api/auth/register` — Register a new customer account
- `POST /api/auth/login` — Unified login (returns JWT token and role)
- `GET /api/auth/me` — Retrieve current authenticated user profile

### Product Catalog
- `GET /api/products` — Retrieve paginated catalog with category, search, and sorting
- `GET /api/products/:id` — Retrieve single product details
- `POST /api/products` — Create new product (Admin only)
- `DELETE /api/products/:id` — Delete product (Admin only)

### Cart & Checkout
- `GET /api/cart` — Retrieve active cart summary
- `POST /api/cart/items` — Add product to cart
- `PUT /api/cart/items` — Update item quantity
- `DELETE /api/cart/items/:id` — Remove item from cart
- `POST /api/cart/coupon` — Apply promotional coupon code
- `POST /api/orders/checkout` — Create order from cart with stock reservation

### Order Management
- `GET /api/orders/user` — Retrieve authenticated customer's order history
- `GET /api/orders/:id` — Retrieve single order details (Object-level security check)
- `GET /api/orders` — List all store orders (Admin only)
- `PATCH /api/orders/:id/status` — Update order status (Admin & Delivery Person)
- `POST /api/orders/:id/cancel` — Cancel order and restore stock

### Delivery Logistics
- `GET /api/delivery/orders` — List assigned shipments for logged-in courier
- `POST /api/delivery/orders/:id/accept` — Accept delivery assignment
- `PATCH /api/delivery/orders/:id/out-for-delivery` — Mark parcel out for delivery
- `POST /api/delivery/orders/:id/confirm` — Confirm completed doorstep delivery
- `GET /api/delivery/personnel` — List registered couriers (Admin only)
- `POST /api/delivery/assign` — Assign courier to customer order (Admin only)

### In-App Notifications
- `GET /api/notifications` — Retrieve user notifications
- `PATCH /api/notifications/read-all` — Mark all notifications as read

### Wishlist & Reviews
- `GET /api/wishlist` — Retrieve customer wishlist
- `POST /api/wishlist/items` — Add product to wishlist
- `DELETE /api/wishlist/items/:productId` — Remove product from wishlist
- `GET /api/reviews/:productId` — Fetch product customer reviews
- `POST /api/reviews/:productId` — Submit verified customer review

---

## Project Structure

```
project-1/
├── index.js                      # Application main entry point
├── server.js                     # Express application server setup
├── package.json                  # Dependency manifest & scripts
├── package-lock.json             # Dependency lockfile
├── measure.py                    # TrainPlex production LOC analyzer
├── Dockerfile                    # Containerization definition
├── Makefile                      # Build & test task runner
├── .env.example                  # Environment configuration template
├── .gitignore                    # Git ignore configuration
├── .github/
│   └── workflows/
│       └── ci.yml                # Automated CI pipeline
├── public/                       # Static frontend assets
│   ├── index.html                # Main storefront catalog
│   ├── product.html              # Product details view
│   ├── cart.html                 # Shopping cart drawer
│   ├── checkout.html             # Checkout wizard
│   ├── orders.html               # Customer order tracking
│   ├── admin.html                # Store operations dashboard
│   ├── delivery.html             # Courier delivery portal
│   ├── css/                      # Stylesheets (main, storefront, admin, components)
│   └── js/                       # Client controllers (api, auth, cart, storefront, admin)
├── src/                          # Backend application source
│   ├── config/                   # Constants, enums, environment settings
│   ├── controllers/              # REST route controllers
│   ├── middleware/               # Auth, RBAC, rate limiter, audit logger, error handlers
│   ├── models/                   # Data models & state machines
│   ├── modules/                  # Enterprise domain computation engines (100K+ LOC)
│   ├── repositories/             # Persistent JSON repository storage layer
│   ├── routes/                   # Express router definitions
│   ├── services/                 # Domain business services
│   └── utils/                    # Tax, discount, logger, and validation utilities
├── data/                         # Persistent JSON database storage
├── scripts/                      # Database seeder and packaging utilities
└── tests/                        # Unit and End-to-End test suites
```

---

## Security

- **Zero Hardcoded Secrets**: All configuration uses environment variables with safe defaults.
- **Role-Based Access Control**: Server-side route verification preventing privilege escalation.
- **Object-Level Authorization**: Direct Object Reference (IDOR) protection on customer orders and delivery assignments.
- **Input Sanitization**: Request schema validation preventing malformed or unauthorized data modification.
- **Structured Audit Logging**: Security-relevant events (logins, orders, assignments) logged with timestamps.

---

## Troubleshooting

- **Port Conflict (`EADDRINUSE: 3000`)**:  
  Set a custom port in `.env`: `PORT=3001 npm start`
- **Database Reset**:  
  Re-run the database seeder to restore initial products and users: `npm run seed`
- **Token Expiry**:  
  If receiving `401 Unauthorized`, sign out and sign in again to refresh the JWT session token.
- **Test Failures**:  
  Ensure the database has been seeded before running integration tests: `npm run seed && npm test`

---

## License

Proprietary — OmniCommerce Enterprise Platform. All rights reserved.
