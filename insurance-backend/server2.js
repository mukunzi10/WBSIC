/**
 * Insurance Management System - Server Entry Point
 * Production-Ready, Secure, and Optimized
 * @version 2.0.0
 */

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');
const compression = require('compression');
const morgan = require('morgan');
const dotenv = require('dotenv');
const path = require('path');
const fs = require('fs');
const mongoose = require('mongoose');

// ==========================================
// LOAD CONFIGURATION
// ==========================================
dotenv.config({ path: path.join(__dirname, '.env') });

const connectDB = require('./src/config/database');
const errorHandler = require('./src/middleware/errorHandler');

// ==========================================
// ENVIRONMENT VALIDATION
// ==========================================
const requiredEnvVars = ['MONGODB_URI', 'JWT_SECRET', 'NODE_ENV'];
const missingEnvVars = requiredEnvVars.filter(v => !process.env[v]);

if (missingEnvVars.length > 0) {
  console.error(`❌ Missing required environment variables: ${missingEnvVars.join(', ')}`);
  console.error('Please check your .env file and ensure all required variables are set.');
  process.exit(1);
}

// ==========================================
// CONFIGURATION
// ==========================================
const config = {
  port: parseInt(process.env.PORT, 10) || 5000,
  env: process.env.NODE_ENV || 'development',
  isDevelopment: process.env.NODE_ENV === 'development',
  isProduction: process.env.NODE_ENV === 'production',
  mongoUri: process.env.MONGODB_URI,
  jwtSecret: process.env.JWT_SECRET,
  frontendUrl: process.env.FRONTEND_URL || 'http://localhost:3000',
  productionUrl: process.env.PRODUCTION_URL,
  rateLimitWhitelist: (process.env.RATE_LIMIT_WHITELIST || '').split(',').filter(Boolean),
};

// ==========================================
// CREATE REQUIRED DIRECTORIES
// ==========================================
const requiredDirs = ['temp', 'uploads', 'logs', 'uploads/documents', 'uploads/images'];

requiredDirs.forEach(dir => {
  const dirPath = path.join(__dirname, dir);
  if (!fs.existsSync(dirPath)) {
    try {
      fs.mkdirSync(dirPath, { recursive: true });
      console.log(`📁 Created directory: ${dir}`);
    } catch (error) {
      console.error(`❌ Failed to create directory ${dir}:`, error.message);
    }
  }
});

// ==========================================
// INITIALIZE EXPRESS APP
// ==========================================
const app = express();

// Trust proxy (important for rate limiting behind proxies/load balancers)
app.set('trust proxy', 1);

// Disable x-powered-by header
app.disable('x-powered-by');

// ==========================================
// CONNECT TO DATABASE
// ==========================================
connectDB();

// ==========================================
// SECURITY MIDDLEWARES
// ==========================================

// Helmet - Security headers
app.use(
  helmet({
    contentSecurityPolicy: config.isProduction ? {
      directives: {
        defaultSrc: ["'self'"],
        styleSrc: ["'self'", "'unsafe-inline'"],
        scriptSrc: ["'self'"],
        imgSrc: ["'self'", 'data:', 'https:'],
        connectSrc: ["'self'"],
        fontSrc: ["'self'"],
        objectSrc: ["'none'"],
        mediaSrc: ["'self'"],
        frameSrc: ["'none'"],
      },
    } : false,
    crossOriginEmbedderPolicy: false,
    crossOriginResourcePolicy: { policy: 'cross-origin' },
  })
);

// Request parsing with size limits
app.use(
  express.json({
    limit: '10mb',
    verify: (req, res, buf) => {
      try {
        JSON.parse(buf);
      } catch (e) {
        res.status(400).json({ 
          success: false, 
          message: 'Invalid JSON payload',
          error: config.isDevelopment ? e.message : undefined
        });
        throw new Error('Invalid JSON payload');
      }
    },
  })
);

app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// MongoDB injection protection
app.use((req, res, next) => {
  try {
    const { sanitize } = mongoSanitize;
    
    // Sanitize all input
    if (req.body) req.body = sanitize(req.body);
    if (req.params) req.params = sanitize(req.params);
    if (req.headers) req.headers = sanitize(req.headers);
    
    // Clone query to prevent mutation errors
    if (req.query) {
      const cleanQuery = sanitize(req.query);
      req.query = Object.assign({}, cleanQuery);
    }
  } catch (err) {
    console.error('⚠️ MongoDB Sanitize Error:', err.message);
  }
  next();
});

// XSS protection
app.use(xss());

// HTTP Parameter Pollution protection
app.use(
  hpp({
    whitelist: [
      'status', 
      'claimType', 
      'policyType', 
      'priority', 
      'category',
      'sortBy', 
      'sort',
      'page', 
      'limit',
      'search',
      'startDate',
      'endDate'
    ],
  })
);

// ==========================================
// CORS CONFIGURATION
// ==========================================
const allowedOrigins = [
  config.frontendUrl,
  'http://localhost:3000',
  'http://localhost:3002',
  'http://127.0.0.1:3000',
  'http://127.0.0.1:3002',
];

if (config.productionUrl) {
  allowedOrigins.push(config.productionUrl);
}

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (mobile apps, Postman, etc.)
      if (!origin) return callback(null, true);
      
      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }
      
      console.warn(`⚠️ CORS blocked for origin: ${origin}`);
      return callback(new Error('Not allowed by CORS'));
    },
    credentials: true,
    optionsSuccessStatus: 200,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept'],
    exposedHeaders: ['Content-Range', 'X-Content-Range'],
    maxAge: 600, // Cache preflight requests for 10 minutes
  })
);

// Handle preflight requests
app.options('/*', cors());

// ==========================================
// COMPRESSION
// ==========================================
app.use(
  compression({
    filter: (req, res) => {
      if (req.headers['x-no-compression']) {
        return false;
      }
      return compression.filter(req, res);
    },
    level: 6, // Balanced compression level
  })
);

// ==========================================
// LOGGING
// ==========================================
if (config.isDevelopment) {
  app.use(morgan('dev'));
} else {
  // Create logs directory if it doesn't exist
  const logsDir = path.join(__dirname, 'logs');
  if (!fs.existsSync(logsDir)) {
    fs.mkdirSync(logsDir, { recursive: true });
  }

  // Create rotating log stream
  const accessLogStream = fs.createWriteStream(
    path.join(logsDir, 'access.log'),
    { flags: 'a' }
  );

  app.use(morgan('combined', { 
    stream: accessLogStream,
    skip: (req, res) => res.statusCode < 400 // Only log errors in production
  }));
}

// Request ID middleware (for tracking)
app.use((req, res, next) => {
  req.id = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  res.setHeader('X-Request-Id', req.id);
  next();
});

// ==========================================
// RATE LIMITING
// ==========================================

// General API rate limiter
const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: config.isDevelopment ? 1000 : 200, // Higher limit in development
  message: {
    success: false,
    message: 'Too many requests from this IP, please try again in 15 minutes.',
    retryAfter: '15 minutes',
  },
  standardHeaders: true,
  legacyHeaders: false,
  skip: (req) => config.rateLimitWhitelist.includes(req.ip),
  handler: (req, res) => {
    console.warn(`⚠️ Rate limit exceeded for IP: ${req.ip}`);
    res.status(429).json({
      success: false,
      message: 'Too many requests. Please try again later.',
      retryAfter: Math.ceil((req.rateLimit.resetTime - Date.now()) / 1000),
    });
  },
});

// Strict authentication rate limiter
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: config.isDevelopment ? 50 : 20,
  message: {
    success: false,
    message: 'Too many authentication attempts. Please try again in 15 minutes.',
  },
  skipSuccessfulRequests: true,
  skipFailedRequests: false,
});

// Registration rate limiter (more restrictive)
const registerLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: config.isDevelopment ? 20 : 5,
  message: {
    success: false,
    message: 'Too many registration attempts. Please try again in 1 hour.',
  },
});

// Apply rate limiters
app.use('/api/', generalLimiter);
app.use('/api/auth/login', authLimiter);
app.use('/api/auth/register', registerLimiter);

// ==========================================
// STATIC FILES & UPLOADS
// ==========================================
app.use(
  '/uploads',
  express.static(path.join(__dirname, 'uploads'), {
    maxAge: config.isProduction ? '7d' : '1h',
    etag: true,
    lastModified: true,
    immutable: config.isProduction,
    setHeaders: (res, filePath) => {
      // Set proper content types
      if (filePath.endsWith('.pdf')) {
        res.set('Content-Type', 'application/pdf');
      }
      // Prevent directory listing
      res.set('X-Content-Type-Options', 'nosniff');
    },
  })
);

// ==========================================
// HEALTH CHECK & API INFO
// ==========================================
app.get('/health', (req, res) => {
  const healthCheck = {
    uptime: Math.floor(process.uptime()),
    message: 'OK',
    timestamp: Date.now(),
    environment: config.env,
    database: {
      status: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
      host: mongoose.connection.host || 'unknown',
    },
    memory: {
      used: Math.round(process.memoryUsage().heapUsed / 1024 / 1024) + 'MB',
      total: Math.round(process.memoryUsage().heapTotal / 1024 / 1024) + 'MB',
    },
    cpu: process.cpuUsage(),
  };

  const httpStatus = healthCheck.database.status === 'connected' ? 200 : 503;
  res.status(httpStatus).json(healthCheck);
});

app.get('/api', (req, res) => {
  res.json({
    success: true,
    message: 'Insurance Management System API',
    version: '2.0.0',
    environment: config.env,
    endpoints: {
      auth: '/api/auth',
      policies: '/api/policies',
      claims: '/api/claims',
      payments: '/api/payments',
      complaints: '/api/complaints',
      feedback: '/api/feedback',
    },
    documentation: '/api/docs',
    health: '/health',
  });
});

// API version info
app.get('/api/version', (req, res) => {
  res.json({
    version: '2.0.0',
    buildDate: new Date().toISOString(),
    nodeVersion: process.version,
    environment: config.env,
  });
});

// ==========================================
// API ROUTES
// ==========================================
const routeFiles = [
  { path: '/api/auth', file: './src/routes/authRoutes' },
  { path: '/api/policies', file: './src/routes/policyRoutes' },
  { path: '/api/claims', file: './src/routes/claimRoutes' },
  { path: '/api/payments', file: './src/routes/paymentRoutes' },
  { path: '/api/complaints', file: './src/routes/complaintRoutes' },
  { path: '/api/feedback', file: './src/routes/feedbackRoutes' },
];

routeFiles.forEach(({ path: routePath, file }) => {
  try {
    const route = require(file);
    app.use(routePath, route);
    console.log(`✅ Loaded route: ${routePath}`);
  } catch (error) {
    console.error(`❌ Failed to load route ${routePath}:`, error.message);
  }
});

// ==========================================
// ERROR HANDLERS
// ==========================================

// 404 Handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Route not found: ${req.method} ${req.originalUrl}`,
    timestamp: new Date().toISOString(),
    requestId: req.id,
  });
});

// Global error handler
app.use(errorHandler);

// ==========================================
// GRACEFUL SHUTDOWN
// ==========================================
let server;

const gracefulShutdown = async (signal) => {
  console.log(`\n🛑 ${signal} received. Starting graceful shutdown...`);
  
  if (server) {
    server.close(async () => {
      console.log('👋 HTTP server closed');
      
      try {
        await mongoose.connection.close();
        console.log('🗄️  Database connection closed');
        process.exit(0);
      } catch (err) {
        console.error('❌ Error closing database connection:', err);
        process.exit(1);
      }
    });

    // Force shutdown after timeout
    setTimeout(() => {
      console.error('⚠️ Forced shutdown after timeout');
      process.exit(1);
    }, 10000);
  } else {
    process.exit(0);
  }
};

// ==========================================
// PROCESS ERROR HANDLERS
// ==========================================
process.on('unhandledRejection', (reason, promise) => {
  console.error('💥 UNHANDLED REJECTION:', reason);
  console.error('Promise:', promise);
  
  if (config.isProduction) {
    gracefulShutdown('UNHANDLED_REJECTION');
  }
});

process.on('uncaughtException', (error) => {
  console.error('💥 UNCAUGHT EXCEPTION:', error);
  
  if (config.isProduction) {
    gracefulShutdown('UNCAUGHT_EXCEPTION');
  } else {
    process.exit(1);
  }
});

// Graceful shutdown signals
process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));

// ==========================================
// START SERVER
// ==========================================
const startServer = async () => {
  try {
    server = app.listen(config.port, () => {
      console.log('\n' + '='.repeat(70));
      console.log('🚀 Insurance Management System API');
      console.log('='.repeat(70));
      console.log(`✅ Server running on port ${config.port}`);
      console.log(`🌍 Environment: ${config.env}`);
      console.log(`🔗 Local: http://localhost:${config.port}`);
      console.log(`📊 Health: http://localhost:${config.port}/health`);
      console.log(`🔧 API Info: http://localhost:${config.port}/api`);
      console.log(`🗄️  Database: ${mongoose.connection.readyState === 1 ? '✅ Connected' : '❌ Disconnected'}`);
      console.log('='.repeat(70) + '\n');
    });

    // Handle server errors
    server.on('error', (error) => {
      if (error.code === 'EADDRINUSE') {
        console.error(`❌ Port ${config.port} is already in use`);
      } else {
        console.error('❌ Server error:', error);
      }
      process.exit(1);
    });

  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
};

// Start the server
startServer();

module.exports = app;