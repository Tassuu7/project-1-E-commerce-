/**
 * Application Configuration Module
 * OmniCommerce Enterprise
 */

const path = require('path');

const config = {
  env: process.env.NODE_ENV || 'development',
  port: parseInt(process.env.PORT || '3000', 10),
  host: process.env.HOST || 'localhost',
  appName: process.env.APP_NAME || 'OmniCommerce Enterprise',
  appUrl: process.env.APP_URL || 'http://localhost:3000',
  jwtSecret: process.env.JWT_SECRET || 'omnicommerce_super_secret_jwt_key_change_in_production_2026',
  jwtExpiresIn: parseInt(process.env.JWT_EXPIRES_IN || '86400', 10), // 24 hours in seconds
  storageDir: path.resolve(__dirname, '../../data'),
  logLevel: process.env.LOG_LEVEL || 'info',
  tax: {
    defaultRate: 0.08, // 8% default sales tax
    regionalRates: {
      'CA': 0.0925,
      'NY': 0.08875,
      'TX': 0.0825,
      'FL': 0.07,
      'IL': 0.0875,
      'WA': 0.091,
      'UK': 0.20,
      'DE': 0.19,
      'IN': 0.18
    }
  },
  shipping: {
    flatRateThreshold: 100.0, // Free shipping above $100
    standardFee: 9.99,
    expressFee: 24.99,
    overnightFee: 49.99
  }
};

module.exports = config;
