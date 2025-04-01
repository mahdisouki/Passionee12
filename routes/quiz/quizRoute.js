const express = require('express');
const router = express.Router();
const quizCtrl = require('../../controllers/quiz/quizCtrl');

router.post('/', quizCtrl.addQuiz);
router.get('/', quizCtrl.getAllQuizzes);
router.get('/:id', quizCtrl.getQuizById);
router.put('/:id', quizCtrl.addQuestionToQuiz);
router.delete('/:id/:idqs', quizCtrl.deleteQuestionOrQuiz);

module.exports = router;
