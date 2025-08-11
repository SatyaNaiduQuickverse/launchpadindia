require('dotenv').config();
const pool = require('../config/database');
const bcrypt = require('bcryptjs');

const setupAdmin = async () => {
  try {
    console.log('🔧 Setting up admin functionality...');
    
    // Add is_admin column if it doesn't exist
    const checkColumn = await pool.query(`
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_name='users' AND column_name='is_admin'
    `);
    
    if (checkColumn.rows.length === 0) {
      await pool.query(`ALTER TABLE users ADD COLUMN is_admin BOOLEAN DEFAULT false`);
      console.log('✅ Added is_admin column');
    }
    
    // Create admin user if doesn't exist
    const adminExists = await pool.query('SELECT id FROM users WHERE email = $1', ['admin@resumebuilder.com']);
    
    if (adminExists.rows.length === 0) {
      const password = 'admin123'; // Change this!
      const salt = await bcrypt.genSalt(10);
      const passwordHash = await bcrypt.hash(password, salt);
      
      await pool.query(`
        INSERT INTO users (email, password_hash, first_name, last_name, is_admin) 
        VALUES ($1, $2, $3, $4, $5)
      `, ['admin@resumebuilder.com', passwordHash, 'Admin', 'User', true]);
      
      console.log('✅ Admin user created:');
      console.log('   Email: admin@resumebuilder.com');
      console.log('   Password: admin123');
      console.log('   🚨 CHANGE THIS PASSWORD!');
    } else {
      console.log('✅ Admin user already exists');
    }
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    pool.end();
  }
};

setupAdmin();
