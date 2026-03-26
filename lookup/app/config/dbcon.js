
require('dotenv').config();

const mongoose = require('mongoose');
const MONGO_URL = process.env.MONGO_URL

const dbConfig = async()=>{
    try {
        const connect = await mongoose.connect(MONGO_URL);
        if(connect){
            console.log('Connection established');
        }
        else{
            console.log('Connection failed');
        }
    } catch (error) {
        console.error('Error connecting to MongoDB:', error);
    }
}

module.exports = dbConfig;