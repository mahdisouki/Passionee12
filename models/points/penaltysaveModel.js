const { Schema, mongoose } = require('mongoose')

const penaltysaveSchema = new Schema({
    match: {
        //type: Number,
        type: String,
        ref: 'Fixtures'
    },

    round: {
        type: String,
        required: true
    },

    team: {
        type: String,
        required: true,
        //ref: 'Team'
    },

    goalkeeper: {
        type: String,
        required: true,
        //ref: 'Team'
    },

    missedby: {
        type: String,
        required: true,
        //ref: 'Team'
    },

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


module.exports = mongoose.model('PenaltySave', penaltysaveSchema);