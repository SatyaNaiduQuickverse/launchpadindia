const express = require('express');
const pool = require('../config/database');
const adminAuth = require('../middleware/adminAuth');

const router = express.Router();

// Get all resumes with user info and submission status
router.get('/resumes', adminAuth, async (req, res) => {
  try {
    const { status = 'all', page = 1, limit = 20 } = req.query;
    const offset = (page - 1) * limit;
    
    let whereClause = '';
    let params = [limit, offset];
    
    if (status !== 'all') {
      whereClause = 'WHERE rs.status = $3';
      params.push(status);
    }
    
    const result = await pool.query(`
      SELECT 
        r.id,
        r.title,
        r.completion_percentage,
        r.created_at,
        r.updated_at,
        u.first_name,
        u.last_name,
        u.email,
        u.phone,
        rs.id as submission_id,
        rs.status,
        rs.submitted_at,
        rs.reviewed_at,
        rs.reviewer_notes
      FROM resumes r
      JOIN users u ON r.user_id = u.id
      LEFT JOIN resume_submissions rs ON r.id = rs.resume_id
      ${whereClause}
      ORDER BY rs.submitted_at DESC NULLS LAST, r.updated_at DESC
      LIMIT $1 OFFSET $2
    `, params);
    
    // Get total count
    const countResult = await pool.query(`
      SELECT COUNT(*) 
      FROM resumes r
      LEFT JOIN resume_submissions rs ON r.id = rs.resume_id
      ${whereClause}
    `, status !== 'all' ? [status] : []);
    
    res.json({
      resumes: result.rows,
      total: parseInt(countResult.rows[0].count),
      page: parseInt(page),
      totalPages: Math.ceil(countResult.rows[0].count / limit)
    });
  } catch (error) {
    console.error('Error fetching admin resumes:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get detailed resume data
router.get('/resumes/:id', adminAuth, async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT 
        r.*,
        u.first_name,
        u.last_name,
        u.email,
        u.phone,
        u.created_at as user_created_at,
        rs.status as submission_status,
        rs.submitted_at,
        rs.reviewed_at,
        rs.reviewer_notes,
        rs.review_score
      FROM resumes r
      JOIN users u ON r.user_id = u.id
      LEFT JOIN resume_submissions rs ON r.id = rs.resume_id
      WHERE r.id = $1
    `, [req.params.id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Resume not found' });
    }
    
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error fetching resume details:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update resume review status
router.put('/resumes/:id/review', adminAuth, async (req, res) => {
  try {
    const { status, notes, score } = req.body;
    
    const result = await pool.query(`
      UPDATE resume_submissions 
      SET 
        status = $2,
        reviewer_notes = $3,
        review_score = $4,
        reviewed_at = CURRENT_TIMESTAMP
      WHERE resume_id = $1
      RETURNING *
    `, [req.params.id, status, notes, score]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Submission not found' });
    }
    
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error updating review:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Dashboard statistics
router.get('/stats', adminAuth, async (req, res) => {
  try {
    const stats = await pool.query(`
      SELECT 
        COUNT(*) as total_resumes,
        COUNT(CASE WHEN rs.status = 'pending' THEN 1 END) as pending_reviews,
        COUNT(CASE WHEN rs.status = 'approved' THEN 1 END) as approved,
        COUNT(CASE WHEN rs.status = 'rejected' THEN 1 END) as rejected,
        AVG(r.completion_percentage) as avg_completion
      FROM resumes r
      LEFT JOIN resume_submissions rs ON r.id = rs.resume_id
    `);
    
    res.json(stats.rows[0]);
  } catch (error) {
    console.error('Error fetching stats:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;

// Get paid submissions
router.get('/paid-submissions', adminAuth, async (req, res) => {
  try {
    const { status = 'all', page = 1, limit = 20 } = req.query;
    const offset = (page - 1) * limit;
    
    let whereClause = 'WHERE rs.payment_status = \'paid\'';
    let params = [limit, offset];
    
    if (status !== 'all') {
      whereClause += ' AND rs.status = $3';
      params.push(status);
    }
    
    const result = await pool.query(`
      SELECT 
        r.id, r.title, r.completion_percentage, r.created_at, r.updated_at,
        u.first_name, u.last_name, u.email, u.phone,
        rs.id as submission_id, rs.status, rs.payment_status, rs.payment_amount,
        rs.payment_method, rs.transaction_id, rs.submitted_at, rs.reviewed_at,
        rs.reviewer_notes, rs.contact_email, rs.contact_phone, rs.special_requests
      FROM resumes r
      JOIN users u ON r.user_id = u.id
      JOIN resume_submissions rs ON r.id = rs.resume_id
      ${whereClause}
      ORDER BY rs.submitted_at DESC
      LIMIT $1 OFFSET $2
    `, params);
    
    res.json({ submissions: result.rows });
  } catch (error) {
    console.error('Error fetching paid submissions:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get submission stats
router.get('/submission-stats', adminAuth, async (req, res) => {
  try {
    const stats = await pool.query(`
      SELECT 
        COUNT(*) FILTER (WHERE payment_status = 'paid') as total_paid,
        COUNT(*) FILTER (WHERE payment_status = 'paid' AND status = 'pending') as pending_review,
        COUNT(*) FILTER (WHERE payment_status = 'paid' AND status = 'reviewing') as in_review,
        COUNT(*) FILTER (WHERE payment_status = 'paid' AND status = 'completed') as completed,
        SUM(payment_amount) FILTER (WHERE payment_status = 'paid') as total_revenue
      FROM resume_submissions
    `);
    
    res.json(stats.rows[0]);
  } catch (error) {
    console.error('Error fetching submission stats:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update submission status
router.put('/submissions/:id/status', adminAuth, async (req, res) => {
  try {
    const { status, notes } = req.body;
    
    const result = await pool.query(`
      UPDATE resume_submissions 
      SET 
        status = $2,
        reviewer_notes = CASE 
          WHEN $3 IS NOT NULL THEN COALESCE(reviewer_notes, '') || '\n' || $3
          ELSE reviewer_notes
        END,
        reviewed_at = CASE 
          WHEN $2 IN ('completed', 'revision') THEN CURRENT_TIMESTAMP
          ELSE reviewed_at
        END
      WHERE id = $1
      RETURNING *
    `, [req.params.id, status, notes]);
    
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error updating submission status:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update the existing stats route to include paid submissions
router.get('/stats', adminAuth, async (req, res) => {
  try {
    const stats = await pool.query(`
      SELECT 
        COUNT(*) as total_resumes,
        COUNT(CASE WHEN rs.status = 'pending' THEN 1 END) as pending_reviews,
        COUNT(CASE WHEN rs.status = 'approved' THEN 1 END) as approved,
        COUNT(CASE WHEN rs.status = 'rejected' THEN 1 END) as rejected,
        AVG(r.completion_percentage) as avg_completion,
        COUNT(CASE WHEN sub.payment_status = 'paid' THEN 1 END) as paid_submissions,
        SUM(sub.payment_amount) FILTER (WHERE sub.payment_status = 'paid') as revenue
      FROM resumes r
      LEFT JOIN resume_submissions rs ON r.id = rs.resume_id
      LEFT JOIN resume_submissions sub ON r.id = sub.resume_id AND sub.payment_status = 'paid'
    `);
    
    res.json(stats.rows[0]);
  } catch (error) {
    console.error('Error fetching stats:', error);
    res.status(500).json({ message: 'Server error' });
  }
});
