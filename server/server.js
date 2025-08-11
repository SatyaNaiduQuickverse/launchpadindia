const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

const authRoutes = require('./routes/auth');
const resumeRoutes = require('./routes/resumes');
const userRoutes = require('./routes/users');

const app = express();
const PORT = process.env.PORT || 5000;

// Enhanced logging
const debugLog = (message, data = null) => {
  const timestamp = new Date().toISOString();
  console.log(`\n🔍 [${timestamp}] ${message}`);
  if (data) {
    console.log('📊 Data:', JSON.stringify(data, null, 2));
  }
};

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 1000 // Increased limit for development
});

// FIXED CORS configuration - Added port 3037
const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (mobile apps, curl, etc.)
    if (!origin) return callback(null, true);
    
    const allowedOrigins = [
      'http://localhost:3035',
      'http://localhost:3037',  // ✅ ADDED THIS
      'http://localhost:3000', 
      'http://35.154.20.15:3035',
      'http://35.154.20.15:3037',  // ✅ ADDED THIS - YOUR FRONTEND
      'http://35.154.20.15:3000'
    ];
    
    console.log(`🌐 CORS Check - Origin: ${origin}`);
    
    if (allowedOrigins.indexOf(origin) !== -1) {
      console.log('✅ CORS allowed for origin:', origin);
      callback(null, true);
    } else {
      console.log('❌ CORS blocked origin:', origin);
      console.log('🔧 Allowed origins:', allowedOrigins);
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  optionsSuccessStatus: 200 // Some legacy browsers choke on 204
};

// Middleware
app.use(helmet({
  crossOriginEmbedderPolicy: false // Fix for CORS issues
}));

app.use(cors(corsOptions));

// Handle preflight requests
app.options('*', cors(corsOptions));

app.use(express.json({ 
  limit: '10mb',
  verify: (req, res, buf) => {
    try {
      JSON.parse(buf);
    } catch (e) {
      console.log('❌ Invalid JSON in request body');
      throw new Error('Invalid JSON');
    }
  }
}));
app.use(express.urlencoded({ extended: true }));

// Enhanced morgan logging
app.use(morgan(':method :url :status :res[content-length] - :response-time ms'));

app.use(limiter);

// Request logging middleware
app.use((req, res, next) => {
  if (req.method !== 'GET') {
    debugLog(`${req.method} ${req.url}`, {
      origin: req.headers.origin,
      userAgent: req.headers['user-agent'],
      contentType: req.headers['content-type'],
      bodySize: req.body ? JSON.stringify(req.body).length : 0
    });
  }
  next();
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/resumes', resumeRoutes);
app.use('/api/users', userRoutes);

// Health check
app.get('/health', (req, res) => {
  res.status(200).json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    memory: process.memoryUsage(),
    cors: 'enabled'
  });
});

// Test CORS endpoint
app.get('/api/test-cors', (req, res) => {
  res.json({
    message: 'CORS is working!',
    origin: req.headers.origin,
    timestamp: new Date().toISOString()
  });
});

// Enhanced error handling middleware
app.use((err, req, res, next) => {
  debugLog('💥 GLOBAL ERROR HANDLER', {
    error: err.message,
    stack: err.stack,
    url: req.url,
    method: req.method,
    origin: req.headers.origin
  });
  
  // Special handling for CORS errors
  if (err.message === 'Not allowed by CORS') {
    return res.status(403).json({
      message: 'CORS Error: Origin not allowed',
      origin: req.headers.origin,
      allowedOrigins: [
        'http://localhost:3035',
        'http://localhost:3037',
        'http://35.154.20.15:3035', 
        'http://35.154.20.15:3037'
      ]
    });
  }
  
  res.status(err.status || 500).json({ 
    message: 'Something went wrong!',
    error: process.env.NODE_ENV === 'production' ? 'Internal server error' : err.message,
    debug: process.env.NODE_ENV !== 'production' ? err.stack : undefined
  });
});

// 404 handler
app.use('*', (req, res) => {
  debugLog('404 - Route not found', { url: req.originalUrl, method: req.method });
  res.status(404).json({ message: 'Route not found' });
});

app.listen(PORT, () => {
  console.log('\n🚀 Resume Builder Server Starting...');
  console.log(`📡 Server running on port ${PORT}`);
  console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🔧 CORS enabled for ports: 3035, 3037, 3000`);
  console.log(`📊 Memory usage: ${Math.round(process.memoryUsage().heapUsed / 1024 / 1024)} MB`);
  console.log('✅ Server ready to accept connections\n');
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('👋 SIGTERM received, shutting down gracefully');
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('👋 SIGINT received, shutting down gracefully');
  process.exit(0);
});

// Add admin routes
app.use('/api/admin', require('./routes/admin'));
