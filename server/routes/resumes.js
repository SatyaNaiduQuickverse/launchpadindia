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
  body('title').optional().trim().isLength({ min: 1, max: 255 })
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { title = 'My Resume' } = req.body;

    const result = await pool.query(
      'INSERT INTO resumes (user_id, title) VALUES ($1, $2) RETURNING *',
      [req.user.userId, title]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update resume with all sections
router.put('/:id', auth, async (req, res) => {
  try {
    const { 
      title, 
      personalInfo, 
      education, 
      experience, 
      projects,
      skills, 
      positions,
      awards,
      certifications,
      volunteering,
      conferences,
      publications,
      patents,
      testScores,
      scholarships,
      guardians,
      languages,
      subjects,
      templateId 
    } = req.body;

    const result = await pool.query(`
      UPDATE resumes 
      SET title = COALESCE($3, title),
          personal_info = COALESCE($4, personal_info),
          education = COALESCE($5, education),
          experience = COALESCE($6, experience),
          projects = COALESCE($7, projects),
          skills = COALESCE($8, skills),
          positions = COALESCE($9, positions),
          awards = COALESCE($10, awards),
          certifications = COALESCE($11, certifications),
          volunteering = COALESCE($12, volunteering),
          conferences = COALESCE($13, conferences),
          publications = COALESCE($14, publications),
          patents = COALESCE($15, patents),
          test_scores = COALESCE($16, test_scores),
          scholarships = COALESCE($17, scholarships),
          guardians = COALESCE($18, guardians),
          languages = COALESCE($19, languages),
          subjects = COALESCE($20, subjects),
          template_id = COALESCE($21, template_id),
          updated_at = CURRENT_TIMESTAMP
      WHERE id = $1 AND user_id = $2
      RETURNING *
    `, [
      req.params.id, req.user.userId, title,
      personalInfo ? JSON.stringify(personalInfo) : null,
      education ? JSON.stringify(education) : null,
      experience ? JSON.stringify(experience) : null,
      projects ? JSON.stringify(projects) : null,
      skills ? JSON.stringify(skills) : null,
      positions ? JSON.stringify(positions) : null,
      awards ? JSON.stringify(awards) : null,
      certifications ? JSON.stringify(certifications) : null,
      volunteering ? JSON.stringify(volunteering) : null,
      conferences ? JSON.stringify(conferences) : null,
      publications ? JSON.stringify(publications) : null,
      patents ? JSON.stringify(patents) : null,
      testScores ? JSON.stringify(testScores) : null,
      scholarships ? JSON.stringify(scholarships) : null,
      guardians ? JSON.stringify(guardians) : null,
      languages ? JSON.stringify(languages) : null,
      subjects ? JSON.stringify(subjects) : null,
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

module.exports = router;
