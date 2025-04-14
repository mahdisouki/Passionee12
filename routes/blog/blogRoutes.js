const express = require("express");
const router = express.Router();
const blogCtrl = require("../../controllers/blog/blogCtrl");

// GET all blogs
router.get("/", blogCtrl.getAllBlogs);

// GET blog by ID
router.get("/:id", blogCtrl.getBlogById);

// POST create new blog
router.post("/", blogCtrl.createBlog);

// PUT update blog
router.put("/:id", blogCtrl.updateBlog);

// DELETE blog
router.delete("/:id", blogCtrl.deleteBlog);

// POST increment blog views
router.post("/:id/views", blogCtrl.incrementViews);

// POST add a comment
router.post("/:id/comments", blogCtrl.addComment);

module.exports = router;
