/**
 * Unified Sanitizer Middleware (safe for Express 5)
 * Prevents NoSQL injection and XSS attacks.
 */

const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss');

/**
 * Recursively clean strings in objects/arrays
 */
function deepClean(value) {
  if (typeof value === 'string') return xss(value);
  if (Array.isArray(value)) return value.map(deepClean);
  if (value && typeof value === 'object') {
    const cleaned = {};
    for (const [key, val] of Object.entries(value)) cleaned[key] = deepClean(val);
    return cleaned;
  }
  return value;
}

/**
 * Combined request sanitizer
 */
function sanitizeRequest(req, res, next) {
  try {
    // Clean Mongo injection vectors
    mongoSanitize.sanitize(req.body);
    mongoSanitize.sanitize(req.params);
    mongoSanitize.sanitize(req.query);

    // Deep XSS clean
    req.body = deepClean(req.body);
    req.params = deepClean(req.params);
    req.query = deepClean(req.query);
  } catch (err) {
    console.warn('⚠️ Sanitization error:', err.message);
  }
  next();
}

module.exports = { sanitizeRequest };
