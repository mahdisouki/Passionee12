const BlogModel = require("../../models/utils/blogModels");
const { deleteObject } = require('../../config/aws.config');

const blogCtrl = {
  
  getAllBlogs: async (req, res) => {
    try {
      const blogs = await BlogModel.find().sort({ date: -1 });
      res.json({ data: blogs, status: "success" });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  
  getBlogById: async (req, res) => {
    try {
      const blog = await BlogModel.findById(req.params.id);
      res.json({ data: blog, status: "success" });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

 
  createBlog: async (req, res) => {
    try {
      const blog = await BlogModel.create(req.body);
      res.json({ data: blog, status: "success" });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

 
  updateBlog: async (req, res) => {
    try {
      const blog = await BlogModel.findByIdAndUpdate(req.params.id, req.body, { new: true });
      res.json({ data: blog, status: "success" });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  
  deleteBlog: async (req, res) => {
    try {
      const blog = await BlogModel.findByIdAndDelete(req.params.id);
      if (!blog) {
        return res.status(404).json({ error: "Blog not found" });
      }

      // Delete blog logo from S3 if exists
      if (blog.logo) {
        try {
          await deleteObject(blog.logo);
        } catch (err) {
          console.error("Error deleting blog logo from S3:", err);
        }
      }

      res.json({ data: blog, status: "success" });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },


  incrementViews: async (req, res) => {
    try {
      const blog = await BlogModel.findById(req.params.id);
      if (!blog) return res.status(404).json({ error: "Blog not found" });
      blog.viewsCount += 1;
      await blog.save();
      res.json({ data: blog, status: "success" });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  addComment: async (req, res) => {
    try {
      const { author, comment } = req.body;
      const blog = await BlogModel.findById(req.params.id);
      if (!blog) return res.status(404).json({ error: "Blog not found" });
      blog.comments.push({ author, comment });
      await blog.save();
      res.json({ data: blog, status: "success" });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
};

module.exports = blogCtrl;
