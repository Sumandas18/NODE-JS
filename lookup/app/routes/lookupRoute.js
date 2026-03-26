const express=require('express');
const lookupController = require('../controllers/lookupController');


const router=express.Router();

// root route to render view with categories and products
router.get('/', lookupController.indexPage);

router.post('/category/create',lookupController.CreateCategory)
router.get('/category',lookupController.getCategory)
router.post('/product/create',lookupController.CreateProduct)
router.get('/product/with/category',lookupController.CreateProductwithCategory)

module.exports = router;