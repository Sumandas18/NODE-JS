const mongoose = require("mongoose");
const blogModel = require("../model/blogModel");

class BlogController {
  async createBlogByUser(req, res) {
    try {
      const { blog_title, blog_content, blog_image } = req.body;
      if (!blog_title || !blog_content) {
        return res.status(400).json({ message: "All fields are required" });
      }

      if (!req.user || !req.user.author_id) {
        return res.status(401).json({ message: "Unauthorized user" });
      }

      const blog = await blogModel.create({
        blog_title,
        blog_content,
        blog_image,
        author_id: req.user.author_id,
      });

      const populatedBlog = await blog.populate(
        "author_id",
        "author_name author_email author_bio",
      );

      return res.status(201).json({
        message: "Blog created successfully",
        blog: {
          _id: blog._id,
          blog_title: blog.blog_title,
          blog_content: blog.blog_content,
          blog_image: blog.blog_image,
          createdBy: populatedBlog.author_id,
          createdAt: blog.createdAt,
          updatedAt: blog.updatedAt,
        },
      });
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  }

  async getAllBlogs(req, res) {
    try {
      const blogs = await blogModel.aggregate([
        {
          $lookup: {
            from: "authors",
            localField: "author_id",
            foreignField: "_id",
            as: "author",
          },
        },
        { $unwind: "$author" },
        {
          $project: {
            blog_title: 1,
            blog_content: 1,
            blog_image: 1,
            createdAt: 1,
            updatedAt: 1,
            createdBy: {
              author_name: "$author.author_name",
              author_email: "$author.author_email",
              author_bio: "$author.author_bio",
            },
          },
        },
      ]);

      return res.status(200).json({
        message: "Blogs fetched successfully",
        blogs,
      });
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  }

  async getBlogById(req, res) {
    try {
      const objectId = mongoose.Types.ObjectId;
      const blogId = objectId.isValid(req.params.id) ? new objectId(req.params.id): null;

      if (!blogId) {
        return res.status(400).json({ message: "Invalid blog id" });
      }

      const [blog] = await blogModel.aggregate([
        { $match: { _id: blogId } },
        {
          $lookup: {
            from: "authors",
            localField: "author_id",
            foreignField: "_id",
            as: "author",
          },
        },
        { $unwind: "$author" },
        {
          $project: {
            blog_title: 1,
            blog_content: 1,
            blog_image: 1,
            createdAt: 1,
            updatedAt: 1,
            createdBy: {
              author_name: "$author.author_name",
              author_email: "$author.author_email",
              author_bio: "$author.author_bio",
            },
          },
        },
      ]);

      if (!blog) {
        return res.status(404).json({ message: "Blog not found" });
      }

      return res.status(200).json({
        message: "Blog fetched successfully",
        blog,
      });
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  }
}

module.exports = new BlogController();
