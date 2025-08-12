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
      'paid',  // Fixed: was missing
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
