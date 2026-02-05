
require('dotenv').config;

const mongoose = require('mongoose');
const MongooseUrl = process.env.MONGODB_URL

const dataCon = async()=>{
    try {
        const connection = await mongoose.connect(MongooseUrl)
        if(connection){
            console.log('data connnected');
            
        }else{
            console.log('data error');
            
        }
    } catch (error) {
        console.log(error);
        
        
    }
}

module.exports = dataCon;
