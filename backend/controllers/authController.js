import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { supabase, handleSupabaseError } from '../config/supabaseClient.js';

// Register new user 
export const register = async (req, res) => {
  try {
    const { email, password, name } = req.body;

    // Validate input (проверить входные данные)
    if (!email || !password || !name) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Email, password and name are required'
        }
      });
    }

    // Check if user already exists (проверить зарегестрирован ли уже)
    const { data: existingUser, error: checkError } = await supabase
      .from('users')
      .select('id')
      .eq('email', email)
      .single();

    if (existingUser) {
      return res.status(409).json({
        success: false,
        error: {
          code: 'USER_EXISTS',
          message: 'User with this email already exists'
        }
      });
    }

    // Hash password (преобразовать пароль в хэш)
    const hashedPassword = await bcrypt.hash(password, 12);

    // Create user
    const { data: user, error: createError } = await supabase
      .from('users')
      .insert([
        {
          email,
          password: hashedPassword,
          name,
          avatar: null,
          bio: null,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }
      ])
      .select()
      .single();

    if (createError) {
      return res.status(500).json(handleSupabaseError(createError));
    }

    // Generate JWT token
    const token = jwt.sign(
      { userId: user.id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN }
    );

    // Remove password from response (удалить пароль из ответа)
    const { password: _, ...userWithoutPassword } = user;

    res.status(201).json({
      success: true,
      data: {
        user: userWithoutPassword,
        token
      },
      message: 'User registered successfully'
    });

  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({
      success: false,
      error: {
        code: 'REGISTRATION_FAILED',
        message: 'Failed to register user'
      }
    });
  }
};

// Login user
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate input (проверить переменные окружения)
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Email and password are required'
        }
      });
    }

    // Find user
    const { data: user, error: findError } = await supabase
      .from('users')
      .select('*')
      .eq('email', email)
      .single();

    if (findError || !user) {
      return res.status(401).json({
        success: false,
        error: {
          code: 'INVALID_CREDENTIALS',
          message: 'Invalid email or password'
        }
      });
    }

    // Check password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        error: {
          code: 'INVALID_CREDENTIALS',
          message: 'Invalid email or password'
        }
      });
    }

    // Generate JWT token
    const token = jwt.sign(
      { userId: user.id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN }
    );

    // Remove password from response
    const { password: _, ...userWithoutPassword } = user;

    res.status(200).json({
      success: true,
      data: {
        user: userWithoutPassword,
        token
      },
      message: 'Login successful'
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      error: {
        code: 'LOGIN_FAILED',
        message: 'Failed to login'
      }
    });
  }
};

// Get current user profile (запросить профиль текущего пользователя)
export const getMe = async (req, res) => {
  try {
    const userId = req.userId;

    const { data: user, error } = await supabase
      .from('users')
      .select('id, email, name, avatar, bio, created_at, updated_at')
      .eq('id', userId)
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

    res.status(200).json({
      success: true,
      data: {
        user
      }
    });

  } catch (error) {
    console.error('Get me error:', error);
    res.status(500).json({
      success: false,
      error: {
        code: 'PROFILE_FETCH_FAILED',
        message: 'Failed to fetch user profile'
      }
    });
  }
};

// Logout user (разлогинить пользователя)
export const logout = async (req, res) => {
  try {
// В реальном приложении может потребоваться внести токен в черный список
// JWT не сохраняет состояние, поэтоиу просто возврат success
    
    res.status(200).json({
      success: true,
      message: 'Logout successful'
    });

  } catch (error) {
    console.error('Logout error:', error);
    res.status(500).json({
      success: false,
      error: {
        code: 'LOGOUT_FAILED',
        message: 'Failed to logout'
      }
    });
  }
};