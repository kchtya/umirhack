// ================================
// authMiddleware.js - ЗАКОММЕНТИРОВАН
// ================================

/*
const supabase = require('../config/supabaseClient');

const authenticateToken = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ 
        success: false, 
        error: 'Токен доступа отсутствует' 
      });
    }

    // Проверяем токен через Supabase
    const { data: { user }, error } = await supabase.auth.getUser(token);
    
    if (error || !user) {
      return res.status(401).json({ 
        success: false, 
        error: 'Недействительный токен' 
      });
    }

    // Используем данные из Supabase Auth, не проверяем таблицу users
    req.user = {
      id: user.id,
      email: user.email,
      role: 'user' // По умолчанию
    };
    
    next();
  } catch (error) {
    console.error('Auth middleware error:', error);
    res.status(401).json({ 
      success: false, 
      error: 'Ошибка аутентификации' 
    });
  }
};

const requireAdmin = (req, res, next) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ 
      success: false, 
      error: 'Требуются права администратора' 
    });
  }
  next();
};

module.exports = { authenticateToken, requireAdmin };
*/