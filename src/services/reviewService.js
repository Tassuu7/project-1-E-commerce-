/**
 * Customer Product Review & Moderation Domain Service
 * OmniCommerce Enterprise
 */

const { reviewRepository, productRepository } = require('../repositories');
const logger = require('../utils/logger');

class ReviewService {
  static getReviewsByProduct(productId) {
    return reviewRepository.findAll(r => r.productId === productId && r.status === 'APPROVED');
  }

  static addReview({ productId, userId, userName, rating, title, comment }) {
    const product = productRepository.findById(productId);
    if (!product) {
      const err = new Error('Product not found.');
      err.statusCode = 404;
      throw err;
    }

    const review = reviewRepository.create({
      productId,
      userId,
      userName: userName || 'Verified Customer',
      rating: parseInt(rating, 10),
      title,
      comment,
      status: 'APPROVED'
    });

    // Recalculate average rating for product
    const allReviews = reviewRepository.findAll(r => r.productId === productId && r.status === 'APPROVED');
    const totalRating = allReviews.reduce((sum, r) => sum + r.rating, 0);
    const avgRating = Math.round((totalRating / allReviews.length) * 10) / 10;

    productRepository.update(product.id, {
      rating: avgRating,
      reviewCount: allReviews.length
    });

    logger.info(`New review added for product ${product.sku}: ${rating} stars`);
    return review;
  }
}

module.exports = ReviewService;
