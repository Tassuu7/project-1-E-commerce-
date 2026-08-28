/**
 * Product Data Model Definition
 * OmniCommerce Enterprise
 */

const { generateUUID, generateSKU, slugify } = require('../utils/helpers');
const { INVENTORY_ALERT_LEVELS } = require('../config/constants');

class Product {
  constructor({
    id = generateUUID(),
    name,
    sku,
    category,
    price,
    salePrice = null,
    stock = 0,
    lowStockThreshold = 10,
    description = '',
    images = [],
    tags = [],
    rating = 5.0,
    reviewCount = 0,
    variants = [], // Array of { id, name, sku, price, stock, attributes: { color, size } }
    createdAt = new Date().toISOString(),
    updatedAt = new Date().toISOString()
  }) {
    this.id = id;
    this.name = name;
    this.slug = slugify(name);
    this.sku = sku || generateSKU(category, name);
    this.category = category;
    this.price = parseFloat(price) || 0;
    this.salePrice = salePrice !== null && salePrice !== undefined ? parseFloat(salePrice) : null;
    this.stock = parseInt(stock, 10) || 0;
    this.lowStockThreshold = parseInt(lowStockThreshold, 10) || 10;
    this.description = description;
    this.images = images && images.length ? images : ['/images/placeholder.jpg'];
    this.tags = tags || [];
    this.rating = parseFloat(rating) || 5.0;
    this.reviewCount = parseInt(reviewCount, 10) || 0;
    this.variants = variants || [];
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }

  get stockStatus() {
    if (this.stock <= 0) return INVENTORY_ALERT_LEVELS.OUT_OF_STOCK;
    if (this.stock <= this.lowStockThreshold) return INVENTORY_ALERT_LEVELS.LOW_STOCK;
    return INVENTORY_ALERT_LEVELS.IN_STOCK;
  }

  get effectivePrice() {
    return this.salePrice !== null && this.salePrice < this.price ? this.salePrice : this.price;
  }

  toJSON() {
    return {
      id: this.id,
      name: this.name,
      slug: this.slug,
      sku: this.sku,
      category: this.category,
      price: this.price,
      salePrice: this.salePrice,
      effectivePrice: this.effectivePrice,
      stock: this.stock,
      stockStatus: this.stockStatus,
      lowStockThreshold: this.lowStockThreshold,
      description: this.description,
      images: this.images,
      tags: this.tags,
      rating: this.rating,
      reviewCount: this.reviewCount,
      variants: this.variants,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt
    };
  }
}

module.exports = Product;
