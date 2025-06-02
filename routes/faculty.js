const express = require('express');
const router = express.Router();
const facultyController = require('../controllers/facultyController');

// Get list of students for a class
router.get('/class/:classId/students', facultyController.getStudentsForClass);

// Approve a medical condonation request
router.post('/condonation/approve', facultyController.approveCondonation);

// Mark class attendance
router.post('/attendance/mark', facultyController.markAttendance);

module.exports = router;
