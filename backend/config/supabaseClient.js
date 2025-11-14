const { createClient } = require("@supabase/supabase-js");
require('dotenv').config();

// ДЕБАГ ПЕРЕМЕННЫХ
console.log('SUPABASE_URL:', process.env.SUPABASE_URL);
console.log('SUPABASE_ANON_KEY:', process.env.SUPABASE_ANON_KEY ? 'KEY EXISTS' : 'KEY MISSING');

const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_ANON_KEY
);

console.log('Supabase client configured');

module.exports = supabase;