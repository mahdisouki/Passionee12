const express = require('express');
const router = express.Router();
const quizUserAnswerCtrl = require('../../controllers/quiz/quizUserAswerCtrl');

router.post('/submit', quizUserAnswerCtrl.submitAnswer);
router.get('/user/:userId', quizUserAnswerCtrl.getUserAnswers);

module.exports = router;
