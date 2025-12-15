const express = require('express');
const mysql = require('mysql2/promise');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const dotenv = require('dotenv');

// --- FIREBASE CHANGE ---
// Firebase Admin ko import karein
const admin = require('./firebaseAdminConfig.js'); 
// --- END FIREBASE CHANGE ---

const { createTestUser, createTestCourseAndTeacher, pool } = require('./createUser.js'); 
dotenv.config();

const app = express();
app.use(express.json());
app.use(cors({ origin: true, credentials: true }));

//  HELPER FUNCTION: Check if user is teacher
function isTeacherRole(role) {
  const teacherRoles = ['teacher', 'Assistant Professor', 'ASSOCIATE DEAN', 'Professor', 'HOD'];
  return teacherRoles.includes(role);
}

// --- STUDENT LOGIN (UPDATED) ---
app.post('/api/auth/login', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ message: 'Email aur password zaroori hai' });
  
  try {
    const [rows] = await pool.query('SELECT student_id AS id, email, password, role FROM students WHERE email = ?', [email]);
    if (!rows.length) return res.status(401).json({ message: 'Invalid credentials' });
    
    const user = rows[0];
    const match = await bcrypt.compare(password, user.password); 
    if (!match) return res.status(401).json({ message: 'Invalid credentials' });
    
    const payload = { id: user.id, email: user.email, role: user.role };
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '8h' });
    
    // --- FIREBASE CHANGE ---
    // MySQL login successful hone ke baad Firebase token banayein
    // user.id (jo 'student_id' hai) ko string mein convert karein
    const firebaseToken = await admin.auth().createCustomToken(String(user.id));
    // --- END FIREBASE CHANGE ---
    
    console.log('✅ Student logged in:', payload);
    // Token ko response mein add karein
    res.json({ token, user: payload, firebaseToken });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// --- TEACHER LOGIN (UPDATED) ---
app.post('/api/auth/teacher/login', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ message: 'Email aur password zaroori hai' });
  
  try {
    const [rows] = await pool.query('SELECT teacher_id AS id, email, password, role FROM teachers WHERE email = ?', [email]);
    if (!rows.length) return res.status(401).json({ message: 'Invalid credentials' });
    
    const user = rows[0];
    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(401).json({ message: 'Invalid credentials' });
    
    const payload = { id: user.id, email: user.email, role: user.role };
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '8h' });
    
    // --- FIREBASE CHANGE ---
    // MySQL login successful hone ke baad Firebase token banayein
    // user.id (jo 'teacher_id' hai) ko string mein convert karein
    const firebaseToken = await admin.auth().createCustomToken(String(user.id));
    // --- END FIREBASE CHANGE ---
    
    console.log('✅ Teacher logged in:', payload);
    // Token ko response mein add karein
    res.json({ token, user: payload, firebaseToken });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// --- /api/me ENDPOINT (FIXED) ---
app.get('/api/me', async (req, res) => {
  const auth = req.headers.authorization;
  if (!auth) return res.status(401).json({ message: 'No token' });
  
  const token = auth.split(' ')[1];
  let decoded;
  
  try {
    decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log('🔓 Token decoded:', decoded);
  } catch (err) {
    console.error('❌ Token verification failed:', err.message);
    return res.status(401).json({ message: 'Invalid token' });
  }

  try {
    let query;
    let params = [decoded.id];

    if (decoded.role === 'student') {
      query = `
        SELECT 
          s.student_id AS id, s.email, s.username, s.role, s.full_name, s.roll_number, 
          s.current_cgpa, s.profile_photo_url, s.description,
          sec.section_name, sec.current_semester, sec.batch,
          b.branch_name,
          SUM(e.classes_present) AS total_present, 
          SUM(e.total_classes) AS total_classes
        FROM students AS s
        LEFT JOIN sections AS sec ON s.section_id = sec.section_id
        LEFT JOIN branches AS b ON sec.branch_id = b.branch_id
        LEFT JOIN enrollments AS e ON s.student_id = e.student_id
        WHERE s.student_id = ?
        GROUP BY s.student_id, sec.section_id, b.branch_id
      `;
      //
      // =================== FIX KHATAM ===================
      //
    } else if (isTeacherRole(decoded.role)) {
      query = 'SELECT teacher_id AS id, email, role, full_name, department, id_no FROM teachers WHERE teacher_id = ?';
    } else {
      return res.status(403).json({ message: 'Unknown role: ' + decoded.role });
    }

    const cleanQuery = query.split('\n').map(line => line.trim()).filter(line => line).join(' ');
    const [rows] = await pool.query(cleanQuery, params);

    if (!rows.length) {
      console.error('❌ User not found in database for id:', decoded.id);
      return res.status(404).json({ message: 'User not found' });
    }

    console.log('✅ User data sent:', rows[0]);
    res.json({ user: rows[0] });
  } catch (err) {
    console.error('❌ Error in /api/me:', err);
    res.status(500).json({ message: 'Server error retrieving user data' });
  }
});

// --- Get Logged-in Student's Courses ---
// (Yeh query ab aapke naye table schema ke hisaab se SAHI HAI)
app.get('/api/students/me/courses', async (req, res) => {
  const auth = req.headers.authorization;
  if (!auth) return res.status(401).json({ message: 'No token' });
  
  const token = auth.split(' ')[1];
  let decoded;
  
  try {
    decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (decoded.role !== 'student') {
      return res.status(403).json({ message: 'Forbidden' });
    }
  } catch (err) {
    return res.status(401).json({ message: 'Invalid token' });
  }

  try {
         query = `
        SELECT 
          s.student_id AS id, s.email, s.username, s.role, s.full_name, s.roll_number, 
          s.current_cgpa, s.profile_photo_url, s.description,
          sec.section_name, sec.current_semester, sec.batch,
          b.branch_name,
          SUM(e.classes_present) AS total_present,
          SUM(e.total_classes) AS total_classes
        FROM students AS s
        LEFT JOIN sections AS sec ON s.section_id = sec.section_id
        LEFT JOIN branches AS b ON sec.branch_id = b.branch_id
        LEFT JOIN enrollments AS e ON s.student_id = e.student_id
        WHERE s.student_id = ?
        GROUP BY s.student_id, sec.section_id, b.branch_id
      `;

    const cleanQuery = query.split('\n').map(line => line.trim()).filter(line => line).join(' ');
    const [courses] = await pool.query(cleanQuery, [decoded.id]);

    res.json({ courses });
  } catch (err) {
    console.error('Error retrieving student courses:', err);
    res.status(500).json({ message: 'Server error retrieving student courses' });
  }
});

// --- Get Logged-in Teacher's Courses ---
app.get('/api/teachers/me/courses', async (req, res) => {
  const auth = req.headers.authorization;
  if (!auth) return res.status(401).json({ message: 'No token' });
  
  const token = auth.split(' ')[1];
  let decoded;
  
  try {
    decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (!isTeacherRole(decoded.role)) {
      return res.status(403).json({ message: 'Forbidden: Only teachers can access' });
    }
  } catch (err) {
    return res.status(401).json({ message: 'Invalid token' });
  }

  try {
    const query = `
      SELECT 
        c.course_id,
        s.subject_id, s.subject_name, s.subject_code,
        sec.section_id, sec.section_name, sec.batch
      FROM courses AS c
      JOIN subjects AS s ON c.subject_id = s.subject_id
      JOIN sections AS sec ON c.section_id = sec.section_id
      WHERE c.teacher_id = ?
    `;

    const cleanQuery = query.split('\n').map(line => line.trim()).filter(line => line).join(' ');
    const [courses] = await pool.query(cleanQuery, [decoded.id]);

    res.json({ courses });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error retrieving teacher courses' });
  }
});

// --- Get Students by Section ---
app.get('/api/sections/:sectionId/students', async (req, res) => {
  const { sectionId } = req.params;
  const auth = req.headers.authorization;
  if (!auth) return res.status(401).json({ message: 'No token' });
  
  const token = auth.split(' ')[1];
  
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (!isTeacherRole(decoded.role)) { 
      return res.status(403).json({ message: 'Forbidden: Only teachers can access this' });
    }
  } catch (err) {
    return res.status(401).json({ message: 'Invalid token' });
  }

  try {
    const query = `
      SELECT 
        student_id, full_name, roll_number, email, profile_photo_url, current_cgpa , description
      FROM students 
      WHERE section_id = ?
    `;
    const [students] = await pool.query(query, [sectionId]);
    
    if (!students.length) {
      return res.status(404).json({ message: 'Is section mein koi student nahi hai ya section galat hai' });
    }
    
    res.json({ students });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error retrieving students' });
  }
});

const port = process.env.PORT || 5000;

const startServer = async () => {
  try {
    const { newCourseId } = await createTestCourseAndTeacher(); 
    if (newCourseId) {
        await createTestUser(newCourseId);
    } else {
        console.log("Test course nahi bana, isliye test user bhi nahi banaya.");
    }
    
    app.listen(port, () => console.log(`🚀 Server running on port ${port}`));
  } catch (err) {
    console.error("❌ Server start karne mein failure:", err);
    process.exit(1);
  }
};

startServer();