const { Schema, mongoose } = require('mongoose');

const optionSchema = new Schema({
    text: {
        type: String,
        required: true
    },
    isCorrect: {
        type: Boolean,
        required: true,
        default: false
    }
}, { _id: false }); // Prevents creation of separate IDs for options

const quizSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    category: String,
    questions: [
        {
            question: {
                type: String,
                required: true
            },
            options: [optionSchema],
            timeLimit: {
                type: Number,
                default: 60
            },
            image: String
        }
    ]
}, { versionKey: false });

module.exports = mongoose.model('Quiz', quizSchema);
