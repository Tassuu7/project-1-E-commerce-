/**
 * Automated Seed Data Generator with High-Resolution Product Images
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
  logger.info('Starting database seeding process with high-res product images...');

  // 1. Seed Categories
  categoryRepository.clear();
  const categories = [
    categoryRepository.create({ name: 'Electronics', description: 'Premium computers, audio, monitors & smart gadgets', icon: 'cpu' }),
    categoryRepository.create({ name: 'Apparel & Fashion', description: 'Designer clothing, outerwear & premium accessories', icon: 'shirt' }),
    categoryRepository.create({ name: 'Home & Kitchen', description: 'Ergonomic furniture, smart lighting & chef-grade cookware', icon: 'home' }),
    categoryRepository.create({ name: 'Books & Office', description: 'Architecture guides, desk gear & productivity essentials', icon: 'book' }),
    categoryRepository.create({ name: 'Sports & Fitness', description: 'Commercial workout gear, smart fitness & sports apparel', icon: 'activity' }),
    categoryRepository.create({ name: 'Accessories & Travel', description: 'Leather bags, sunglasses, watches & travel gear', icon: 'briefcase' })
  ];

  logger.info(`Seeded ${categories.length} categories.`);

  // 2. Seed Admin and Customer Users
  userRepository.clear();
  const adminUser = userRepository.create({
    name: 'Executive Admin',
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

  // 3. Seed Catalog Products with High-Resolution Product Images
  productRepository.clear();
  const sampleProductsData = [
    {
      name: 'OmniBook Pro 16 M-Max Laptop',
      category: 'Electronics',
      price: 1899.99,
      salePrice: 1749.99,
      stock: 35,
      lowStockThreshold: 8,
      rating: 4.9,
      reviewCount: 48,
      description: 'Ultra-thin enterprise workstation featuring a 16-core silicon processor, 32GB unified RAM, 1TB NVMe SSD, and Liquid Retina XDR 120Hz display with 22-hour battery life.',
      images: [
        'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?auto=format&fit=crop&w=800&q=80'
      ],
      tags: ['laptop', 'electronics', 'apple', 'workstation', 'pro']
    },
    {
      name: 'AcousticMax Wireless Noise-Canceling Headphones',
      category: 'Electronics',
      price: 299.99,
      salePrice: 249.99,
      stock: 85,
      lowStockThreshold: 15,
      rating: 4.8,
      reviewCount: 92,
      description: 'Flagship active noise canceling over-ear headphones with custom spatial audio drivers, plush memory foam earcups, multi-device Bluetooth 5.3 pairing, and 40-hour playtime.',
      images: [
        'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1484704849700-f032a568e944?auto=format&fit=crop&w=800&q=80'
      ],
      tags: ['headphones', 'audio', 'wireless', 'anc', 'electronics']
    },
    {
      name: 'UltraVision 34-Inch Curved 4K HDR Monitor',
      category: 'Electronics',
      price: 649.99,
      salePrice: 579.99,
      stock: 22,
      lowStockThreshold: 5,
      rating: 4.7,
      reviewCount: 36,
      description: 'Immersive 1500R curved panoramic gaming & productivity display with 165Hz refresh rate, 1ms response time, 99% DCI-P3 color gamut, and 90W USB-C single-cable power delivery.',
      images: [
        'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&w=800&q=80'
      ],
      tags: ['monitor', 'curved', '4k', 'gaming', 'workspace']
    },
    {
      name: 'ErgoElite Pro Lumbar Executive Mesh Chair',
      category: 'Home & Kitchen',
      price: 389.99,
      salePrice: 349.99,
      stock: 18,
      lowStockThreshold: 5,
      rating: 4.9,
      reviewCount: 64,
      description: 'Orthopedic breathable elastomeric mesh chair with dynamic 4D adjustable armrests, synchronized tilt lock mechanism, and integrated lumbar support cushion for all-day comfort.',
      images: [
        'https://images.unsplash.com/photo-1580481077197-6a3f124a9190?auto=format&fit=crop&w=800&q=80'
      ],
      tags: ['chair', 'furniture', 'ergonomic', 'office', 'home']
    },
    {
      name: 'LuminaSmart RGB Ambient Desk Lamp with Wireless Qi',
      category: 'Home & Kitchen',
      price: 69.99,
      salePrice: 49.99,
      stock: 140,
      lowStockThreshold: 20,
      rating: 4.6,
      reviewCount: 29,
      description: 'Touch-controlled architectural desk lamp featuring stepless dimming, circadian color temperature tuning (2700K-6500K), built-in 15W Qi fast wireless charging base, and app sync.',
      images: [
        'https://images.unsplash.com/photo-1534972195531-a756b1126f24?auto=format&fit=crop&w=800&q=80'
      ],
      tags: ['lamp', 'lighting', 'smart home', 'desk', 'wireless charger']
    },
    {
      name: 'Signature Tailored 100% Organic Oxford Shirt',
      category: 'Apparel & Fashion',
      price: 79.99,
      salePrice: 59.99,
      stock: 90,
      lowStockThreshold: 15,
      rating: 4.7,
      reviewCount: 42,
      description: 'Crafted from sustainable long-staple organic cotton. Features classic button-down collar, durable mother-of-pearl buttons, and tailored athletic fit suitable for office or casual wear.',
      images: [
        'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&w=800&q=80'
      ],
      tags: ['apparel', 'shirt', 'fashion', 'cotton', 'menswear']
    },
    {
      name: 'ApexShield Waterproof All-Terrain Expedition Jacket',
      category: 'Apparel & Fashion',
      price: 189.99,
      salePrice: 159.99,
      stock: 45,
      lowStockThreshold: 10,
      rating: 4.9,
      reviewCount: 51,
      description: 'Triple-layer Gore-weave waterproof breathable shell jacket designed for extreme mountain climates. Features sealed YKK aquaguard zippers, thermal fleece lining, and helmet hood.',
      images: [
        'https://images.unsplash.com/photo-1548883354-7622d03aca27?auto=format&fit=crop&w=800&q=80'
      ],
      tags: ['jacket', 'waterproof', 'outdoor', 'outerwear', 'fashion']
    },
    {
      name: 'ChefMaster Tri-Ply Stainless Steel 10-Piece Cookware Set',
      category: 'Home & Kitchen',
      price: 329.99,
      salePrice: 289.99,
      stock: 28,
      lowStockThreshold: 6,
      rating: 4.8,
      reviewCount: 38,
      description: 'Commercial-grade 18/10 stainless steel cookware with bonded aluminum core for rapid, uniform heat distribution. Oven safe up to 500°F and compatible with all cooktops including induction.',
      images: [
        'https://images.unsplash.com/photo-1584990347449-397cf1e9569b?auto=format&fit=crop&w=800&q=80'
      ],
      tags: ['cookware', 'kitchen', 'stainless steel', 'cooking', 'chef']
    },
    {
      name: 'Enterprise Cloud Architecture & Distributed Systems Guide',
      category: 'Books & Office',
      price: 64.99,
      salePrice: 49.99,
      stock: 210,
      lowStockThreshold: 25,
      rating: 5.0,
      reviewCount: 88,
      description: 'Comprehensive hardbound engineering blueprint for architecting mission-critical, fault-tolerant cloud microservices, high-throughput message brokers, and enterprise distributed systems.',
      images: [
        'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=800&q=80'
      ],
      tags: ['book', 'engineering', 'architecture', 'software', 'office']
    },
    {
      name: 'PowerFlex Quick-Adjust Dumbbell Set (5 - 52.5 lbs)',
      category: 'Sports & Fitness',
      price: 249.99,
      salePrice: 219.99,
      stock: 32,
      lowStockThreshold: 8,
      rating: 4.9,
      reviewCount: 77,
      description: 'Space-saving selectorized dumbbell system replacing 15 sets of weights with a turn of a dial. Engineered with heavy-duty steel plate molding and non-slip knurled grip handles.',
      images: [
        'https://images.unsplash.com/photo-1586401100295-7a8096fd231a?auto=format&fit=crop&w=800&q=80'
      ],
      tags: ['fitness', 'dumbbells', 'weights', 'gym', 'workout']
    },
    {
      name: 'ApexStrike RGB Hot-Swappable Mechanical Keyboard',
      category: 'Electronics',
      price: 139.99,
      salePrice: 119.99,
      stock: 65,
      lowStockThreshold: 12,
      rating: 4.8,
      reviewCount: 53,
      description: '75% layout aircraft-grade aluminum gasket-mounted keyboard with pre-lubed tactile mechanical switches, PBT double-shot keycaps, south-facing RGB per-key LEDs, and Bluetooth/2.4G/USB-C.',
      images: [
        'https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=800&q=80'
      ],
      tags: ['keyboard', 'gaming', 'rgb', 'mechanical', 'electronics']
    },
    {
      name: 'VortexSpeed 8K Wireless Optical Gaming Mouse',
      category: 'Electronics',
      price: 89.99,
      salePrice: 74.99,
      stock: 95,
      lowStockThreshold: 15,
      rating: 4.7,
      reviewCount: 41,
      description: 'Ultra-lightweight 54g honeycomb gaming mouse with 26,000 DPI optical sensor, optical micro-switches rated for 90M clicks, pure PTFE glide feet, and 80-hour rechargeable battery.',
      images: [
        'https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?auto=format&fit=crop&w=800&q=80'
      ],
      tags: ['mouse', 'gaming', 'wireless', 'accessories', 'electronics']
    },
    {
      name: 'Chronos Pro Titanium Smartwatch Series 7',
      category: 'Accessories & Travel',
      price: 349.99,
      salePrice: 299.99,
      stock: 40,
      lowStockThreshold: 10,
      rating: 4.9,
      reviewCount: 65,
      description: 'Aerospace-grade titanium chassis with sapphire crystal AMOLED display. Continuous ECG heart rate monitoring, dual-band GPS, 100m water resistance, and 14-day battery life.',
      images: [
        'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=800&q=80'
      ],
      tags: ['smartwatch', 'watch', 'wearable', 'titanium', 'fitness']
    },
    {
      name: 'Heritage Full-Grain Leather Commuter Backpack 22L',
      category: 'Accessories & Travel',
      price: 219.99,
      salePrice: 189.99,
      stock: 30,
      lowStockThreshold: 6,
      rating: 4.8,
      reviewCount: 34,
      description: 'Handcrafted vegetable-tanned full-grain leather backpack. Features padded 16-inch laptop compartment, water-resistant twill lining, antique brass hardware, and trolley luggage sleeve.',
      images: [
        'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=800&q=80'
      ],
      tags: ['backpack', 'leather', 'travel', 'commute', 'bag']
    },
    {
      name: 'Artisan Barista Ceramic Coffee Pour-Over Dripper Set',
      category: 'Home & Kitchen',
      price: 49.99,
      salePrice: 39.99,
      stock: 75,
      lowStockThreshold: 15,
      rating: 4.6,
      reviewCount: 27,
      description: 'Handcrafted ceramic pour-over cone with 600ml borosilicate glass carafe and precision stainless steel reusable mesh filter for rich, velvety specialty coffee extraction.',
      images: [
        'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=800&q=80'
      ],
      tags: ['coffee', 'kitchen', 'ceramic', 'barista', 'home']
    },
    {
      name: 'ProGrade Cinema 4K Mirrorless Camera Body',
      category: 'Electronics',
      price: 1499.99,
      salePrice: 1399.99,
      stock: 14,
      lowStockThreshold: 4,
      rating: 5.0,
      reviewCount: 22,
      description: 'Full-frame 33MP BSI CMOS sensor with 15 stops of dynamic range, 4K 60p 10-bit 4:2:2 internal video recording, 5-axis in-body image stabilization, and real-time AI subject eye autofocus.',
      images: [
        'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=800&q=80'
      ],
      tags: ['camera', '4k', 'photography', 'cinema', 'video']
    },
    {
      name: 'StudioRef Active Bi-Amplified Desktop Speakers (Pair)',
      category: 'Electronics',
      price: 199.99,
      salePrice: 169.99,
      stock: 35,
      lowStockThreshold: 8,
      rating: 4.7,
      reviewCount: 31,
      description: '5-inch woven Kevlar woofers with 1-inch silk dome tweeters powered by 100W Class-D amplification. Balanced TRS & RCA inputs with custom acoustic boundary EQ controls.',
      images: [
        'https://images.unsplash.com/photo-1545454675-3531b543be5d?auto=format&fit=crop&w=800&q=80'
      ],
      tags: ['speakers', 'audio', 'studio', 'monitors', 'music']
    },
    {
      name: 'HydroShield Vacuum Insulated Stainless Bottle 32oz',
      category: 'Sports & Fitness',
      price: 34.99,
      salePrice: 27.99,
      stock: 180,
      lowStockThreshold: 30,
      rating: 4.8,
      reviewCount: 95,
      description: 'Double-wall vacuum insulation keeping drinks icy cold for 24 hours or piping hot for 12 hours. Pro-grade 18/8 stainless steel, powder-coated sweat-free finish, and leakproof chug lid.',
      images: [
        'https://images.unsplash.com/photo-1602143407151-7111542de6e8?auto=format&fit=crop&w=800&q=80'
      ],
      tags: ['water bottle', 'fitness', 'hydro', 'outdoor', 'sports']
    },
    {
      name: 'Aviator Classic Polarized UV400 Sunglasses',
      category: 'Accessories & Travel',
      price: 119.99,
      salePrice: 89.99,
      stock: 60,
      lowStockThreshold: 12,
      rating: 4.7,
      reviewCount: 45,
      description: 'Corrosion-resistant monel metal frame with scratch-resistant polarized crystal lenses providing 100% UVA/UVB protection and true color perception in bright glare conditions.',
      images: [
        'https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&w=800&q=80'
      ],
      tags: ['sunglasses', 'polarized', 'fashion', 'eyewear', 'accessories']
    },
    {
      name: 'AeroLift Ergonomic Aluminum Foldable Laptop Stand',
      category: 'Books & Office',
      price: 44.99,
      salePrice: 34.99,
      stock: 120,
      lowStockThreshold: 20,
      rating: 4.8,
      reviewCount: 68,
      description: 'Precision CNC-machined sandblasted aluminum stand elevates laptop screen to eye level. Promotes optimal posture, maximum heat ventilation, and folds flat into travel pouch.',
      images: [
        'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?auto=format&fit=crop&w=800&q=80'
      ],
      tags: ['laptop stand', 'desk', 'ergonomic', 'office', 'aluminum']
    }
  ];

  const seededProducts = sampleProductsData.map(p => productRepository.create(p));
  logger.info(`Seeded ${seededProducts.length} products with high-resolution imagery.`);

  // 4. Seed Product Reviews
  reviewRepository.clear();
  seededProducts.forEach((p, idx) => {
    reviewRepository.create({
      productId: p.id,
      userId: customerUser.id,
      userName: 'Jane C. (Verified Buyer)',
      rating: 5,
      title: 'Exceeded all my expectations!',
      comment: `The ${p.name} is outstanding. The build quality, packaging, and performance are top tier. Highly recommended to anyone looking for enterprise reliability.`
    });
    if (idx % 2 === 0) {
      reviewRepository.create({
        productId: p.id,
        userId: adminUser.id,
        userName: 'Alex M. (Verified Pro)',
        rating: 5,
        title: 'Daily driver - flawless performance',
        comment: `We ordered multiple units for our organization. Fast shipping, great customer service, and fantastic build quality.`
      });
    }
  });
  logger.info('Seeded customer review threads.');

  // 5. Seed Historical Orders
  orderRepository.clear();
  const sampleOrders = [
    {
      orderNumber: generateOrderNumber(),
      userId: customerUser.id,
      customerName: customerUser.name,
      customerEmail: customerUser.email,
      items: [
        { productId: seededProducts[0].id, name: seededProducts[0].name, price: seededProducts[0].effectivePrice, quantity: 1, sku: seededProducts[0].sku, image: seededProducts[0].images[0] },
        { productId: seededProducts[1].id, name: seededProducts[1].name, price: seededProducts[1].effectivePrice, quantity: 1, sku: seededProducts[1].sku, image: seededProducts[1].images[0] }
      ],
      subtotal: seededProducts[0].effectivePrice + seededProducts[1].effectivePrice,
      discountAmount: 20.00,
      taxAmount: 154.99,
      shippingAmount: 0,
      grandTotal: (seededProducts[0].effectivePrice + seededProducts[1].effectivePrice) - 20.00 + 154.99,
      paymentMethod: 'STRIPE_CREDIT_CARD',
      paymentStatus: PAYMENT_STATUS.CAPTURED,
      orderStatus: ORDER_STATUS.DELIVERED,
      trackingNumber: generateTrackingNumber('FedEx'),
      shippingAddress: { street: '500 Howard Street', city: 'San Francisco', state: 'CA', zip: '94105', country: 'USA' }
    },
    {
      orderNumber: generateOrderNumber(),
      userId: customerUser.id,
      customerName: customerUser.name,
      customerEmail: customerUser.email,
      items: [
        { productId: seededProducts[2].id, name: seededProducts[2].name, price: seededProducts[2].effectivePrice, quantity: 1, sku: seededProducts[2].sku, image: seededProducts[2].images[0] }
      ],
      subtotal: seededProducts[2].effectivePrice,
      discountAmount: 0.00,
      taxAmount: 46.39,
      shippingAmount: 0.00,
      grandTotal: seededProducts[2].effectivePrice + 46.39,
      paymentMethod: 'PAYPAL',
      paymentStatus: PAYMENT_STATUS.CAPTURED,
      orderStatus: ORDER_STATUS.SHIPPED,
      trackingNumber: generateTrackingNumber('UPS'),
      shippingAddress: { street: '120 Broadway', city: 'New York', state: 'NY', zip: '10271', country: 'USA' }
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
