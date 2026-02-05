const express = require('express')
const studentController = require('../controllers/studentController')
const router = express.Router()

router.post('/student/create', studentController.createStudent)
router.get('/student', studentController.getStudent)
router.get('/student/:id', studentController.findStudent)
router.put('/student/:id', studentController.updateStudent)

module.exports= router