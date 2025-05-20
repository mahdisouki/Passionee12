const BlogModel = require("../../models/utils/blogModels");
const cloudinary = require('../../helper/cloudinaryConfig');

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
      const blogData = { ...req.body };
      
      // If a file was uploaded, use the Cloudinary URL
      if (req.file) {
        blogData.logo = req.file.url;
      }

      const blog = await BlogModel.create(blogData);
      res.json({ data: blog, status: "success" });
    } catch (err) {
      console.error('Error creating blog:', err);
      res.status(500).json({ error: err.message });
    }
  },

 
  updateBlog: async (req, res) => {
    try {
      const blogData = { ...req.body };
      
      // If a new file was uploaded
      if (req.file) {
        // Delete old image from Cloudinary if exists
        const oldBlog = await BlogModel.findById(req.params.id);
        if (oldBlog && oldBlog.logo) {
          try {
            const publicId = oldBlog.logo.split('/').pop().split('.')[0];
            await cloudinary.uploader.destroy(publicId);
          } catch (err) {
            console.error('Error deleting old blog logo from Cloudinary:', err);
          }
        }
        
        // Set new image URL
        blogData.logo = req.file.url;
      }

      const blog = await BlogModel.findByIdAndUpdate(req.params.id, blogData, { new: true });
      if (!blog) {
        return res.status(404).json({ error: "Blog not found" });
      }
      
      res.json({ data: blog, status: "success" });
    } catch (err) {
      console.error('Error updating blog:', err);
      res.status(500).json({ error: err.message });
    }
  },

  
  deleteBlog: async (req, res) => {
    try {
      const blog = await BlogModel.findByIdAndDelete(req.params.id);
      if (!blog) {
        return res.status(404).json({ error: "Blog not found" });
      }

      // Delete blog logo from Cloudinary if exists
      if (blog.logo) {
        try {
          const publicId = blog.logo.split('/').pop().split('.')[0];
          await cloudinary.uploader.destroy(publicId);
        } catch (err) {
          console.error("Error deleting blog logo from Cloudinary:", err);
        }
      }

      res.json({ data: blog, status: "success" });
    } catch (err) {
      console.error('Error deleting blog:', err);
      res.status(500).json({ error: err.message });
    }
  },

  // Add comment to blog
  addComment: async (req, res) => {
    try {
      const { author, comment } = req.body;
      const blog = await BlogModel.findById(req.params.id);
      
      if (!blog) {
        return res.status(404).json({ error: "Blog not found" });
      }

      blog.comments.push({
        author,
        comment,
        date: new Date()
      });

      await blog.save();
      res.json({ data: blog, status: "success" });
    } catch (err) {
      console.error('Error adding comment:', err);
      res.status(500).json({ error: err.message });
    }
  },

  // Increment blog views
  incrementViews: async (req, res) => {
    try {
      const blog = await BlogModel.findById(req.params.id);
      
      if (!blog) {
        return res.status(404).json({ error: "Blog not found" });
      }

      blog.viewsCount = (blog.viewsCount || 0) + 1;
      await blog.save();
      
      res.json({ data: blog, status: "success" });
    } catch (err) {
      console.error('Error incrementing views:', err);
      res.status(500).json({ error: err.message });
    }
  }
};

module.exports = blogCtrl;
