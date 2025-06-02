const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Get list of students in all classes taught by the faculty
exports.getStudentsByFaculty = async (req, res) => {
  const facultyId = parseInt(req.params.id);
  try {
    // Find faculty with classes and include their students
    const facultyWithClasses = await prisma.faculty.findUnique({
      where: { id: facultyId },
      include: {
        classes: {
          include: {
            students: true,
          },
        },
      },
    });

    if (!facultyWithClasses) {
      return res.status(404).json({ error: "Faculty not found" });
    }

    const classes = facultyWithClasses.classes;
    // Flatten all students from all classes
    const students = classes.flatMap(cls => cls.students);

    res.json(students);
  } catch (error) {
    console.error(error);
    res.status(500).send('Failed to fetch students.');
  }
};

// Give attendance to a student
exports.giveAttendance = async (req, res) => {
  const { studentId, status, reason, eventId } = req.body;

  try {
    const attendance = await prisma.attendance.create({
      data: {
        studentId,
        status,
        reason,
        eventId,
      },
    });

    res.json({ message: 'Attendance recorded.', attendance });
  } catch (error) {
    console.error(error);
    res.status(500).send('Failed to give attendance.');
  }
};

// Approve condonation request
exports.approveCondonation = async (req, res) => {
  const requestId = parseInt(req.params.requestId);

  try {
    const updatedRequest = await prisma.condonationRequest.update({
      where: { id: requestId },
      data: { status: 'Approved' },
    });

    await prisma.attendance.create({
      data: {
        studentId: updatedRequest.studentId,
        status: 'Condoned',
        reason: updatedRequest.reason,
        eventId: updatedRequest.eventId || null,
      },
    });

    res.json({ message: 'Condonation approved and attendance added.', updatedRequest });
  } catch (error) {
    console.error(error);
    res.status(500).send('Failed to approve condonation.');
  }
};
