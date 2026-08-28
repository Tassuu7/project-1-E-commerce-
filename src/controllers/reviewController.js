/**
 * Product Review REST API Controller
 * OmniCommerce Enterprise
 */

const ReviewService = require('../services/reviewService');

class ReviewController {
  static getReviews(req, res, next) {
    try {
      const { productId } = req.params;
      const reviews = ReviewService.getReviewsByProduct(productId);
      res.status(200).json({
        success: true,
        data: reviews
      });
    } catch (err) {
      next(err);
    }
  }

  static createReview(req, res, next) {
    try {
      const { productId } = req.params;
      const userId = req.user ? req.user.id : 'GUEST';
      const userName = req.user ? req.user.name : req.body.userName;
      const review = ReviewService.addReview({
        productId,
        userId,
        userName,
        ...req.body
      });
      res.status(201).json({
        success: true,
        message: 'Review posted successfully.',
        data: review
      });
    } catch (err) {
      next(err);
    }
  }
}

module.exports = ReviewController;
