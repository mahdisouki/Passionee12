const express = require('express');
const router = express.Router();

const matchEventCtrl  = require('../../controllers/match/matchEventController');


// Create a goal event
router.post('/createGoal', matchEventCtrl.createGoalEvent);

// Create a penalty save event
router.post('/createPenaltySave', matchEventCtrl.createPenaltySaveEvent);

// Create a red card event
router.post('/createRedCard', matchEventCtrl.createRedCardEvent);

// Create an own goal event
router.post('/createOwnGoal', matchEventCtrl.createOwnGoalEvent);

// Create a substitution event
router.post('/createSubstitution', matchEventCtrl.createSubstitutionEvent);

// Get all match events
router.get('/', matchEventCtrl.getAllMatchEvents);

// Get a match event by its ID
router.get('/:id', matchEventCtrl.getMatchEventById);

// Get all match events by match ID
router.get('/match/:matchId', matchEventCtrl.getMatchEventsByMatchId);

// Update a match event
router.put('/:id', matchEventCtrl.updateMatchEvent);

// Delete a match event
router.delete('/:id', matchEventCtrl.deleteMatchEvent);

module.exports = router;