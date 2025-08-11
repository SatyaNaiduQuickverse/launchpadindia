const jwt = require('jsonwebtoken');
const pool = require('../config/database');

const adminAuth = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ message: 'Admin access denied' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback_secret');
    
    // Check if user is admin
    const result = await pool.query('SELECT id, email, is_admin FROM users WHERE id = $1', [decoded.userId]);
    
    if (result.rows.length === 0 || !result.rows[0].is_admin) {
      return res.status(403).json({ message: 'Admin privileges required' });
    }

    req.admin = result.rows[0];
    next();
  } catch (error) {
    res.status(401).json({ message: 'Invalid admin token' });
  }
};

module.exports = adminAuth;
