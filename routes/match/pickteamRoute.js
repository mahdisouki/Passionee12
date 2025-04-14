const express = require("express");
const pickteamCtrl = require("../../controllers/match/pickteamCtrl");

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Pickteam
 *   description: Pickteam management endpoints
 */

/**
 * @swagger
 * /pickteam:
 *   post:
 *     summary: Create a new pickteam
 *     tags: [Pickteam]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       201:
 *         description: Pickteam created successfully
 */
router.post("/", pickteamCtrl.createPickteam);

/**
 * @swagger
 * /pickteam:
 *   get:
 *     summary: Get all pickteams
 *     tags: [Pickteam]
 *     responses:
 *       200:
 *         description: Pickteams fetched successfully
 */
router.get("/", pickteamCtrl.getAllPickteams);

/**
 * @swagger
 * /pickteam/{userId}/{round}:
 *   get:
 *     summary: Get pickteam by userId and round
 *     tags: [Pickteam]
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *       - in: path
 *         name: round
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Pickteam fetched successfully
 */
router.get("/:userId/:round", pickteamCtrl.getPickteamByIdAndRound);

/**
 * @swagger
 * /pickteam/{userId}:
 *   delete:
 *     summary: Delete a pickteam by userId
 *     tags: [Pickteam]
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Pickteam deleted successfully
 */
router.delete("/:userId", pickteamCtrl.deletePickteamById);

/**
 * @swagger
 * /pickteam/transfer/{userId}:
 *   put:
 *     summary: Transfer a player
 *     tags: [Pickteam]
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               playerToBeTransfert:
 *                 type: string
 *               newPlayerId:
 *                 type: string
 *     responses:
 *       200:
 *         description: Player transferred successfully
 */
router.put("/transfer/:userId", pickteamCtrl.transferPlayer);
router.put('/swap/:userId' , pickteamCtrl.swapPlayersWithinPickteam)
/**
 * @swagger
 * /pickteam/captain/{userId}:
 *   put:
 *     summary: Make a player captain
 *     tags: [Pickteam]
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               playerId:
 *                 type: string
 *               round:
 *                 type: string
 *     responses:
 *       200:
 *         description: Captain updated successfully
 */
router.put("/captain/:userId", pickteamCtrl.makeCaptain);

/**
 * @swagger
 * /pickteam/vice-captain/{userId}:
 *   put:
 *     summary: Make a player vice-captain
 *     tags: [Pickteam]
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               playerId:
 *                 type: string
 *               round:
 *                 type: string
 *     responses:
 *       200:
 *         description: Vice-captain updated successfully
 */
router.put("/vice-captain/:userId", pickteamCtrl.makeViceCaptain);

module.exports = router;
