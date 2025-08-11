const { Pool } = require('pg');

const pool = new Pool({
  user: 'ubuntu',
  host: process.env.DB_HOST || 'localhost',
  database: process.env.DB_NAME || 'resume_builder',
  password: 'password',
  port: process.env.DB_PORT || 5432,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
});

pool.on('connect', () => {
  console.log('Connected to PostgreSQL database');
});

pool.on('error', (err) => {
  console.error('Database connection error:', err);
});

module.exports = pool;
