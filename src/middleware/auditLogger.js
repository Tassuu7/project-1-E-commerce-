/**
 * Security & Administrative Audit Logging Middleware
 * OmniCommerce Enterprise
 */

const logger = require('../utils/logger');
const { generateUUID } = require('../utils/helpers');

const auditLogs = [];

function auditLogger(actionType) {
  return (req, res, next) => {
    const originalSend = res.send;

    res.send = function (data) {
      if (res.statusCode >= 200 && res.statusCode < 300) {
        const auditEntry = {
          id: generateUUID(),
          actionType: actionType || `${req.method}_${req.baseUrl}${req.path}`,
          userId: req.user ? req.user.id : 'ANONYMOUS',
          userEmail: req.user ? req.user.email : 'N/A',
          userRole: req.user ? req.user.role : 'N/A',
          method: req.method,
          path: req.originalUrl,
          ip: req.ip || req.connection.remoteAddress,
          timestamp: new Date().toISOString()
        };

        auditLogs.push(auditEntry);
        if (auditLogs.length > 1000) auditLogs.shift(); // keep last 1000 logs in buffer
        logger.info(`AUDIT: [${auditEntry.actionType}] performed by ${auditEntry.userEmail}`);
      }

      return originalSend.apply(res, arguments);
    };

    next();
  };
}

function getAuditLogs() {
  return auditLogs;
}

module.exports = {
  auditLogger,
  getAuditLogs
};
