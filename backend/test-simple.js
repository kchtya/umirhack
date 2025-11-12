require('dotenv').config();
const supabase = require('./config/supabaseClient');

async function quickTest() {
  console.log('Quick Supabase Test Starting...');
  
  try {
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .limit(1);

    if (error) {
      console.log('Connection works, but tables might be empty');
      console.log('Error details:', error.message);
    } else {
      console.log('SUCCESS! Database is connected and accessible!');
      console.log('Data sample:', data);
    }
  } catch (err) {
    console.log('Connection failed:', err.message);
  }
}

quickTest();