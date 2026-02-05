require('dotenv').config();
const mongoose = require('mongoose');

const MongodbUrl = process.env.MONGODB_URL;

const dataConnect = async () => {
    try {
        const connect = await mongoose.connect(MongodbUrl)
        if(connect){
            console.log('database connected');
            
        }else{
            console.log('database not connected');
            
        }
    } catch (error) {
        console.log(error);
        
        
    }
}

module.exports = dataConnect