const { Schema, mongoose } = require('mongoose')

const sanctionSchema = new Schema({
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
        required: true,
        //ref: 'Team'
    },

    carton: {
        type: String,
        required: true,
    },
    player: {
        type: Schema.Types.ObjectId,
        ref: 'Player',
        required: true
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


module.exports = mongoose.model('Sanction', sanctionSchema);
