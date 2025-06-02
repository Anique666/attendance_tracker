const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController'); 

// Route to upload a new event
router.post('/events', adminController.createEvent);

// Route to get students registered for a specific event
router.get('/events/:eventId/students', adminController.getRegisteredStudents);

// Route to validate attendance for a student at an event
router.post('/attendance/validate', adminController.validateEventAttendance);

module.exports = router;
