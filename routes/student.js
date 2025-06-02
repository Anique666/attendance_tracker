const express = require('express');
const router = express.Router();
const studentController = require('../controllers/studentController');

router.get('/:id/attendance', studentController.getAttendance);
router.post('/:id/condonation', studentController.applyCondonation);
router.post('/:id/events/:eventId/register', studentController.registerEvent);
router.get('/:id/events', studentController.viewRegisteredEvents);
router.get('/:id/condonation', studentController.viewCondonationStatus);

module.exports = router;
