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
app.get('/api/projects', (req, res) => {
      res.json({
      success: true,
      data: [
      { id: 1, name: 'Тестовый проект 1', description: 'Первый проект' },
      { id: 2, name: 'Тестовый проект 2', description: 'Второй проект' }
    ]
  });
});

// Запуск сервера
app.listen(PORT, () => {
  console.log(`Backend server running on http://localhost:${PORT}`);
  console.log(`Health check: http://localhost:${PORT}/api/health`);
});