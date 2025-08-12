require('dotenv').config();
const pool = require('../config/database');

const addPhotoColumn = async () => {
 try {
   console.log('🔧 Adding profile_photo column...');
   
   const checkColumn = await pool.query(`
     SELECT column_name 
     FROM information_schema.columns 
     WHERE table_name='resumes' AND column_name='profile_photo'
   `);
   
   if (checkColumn.rows.length > 0) {
     console.log('✅ profile_photo column already exists');
   } else {
     await pool.query(`
       ALTER TABLE resumes 
       ADD COLUMN profile_photo TEXT
     `);
     console.log('✅ profile_photo column added successfully');
   }
 } catch (error) {
   console.error('❌ Error adding photo column:', error.message);
 } finally {
   pool.end();
 }
};

addPhotoColumn();
