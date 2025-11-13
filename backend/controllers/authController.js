const User = require('../models/User');
const supabase = require('../config/supabaseClient');

const authController = {
  // Регистрация пользователя
  async register(req, res) {
    try {
      const { email, password, username } = req.body;

      // Проверяем обязательные поля
      if (!email || !password) {
        return res.status(400).json({
          success: false,
          error: 'Email и пароль обязательны'
        });
      }

      // Регистрируем пользователя
      const result = await User.register(email, password, username);

      if (result.success) {
        res.status(201).json({
          success: true,
          message: 'Пользователь успешно зарегистрирован',
          user: result.user
        });
      } else {
        res.status(400).json({
          success: false,
          error: result.error
        });
      }
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  },

  // Вход пользователя
  async login(req, res) {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return res.status(400).json({
          success: false,
          error: 'Email и пароль обязательны'
        });
      }

      // Аутентификация в Supabase
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email,
        password: password,
      });

      if (error) throw error;

      res.json({
        success: true,
        message: 'Вход выполнен успешно',
        user: data.user,
        session: data.session
      });
    } catch (error) {
      res.status(401).json({
        success: false,
        error: 'Неверный email или пароль'
      });
    }
  },

  // Выход пользователя
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
  }
};

module.exports = authController;