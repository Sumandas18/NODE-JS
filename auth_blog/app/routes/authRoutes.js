const express = require("express");
const authController = require("../controllers/authCOntroller");

const router = express.Router();

router.post("/register", authController.registerAuthor);
router.post("/login", authController.loginAuthor);

module.exports = router;