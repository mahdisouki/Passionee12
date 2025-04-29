// routes/game.routes.js
const express = require('express');
const router = express.Router();
const gameCtrl = require('../../controllers/sidebar/sidebarCtrl'); // Import the game controller

// About section routes
router.get('/about', gameCtrl.getAbout);  // Get the "About" section
router.put('/about', gameCtrl.updateAbout); // Update the "About" section

// Condition section routes
router.get('/condition', gameCtrl.getCondition);  // Get the "Condition" section
router.put('/condition', gameCtrl.updateCondition); // Update the "Condition" section

// GameRule section routes
router.get('/gameRule', gameCtrl.getGameRule);  // Get the "Game Rule" section
router.put('/gameRule', gameCtrl.updateGameRule); // Update the "Game Rule" section

module.exports = router;
