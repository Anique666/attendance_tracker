const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');

// Post a new event
router.post('/event', adminController.createEvent);

// Get registered students for an event
router.get('/event/:eventId/registrations', adminController.getRegisteredStudents);

// Validate attendance for an event
router.post('/event/validate-attendance', adminController.validateAttendance);

module.exports = router;
