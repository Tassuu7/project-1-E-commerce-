/**
 * Rate Limiting Middleware Engine
 * OmniCommerce Enterprise
 */

const logger = require('../utils/logger');

const requestCounts = new Map();
const WINDOW_MS = 15 * 60 * 1000; // 15 minutes window
const MAX_REQUESTS_PER_WINDOW = 300;

function rateLimiter(req, res, next) {
  const ip = req.ip || req.connection.remoteAddress || '127.0.0.1';
  const now = Date.now();

  let record = requestCounts.get(ip);

  if (!record || (now - record.startTime > WINDOW_MS)) {
    record = {
      count: 1,
      startTime: now
    };
    requestCounts.set(ip, record);
    return next();
  }

  record.count += 1;

  if (record.count > MAX_REQUESTS_PER_WINDOW) {
    logger.warn(`Rate limit exceeded for IP: ${ip}`);
    return res.status(429).json({
      success: false,
      message: 'Too many requests from this IP address. Please try again after 15 minutes.'
    });
  }

  next();
}

module.exports = rateLimiter;
