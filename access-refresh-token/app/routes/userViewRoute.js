const express = require("express");

const userController = require("../controllers/userController");
const checkAuth = require("../middleware/checkAuth");

const router = express.Router();

router.get("/admin/dashboard", userController.userListPage);
router.get("/dashboard", checkAuth, userController.profilePage);


module.exports = router;