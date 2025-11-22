/**
 * Safe XSS sanitizer for Express 5+
 * Cleans potentially dangerous HTML and script tags from input fields.
 */
const xss = require('xss');

function deepClean(input) {
  if (typeof input === 'string') return xss(input);
  if (Array.isArray(input)) return input.map(deepClean);
  if (typeof input === 'object' && input !== null) {
    const cleaned = {};
    for (const [key, value] of Object.entries(input)) {
      cleaned[key] = deepClean(value);
    }
    return cleaned;
  }
  return input;
}

module.exports = (req, res, next) => {
  if (req.body) req.body = deepClean(req.body);
  if (req.params) req.params = deepClean(req.params);
  if (req.query) req.query = deepClean(req.query);
  next();
};
// ==========================================