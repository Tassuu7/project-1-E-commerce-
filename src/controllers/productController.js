/**
 * Product & Categories REST API Controller
 * OmniCommerce Enterprise
 */

const ProductService = require('../services/productService');

class ProductController {
  static getProducts(req, res, next) {
    try {
      const result = ProductService.getProducts(req.query);
      res.status(200).json({
        success: true,
        data: result.data,
        pagination: result.pagination
      });
    } catch (err) {
      next(err);
    }
  }

  static getProductById(req, res, next) {
    try {
      const product = ProductService.getProductById(req.params.id);
      res.status(200).json({
        success: true,
        data: product
      });
    } catch (err) {
      next(err);
    }
  }

  static getCategories(req, res, next) {
    try {
      const categories = ProductService.getCategories();
      res.status(200).json({
        success: true,
        data: categories
      });
    } catch (err) {
      next(err);
    }
  }

  static createProduct(req, res, next) {
    try {
      const product = ProductService.createProduct(req.body);
      res.status(201).json({
        success: true,
        message: 'Product created successfully.',
        data: product
      });
    } catch (err) {
      next(err);
    }
  }

  static updateProduct(req, res, next) {
    try {
      const updated = ProductService.updateProduct(req.params.id, req.body);
      res.status(200).json({
        success: true,
        message: 'Product updated successfully.',
        data: updated
      });
    } catch (err) {
      next(err);
    }
  }

  static deleteProduct(req, res, next) {
    try {
      const result = ProductService.deleteProduct(req.params.id);
      res.status(200).json({
        success: true,
        message: 'Product deleted successfully.',
        data: result
      });
    } catch (err) {
      next(err);
    }
  }
}

module.exports = ProductController;
