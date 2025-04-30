const express = require('express');
const router = express.Router();
const standingController = require('../../controllers/match/standingCtrl');

// Get all standings
router.get('/', standingController.getAllStandings);

// Get standings by group
router.get('/group/:group', standingController.getAllStandingByIdGroup);

// Create a standing
router.post('/', standingController.createStanding);

// Get a standing by ID
router.get('/:id', standingController.getStandingById);

// Update a standing
router.put('/:id', standingController.updateStanding);

// Delete a standing
router.delete('/:id', standingController.deleteStanding);

module.exports = router;
