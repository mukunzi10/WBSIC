/**
 * Sanlam | Allianz Insurance Management System - Backend
 * Version: 2.2.0 (CORS Final Fix + Preflight + Stability Improvements)
 */

require('dotenv').config({ path: './.env' });
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const compression = require('compression');
const morgan = require('morgan');
const path = require('path');
const fs = require('fs');
const mongoose = require('mongoose');

const { sanitizeRequest } = require('./src/middleware/sanitize');
const errorHandler = require('./src/middleware/errorHandler');
const connectDB = require('./src/config/database');
const serviceRoutes = require('./src/routes/serviceRoutes');


// =====================================================
// ⚙️ Config
// =====================================================
const config = {
  port: parseInt(process.env.PORT, 10) || 5000,
  env: process.env.NODE_ENV || 'development',
  mongoUri: process.env.MONGODB_URI,
  frontendUrls: [
    process.env.FRONTEND_URL || 'http://localhost:3000',
    'http://127.0.0.1:3000',

    // Additional allowed origins
    'http://localhost:3001',
    'http://127.0.0.1:3001',
    'http://localhost:3002',
    'http://127.0.0.1:3002',
  ]
};

// Validate required environment variables
['MONGODB_URI', 'JWT_SECRET'].forEach(key => {
  if (!process.env[key]) {
    console.error(`❌ Missing environment variable: ${key}`);
    process.exit(1);
  }
});

// =====================================================
// 🧱 Express Init
// =====================================================
const app = express();
app.disable('x-powered-by');
app.set('trust proxy', 1);

// =====================================================
// 🔥 FIXED: GLOBAL PRE-FLIGHT HANDLER
// =====================================================
app.use((req, res, next) => {
  const origin = req.headers.origin;

  if (config.frontendUrls.includes(origin)) {
    res.header('Access-Control-Allow-Origin', origin);
  }
  
  res.header('Access-Control-Allow-Credentials', 'true');
  res.header(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept, Authorization'
  );
  res.header('Access-Control-Allow-Methods', 'GET,POST,PUT,PATCH,DELETE,OPTIONS');

  // Respond to preflight OPTIONS immediately
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }

  next();
});

// =====================================================
// 📁 Directory Creation
// =====================================================
['temp', 'uploads', 'uploads/documents', 'uploads/images', 'logs'].forEach(dir => {
  const dirPath = path.join(__dirname, dir);
  if (!fs.existsSync(dirPath)) fs.mkdirSync(dirPath, { recursive: true });
});

// =====================================================
// 🗄️ DB Connection
// =====================================================
connectDB();

// =====================================================
// 🛡️ Security Middleware
// =====================================================
app.use(
  helmet({
    crossOriginEmbedderPolicy: false,
    contentSecurityPolicy: false
  })
);

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(sanitizeRequest);

// =====================================================
// 🌐 CORS (Secondary Layer for API Requests)
// =====================================================
app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin) return callback(null, true);
      if (config.frontendUrls.includes(origin)) return callback(null, true);

      console.warn(`⚠️ Blocked by CORS: ${origin}`);
      return callback(new Error('Not allowed by CORS'), false);
    },
    credentials: true
  })
);

// =====================================================
// ⚡ Compression
// =====================================================
app.use(compression());

// =====================================================
// 🧾 Logging
// =====================================================
if (config.env === 'development') {
  app.use(morgan('dev'));
} else {
  const logDir = path.join(__dirname, 'logs');
  const accessLog = fs.createWriteStream(path.join(logDir, 'access.log'), { flags: 'a' });
  app.use(morgan('combined', { stream: accessLog }));
}

// =====================================================
// 🧍 Request ID
// =====================================================
app.use((req, res, next) => {
  req.id = `${Date.now()}-${Math.random().toString(36).substring(2, 10)}`;
  res.setHeader('X-Request-Id', req.id);
  next();
});

// =====================================================
// 🚦 Rate Limiting
// =====================================================
app.use(
  '/api/',
  rateLimit({
    windowMs: 15 * 60 * 1000,
    max: config.env === 'development' ? 1000 : 200,
    legacyHeaders: false,
    standardHeaders: true,
    message: { success: false, message: 'Too many requests. Try later.' }
  })
);

// =====================================================
// 🗂️ Static Files
// =====================================================
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// =====================================================
// 🚦 Routes
// =====================================================
const routes = [
  { path: '/api/auth', file: './src/routes/authRoutes' },
  { path: '/api/policies', file: './src/routes/policyRoutes' },
  { path: '/api/claims', file: './src/routes/claimRoutes' },
  { path: '/api/payments', file: './src/routes/paymentRoutes' },
  { path: '/api/complaints', file: './src/routes/complaintRoutes' },
  { path: '/api/feedback', file: './src/routes/feedbackRoutes' },
  { path: '/api/services', file: './src/routes/serviceRoutes' },

];
app.use('/api/services', serviceRoutes);
routes.forEach(({ path: routePath, file }) => {
  try {
    const route = require(file);
    app.use(routePath, route);
    console.log(`✅ Loaded route: ${routePath}`);
  } catch (err) {
    console.error(`❌ Failed loading: ${routePath} → ${err.message}`);
  }
});

// =====================================================
// 💡 Info & Health
// =====================================================
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Welcome to Sanlam | Allianz Insurance API',
    version: '2.2.0',
    status: 'Running',
    environment: config.env
  });
});

app.get('/health', (req, res) =>
  res.status(200).json({
    uptime: process.uptime(),
    database: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
    memory: process.memoryUsage(),
    timestamp: new Date().toISOString()
  })
);

// =====================================================
// ❌ 404
// =====================================================
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Route not found: ${req.method} ${req.originalUrl}`,
    requestId: req.id
  });
});

// =====================================================
// ⚠️ Global Error Handler
// =====================================================
app.use(errorHandler);

// =====================================================
// 🧘 Graceful Shutdown
// =====================================================
let server;
const shutdown = async signal => {
  console.log(`\n🛑 ${signal} received. Shutting down gracefully...`);
  if (server) {
    server.close(async () => {
      await mongoose.connection.close();
      console.log('🗄️ Database disconnected');
      process.exit(0);
    });
  }
};
['SIGTERM', 'SIGINT'].forEach(sig => process.on(sig, () => shutdown(sig)));

// =====================================================
// 🚀 Start Server
// =====================================================
server = app.listen(config.port, () => {
  console.log('\n===================================================');
  console.log(`🚀 Server running on port ${config.port}`);
  console.log('===================================================');
  console.log(`📊 Health: http://localhost:${config.port}/health`);
  console.log(`🧭 API: http://localhost:${config.port}/api`);
  console.log(
    `🗄️ DB: ${
      mongoose.connection.readyState === 1 ? 'Connected' : 'Disconnected'
    }`
  );
  console.log('===================================================\n');
});

module.exports = app;
