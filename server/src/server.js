import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import multer from 'multer';
import { connectDB } from './config/db.js';
import projectRoutes from './routes/projectRoutes.js';
import photoRoutes from './routes/photoRoutes.js';
import authRoutes from './routes/authRoutes.js';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const CLIENT_URL = process.env.CLIENT_URL || 'http://localhost:5173';

// CORS configuration: support local dev + production frontend
const allowedOrigins = [
  CLIENT_URL,
  'http://localhost:5173',
  'http://127.0.0.1:5173'
];

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (e.g. mobile apps, curl, Postman)
      if (!origin || allowedOrigins.includes(origin)) {
        return callback(null, true);
      }
      return callback(null, true); // Permissive during early development
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
  })
);

// Body parsers (50mb to comfortably accommodate large payload metadata)
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Health Check Endpoint
app.get('/api/health', (req, res) => {
  const dbStatus = mongoose.connection.readyState;
  const statusMap = {
    0: 'disconnected',
    1: 'connected',
    2: 'connecting',
    3: 'disconnecting'
  };

  res.status(200).json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptimeSeconds: Math.floor(process.uptime()),
    database: {
      state: statusMap[dbStatus] || 'unknown',
      connected: dbStatus === 1
    }
  });
});


// API Resource Routes
app.use('/api/auth', authRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/photos', photoRoutes);

// Root welcome endpoint
app.get('/', (req, res) => {
  res.json({
    name: 'Portfolio Backend API',
    version: '1.0.0',
    documentation: '/api/health',
    endpoints: {
      health: '/api/health',
      auth: {
        login: 'POST /api/auth/login',
        me: 'GET /api/auth/me'
      },
      projects: '/api/projects',
      featuredProjects: '/api/projects/featured',
      photos: '/api/photos',
      featuredPhotos: '/api/photos/featured',
      photoCategories: '/api/photos/categories'
    }
  });
});

// 404 Handler for undefined routes
app.use((req, res, next) => {
  res.status(404).json({
    error: 'Not Found',
    message: `Cannot ${req.method} ${req.originalUrl}`
  });
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('[Unhandled Error]', err);

  // Handle Multer file upload errors cleanly with HTTP 400
  if (err.name === 'MulterError' || err instanceof multer.MulterError) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({
        success: false,
        error: 'FileTooLarge',
        message: 'File too large. Maximum allowed size is 25 MB per image.'
      });
    }
    if (err.code === 'LIMIT_FILE_COUNT') {
      return res.status(400).json({
        success: false,
        error: 'TooManyFiles',
        message: 'Too many files. You can upload up to 20 images at once.'
      });
    }
    return res.status(400).json({
      success: false,
      error: err.name,
      message: err.message
    });
  }

  const statusCode = err.status || err.statusCode || 500;
  res.status(statusCode).json({
    success: false,
    error: err.name || 'InternalServerError',
    message: err.message || 'An unexpected error occurred.',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
});

// Start Server & Connect Database
let server;

async function startServer() {
  server = app.listen(PORT, () => {
    console.log(`[Server] Portfolio API running on http://localhost:${PORT}`);
    console.log(`[Server] Health check available at http://localhost:${PORT}/api/health`);
    console.log(`[Server] Configured client origin: ${CLIENT_URL}`);
  });

  // Attempt database connection without blocking HTTP server availability
  await connectDB();

  return server;
}

// Only auto-start when run directly (not when imported in tests)
if (process.env.NODE_ENV !== 'test') {
  startServer();
}

export { app, startServer };
export default app;
