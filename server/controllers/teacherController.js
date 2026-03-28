const db = require('../config/db');

exports.getFormClasses = async (req, res) => {
    try {
        const teacher_id = req.user.id;
        const [classes] = await db.execute(`
            SELECT DISTINCT c.id, c.class_name 
            FROM classes c
            JOIN teacher_classes tc ON c.id = tc.class_id
            WHERE tc.teacher_id = ?
        `, [teacher_id]);
        res.status(200).json(classes);
    } catch (error) { res.status(500).json({ message: 'Error', error: error.message }); }
};

exports.getSubjectClasses = async (req, res) => {
    try {
        const teacher_id = req.user.id;
        const [classes] = await db.execute(`
            SELECT DISTINCT c.id, c.class_name 
            FROM classes c
            JOIN teacher_subjects ts ON c.id = ts.class_id
            WHERE ts.teacher_id = ?
        `, [teacher_id]);
        res.status(200).json(classes);
    } catch (error) { res.status(500).json({ message: 'Error', error: error.message }); }
};

exports.getPendingResults = async (req, res) => {
    try {
        const { class_id } = req.params;
        const [results] = await db.execute(`
            SELECT r.id, r.term, r.ca_score, r.exam_score, r.total_score, r.grade, r.status, 
                   s.first_name, s.last_name, sub.subject_name
            FROM results r
            JOIN users s ON r.student_id = s.id
            JOIN subjects sub ON r.subject_id = sub.id
            WHERE r.class_id = ? AND r.status = 'Pending'
        `, [class_id]);
        res.status(200).json(results);
    } catch(e) { res.status(500).json({message: e.message}); }
};

exports.releaseResults = async (req, res) => {
    try {
        const { class_id } = req.body;
        const teacher_id = req.user.id;
        // Verify Form Master
        const [auth] = await db.execute('SELECT 1 FROM teacher_classes WHERE teacher_id = ? AND class_id = ?', [teacher_id, class_id]);
        if (auth.length === 0) return res.status(403).json({message: 'Not authorized as Form Master.'});

        await db.execute("UPDATE results SET status = 'Released' WHERE class_id = ? AND status = 'Pending'", [class_id]);
        res.status(200).json({message: 'Results successfully released to students.'});
    } catch(e) { res.status(500).json({message: e.message}); }
};

exports.getStudentsInClass = async (req, res) => {
    try {
        const { class_id } = req.params;
        const [students] = await db.execute(`
            SELECT u.id, u.first_name, u.last_name, u.email
            FROM users u
            JOIN student_classes sc ON u.id = sc.student_id
            WHERE sc.class_id = ? AND u.role = 'Student'
        `, [class_id]);
        
        res.status(200).json(students);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching students in class', error: error.message });
    }
};

exports.getSubjects = async (req, res) => {
    try {
        const teacher_id = req.user.id;
        const [subjects] = await db.execute(`
            SELECT DISTINCT s.id, s.subject_name 
            FROM subjects s
            JOIN teacher_subjects ts ON s.id = ts.subject_id
            WHERE ts.teacher_id = ?
        `, [teacher_id]);
        res.status(200).json(subjects);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching subjects', error: error.message });
    }
};

exports.markAttendance = async (req, res) => {
    try {
        const { student_id, class_id, date, status } = req.body;
        const marked_by = req.user.id;
        
        if (!student_id || !class_id || !date || !status) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        try {
            await db.execute(`
                INSERT INTO attendance (student_id, class_id, date, status, marked_by)
                VALUES (?, ?, ?, ?, ?)
            `, [student_id, class_id, date, status, marked_by]);

            res.status(200).json({ message: 'Attendance marked successfully' });
        } catch(dbErr) {
            if (dbErr.code === 'ER_DUP_ENTRY') {
                return res.status(400).json({ message: 'Attendance register has already been signed for this student on this specific date.' });
            }
            throw dbErr;
        }
    } catch (error) {
        res.status(500).json({ message: 'Error marking attendance', error: error.message });
    }
};

const calculateGrade = (total) => {
    if (total >= 70) return 'A';
    if (total >= 60) return 'B';
    if (total >= 50) return 'C';
    if (total >= 48) return 'D';
    if (total >= 40) return 'E';
    return 'F';
};

exports.uploadResult = async (req, res) => {
    try {
        const { student_id, class_id, subject_id, term, academic_year, ca_score, exam_score } = req.body;
        const uploaded_by = req.user.id;

        if (!student_id || !class_id || !subject_id || !term || !academic_year) {
            return res.status(400).json({ message: 'Missing required configuration fields for the result' });
        }

        const ca = parseFloat(ca_score) || 0;
        const exam = parseFloat(exam_score) || 0;
        const total_score = ca + exam;
        const grade = calculateGrade(total_score);

        // Security Validation
        const [auth] = await db.execute(
            'SELECT 1 FROM teacher_subjects WHERE teacher_id = ? AND class_id = ? AND subject_id = ?',
            [uploaded_by, class_id, subject_id]
        );
        if (auth.length === 0) {
            return res.status(403).json({ message: 'Unauthorized: You are not assigned to grade this specific subject in this class.' });
        }

        await db.execute(`
            INSERT INTO results (student_id, class_id, subject_id, term, academic_year, ca_score, exam_score, total_score, grade, uploaded_by)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            ON DUPLICATE KEY UPDATE 
                ca_score = VALUES(ca_score), 
                exam_score = VALUES(exam_score), 
                total_score = VALUES(total_score),
                grade = VALUES(grade),
                uploaded_by = VALUES(uploaded_by)
        `, [student_id, class_id, subject_id, term, academic_year, ca, exam, total_score, grade, uploaded_by]);

        res.status(200).json({ 
            message: 'Result uploaded successfully', 
            data: { total_score, grade } 
        });
    } catch (error) {
        res.status(500).json({ message: 'Error uploading result', error: error.message });
    }
};
