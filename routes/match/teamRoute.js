const express = require('express');
const router = express.Router();
const teamController = require('../../controllers/match/teamCtrl');

/**
 * @swagger
 * tags:
 *   name: Teams
 *   description: APIs for managing teams
 */

/**
 * @swagger
 * /team:
 *   post:
 *     summary: Create a new team
 *     tags: [Teams]
 */
router.post('/', teamController.createTeam);

/**
 * @swagger
 * /team:
 *   get:
 *     summary: Get all teams
 *     tags: [Teams]
 */
router.get('/', teamController.getAllTeams);

/**
 * @swagger
 * /team/{id}:
 *   get:
 *     summary: Get a team by ID
 *     tags: [Teams]
 */
router.get('/:id', teamController.getTeamById);

/**
 * @swagger
 * /team/{id}:
 *   put:
 *     summary: Update a team
 *     tags: [Teams]
 */
router.put('/:id', teamController.updateTeam);

/**
 * @swagger
 * /team/{id}:
 *   delete:
 *     summary: Delete a team
 *     tags: [Teams]
 */
router.delete('/:id', teamController.deleteTeam);

/**
 * @swagger
 * /team/country/{country}:
 *   get:
 *     summary: Get teams by country
 *     tags: [Teams]
 */
router.get('/country/:country', teamController.getTeamsByCountry);

module.exports = router;