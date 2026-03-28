const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const { verifyToken, authorizeRoles } = require('../middlewares/authMiddleware');

router.use(verifyToken, authorizeRoles('Admin'));

// User Management
router.get('/users/:role', adminController.getUsersByRole);
router.post('/users', adminController.createUser);
router.delete('/users/:id', adminController.deleteUser);

// Class Management
router.get('/classes', adminController.getClasses);
router.post('/classes', adminController.createClass);
router.delete('/classes/:id', adminController.deleteClass);

// Subject Management
router.get('/subjects', adminController.getSubjects);
router.post('/subjects', adminController.createSubject);

// Assignments
router.post('/assign-teacher', adminController.assignTeacherToClass);
router.post('/assign-student', adminController.assignStudentToClass);

// System Operations
router.post('/promote-students', adminController.promoteStudents);

module.exports = router;
