const mysql = require('mysql2/promise');
const bcrypt = require('bcrypt');
const dotenv = require('dotenv');
dotenv.config();

const pool = mysql.createPool({
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

async function createTestCourseAndTeacher() {
    let newTeacherId;
    let newCourseId;
    
    try {
        // 🔥 STEP 1: Check if teacher already exists
        const [[existingTeacher]] = await pool.query(
            'SELECT teacher_id FROM teachers WHERE id_no = ?', 
            ['T-101']
        );

        if (existingTeacher) {
            newTeacherId = existingTeacher.teacher_id;
            console.log('Teacher already exists, id:', newTeacherId);
        } else {
            // Create new teacher
            const pw = 'iilm@2028';
            const hash = await bcrypt.hash(pw, 10);
            const [resTeacher] = await pool.query(
                'INSERT INTO teachers (id_no, password, full_name, email, role, department) VALUES (?, ?, ?, ?, ?, ?)',
                ['T-101', hash, 'DR. Himanshu Sharma', 'sharma.himanshu@iilm.edu', 'ASSOCIATE DEAN', 'School of Engineering']
            );
            newTeacherId = resTeacher.insertId;
            console.log('New TEACHER created, id:', newTeacherId);
        }

        // 🔥 STEP 2: Get subject_id
        const [[subject]] = await pool.query(
            'SELECT subject_id FROM subjects WHERE subject_code = ?', 
            ['CS-101']
        );
        
        if (!subject) {
            console.error(" Error: Subject 'CS-101' nahi mila database mein.");
            console.log("Pehle subject insert karo:");
            console.log("INSERT INTO subjects (subject_code, subject_name) VALUES ('CS-101', 'Introduction to Programming');");
            return { newTeacherId: null, newCourseId: null };
        }
        const subjectId = subject.subject_id;
        console.log('Subject found, id:', subjectId);

        // 🔥 STEP 3: Get section_id
        const [[section]] = await pool.query(
            'SELECT section_id FROM sections WHERE section_name = ?', 
            ['1CSE1']
        );
        
        if (!section) {
            console.error("Error: Section '1CSE1' nahi mila database mein.");
            console.log(" Pehle section insert karo:");
            console.log("INSERT INTO sections (section_name, current_semester, batch) VALUES ('1CSE1', 1, 2024);");
            return { newTeacherId: null, newCourseId: null };
        }
        const sectionId = section.section_id;
        console.log('Section found, id:', sectionId);

        // 🔥 STEP 4: Check if course already exists
        const [[existingCourse]] = await pool.query(
            'SELECT course_id FROM courses WHERE teacher_id = ? AND subject_id = ? AND section_id = ?',
            [newTeacherId, subjectId, sectionId]
        );

        if (existingCourse) {
            newCourseId = existingCourse.course_id;
            console.log('Course already exists, id:', newCourseId);
        } else {
            // Create new course
            const [resCourse] = await pool.query(
                'INSERT INTO courses (teacher_id, subject_id, section_id) VALUES (?, ?, ?)',
                [newTeacherId, subjectId, sectionId]
            );
            newCourseId = resCourse.insertId;
            // console.log(`✅ New COURSE created, id: ${newCourseId}`);
        }

        // console.log(`📚 Course Setup Complete: Teacher ${newTeacherId} → Subject ${subjectId} → Section ${sectionId}`);

    } catch (error) {
        console.error('Error in createTestCourseAndTeacher:', error.message);
    }

    return { newTeacherId, newCourseId };
}

async function createTestUser(courseId) {
    if (!courseId) {
        console.error("Error: Course ID nahi mili. Student create nahi ho sakta.");
        return;
    }

    try {
        // 🔥 STEP 1: Get section_id
        const [[section]] = await pool.query(
            'SELECT section_id FROM sections WHERE section_name = ?', 
            ['1CSE1']
        );
        
        if (!section) {
            console.error("Error: Section '1CSE1' nahi mila.");
            return;
        }
        const sectionId = section.section_id;

        // 🔥 STEP 2: Check if student already exists
        const [[existingStudent]] = await pool.query(
            'SELECT student_id FROM students WHERE email = ?',
            ['faisal.khan.cs28@iilm.edu']
        );

        let studentId;

        if (existingStudent) {
            studentId = existingStudent.student_id;
            console.log('Student already exists, id:', studentId);
        } else {
            // Create new student
            const pw = 'iilm@2028';
            const hash = await bcrypt.hash(pw, 10);
            const [res] = await pool.query(
                'INSERT INTO students (username, password, full_name, email, role, roll_number, section_id, description) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
            [
                'faisalkhan', 
                hash, 
                'Faisal Khan', 
                'faisal.khan.cs28@iilm.edu', 
                'student', 
                '2410030251', 
                sectionId, 
                'B.Tech CSE student at IILM University. Aspiring full-stack developer.' 
            ]
);
            studentId = res.insertId;
            // console.log('✅ New STUDENT created, id:', studentId);
        }

        // 🔥 STEP 3: Check if enrollment already exists
        const [[existingEnrollment]] = await pool.query(
            'SELECT * FROM enrollments WHERE student_id = ? AND course_id = ?',
            [studentId, courseId]
        );

        if (existingEnrollment) {
            console.log('Student already enrolled in this course');
        } else {
            await pool.query(
                'INSERT INTO enrollments (student_id, course_id, classes_present, classes_absent) VALUES (?, ?, ?, ?)',
                [studentId, courseId, 0, 0] // 0 present, 0 absent
            );
        }

        // console.log('🎉 Test student setup complete!');

    } catch (error) {
        console.error('Error in createTestUser:', error.message);
    }
}

async function setupTestData() {
    const { newCourseId } = await createTestCourseAndTeacher();
    if (newCourseId) { // Check if course creation was successful
      await createTestUser(newCourseId);
    }
    console.log('🎉 Complete test data setup finished!');
    await pool.end();
}

module.exports = { createTestUser, createTestCourseAndTeacher, setupTestData, pool };