require('dotenv').config();
const pool = require('../config/database');

const fixDatabase = async () => {
  try {
    console.log('🔧 Fixing database schema...');
    
    // Get current columns
    const currentColumns = await pool.query(`
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_name='resumes'
    `);
    
    const existingColumns = currentColumns.rows.map(row => row.column_name);
    console.log('📋 Existing columns:', existingColumns);
    
    // Required columns with their types
    const requiredColumns = {
      'completion_percentage': 'INTEGER DEFAULT 0',
      'positions': 'JSONB DEFAULT \'[]\'',
      'awards': 'JSONB DEFAULT \'[]\'',
      'certifications': 'JSONB DEFAULT \'[]\'',
      'volunteering': 'JSONB DEFAULT \'[]\'',
      'conferences': 'JSONB DEFAULT \'[]\'',
      'publications': 'JSONB DEFAULT \'[]\'',
      'patents': 'JSONB DEFAULT \'[]\'',
      'test_scores': 'JSONB DEFAULT \'[]\'',
      'scholarships': 'JSONB DEFAULT \'[]\'',
      'guardians': 'JSONB DEFAULT \'[]\'',
      'languages': 'JSONB DEFAULT \'[]\'',
      'subjects': 'JSONB DEFAULT \'[]\''
    };
    
    // Add missing columns
    for (const [columnName, columnType] of Object.entries(requiredColumns)) {
      if (!existingColumns.includes(columnName)) {
        console.log(`➕ Adding column: ${columnName}`);
        await pool.query(`ALTER TABLE resumes ADD COLUMN ${columnName} ${columnType}`);
      } else {
        console.log(`✅ Column exists: ${columnName}`);
      }
    }
    
    console.log('🎉 Database schema updated successfully!');
    
    // Show final table structure
    const finalColumns = await pool.query(`
      SELECT column_name, data_type, column_default 
      FROM information_schema.columns 
      WHERE table_name = 'resumes' 
      ORDER BY ordinal_position
    `);
    
    console.log('\n📋 Final table structure:');
    finalColumns.rows.forEach(row => {
      console.log(`  ${row.column_name}: ${row.data_type}`);
    });
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    pool.end();
  }
};

fixDatabase();
