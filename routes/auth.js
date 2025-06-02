const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

router.post('/faculty/register', authController.registerFaculty);
router.post('/student/register', authController.registerStudent);

module.exports = router;
