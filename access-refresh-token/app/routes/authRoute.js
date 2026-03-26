const express = require("express");

const authController = require("../controllers/authController");
const checkAuth = require("../middleware/checkAuth");

const router = express.Router();

router.post('/register', authController.authRegister);
router.post('/login', authController.authLogin);
router.get('/logout',checkAuth, authController.logout);

module.exports = router;