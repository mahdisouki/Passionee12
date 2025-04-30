const express = require('express');
const router = express.Router();
const classementCtrl = require('../../controllers/classement/classementCtrl');

// Get all classements
router.get('/', classementCtrl.getAllClassements);

// Get all classements by group ID
router.get('/group/:group', classementCtrl.getAllClassementByIdGroup);

// Create a new classement
router.post('/', classementCtrl.createClassement);

// Get a classement by ID
router.get('/:id', classementCtrl.getClassementById);

// Update a classement
router.put('/:id', classementCtrl.updateClassement);

// Delete a classement
router.delete('/:id', classementCtrl.deleteClassement);

// Initialize standings for groups A and B
router.post('/initialize', classementCtrl.initializeStanding);

module.exports = router;
