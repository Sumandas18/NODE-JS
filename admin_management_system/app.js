
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const dbConnection = require('./app/config/dbCon');

const adminRoutes = require('./app/routes/adminRoute');
const employeeRoutes = require('./app/routes/employeeRoute');

const app = express();

dbConnection();

app.use(express.json());
app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    credentials: true,
  }),
);

app.use('/admin', adminRoutes);
app.use('/employee', employeeRoutes);


const port = 4002
app.listen(port,(error)=>{
    if(error){
        console.log("Error starting server:", error);
    }else{
        console.log(`Server is running on port ${port}`);
    }
})
