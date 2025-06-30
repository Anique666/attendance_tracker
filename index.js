const express = require('express');

const { Pool } = require('pg');

const app = express();



app.use(express.json());

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'project',
  password: 'anish',
  port: 5432,
});

app.get('/', async (req, res) => {
  try {
    const result = await pool.query('SELECT NOW()');
    res.json({ message: 'Welcome to the Attendance Tracker API', time: result.rows[0].now });
  } catch (err) {
    console.error(err);
    res.status(500).send('Database error');
  }
});

const studentRoutes = require('./routes/student');
const facultyRoutes = require('./routes/faculty');
const adminRoutes = require('./routes/admin');
const authRoutes = require('./routes/auth');
app.use('/auth', authRoutes);
app.use('/student', studentRoutes);
app.use('/faculty', facultyRoutes);
app.use('/admin', adminRoutes);

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});


