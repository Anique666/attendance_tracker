const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

router.get('/classes', authController.getClasses);
router.post('/student/register', authController.registerStudent);
router.post('/faculty/register', authController.registerFaculty);
router.post('/admin/register', authController.registerAdmin);
router.post('/login', authController.login);

module.exports = router;
