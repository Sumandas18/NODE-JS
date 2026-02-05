require('dotenv').config();
const express = require('express');
const dataConnect = require('./app/config/dbcon')
const app = express()
dataConnect()
app.use(express.json())
const studentApi = require('./app/routes/studentRoute')
app.use('/api/v1', studentApi)
const port = 4004;
app.listen(port,()=>{
    console.log('server is running',port);
    
})