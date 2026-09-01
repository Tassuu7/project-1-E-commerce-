/**
 * Product Catalog & Variant Domain Service
 * OmniCommerce Enterprise
 */

const { productRepository, categoryRepository } = require('../repositories');
const Validator = require('../utils/validator');
const logger = require('../utils/logger');

class ProductService {
  static getProducts({ category, search, minPrice, maxPrice, sortBy, page = 1, limit = 50 } = {}) {
    const predicate = (product) => {
      if (category && category !== 'ALL' && product.category.toLowerCase() !== category.toLowerCase()) {
        return false;
      }

      if (search && search.trim() !== '') {
        const query = search.trim().toLowerCase();
        const nameMatch = product.name && product.name.toLowerCase().includes(query);
        const descMatch = product.description && product.description.toLowerCase().includes(query);
        const tagMatch = product.tags && product.tags.some(tag => tag.toLowerCase().includes(query));
        const catMatch = product.category && product.category.toLowerCase().includes(query);
        if (!nameMatch && !descMatch && !tagMatch && !catMatch) return false;
      }

      const effectivePrice = product.effectivePrice || product.price;
      if (minPrice && effectivePrice < parseFloat(minPrice)) return false;
      if (maxPrice && effectivePrice > parseFloat(maxPrice)) return false;

      return true;
    };

    const p = parseInt(page, 10) || 1;
    const l = parseInt(limit, 10) || 50;

    const result = productRepository.findPaginated(predicate, p, l);

    // Apply sorting
    if (sortBy === 'price_asc') {
      result.data.sort((a, b) => (a.effectivePrice || a.price) - (b.effectivePrice || b.price));
    } else if (sortBy === 'price_desc') {
      result.data.sort((a, b) => (b.effectivePrice || b.price) - (a.effectivePrice || a.price));
    } else if (sortBy === 'rating') {
      result.data.sort((a, b) => (b.rating || 0) - (a.rating || 0));
    } else {
      // default newest
      result.data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }

    return result;
  }

  static getProductById(idOrSlugOrSku) {
    if (!idOrSlugOrSku) {
      const err = new Error('Product identifier required.');
      err.statusCode = 400;
      throw err;
    }

    const cleanKey = decodeURIComponent(idOrSlugOrSku).trim().toLowerCase();
    const product = productRepository.findAll(p => 
      (p.id && p.id.toLowerCase() === cleanKey) || 
      (p.slug && p.slug.toLowerCase() === cleanKey) || 
      (p.sku && p.sku.toLowerCase() === cleanKey) ||
      (p.name && p.name.toLowerCase() === cleanKey)
    )[0] || productRepository.findById(idOrSlugOrSku);

    if (!product) {
      const err = new Error('Product not found.');
      err.statusCode = 404;
      throw err;
    }
    return product;
  }

  static createProduct(productData) {
    const validation = Validator.validateProduct(productData);
    if (!validation.valid) {
      const err = new Error('Validation failed for product.');
      err.statusCode = 400;
      err.errors = validation.errors;
      throw err;
    }

    // Ensure category exists
    const category = categoryRepository.findAll(c => c.name.toLowerCase() === productData.category.toLowerCase())[0];
    if (!category) {
      categoryRepository.create({
        name: productData.category,
        slug: productData.category.toLowerCase().replace(/\s+/g, '-')
      });
    }

    const product = productRepository.create(productData);
    logger.info(`Product created: ${product.name} (SKU: ${product.sku})`);
    return product;
  }

  static updateProduct(id, updateData) {
    const existing = this.getProductById(id);
    const updated = productRepository.update(existing.id, updateData);
    logger.info(`Product updated: ${updated.name}`);
    return updated;
  }

  static deleteProduct(id) {
    const existing = this.getProductById(id);
    productRepository.delete(existing.id);
    logger.info(`Product deleted: ${id}`);
    return true;
  }
}

module.exports = ProductService;
