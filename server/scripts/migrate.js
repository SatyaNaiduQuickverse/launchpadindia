require('dotenv').config();
const pool = require('../config/database');

const createTables = async () => {
  try {
    console.log('🚀 Starting database migration...');

    // Users table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        email VARCHAR(255) UNIQUE NOT NULL,
        password_hash VARCHAR(255) NOT NULL,
        first_name VARCHAR(100) NOT NULL,
        last_name VARCHAR(100) NOT NULL,
        phone VARCHAR(20),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('✅ Users table created');

    // Enhanced resumes table with all sections
    await pool.query(`
      CREATE TABLE IF NOT EXISTS resumes (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        title VARCHAR(255) NOT NULL DEFAULT 'My Resume',
        
        -- Basic/Personal Information
        personal_info JSONB DEFAULT '{}',
        
        -- Education Section
        education JSONB DEFAULT '[]',
        
        -- Experience Section  
        experience JSONB DEFAULT '[]',
        
        -- Projects Section
        projects JSONB DEFAULT '[]',
        
        -- Skills Section
        skills JSONB DEFAULT '[]',
        
        -- Positions of Responsibility
        positions JSONB DEFAULT '[]',
        
        -- Awards & Recognitions
        awards JSONB DEFAULT '[]',
        
        -- Certifications
        certifications JSONB DEFAULT '[]',
        
        -- Volunteering & Social Work
        volunteering JSONB DEFAULT '[]',
        
        -- Conferences & Workshops
        conferences JSONB DEFAULT '[]',
        
        -- Publications
        publications JSONB DEFAULT '[]',
        
        -- Patents
        patents JSONB DEFAULT '[]',
        
        -- Test Scores
        test_scores JSONB DEFAULT '[]',
        
        -- Scholarships
        scholarships JSONB DEFAULT '[]',
        
        -- Guardians
        guardians JSONB DEFAULT '[]',
        
        -- Languages
        languages JSONB DEFAULT '[]',
        
        -- Subjects
        subjects JSONB DEFAULT '[]',
        
        -- Template and status
        template_id VARCHAR(50) DEFAULT 'modern',
        is_active BOOLEAN DEFAULT true,
        completion_percentage INTEGER DEFAULT 0,
        
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('✅ Resumes table created with all sections');

    // Resume submissions table for review process
    await pool.query(`
      CREATE TABLE IF NOT EXISTS resume_submissions (
        id SERIAL PRIMARY KEY,
        resume_id INTEGER REFERENCES resumes(id) ON DELETE CASCADE,
        status VARCHAR(50) DEFAULT 'pending',
        submitted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        reviewed_at TIMESTAMP,
        reviewer_notes TEXT,
        final_resume_url VARCHAR(500),
        review_score INTEGER
      )
    `);
    console.log('✅ Resume submissions table created');

    // Create indexes for better performance
    await pool.query(`
      CREATE INDEX IF NOT EXISTS idx_resumes_user_id ON resumes(user_id);
      CREATE INDEX IF NOT EXISTS idx_resumes_created_at ON resumes(created_at);
      CREATE INDEX IF NOT EXISTS idx_submissions_resume_id ON resume_submissions(resume_id);
      CREATE INDEX IF NOT EXISTS idx_submissions_status ON resume_submissions(status);
    `);
    console.log('✅ Database indexes created');

    console.log('🎉 Database migration completed successfully!');
    
    // Show table structure
    const tableInfo = await pool.query(`
      SELECT column_name, data_type, is_nullable 
      FROM information_schema.columns 
      WHERE table_name = 'resumes' 
      ORDER BY ordinal_position;
    `);
    
    console.log('\n📋 Resume table structure:');
    tableInfo.rows.forEach(row => {
      console.log(`  ${row.column_name}: ${row.data_type} ${row.is_nullable === 'YES' ? '(nullable)' : '(required)'}`);
    });

  } catch (error) {
    console.error('❌ Error creating tables:', error);
    process.exit(1);
  } finally {
    pool.end();
  }
};

createTables();
