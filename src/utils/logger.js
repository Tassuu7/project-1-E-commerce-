/**
 * Structured Logger Module
 * OmniCommerce Enterprise
 */

const fs = require('fs');
const path = require('path');
const config = require('../config');

const logDir = path.resolve(__dirname, '../../logs');
if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir, { recursive: true });
}

const logFilePath = path.join(logDir, 'app.log');

const LOG_LEVELS = {
  error: 0,
  warn: 1,
  info: 2,
  debug: 3
};

const currentLevelPriority = LOG_LEVELS[config.logLevel] || 2;

function formatMessage(level, message, meta = {}) {
  const timestamp = new Date().toISOString();
  const metaString = Object.keys(meta).length ? ` ${JSON.stringify(meta)}` : '';
  return `[${timestamp}] [${level.toUpperCase()}] ${message}${metaString}`;
}

function writeToFile(formattedMsg) {
  try {
    fs.appendFileSync(logFilePath, formattedMsg + '\n');
  } catch (err) {
    console.error('Failed to write log to file:', err);
  }
}

const logger = {
  info: (message, meta = {}) => {
    if (LOG_LEVELS.info <= currentLevelPriority) {
      const msg = formatMessage('info', message, meta);
      console.log(msg);
      writeToFile(msg);
    }
  },
  warn: (message, meta = {}) => {
    if (LOG_LEVELS.warn <= currentLevelPriority) {
      const msg = formatMessage('warn', message, meta);
      console.warn(msg);
      writeToFile(msg);
    }
  },
  error: (message, meta = {}) => {
    if (LOG_LEVELS.error <= currentLevelPriority) {
      const msg = formatMessage('error', message, meta);
      console.error(msg);
      writeToFile(msg);
    }
  },
  debug: (message, meta = {}) => {
    if (LOG_LEVELS.debug <= currentLevelPriority) {
      const msg = formatMessage('debug', message, meta);
      console.log(msg);
      writeToFile(msg);
    }
  }
};

module.exports = logger;
