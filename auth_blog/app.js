const express = require("express");
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const dbConfig = require("./app/config/dbcon");
dbConfig();

const authorRoutes = require("./app/routes/authRoutes");
const blogRoutes = require("./app/routes/blogRoutes");

app.use("/authors", authorRoutes);
app.use("/blogs", blogRoutes);

const port = 4002;
app.listen(port, (err) => {
  if (err) {
    console.error(`Error starting server: ${err}`);
  } else {
    console.log(`Server is running on port ${port}`);
  }
});
