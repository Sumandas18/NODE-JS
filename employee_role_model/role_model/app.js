const express =  require('express')
const app = express()
const dataConnection = require('./app/config/dbcon')
const cors = require('cors')

dataConnection()

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  }),
);

const employeeRoute = require('./app/routes/employeeRoute')
app.use('/api', employeeRoute)
const salaryRoute = require('./app/routes/empSalaryRoute')
app.use('/api', salaryRoute)



const port = 4003
app.listen(port,(error)=>{
    if(error){
        console.log("Error starting server:", error);
    }else{
        console.log(`Server is running on port ${port}`);
    }
})