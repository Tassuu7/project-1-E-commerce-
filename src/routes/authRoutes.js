/**
 * Auth Router Definitions
 * OmniCommerce Enterprise
 */

const express = require('express');
const router = express.Router();
const AuthController = require('../controllers/authController');
const { requireAuth } = require('../middleware/auth');
const { auditLogger } = require('../middleware/auditLogger');
const { AUDIT_EVENT_TYPES } = require('../config/constants');

router.post('/register', auditLogger(AUDIT_EVENT_TYPES.USER_REGISTER), AuthController.register);
router.post('/login', auditLogger(AUDIT_EVENT_TYPES.USER_LOGIN), AuthController.login);
router.get('/me', requireAuth, AuthController.getProfile);

module.exports = router;
