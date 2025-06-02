const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const bcrypt = require('bcrypt');

// Register Student
exports.registerStudent = async (req, res) => {
  const { usn, name, email, password, classId } = req.body;

  if (!classId || !password)
    return res.status(400).json({ error: 'classId and password are required' });

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    const student = await prisma.student.create({
      data: {
        usn,
        name,
        email,
        password: hashedPassword,
        class: { connect: { id: classId } },
      },
    });
    res.json({ message: 'Student registered successfully.', student });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to register student.' });
  }
};

// Register Faculty
exports.registerFaculty = async (req, res) => {
  const { name, email, password, classIds } = req.body;

  if (!password || !Array.isArray(classIds) || classIds.length === 0)
    return res.status(400).json({ error: 'Password and classIds are required' });

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    const faculty = await prisma.faculty.create({
      data: {
        name,
        email,
        password: hashedPassword,
        classes: { connect: classIds.map(id => ({ id })) },
      },
    });
    res.json({ message: 'Faculty registered successfully.', faculty });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to register faculty.' });
  }
};

// Register Admin
exports.registerAdmin = async (req, res) => {
  const { name, email, password } = req.body;

  if (!password) return res.status(400).json({ error: 'Password required' });

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    const admin = await prisma.admin.create({
      data: { name, email, password: hashedPassword },
    });
    res.json({ message: 'Admin registered successfully.', admin });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to register admin.' });
  }
};

// Unified Login for all roles
exports.login = async (req, res) => {
  const { email, password, role } = req.body;

  if (!email || !password || !role)
    return res.status(400).json({ error: 'Email, password, and role are required' });

  if (!['student', 'faculty', 'admin'].includes(role))
    return res.status(400).json({ error: 'Invalid role' });

  try {
    let user;
    if (role === 'student')
      user = await prisma.student.findUnique({ where: { email } });
    else if (role === 'faculty')
      user = await prisma.faculty.findUnique({ where: { email } });
    else
      user = await prisma.admin.findUnique({ where: { email } });

    if (!user) return res.status(404).json({ error: 'User not found' });

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) return res.status(401).json({ error: 'Invalid credentials' });

    // Return user info except password
    const { password: _, ...userWithoutPassword } = user;

    res.json({ message: `${role} logged in successfully`, user: userWithoutPassword });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Login failed' });
  }
};
