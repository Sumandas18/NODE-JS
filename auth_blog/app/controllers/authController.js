require("dotenv").config();
const authorModel = require("../model/authModel");
const jwt = require("jsonwebtoken");

class AuthController {
  async registerAuthor(req, res) {
    try {
      const { author_name, author_bio, author_email, author_password } = req.body;
      if (!author_name || !author_email || !author_password || !author_bio) {
        return res.status(400).json({ message: "All fields are required" });
      }

      const exsitingAuthor = await authorModel.findOne({ author_email });
      if (exsitingAuthor) {
        return res.status(400).json({ message: "Author already exists" });
      }

      const author = await authorModel.create({
        author_name,
        author_bio,
        
        author_email,
        author_password,
      });

      if (author) {
        res
          .status(201)
          .json({ message: "Author registered successfully", author });
      }
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  async loginAuthor(req, res) {
    try {
      const { author_email, author_password } = req.body;
      if (!author_email || !author_password) {
        return res.status(400).json({ message: "All fields are required" });
      }
      const author = await authorModel.findOne({ author_email });
      if (!author) {
        return res.status(400).json({ message: "Author not found" });
      }

      if (author.author_password !== author_password) {
        return res.status(400).json({ message: "Invalid credentials" });
      }

      const token = jwt.sign(
        {
          author_id: author._id,
          author_email: author.author_email,
          author_name: author.author_name,
          author_bio: author.author_bio,
        },
        process.env.JWT_SECRET,
        {
          expiresIn: process.env.JWT_EXPIRES_IN,
        },
      );

      if (token) {
        res.status(200).json({
          message: "Login successful",
          token: token,
          data: {
            author_id: author._id,
            author_email: author.author_email,
            author_name: author.author_name,
            author_bio: author.author_bio,
          },
        });
      }
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
}

const authController = new AuthController();
module.exports = authController;
