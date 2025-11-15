// ================================
// server.js - ЗАКОММЕНТИРОВАН
// ================================

/*
const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Тестовые маршруты
app.get('/api/health', (req, res) => {
  res.json({ 
    success: true, 
    message: 'Backend server is running!',
    timestamp: new Date().toISOString()
  });
});

// Auth routes
app.use('/api/auth', require('./routes/auth'));

// Projects routes
app.use('/api/projects', require('./routes/projects'));

// ✅ ДОБАВЛЕНО: Templates routes
app.use('/api/templates', require('./routes/templates'));

// Запуск сервера
app.listen(PORT, () => {
  console.log(`Backend server running on http://localhost:${PORT}`);
  console.log(`Health check: http://localhost:${PORT}/api/health`);
  console.log(`Templates: http://localhost:${PORT}/api/templates`);
});
*/