const router = require('express').Router();
const employeeController = require('../controllers/employeeController');
const { protect, employeeOnly } = require('../middleware/middleware');

router.post('/login', employeeController.loginEmployee);
router.post('/change-password', protect, employeeOnly, employeeController.changePassword);
router.get('/dashboard', protect, employeeOnly, employeeController.getDashboard);

module.exports = router;