const { Schema, mongoose } = require('mongoose');

const voteSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    logo: {
        type: String,
    },
    responses: [{
        text: {
            type: String,
            required: true
        },
        count: {
            type: Number,
            default: 0
        }
    }],
    createdAt: {
        type: Date,
        default: Date.now
    }
},
    { versionKey: false });


module.exports = mongoose.model('vote', voteSchema);
