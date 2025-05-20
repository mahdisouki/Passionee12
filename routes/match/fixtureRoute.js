const express = require('express');
const router = express.Router();
const fixtureController = require('../../controllers/match/fixtureCtrl');
const { AuthMiddleware } = require('../../shared/authMiddleware');

/**
 * @swagger
 * components:
 *   schemas:
 *     Fixture:
 *       type: object
 *       required:
 *         - homeTeam
 *         - awayTeam
 *         - date
 *         - status
 *       properties:
 *         _id:
 *           type: string
 *           description: The fixture ID
 *         homeTeam:
 *           type: string
 *           description: ID of the home team
 *         awayTeam:
 *           type: string
 *           description: ID of the away team
 *         date:
 *           type: string
 *           format: date-time
 *           description: Date and time of the fixture
 *         status:
 *           type: string
 *           enum: [scheduled, live, completed, postponed]
 *           description: Current status of the fixture
 *         score:
 *           type: object
 *           properties:
 *             home:
 *               type: number
 *               description: Home team score
 *             away:
 *               type: number
 *               description: Away team score
 *         round:
 *           type: string
 *           description: Round or stage of the competition
 *         venue:
 *           type: string
 *           description: Stadium or venue name
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
 *   name: Fixtures
 *   description: Fixture management APIs
 */

/**
 * @swagger
 * /fixture:
 *   get:
 *     summary: Get all fixtures
 *     tags: [Fixtures]
 *     parameters:
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [scheduled, live, completed, postponed]
 *         description: Filter fixtures by status
 *       - in: query
 *         name: round
 *         schema:
 *           type: string
 *         description: Filter fixtures by round
 *       - in: query
 *         name: teamId
 *         schema:
 *           type: string
 *         description: Filter fixtures by team ID
 *       - in: query
 *         name: startDate
 *         schema:
 *           type: string
 *           format: date
 *         description: Filter fixtures from this date
 *       - in: query
 *         name: endDate
 *         schema:
 *           type: string
 *           format: date
 *         description: Filter fixtures until this date
 *     responses:
 *       200:
 *         description: List of fixtures
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Fixture'
 *                 status:
 *                   type: string
 *                   example: success
 *       500:
 *         description: Server error
 */
router.get('/', fixtureController.getAllFixtures);

/**
 * @swagger
 * /fixture/status/{status}:
 *   get:
 *     summary: Get fixtures by match status
 *     tags: [Fixtures]
 *     parameters:
 *       - in: path
 *         name: status
 *         required: true
 *         schema:
 *           type: string
 *         example: "Finished"
 *     responses:
 *       200:
 *         description: List of fixtures by status
 *       500:
 *         description: Server error
 */
router.get('/status/:status', fixtureController.getAllFixtureByStatusShort);

/**
 * @swagger
 * /fixture/round/{roundName}:
 *   get:
 *     summary: Get fixtures by round name
 *     tags: [Fixtures]
 */
router.get('/round/:roundName', fixtureController.getAllFixtureByRoundName);

/**
 * @swagger
 * /fixture/last-round:
 *   get:
 *     summary: Get the last played round
 *     tags: [Fixtures]
 */
router.get('/last-round', fixtureController.getLastCurrentRound);

/**
 * @swagger
 * /fixture/next-round:
 *   get:
 *     summary: Get the next match round
 *     tags: [Fixtures]
 */
router.get('/next-round', fixtureController.getNextRound);

/**
 * @swagger
 * /fixture/team/{id}:
 *   get:
 *     summary: Get fixtures by team ID
 *     tags: [Fixtures]
 */
router.get('/team/:id', fixtureController.getAllFixtureByIdTeam);

/**
 * @swagger
 * /fixture:
 *   post:
 *     summary: Create new fixture
 *     tags: [Fixtures]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - homeTeam
 *               - awayTeam
 *               - date
 *             properties:
 *               homeTeam:
 *                 type: string
 *               awayTeam:
 *                 type: string
 *               date:
 *                 type: string
 *                 format: date-time
 *               round:
 *                 type: string
 *               venue:
 *                 type: string
 *     responses:
 *       201:
 *         description: Fixture created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   $ref: '#/components/schemas/Fixture'
 *                 status:
 *                   type: string
 *                   example: success
 *       400:
 *         description: Invalid input
 *       500:
 *         description: Server error
 */
router.post('/', AuthMiddleware, fixtureController.createFixture);

/**
 * @swagger
 * /fixture/{id}:
 *   get:
 *     summary: Get fixture by ID
 *     tags: [Fixtures]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Fixture details
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   $ref: '#/components/schemas/Fixture'
 *                 status:
 *                   type: string
 *                   example: success
 *       404:
 *         description: Fixture not found
 *       500:
 *         description: Server error
 */
router.get('/:id', fixtureController.getFixtureById);

/**
 * @swagger
 * /fixture/{id}:
 *   put:
 *     summary: Update fixture
 *     tags: [Fixtures]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               date:
 *                 type: string
 *                 format: date-time
 *               status:
 *                 type: string
 *                 enum: [scheduled, live, completed, postponed]
 *               score:
 *                 type: object
 *                 properties:
 *                   home:
 *                     type: number
 *                   away:
 *                     type: number
 *               round:
 *                 type: string
 *               venue:
 *                 type: string
 *     responses:
 *       200:
 *         description: Fixture updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   $ref: '#/components/schemas/Fixture'
 *                 status:
 *                   type: string
 *                   example: success
 *       404:
 *         description: Fixture not found
 *       500:
 *         description: Server error
 */
router.put('/:id', AuthMiddleware, fixtureController.updateFixture);

/**
 * @swagger
 * /fixture/{id}:
 *   delete:
 *     summary: Delete fixture
 *     tags: [Fixtures]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Fixture deleted successfully
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
 *                   example: Fixture deleted successfully
 *       404:
 *         description: Fixture not found
 *       500:
 *         description: Server error
 */
router.delete('/:id', AuthMiddleware, fixtureController.deleteFixture);

/**
 * @swagger
 * /fixture/{id}/status:
 *   put:
 *     summary: Update fixture status
 *     tags: [Fixtures]
 */
router.put('/:id/status', fixtureController.updateStatus);

/**
 * @swagger
 * /fixture/{id}/score:
 *   put:
 *     summary: Update fixture score
 *     tags: [Fixtures]
 */
router.put('/:id/score', fixtureController.updateScore);

/**
 * @swagger
 * /fixture/modify-id:
 *   put:
 *     summary: Generate and modify fixture IDs
 *     tags: [Fixtures]
 */
router.put('/modify-id', fixtureController.modifid);

/**
 * @swagger
 * /fixture/nearest-match/{teamId}:
 *   get:
 *     summary: Get the nearest upcoming match for a team
 *     tags: [Fixtures]
 */
router.get('/nearest-match/:teamId', fixtureController.getNearestMatchForTeam);

module.exports = router;
