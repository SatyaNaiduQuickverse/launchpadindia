require('dotenv').config();
const pool = require('../config/database');

const resetDatabase = async () => {
  try {
    console.log('🔄 Resetting database...');
    
    // Drop tables in correct order (foreign keys first)
    await pool.query('DROP TABLE IF EXISTS resume_submissions CASCADE');
    await pool.query('DROP TABLE IF EXISTS resumes CASCADE');
    await pool.query('DROP TABLE IF EXISTS users CASCADE');
    
    console.log('✅ Tables dropped');
    console.log('🚀 Run "npm run migrate" to recreate tables');
    
  } catch (error) {
    console.error('❌ Error resetting database:', error);
  } finally {
    pool.end();
  }
};

resetDatabase();
