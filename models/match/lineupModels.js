const { Schema, mongoose } = require('mongoose');

const matchSchema = new Schema({
    match_id: {
        type: Schema.Types.ObjectId,
        ref: 'Fixtures',
        required: true
    },
    journee: String,
    formation: String,
    lineups: [{
        team: {
            type: Schema.Types.ObjectId,
            ref: 'Team',
            required: true
        },
        startXI: [{
            _id: {
                type: Schema.Types.ObjectId,
                ref: 'Player',
                required: true
            },
        }],
        substitutes: [{
            _id: {
                type: Schema.Types.ObjectId,
                ref: 'Player',
                required: true
            },
        }]
    }]
},
    { versionKey: false });

module.exports = mongoose.model('Lineup', matchSchema);