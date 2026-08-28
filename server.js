/**
 * Server Launcher & Express Application Server Entry Point
 * OmniCommerce Enterprise
 */

const express = require('express');
const path = require('path');
const config = require('./src/config');
const apiRoutes = require('./src/routes');
const { authenticate } = require('./src/middleware/auth');
const rateLimiter = require('./src/middleware/rateLimiter');
const { errorHandler, notFoundHandler } = require('./src/middleware/errorHandler');
const logger = require('./src/utils/logger');

const app = express();

// Body Parser Middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Global Rate Limiter & Authentication Context
app.use('/api', rateLimiter);
app.use(authenticate);

// API Routes
app.use('/api', apiRoutes);

// Static Web Assets (Storefront & Admin HTML/CSS/JS)
app.use(express.static(path.join(__dirname, 'public')));

// Catch-all for HTML Frontend Routes
app.get('*', (req, res, next) => {
  if (req.originalUrl.startsWith('/api')) {
    return next();
  }
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Centralized Error Handling
app.use(notFoundHandler);
app.use(errorHandler);

// Start HTTP Server
if (require.main === module) {
  app.listen(config.port, config.host, () => {
    logger.info(`====================================================`);
    logger.info(`  ${config.appName} is running`);
    logger.info(`  URL: http://${config.host}:${config.port}`);
    logger.info(`  Environment: ${config.env}`);
    logger.info(`====================================================`);
  });
}

module.exports = app;
