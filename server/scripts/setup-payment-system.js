require('dotenv').config();
const pool = require('../config/database');

const setupPaymentSystem = async () => {
  try {
    console.log('🚀 Setting up payment and review system...');
    
    // Add payment columns to resume_submissions table
    const paymentColumns = [
      'payment_status VARCHAR(50) DEFAULT \'pending\'',
      'payment_amount DECIMAL(10,2)',
      'payment_method VARCHAR(50)',
      'transaction_id VARCHAR(255)',
      'contact_email VARCHAR(255)',
      'contact_phone VARCHAR(50)',
      'special_requests TEXT',
      'expert_id INTEGER',
      'assigned_at TIMESTAMP',
      'delivery_url VARCHAR(500)',
      'customer_rating INTEGER',
      'customer_feedback TEXT'
    ];
    
    for (const column of paymentColumns) {
      const columnName = column.split(' ')[0];
      
      const checkColumn = await pool.query(`
        SELECT column_name 
        FROM information_schema.columns 
        WHERE table_name='resume_submissions' AND column_name=$1
      `, [columnName]);
      
      if (checkColumn.rows.length === 0) {
        await pool.query(`ALTER TABLE resume_submissions ADD COLUMN ${column}`);
        console.log(`✅ Added column: ${columnName}`);
      }
    }
    
    // Create experts table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS experts (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        specialization VARCHAR(255),
        experience_years INTEGER,
        rating DECIMAL(3,2) DEFAULT 0.0,
        total_reviews INTEGER DEFAULT 0,
        background TEXT,
        expertise JSONB DEFAULT '[]',
        is_active BOOLEAN DEFAULT true,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('✅ Experts table created');
    
    // Insert sample experts
    const experts = [
      {
        name: 'Dr. Rajesh Kumar',
        email: 'rajesh@launchpadindia.in',
        specialization: 'Engineering & Tech',
        experience_years: 8,
        rating: 4.9,
        total_reviews: 450,
        background: 'Ex-COEP Professor, Google India',
        expertise: '["Software Engineering", "Data Science", "Product Management"]'
      },
      {
        name: 'Priya Sharma',
        email: 'priya@launchpadindia.in',
        specialization: 'Business & Finance',
        experience_years: 6,
        rating: 4.8,
        total_reviews: 320,
        background: 'IIM Pune, Ex-McKinsey',
        expertise: '["Business Analysis", "Consulting", "Finance", "Marketing"]'
      },
      {
        name: 'Amit Patel',
        email: 'amit@launchpadindia.in',
        specialization: 'Design & Creative',
        experience_years: 5,
        rating: 4.9,
        total_reviews: 280,
        background: 'NID Graduate, Ex-Flipkart',
        expertise: '["UI/UX Design", "Product Design", "Creative Direction"]'
      }
    ];
    
    for (const expert of experts) {
      const existsCheck = await pool.query('SELECT id FROM experts WHERE email = $1', [expert.email]);
      if (existsCheck.rows.length === 0) {
        await pool.query(`
          INSERT INTO experts (name, email, specialization, experience_years, rating, total_reviews, background, expertise)
          VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
        `, [expert.name, expert.email, expert.specialization, expert.experience_years, expert.rating, expert.total_reviews, expert.background, expert.expertise]);
        console.log(`✅ Added expert: ${expert.name}`);
      }
    }
    
    // Create indexes for performance
    await pool.query(`
      CREATE INDEX IF NOT EXISTS idx_submissions_payment_status ON resume_submissions(payment_status);
      CREATE INDEX IF NOT EXISTS idx_submissions_expert_id ON resume_submissions(expert_id);
      CREATE INDEX IF NOT EXISTS idx_experts_specialization ON experts(specialization);
    `);
    console.log('✅ Indexes created');
    
    console.log('🎉 Payment system setup completed!');
    
  } catch (error) {
    console.error('❌ Error setting up payment system:', error.message);
  } finally {
    pool.end();
  }
};

setupPaymentSystem();
