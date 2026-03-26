
require('dotenv').config();

const mongoose = require('mongoose');
const MONGO_URL = process.env.MONGO_URL

const DbConfig = async () => {
    try {
        const response = mongoose.connect(MONGO_URL);

        if (response) {
            console.log('Connection established');
        }
        else {
            console.log('Connection failed');
        }
    }
    catch (err) {
        console.log('Connection failed');
    }
}

module.exports = DbConfig;