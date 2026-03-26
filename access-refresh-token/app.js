require("dotenv").config();

const express = require("express");
const session = require('express-session');
const cookieParser = require('cookie-parser');

const DbConfig = require("./app/config/dbConfig");
const indexRoute = require("./app/routes/indexRoute");


const app = express();

DbConfig();

app.set("view engine", "ejs");
app.set("views", "views");

app.use(session({
    secret: 'keyboardcat',
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: 1000 * 60 * 60 * 2 // 2 hours
    }
}));

app.use(cookieParser());

app.use(express.json());

app.use(express.urlencoded());

app.use(indexRoute);

const port = 4005;
app.listen(port, (err) => {
    if (err) {
        console.log("Server stopped");
    }
    else {
        console.log("Server is running on port", port);
    }
});