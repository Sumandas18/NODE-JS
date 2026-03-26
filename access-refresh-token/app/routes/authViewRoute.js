const express = require("express");
const authController = require("../controllers/authController");

const router = express.Router();

router.get("/login", authController.loginPage);
router.get("/register", authController.registerPage);


module.exports = router;