const db = require('../config/db');

exports.getReportTerms = async (req, res) => {
    try {
        const student_id = req.user.id;
        const [terms] = await db.execute(`
            SELECT DISTINCT academic_year, term 
            FROM results 
            WHERE student_id = ? AND status = 'Released'
            ORDER BY academic_year DESC, term DESC
        `, [student_id]);
        res.status(200).json(terms);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching report terms', error: error.message });
    }
};

exports.getResults = async (req, res) => {
    try {
        const student_id = req.user.id;
        const { academic_year, term } = req.query;

        if (!academic_year || !term) {
            return res.status(400).json({ message: 'Academic year and term are required' });
        }

        const [results] = await db.execute(`
            SELECT 
                r.ca_score, r.exam_score, r.total_score, r.grade, 
                s.subject_name,
                c.class_name
            FROM results r
            JOIN subjects s ON r.subject_id = s.id
            JOIN classes c ON r.class_id = c.id
            WHERE r.student_id = ? AND r.academic_year = ? AND r.term = ? AND r.status = 'Released'
        `, [student_id, academic_year, term]);

        res.status(200).json(results);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching results', error: error.message });
    }
};

exports.getDashboardMetrics = async (req, res) => {
    try {
        const student_id = req.user.id;
        
        const [classRows] = await db.execute(`
            SELECT c.id, c.class_name 
            FROM student_classes sc
            JOIN classes c ON sc.class_id = c.id
            WHERE sc.student_id = ?
        `, [student_id]);
        
        const classObj = classRows.length > 0 ? classRows[0] : null;
        
        let subjects = [];
        if (classObj) {
            // Heuristic Name Verification Algorithm (Identifying Religion dynamically without needing a DB rebuild)
            const [userRows] = await db.execute('SELECT first_name, last_name FROM users WHERE id = ?', [student_id]);
            const studentName = (userRows[0]?.first_name + ' ' + userRows[0]?.last_name).toLowerCase();
            
            const christianKeywords = ['michael', 'david', 'olivia', 'wilson', 'johnson', 'james', 'john', 'peter', 'paul', 'samuel', 'emmanuel', 'grace', 'blessing', 'favour', 'joy', 'matthew', 'mark', 'luke', 'mary', 'joseph', 'daniel', 'victor'];
            const isChristian = christianKeywords.some(keyword => studentName.includes(keyword));
            
            // Map the exact Religious Subject based on demographic name mapping
            const religionSubject = isChristian ? 'Christian Religious Studies (CRS)' : 'Islamic Religious Studies (IRS)';

            // Smart Curriculum Engine
            if (classObj.class_name.includes('JSS')) {
                const [subjs] = await db.execute(`
                    SELECT id, subject_name, category 
                    FROM subjects 
                    WHERE category IN ('Core', 'Basic Education', 'Language')
                    OR subject_name = ?
                    ORDER BY category ASC
                `, [religionSubject]);
                
                // Explicitly allow Computer Studies, ban Data Processing, limit to 12
                subjects = subjs.filter(s => s.subject_name !== 'Data Processing').slice(0, 12);
                
            } else if (classObj.class_name.includes('SS')) {
                // Senior Science School Curriculum
                const [subjs] = await db.execute(`
                    SELECT id, subject_name, category 
                    FROM subjects 
                    WHERE category IN ('Core', 'Science Core', 'Science Elective', 'General Elective', 'Trade')
                    OR subject_name = ?
                    ORDER BY category ASC
                `, [religionSubject]);
                
                // Explicitly ban Computer Studies (Core), allow Data Processing (Trade) naturally, limit to 11
                subjects = subjs.filter(s => s.subject_name !== 'Computer Studies').slice(0, 11);
                
            } else {
                const [subjs] = await db.execute(`
                    SELECT DISTINCT s.id, s.subject_name, s.category 
                    FROM teacher_subjects ts
                    JOIN subjects s ON ts.subject_id = s.id
                    WHERE ts.class_id = ?
                `, [classObj.id]);
                subjects = subjs;
            }
        }

        const [attendance] = await db.execute(`
            SELECT status, COUNT(*) as count 
            FROM attendance 
            WHERE student_id = ? 
            GROUP BY status
        `, [student_id]);
        
        const attendanceStats = { Present: 0, Absent: 0 };
        attendance.forEach(row => {
            attendanceStats[row.status] = parseInt(row.count);
        });

        res.status(200).json({
            class_name: classObj ? classObj.class_name : 'Unassigned',
            subjects: subjects,
            attendance: attendanceStats
        });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching metrics', error: error.message });
    }
};
