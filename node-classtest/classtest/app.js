const express = require('express');
const app = express();
const port  = 4005;

const ejs = require('ejs');

app.set('view engine','ejs');
app.set('views','views');

const userRoute = require('./app/routes/useroute');
app.use(userRoute)

app.listen(port,(err)=>{
    if(err){
        console.log(err);
        
    }else{
        console.log("server is runnning", port);
        
    }
})