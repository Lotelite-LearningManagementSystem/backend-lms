const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { authenticateUser } = require('../middleware/auth');

// @route   POST api/users/login
router.post('/login', userController.login);

module.exports = router; 