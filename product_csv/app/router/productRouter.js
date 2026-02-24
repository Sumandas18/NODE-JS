const express=require('express');

const router=express.Router();
const bodyparser=require('body-parser');

router.use(bodyparser.json());
router.use(bodyparser.urlencoded({extended:true}));

const multer=require('multer');
const path=require('path');
const productController = require('../controller/productController');





const storage=multer.diskStorage({
    destination:function(req,file,cb){
        cb(null,path.join(__dirname,'../../public/productCsvFile'),function(error,success){
            if(error) throw error;
        })
    },
    filename:function(req,file,cb){
        cb(null,file.originalname)
    }
})

const upload=multer({storage:storage});



router.post('/create/product',upload.single('file'),productController.createData)
router.get('/product',productController.getData)
router.get('/product/:id',productController.findData)
router.get('/search/product',productController.searchData)
router.get('/category/product',productController.categoryData)
router.get('/price/product',productController.priceData)
router.delete('/delete/product/:id',productController.deleteData)
router.get('/export/product',productController.generatePDF)


module.exports=router;