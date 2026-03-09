const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const compression = require('compression');
const rateLimit = require('express-rate-limit');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const path = require('path');
const fs = require('fs');
const https = require('https');
const http = require('http');
require('dotenv').config();

// Import configurations
const dbConfig = require('./config/database');
const constants = require('./config/constants');
const { logger } = require('./utils/logger');
const database = require('./utils/database');

// Import routes
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const storeRoutes = require('./routes/storeRoutes');
const productRoutes = require('./routes/productRoutes');
const orderRoutes = require('./routes/orderRoutes');
const affiliateRoutes = require('./routes/affiliateRoutes');
const adminRoutes = require('./routes/adminRoutes');
const aiRoutes = require('./routes/aiRoutes');

// Import middleware
const { errorHandler, notFound } = require('./middleware/errorHandler');
const { authRateLimiter } = require('./middleware/auth');

// Initialize express app
const app = express();

// ==================== Security Middleware ====================

// Helmet for security headers
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'", 'https://fonts.googleapis.com'],
      fontSrc: ["'self'", 'https://fonts.gstatic.com'],
      imgSrc: ["'self'", 'data:', 'https:', 'blob:'],
      scriptSrc: ["'self'", "'unsafe-inline'", "'unsafe-eval'"],
      connectSrc: ["'self'", process.env.FRONTEND_URL || 'http://localhost:3000']
    }
  },
  crossOriginEmbedderPolicy: false,
  crossOriginResourcePolicy: { policy: "cross-origin" }
}));

// CORS configuration
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true,
  optionsSuccessStatus: 200
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: constants.RATE_LIMIT.API.windowMs,
  max: constants.RATE_LIMIT.API.max,
  message: 'Too many requests from this IP, please try again later.',
  standardHeaders: true,
  legacyHeaders: false
});

// Apply rate limiting to all routes
app.use('/api', limiter);

// Stricter rate limit for auth routes
app.use('/api/auth', authRateLimiter());

// ==================== Request Parsing ====================

// Body parser
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Cookie parser
app.use(cookieParser());

// Compression
app.use(compression());

// ==================== Session Management ====================

// Session configuration
app.use(session({
  secret: process.env.SESSION_SECRET || 'quickstore-secret-key',
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({
    mongoUrl: dbConfig.getConnectionString(),
    collectionName: 'sessions',
    ttl: 24 * 60 * 60, // 1 day
    autoRemove: 'native',
    touchAfter: 24 * 3600 // Only update session once per day
  }),
  cookie: {
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true,
    maxAge: 1000 * 60 * 60 * 24, // 24 hours
    sameSite: 'lax'
  }
}));

// ==================== Logging ====================

// Morgan logging
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev', { stream: logger.stream }));
} else {
  app.use(morgan('combined', { stream: logger.stream }));
}

// Request logging middleware
app.use((req, res, next) => {
  const start = Date.now();
  
  res.on('finish', () => {
    const duration = Date.now() - start;
    logger.logRequest(req, res, duration);
  });
  
  next();
});

// ==================== Static Files ====================

// Serve static files
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));
app.use('/static', express.static(path.join(__dirname, '../public')));

// ==================== Health Check ====================

// Health check endpoint
app.get('/health', async (req, res) => {
  const health = {
    status: 'healthy',
    timestamp: new Date(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV,
    version: constants.APP.VERSION,
    database: await database.healthCheck()
  };

  res.status(200).json(health);
});

// ==================== API Routes ====================

// API version prefix
const API_PREFIX = '/api/v1';

// Mount routes
app.use(`${API_PREFIX}/auth`, authRoutes);
app.use(`${API_PREFIX}/user`, userRoutes);
app.use(`${API_PREFIX}/stores`, storeRoutes);
app.use(`${API_PREFIX}/stores/:storeId/products`, productRoutes);
app.use(`${API_PREFIX}/stores/:storeId/orders`, orderRoutes);
app.use(`${API_PREFIX}/affiliate`, affiliateRoutes);
app.use(`${API_PREFIX}/admin`, adminRoutes);
app.use(`${API_PREFIX}/ai`, aiRoutes);

// ==================== API Documentation ====================

// Serve API documentation in development
if (process.env.NODE_ENV === 'development') {
  const swaggerUi = require('swagger-ui-express');
  const swaggerDocument = require('./docs/swagger.json');
  
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
  logger.info('API documentation available at /api-docs');
}

// ==================== Error Handling ====================

// 404 handler
app.use(notFound);

// Error handler
app.use(errorHandler);

// ==================== Graceful Shutdown ====================

// Handle graceful shutdown
const gracefulShutdown = async () => {
  logger.info('Received shutdown signal, closing connections...');

  try {
    await database.disconnectAll();
    
    logger.info('Database connections closed');
    
    process.exit(0);
  } catch (error) {
    logger.error('Error during graceful shutdown:', error);
    process.exit(1);
  }
};

process.on('SIGTERM', gracefulShutdown);
process.on('SIGINT', gracefulShutdown);

// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
  logger.error('Uncaught Exception:', error);
  gracefulShutdown();
});

process.on('unhandledRejection', (reason, promise) => {
  logger.error('Unhandled Rejection at:', promise, 'reason:', reason);
});

// ==================== Server Initialization ====================

// Create HTTP or HTTPS server
let server;

if (process.env.HTTPS === 'true' && process.env.NODE_ENV === 'production') {
  // HTTPS options
  const httpsOptions = {
    key: fs.readFileSync(process.env.SSL_KEY_PATH),
    cert: fs.readFileSync(process.env.SSL_CERT_PATH),
    ca: process.env.SSL_CA_PATH ? fs.readFileSync(process.env.SSL_CA_PATH) : undefined
  };
  
  server = https.createServer(httpsOptions, app);
  logger.info('HTTPS server configured');
} else {
  server = http.createServer(app);
}

// ==================== WebSocket Setup (if needed) ====================

// Initialize Socket.io for real-time features
let io;
if (process.env.ENABLE_WEBSOCKETS === 'true') {
  const socketIO = require('socket.io');
  io = socketIO(server, {
    cors: {
      origin: process.env.FRONTEND_URL || 'http://localhost:3000',
      credentials: true
    }
  });

  // Socket.io middleware for authentication
  io.use(async (socket, next) => {
    try {
      const token = socket.handshake.auth.token;
      const helpers = require('./utils/helpers');
      const decoded = helpers.verifyToken(token);
      
      if (!decoded) {
        return next(new Error('Authentication error'));
      }

      const User = require('./models/User');
      const user = await User.findById(decoded.id).select('-password');
      
      if (!user) {
        return next(new Error('User not found'));
      }

      socket.user = user;
      next();
    } catch (error) {
      next(new Error('Authentication error'));
    }
  });

  // Socket.io connection handler
  io.on('connection', (socket) => {
    logger.info(`User connected: ${socket.user._id}`);

    // Join user to their room
    socket.join(`user:${socket.user._id}`);

    // Handle disconnection
    socket.on('disconnect', () => {
      logger.info(`User disconnected: ${socket.user._id}`);
    });
  });

  // Make io available to routes
  app.set('io', io);
  logger.info('WebSocket server initialized');
}

// ==================== Start Server ====================

// Start server
const PORT = process.env.PORT || 5000;

server.listen(PORT, async () => {
  logger.info(`🚀 Server started on port ${PORT}`);
  logger.info(`📡 Environment: ${process.env.NODE_ENV}`);
  logger.info(`🔗 API URL: http://localhost:${PORT}${API_PREFIX}`);
  
  if (process.env.NODE_ENV === 'development') {
    logger.info(`📚 API Docs: http://localhost:${PORT}/api-docs`);
  }

  // Connect to databases
  try {
    await database.connectMongoDB();
    logger.info('✅ MongoDB connected successfully');

    // Ensure indexes are created
    await dbConfig.ensureIndexes();
    logger.info('✅ Database indexes ensured');

    // Connect to Redis if enabled
    if (process.env.ENABLE_REDIS === 'true') {
      await database.connectRedis();
      logger.info('✅ Redis connected successfully');
    }

    // Log server info
    logger.info(`📊 Database stats:`, await database.getStats());

  } catch (error) {
    logger.error('❌ Failed to start server:', error);
    process.exit(1);
  }
});

// ==================== Export app for testing ====================

module.exports = app;