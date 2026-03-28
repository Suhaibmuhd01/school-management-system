const express = require('express');
const router = express.Router();
const teacherController = require('../controllers/teacherController');
const { verifyToken, authorizeRoles } = require('../middlewares/authMiddleware');

router.use(verifyToken, authorizeRoles('Teacher'));

router.get('/form-classes', teacherController.getFormClasses);
router.get('/subject-classes', teacherController.getSubjectClasses);
router.get('/classes/:class_id/pending-results', teacherController.getPendingResults);
router.post('/results/release', teacherController.releaseResults);
router.get('/classes/:class_id/students', teacherController.getStudentsInClass);
router.get('/subjects', teacherController.getSubjects);
router.post('/attendance', teacherController.markAttendance);
router.post('/results', teacherController.uploadResult);

module.exports = router;
