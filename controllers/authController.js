const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Register Faculty with classes (array of classIds)
exports.registerFaculty = async (req, res) => {
  const { name, email, classIds } = req.body;

  if (!Array.isArray(classIds) || classIds.length === 0) {
    return res.status(400).json({ error: "classIds must be a non-empty array" });
  }

  try {
    const faculty = await prisma.faculty.create({
      data: {
        name,
        email,
        classes: {
          connect: classIds.map(id => ({ id })),
        },
      },
    });

    res.json({ message: 'Faculty registered successfully.', faculty });
  } catch (error) {
    console.error(error);
    res.status(500).send('Failed to register faculty.');
  }
};

// Register Student with one class (single classId)
exports.registerStudent = async (req, res) => {
  const { usn, name, email, classId } = req.body;

  if (!classId) {
    return res.status(400).json({ error: "classId is required" });
  }

  try {
    const student = await prisma.student.create({
      data: {
        usn,
        name,
        email,
        class: {
          connect: { id: classId },
        },
      },
    });

    res.json({ message: 'Student registered successfully.', student });
  } catch (error) {
    console.error(error);
    res.status(500).send('Failed to register student.');
  }
};
