const express = require('express');
const { body, validationResult } = require('express-validator');
const pool = require('../config/database');
const auth = require('../middleware/auth');

const router = express.Router();

// Get all resumes for user
router.get('/', auth, async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT id, title, template_id, is_active, created_at, updated_at FROM resumes WHERE user_id = $1 ORDER BY updated_at DESC',
      [req.user.userId]
    );
    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get specific resume
router.get('/:id', auth, async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM resumes WHERE id = $1 AND user_id = $2', [req.params.id, req.user.userId]);
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Resume not found' });
    }
    res.json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create new resume
router.post('/', auth, [
  body('title').optional().trim().isLength({ min: 1, max: 255 }),
  body('personalInfo').optional().isObject()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { title = 'My Resume', personalInfo = {} } = req.body;

    const result = await pool.query(
      'INSERT INTO resumes (user_id, title, personal_info) VALUES ($1, $2, $3) RETURNING *',
      [req.user.userId, title, JSON.stringify(personalInfo)]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update resume
router.put('/:id', auth, async (req, res) => {
  try {
    const { title, personalInfo, education, experience, skills, projects, certifications, languages, templateId } = req.body;

    const result = await pool.query(`
      UPDATE resumes 
      SET title = COALESCE($3, title),
          personal_info = COALESCE($4, personal_info),
          education = COALESCE($5, education),
          experience = COALESCE($6, experience),
          skills = COALESCE($7, skills),
          projects = COALESCE($8, projects),
          certifications = COALESCE($9, certifications),
          languages = COALESCE($10, languages),
          template_id = COALESCE($11, template_id),
          updated_at = CURRENT_TIMESTAMP
      WHERE id = $1 AND user_id = $2
      RETURNING *
    `, [
      req.params.id, req.user.userId, title,
      personalInfo ? JSON.stringify(personalInfo) : null,
      education ? JSON.stringify(education) : null,
      experience ? JSON.stringify(experience) : null,
      skills ? JSON.stringify(skills) : null,
      projects ? JSON.stringify(projects) : null,
      certifications ? JSON.stringify(certifications) : null,
      languages ? JSON.stringify(languages) : null,
      templateId
    ]);

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Resume not found' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete resume
router.delete('/:id', auth, async (req, res) => {
  try {
    const result = await pool.query('DELETE FROM resumes WHERE id = $1 AND user_id = $2 RETURNING id', [req.params.id, req.user.userId]);
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Resume not found' });
    }
    res.json({ message: 'Resume deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Submit resume for review
router.post('/:id/submit', auth, async (req, res) => {
  try {
    const result = await pool.query('SELECT id FROM resumes WHERE id = $1 AND user_id = $2', [req.params.id, req.user.userId]);
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Resume not found' });
    }

    const submission = await pool.query(
      'INSERT INTO resume_submissions (resume_id, status) VALUES ($1, $2) RETURNING *',
      [req.params.id, 'pending']
    );

    res.json({ message: 'Resume submitted for review', submission: submission.rows[0] });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
