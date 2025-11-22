// const jwt = require('jsonwebtoken');
// const asyncHandler = require('express-async-handler');
// const User = require('../models/User');

// /**
//  * Protect routes – verify JWT and attach user to request
//  */
// exports.protect = asyncHandler(async (req, res, next) => {
//   let token;

//   try {
//     // Check for Bearer token in headers
//     if (
//       req.headers.authorization &&
//       req.headers.authorization.startsWith('Bearer')
//     ) {
//       token = req.headers.authorization.split(' ')[1];
//     }

//     if (!token) {
//       return res.status(401).json({ success: false, message: 'Not authorized, no token provided' });
//     }

//     // Verify token
//     const decoded = jwt.verify(token, process.env.JWT_SECRET);

//     // Attach user to request, exclude password
//     const user = await User.findById(decoded.id).select('-password');
//     if (!user) {
//       return res.status(401).json({ success: false, message: 'Not authorized, user not found' });
//     }

//     req.user = user;
//     next();
//   } catch (error) {
//     // Token expired or invalid
//     return res.status(401).json({ success: false, message: 'Not authorized, token invalid or expired', error: error.message });
//   }
// });

// /**
//  * Role-based authorization middleware
//  * Usage: authorize('admin', 'manager')
//  */
// exports.authorize = (...roles) => {
//   return (req, res, next) => {
//     if (!req.user) {
//       return res.status(401).json({ success: false, message: 'Not authorized, user missing' });
//     }

//     if (!roles.includes(req.user.role)) {
//       return res.status(403).json({
//         success: false,
//         message: `Role '${req.user.role}' not authorized to access this resource`
//       });
//     }

//     next();
//   };
// };

// /**
//  * Convenience middleware for admin-only routes
//  */
// exports.adminOnly = exports.authorize('admin');

const jwt = require('jsonwebtoken');
const asyncHandler = require('express-async-handler');
const User = require('../models/User');

/**
 * Protect routes – verify JWT and attach user to request
 * Supports both Bearer token and cookies
 */
exports.protect = asyncHandler(async (req, res, next) => {
  let token;

  try {
    // Check for Bearer token in headers
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith('Bearer')
    ) {
      token = req.headers.authorization.split(' ')[1];
    }
    // Check for token in cookies (for web sessions)
    else if (req.cookies?.token) {
      token = req.cookies.token;
    }

    if (!token) {
      return res.status(401).json({ 
        success: false, 
        message: 'Access denied. No authentication token provided.' 
      });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Check token expiration explicitly
    if (decoded.exp && Date.now() >= decoded.exp * 1000) {
      return res.status(401).json({ 
        success: false, 
        message: 'Token has expired. Please login again.' 
      });
    }

    // Attach user to request, exclude password and sensitive fields
    const user = await User.findById(decoded.id)
      .select('-password -resetPasswordToken -resetPasswordExpire -__v');

    if (!user) {
      return res.status(401).json({ 
        success: false, 
        message: 'User not found. Token invalid.' 
      });
    }

    // Check if user account is active
    if (user.status && user.status === 'inactive') {
      return res.status(403).json({ 
        success: false, 
        message: 'Your account has been deactivated. Please contact support.' 
      });
    }

    // Check if user is suspended
    if (user.status && user.status === 'suspended') {
      return res.status(403).json({ 
        success: false, 
        message: 'Your account has been suspended. Please contact support.' 
      });
    }

    // Update last active timestamp
    user.lastActive = Date.now();
    await user.save({ validateBeforeSave: false });

    // Attach user to request
    req.user = user;
    next();

  } catch (error) {
    // Handle specific JWT errors
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ 
        success: false, 
        message: 'Token has expired. Please login again.',
        code: 'TOKEN_EXPIRED'
      });
    }

    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ 
        success: false, 
        message: 'Invalid token. Please login again.',
        code: 'INVALID_TOKEN'
      });
    }

    if (error.name === 'NotBeforeError') {
      return res.status(401).json({ 
        success: false, 
        message: 'Token not active yet.',
        code: 'TOKEN_NOT_ACTIVE'
      });
    }

    // Generic error
    return res.status(401).json({ 
      success: false, 
      message: 'Authentication failed.',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

/**
 * Optional authentication - doesn't fail if no token
 * Useful for routes that work for both authenticated and unauthenticated users
 */
exports.optionalAuth = asyncHandler(async (req, res, next) => {
  let token;

  try {
    // Check for Bearer token in headers
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith('Bearer')
    ) {
      token = req.headers.authorization.split(' ')[1];
    }
    // Check for token in cookies
    else if (req.cookies?.token) {
      token = req.cookies.token;
    }

    // If no token, continue without user
    if (!token) {
      return next();
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Attach user to request if valid
    const user = await User.findById(decoded.id)
      .select('-password -resetPasswordToken -resetPasswordExpire');

    if (user && user.status === 'active') {
      req.user = user;
    }

    next();
  } catch (error) {
    // If token is invalid, just continue without user
    next();
  }
});

/**
 * Role-based authorization middleware
 * Usage: authorize('admin', 'agent')
 */
exports.authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ 
        success: false, 
        message: 'Authentication required to access this resource.' 
      });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `Access denied. Role '${req.user.role}' is not authorized to access this resource.`,
        requiredRoles: roles,
        userRole: req.user.role
      });
    }

    next();
  };
};

/**
 * Check multiple permissions
 * User must have ALL specified permissions
 * Usage: checkPermissions('create:claims', 'update:claims')
 */
exports.checkPermissions = (...permissions) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ 
        success: false, 
        message: 'Authentication required.' 
      });
    }

    // Admin has all permissions
    if (req.user.role === 'admin') {
      return next();
    }

    // Check if user has required permissions
    if (!req.user.permissions || !Array.isArray(req.user.permissions)) {
      return res.status(403).json({
        success: false,
        message: 'Access denied. No permissions assigned to your account.'
      });
    }

    const hasAllPermissions = permissions.every(permission => 
      req.user.permissions.includes(permission)
    );

    if (!hasAllPermissions) {
      return res.status(403).json({
        success: false,
        message: 'Access denied. Insufficient permissions.',
        requiredPermissions: permissions,
        userPermissions: req.user.permissions
      });
    }

    next();
  };
};

/**
 * Check if user has ANY of the specified permissions
 * Usage: checkAnyPermission('view:claims', 'view:own-claims')
 */
exports.checkAnyPermission = (...permissions) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ 
        success: false, 
        message: 'Authentication required.' 
      });
    }

    // Admin has all permissions
    if (req.user.role === 'admin') {
      return next();
    }

    if (!req.user.permissions || !Array.isArray(req.user.permissions)) {
      return res.status(403).json({
        success: false,
        message: 'Access denied. No permissions assigned.'
      });
    }

    const hasAnyPermission = permissions.some(permission => 
      req.user.permissions.includes(permission)
    );

    if (!hasAnyPermission) {
      return res.status(403).json({
        success: false,
        message: 'Access denied. You need at least one of the required permissions.',
        requiredPermissions: permissions
      });
    }

    next();
  };
};

/**
 * Resource ownership verification
 * Checks if user owns the resource or is admin
 * Usage: checkOwnership(Model, 'userId') or checkOwnership(Model, 'user')
 */
exports.checkOwnership = (Model, ownerField = 'user') => {
  return asyncHandler(async (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ 
        success: false, 
        message: 'Authentication required.' 
      });
    }

    // Admin can access any resource
    if (req.user.role === 'admin') {
      return next();
    }

    const resourceId = req.params.id;

    if (!resourceId) {
      return res.status(400).json({
        success: false,
        message: 'Resource ID is required.'
      });
    }

    const resource = await Model.findById(resourceId);

    if (!resource) {
      return res.status(404).json({
        success: false,
        message: 'Resource not found.'
      });
    }

    // Check ownership
    const ownerId = resource[ownerField]?.toString() || resource[ownerField];
    const userId = req.user._id.toString();

    if (ownerId !== userId) {
      return res.status(403).json({
        success: false,
        message: 'Access denied. You do not own this resource.'
      });
    }

    // Attach resource to request for reuse
    req.resource = resource;
    next();
  });
};

/**
 * Rate limiting per user (in-memory, for simple cases)
 * For production, use Redis-based rate limiting
 */
const userRequestCounts = new Map();

exports.rateLimitPerUser = (maxRequests = 100, windowMs = 15 * 60 * 1000) => {
  return (req, res, next) => {
    if (!req.user) {
      return next(); // Skip if not authenticated
    }

    const userId = req.user._id.toString();
    const now = Date.now();
    const userKey = `${userId}:${Math.floor(now / windowMs)}`;

    const currentCount = userRequestCounts.get(userKey) || 0;

    if (currentCount >= maxRequests) {
      return res.status(429).json({
        success: false,
        message: 'Too many requests. Please try again later.',
        retryAfter: Math.ceil((windowMs - (now % windowMs)) / 1000)
      });
    }

    userRequestCounts.set(userKey, currentCount + 1);

    // Cleanup old entries
    if (userRequestCounts.size > 10000) {
      const cutoff = Math.floor((now - windowMs) / windowMs);
      for (const [key] of userRequestCounts) {
        const keyTime = parseInt(key.split(':')[1]);
        if (keyTime < cutoff) {
          userRequestCounts.delete(key);
        }
      }
    }

    next();
  };
};

/**
 * Check if user's email is verified
 */
exports.requireEmailVerification = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ 
      success: false, 
      message: 'Authentication required.' 
    });
  }

  if (!req.user.isEmailVerified) {
    return res.status(403).json({
      success: false,
      message: 'Email verification required. Please verify your email to access this resource.',
      code: 'EMAIL_NOT_VERIFIED'
    });
  }

  next();
};

/**
 * Check if user has completed profile
 */
exports.requireCompleteProfile = (requiredFields = []) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ 
        success: false, 
        message: 'Authentication required.' 
      });
    }

    const missingFields = requiredFields.filter(field => !req.user[field]);

    if (missingFields.length > 0) {
      return res.status(403).json({
        success: false,
        message: 'Please complete your profile to access this resource.',
        missingFields,
        code: 'INCOMPLETE_PROFILE'
      });
    }

    next();
  };
};

/**
 * API Key authentication (for server-to-server communication)
 */
exports.authenticateApiKey = asyncHandler(async (req, res, next) => {
  const apiKey = req.headers['x-api-key'];

  if (!apiKey) {
    return res.status(401).json({
      success: false,
      message: 'API key required.'
    });
  }

  // Validate API key (implement your own logic)
  const user = await User.findOne({ 
    apiKey, 
    apiKeyActive: true 
  }).select('-password');

  if (!user) {
    return res.status(401).json({
      success: false,
      message: 'Invalid API key.'
    });
  }

  req.user = user;
  req.apiAuthenticated = true;
  next();
});

/**
 * Audit log middleware - logs user actions
 */
exports.auditLog = (action) => {
  return asyncHandler(async (req, res, next) => {
    // Store original send function
    const originalSend = res.send;

    // Override send function to capture response
    res.send = function (data) {
      // Log the action
      if (req.user) {
        const logEntry = {
          userId: req.user._id,
          userEmail: req.user.email,
          userRole: req.user.role,
          action,
          method: req.method,
          path: req.path,
          ip: req.ip || req.connection.remoteAddress,
          userAgent: req.get('user-agent'),
          timestamp: new Date(),
          statusCode: res.statusCode,
          params: req.params,
          query: req.query,
          // Don't log sensitive data like passwords
          body: sanitizeBody(req.body)
        };

        // Save to audit log (implement your own logging)
        saveAuditLog(logEntry);
      }

      // Call original send
      originalSend.call(this, data);
    };

    next();
  });
};

/**
 * Sanitize request body for logging (remove sensitive fields)
 */
function sanitizeBody(body) {
  if (!body) return {};
  
  const sensitiveFields = ['password', 'token', 'apiKey', 'secret', 'creditCard', 'cvv', 'pin'];
  const sanitized = { ...body };
  
  for (const field of sensitiveFields) {
    if (sanitized[field]) {
      sanitized[field] = '***REDACTED***';
    }
  }
  
  return sanitized;
}

/**
 * Save audit log (implement your own storage)
 */
async function saveAuditLog(logEntry) {
  // Example: Save to database
  // const AuditLog = require('../models/AuditLog');
  // await AuditLog.create(logEntry);
  
  // Or log to file/external service
  if (process.env.NODE_ENV === 'development') {
    console.log('AUDIT:', JSON.stringify(logEntry, null, 2));
  }
}

/**
 * Convenience middleware combinations
 */
exports.adminOnly = exports.authorize('admin');
exports.agentOrAdmin = exports.authorize('agent', 'admin');
exports.clientOnly = exports.authorize('client');

/**
 * Admin or owner can access
 */
exports.adminOrOwner = (Model, ownerField = 'user') => {
  return asyncHandler(async (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ 
        success: false, 
        message: 'Authentication required.' 
      });
    }

    // Admin can access
    if (req.user.role === 'admin') {
      return next();
    }

    // Check ownership
    const resourceId = req.params.id;
    if (!resourceId) {
      return res.status(400).json({
        success: false,
        message: 'Resource ID is required.'
      });
    }

    const resource = await Model.findById(resourceId);
    if (!resource) {
      return res.status(404).json({
        success: false,
        message: 'Resource not found.'
      });
    }

    const ownerId = resource[ownerField]?.toString() || resource[ownerField];
    const userId = req.user._id.toString();

    if (ownerId !== userId) {
      return res.status(403).json({
        success: false,
        message: 'Access denied. Admin privileges or resource ownership required.'
      });
    }

    req.resource = resource;
    next();
  });
};

/**
 * Time-based access control
 * Restrict access during certain hours
 */
exports.timeBasedAccess = (allowedHours = { start: 0, end: 24 }) => {
  return (req, res, next) => {
    const currentHour = new Date().getHours();
    
    if (currentHour < allowedHours.start || currentHour >= allowedHours.end) {
      return res.status(403).json({
        success: false,
        message: `Access is only allowed between ${allowedHours.start}:00 and ${allowedHours.end}:00.`,
        code: 'OUTSIDE_ALLOWED_HOURS'
      });
    }
    
    next();
  };
};

/**
 * IP whitelist/blacklist
 */
exports.ipFilter = (whitelist = [], blacklist = []) => {
  return (req, res, next) => {
    const clientIp = req.ip || req.connection.remoteAddress;
    
    // Check blacklist first
    if (blacklist.length > 0 && blacklist.includes(clientIp)) {
      return res.status(403).json({
        success: false,
        message: 'Access denied from your IP address.',
        code: 'IP_BLOCKED'
      });
    }
    
    // Check whitelist (if specified)
    if (whitelist.length > 0 && !whitelist.includes(clientIp)) {
      return res.status(403).json({
        success: false,
        message: 'Access denied. Your IP is not whitelisted.',
        code: 'IP_NOT_WHITELISTED'
      });
    }
    
    next();
  };
};

/**
 * Two-factor authentication verification
 */
exports.require2FA = asyncHandler(async (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ 
      success: false, 
      message: 'Authentication required.' 
    });
  }

  // Check if user has 2FA enabled
  if (req.user.twoFactorEnabled) {
    const twoFactorToken = req.headers['x-2fa-token'];
    
    if (!twoFactorToken) {
      return res.status(403).json({
        success: false,
        message: '2FA verification required.',
        code: '2FA_REQUIRED'
      });
    }

    // Verify 2FA token (implement your own logic)
    const isValid = await verify2FAToken(req.user._id, twoFactorToken);
    
    if (!isValid) {
      return res.status(403).json({
        success: false,
        message: 'Invalid 2FA token.',
        code: '2FA_INVALID'
      });
    }
  }

  next();
});

/**
 * Verify 2FA token (implement your own logic)
 */
async function verify2FAToken(userId, token) {
  // Example: Verify TOTP token
  // const speakeasy = require('speakeasy');
  // const user = await User.findById(userId);
  // return speakeasy.totp.verify({
  //   secret: user.twoFactorSecret,
  //   encoding: 'base32',
  //   token: token
  // });
  
  return true; // Placeholder
}

module.exports = exports;