const express = require("express");

const tokenController = require("../controllers/tokenController");

const router = express.Router();

router.get('/generate', tokenController.checkToken);

module.exports = router;