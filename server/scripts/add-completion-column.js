require('dotenv').config();
const pool = require('../config/database');

const addColumn = async () => {
  try {
    console.log('🔧 Adding completion_percentage column...');
    
    // Check if column already exists
    const checkColumn = await pool.query(`
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_name='resumes' AND column_name='completion_percentage'
    `);
    
    if (checkColumn.rows.length > 0) {
      console.log('✅ completion_percentage column already exists');
    } else {
      // Add the missing column
      await pool.query(`
        ALTER TABLE resumes 
        ADD COLUMN completion_percentage INTEGER DEFAULT 0
      `);
      console.log('✅ completion_percentage column added successfully');
    }
    
    // Show updated table structure
    const tableInfo = await pool.query(`
      SELECT column_name, data_type, column_default 
      FROM information_schema.columns 
      WHERE table_name = 'resumes' 
      ORDER BY ordinal_position
    `);
    
    console.log('\n📋 Updated resume table structure:');
    tableInfo.rows.forEach(row => {
      console.log(`  ${row.column_name}: ${row.data_type} (default: ${row.column_default || 'none'})`);
    });
    
  } catch (error) {
    console.error('❌ Error adding column:', error.message);
  } finally {
    pool.end();
  }
};

addColumn();
