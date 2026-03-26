const mongoose=require('mongoose')
const Schema=mongoose.Schema

const productSchema= Schema({
    productName:{
        type:String,
        require:true
    },
    categoryId:{
        type:Schema.Types.ObjectId,
        ref:"category"  
    },
    productPrice:{
        type:Number,
        require:true
    },
    productSize:{
        type:String,
        require:true
    },
    
})

const ProductModel=mongoose.model("product",productSchema)
module.exports=ProductModel