/**
 * Product Review Router Definitions
 * OmniCommerce Enterprise
 */

const express = require('express');
const router = express.Router();
const ReviewController = require('../controllers/reviewController');

router.get('/:productId', ReviewController.getReviews);
router.post('/:productId', ReviewController.createReview);

module.exports = router;
