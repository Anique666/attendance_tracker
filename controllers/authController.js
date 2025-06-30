const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// Get available classes
exports.getClasses = async (req, res) => {
  try {
    const classes = await prisma.class.findMany({
      select: {
        id: true,
        name: true,
      },
    });
    res.json(classes);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch classes' });
  }
};

// Register Student
exports.registerStudent = async (req, res) => {
  const { name, email, password, usn, classId } = req.body;

  if (!name || !email || !password || !usn || !classId) {
    return res.status(400).json({ error: 'Name, email, password, USN, and class are required' });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    const student = await prisma.student.create({
      data: {
        usn,
        name,
        email,
        password: hashedPassword,
        classId: parseInt(classId),
      },
    });

    const { password: _, ...studentWithoutPassword } = student;
    res.json({ message: 'Student registered successfully', user: studentWithoutPassword });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to register student' });
  }
};

// Register Faculty
exports.registerFaculty = async (req, res) => {
  const { name, email, password, classIds } = req.body;

  if (!name || !email || !password || !classIds || !classIds.length) {
    return res.status(400).json({ error: 'Name, email, password, and at least one class are required' });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    const faculty = await prisma.faculty.create({
      data: {
        name,
        email,
        password: hashedPassword,
        classes: {
          connect: classIds.map(id => ({ id: parseInt(id) })),
        },
      },
      include: {
        classes: true,
      },
    });

    const { password: _, ...facultyWithoutPassword } = faculty;
    res.json({ message: 'Faculty registered successfully', user: facultyWithoutPassword });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to register faculty' });
  }
};

// Register Admin
exports.registerAdmin = async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ error: 'Name, email, and password are required' });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    const admin = await prisma.admin.create({
      data: {
        name,
        email,
        password: hashedPassword,
      },
    });

    const { password: _, ...adminWithoutPassword } = admin;
    res.json({ message: 'Admin registered successfully', user: adminWithoutPassword });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to register admin' });
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
      user = await prisma.student.findUnique({ 
        where: { email },
        include: { class: true }
      });
    else if (role === 'faculty')
      user = await prisma.faculty.findUnique({ 
        where: { email },
        include: { classes: true }
      });
    else
      user = await prisma.admin.findUnique({ where: { email } });

    if (!user) return res.status(404).json({ error: 'User not found' });

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) return res.status(401).json({ error: 'Invalid credentials' });

    // Generate JWT token
    const token = jwt.sign(
      { 
        userId: user.id, 
        email: user.email,
        role: role 
      },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '24h' }
    );

    // Return user info except password
    const { password: _, ...userWithoutPassword } = user;

    res.json({ 
      message: `${role} logged in successfully`, 
      user: { ...userWithoutPassword, role },
      token 
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Login failed' });
  }
};
