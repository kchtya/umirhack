import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import path from 'path';
import { fileURLToPath } from 'url';

// Import routes (импорт роутов)
import authRoutes from './routes/auth.js';
import userRoutes from './routes/users.js';
import templateRoutes from './routes/templates.js';

// Load environment variables (загрузка переменных окружения)
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Для ES modules __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Security middleware (слой безопасности)
app.use(helmet());

// CORS configuration (настройка CORS)
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true
}));

// Rate limiting (лимит частоты запросов)
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: process.env.NODE_ENV === 'production' ? 100 : 1000, // разные лимиты для dev/prod
  message: {
    success: false,
    error: {
      code: 'RATE_LIMIT_EXCEEDED',
      message: 'Too many requests from this IP, please try again later'
    }
  }
});
app.use('/api/', limiter);

// Body parsing middleware (промежуточное ПО для парсинга тела запроса)
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Static files (статичные файлы - из ее версии)
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Health check endpoint (конечная точка проверки состояния)
app.get('/api/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Backend server is running!',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// Тестовые данные (из ее версии, можно временно оставить для демонстрации)
app.get('/api/projects', (req, res) => {
  res.json({
    success: true,
    data: [
      { id: 1, name: 'Тестовый проект 1', description: 'Первый проект' },
      { id: 2, name: 'Тестовый проект 2', description: 'Второй проект' }
    ]
  });
});

// API routes (ваши роуты)
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/templates', templateRoutes);

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    error: {
      code: 'NOT_FOUND',
      message: 'Route not found'
    }
  });
});

// Global error handler
app.use((error, req, res, next) => {
  console.error('Error:', error);

  // Если ошибка от rate-limiter
  if (error.status === 429) {
    return res.status(429).json({
      success: false,
      error: {
        code: 'RATE_LIMIT_EXCEEDED',
        message: 'Too many requests, please try again later'
      }
    });
  }

  res.status(500).json({
    success: false,
    error: {
      code: 'INTERNAL_SERVER_ERROR',
      message: process.env.NODE_ENV === 'production' 
        ? 'Something went wrong on the server' 
        : error.message
    }
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Backend server running on http://localhost:${PORT}`);
  console.log(`📊 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🔗 Health check: http://localhost:${PORT}/api/health`);
  console.log(`📁 Static files: http://localhost:${PORT}/uploads`);
});

export default app;