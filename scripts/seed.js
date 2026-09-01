/**
 * Complete Database Seeder with 55+ Products, Users, Categories, Coupons, Reviews
 * OmniCommerce Enterprise
 */

const fs = require('fs');
const path = require('path');
const {
  userRepository,
  productRepository,
  categoryRepository,
  reviewRepository,
  orderRepository,
  couponRepository,
  notificationRepository
} = require('../src/repositories');

const { USER_ROLES, ORDER_STATUS, PAYMENT_STATUS } = require('../src/config/constants');
const { generateSKU, hashPassword, generateOrderNumber, generateTrackingNumber } = require('../src/utils/helpers');
const logger = require('../src/utils/logger');

function seedDatabase() {
  logger.info('Starting full database seeding process...');

  // 1. Categories
  categoryRepository.clear();
  const categories = [
    categoryRepository.create({ name: 'Electronics', description: 'Laptops, headphones, monitors, cameras & smart devices' }),
    categoryRepository.create({ name: 'Apparel & Fashion', description: 'Tailored shirts, outerwear, jackets & daily apparel' }),
    categoryRepository.create({ name: 'Home & Kitchen', description: 'Ergonomic furniture, cookware, espresso machines & appliances' }),
    categoryRepository.create({ name: 'Books & Office', description: 'Productivity desks, notebooks, fountain pens & organizers' }),
    categoryRepository.create({ name: 'Sports & Fitness', description: 'Adjustable weights, yoga mats, running shoes & smart fitness' }),
    categoryRepository.create({ name: 'Accessories & Travel', description: 'Leather bags, minimalist watches, sunglasses & luggage' })
  ];

  // 2. Users (All Roles)
  userRepository.clear();
  userRepository.create({
    name: 'Store Administrator',
    email: 'admin@omnicommerce.com',
    passwordHash: hashPassword('AdminPassword2026!'),
    role: USER_ROLES.ADMIN,
    phone: '+1-206-555-0100'
  });

  const customer1 = userRepository.create({
    name: 'Customer User',
    email: 'customer@example.com',
    passwordHash: hashPassword('CustomerPass2026!'),
    role: USER_ROLES.CUSTOMER,
    phone: '+1-206-555-0199'
  });

  const customer2 = userRepository.create({
    name: 'Jane Customer',
    email: 'jane@example.com',
    passwordHash: hashPassword('JanePass2026!'),
    role: USER_ROLES.CUSTOMER,
    phone: '+1-206-555-0122'
  });

  userRepository.create({
    name: 'Alex Courier',
    email: 'delivery@omnicommerce.com',
    passwordHash: hashPassword('DeliveryPass2026!'),
    role: USER_ROLES.DELIVERY_PERSON,
    phone: '+1-206-555-0144'
  });

  userRepository.create({
    name: 'Sam Dispatch',
    email: 'courier@omnicommerce.com',
    passwordHash: hashPassword('CourierPass2026!'),
    role: USER_ROLES.DELIVERY_PERSON,
    phone: '+1-206-555-0188'
  });

  // 3. 55+ Products
  productRepository.clear();
  const rawProducts = [
    // Electronics
    {
      name: 'OmniBook Pro 16 M-Max Laptop',
      category: 'Electronics',
      price: 1899.99,
      salePrice: 1749.99,
      stock: 35,
      description: 'Ultra-thin enterprise laptop with 16-core CPU, 32GB RAM, 1TB NVMe SSD, and 120Hz Liquid Retina display.',
      images: [
        'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?auto=format&fit=crop&w=800&q=80'
      ],
      tags: ['laptop', 'electronics', 'workstation'],
      rating: 4.9,
      reviewCount: 48
    },
    {
      name: 'AcousticMax Wireless ANC Headphones',
      category: 'Electronics',
      price: 299.99,
      salePrice: 249.99,
      stock: 85,
      description: 'Premium active noise-canceling over-ear headphones with custom spatial audio drivers and 40-hour battery life.',
      images: [
        'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1484704849700-f032a568e944?auto=format&fit=crop&w=800&q=80'
      ],
      tags: ['headphones', 'audio', 'wireless'],
      rating: 4.8,
      reviewCount: 92
    },
    {
      name: 'UltraVision 34-Inch Curved 4K Monitor',
      category: 'Electronics',
      price: 649.99,
      salePrice: 589.99,
      stock: 24,
      description: 'Ultrawide 34-inch curved IPS monitor with 144Hz refresh rate, USB-C 90W power delivery, and HDR 600.',
      images: [
        'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1586210579191-33b45e38fa2c?auto=format&fit=crop&w=800&q=80'
      ],
      tags: ['monitor', 'curved', '4k'],
      rating: 4.7,
      reviewCount: 36
    },
    {
      name: 'PulseTrack Pro GPS Smartwatch',
      category: 'Electronics',
      price: 249.99,
      salePrice: 199.99,
      stock: 60,
      description: 'All-day health & fitness smartwatch featuring AMOLED sapphire glass, ECG monitoring, and 50m water resistance.',
      images: [
        'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1579586337278-3befd40fd17a?auto=format&fit=crop&w=800&q=80'
      ],
      tags: ['smartwatch', 'wearable', 'gps'],
      rating: 4.6,
      reviewCount: 64
    },
    {
      name: 'LumixPro 4K Mirrorless Digital Camera',
      category: 'Electronics',
      price: 1299.99,
      salePrice: 1149.99,
      stock: 18,
      description: 'Professional 24.2MP full-frame mirrorless camera with 4K 60p video capture, 5-axis stabilization, and dual card slots.',
      images: [
        'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1502920917128-1aa500764cbd?auto=format&fit=crop&w=800&q=80'
      ],
      tags: ['camera', 'dslr', 'photography'],
      rating: 4.9,
      reviewCount: 29
    },
    {
      name: 'ApexKey Mechanical Wireless Keyboard',
      category: 'Electronics',
      price: 139.99,
      salePrice: 119.99,
      stock: 95,
      description: 'Custom hot-swappable mechanical keyboard with lubricated linear switches, aluminum chassis, and Bluetooth 5.2.',
      images: [
        'https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1595225476474-87563907a212?auto=format&fit=crop&w=800&q=80'
      ],
      tags: ['keyboard', 'gaming', 'mechanical'],
      rating: 4.8,
      reviewCount: 77
    },
    {
      name: 'VortexSpeed 8K Wireless Optical Mouse',
      category: 'Electronics',
      price: 79.99,
      salePrice: 64.99,
      stock: 110,
      description: 'Ultralight 58g ergonomic optical mouse with 26K DPI sensor, PTFE feet, and 90-hour continuous battery life.',
      images: [
        'https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?auto=format&fit=crop&w=800&q=80'
      ],
      tags: ['mouse', 'gaming', 'wireless'],
      rating: 4.7,
      reviewCount: 84
    },
    {
      name: 'SonicBoom Portable Bluetooth Speaker',
      category: 'Electronics',
      price: 89.99,
      salePrice: 69.99,
      stock: 75,
      description: 'Rugged IP67 waterproof outdoor speaker with 360-degree room-filling sound, deep bass radiators, and 24h battery.',
      images: [
        'https://images.unsplash.com/photo-1545454675-3531b543be5d?auto=format&fit=crop&w=800&q=80'
      ],
      tags: ['speaker', 'audio', 'bluetooth'],
      rating: 4.6,
      reviewCount: 52
    },
    {
      name: 'PowerVault 65W GaN Fast Charger',
      category: 'Electronics',
      price: 49.99,
      salePrice: 39.99,
      stock: 150,
      description: 'Compact 3-port GaN III fast wall charger supporting dual USB-C laptops, tablets, and phones simultaneously.',
      images: [
        'https://images.unsplash.com/photo-1583863788434-e58a36330cf0?auto=format&fit=crop&w=800&q=80'
      ],
      tags: ['charger', 'gan', 'usbc'],
      rating: 4.8,
      reviewCount: 114
    },
    {
      name: 'TrueSound Studio Podcasting Microphone',
      category: 'Electronics',
      price: 149.99,
      salePrice: 129.99,
      stock: 45,
      description: 'Cardioid dynamic studio microphone with built-in pop filter, zero-latency headphone monitoring, and USB/XLR outputs.',
      images: [
        'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?auto=format&fit=crop&w=800&q=80'
      ],
      tags: ['microphone', 'podcast', 'audio'],
      rating: 4.7,
      reviewCount: 41
    },

    // Apparel & Fashion
    {
      name: 'Heritage Classic Oxford Cotton Shirt',
      category: 'Apparel & Fashion',
      price: 68.00,
      salePrice: 54.00,
      stock: 90,
      description: '100% combed long-staple organic cotton button-down shirt with tailored fit and reinforced seams.',
      images: [
        'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&w=800&q=80'
      ],
      tags: ['shirt', 'apparel', 'cotton'],
      rating: 4.7,
      reviewCount: 68
    },
    {
      name: 'UrbanFlex All-Weather Wool Trench Coat',
      category: 'Apparel & Fashion',
      price: 249.00,
      salePrice: 199.00,
      stock: 30,
      description: 'Italian wool blend double-breasted coat featuring water-resistant storm shield and satin lining.',
      images: [
        'https://images.unsplash.com/photo-1539533018447-63fcce2678e3?auto=format&fit=crop&w=800&q=80'
      ],
      tags: ['coat', 'outerwear', 'wool'],
      rating: 4.9,
      reviewCount: 31
    },
    {
      name: 'Merino Wool Crewneck Sweater',
      category: 'Apparel & Fashion',
      price: 89.00,
      salePrice: 72.00,
      stock: 65,
      description: 'Ultra-fine 100% Merino wool knit sweater providing natural temperature regulation and exceptional softness.',
      images: [
        'https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?auto=format&fit=crop&w=800&q=80'
      ],
      tags: ['sweater', 'merino', 'knitwear'],
      rating: 4.8,
      reviewCount: 45
    },
    {
      name: 'Tailored Stretch Chino Trousers',
      category: 'Apparel & Fashion',
      price: 74.00,
      salePrice: 59.00,
      stock: 80,
      description: 'Modern slim-fit chinos crafted with 98% organic cotton and 2% elastane for unrestricted all-day movement.',
      images: [
        'https://images.unsplash.com/photo-1473966968600-fa801b869a1a?auto=format&fit=crop&w=800&q=80'
      ],
      tags: ['chinos', 'pants', 'trousers'],
      rating: 4.6,
      reviewCount: 56
    },
    {
      name: 'Raw Selvedge Denim Slim Jeans',
      category: 'Apparel & Fashion',
      price: 119.00,
      salePrice: 95.00,
      stock: 50,
      description: '13.5oz authentic Japanese shuttle-loom selvedge denim designed to develop unique personal fade patterns.',
      images: [
        'https://images.unsplash.com/photo-1542272604-780c96856592?auto=format&fit=crop&w=800&q=80'
      ],
      tags: ['jeans', 'denim', 'selvedge'],
      rating: 4.8,
      reviewCount: 63
    },
    {
      name: 'Essential Heavyweight Cotton Hoodie',
      category: 'Apparel & Fashion',
      price: 79.00,
      salePrice: 62.00,
      stock: 120,
      description: '450 GSM heavyweight french terry fleece hoodie with double-lined hood and sturdy ribbed cuffs.',
      images: [
        'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&w=800&q=80'
      ],
      tags: ['hoodie', 'fleece', 'streetwear'],
      rating: 4.7,
      reviewCount: 89
    },
    {
      name: 'Handmade Italian Leather Dress Shoes',
      category: 'Apparel & Fashion',
      price: 219.00,
      salePrice: 179.00,
      stock: 28,
      description: 'Full-grain calfskin leather Oxford dress shoes handcrafted with Goodyear welt construction and leather soles.',
      images: [
        'https://images.unsplash.com/photo-1614252235316-8c857d38b5f4?auto=format&fit=crop&w=800&q=80'
      ],
      tags: ['shoes', 'oxford', 'leather'],
      rating: 4.9,
      reviewCount: 37
    },
    {
      name: 'Minimalist Cashmere Scarf',
      category: 'Apparel & Fashion',
      price: 65.00,
      salePrice: 49.00,
      stock: 70,
      description: '100% Mongolian cashmere lightweight warm scarf with subtle fringed edges.',
      images: [
        'https://images.unsplash.com/photo-1520903920243-00d872a2d1c9?auto=format&fit=crop&w=800&q=80'
      ],
      tags: ['scarf', 'cashmere', 'winter'],
      rating: 4.8,
      reviewCount: 42
    },

    // Home & Kitchen
    {
      name: 'ErgoComfort High-Back Mesh Desk Chair',
      category: 'Home & Kitchen',
      price: 349.99,
      salePrice: 289.99,
      stock: 40,
      description: 'Ergonomic breathable mesh task chair with 4D adjustable armrests, dynamic lumbar support, and tilt lock.',
      images: [
        'https://images.unsplash.com/photo-1580481077195-728b7e28989f?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1505797149-43b0069ec26b?auto=format&fit=crop&w=800&q=80'
      ],
      tags: ['chair', 'furniture', 'ergonomic'],
      rating: 4.8,
      reviewCount: 54
    },
    {
      name: 'Artisan Barista Espresso Machine',
      category: 'Home & Kitchen',
      price: 599.99,
      salePrice: 499.99,
      stock: 22,
      description: '15-bar Italian thermo-block espresso machine with integrated burr grinder and micro-foam steam wand.',
      images: [
        'https://images.unsplash.com/photo-1517668808822-9ebb02f2a0e6?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1585515320310-259814833e62?auto=format&fit=crop&w=800&q=80'
      ],
      tags: ['espresso', 'coffee', 'kitchen'],
      rating: 4.9,
      reviewCount: 67
    },
    {
      name: 'Cast Iron Dutch Oven 6-Quart',
      category: 'Home & Kitchen',
      price: 119.99,
      salePrice: 89.99,
      stock: 45,
      description: 'Heavy-duty enameled cast iron Dutch oven with tight-fitting lid for superior heat retention and slow braising.',
      images: [
        'https://images.unsplash.com/photo-1584990347449-3990666014e7?auto=format&fit=crop&w=800&q=80'
      ],
      tags: ['cookware', 'kitchen', 'dutchoven'],
      rating: 4.9,
      reviewCount: 78
    },
    {
      name: 'Smart WiFi Convection Air Fryer 5.8Qt',
      category: 'Home & Kitchen',
      price: 129.99,
      salePrice: 99.99,
      stock: 55,
      description: 'Digital touchscreen air fryer with 12 one-touch cooking presets and rapid 360-degree heat circulation.',
      images: [
        'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=800&q=80'
      ],
      tags: ['airfryer', 'appliance', 'kitchen'],
      rating: 4.7,
      reviewCount: 91
    },
    {
      name: 'Damascus Steel 8-Inch Chef Knife',
      category: 'Home & Kitchen',
      price: 89.99,
      salePrice: 69.99,
      stock: 70,
      description: '67-layer Japanese VG-10 Damascus steel kitchen knife with ergonomic pakkawood handle and razor-sharp edge.',
      images: [
        'https://images.unsplash.com/photo-1593618998160-e34014e67546?auto=format&fit=crop&w=800&q=80'
      ],
      tags: ['knife', 'chef', 'cutlery'],
      rating: 4.9,
      reviewCount: 82
    },
    {
      name: 'Solid Walnut Wood Monitor Stand Riser',
      category: 'Home & Kitchen',
      price: 69.99,
      salePrice: 54.99,
      stock: 60,
      description: 'Handcrafted natural American walnut desk shelf with cork padded feet and keyboard storage dock.',
      images: [
        'https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?auto=format&fit=crop&w=800&q=80'
      ],
      tags: ['desk', 'wood', 'stand'],
      rating: 4.8,
      reviewCount: 49
    },
    {
      name: 'Ceramic Pour-Over Coffee Dripper Set',
      category: 'Home & Kitchen',
      price: 44.99,
      salePrice: 34.99,
      stock: 85,
      description: 'Handmade matte black ceramic pour-over cone with 600ml borosilicate glass server and reusable filters.',
      images: [
        'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=800&q=80'
      ],
      tags: ['coffee', 'pourover', 'ceramic'],
      rating: 4.7,
      reviewCount: 38
    },
    {
      name: 'Smart Dimmable LED Desk Lamp',
      category: 'Home & Kitchen',
      price: 59.99,
      salePrice: 45.99,
      stock: 90,
      description: 'Architectural aluminum LED lamp with 5 color temperatures, wireless phone charging base, and touch timer.',
      images: [
        'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=800&q=80'
      ],
      tags: ['lamp', 'lighting', 'desk'],
      rating: 4.6,
      reviewCount: 61
    },

    // Books & Office
    {
      name: 'Modern System Design Principles Handbook',
      category: 'Books & Office',
      price: 49.99,
      salePrice: 39.99,
      stock: 120,
      description: 'Comprehensive guide covering scalable distributed architectures, fault tolerance, API design, and cloud patterns.',
      images: [
        'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=800&q=80'
      ],
      tags: ['book', 'programming', 'architecture'],
      rating: 4.9,
      reviewCount: 104
    },
    {
      name: 'Hardcover Dot-Grid Leather Journal',
      category: 'Books & Office',
      price: 24.99,
      salePrice: 19.99,
      stock: 140,
      description: '160 GSM bleedproof acid-free paper bullet notebook with vegan leather cover, dual bookmarks, and back pocket.',
      images: [
        'https://images.unsplash.com/photo-1531346878377-a5be20888e57?auto=format&fit=crop&w=800&q=80'
      ],
      tags: ['notebook', 'journal', 'stationery'],
      rating: 4.8,
      reviewCount: 73
    },
    {
      name: 'Precision Brass Fountain Pen',
      category: 'Books & Office',
      price: 48.00,
      salePrice: 38.00,
      stock: 75,
      description: 'Solid machined brass pocket fountain pen with German stainless steel fine nib and international cartridge converter.',
      images: [
        'https://images.unsplash.com/photo-1583485088034-697b5bc54ccd?auto=format&fit=crop&w=800&q=80'
      ],
      tags: ['pen', 'brass', 'fountainpen'],
      rating: 4.9,
      reviewCount: 52
    },
    {
      name: 'Minimalist Aluminium Laptop Stand',
      category: 'Books & Office',
      price: 39.99,
      salePrice: 29.99,
      stock: 110,
      description: 'Ergonomic 6-angle foldable anodized aluminum laptop elevator with silicone anti-scratch pads.',
      images: [
        'https://images.unsplash.com/photo-1616353071588-708dcff912e2?auto=format&fit=crop&w=800&q=80'
      ],
      tags: ['stand', 'laptop', 'office'],
      rating: 4.7,
      reviewCount: 88
    },
    {
      name: 'Desk Organiser Felt & Cork Pad',
      category: 'Books & Office',
      price: 32.00,
      salePrice: 24.00,
      stock: 95,
      description: 'Full-size 90x40cm dual-sided wool felt and natural cork desk mat for smooth mouse glide and desk protection.',
      images: [
        'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?auto=format&fit=crop&w=800&q=80'
      ],
      tags: ['deskpad', 'mat', 'office'],
      rating: 4.6,
      reviewCount: 46
    },

    // Sports & Fitness
    {
      name: 'QuickLock Adjustable Dumbbell Set (5-50 lbs)',
      category: 'Sports & Fitness',
      price: 299.99,
      salePrice: 249.99,
      stock: 35,
      description: 'Pair of quick-dial compact adjustable dumbbells replacing 15 separate sets with anti-slip knurled steel grips.',
      images: [
        'https://images.unsplash.com/photo-1586401100295-7a8096fd231a?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1584735935682-2f2b69dff9d2?auto=format&fit=crop&w=800&q=80'
      ],
      tags: ['weights', 'fitness', 'dumbbells'],
      rating: 4.9,
      reviewCount: 63
    },
    {
      name: 'Eco-Grip Non-Slip Natural Rubber Yoga Mat',
      category: 'Sports & Fitness',
      price: 68.00,
      salePrice: 52.00,
      stock: 80,
      description: '6mm extra-thick biodegradable natural tree rubber yoga mat with laser-etched alignment guides.',
      images: [
        'https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?auto=format&fit=crop&w=800&q=80'
      ],
      tags: ['yoga', 'mat', 'fitness'],
      rating: 4.8,
      reviewCount: 71
    },
    {
      name: 'ProPulse Carbon Running Shoes',
      category: 'Sports & Fitness',
      price: 159.99,
      salePrice: 129.99,
      stock: 45,
      description: 'Lightweight marathon racing shoes with full-length carbon fiber propulsion plate and responsive nitrogen-infused foam.',
      images: [
        'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=80'
      ],
      tags: ['shoes', 'running', 'marathon'],
      rating: 4.8,
      reviewCount: 59
    },
    {
      name: 'DeepTissue Percussion Massage Gun',
      category: 'Sports & Fitness',
      price: 119.99,
      salePrice: 89.99,
      stock: 65,
      description: 'Ultra-quiet brushless motor muscle recovery massage gun with 6 interchangeable heads and 30 speed levels.',
      images: [
        'https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&w=800&q=80'
      ],
      tags: ['massage', 'recovery', 'fitness'],
      rating: 4.7,
      reviewCount: 82
    },
    {
      name: 'Insulated Stainless Steel Water Bottle 32oz',
      category: 'Sports & Fitness',
      price: 34.99,
      salePrice: 26.99,
      stock: 130,
      description: 'Vacuum-insulated 18/8 food-grade stainless steel flask keeping beverages ice cold for 24h or hot for 12h.',
      images: [
        'https://images.unsplash.com/photo-1602143407151-7111542de6e8?auto=format&fit=crop&w=800&q=80'
      ],
      tags: ['bottle', 'water', 'hydration'],
      rating: 4.9,
      reviewCount: 112
    },

    // Accessories & Travel
    {
      name: 'Full-Grain Leather Weekender Duffel Bag',
      category: 'Accessories & Travel',
      price: 189.00,
      salePrice: 149.00,
      stock: 30,
      description: 'Handcrafted full-grain vegetable-tanned leather duffel with separate shoe compartment and solid brass YKK zippers.',
      images: [
        'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=800&q=80'
      ],
      tags: ['bag', 'duffel', 'leather', 'travel'],
      rating: 4.9,
      reviewCount: 44
    },
    {
      name: 'Minimalist Automatic Mechanical Watch',
      category: 'Accessories & Travel',
      price: 289.00,
      salePrice: 229.00,
      stock: 25,
      description: 'Sleek Bauhaus automatic watch featuring Japanese Miyota movement, sapphire crystal, and genuine leather strap.',
      images: [
        'https://images.unsplash.com/photo-1524805444758-089113d48a6d?auto=format&fit=crop&w=800&q=80'
      ],
      tags: ['watch', 'luxury', 'accessories'],
      rating: 4.8,
      reviewCount: 39
    },
    {
      name: 'Polarized Aviator Sunglasses (Titanium)',
      category: 'Accessories & Travel',
      price: 119.00,
      salePrice: 89.00,
      stock: 60,
      description: 'Ultra-lightweight aerospace titanium frames with scratch-resistant polarized UV400 glass lenses.',
      images: [
        'https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&w=800&q=80'
      ],
      tags: ['sunglasses', 'eyewear', 'titanium'],
      rating: 4.7,
      reviewCount: 51
    },
    {
      name: 'RFID-Blocking Slim Bifold Leather Wallet',
      category: 'Accessories & Travel',
      price: 45.00,
      salePrice: 34.00,
      stock: 140,
      description: 'Ultra-slim genuine top-grain leather wallet with 8 card slots, quick-access pull tab, and RFID protection shield.',
      images: [
        'https://images.unsplash.com/photo-1627123424574-724758594e93?auto=format&fit=crop&w=800&q=80'
      ],
      tags: ['wallet', 'leather', 'rfid'],
      rating: 4.8,
      reviewCount: 95
    },
    {
      name: 'Hardshell Polycarbonate Carry-On Suitcase',
      category: 'Accessories & Travel',
      price: 199.99,
      salePrice: 159.99,
      stock: 35,
      description: '20-inch FAA-approved carry-on spinner luggage with silent Hinomoto 360 wheels and TSA combination lock.',
      images: [
        'https://images.unsplash.com/photo-1565026057447-bc90a3dceb87?auto=format&fit=crop&w=800&q=80'
      ],
      tags: ['luggage', 'travel', 'suitcase'],
      rating: 4.9,
      reviewCount: 58
    },
    {
      name: '4K Ultra HD Action Camera 60FPS',
      category: 'Electronics',
      price: 189.99,
      salePrice: 149.99,
      stock: 40,
      description: 'Waterproof 40m sports action cam with dual color screens, EIS 6-axis stabilization, and 170-degree wide angle.',
      images: [
        'https://images.unsplash.com/photo-1508614589041-895b88991e3e?auto=format&fit=crop&w=800&q=80'
      ],
      tags: ['camera', 'actioncam', 'waterproof'],
      rating: 4.7,
      reviewCount: 33
    },
    {
      name: 'MagCharge 3-in-1 Wireless Charging Stand',
      category: 'Electronics',
      price: 69.99,
      salePrice: 54.99,
      stock: 85,
      description: '15W magnetic fast wireless charging dock for phone, smartwatch, and wireless earbuds simultaneously.',
      images: [
        'https://images.unsplash.com/photo-1586816879360-004f5b0c51e3?auto=format&fit=crop&w=800&q=80'
      ],
      tags: ['charger', 'wireless', 'stand'],
      rating: 4.8,
      reviewCount: 72
    },
    {
      name: 'ProGaming RGB Surround Sound Headset',
      category: 'Electronics',
      price: 99.99,
      salePrice: 79.99,
      stock: 65,
      description: '7.1 virtual surround sound headset with 50mm neodymium drivers, noise-canceling mic, and cooling gel ear cushions.',
      images: [
        'https://images.unsplash.com/photo-1546435770-a3e426bf472b?auto=format&fit=crop&w=800&q=80'
      ],
      tags: ['headset', 'gaming', 'audio'],
      rating: 4.6,
      reviewCount: 51
    },
    {
      name: 'Windproof Lightweight Running Windbreaker',
      category: 'Apparel & Fashion',
      price: 79.99,
      salePrice: 59.99,
      stock: 75,
      description: 'Ultra-packable water-repellent running jacket with reflective safety strips and breathable underarm vents.',
      images: [
        'https://images.unsplash.com/photo-1544441893-675973e31985?auto=format&fit=crop&w=800&q=80'
      ],
      tags: ['jacket', 'running', 'windbreaker'],
      rating: 4.8,
      reviewCount: 44
    },
    {
      name: 'Classic Polarized Wayfarer Sunglasses',
      category: 'Apparel & Fashion',
      price: 89.00,
      salePrice: 69.00,
      stock: 90,
      description: 'Handcrafted acetate frames with crystal green polarized lenses providing 100% UV protection.',
      images: [
        'https://images.unsplash.com/photo-1572635196237-14b3f281503f?auto=format&fit=crop&w=800&q=80'
      ],
      tags: ['sunglasses', 'eyewear', 'classic'],
      rating: 4.9,
      reviewCount: 68
    },
    {
      name: 'Organic Bamboo Bed Sheet Set (Queen)',
      category: 'Home & Kitchen',
      price: 129.99,
      salePrice: 99.99,
      stock: 45,
      description: '300 thread count 100% organic viscose from bamboo bed sheets with deep pockets and cooling silky texture.',
      images: [
        'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=800&q=80'
      ],
      tags: ['bedding', 'bamboo', 'sheets'],
      rating: 4.9,
      reviewCount: 81
    },
    {
      name: 'Smart Stainless Steel Electric Kettle',
      category: 'Home & Kitchen',
      price: 79.99,
      salePrice: 64.99,
      stock: 70,
      description: 'Gooseneck precision temperature control electric kettle with LED display and 60-minute keep-warm hold.',
      images: [
        'https://images.unsplash.com/photo-1574914629385-46448b767aec?auto=format&fit=crop&w=800&q=80'
      ],
      tags: ['kettle', 'coffee', 'kitchen'],
      rating: 4.8,
      reviewCount: 63
    },
    {
      name: 'Non-Stick Granite Induction Frying Pan',
      category: 'Home & Kitchen',
      price: 49.99,
      salePrice: 39.99,
      stock: 85,
      description: '11-inch eco-friendly granite non-stick skillet compatible with all stovetops including induction.',
      images: [
        'https://images.unsplash.com/photo-1584990347449-3990666014e7?auto=format&fit=crop&w=800&q=80'
      ],
      tags: ['cookware', 'pan', 'kitchen'],
      rating: 4.7,
      reviewCount: 77
    },
    {
      name: 'Acoustic Soundproofing Foam Panels (12-Pack)',
      category: 'Books & Office',
      price: 39.99,
      salePrice: 29.99,
      stock: 100,
      description: 'High-density 2-inch wedge sound absorbing foam panels for home studio, streaming, and podcast rooms.',
      images: [
        'https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?auto=format&fit=crop&w=800&q=80'
      ],
      tags: ['acoustic', 'studio', 'office'],
      rating: 4.6,
      reviewCount: 39
    },
    {
      name: 'Wireless Bluetooth Presentation Clicker',
      category: 'Books & Office',
      price: 29.99,
      salePrice: 22.99,
      stock: 120,
      description: 'Rechargeable laser pointer presentation remote with 100ft operating range and universal USB plug-and-play.',
      images: [
        'https://images.unsplash.com/photo-1588508065123-287b28e013da?auto=format&fit=crop&w=800&q=80'
      ],
      tags: ['clicker', 'presentation', 'office'],
      rating: 4.8,
      reviewCount: 52
    },
    {
      name: 'Multi-Grip Pull-Up & Dip Station Tower',
      category: 'Sports & Fitness',
      price: 199.99,
      salePrice: 159.99,
      stock: 25,
      description: 'Heavy-duty steel home gym power tower for pull-ups, chin-ups, vertical knee raises, and push-ups.',
      images: [
        'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=800&q=80'
      ],
      tags: ['gym', 'fitness', 'pullup'],
      rating: 4.8,
      reviewCount: 47
    },
    {
      name: 'High-Density Foam Roller for Muscle Therapy',
      category: 'Sports & Fitness',
      price: 24.99,
      salePrice: 18.99,
      stock: 130,
      description: '36-inch round EPP foam roller for deep tissue massage, physical therapy, and spinal alignment.',
      images: [
        'https://images.unsplash.com/photo-1575052814086-f385e2e2ad1b?auto=format&fit=crop&w=800&q=80'
      ],
      tags: ['foamroller', 'recovery', 'fitness'],
      rating: 4.9,
      reviewCount: 84
    },
    {
      name: 'Canvas Waterproof Camera Backpack',
      category: 'Accessories & Travel',
      price: 89.99,
      salePrice: 69.99,
      stock: 45,
      description: 'Vintage waxed canvas photography rucksack with padded customizable dividers and tripod holder.',
      images: [
        'https://images.unsplash.com/photo-1546938576-6e6a64f317cc?auto=format&fit=crop&w=800&q=80'
      ],
      tags: ['backpack', 'camera', 'travel'],
      rating: 4.8,
      reviewCount: 56
    },
    {
      name: 'Universal Global Travel Plug Adapter',
      category: 'Accessories & Travel',
      price: 29.99,
      salePrice: 22.99,
      stock: 160,
      description: 'All-in-one international power adapter with 4 USB ports and Type-C for 150+ countries.',
      images: [
        'https://images.unsplash.com/photo-1583863788434-e58a36330cf0?auto=format&fit=crop&w=800&q=80'
      ],
      tags: ['travel', 'adapter', 'accessories'],
      rating: 4.7,
      reviewCount: 93
    }
  ];

  rawProducts.forEach(item => {
    productRepository.create({
      ...item,
      sku: generateSKU(item.category, item.name),
      stockStatus: item.stock > 0 ? 'IN_STOCK' : 'OUT_OF_STOCK',
      lowStockThreshold: 10,
      variants: []
    });
  });

  logger.info(`Seeded ${productRepository.findAll().length} products.`);

  // 4. Seed Reviews
  reviewRepository.clear();
  const allProds = productRepository.findAll();
  allProds.slice(0, 8).forEach(p => {
    reviewRepository.create({
      productId: p.id,
      userId: customer1.id,
      userName: 'Verified Purchaser',
      rating: 5,
      title: 'Outstanding build quality and fast shipping',
      comment: `Received ${p.name} in mint condition. The performance and craftsmanship exceed expectations.`
    });
  });

  // 5. Seed Coupons
  couponRepository.clear();
  couponRepository.create({
    code: 'WELCOME10',
    discountType: 'PERCENTAGE',
    discountValue: 10,
    minOrderValue: 25,
    maxDiscountAmount: 100,
    usageLimit: 1000,
    usedCount: 5,
    isActive: true
  });
  couponRepository.create({
    code: 'SUMMER20',
    discountType: 'FIXED',
    discountValue: 20,
    minOrderValue: 60,
    usageLimit: 500,
    usedCount: 2,
    isActive: true
  });
  couponRepository.create({
    code: 'FREESHIP',
    discountType: 'FIXED',
    discountValue: 15,
    minOrderValue: 40,
    usageLimit: 1000,
    usedCount: 8,
    isActive: true
  });

  logger.info('Database seeding complete successfully.');
}

if (require.main === module) {
  seedDatabase();
}

module.exports = seedDatabase;
