const UserAnswer = require('../../models/quiz/QuizUserAnswers.model');
const Quiz = require('../../models/quiz/Quiz.model');

const quizUserAnswerCtrl = {
  submitAnswer: async (req, res) => {
    const { userId, quizId, questionId, selectedOption, isCorrect } = req.body;

    try {
      const quiz = await Quiz.findById(quizId);
      if (!quiz) {
        return res.status(404).json({ message: 'Quiz not found' });
      }

      const existingAnswer = await UserAnswer.findOne({ questionId, userId });
      if (existingAnswer) {
        return res.status(200).json({
          message: 'Answer already exists for this user and question',
          correct: existingAnswer.isCorrect,
          answer: existingAnswer,
        });
      }

      const newAnswer = new UserAnswer({
        userId,
        questionId,
        selectedOption,
        isCorrect,
      });

      await newAnswer.save();

      res.status(201).json({
        message: 'Answer submitted successfully',
        correct: isCorrect,
        answer: newAnswer,
      });
    } catch (error) {
      res.status(500).json({ message: 'Error submitting answer', error: error.message });
    }
  },

  getUserAnswers: async (req, res) => {
    const { userId } = req.params;

    try {
      const answers = await UserAnswer.find({ userId }).populate('questionId');
      res.status(200).json({
        message: 'User answers fetched successfully',
        answers,
      });
    } catch (error) {
      res.status(500).json({ message: 'Error fetching answers', error: error.message });
    }
  },
};

module.exports = quizUserAnswerCtrl;
