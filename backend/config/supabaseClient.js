import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

// Validate environment variables (проверить переменные окружения)
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Missing Supabase environment variables. Please check your .env file');
}

// Create Supabase client
export const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  },
  db: {
    schema: 'public'
  }
});

// Test connection (проверить подключение)
export const testConnection = async () => {
  try {
    const { data, error } = await supabase.from('users').select('count').limit(1);
    
    if (error) {
      console.error('❌ Supabase connection failed:', error.message);
      return false;
    }
    
    console.log('✅ Supabase connected successfully');
    return true;
  } catch (error) {
    console.error('❌ Supabase connection error:', error.message);
    return false;
  }
};

// Helper function for error handling (помощник для обработки ошибок)
export const handleSupabaseError = (error) => {
  console.error('Supabase Error:', error);
  
  return {
    success: false,
    error: {
      code: error.code || 'DATABASE_ERROR',
      message: error.message || 'Database operation failed',
      details: error.details || null
    }
  };
};

export default supabase;