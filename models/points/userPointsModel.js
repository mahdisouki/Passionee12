const { Schema, mongoose } = require('mongoose');

const userpointsSchema = new Schema({
    user: {
        type: String,
        required: true
    },
    round: {
        type: String,
        required: true,
    },
    points: {
        type: Number,
        required: true
    },
},
    { versionKey: false });


module.exports = mongoose.model('userpoints', userpointsSchema);