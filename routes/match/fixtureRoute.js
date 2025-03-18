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
 * /fixtures:
 *   get:
 *     summary: Get all fixtures
 *     tags: [Fixtures]
 *     responses:
 *       200:
 *         description: List of fixtures
 *       500:
 *         description: Server error
 */
router.get('/', fixtureController.getAllFixtures);

/**
 * @swagger
 * /fixtures/status/{status}:
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
 * /fixtures/round/{roundName}:
 *   get:
 *     summary: Get fixtures by round name
 *     tags: [Fixtures]
 */
router.get('/round/:roundName', fixtureController.getAllFixtureByRoundName);

/**
 * @swagger
 * /fixtures/last-round:
 *   get:
 *     summary: Get the last played round
 *     tags: [Fixtures]
 */
router.get('/last-round', fixtureController.getLastCurrentRound);

/**
 * @swagger
 * /fixtures/next-round:
 *   get:
 *     summary: Get the next match round
 *     tags: [Fixtures]
 */
router.get('/next-round', fixtureController.getNextRound);

/**
 * @swagger
 * /fixtures/team/{id}:
 *   get:
 *     summary: Get fixtures by team ID
 *     tags: [Fixtures]
 */
router.get('/team/:id', fixtureController.getAllFixtureByIdTeam);

/**
 * @swagger
 * /fixtures:
 *   post:
 *     summary: Create a new fixture
 *     tags: [Fixtures]
 */
router.post('/', fixtureController.createFixture);

/**
 * @swagger
 * /fixtures/{id}:
 *   get:
 *     summary: Get a fixture by ID
 *     tags: [Fixtures]
 */
router.get('/:id', fixtureController.getFixtureById);

/**
 * @swagger
 * /fixtures/{id}:
 *   put:
 *     summary: Update a fixture
 *     tags: [Fixtures]
 */
router.put('/:id', fixtureController.updateFixture);

/**
 * @swagger
 * /fixtures/{id}:
 *   delete:
 *     summary: Delete a fixture
 *     tags: [Fixtures]
 */
router.delete('/:id', fixtureController.deleteFixture);

/**
 * @swagger
 * /fixtures/{id}/status:
 *   put:
 *     summary: Update fixture status
 *     tags: [Fixtures]
 */
router.put('/:id/status', fixtureController.updateStatus);

/**
 * @swagger
 * /fixtures/{id}/score:
 *   put:
 *     summary: Update fixture score
 *     tags: [Fixtures]
 */
router.put('/:id/score', fixtureController.updateScore);

/**
 * @swagger
 * /fixtures/modify-id:
 *   put:
 *     summary: Generate and modify fixture IDs
 *     tags: [Fixtures]
 */
router.put('/modify-id', fixtureController.modifid);

/**
 * @swagger
 * /fixtures/nearest-match/{teamId}:
 *   get:
 *     summary: Get the nearest upcoming match for a team
 *     tags: [Fixtures]
 */
router.get('/nearest-match/:teamId', fixtureController.getNearestMatchForTeam);

module.exports = router;
