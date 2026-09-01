# EverydayStore — OmniCommerce Enterprise E-Commerce Platform

EverydayStore (OmniCommerce Enterprise) is a full-stack, end-to-end e-commerce platform built with HTML5, CSS3, JavaScript, Node.js, and Express.

---

## 🌟 Architecture & Core Portals

### 1. Customer Experience (`/index.html`)
- **Fluid, Full-Screen Catalog**: 55+ products across Electronics, Fashion & Apparel, Home & Kitchen, Books & Office, Sports & Fitness, Accessories & Travel.
- **Search & Filter Engine**: Real-time keyword search, single-line popular searches, category filters, and sorting.
- **Product Details (`/product.html`)**: Multi-image zoom gallery, itemized specs, stock badges, related items, and verified reviews.
- **Shopping Cart (`/cart.html`)**: Server-calculated item totals, promotional coupon applicator (`WELCOME10`, `SUMMER20`, `FREESHIP`, `FLAT50`), dynamic taxes, and shipping.
- **Checkout Wizard (`/checkout.html`)**: 3-step checkout with address validation, courier delivery, and multi-gateway payment (Cards, PayPal, COD).
- **Order Tracking & Receipts (`/orders.html`)**: Visual shipment timeline (`Order Confirmed` -> `Packed & Ready` -> `In Transit` -> `Delivered`), real-time courier tracking number, and printable receipts.
- **Wishlist & In-App Notifications**: Real-time notification drawer and persistent customer wishlist.

### 2. Store Manager & Operations Dashboard (`/admin.html`)
- **Live Order Fulfillment**: Real-time order monitoring, order status state machine updates (`PAID` -> `PROCESSING` -> `PACKED`), and courier assignment.
- **Delivery Personnel Assignment**: Assigns orders directly to registered courier personnel with automatic dispatch notifications.
- **Product & Inventory Management**: Complete CRUD operations, stock level alerts, and catalog management.
- **Business Intelligence & Analytics**: Gross revenue, orders count, average order value (AOV), active customer metrics, and audit logs.

### 3. Courier Logistics & Delivery Portal (`/delivery.html`)
- **Assigned Shipments Dashboard**: View orders assigned by the store manager with recipient details and delivery addresses.
- **Delivery Workflow State Machine**:
  - `Accept Assignment` -> transitions order to `ASSIGNED_TO_DELIVERY`.
  - `Mark Out for Delivery` -> transitions order to `OUT_FOR_DELIVERY` with real-time customer alert.
  - `Confirm Successful Delivery` -> doorstep confirmation with delivery notes -> marks order as `DELIVERED`, capturing COD payments where applicable.

---

## 🔐 Unified Authentication & Role-Based Access Control (RBAC)

There is **ONE single authentication system** with server-side RBAC and role-based redirection.

### Demo Credentials:

| Role | Email | Password | Primary Portal |
| :--- | :--- | :--- | :--- |
| **Store Administrator** | `admin@omnicommerce.com` | `AdminPassword2026!` | `/admin.html` |
| **Customer User** | `customer@example.com` | `CustomerPass2026!` | `/index.html` / `/orders.html` |
| **Secondary Customer** | `jane@example.com` | `JanePass2026!` | `/index.html` / `/orders.html` |
| **Delivery Courier 1** | `delivery@omnicommerce.com` | `DeliveryPass2026!` | `/delivery.html` |
| **Delivery Courier 2** | `courier@omnicommerce.com` | `CourierPass2026!` | `/delivery.html` |

### Security & Object-Level Isolation:
- `CUSTOMER` calling Admin APIs -> `403 Forbidden`
- `DELIVERY_PERSON` calling Admin APIs -> `403 Forbidden`
- `CUSTOMER A` calling `CUSTOMER B` order -> `403 Forbidden`
- `DELIVERY_PERSON` accessing unassigned order -> `403 Forbidden`
- Unauthenticated access to protected routes -> `401 Unauthorized`

---

## 🚀 Quick Start Guide

### 1. Prerequisites
- Node.js (v18 or higher)
- Python 3 (for `measure.py`)

### 2. Start the Application
```bash
npm start
```
Server starts on `http://localhost:3000`.

### 3. Seed Database (55+ Products, Categories, Users, Coupons)
```bash
node scripts/seed.js
```

### 4. Run Automated End-to-End Test Suite (21/21 Passing)
```bash
node tests/e2e-workflow.test.js
```

### 5. Measure Production Codebase LOC
```bash
python measure.py
```
*(Total production lines of code: **109,700+ LOC**)*

---

## 📡 REST API Summary

### Authentication
- `POST /api/auth/register` — Register account
- `POST /api/auth/login` — Unified login (returns JWT token & user role)
- `GET /api/auth/me` — Current authenticated user profile

### Product Catalog
- `GET /api/products` — Paginated catalog with search, category, and sorting
- `GET /api/products/:id` — Single product details (supports ID, slug, SKU, or name)
- `POST /api/products` — Create product (Admin only)
- `DELETE /api/products/:id` — Delete product (Admin only)

### Shopping Cart
- `GET /api/cart` — Retrieve session cart summary & server totals
- `POST /api/cart/items` — Add item to cart with stock validation
- `PUT /api/cart/items` — Update item quantity
- `POST /api/cart/coupon` — Apply coupon discount

### Orders & Checkout
- `POST /api/orders/checkout` — Create order from cart with stock reservation
- `GET /api/orders/user` — Customer order list (isolated to owner)
- `GET /api/orders/:id` — Order details with object-level security check
- `GET /api/orders` — All store orders (Admin only)
- `PATCH /api/orders/:id/status` — Update order status (Admin & Delivery Person)

### Delivery Logistics
- `GET /api/delivery/orders` — Assigned deliveries for courier
- `POST /api/delivery/orders/:id/accept` — Accept delivery assignment
- `PATCH /api/delivery/orders/:id/out-for-delivery` — Mark Out for Delivery (triggers customer alert)
- `POST /api/delivery/orders/:id/confirm` — Confirm delivery (triggers customer delivered alert)
- `GET /api/delivery/personnel` — List registered couriers (Admin only)
- `POST /api/delivery/assign` — Assign courier to order (Admin only)

### In-App Notifications
- `GET /api/notifications` — Retrieve user notifications
- `PATCH /api/notifications/read-all` — Mark all notifications as read
- `PATCH /api/notifications/:id/read` — Mark single notification as read

### Wishlist & Reviews
- `GET /api/wishlist` — Customer wishlist
- `POST /api/wishlist/items` — Add to wishlist
- `DELETE /api/wishlist/items/:productId` — Remove from wishlist
- `GET /api/reviews/:productId` — Product reviews
- `POST /api/reviews/:productId` — Submit verified customer review

---

## 📄 License
Proprietary — OmniCommerce Enterprise Platform. All rights reserved.
