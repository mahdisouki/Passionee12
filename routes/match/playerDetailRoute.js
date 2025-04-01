const express = require('express');
const router = express.Router();
const playerDetailCtrl = require('../../controllers/match/playerDetailCtrl');

/**
 * @swagger
 * tags:
 *   name: PlayerDetail
 *   description: Player detail management
 */

/**
 * @swagger
 * /player-detail:
 *   get:
 *     summary: Get all player details
 *     tags: [PlayerDetail]
 *     responses:
 *       200:
 *         description: List of all player details
 */
router.get('/', playerDetailCtrl.getAllPlayerDetails);

/**
 * @swagger
 * /player-detail:
 *   post:
 *     summary: Create a new player detail
 *     tags: [PlayerDetail]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               id_player:
 *                 type: string
 *               name:
 *                 type: string
 *               position:
 *                 type: string
 *               team:
 *                 type: string
 *               nationality:
 *                 type: string
 *               ...
 *     responses:
 *       200:
 *         description: Player detail created successfully
 */
router.post('/', playerDetailCtrl.createPlayerDetail);

/**
 * @swagger
 * /player-detail/{id_player}:
 *   get:
 *     summary: Get player detail by player ID
 *     tags: [PlayerDetail]
 *     parameters:
 *       - in: path
 *         name: id_player
 *         schema:
 *           type: string
 *         required: true
 *         description: ID of the player (custom id_player field)
 *     responses:
 *       200:
 *         description: Player detail and related blogs
 *       404:
 *         description: Player not found
 */
router.get('/:id_player', playerDetailCtrl.getPlayerDetailById);

/**
 * @swagger
 * /player-detail/{id}:
 *   put:
 *     summary: Update a player detail by ID
 *     tags: [PlayerDetail]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: MongoDB ID of the player detail
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               position:
 *                 type: string
 *               ...
 *     responses:
 *       200:
 *         description: Player detail updated
 */
router.put('/:id', playerDetailCtrl.updatePlayerDetail);

/**
 * @swagger
 * /player-detail/{id}:
 *   delete:
 *     summary: Delete a player detail by ID
 *     tags: [PlayerDetail]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: MongoDB ID of the player detail
 *     responses:
 *       200:
 *         description: Player detail deleted
 */
router.delete('/:id', playerDetailCtrl.deletePlayerDetail);

module.exports = router;
