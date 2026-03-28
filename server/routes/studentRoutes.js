const express = require('express');
const router = express.Router();
const studentController = require('../controllers/studentController');
const { verifyToken, authorizeRoles } = require('../middlewares/authMiddleware');

router.use(verifyToken, authorizeRoles('Student'));

router.get('/report-terms', studentController.getReportTerms);
router.get('/results', studentController.getResults);
router.get('/dashboard-metrics', studentController.getDashboardMetrics);

module.exports = router;
