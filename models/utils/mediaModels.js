const { Schema, mongoose } = require('mongoose');

const MediaSchema = new Schema({
    type: {
        type: String,
        enum: ['image', 'video', 'audio', 'article', 'quiz'],
        required: true
    },
    title: {
        type: String,
        required: true
    },
    author: {
        type: String,
        required: true
    },
    content: {
        type: String,
        required: true
    },
    logo: {
        type: String
    },
    date: {
        type: Date,
        default: Date.now
    },
    tags: {
        type: [String]
    },
    likes: {
        type: Number,
        default: 0,
        enum: [0, 1, 2]
    },
    comments: [
        {
            author: {
                type: String
            },
            comment: {
                type: String
            },
            date: {
                type: Date,
                default: Date.now
            },
            likes: {
                type: Number,
                default: 0,
                enum: [0, 1, 2]
            }
        }
    ]
},
    { versionKey: false });


module.exports = mongoose.model('Media', MediaSchema);