/**
 * JWT Authentication & RBAC Middleware
 * OmniCommerce Enterprise
 */

const config = require('../config');
const { USER_ROLES } = require('../config/constants');

// Simulated token verification
function verifyToken(token) {
  if (!token) return null;
  try {
    const raw = Buffer.from(token, 'base64').toString('utf8');
    const payload = JSON.parse(raw);
    if (payload.exp && payload.exp < Math.floor(Date.now() / 1000)) {
      return null; // Expired token
    }
    return payload;
  } catch (err) {
    return null;
  }
}

function generateToken(user) {
  const payload = {
    id: user.id,
    email: user.email,
    name: user.name,
    role: user.role || USER_ROLES.CUSTOMER,
    iat: Math.floor(Date.now() / 1000),
    exp: Math.floor(Date.now() / 1000) + config.jwtExpiresIn
  };
  return Buffer.from(JSON.stringify(payload)).toString('base64');
}

function authenticate(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    req.user = null;
    return next();
  }

  const parts = authHeader.split(' ');
  if (parts.length === 2 && parts[0] === 'Bearer') {
    const payload = verifyToken(parts[1]);
    if (payload) {
      req.user = payload;
    }
  }
  next();
}

function requireAuth(req, res, next) {
  if (!req.user) {
    return res.status(401).json({
      success: false,
      message: 'Unauthorized access. Authentication token is missing or expired.'
    });
  }
  next();
}

function requireRole(...roles) {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ success: false, message: 'Authentication required.' });
    }
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `Forbidden. Role '${req.user.role}' is not authorized to access this resource.`
      });
    }
    next();
  };
}

module.exports = {
  authenticate,
  requireAuth,
  requireRole,
  generateToken,
  verifyToken
};
