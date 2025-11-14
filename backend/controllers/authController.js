const supabase = require('../config/supabaseClient');

const authController = {
  async register(req, res) {
    try {
      const { email, password, username } = req.body;
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

      const { data: userData, error: userError } = await supabase
        .from('users')
        .insert([{ 
          id: authData.user.id, 
          email: email, 
          username: username, 
          role: 'user' 
        }])
        .select()
        .single();

      if (userError) {
        await supabase.auth.admin.deleteUser(authData.user.id);
        return res.status(400).json({ 
          success: false, 
          error: userError.message 
        });
      }

      res.status(201).json({ 
        success: true, 
        message: 'Пользователь успешно зарегистрирован', 
        user: userData, 
        session: authData.session 
      });
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

      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('*')
        .eq('id', data.user.id)
        .single();

      if (userError) {
        return res.status(404).json({ 
          success: false, 
          error: 'Пользователь не найден' 
        });
      }

      res.json({ 
        success: true, 
        message: 'Вход выполнен успешно', 
        user: userData, 
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

      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('*')
        .eq('id', user.id)
        .single();

      if (userError || !userData) {
        return res.status(404).json({ 
          success: false, 
          error: 'Пользователь не найден' 
        });
      }

      res.json({ 
        success: true, 
        user: userData 
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
      const { email } = req.body;
      const { data: user, error } = await supabase
        .from('users')
        .select('*')
        .eq('email', email)
        .single();

      if (error || !user) {
        return res.status(404).json({ 
          success: false, 
          error: 'Пользователь не найден' 
        });
      }

      const { data: updatedUser, error: updateError } = await supabase
        .from('users')
        .update({ role: 'admin' })
        .eq('id', user.id)
        .select()
        .single();

      if (updateError) throw updateError;

      res.json({ 
        success: true, 
        message: 'Права администратора выданы', 
        user: updatedUser 
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