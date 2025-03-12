const { Schema, mongoose } = require('mongoose')

const ButSchema = new Schema({
    match: {
        type: String,
        ref: 'Fixtures'
    },
    round: {
        type: String,
        required: true,
    },
    team: {
        type: String,
        required: true
    },
    type: {
        type: String,
        required: true
    },
    butteur: String,
    assist: String,
    time: {
        type: String,
        required: true,
    },
    half: {
        type: String,
        required: true,
    }
},
    { versionKey: false });


module.exports = mongoose.model('But', ButSchema);