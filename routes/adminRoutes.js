const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const { authenticateAdmin } = require('../middleware/auth');

// @route   POST api/admin/register
router.post('/register', adminController.register);

// @route   POST api/admin/login
router.post('/login', adminController.login);

// @route   POST api/admin/create-user
router.post('/create-user', authenticateAdmin, adminController.createUser);

module.exports = router; 