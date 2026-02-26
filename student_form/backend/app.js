const express = require('express')
const path = require('path')
const app = express()
const dataConnection = require('./app/config/dbcon')
const morgan = require('morgan')
const helmet = require('helmet')
const rateLimit = require('./app/utils/limiter')
dataConnection();

app.use(express.json())
app.use(express.urlencoded({extended:true}))

app.use(morgan('dev'))
app.use(helmet())

const studentFormRoute = require('./app/router/studentFormRoute')
app.use('/api/v1', rateLimit , studentFormRoute)   

const port = 4002
app.listen(port,(error)=>{
    if(error){
        console.log('Unable to run the server');
    }else{
        console.log(`Server is running on this port: ${port}`)
    }
})