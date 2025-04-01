const Quiz = require('../../models/utils/quizModels');
const { deleteObject } = require('../../shared/s3');

const quizCtrl = {
  // Create a new quiz
  addQuiz: async (req, res) => {
    try {
      const newQuiz = new Quiz(req.body);
      await newQuiz.save();
      res.status(201).json({ message: 'Quiz created successfully', quiz: newQuiz });
    } catch (error) {
      res.status(500).json({ message: 'Error creating quiz', error: error.message });
    }
  },

  // Get all quizzes with optional search & pagination
  getAllQuizzes: async (req, res) => {
    try {
      const { page = '1', limit = '10', search = '' } = req.query;
      const pageNum = parseInt(page, 10);
      const limitNum = parseInt(limit, 10);

      let query = Quiz.find();
      if (search) {
        query = query.find({ title: { $regex: search, $options: 'i' } });
      }

      const total = await Quiz.countDocuments(query);
      const quizzes = await query.skip((pageNum - 1) * limitNum).limit(limitNum).exec();

      res.status(200).json({
        message: 'Quizzes fetched successfully',
        quizzes,
        meta: {
          currentPage: pageNum,
          limit: limitNum,
          total,
          totalPages: Math.ceil(total / limitNum),
        },
      });
    } catch (error) {
      res.status(500).json({ message: 'Error fetching quizzes', error: error.message });
    }
  },

  // Get a quiz by ID
  getQuizById: async (req, res) => {
    const { id } = req.params;
    try {
      const quiz = await Quiz.findById(id);
      if (!quiz) return res.status(404).json({ message: 'Quiz not found' });
      res.status(200).json(quiz);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching quiz', error: error.message });
    }
  },

  // Add a question to an existing quiz
  addQuestionToQuiz: async (req, res) => {
    const { id } = req.params;
    try {
      const updatedQuiz = await Quiz.findByIdAndUpdate(
        id,
        { $push: { questions: req.body } },
        { new: true }
      );
      if (!updatedQuiz) return res.status(404).json({ message: 'Quiz not found' });

      res.status(200).json({ message: 'Question added successfully', quiz: updatedQuiz });
    } catch (error) {
      res.status(500).json({ message: 'Error adding question', error: error.message });
    }
  },

  // Delete a question from quiz or delete entire quiz if only one question exists
  deleteQuestionOrQuiz: async (req, res) => {
    const { id: quizId, idqs: questionId } = req.params;
    try {
      const quiz = await Quiz.findById(quizId);
      if (!quiz) return res.status(404).json({ message: 'Quiz not found' });

      // If only one question exists, delete the whole quiz
      if (quiz.questions.length === 1) {
        await Quiz.findByIdAndDelete(quizId);
        return res.status(200).json({ message: 'Quiz deleted (only question was removed)' });
      }

      const questionToDelete = quiz.questions.find(q => q._id.toString() === questionId);
      if (questionToDelete?.image) {
        await deleteObject(questionToDelete.image);
      }

      const updatedQuiz = await Quiz.findByIdAndUpdate(
        quizId,
        { $pull: { questions: { _id: questionId } } },
        { new: true }
      );

      res.status(200).json({ message: 'Question deleted successfully', quiz: updatedQuiz });
    } catch (error) {
      res.status(400).json({ message: 'Error deleting question or quiz', error: error.message });
    }
  }
};

module.exports = quizCtrl;
