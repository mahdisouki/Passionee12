const express = require('express');
const router = express.Router();
const carouselCtrl = require('../../controllers/utils/carouselCtrl');
const { upload, handleFileUpload } = require('../../middleware/uploadMiddleware');
const { AuthMiddleware } = require('../../shared/authMiddleware');

/**
 * @swagger
 * components:
 *   schemas:
 *     CarouselImage:
 *       type: object
 *       required:
 *         - url
 *       properties:
 *         url:
 *           type: string
 *           description: URL of the image
 *         title:
 *           type: string
 *           description: Title or caption for the image
 *         link:
 *           type: string
 *           description: Optional link when image is clicked
 *         order:
 *           type: number
 *           description: Order of the image in the carousel
 *     Carousel:
 *       type: object
 *       required:
 *         - type
 *         - images
 *       properties:
 *         type:
 *           type: string
 *           enum: [home, sponsors]
 *           description: Type of carousel
 *         images:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/CarouselImage'
 *         isActive:
 *           type: boolean
 *           description: Whether the carousel is currently active
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: Creation timestamp
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: Last update timestamp
 */

/**
 * @swagger
 * tags:
 *   name: Carousels
 *   description: Carousel management APIs with AWS S3 image upload support
 */

/**
 * @swagger
 * /carousel:
 *   post:
 *     summary: Create a new carousel with multiple images
 *     tags: [Carousels]
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
 *               - images
 *             properties:
 *               type:
 *                 type: string
 *                 enum: [home, sponsors]
 *                 description: Type of carousel
 *               images:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *                 description: Image files to upload
 *               title_0:
 *                 type: string
 *                 description: Title for first image
 *               link_0:
 *                 type: string
 *                 description: Link for first image
 *               title_1:
 *                 type: string
 *                 description: Title for second image
 *               link_1:
 *                 type: string
 *                 description: Link for second image
 *     responses:
 *       201:
 *         description: Carousel created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   $ref: '#/components/schemas/Carousel'
 *                 status:
 *                   type: string
 *                   example: success
 *                 message:
 *                   type: string
 *                   example: Carousel created successfully
 *       400:
 *         description: Invalid input or carousel type already exists
 *       500:
 *         description: Server error
 */
router.post('/', AuthMiddleware, upload.array('images'), handleFileUpload, carouselCtrl.createCarousel);

/**
 * @swagger
 * /carousel:
 *   get:
 *     summary: Get all carousels
 *     tags: [Carousels]
 *     responses:
 *       200:
 *         description: List of all carousels
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Carousel'
 *                 status:
 *                   type: string
 *                   example: success
 *       500:
 *         description: Server error
 */
router.get('/', carouselCtrl.getAllCarousels);

/**
 * @swagger
 * /carousel/{type}:
 *   get:
 *     summary: Get carousel by type
 *     tags: [Carousels]
 *     parameters:
 *       - in: path
 *         name: type
 *         required: true
 *         schema:
 *           type: string
 *           enum: [home, sponsors]
 *     responses:
 *       200:
 *         description: Carousel details
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   $ref: '#/components/schemas/Carousel'
 *                 status:
 *                   type: string
 *                   example: success
 *       404:
 *         description: Carousel not found
 *       500:
 *         description: Server error
 */
router.get('/:type', carouselCtrl.getCarouselByType);

/**
 * @swagger
 * /carousel/{type}:
 *   put:
 *     summary: Update carousel with new images
 *     tags: [Carousels]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: type
 *         required: true
 *         schema:
 *           type: string
 *           enum: [home, sponsors]
 *     requestBody:
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               images:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *                 description: New image files to upload
 *               title_0:
 *                 type: string
 *                 description: Title for first image
 *               link_0:
 *                 type: string
 *                 description: Link for first image
 *               title_1:
 *                 type: string
 *                 description: Title for second image
 *               link_1:
 *                 type: string
 *                 description: Link for second image
 *               isActive:
 *                 type: boolean
 *                 description: Whether the carousel is active
 *     responses:
 *       200:
 *         description: Carousel updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   $ref: '#/components/schemas/Carousel'
 *                 status:
 *                   type: string
 *                   example: success
 *                 message:
 *                   type: string
 *                   example: Carousel updated successfully
 *       404:
 *         description: Carousel not found
 *       500:
 *         description: Server error
 */
router.put('/:type', AuthMiddleware, upload.array('images'), handleFileUpload, carouselCtrl.updateCarousel);

/**
 * @swagger
 * /carousel/{type}/image:
 *   post:
 *     summary: Add a single image to carousel
 *     tags: [Carousels]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: type
 *         required: true
 *         schema:
 *           type: string
 *           enum: [home, sponsors]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - file
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *                 description: Image file to upload
 *               title:
 *                 type: string
 *                 description: Title for the image
 *               link:
 *                 type: string
 *                 description: Optional link for the image
 *     responses:
 *       200:
 *         description: Image added successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   $ref: '#/components/schemas/Carousel'
 *                 status:
 *                   type: string
 *                   example: success
 *                 message:
 *                   type: string
 *                   example: Image added successfully
 *       404:
 *         description: Carousel not found
 *       500:
 *         description: Server error
 */
router.post('/:type/image', AuthMiddleware, upload.single('file'), handleFileUpload, carouselCtrl.addImage);

/**
 * @swagger
 * /carousel/{type}/image:
 *   delete:
 *     summary: Remove image from carousel
 *     tags: [Carousels]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: type
 *         required: true
 *         schema:
 *           type: string
 *           enum: [home, sponsors]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - imageUrl
 *             properties:
 *               imageUrl:
 *                 type: string
 *                 description: S3 URL of the image to remove
 *     responses:
 *       200:
 *         description: Image removed successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   $ref: '#/components/schemas/Carousel'
 *                 status:
 *                   type: string
 *                   example: success
 *                 message:
 *                   type: string
 *                   example: Image removed successfully
 *       404:
 *         description: Carousel or image not found
 *       500:
 *         description: Server error
 */
router.delete('/:type/image', AuthMiddleware, carouselCtrl.removeImage);

/**
 * @swagger
 * /carousel/{type}/reorder:
 *   post:
 *     summary: Reorder images in carousel
 *     tags: [Carousels]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: type
 *         required: true
 *         schema:
 *           type: string
 *           enum: [home, sponsors]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - imageOrder
 *             properties:
 *               imageOrder:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: Array of S3 image URLs in the desired order
 *     responses:
 *       200:
 *         description: Images reordered successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   $ref: '#/components/schemas/Carousel'
 *                 status:
 *                   type: string
 *                   example: success
 *                 message:
 *                   type: string
 *                   example: Images reordered successfully
 *       404:
 *         description: Carousel not found
 *       500:
 *         description: Server error
 */
router.post('/:type/reorder', AuthMiddleware, carouselCtrl.reorderImages);

/**
 * @swagger
 * /carousel/{type}:
 *   delete:
 *     summary: Delete carousel and all its images from S3
 *     tags: [Carousels]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: type
 *         required: true
 *         schema:
 *           type: string
 *           enum: [home, sponsors]
 *     responses:
 *       200:
 *         description: Carousel and all images deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 message:
 *                   type: string
 *                   example: Carousel deleted successfully
 *       404:
 *         description: Carousel not found
 *       500:
 *         description: Server error
 */
router.delete('/:type', AuthMiddleware, carouselCtrl.deleteCarousel);

module.exports = router; 