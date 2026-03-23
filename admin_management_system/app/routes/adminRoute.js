const router = require('express').Router();


const adminController = require('../controllers/adminController');
const { adminOnly, protect } = require('../middleware/middleware');


router.post('/login', adminController.login);
router.post('/create-employee', protect, adminOnly, adminController.createEmployee);
router.get('/employees', protect, adminOnly, adminController.getEmployees);
router.patch('/employee/:id/status', protect, adminOnly, adminController.toggleStatus);
router.post('/reset-password/:id', protect, adminOnly, adminController.resetPassword);

module.exports = router;
