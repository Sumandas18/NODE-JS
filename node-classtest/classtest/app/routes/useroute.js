const express = require('express');
const userController = require('../controller/userController');

const router = express.Router();

router.get("/",userController.index)

module.exports= router