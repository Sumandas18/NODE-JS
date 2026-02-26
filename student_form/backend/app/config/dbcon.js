

require('dotenv').config();
const mongoose = require('mongoose');

const MongodbUrl = process.env.MONGODB_URL;
const dataConnection = async ()=>{
    try {
        const connection = await mongoose.connect(MongodbUrl);
        if(connection){
            console.log('Database Connected Successfully');
        }else{
            console.log('Database Connection Lost');
        }       
    } catch (error) {
        console.log('Database Connection Error:', error);
    }
}

module.exports = dataConnection;