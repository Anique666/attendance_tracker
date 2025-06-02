const express = require('express');
const router = express.Router();
const facultyController = require('../controllers/facultyController');

router.get('/:id/students', facultyController.getStudentsByFaculty);
router.post('/attendance', facultyController.giveAttendance);
router.post('/condonation/:requestId/approve', facultyController.approveCondonation);

module.exports = router;
