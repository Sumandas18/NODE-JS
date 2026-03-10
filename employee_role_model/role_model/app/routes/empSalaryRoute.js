const express = require('express')

const rolecheck = require('../middleware/rolecheck')
const empSalaryController = require('../controllers/empSalaryController')
const router = express.Router()

router.post('/create/empSalary', rolecheck, empSalaryController.createEmpSalary) 
router.get('/empSalaries', empSalaryController.getAllEmpSalaries)
router.get('/empSalary/:id', empSalaryController.getEmpSalaryById)
router.put('/empSalary/:id', rolecheck, empSalaryController.updateEmpSalary)
router.delete('/empSalary/:id', rolecheck, empSalaryController.deleteEmpSalary)


module.exports = router