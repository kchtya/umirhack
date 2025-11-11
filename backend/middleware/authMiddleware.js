import jwt from 'jsonwebtoken';
import { supabase } from '../config/supabaseClient.js';

// Verify JWT token middleware (ПРОМЕЖУТОЧНОЕ ПО для проверки JWT-токена)
export const authenticateToken = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

    if (!token) {
      return res.status(401).json({
        success: false,
        error: {
          code: 'TOKEN_REQUIRED',
          message: 'Access token is required'
        }
      });
    }

    // Verify JWT token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Check if user still exists in database (проверить существует ли пользователь в базе данных)
    const { data: user, error } = await supabase
      .from('users')
      .select('id, email, name')
      .eq('id', decoded.userId)
      .single();

    if (error || !user) {
      return res.status(401).json({
        success: false,
        error: {
          code: 'INVALID_TOKEN',
          message: 'User not found or token is invalid'
        }
      });
    }

    // Add user info to request (добавить информацию о пользователе в запрос)
    req.userId = decoded.userId;
    req.userEmail = decoded.email;
    req.user = user;

    next();

  } catch (error) {
    console.error('Auth middleware error:', error);

    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({
        success: false,
        error: {
          code: 'INVALID_TOKEN',
          message: 'Invalid token'
        }
      });
    }

    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        error: {
          code: 'TOKEN_EXPIRED',
          message: 'Token has expired'
        }
      });
    }

    res.status(500).json({
      success: false,
      error: {
        code: 'AUTHENTICATION_FAILED',
        message: 'Authentication failed'
      }
    });
  }
};

// Optional authentication - doesn't fail if no token, but adds user if present (Необязательная аутентификация — не завершается ошибкой при отсутствии токена, но добавляет пользователя, если токен присутствует)
export const optionalAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
      return next(); // Continue without user (работать в анонимном режиме)
    }

    // Verify JWT token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Check if user exists
    const { data: user, error } = await supabase
      .from('users')
      .select('id, email, name')
      .eq('id', decoded.userId)
      .single();

    if (!error && user) {
      req.userId = decoded.userId;
      req.userEmail = decoded.email;
      req.user = user;
      req.isAuthenticated = true;
    }

    next();

  } catch (error) {
    // If token is invalid, just continue without authentication (если токен недействителен, просто продолжить без аутентификации)
    console.log('Optional auth - invalid token, continuing anonymously');
    next();
  }
};

// Admin role check middleware (проверка прав администратора)
export const requireAdmin = async (req, res, next) => {
  try {
    if (!req.userId) {
      return res.status(401).json({
        success: false,
        error: {
          code: 'UNAUTHORIZED',
          message: 'Authentication required'
        }
      });
    }

    // Check if user has admin role
    const { data: user, error } = await supabase
      .from('users')
      .select('role')
      .eq('id', req.userId)
      .single();

    if (error || !user) {
      return res.status(404).json({
        success: false,
        error: {
          code: 'USER_NOT_FOUND',
          message: 'User not found'
        }
      });
    }

    if (user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        error: {
          code: 'FORBIDDEN',
          message: 'Admin access required'
        }
      });
    }

    next();

  } catch (error) {
    console.error('Admin check error:', error);
    res.status(500).json({
      success: false,
      error: {
        code: 'ADMIN_CHECK_FAILED',
        message: 'Failed to verify admin access'
      }
    });
  }
};

// Validate request body middleware
export const validateRequest = (schema) => {
  return (req, res, next) => {
    const { error } = schema.validate(req.body);
    
    if (error) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: error.details[0].message
        }
      });
    }
    
    next();
  };
};

// Rate limiting by user ID (prevents spam) (ограничение частоты запросов по ID пользователя (от спама))
export const userRateLimit = (req, res, next) => {
  // This is a simple in-memory rate limiter (Это простой ограничитель частоты запросов в памяти)
  // In production, use Redis for distributed rate limiting (В продакшене используйте Redis для распределенного ограничения частоты)
  
  const rateLimitStore = new Map();
  const WINDOW_MS = 15 * 60 * 1000; // 15 minutes
  const MAX_REQUESTS = 100; // 100 requests per window

  if (!req.userId) {
    return next(); // Skip rate limiting for anonymous users (пропустить ограничение частоты для анонимных пользователей)
  }

  const now = Date.now();
  const windowStart = now - WINDOW_MS;
  const userRequests = rateLimitStore.get(req.userId) || [];

  // Remove old requests outside the current window
  const recentRequests = userRequests.filter(time => time > windowStart);

  if (recentRequests.length >= MAX_REQUESTS) {
    return res.status(429).json({
      success: false,
      error: {
        code: 'RATE_LIMIT_EXCEEDED',
        message: 'Too many requests, please try again later'
      }
    });
  }

  // Add current request
  recentRequests.push(now);
  rateLimitStore.set(req.userId, recentRequests);

  next();
};

// CORS middleware for specific origins (промежуточное ПО CORS для белого списка доменов)
export const corsWithOptions = (req, res, next) => {
  const allowedOrigins = [
    process.env.FRONTEND_URL,
    'http://localhost:5173',
    'http://localhost:3000'
  ];

  const origin = req.headers.origin;
  
  if (allowedOrigins.includes(origin)) {
    res.header('Access-Control-Allow-Origin', origin);
  }
  
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  res.header('Access-Control-Allow-Credentials', 'true');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  next();
};

export {
  authenticateToken,
  optionalAuth,
  requireAdmin,
  validateRequest,
  userRateLimit,
  corsWithOptions
};