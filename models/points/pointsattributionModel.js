const { Schema, mongoose } = require('mongoose')

const attributionSchema = new Schema({
    match: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'Fixtures',
    },
    player: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'Player',
    },
    round: {
        type: String,
        required: true,
    },
    points: {
        type: Number,
        required: true,
    },
    typePoint: {
        type: String,
        required: true,
    }
},
    { versionKey: false });

module.exports = mongoose.model('pointsattribution', attributionSchema);