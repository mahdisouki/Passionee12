const express = require("express");
const router = express.Router();
const blogCtrl = require("../../controllers/blog/blogCtrl");
const { upload, handleFileUpload, handleFileDeletion } = require('../../middleware/uploadMiddleware');
const { AuthMiddleware } = require('../../shared/authMiddleware');

/**
 * @swagger
 * components:
 *   schemas:
 *     Blog:
 *       type: object
 *       required:
 *         - type
 *         - title
 *         - author
 *         - content
 *       properties:
 *         type:
 *           type: string
 *           description: Type of blog post
 *         title:
 *           type: string
 *           description: Blog post title
 *         author:
 *           type: string
 *           description: Author's name
 *         content:
 *           type: string
 *           description: Blog post content
 *         logo:
 *           type: string
 *           description: URL to blog post image
 *         tags:
 *           type: array
 *           items:
 *             type: string
 *           description: Array of tags
 *         viewsCount:
 *           type: integer
 *           description: Number of views
 *         comments:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               author:
 *                 type: string
 *               comment:
 *                 type: string
 *               date:
 *                 type: string
 *                 format: date-time
 */

/**
 * @swagger
 * tags:
 *   name: Blog
 *   description: Blog management APIs
 */

/**
 * @swagger
 * /blog:
 *   post:
 *     summary: Create a new blog post
 *     tags: [Blog]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - type
 *               - title
 *               - author
 *               - content
 *             properties:
 *               type:
 *                 type: string
 *                 description: Type of blog post
 *               title:
 *                 type: string
 *                 description: Blog post title
 *               author:
 *                 type: string
 *                 description: Author's name
 *               content:
 *                 type: string
 *                 description: Blog post content
 *               logo:
 *                 type: string
 *                 format: binary
 *                 description: Blog post image
 *               tags:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: Array of tags
 *     responses:
 *       201:
 *         description: Blog post created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   $ref: '#/components/schemas/Blog'
 *                 status:
 *                   type: string
 *                   example: success
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /blog:
 *   get:
 *     summary: Get all blog posts
 *     tags: [Blog]
 *     responses:
 *       200:
 *         description: List of blog posts
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Blog'
 *                 status:
 *                   type: string
 *                   example: success
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /blog/{id}:
 *   get:
 *     summary: Get a blog post by ID
 *     tags: [Blog]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Blog post ID
 *     responses:
 *       200:
 *         description: Blog post details
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   $ref: '#/components/schemas/Blog'
 *                 status:
 *                   type: string
 *                   example: success
 *       404:
 *         description: Blog post not found
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /blog/{id}:
 *   put:
 *     summary: Update a blog post
 *     tags: [Blog]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Blog post ID
 *     requestBody:
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               type:
 *                 type: string
 *                 description: Type of blog post
 *               title:
 *                 type: string
 *                 description: Blog post title
 *               author:
 *                 type: string
 *                 description: Author's name
 *               content:
 *                 type: string
 *                 description: Blog post content
 *               logo:
 *                 type: string
 *                 format: binary
 *                 description: Blog post image
 *               tags:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: Array of tags
 *     responses:
 *       200:
 *         description: Blog post updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   $ref: '#/components/schemas/Blog'
 *                 status:
 *                   type: string
 *                   example: success
 *       404:
 *         description: Blog post not found
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /blog/{id}:
 *   delete:
 *     summary: Delete a blog post
 *     tags: [Blog]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Blog post ID
 *     responses:
 *       200:
 *         description: Blog post deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   $ref: '#/components/schemas/Blog'
 *                 status:
 *                   type: string
 *                   example: success
 *       404:
 *         description: Blog post not found
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /blog/{id}/views:
 *   post:
 *     summary: Increment blog post views
 *     tags: [Blog]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Blog post ID
 *     responses:
 *       200:
 *         description: Views incremented successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   $ref: '#/components/schemas/Blog'
 *                 status:
 *                   type: string
 *                   example: success
 *       404:
 *         description: Blog post not found
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /blog/{id}/comments:
 *   post:
 *     summary: Add a comment to a blog post
 *     tags: [Blog]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Blog post ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - author
 *               - comment
 *             properties:
 *               author:
 *                 type: string
 *                 description: Comment author's name
 *               comment:
 *                 type: string
 *                 description: Comment content
 *     responses:
 *       200:
 *         description: Comment added successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   $ref: '#/components/schemas/Blog'
 *                 status:
 *                   type: string
 *                   example: success
 *       404:
 *         description: Blog post not found
 *       500:
 *         description: Server error
 */

// Routes
router.post("/", upload.single('logo'), handleFileUpload, blogCtrl.createBlog);
router.get("/", blogCtrl.getAllBlogs);
router.get("/:id", blogCtrl.getBlogById);
router.put("/:id",  upload.single('logo'), handleFileUpload, blogCtrl.updateBlog);
router.delete("/:id",  handleFileDeletion, blogCtrl.deleteBlog);
router.post("/:id/views", blogCtrl.incrementViews);
router.post("/:id/comments", blogCtrl.addComment);

module.exports = router;
