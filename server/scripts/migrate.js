require('dotenv').config();
const pool = require('../config/database');

const createTables = async () => {
  try {
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

    // Enhanced resumes table with all sections
    await pool.query(`
      CREATE TABLE IF NOT EXISTS resumes (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        title VARCHAR(255) NOT NULL DEFAULT 'My Resume',
        personal_info JSONB DEFAULT '{}',
        education JSONB DEFAULT '[]',
        experience JSONB DEFAULT '[]',
        projects JSONB DEFAULT '[]',
        skills JSONB DEFAULT '[]',
        positions JSONB DEFAULT '[]',
        awards JSONB DEFAULT '[]',
        certifications JSONB DEFAULT '[]',
        volunteering JSONB DEFAULT '[]',
        conferences JSONB DEFAULT '[]',
        publications JSONB DEFAULT '[]',
        patents JSONB DEFAULT '[]',
        test_scores JSONB DEFAULT '[]',
        scholarships JSONB DEFAULT '[]',
        guardians JSONB DEFAULT '[]',
        languages JSONB DEFAULT '[]',
        subjects JSONB DEFAULT '[]',
        template_id VARCHAR(50) DEFAULT 'modern',
        is_active BOOLEAN DEFAULT true,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Resume submissions table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS resume_submissions (
        id SERIAL PRIMARY KEY,
        resume_id INTEGER REFERENCES resumes(id) ON DELETE CASCADE,
        status VARCHAR(50) DEFAULT 'pending',
        submitted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        reviewed_at TIMESTAMP,
        reviewer_notes TEXT,
        final_resume_url VARCHAR(500)
      )
    `);

    console.log('Database tables created successfully');
  } catch (error) {
    console.error('Error creating tables:', error);
  } finally {
    pool.end();
  }
};

createTables();
