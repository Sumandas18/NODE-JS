const express = require('express');
const app = express()
const DbConfig = require('./app/config/dbcon')
DbConfig();
app.use(express.json())



app.use(require('./app/routes/index'))  

const port = 4000
app.listen(port,(error)=>{
    if(error){
        console.log('Error in connection');
    }
    else{
        console.log(`Server is running on port ${port}`);
    }

})