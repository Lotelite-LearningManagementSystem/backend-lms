const express = require('express');
const router = express.Router();
const contentController = require('../controllers/contentController');
const { authenticateAdmin, authenticateUser } = require('../middleware/auth');
const { upload } = require('../middleware/upload');

// Admin routes
router.post('/subject', authenticateAdmin, contentController.createSubject);
router.post('/chapter', authenticateAdmin, contentController.createChapter);
router.post(
  '/upload',
  authenticateAdmin,
  upload.single('video'),
  contentController.uploadContent
);

// User routes
router.get('/structure', authenticateUser, contentController.getContentStructure);
router.get('/chapters', authenticateUser, contentController.getAllChapters);
router.get('/subjects', authenticateUser, contentController.getAllSubjects);

// Test route for blob storage
router.post('/test-upload', authenticateAdmin, upload.single('video'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }
    
    const blob = await put(req.file.originalname, req.file.buffer, {
      access: 'public',
      contentType: req.file.mimetype
    });
    
    res.json({ 
      message: 'Upload successful',
      url: blob.url,
      file: req.file
    });
  } catch (err) {
    res.status(500).json({ 
      message: 'Upload failed',
      error: err.message
    });
  }
});

module.exports = router; 