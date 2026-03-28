const db = require('../config/db');
const bcrypt = require('bcryptjs');

// --- User Management ---
exports.getUsersByRole = async (req, res) => {
    try {
        const { role } = req.params;
        const [users] = await db.execute('SELECT id, first_name, last_name, email, role, created_at FROM users WHERE role = ?', [role]);
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching users', error: error.message });
    }
};

exports.createUser = async (req, res) => {
    try {
        const { first_name, last_name, email, password, role } = req.body;
        if (!first_name || !last_name || !email || !password || !role) {
            return res.status(400).json({ message: 'All fields are required' });
        }
        const [existingUser] = await db.execute('SELECT * FROM users WHERE email = ?', [email]);
        if (existingUser.length > 0) return res.status(400).json({ message: 'User already exists' });

        const salt = await bcrypt.genSalt(10);
        const password_hash = await bcrypt.hash(password, salt);

        const [result] = await db.execute(
            'INSERT INTO users (first_name, last_name, email, password_hash, role) VALUES (?, ?, ?, ?, ?)',
            [first_name, last_name, email, password_hash, role]
        );
        res.status(201).json({ message: `${role} created successfully`, userId: result.insertId });
    } catch (error) {
        res.status(500).json({ message: 'Error creating user', error: error.message });
    }
};

exports.deleteUser = async (req, res) => {
    try {
        const { id } = req.params;
        await db.execute('DELETE FROM users WHERE id = ?', [id]);
        res.status(200).json({ message: 'User deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting user', error: error.message });
    }
};

// --- Class Management ---
exports.getClasses = async (req, res) => {
    try {
        const [classes] = await db.execute('SELECT * FROM classes');
        res.status(200).json(classes);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching classes', error: error.message });
    }
};

exports.createClass = async (req, res) => {
    try {
        const { class_name } = req.body;
        if (!class_name) return res.status(400).json({ message: 'Class name is required' });

        const [result] = await db.execute('INSERT INTO classes (class_name) VALUES (?)', [class_name]);
        res.status(201).json({ message: 'Class created successfully', classId: result.insertId });
    } catch (error) {
        res.status(500).json({ message: 'Error creating class', error: error.message });
    }
};

exports.deleteClass = async (req, res) => {
    try {
        const { id } = req.params;
        await db.execute('DELETE FROM classes WHERE id = ?', [id]);
        res.status(200).json({ message: 'Class deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting class', error: error.message });
    }
};

// --- Subject Management ---
exports.getSubjects = async (req, res) => {
    try {
        const [subjects] = await db.execute('SELECT * FROM subjects');
        res.status(200).json(subjects);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching subjects', error: error.message });
    }
};

exports.createSubject = async (req, res) => {
    try {
        const { subject_name } = req.body;
        if (!subject_name) return res.status(400).json({ message: 'Subject name is required' });

        const subCategory = req.body.category || 'General';
        const [result] = await db.execute('INSERT INTO subjects (subject_name, category) VALUES (?, ?)', [subject_name, subCategory]);
        res.status(201).json({ message: 'Subject created successfully', subjectId: result.insertId });
    } catch (error) {
        res.status(500).json({ message: 'Error creating subject', error: error.message });
    }
};

// --- Assignments ---
exports.assignTeacherToClass = async (req, res) => {
    try {
        const { teacher_id, class_id, subject_id } = req.body;
        if (!subject_id) return res.status(400).json({ message: 'Subject is strictly required.' });
        await db.execute('INSERT INTO teacher_subjects (teacher_id, class_id, subject_id) VALUES (?, ?, ?)', [teacher_id, class_id, subject_id]);
        res.status(200).json({ message: 'Strict Teacher-Subject-Class assignment successful.' });
    } catch (error) {
        res.status(500).json({ message: 'Error assigning teacher', error: error.message });
    }
};

exports.assignStudentToClass = async (req, res) => {
    try {
        const { student_id, class_id } = req.body;
        await db.execute('INSERT INTO student_classes (student_id, class_id) VALUES (?, ?)', [student_id, class_id]);
        res.status(200).json({ message: 'Student assigned to class successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error assigning student', error: error.message });
    }
};

exports.promoteStudents = async (req, res) => {
    try {
        const [classes] = await db.execute('SELECT * FROM classes');
        if (!classes.length) return res.status(400).json({ message: 'No classes found' });

        const classMap = {}; 
        const idToName = {}; 
        classes.forEach(c => {
            classMap[c.class_name.toUpperCase()] = c.id;
            idToName[c.id] = c.class_name;
        });

        const [studentClasses] = await db.execute('SELECT * FROM student_classes');

        let promotedCount = 0;
        let graduatedCount = 0;

        for (let mapping of studentClasses) {
            const currentClassName = idToName[mapping.class_id];
            if (!currentClassName) continue;

            const regex = /^(JSS|SS)\s*(\d)(.*)$/i;
            const match = currentClassName.match(regex);
            
            if (match) {
                const level = match[1].toUpperCase(); 
                const year = parseInt(match[2], 10);
                const suffix = match[3] || '';

                let nextLevel = level;
                let nextYear = year + 1;

                if (level === 'JSS' && year === 3) {
                    nextLevel = 'SS';
                    nextYear = 1;
                }

                if (level === 'SS' && year === 3) {
                    // Graduate
                    await db.execute('DELETE FROM student_classes WHERE id = ?', [mapping.id]);
                    graduatedCount++;
                    continue;
                }

                const nextClassName = `${nextLevel} ${nextYear}${suffix}`.trim();
                let nextClassId = classMap[nextClassName.toUpperCase()];

                if (!nextClassId) {
                    const [insertRes] = await db.execute('INSERT INTO classes (class_name) VALUES (?)', [nextClassName]);
                    nextClassId = insertRes.insertId;
                    classMap[nextClassName.toUpperCase()] = nextClassId;
                    idToName[nextClassId] = nextClassName;
                }

                await db.execute('UPDATE student_classes SET class_id = ? WHERE id = ?', [nextClassId, mapping.id]);
                promotedCount++;
            }
        }

        res.status(200).json({ 
            message: `Promotion successful. ${promotedCount} promoted, ${graduatedCount} graduated.`
        });

    } catch (error) {
        res.status(500).json({ message: 'Error executing promotion', error: error.message });
    }
};
