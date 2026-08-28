/**
 * Product & Categories Router Definitions
 * OmniCommerce Enterprise
 */

const express = require('express');
const router = express.Router();
const ProductController = require('../controllers/productController');
const { requireRole } = require('../middleware/auth');
const { USER_ROLES, AUDIT_EVENT_TYPES } = require('../config/constants');
const { auditLogger } = require('../middleware/auditLogger');

router.get('/', ProductController.getProducts);
router.get('/categories', ProductController.getCategories);
router.get('/:id', ProductController.getProductById);

router.post('/', requireRole(USER_ROLES.ADMIN, USER_ROLES.SELLER), auditLogger(AUDIT_EVENT_TYPES.PRODUCT_CREATED), ProductController.createProduct);
router.put('/:id', requireRole(USER_ROLES.ADMIN, USER_ROLES.SELLER), auditLogger(AUDIT_EVENT_TYPES.PRODUCT_UPDATED), ProductController.updateProduct);
router.delete('/:id', requireRole(USER_ROLES.ADMIN), auditLogger(AUDIT_EVENT_TYPES.PRODUCT_DELETED), ProductController.deleteProduct);

module.exports = router;
