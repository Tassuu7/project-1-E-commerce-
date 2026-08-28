/**
 * Product Catalog & Variant Domain Service
 * OmniCommerce Enterprise
 */

const { productRepository, categoryRepository } = require('../repositories');
const Validator = require('../utils/validator');
const logger = require('../utils/logger');

class ProductService {
  static getProducts({ category, search, minPrice, maxPrice, sortBy, page = 1, limit = 12 } = {}) {
    const predicate = (product) => {
      if (category && category !== 'ALL' && product.category.toLowerCase() !== category.toLowerCase()) {
        return false;
      }

      if (search && search.trim() !== '') {
        const query = search.trim().toLowerCase();
        const nameMatch = product.name.toLowerCase().includes(query);
        const descMatch = product.description.toLowerCase().includes(query);
        const tagMatch = product.tags.some(tag => tag.toLowerCase().includes(query));
        if (!nameMatch && !descMatch && !tagMatch) return false;
      }

      const effectivePrice = product.effectivePrice;
      if (minPrice && effectivePrice < parseFloat(minPrice)) return false;
      if (maxPrice && effectivePrice > parseFloat(maxPrice)) return false;

      return true;
    };

    const p = parseInt(page, 10) || 1;
    const l = parseInt(limit, 10) || 12;

    const result = productRepository.findPaginated(predicate, p, l);

    // Apply sorting
    if (sortBy === 'price_asc') {
      result.data.sort((a, b) => a.effectivePrice - b.effectivePrice);
    } else if (sortBy === 'price_desc') {
      result.data.sort((a, b) => b.effectivePrice - a.effectivePrice);
    } else if (sortBy === 'rating') {
      result.data.sort((a, b) => b.rating - a.rating);
    } else {
      // default newest
      result.data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }

    return result;
  }

  static getProductById(id) {
    const product = productRepository.findById(id);
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
      const err = new Error('Product validation failed.');
      err.statusCode = 400;
      err.errors = validation.errors;
      throw err;
    }

    const newProduct = productRepository.create(productData);
    logger.info(`Product created: ${newProduct.name} (${newProduct.sku})`);
    return newProduct;
  }

  static updateProduct(id, updateData) {
    const updated = productRepository.update(id, updateData);
    if (!updated) {
      const err = new Error('Product not found for update.');
      err.statusCode = 404;
      throw err;
    }
    logger.info(`Product updated: ${updated.name} (${updated.sku})`);
    return updated;
  }

  static deleteProduct(id) {
    const success = productRepository.delete(id);
    if (!success) {
      const err = new Error('Product not found for deletion.');
      err.statusCode = 404;
      throw err;
    }
    logger.info(`Product deleted ID: ${id}`);
    return { success: true, id };
  }

  static getCategories() {
    return categoryRepository.findAll();
  }
}

module.exports = ProductService;
