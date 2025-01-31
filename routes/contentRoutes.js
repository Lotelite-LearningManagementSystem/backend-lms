const express = require('express');
const router = express.Router();
const contentController = require('../controllers/contentController');
const { authenticateAdmin, authenticateUser } = require('../middleware/auth');
const upload = require('../middleware/upload');

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

module.exports = router; 