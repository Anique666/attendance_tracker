const express = require('express');
const router = express.Router();
const studentController = require('../controllers/studentController');

// View overall and class-wise attendance
router.get('/:id/attendance', studentController.getAttendance);

// Apply for medical condonation
router.post('/:id/condonation', studentController.applyCondonation);

// Register for event
router.post('/:id/events/:eventId/register', studentController.registerEvent);

// View registered events
router.get('/:id/events', studentController.viewRegisteredEvents);

// View condonation status
router.get('/:id/condonation', studentController.viewCondonationStatus);

module.exports = router;
