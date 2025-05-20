const express = require('express');
const router = express.Router();
const teamCtrl = require('../../controllers/match/teamCtrl');
const { upload, handleFileUpload, handleFileDeletion } = require('../../middleware/uploadMiddleware');
const { AuthMiddleware } = require('../../shared/authMiddleware');

/**
 * @swagger
 * components:
 *   schemas:
 *     Team:
 *       type: object
 *       required:
 *         - name
 *       properties:
 *         name:
 *           type: string
 *           description: Team name
 *         logo:
 *           type: string
 *           description: URL to team's logo
 *         country:
 *           type: string
 *           description: Team's country
 */

/**
 * @swagger
 * tags:
 *   name: Teams
 *   description: Team management APIs
 */

/**
 * @swagger
 * /teams:
 *   post:
 *     summary: Create a new team
 *     tags: [Teams]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *             properties:
 *               name:
 *                 type: string
 *                 description: Team name
 *               logo:
 *                 type: string
 *                 format: binary
 *                 description: Team's logo
 *               country:
 *                 type: string
 *                 description: Team's country
 *     responses:
 *       201:
 *         description: Team created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Team created successfully
 *                 team:
 *                   $ref: '#/components/schemas/Team'
 *       500:
 *         description: Server error
 */
router.post('/', AuthMiddleware, upload.single('logo'), handleFileUpload, teamCtrl.createTeam);

/**
 * @swagger
 * /teams:
 *   get:
 *     summary: Get all teams
 *     tags: [Teams]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 100
 *         description: Number of items per page
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search teams by name
 *     responses:
 *       200:
 *         description: List of teams
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Teams fetched successfully
 *                 teams:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Team'
 *                 meta:
 *                   type: object
 *                   properties:
 *                     currentPage:
 *                       type: integer
 *                     limit:
 *                       type: integer
 *                     total:
 *                       type: integer
 *                     totalPages:
 *                       type: integer
 *       500:
 *         description: Server error
 */
router.get('/', teamCtrl.getAllTeams);

/**
 * @swagger
 * /teams/{id}:
 *   get:
 *     summary: Get a team by ID
 *     tags: [Teams]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Team ID
 *     responses:
 *       200:
 *         description: Team details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Team'
 *       404:
 *         description: Team not found
 *       500:
 *         description: Server error
 */
router.get('/:id', teamCtrl.getTeamById);

/**
 * @swagger
 * /teams/{id}:
 *   put:
 *     summary: Update a team
 *     tags: [Teams]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Team ID
 *     requestBody:
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: Team name
 *               logo:
 *                 type: string
 *                 format: binary
 *                 description: Team's logo
 *               country:
 *                 type: string
 *                 description: Team's country
 *     responses:
 *       200:
 *         description: Team updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   $ref: '#/components/schemas/Team'
 *                 status:
 *                   type: string
 *                   example: success
 *       404:
 *         description: Team not found
 *       500:
 *         description: Server error
 */
router.put('/:id', AuthMiddleware, upload.single('logo'), handleFileUpload, teamCtrl.updateTeam);

/**
 * @swagger
 * /teams/{id}:
 *   delete:
 *     summary: Delete a team
 *     tags: [Teams]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Team ID
 *     responses:
 *       200:
 *         description: Team deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   $ref: '#/components/schemas/Team'
 *                 status:
 *                   type: string
 *                   example: success
 *       404:
 *         description: Team not found
 *       500:
 *         description: Server error
 */
router.delete('/:id', AuthMiddleware, handleFileDeletion, teamCtrl.deleteTeam);

/**
 * @swagger
 * /teams/country/{country}:
 *   get:
 *     summary: Get teams by country
 *     tags: [Teams]
 *     parameters:
 *       - in: path
 *         name: country
 *         required: true
 *         schema:
 *           type: string
 *         description: Country name
 *     responses:
 *       200:
 *         description: List of teams in the country
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Team'
 *                 status:
 *                   type: string
 *                   example: success
 *       500:
 *         description: Server error
 */
router.get('/country/:country', teamCtrl.getTeamsByCountry);

module.exports = router;