const { Schema, mongoose } = require('mongoose');

const RemplacementSchema = new Schema({
    match: {
        //type: Number,
        type: String,
        ref: 'Fixtures'
    },
    round: {
        type: String,
        required: true,
    },
    team: {
        type: String,
        //required: true,
        //ref: 'Team'
    },

    inplayer: {
        type: String,
        //required: true,
    },
    outplayer: {
        type: String,
        //required: true,
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


module.exports = mongoose.model('Remplacement', RemplacementSchema);
