import bcrypt from 'bcryptjs';
import { supabase, handleSupabaseError } from '../config/supabaseClient.js';

// Get user profile (запросить профиль пользователя)
export const getProfile = async (req, res) => {
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

    // Get user projects count (запросить количество проектов юзера)
    const { count: projectsCount, error: projectsError } = await supabase
      .from('projects')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', userId);

    // Get templates used count (получить количество использованных шаблонов)
    const { count: templatesUsed, error: templatesError } = await supabase
      .from('projects')
      .select('template_id', { count: 'exact', head: true })
      .eq('user_id', userId)
      .not('template_id', 'is', null);

    const userWithStats = {
      ...user,
      projectsCount: projectsCount || 0,
      templatesUsed: templatesUsed || 0
    };

    res.status(200).json({
      success: true,
      data: {
        user: userWithStats
      }
    });

  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({
      success: false,
      error: {
        code: 'PROFILE_FETCH_FAILED',
        message: 'Failed to fetch user profile'
      }
    });
  }
};

// Update user profile (обновить профиль)
export const updateProfile = async (req, res) => {
  try {
    const userId = req.userId;
    const { name, bio, avatar } = req.body;

    // Validate input (проверить входные данные)
    if (!name) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Name is required'
        }
      });
    }

    const updateData = {
      name,
      updated_at: new Date().toISOString()
    };

    if (bio !== undefined) updateData.bio = bio;
    if (avatar !== undefined) updateData.avatar = avatar;

    const { data: user, error } = await supabase
      .from('users')
      .update(updateData)
      .eq('id', userId)
      .select('id, email, name, avatar, bio, created_at, updated_at')
      .single();

    if (error) {
      return res.status(500).json(handleSupabaseError(error));
    }

    res.status(200).json({
      success: true,
      data: {
        user
      },
      message: 'Profile updated successfully'
    });

  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({
      success: false,
      error: {
        code: 'PROFILE_UPDATE_FAILED',
        message: 'Failed to update profile'
      }
    });
  }
};

// Change password (поменять пароль)
export const changePassword = async (req, res) => {
  try {
    const userId = req.userId;
    const { currentPassword, newPassword } = req.body;

    // Validate input
    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Current password and new password are required'
        }
      });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: 'New password must be at least 6 characters long'
        }
      });
    }

// Change password - ИСПРАВЛЕННАЯ ВЕРСИЯ
const changePassword = async (req, res) => {
  try {
    const userId = req.userId;
    const { currentPassword, newPassword } = req.body;

    // Validate input
    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Current password and new password are required'
        }
      });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: 'New password must be at least 6 characters long'
        }
      });
    }

    // Get ONLY password hash for verification (только пароль)
    const { data: user, error: userError } = await supabase
      .from('users')
      .select('password')
      .eq('id', userId)
      .single();

    if (userError || !user) {
      return res.status(404).json({
        success: false,
        error: {
          code: 'USER_NOT_FOUND',
          message: 'User not found'
        }
      });
    }

    // Verify current password
    const isCurrentPasswordValid = await bcrypt.compare(currentPassword, user.password);
    if (!isCurrentPasswordValid) {
      return res.status(401).json({
        success: false,
        error: {
          code: 'INVALID_PASSWORD',
          message: 'Current password is incorrect'
        }
      });
    }

    // Hash new password
    const hashedNewPassword = await bcrypt.hash(newPassword, 12);

    // Update password
    const { error: updateError } = await supabase
      .from('users')
      .update({
        password: hashedNewPassword,
        updated_at: new Date().toISOString()
      })
      .eq('id', userId);

    if (updateError) {
      return res.status(500).json(handleSupabaseError(updateError));
    }

    res.status(200).json({
      success: true,
      message: 'Password changed successfully'
    });

  } catch (error) {
    console.error('Change password error:', error);
    res.status(500).json({
      success: false,
      error: {
        code: 'PASSWORD_CHANGE_FAILED',
        message: 'Failed to change password'
      }
    });
  }
};

    // Verify current password (проверить текущий пароль)
    const isCurrentPasswordValid = await bcrypt.compare(currentPassword, user.password);
    if (!isCurrentPasswordValid) {
      return res.status(401).json({
        success: false,
        error: {
          code: 'INVALID_PASSWORD',
          message: 'Current password is incorrect'
        }
      });
    }

    // Hash new password
    const hashedNewPassword = await bcrypt.hash(newPassword, 12);

    // Update password
    const { error: updateError } = await supabase
      .from('users')
      .update({
        password: hashedNewPassword,
        updated_at: new Date().toISOString()
      })
      .eq('id', userId);

    if (updateError) {
      return res.status(500).json(handleSupabaseError(updateError));
    }

    res.status(200).json({
      success: true,
      message: 'Password changed successfully'
    });

  } catch (error) {
    console.error('Change password error:', error);
    res.status(500).json({
      success: false,
      error: {
        code: 'PASSWORD_CHANGE_FAILED',
        message: 'Failed to change password'
      }
    });
  }
};

// Delete user account
export const deleteAccount = async (req, res) => {
  try {
    const userId = req.userId;
    const { password } = req.body;

    // Validate input
    if (!password) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Password is required to delete account'
        }
      });
    }

    // Get user with password
    const { data: user, error: userError } = await supabase
      .from('users')
      .select('*')
      .eq('id', userId)
      .single();

    if (userError || !user) {
      return res.status(404).json({
        success: false,
        error: {
          code: 'USER_NOT_FOUND',
          message: 'User not found'
        }
      });
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        error: {
          code: 'INVALID_PASSWORD',
          message: 'Password is incorrect'
        }
      });
    }

    // Delete user projects first (due to foreign key constraint) (сначала удалить проекты пользователя (из-за FK-ограничения))
    const { error: projectsError } = await supabase
      .from('projects')
      .delete()
      .eq('user_id', userId);

    if (projectsError) {
      console.error('Error deleting user projects:', projectsError);
    }

    // Delete user
    const { error: deleteError } = await supabase
      .from('users')
      .delete()
      .eq('id', userId);

    if (deleteError) {
      return res.status(500).json(handleSupabaseError(deleteError));
    }

    res.status(200).json({
      success: true,
      message: 'Account deleted successfully'
    });

  } catch (error) {
    console.error('Delete account error:', error);
    res.status(500).json({
      success: false,
      error: {
        code: 'ACCOUNT_DELETION_FAILED',
        message: 'Failed to delete account'
      }
    });
  }
};

// Export user data
export const exportData = async (req, res) => {
  try {
    const userId = req.userId;

    // Get user data
    const { data: user, error: userError } = await supabase
      .from('users')
      .select('id, email, name, avatar, bio, created_at, updated_at')
      .eq('id', userId)
      .single();

    if (userError || !user) {
      return res.status(404).json({
        success: false,
        error: {
          code: 'USER_NOT_FOUND',
          message: 'User not found'
        }
      });
    }

    // Get user projects
    const { data: projects, error: projectsError } = await supabase
      .from('projects')
      .select('*')
      .eq('user_id', userId);

    if (projectsError) {
      console.error('Error fetching projects:', projectsError);
    }

    const exportData = {
      user,
      projects: projects || [],
      exportedAt: new Date().toISOString(),
      dataVersion: '1.0'
    };

    res.status(200).json({
      success: true,
      data: exportData,
      message: 'Data exported successfully'
    });

  } catch (error) {
    console.error('Export data error:', error);
    res.status(500).json({
      success: false,
      error: {
        code: 'DATA_EXPORT_FAILED',
        message: 'Failed to export user data'
      }
    });
  }
};

export {
  getProfile,
  updateProfile,
  changePassword,
  deleteAccount,
  exportData
};