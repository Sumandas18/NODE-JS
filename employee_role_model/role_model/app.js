const express =  require('express')
const app = express()
const dataConnection = require('./app/config/dbcon')

dataConnection()

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const employeeRoute = require('./app/routes/employeeRoute')
app.use('/api/v1', employeeRoute)
const salaryRoute = require('./app/routes/empSalaryRoute')
app.use('/api/v1', salaryRoute)



const port = 4003
app.listen(port,(error)=>{
    if(error){
        console.log("Error starting server:", error);
    }else{
        console.log(`Server is running on port ${port}`);
    }
})