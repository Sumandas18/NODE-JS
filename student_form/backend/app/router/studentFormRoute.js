const express = require('express');
const studentFromController = require('../controllers/studentFromController');
const router = express.Router();



router.get('/students', studentFromController.index);
router.post('/students', studentFromController.create);
router.get('/students/view/:id', studentFromController.findById);
// router.post('/students/update/:id', studentFromController.update);
// router.get('/students/delete/:id', studentFromController.delete);
// router.get('/students/pdf', studentFromController.exportPDF);

module.exports = router;