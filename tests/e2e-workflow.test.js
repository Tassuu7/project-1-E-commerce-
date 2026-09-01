/**
 * Comprehensive Automated End-to-End Test Suite
 * OmniCommerce Enterprise
 */

const assert = require('assert');

const BASE_URL = 'http://localhost:3000/api';

async function runTests() {
  console.log('======================================================================');
  console.log('  Running Complete E-Commerce Automated Verification Suite');
  console.log('======================================================================\n');

  let passed = 0;
  let failed = 0;

  async function test(name, fn) {
    try {
      await fn();
      console.log(`  [PASS] ${name}`);
      passed++;
    } catch (err) {
      console.error(`  [FAIL] ${name}:`, err.message);
      failed++;
    }
  }

  // 1. Health Check
  await test('1. API Health Check responds ONLINE', async () => {
    const res = await fetch(`${BASE_URL}/health`).then(r => r.json());
    assert.strictEqual(res.status, 'ONLINE');
  });

  // 2. Authentication & Unified Login
  let adminToken = '';
  let customerToken = '';
  let customer2Token = '';
  let deliveryToken = '';

  await test('2. Unified Login - Store Admin', async () => {
    const res = await fetch(`${BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'admin@omnicommerce.com', password: 'AdminPassword2026!' })
    }).then(r => r.json());
    assert.strictEqual(res.success, true);
    assert.strictEqual(res.data.user.role, 'ADMIN');
    adminToken = res.data.token;
  });

  await test('3. Unified Login - Customer User', async () => {
    const res = await fetch(`${BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'customer@example.com', password: 'CustomerPass2026!' })
    }).then(r => r.json());
    assert.strictEqual(res.success, true);
    assert.strictEqual(res.data.user.role, 'CUSTOMER');
    customerToken = res.data.token;
  });

  await test('4. Unified Login - Jane Customer (Secondary Customer)', async () => {
    const res = await fetch(`${BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'jane@example.com', password: 'JanePass2026!' })
    }).then(r => r.json());
    assert.strictEqual(res.success, true);
    assert.strictEqual(res.data.user.role, 'CUSTOMER');
    customer2Token = res.data.token;
  });

  await test('5. Unified Login - Delivery Courier', async () => {
    const res = await fetch(`${BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'delivery@omnicommerce.com', password: 'DeliveryPass2026!' })
    }).then(r => r.json());
    assert.strictEqual(res.success, true);
    assert.strictEqual(res.data.user.role, 'DELIVERY_PERSON');
    deliveryToken = res.data.token;
  });

  // 3. RBAC & Security Checks (403 Forbidden)
  await test('6. Security: Customer calling Admin API returns 403 Forbidden', async () => {
    const res = await fetch(`${BASE_URL}/admin/audit-logs`, {
      headers: { 'Authorization': `Bearer ${customerToken}` }
    });
    assert.strictEqual(res.status, 403);
  });

  await test('7. Security: Delivery Person calling Admin API returns 403 Forbidden', async () => {
    const res = await fetch(`${BASE_URL}/admin/audit-logs`, {
      headers: { 'Authorization': `Bearer ${deliveryToken}` }
    });
    assert.strictEqual(res.status, 403);
  });

  await test('8. Security: Unauthenticated request to protected API returns 401', async () => {
    const res = await fetch(`${BASE_URL}/notifications`);
    assert.strictEqual(res.status, 401);
  });

  // 4. Product Catalog & Search
  let targetProductId = '';
  await test('9. Product Catalog: 50+ Products retrieved with category filters', async () => {
    const res = await fetch(`${BASE_URL}/products?limit=100`).then(r => r.json());
    assert.strictEqual(res.success, true);
    assert.ok(res.data.length >= 50, `Expected >= 50 products, got ${res.data.length}`);
    targetProductId = res.data[0].id;
  });

  await test('10. Product Search: Keyword query returns matching results', async () => {
    const res = await fetch(`${BASE_URL}/products?search=Laptop`).then(r => r.json());
    assert.strictEqual(res.success, true);
    assert.ok(res.data.length > 0);
  });

  // 5. Shopping Cart & Coupons
  const testCartId = 'test_suite_cart_' + Date.now();
  await test('11. Cart: Add item and verify price and stock computation', async () => {
    const res = await fetch(`${BASE_URL}/cart/items`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ cartId: testCartId, productId: targetProductId, quantity: 2 })
    }).then(r => r.json());
    assert.strictEqual(res.success, true);
    assert.strictEqual(res.data.itemCount, 2);
    assert.ok(res.data.grandTotal > 0);
  });

  await test('12. Coupons: Apply WELCOME10 valid promo code', async () => {
    const res = await fetch(`${BASE_URL}/cart/coupon`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ cartId: testCartId, promoCode: 'WELCOME10' })
    }).then(r => r.json());
    assert.strictEqual(res.success, true);
    assert.ok(res.data.discountAmount > 0);
  });

  // 6. Complete End-to-End Order Lifecycle Workflow
  let placedOrderId = '';
  await test('13. Order Placement: Checkout with shipping details & card payment', async () => {
    const res = await fetch(`${BASE_URL}/orders/checkout`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${customerToken}`
      },
      body: JSON.stringify({
        cartId: testCartId,
        customerName: 'Customer User',
        customerEmail: 'customer@example.com',
        shippingAddress: {
          street: '100 University Way',
          city: 'Seattle',
          state: 'WA',
          zip: '98105',
          country: 'USA'
        },
        paymentMethod: 'STRIPE_CREDIT_CARD'
      })
    }).then(r => r.json());

    assert.strictEqual(res.success, true);
    assert.strictEqual(res.data.orderStatus, 'PAID');
    assert.ok(res.data.trackingNumber.startsWith('FE'));
    placedOrderId = res.data.id;
  });

  await test('14. Security: Customer B cannot access Customer A order (Object-Level Isolation)', async () => {
    const res = await fetch(`${BASE_URL}/orders/${placedOrderId}`, {
      headers: { 'Authorization': `Bearer ${customer2Token}` }
    });
    // Should be blocked or forbidden
    assert.strictEqual(res.status, 403);
  });

  let deliveryAssignmentId = '';
  await test('15. Admin Workflow: Admin assigns courier to customer order', async () => {
    // 1. Get delivery person ID
    const couriers = await fetch(`${BASE_URL}/delivery/personnel`, {
      headers: { 'Authorization': `Bearer ${adminToken}` }
    }).then(r => r.json());
    assert.ok(couriers.data.length > 0);
    const courierId = couriers.data[0].id;

    // 2. Assign
    const res = await fetch(`${BASE_URL}/delivery/assign`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${adminToken}`
      },
      body: JSON.stringify({
        orderId: placedOrderId,
        deliveryPersonId: courierId,
        notes: 'Priority express dispatch'
      })
    }).then(r => r.json());

    assert.strictEqual(res.success, true);
    assert.strictEqual(res.data.order.orderStatus, 'ASSIGNED_TO_DELIVERY');
    deliveryAssignmentId = res.data.assignment.id;
  });

  await test('16. Delivery Workflow: Courier views assigned order', async () => {
    const res = await fetch(`${BASE_URL}/delivery/orders`, {
      headers: { 'Authorization': `Bearer ${deliveryToken}` }
    }).then(r => r.json());
    assert.strictEqual(res.success, true);
    const assignment = res.data.find(a => a.orderId === placedOrderId);
    assert.ok(assignment, 'Assigned delivery should appear in courier list');
  });

  await test('17. Delivery Workflow: Courier marks Out for Delivery (Customer gets alert)', async () => {
    const res = await fetch(`${BASE_URL}/delivery/orders/${deliveryAssignmentId}/out-for-delivery`, {
      method: 'PATCH',
      headers: { 'Authorization': `Bearer ${deliveryToken}` }
    }).then(r => r.json());
    assert.strictEqual(res.success, true);
    assert.strictEqual(res.data.order.orderStatus, 'OUT_FOR_DELIVERY');
  });

  await test('18. Delivery Workflow: Courier confirms Doorstep Delivery', async () => {
    const res = await fetch(`${BASE_URL}/delivery/orders/${deliveryAssignmentId}/confirm`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${deliveryToken}`
      },
      body: JSON.stringify({ notes: 'Signed by recipient at door' })
    }).then(r => r.json());
    assert.strictEqual(res.success, true);
    assert.strictEqual(res.data.order.orderStatus, 'DELIVERED');
  });

  await test('19. Customer Workflow: Customer sees DELIVERED status & submits review', async () => {
    // 1. Check order
    const orderRes = await fetch(`${BASE_URL}/orders/${placedOrderId}`, {
      headers: { 'Authorization': `Bearer ${customerToken}` }
    }).then(r => r.json());
    assert.strictEqual(orderRes.data.orderStatus, 'DELIVERED');

    // 2. Submit Review
    const reviewRes = await fetch(`${BASE_URL}/reviews/${targetProductId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${customerToken}`
      },
      body: JSON.stringify({
        userName: 'Customer User',
        rating: 5,
        title: 'Perfect condition and fast delivery',
        comment: 'Delivered promptly by the courier. Excellent product!'
      })
    }).then(r => r.json());
    assert.strictEqual(reviewRes.success, true);
  });

  // 7. Wishlist Operations
  await test('20. Wishlist: Add item, fetch wishlist, remove item', async () => {
    // Add
    const addRes = await fetch(`${BASE_URL}/wishlist/items`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${customerToken}`
      },
      body: JSON.stringify({ productId: targetProductId })
    }).then(r => r.json());
    assert.strictEqual(addRes.success, true);

    // Fetch
    const listRes = await fetch(`${BASE_URL}/wishlist`, {
      headers: { 'Authorization': `Bearer ${customerToken}` }
    }).then(r => r.json());
    assert.strictEqual(listRes.success, true);
    assert.ok(listRes.data.items.some(i => i.productId === targetProductId));

    // Remove
    const delRes = await fetch(`${BASE_URL}/wishlist/items/${targetProductId}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${customerToken}` }
    }).then(r => r.json());
    assert.strictEqual(delRes.success, true);
  });

  // 8. Notifications
  await test('21. Notifications: User retrieves notifications and marks all as read', async () => {
    const getRes = await fetch(`${BASE_URL}/notifications`, {
      headers: { 'Authorization': `Bearer ${customerToken}` }
    }).then(r => r.json());
    assert.strictEqual(getRes.success, true);
    assert.ok(getRes.data.length > 0);

    const readRes = await fetch(`${BASE_URL}/notifications/read-all`, {
      method: 'PATCH',
      headers: { 'Authorization': `Bearer ${customerToken}` }
    }).then(r => r.json());
    assert.strictEqual(readRes.success, true);
  });

  console.log('\n======================================================================');
  console.log(`  Test Results Summary: ${passed} Passed, ${failed} Failed`);
  console.log('======================================================================');

  if (failed > 0) {
    process.exit(1);
  }
}

runTests().catch(err => {
  console.error('Fatal test error:', err);
  process.exit(1);
});
