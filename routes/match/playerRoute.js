const express = require('express');
const router = express.Router();
const playerController = require('../../controllers/match/playerCtrl');


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
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: Lionel Messi
 *               age:
 *                 type: integer
 *                 example: 36
 *               team:
 *                 type: string
 *                 example: "65bfbf9098234a001a7e2b99"
 *               position:
 *                 type: string
 *                 example: "Forward"
 *     responses:
 *       201:
 *         description: Player created successfully
 *       500:
 *         description: Server error
 */
router.post('/', playerController.createPlayer);

/**
 * @swagger
 * /players:
 *   get:
 *     summary: Get all players
 *     tags: [Players]
 *     responses:
 *       200:
 *         description: List of players
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
 *         example: "65bfbf9098234a001a7e2b99"
 *     responses:
 *       200:
 *         description: Player details
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
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         example: "65bfbf9098234a001a7e2b99"
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: Cristiano Ronaldo
 *               age:
 *                 type: integer
 *                 example: 39
 *     responses:
 *       200:
 *         description: Player updated successfully
 *       404:
 *         description: Player not found
 *       500:
 *         description: Server error
 */
router.put('/:id', playerController.updatePlayer);

/**
 * @swagger
 * /players/{id}:
 *   delete:
 *     summary: Delete a player
 *     tags: [Players]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         example: "65bfbf9098234a001a7e2b99"
 *     responses:
 *       200:
 *         description: Player deleted successfully
 *       404:
 *         description: Player not found
 *       500:
 *         description: Server error
 */
router.delete('/:id', playerController.deletePlayer);

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
 *         example: "65bfbf9098234a001a7e2b99"
 *     responses:
 *       200:
 *         description: List of players in the team
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
 *         example: "Midfielder"
 *     responses:
 *       200:
 *         description: List of players in the given position
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
 *         example: "Messi"
 *     responses:
 *       200:
 *         description: List of players matching the name
 *       500:
 *         description: Server error
 */
router.get('/name/:name', playerController.getAllPlayersByName);

module.exports = router;
