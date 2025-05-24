const express = require('express');
const router = express.Router();
const playerController = require('../../controllers/match/playerCtrl');
const { upload, handleFileUpload, handleFileDeletion } = require('../../middleware/uploadMiddleware');
const { AuthMiddleware } = require('../../shared/authMiddleware');

/**
 * @swagger
 * components:
 *   schemas:
 *     Player:
 *       type: object
 *       required:
 *         - name
 *         - position
 *         - team
 *       properties:
 *         name:
 *           type: string
 *           description: Player's full name
 *         position:
 *           type: string
 *           description: Player's position (e.g., Forward, Midfielder, Defender, Goalkeeper)
 *         team:
 *           type: string
 *           description: Reference to the team ID
 *         logo:
 *           type: string
 *           description: URL to player's photo
 *         selectedBy:
 *           type: string
 *           description: Percentage of teams that selected this player
 */

/**
 * @swagger
 * tags:
 *   name: Players
 *   description: Player management APIs
 */

/**
 * @swagger
 * /players:
 *   post:
 *     summary: Create a new player
 *     tags: [Players]
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
 *               - position
 *               - team
 *             properties:
 *               name:
 *                 type: string
 *                 description: Player's full name
 *               position:
 *                 type: string
 *                 description: Player's position
 *               team:
 *                 type: string
 *                 description: Team ID
 *               logo:
 *                 type: string
 *                 format: binary
 *                 description: Player's photo
 *     responses:
 *       201:
 *         description: Player created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   $ref: '#/components/schemas/Player'
 *                 status:
 *                   type: string
 *                   example: success
 *       500:
 *         description: Server error
 */
router.post('/', upload.single('logo'), handleFileUpload, playerController.createPlayer);

/**
 * @swagger
 * /players:
 *   get:
 *     summary: Get all players
 *     tags: [Players]
 *     parameters:
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search players by name
 *     responses:
 *       200:
 *         description: List of players
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Player'
 *                 status:
 *                   type: string
 *                   example: success
 *       500:
 *         description: Server error
 */
router.get('/', playerController.getAllPlayers);

/**
 * @swagger
 * /players/{id}:
 *   get:
 *     summary: Get a player by ID
 *     tags: [Players]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Player ID
 *     responses:
 *       200:
 *         description: Player details
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   $ref: '#/components/schemas/Player'
 *                 status:
 *                   type: string
 *                   example: success
 *                 playerId:
 *                   type: string
 *       404:
 *         description: Player not found
 *       500:
 *         description: Server error
 */
router.get('/:id', playerController.getPlayerById);

/**
 * @swagger
 * /players/{id}:
 *   put:
 *     summary: Update a player
 *     tags: [Players]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Player ID
 *     requestBody:
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: Player's full name
 *               position:
 *                 type: string
 *                 description: Player's position
 *               team:
 *                 type: string
 *                 description: Team ID
 *               logo:
 *                 type: string
 *                 format: binary
 *                 description: Player's photo
 *     responses:
 *       200:
 *         description: Player updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   $ref: '#/components/schemas/Player'
 *                 status:
 *                   type: string
 *                   example: success
 *       404:
 *         description: Player not found
 *       500:
 *         description: Server error
 */
router.put('/:id', AuthMiddleware, upload.single('logo'), handleFileUpload, playerController.updatePlayer);

/**
 * @swagger
 * /players/{id}:
 *   delete:
 *     summary: Delete a player
 *     tags: [Players]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Player ID
 *     responses:
 *       200:
 *         description: Player deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   $ref: '#/components/schemas/Player'
 *                 status:
 *                   type: string
 *                   example: success
 *       404:
 *         description: Player not found
 *       500:
 *         description: Server error
 */
router.delete('/:id', AuthMiddleware, handleFileDeletion, playerController.deletePlayer);

/**
 * @swagger
 * /players/team/{id}:
 *   get:
 *     summary: Get players by team ID
 *     tags: [Players]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Team ID
 *     responses:
 *       200:
 *         description: List of players in the team
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Player'
 *                 status:
 *                   type: string
 *                   example: success
 *                 teamId:
 *                   type: string
 *       500:
 *         description: Server error
 */
router.get('/team/:id', playerController.getAllPlayersByTeamId);

/**
 * @swagger
 * /players/position/{position}:
 *   get:
 *     summary: Get players by position
 *     tags: [Players]
 *     parameters:
 *       - in: path
 *         name: position
 *         required: true
 *         schema:
 *           type: string
 *         description: Player position
 *     responses:
 *       200:
 *         description: List of players in the given position
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Player'
 *                 status:
 *                   type: string
 *                   example: success
 *                 position:
 *                   type: string
 *       500:
 *         description: Server error
 */
router.get('/position/:position', playerController.getAllPlayersByPosition);

/**
 * @swagger
 * /players/name/{name}:
 *   get:
 *     summary: Get players by name
 *     tags: [Players]
 *     parameters:
 *       - in: path
 *         name: name
 *         required: true
 *         schema:
 *           type: string
 *         description: Player name to search for
 *     responses:
 *       200:
 *         description: List of players matching the name
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Player'
 *                 status:
 *                   type: string
 *                   example: success
 *                 name:
 *                   type: string
 *       404:
 *         description: No players found
 *       500:
 *         description: Server error
 */
router.get('/name/:name', playerController.getAllPlayersByName);

module.exports = router;
