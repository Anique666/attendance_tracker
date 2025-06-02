const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

exports.getAttendance = async (req, res) => {
  const studentId = parseInt(req.params.id);

  try {
    // Count total attendance records
    const totalAttendance = await prisma.attendance.count({
      where: { studentId },
    });

    // Count present or condoned attendance records
    const presentAttendance = await prisma.attendance.count({
      where: {
        studentId,
        status: {
          in: ['Present', 'Condoned'],
        },
      },
    });

    // Calculate percentage
    const attendancePercentage =
      totalAttendance > 0 ? (presentAttendance / totalAttendance) * 100 : 0;

    // Optional: Return attendance grouped by event (date + name)
    const attendanceDetails = await prisma.attendance.findMany({
      where: { studentId },
      include: { event: true },
    });

    res.json({
      overallAttendancePercentage: attendancePercentage.toFixed(2),
      attendanceRecords: attendanceDetails.map((record) => ({
        eventId: record.eventId,
        eventName: record.event ? record.event.name : 'N/A',
        eventDate: record.event ? record.event.date : null,
        status: record.status,
        reason: record.reason,
      })),
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch attendance data' });
  }
};

exports.applyCondonation = async (req, res) => {
  const studentId = parseInt(req.params.id);
  const { reason, mediaUrl, eventId } = req.body; // eventId is optional, if condoning event attendance

  if (!reason || !mediaUrl) {
    return res.status(400).json({ error: 'Reason and mediaUrl are required' });
  }

  try {
    const newRequest = await prisma.condonationRequest.create({
      data: {
        reason,
        mediaUrl,
        status: 'Pending',  // initial status
        studentId,
        eventId: eventId ? parseInt(eventId) : null,
      },
    });

    res.json({ message: 'Condonation request submitted', request: newRequest });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to submit condonation request' });
  }
};

exports.registerEvent = async (req, res) => {
  const studentId = parseInt(req.params.id);
  const eventId = parseInt(req.params.eventId);

  try {
    // Check if attendance already exists to avoid duplicate registrations
    const existingAttendance = await prisma.attendance.findFirst({
      where: { studentId, eventId },
    });

    if (existingAttendance) {
      return res.status(400).json({ error: 'Already registered for this event' });
    }

    // Create attendance with status 'Present' when registered
    const attendance = await prisma.attendance.create({
      data: {
        studentId,
        eventId,
        status: 'Present', // assuming registering means attended, can be updated later by admin
      },
    });

    res.json({ message: 'Event registration successful', attendance });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to register for event' });
  }
};

exports.viewRegisteredEvents = async (req, res) => {
  const studentId = parseInt(req.params.id);

  try {
    const attendances = await prisma.attendance.findMany({
      where: { studentId, eventId: { not: null } },
      include: { event: true },
    });

    const events = attendances.map((att) => ({
      eventId: att.eventId,
      eventName: att.event?.name,
      eventDate: att.event?.date,
      status: att.status,
    }));

    res.json({ registeredEvents: events });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch registered events' });
  }
};

exports.viewCondonationStatus = async (req, res) => {
  const studentId = parseInt(req.params.id);

  try {
    const requests = await prisma.condonationRequest.findMany({
      where: { studentId },
      include: {
        event: true,
        faculty: true,
      },
    });

    const formattedRequests = requests.map((req) => ({
      id: req.id,
      reason: req.reason,
      mediaUrl: req.mediaUrl,
      status: req.status,
      event: req.event ? { id: req.event.id, name: req.event.name } : null,
      approvedBy: req.faculty ? { id: req.faculty.id, name: req.faculty.name } : null,
    }));

    res.json({ condonationRequests: formattedRequests });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch condonation requests' });
  }
};