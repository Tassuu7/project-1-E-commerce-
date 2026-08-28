/**
 * Warehouse Inventory & Stock Allocation Domain Service
 * OmniCommerce Enterprise
 */

const { productRepository } = require('../repositories');
const { INVENTORY_ALERT_LEVELS } = require('../config/constants');
const logger = require('../utils/logger');

class InventoryService {
  static checkStockAvailability(items = []) {
    const results = [];
    let allAvailable = true;

    for (const item of items) {
      const product = productRepository.findById(item.productId);
      if (!product) {
        results.push({ productId: item.productId, available: false, reason: 'Product not found' });
        allAvailable = false;
        continue;
      }

      const isAvailable = product.stock >= item.quantity;
      if (!isAvailable) allAvailable = false;

      results.push({
        productId: item.productId,
        name: product.name,
        requestedQuantity: item.quantity,
        currentStock: product.stock,
        available: isAvailable
      });
    }

    return { allAvailable, items: results };
  }

  static reserveStock(items = []) {
    const check = this.checkStockAvailability(items);
    if (!check.allAvailable) {
      const err = new Error('Insufficient stock for one or more items.');
      err.statusCode = 400;
      err.details = check.items;
      throw err;
    }

    // Deduct stock
    for (const item of items) {
      const product = productRepository.findById(item.productId);
      const newStock = product.stock - item.quantity;
      productRepository.update(product.id, { stock: newStock });
      logger.info(`Stock reserved for product ${product.sku}: ${product.stock} -> ${newStock}`);
    }

    return { success: true, reservedCount: items.length };
  }

  static restoreStock(items = []) {
    for (const item of items) {
      const product = productRepository.findById(item.productId);
      if (product) {
        const newStock = product.stock + item.quantity;
        productRepository.update(product.id, { stock: newStock });
        logger.info(`Stock restored for product ${product.sku}: ${product.stock} -> ${newStock}`);
      }
    }
  }

  static getLowStockAlerts() {
    const products = productRepository.findAll(p => p.stockStatus !== INVENTORY_ALERT_LEVELS.IN_STOCK);
    return products.map(p => ({
      id: p.id,
      sku: p.sku,
      name: p.name,
      stock: p.stock,
      threshold: p.lowStockThreshold,
      status: p.stockStatus
    }));
  }
}

module.exports = InventoryService;
