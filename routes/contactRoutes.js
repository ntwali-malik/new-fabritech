const express = require('express');
const Contact = require('../models/Contact');
const emailService = require('../services/emailService');
const router = express.Router();

// Create new contact form submission
router.post('/', async (req, res) => {
  try {
    const { fullName, email, phone, subject, serviceInterest, message, privacyAgreed } = req.body;

    // Validate required fields
    if (!fullName || !email || !subject || !serviceInterest || !message) {
      return res.status(400).json({ 
        error: 'Full name, email, subject, service interest, and message are required' 
      });
    }

    if (privacyAgreed !== true) {
      return res.status(400).json({ 
        error: 'You must agree to the privacy policy' 
      });
    }

    // Create contact submission
    const contact = await Contact.create({
      fullName,
      email,
      phone,
      subject,
      serviceInterest,
      message,
      privacyAgreed
    });

    // Send notification email to admin (don't block response if email fails)
    try {
      await emailService.sendContactNotificationEmail(contact);
    } catch (emailError) {
      console.error('Failed to send contact notification email:', emailError);
      // Continue even if email fails - contact is still saved successfully
    }

    res.status(201).json({ 
      message: 'Contact form submitted successfully. We will get back to you soon!', 
      contact 
    });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Get all contact submissions (for admin)
router.get('/', async (req, res) => {
  try {
    const { status } = req.query;
    const query = status ? { status } : {};
    
    const contacts = await Contact.find(query)
      .sort({ createdAt: -1 });
    
    res.json(contacts);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get single contact submission by id
router.get('/:id', async (req, res) => {
  try {
    const contact = await Contact.findOne({ id: req.params.id });
    
    if (!contact) {
      return res.status(404).json({ error: 'Contact submission not found' });
    }
    
    res.json(contact);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update contact status
router.put('/:id/status', async (req, res) => {
  try {
    const { status } = req.body;

    if (!status) {
      return res.status(400).json({ error: 'Status is required' });
    }

    const validStatuses = ['new', 'read', 'replied', 'archived'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ error: 'Invalid status. Must be one of: new, read, replied, archived' });
    }

    const contact = await Contact.findOneAndUpdate(
      { id: req.params.id },
      { status },
      { new: true, runValidators: true }
    );

    if (!contact) {
      return res.status(404).json({ error: 'Contact submission not found' });
    }

    res.json({ message: 'Contact status updated successfully', contact });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Update contact submission (for admin to add notes or update)
router.put('/:id', async (req, res) => {
  try {
    const contact = await Contact.findOneAndUpdate(
      { id: req.params.id },
      req.body,
      { new: true, runValidators: true }
    );

    if (!contact) {
      return res.status(404).json({ error: 'Contact submission not found' });
    }

    res.json({ message: 'Contact submission updated successfully', contact });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Delete contact submission
router.delete('/:id', async (req, res) => {
  try {
    const contact = await Contact.findOneAndDelete({ id: req.params.id });
    
    if (!contact) {
      return res.status(404).json({ error: 'Contact submission not found' });
    }
    
    res.json({ message: 'Contact submission deleted successfully', contact });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;

