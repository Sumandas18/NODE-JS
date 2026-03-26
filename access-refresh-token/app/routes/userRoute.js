const express = require("express");

const userController = require("../controllers/userController");
const checkAuth = require("../middleware/checkAuth");

const router = express.Router();

router.get('/', userController.fetchAllUser);
router.get('/me', checkAuth, userController.fetchUserProfile);

module.exports = router;