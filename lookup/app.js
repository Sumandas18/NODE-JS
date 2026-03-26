const express = require('express');
const app = express()
const path = require('path');
const DbConfig = require('./app/config/dbcon')
DbConfig();

// View engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use(express.static(path.join(__dirname, 'public')));
app.use(require('./app/routes/index'))

const port = 4004
app.listen(port, (error) => {
    if (error) {
        console.error('Server failed to start on port', error);
    } else {
        console.log(`Server is running on port: ${port}`);
    }
});