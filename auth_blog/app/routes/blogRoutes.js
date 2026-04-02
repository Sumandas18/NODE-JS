const express = require("express");

const authCheck = require("../middleware/authCheck");
const blogController = require("../controllers/blogController");

const router = express.Router();

router.post("/create", authCheck, blogController.createBlogByUser);
router.get("/all", blogController.getAllBlogs);
router.get("/:id", blogController.getBlogById);

module.exports = router;
