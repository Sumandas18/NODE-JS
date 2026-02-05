
require('dotenv').config();

const express = require('express');
const dataConnection = require('./app/config/dbcon')
const app = express()
const port = 4009;
dataConnection()
app.use(express.json())

const modelApi = require('./app//routes/modelRoute');
app.use('/api/v1',modelApi)


app.listen(port,()=>{
    console.log('server connect',port)
})
