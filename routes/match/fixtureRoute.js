const express = require('express');
const router = express.Router();
const fixtureController = require('../../controllers/match/fixtureCtrl');

/**
 * @swagger
 * tags:
 *   name: Fixtures
 *   description: Match fixture management APIs
 */

/**
 * @swagger
 * /fixture:
 *   get:
 *     summary: Get all fixtures with optional filters
 *     tags: [Fixtures]
 *     parameters:
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [played, upcoming, live, postponed]
 *         description: Filter fixtures by status
 *       - in: query
 *         name: round
 *         schema:
 *           type: string
 *         description: Filter fixtures by round name
 *       - in: query
 *         name: teamId
 *         schema:
 *           type: string
 *         description: Filter fixtures by team ID
 *       - in: query
 *         name: dateFrom
 *         schema:
 *           type: string
 *           format: date
 *         description: Filter fixtures from this date
 *       - in: query
 *         name: dateTo
 *         schema:
 *           type: string
 *           format: date
 *         description: Filter fixtures until this date
 *     responses:
 *       200:
 *         description: List of filtered fixtures
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
 *                 filters:
 *                   type: object
 *                   properties:
 *                     status:
 *                       type: string
 *                     round:
 *                       type: string
 *                     teamId:
 *                       type: string
 *                     dateFrom:
 *                       type: string
 *                     dateTo:
 *                       type: string
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
 *     summary: Create a new fixture
 *     tags: [Fixtures]
 */
router.post('/', fixtureController.createFixture);

/**
 * @swagger
 * /fixture/{id}:
 *   get:
 *     summary: Get a fixture by ID
 *     tags: [Fixtures]
 */
router.get('/:id', fixtureController.getFixtureById);

/**
 * @swagger
 * /fixture/{id}:
 *   put:
 *     summary: Update a fixture
 *     tags: [Fixtures]
 */
router.put('/:id', fixtureController.updateFixture);

/**
 * @swagger
 * /fixture/{id}:
 *   delete:
 *     summary: Delete a fixture
 *     tags: [Fixtures]
 */
router.delete('/:id', fixtureController.deleteFixture);

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
