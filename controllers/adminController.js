const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Upload a new event
exports.createEvent = async (req, res) => {
  const { name, date } = req.body;

  try {
    const event = await prisma.event.create({
      data: {
        name,
        date: new Date(date),
        createdByAdmin: true,
      },
    });

    res.json({ message: 'Event created successfully.', event });
  } catch (error) {
    console.error(error);
    res.status(500).send('Failed to create event.');
  }
};

// View students registered for an event
exports.getRegisteredStudents = async (req, res) => {
  const eventId = parseInt(req.params.eventId);

  try {
    const attendance = await prisma.attendance.findMany({
      where: {
        eventId,
        reason: 'Event',
      },
      include: {
        student: true,
      },
    });

    res.json(attendance.map(entry => entry.student));
  } catch (error) {
    console.error(error);
    res.status(500).send('Failed to fetch registered students.');
  }
};

// Validate attendance for a student at an event
exports.validateEventAttendance = async (req, res) => {
  const { studentId, eventId } = req.body;

  try {
    const attendance = await prisma.attendance.updateMany({
      where: {
        studentId,
        eventId,
        reason: 'Event',
      },
      data: {
        status: 'Present',
      },
    });

    res.json({ message: 'Attendance marked as Present.', updated: attendance.count });
  } catch (error) {
    console.error(error);
    res.status(500).send('Failed to validate attendance.');
  }
};
