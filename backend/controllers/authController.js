// ================================
// authController.js - ЗАКОММЕНТИРОВАН
// ================================

/*
const supabase = require('../config/supabaseClient');

const authController = {
  async register(req, res) {
    try {
      const { email, password, name } = req.body;
      if (!email || !password) {
        return res.status(400).json({ 
          success: false, 
          error: 'Email и пароль обязательны' 
        });
      }

      const { data: authData, error: authError } = await supabase.auth.signUp({ 
        email: email, 
        password: password 
      });
      
      if (authError) {
        return res.status(400).json({ 
          success: false, 
          error: authError.message 
        });
      }

      // УБРАН блок с созданием в таблице users - используем только Supabase Auth
      if (authData.user) {
        res.status(201).json({ 
          success: true, 
          message: 'Пользователь успешно зарегистрирован', 
          user: {
            id: authData.user.id,
            email: authData.user.email,
            name: name
          },
          session: authData.session 
        });
      } else {
        return res.status(400).json({ 
          success: false, 
          error: 'Ошибка регистрации' 
        });
      }
    } catch (error) {
      res.status(500).json({ 
        success: false, 
        error: error.message 
      });
    }
  },

  async login(req, res) {
    try {
      const { email, password } = req.body;
      if (!email || !password) {
        return res.status(400).json({ 
          success: false, 
          error: 'Email и пароль обязательны' 
        });
      }

      const { data, error } = await supabase.auth.signInWithPassword({ 
        email: email, 
        password: password 
      });
      
      if (error) {
        return res.status(401).json({ 
          success: false, 
          error: 'Неверный email или пароль' 
        });
      }

      // Для входа тоже убираем обращение к таблице users
      res.json({ 
        success: true, 
        message: 'Вход выполнен успешно', 
        user: {
          id: data.user.id,
          email: data.user.email
        },
        session: data.session 
      });
    } catch (error) {
      res.status(500).json({ 
        success: false, 
        error: 'Ошибка при входе в систему' 
      });
    }
  },

  async logout(req, res) {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      
      res.json({ 
        success: true, 
        message: 'Выход выполнен успешно' 
      });
    } catch (error) {
      res.status(500).json({ 
        success: false, 
        error: error.message 
      });
    }
  },

  async getMe(req, res) {
    try {
      const token = req.header('Authorization')?.replace('Bearer ', '');
      if (!token) {
        return res.status(401).json({ 
          success: false, 
          error: 'Токен отсутствует' 
        });
      }

      const { data: { user }, error } = await supabase.auth.getUser(token);
      if (error || !user) {
        return res.status(401).json({ 
          success: false, 
          error: 'Недействительный токен' 
        });
      }

      // Убираем обращение к таблице users
      res.json({ 
        success: true, 
        user: {
          id: user.id,
          email: user.email
        }
      });
    } catch (error) {
      res.status(500).json({ 
        success: false, 
        error: error.message 
      });
    }
  },

  async makeAdmin(req, res) {
    try {
      // Временно отключаем функцию выдачи админки
      return res.status(501).json({ 
        success: false, 
        error: 'Функция временно недоступна' 
      });
    } catch (error) {
      res.status(500).json({ 
        success: false, 
        error: error.message 
      });
    }
  }
};

module.exports = authController;
*/