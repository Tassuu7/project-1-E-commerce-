/**
 * Product Review & Rating Model Definition
 * OmniCommerce Enterprise
 */

const { generateUUID } = require('../utils/helpers');

class Review {
  constructor({
    id = generateUUID(),
    productId,
    userId,
    userName,
    rating = 5,
    title = '',
    comment = '',
    verifiedPurchase = true,
    status = 'APPROVED',
    createdAt = new Date().toISOString()
  }) {
    this.id = id;
    this.productId = productId;
    this.userId = userId;
    this.userName = userName;
    this.rating = parseInt(rating, 10);
    this.title = title;
    this.comment = comment;
    this.verifiedPurchase = verifiedPurchase;
    this.status = status;
    this.createdAt = createdAt;
  }
}

module.exports = Review;
