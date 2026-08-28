/**
 * Application Main Entry Point Alias
 * OmniCommerce Enterprise Platform
 */

const app = require('./server');

if (require.main === module) {
  const config = require('./src/config');
  const logger = require('./src/utils/logger');
  
  app.listen(config.port, config.host, () => {
    logger.info(`====================================================`);
    logger.info(`  ${config.appName} is running`);
    logger.info(`  URL: http://${config.host}:${config.port}`);
    logger.info(`  Environment: ${config.env}`);
    logger.info(`====================================================`);
  });
}

module.exports = app;
