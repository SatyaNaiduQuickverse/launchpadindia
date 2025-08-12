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

// Get specific resume
router.get('/:id', auth, async (req, res) => {
 try {
   const result = await pool.query(`
     SELECT * FROM resumes 
     WHERE id = $1 AND user_id = $2
   `, [req.params.id, req.user.userId]);
   
   if (result.rows.length === 0) {
     return res.status(404).json({ message: 'Resume not found' });
   }
   
   res.json(result.rows[0]);
 } catch (error) {
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

   const result = await pool.query(`
     INSERT INTO resumes (user_id, title) 
     VALUES ($1, $2) 
     RETURNING *
   `, [req.user.userId, title]);

   res.status(201).json(result.rows[0]);
 } catch (error) {
   res.status(500).json({ message: 'Server error' });
 }
});

// Update resume
router.put('/:id', auth, async (req, res) => {
 try {
   const resumeId = req.params.id;
   const userId = req.user.userId;
   
   const existsCheck = await pool.query(`
     SELECT id, title FROM resumes 
     WHERE id = $1 AND user_id = $2
   `, [resumeId, userId]);
   
   if (existsCheck.rows.length === 0) {
     return res.status(404).json({ message: 'Resume not found' });
   }

   const { 
     title, personalInfo, education, experience, projects, skills,
     positions, awards, certifications, volunteering, conferences,
     publications, patents, testScores, scholarships, guardians,
     languages, subjects, templateId 
   } = req.body;

   const profilePhoto = personalInfo?.profilePhoto || null;

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

   const result = await pool.query(`
     UPDATE resumes 
     SET 
       title = COALESCE($3, title),
       personal_info = COALESCE($4, personal_info),
       profile_photo = COALESCE($5, profile_photo),
       education = COALESCE($6, education),
       experience = COALESCE($7, experience),
       projects = COALESCE($8, projects),
       skills = COALESCE($9, skills),
       positions = COALESCE($10, positions),
       awards = COALESCE($11, awards),
       certifications = COALESCE($12, certifications),
       volunteering = COALESCE($13, volunteering),
       conferences = COALESCE($14, conferences),
       publications = COALESCE($15, publications),
       patents = COALESCE($16, patents),
       test_scores = COALESCE($17, test_scores),
       scholarships = COALESCE($18, scholarships),
       guardians = COALESCE($19, guardians),
       languages = COALESCE($20, languages),
       subjects = COALESCE($21, subjects),
       template_id = COALESCE($22, template_id),
       completion_percentage = $23,
       updated_at = CURRENT_TIMESTAMP
     WHERE id = $1 AND user_id = $2
     RETURNING id, title, completion_percentage, updated_at
   `, [
     resumeId, userId, title,
     personalInfo ? JSON.stringify(personalInfo) : null,
     profilePhoto,
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
     templateId,
     completionPercentage
   ]);

   res.json({
     success: true,
     message: 'Resume saved successfully',
     data: result.rows[0]
   });

 } catch (error) {
   console.error('Error updating resume:', error);
   res.status(500).json({ message: 'Failed to save resume' });
 }
});

// Delete resume
router.delete('/:id', auth, async (req, res) => {
 try {
   const result = await pool.query(`
     DELETE FROM resumes 
     WHERE id = $1 AND user_id = $2 
     RETURNING id
   `, [req.params.id, req.user.userId]);
   
   if (result.rows.length === 0) {
     return res.status(404).json({ message: 'Resume not found' });
   }
   
   res.json({ message: 'Resume deleted successfully' });
 } catch (error) {
   res.status(500).json({ message: 'Server error' });
 }
});

// Submit resume for review with payment
router.post('/:id/submit', auth, async (req, res) => {
  try {
    const { paymentDetails, contactInfo, specialRequests } = req.body;
    
    const resumeCheck = await pool.query(`
      SELECT id, title FROM resumes 
      WHERE id = $1 AND user_id = $2
    `, [req.params.id, req.user.userId]);
    
    if (resumeCheck.rows.length === 0) {
      return res.status(404).json({ message: 'Resume not found' });
    }

    const result = await pool.query(`
      INSERT INTO resume_submissions (
        resume_id, status, payment_status, payment_amount,
        payment_method, transaction_id, contact_email,
        contact_phone, special_requests
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
      RETURNING *
    `, [
      req.params.id,
      'pending',
      'paid',
      paymentDetails.amount,
      paymentDetails.method,
      paymentDetails.transactionId,
      contactInfo.email,
      contactInfo.phone,
      specialRequests
    ]);

    res.status(201).json({
      message: 'Resume submitted for review successfully',
      submission: result.rows[0]
    });
  } catch (error) {
    console.error('Error submitting resume:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
