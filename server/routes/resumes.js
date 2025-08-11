const express = require('express');
const { body, validationResult } = require('express-validator');
const pool = require('../config/database');
const auth = require('../middleware/auth');

const router = express.Router();

// Debug middleware
const debugLog = (req, message, data = null) => {
  const timestamp = new Date().toISOString();
  console.log(`\n🔍 [${timestamp}] ${message}`);
  if (data) {
    console.log('📊 Data:', JSON.stringify(data, null, 2));
  }
};

// Get all resumes for user
router.get('/', auth, async (req, res) => {
  try {
    debugLog(req, `Fetching resumes for user ${req.user.userId}`);
    
    const result = await pool.query(`
      SELECT id, title, template_id, is_active, completion_percentage,
             created_at, updated_at 
      FROM resumes 
      WHERE user_id = $1 
      ORDER BY updated_at DESC
    `, [req.user.userId]);
    
    debugLog(req, `Found ${result.rows.length} resumes`);
    res.json(result.rows);
  } catch (error) {
    debugLog(req, '❌ Error fetching resumes', { error: error.message, stack: error.stack });
    res.status(500).json({ message: 'Server error', debug: error.message });
  }
});

// Get specific resume with all sections
router.get('/:id', auth, async (req, res) => {
  try {
    debugLog(req, `Fetching resume ${req.params.id} for user ${req.user.userId}`);
    
    const result = await pool.query(`
      SELECT * FROM resumes 
      WHERE id = $1 AND user_id = $2
    `, [req.params.id, req.user.userId]);
    
    if (result.rows.length === 0) {
      debugLog(req, '❌ Resume not found');
      return res.status(404).json({ message: 'Resume not found' });
    }
    
    debugLog(req, '✅ Resume found successfully');
    res.json(result.rows[0]);
  } catch (error) {
    debugLog(req, '❌ Error fetching resume', { error: error.message, stack: error.stack });
    res.status(500).json({ message: 'Server error', debug: error.message });
  }
});

// Create new resume
router.post('/', auth, [
  body('title').optional().trim().isLength({ min: 1, max: 255 })
], async (req, res) => {
  try {
    debugLog(req, `Creating new resume for user ${req.user.userId}`, { body: req.body });
    
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      debugLog(req, '❌ Validation errors', { errors: errors.array() });
      return res.status(400).json({ errors: errors.array() });
    }

    const { title = 'My Resume' } = req.body;

    const result = await pool.query(`
      INSERT INTO resumes (user_id, title) 
      VALUES ($1, $2) 
      RETURNING *
    `, [req.user.userId, title]);

    debugLog(req, '✅ Resume created successfully', { resumeId: result.rows[0].id });
    res.status(201).json(result.rows[0]);
  } catch (error) {
    debugLog(req, '❌ Error creating resume', { error: error.message, stack: error.stack });
    res.status(500).json({ message: 'Server error', debug: error.message });
  }
});

// Update resume with all sections - MAIN SAVE FUNCTION
router.put('/:id', auth, async (req, res) => {
  try {
    const resumeId = req.params.id;
    const userId = req.user.userId;
    
    debugLog(req, `🚀 STARTING RESUME SAVE - Resume ID: ${resumeId}, User ID: ${userId}`);
    debugLog(req, 'Request body keys:', Object.keys(req.body));
    
    // Check if resume exists first
    const existsCheck = await pool.query(`
      SELECT id, title FROM resumes 
      WHERE id = $1 AND user_id = $2
    `, [resumeId, userId]);
    
    if (existsCheck.rows.length === 0) {
      debugLog(req, '❌ Resume not found or access denied');
      return res.status(404).json({ message: 'Resume not found' });
    }
    
    debugLog(req, '✅ Resume exists, proceeding with update');

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

    debugLog(req, 'Extracted data sections:', {
      hasPersonalInfo: !!personalInfo,
      hasEducation: !!education,
      hasExperience: !!experience,
      hasProjects: !!projects,
      hasSkills: !!skills,
      hasPositions: !!positions,
      hasAwards: !!awards,
      hasCertifications: !!certifications,
      hasVolunteering: !!volunteering,
      hasConferences: !!conferences,
      hasPublications: !!publications,
      hasPatents: !!patents,
      hasTestScores: !!testScores,
      hasScholarships: !!scholarships,
      hasGuardians: !!guardians,
      hasLanguages: !!languages,
      hasSubjects: !!subjects
    });

    // Calculate completion percentage
    const sections = [
      personalInfo, education, experience, projects, skills,
      positions, awards, certifications, volunteering, conferences,
      publications, patents, testScores, scholarships, guardians,
      languages, subjects
    ];
    
    const completedSections = sections.filter(section => {
      if (Array.isArray(section)) return section.length > 0;
      if (typeof section === 'object' && section !== null) return Object.keys(section).length > 0;
      return false;
    }).length;
    
    const completionPercentage = Math.round((completedSections / sections.length) * 100);
    
    debugLog(req, `Completion calculation: ${completedSections}/${sections.length} = ${completionPercentage}%`);

    // Prepare JSON data
    const jsonData = {
      personalInfo: personalInfo ? JSON.stringify(personalInfo) : null,
      education: education ? JSON.stringify(education) : null,
      experience: experience ? JSON.stringify(experience) : null,
      projects: projects ? JSON.stringify(projects) : null,
      skills: skills ? JSON.stringify(skills) : null,
      positions: positions ? JSON.stringify(positions) : null,
      awards: awards ? JSON.stringify(awards) : null,
      certifications: certifications ? JSON.stringify(certifications) : null,
      volunteering: volunteering ? JSON.stringify(volunteering) : null,
      conferences: conferences ? JSON.stringify(conferences) : null,
      publications: publications ? JSON.stringify(publications) : null,
      patents: patents ? JSON.stringify(patents) : null,
      testScores: testScores ? JSON.stringify(testScores) : null,
      scholarships: scholarships ? JSON.stringify(scholarships) : null,
      guardians: guardians ? JSON.stringify(guardians) : null,
      languages: languages ? JSON.stringify(languages) : null,
      subjects: subjects ? JSON.stringify(subjects) : null
    };

    debugLog(req, 'JSON serialization completed successfully');

    // Execute the update query
    debugLog(req, '🔄 Executing database update...');
    
    const result = await pool.query(`
      UPDATE resumes 
      SET 
        title = COALESCE($3, title),
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
        completion_percentage = $22,
        updated_at = CURRENT_TIMESTAMP
      WHERE id = $1 AND user_id = $2
      RETURNING id, title, completion_percentage, updated_at
    `, [
      resumeId, userId, title,
      jsonData.personalInfo,
      jsonData.education,
      jsonData.experience,
      jsonData.projects,
      jsonData.skills,
      jsonData.positions,
      jsonData.awards,
      jsonData.certifications,
      jsonData.volunteering,
      jsonData.conferences,
      jsonData.publications,
      jsonData.patents,
      jsonData.testScores,
      jsonData.scholarships,
      jsonData.guardians,
      jsonData.languages,
      jsonData.subjects,
      templateId,
      completionPercentage
    ]);

    if (result.rows.length === 0) {
      debugLog(req, '❌ Update query returned no rows');
      return res.status(404).json({ message: 'Resume not found after update' });
    }

    debugLog(req, '🎉 RESUME SAVE SUCCESSFUL!', {
      resumeId: result.rows[0].id,
      title: result.rows[0].title,
      completionPercentage: result.rows[0].completion_percentage,
      updatedAt: result.rows[0].updated_at
    });

    res.json({
      success: true,
      message: 'Resume saved successfully',
      data: result.rows[0]
    });

  } catch (error) {
    debugLog(req, '💥 CRITICAL ERROR IN RESUME SAVE', {
      error: error.message,
      stack: error.stack,
      code: error.code,
      detail: error.detail,
      hint: error.hint
    });
    
    res.status(500).json({ 
      message: 'Failed to save resume',
      debug: {
        error: error.message,
        code: error.code,
        detail: error.detail
      }
    });
  }
});

// Delete resume
router.delete('/:id', auth, async (req, res) => {
  try {
    debugLog(req, `Deleting resume ${req.params.id} for user ${req.user.userId}`);
    
    const result = await pool.query(`
      DELETE FROM resumes 
      WHERE id = $1 AND user_id = $2 
      RETURNING id
    `, [req.params.id, req.user.userId]);
    
    if (result.rows.length === 0) {
      debugLog(req, '❌ Resume not found for deletion');
      return res.status(404).json({ message: 'Resume not found' });
    }
    
    debugLog(req, '✅ Resume deleted successfully');
    res.json({ message: 'Resume deleted successfully' });
  } catch (error) {
    debugLog(req, '❌ Error deleting resume', { error: error.message });
    res.status(500).json({ message: 'Server error', debug: error.message });
  }
});

// Submit resume for review
router.post('/:id/submit', auth, async (req, res) => {
  try {
    debugLog(req, `Submitting resume ${req.params.id} for review`);
    
    const resumeCheck = await pool.query(`
      SELECT id, title FROM resumes 
      WHERE id = $1 AND user_id = $2
    `, [req.params.id, req.user.userId]);
    
    if (resumeCheck.rows.length === 0) {
      debugLog(req, '❌ Resume not found for submission');
      return res.status(404).json({ message: 'Resume not found' });
    }

    const result = await pool.query(`
      INSERT INTO resume_submissions (resume_id, status) 
      VALUES ($1, 'pending') 
      RETURNING *
    `, [req.params.id]);

    debugLog(req, '✅ Resume submitted successfully');
    res.status(201).json({
      message: 'Resume submitted for review successfully',
      submission: result.rows[0]
    });
  } catch (error) {
    debugLog(req, '❌ Error submitting resume', { error: error.message });
    res.status(500).json({ message: 'Server error', debug: error.message });
  }
});

// Health check endpoint
router.get('/health', async (req, res) => {
  try {
    const dbResult = await pool.query('SELECT NOW()');
    res.json({
      status: 'healthy',
      database: 'connected',
      timestamp: dbResult.rows[0].now
    });
  } catch (error) {
    res.status(500).json({
      status: 'unhealthy',
      database: 'disconnected',
      error: error.message
    });
  }
});

module.exports = router;
