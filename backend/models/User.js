const supabase = require('../config/supabaseClient');

class User {
  // Регистрация нового пользователя
  static async register(email, password, username = null) {
    try {
      // Создаем пользователя в Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: email,
        password: password,
      });

      if (authError) throw authError;

      // Если регистрация успешна, создаем запись в таблице users
      if (authData.user) {
        const { data: userData, error: userError } = await supabase
          .from('users')
          .insert([
            {
              id: authData.user.id,
              email: email,
              username: username,
            }
          ])
          .select()
          .single();

        if (userError) throw userError;
        return { success: true, user: userData };
      }

      return { success: false, error: 'User not created' };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  // Поиск пользователя по email
  static async findByEmail(email) {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('email', email)
      .single();

    return { data, error };
  }

  // Получение пользователя по ID
  static async findById(id) {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', id)
      .single();

    return { data, error };
  }
}

module.exports = User;