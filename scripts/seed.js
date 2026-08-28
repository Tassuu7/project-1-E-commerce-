/**
 * Automated Seed Data Generator
 * Populates realistic products, categories, admin users, reviews, orders, and inventory records
 * OmniCommerce Enterprise
 */

const {
  userRepository,
  productRepository,
  categoryRepository,
  reviewRepository,
  orderRepository
} = require('../src/repositories');

const { USER_ROLES, ORDER_STATUS, PAYMENT_STATUS } = require('../src/config/constants');
const { generateSKU, hashPassword, generateOrderNumber, generateTrackingNumber } = require('../src/utils/helpers');
const logger = require('../src/utils/logger');

function seedDatabase() {
  logger.info('Starting database seeding process...');

  // 1. Seed Categories
  categoryRepository.clear();
  const categories = [
    categoryRepository.create({ name: 'Electronics', description: 'Gadgets, devices, and accessories', icon: 'cpu' }),
    categoryRepository.create({ name: 'Apparel & Fashion', description: 'Clothing, footwear, and accessories', icon: 'shirt' }),
    categoryRepository.create({ name: 'Home & Kitchen', description: 'Appliances, furniture, and cookware', icon: 'home' }),
    categoryRepository.create({ name: 'Books & Office', description: 'Stationery, literature, and supplies', icon: 'book' }),
    categoryRepository.create({ name: 'Sports & Fitness', description: 'Exercise gear and outdoor equipment', icon: 'activity' })
  ];

  logger.info(`Seeded ${categories.length} categories.`);

  // 2. Seed Admin and Customer Users
  userRepository.clear();
  const adminUser = userRepository.create({
    name: 'Administrator',
    email: 'admin@omnicommerce.com',
    password: 'AdminPassword2026!',
    role: USER_ROLES.ADMIN
  });

  const customerUser = userRepository.create({
    name: 'Jane Customer',
    email: 'jane@example.com',
    password: 'CustomerPassword123!',
    role: USER_ROLES.CUSTOMER
  });

  logger.info(`Seeded users: Admin (${adminUser.email}), Customer (${customerUser.email})`);

  // 3. Seed Catalog Products
  productRepository.clear();
  const sampleProductsData = [
    { name: 'OmniBook Pro 15 Laptop', category: 'Electronics', price: 1299.99, salePrice: 1199.99, stock: 45, description: 'High-performance laptop with 16-Core CPU and 32GB RAM.' },
    { name: 'Noise-Canceling Wireless Headphones', category: 'Electronics', price: 249.99, stock: 120, description: 'Premium active noise cancellation with 40-hour battery life.' },
    { name: 'UltraHD 4K Curved Monitor 34-Inch', category: 'Electronics', price: 599.99, salePrice: 549.99, stock: 30, description: 'Immersive ultrawide monitor with 144Hz refresh rate.' },
    { name: 'Ergonomic Office Executive Chair', category: 'Home & Kitchen', price: 329.99, stock: 15, description: 'Breathable mesh lumbar support with adjustable armrests.' },
    { name: 'Smart RGB LED Desk Lamp', category: 'Home & Kitchen', price: 49.99, stock: 200, description: 'App-controlled dimmable LED lamp with wireless charger base.' },
    { name: 'Organic Cotton Oxford Shirt', category: 'Apparel & Fashion', price: 69.99, stock: 85, description: '100% organic long-sleeve button-down shirt.' },
    { name: 'Waterproof All-Weather Jacket', category: 'Apparel & Fashion', price: 149.99, stock: 50, description: 'Breathable windproof jacket built for outdoor exploration.' },
    { name: 'Professional Stainless Steel Cookware Set', category: 'Home & Kitchen', price: 299.99, stock: 25, description: '10-piece induction-compatible tri-ply stainless steel set.' },
    { name: 'Hardcover Enterprise Architecture Guide', category: 'Books & Office', price: 59.99, stock: 300, description: 'Comprehensive guide to scaling microservices and distributed systems.' },
    { name: 'Adjustable Dumbbell Set 50lbs', category: 'Sports & Fitness', price: 199.99, stock: 40, description: 'Compact fast-adjust dumbbell pair for home workout.' }
  ];

  const seededProducts = sampleProductsData.map(p => productRepository.create(p));
  logger.info(`Seeded ${seededProducts.length} products.`);

  // 4. Seed Product Reviews
  reviewRepository.clear();
  seededProducts.slice(0, 5).forEach(p => {
    reviewRepository.create({
      productId: p.id,
      userId: customerUser.id,
      userName: customerUser.name,
      rating: 5,
      title: 'Outstanding quality!',
      comment: 'Arrived quickly and exceeded all my expectations. Highly recommended.'
    });
  });
  logger.info('Seeded customer reviews.');

  // 5. Seed Historical Orders
  orderRepository.clear();
  const sampleOrders = [
    {
      orderNumber: generateOrderNumber(),
      userId: customerUser.id,
      customerName: customerUser.name,
      customerEmail: customerUser.email,
      items: [
        { productId: seededProducts[0].id, name: seededProducts[0].name, price: seededProducts[0].effectivePrice, quantity: 1, sku: seededProducts[0].sku }
      ],
      subtotal: seededProducts[0].effectivePrice,
      discountAmount: 0,
      taxAmount: 95.99,
      shippingAmount: 0,
      grandTotal: seededProducts[0].effectivePrice + 95.99,
      paymentMethod: 'STRIPE_CREDIT_CARD',
      paymentStatus: PAYMENT_STATUS.CAPTURED,
      orderStatus: ORDER_STATUS.DELIVERED,
      trackingNumber: generateTrackingNumber('FedEx')
    },
    {
      orderNumber: generateOrderNumber(),
      userId: customerUser.id,
      customerName: customerUser.name,
      customerEmail: customerUser.email,
      items: [
        { productId: seededProducts[1].id, name: seededProducts[1].name, price: seededProducts[1].effectivePrice, quantity: 2, sku: seededProducts[1].sku }
      ],
      subtotal: seededProducts[1].effectivePrice * 2,
      discountAmount: 20.00,
      taxAmount: 38.39,
      shippingAmount: 9.99,
      grandTotal: (seededProducts[1].effectivePrice * 2) - 20.00 + 38.39 + 9.99,
      paymentMethod: 'PAYPAL',
      paymentStatus: PAYMENT_STATUS.CAPTURED,
      orderStatus: ORDER_STATUS.PROCESSING,
      trackingNumber: generateTrackingNumber('UPS')
    }
  ];

  sampleOrders.forEach(o => orderRepository.create(o));
  logger.info(`Seeded ${sampleOrders.length} sample orders.`);

  logger.info('Database seeding completed successfully!');
}

if (require.main === module) {
  seedDatabase();
}

module.exports = seedDatabase;
