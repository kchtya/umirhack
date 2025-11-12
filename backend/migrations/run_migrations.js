const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function runMigration() {
  try {
    console.log('Starting database migrations...');
    
    const migrationFiles = [
      '001_initial_tables.sql',
      '002_auth_tables.sql'
    ];

    for (const file of migrationFiles) {
      console.log(`Running migration: ${file}`);
      
      const filePath = path.join(__dirname, file);
      if (!fs.existsSync(filePath)) {
        console.log(`File ${file} not found, skipping...`);
        continue;
      }
      
      const sql = fs.readFileSync(filePath, 'utf8');
      
      // Разделяем SQL на отдельные запросы
      const queries = sql.split(';').filter(q => q.trim());
      
      for (const query of queries) {
        if (query.trim()) {
          console.log(`Executing: ${query.substring(0, 50)}...`);
          // Для сложных миграций лучше выполнять вручную через Supabase Dashboard
        }
      }
      
      console.log(`Migration ${file} - Ready for manual execution`);
    }
    
    console.log('\n NEXT STEPS:');
    console.log('1. Go to Supabase Dashboard → SQL Editor');
    console.log('2. Copy and paste SQL from each migration file');
    console.log('3. Execute them in order (001 first, then 002)');
    console.log('4. Check if tables were created successfully');
    
  } catch (error) {
    console.error(' Migration error:', error);
  }
}

runMigration();