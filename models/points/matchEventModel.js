const { Schema, mongoose } = require('mongoose');

const MatchEventSchema = new Schema({
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
    eventType: {
        type: String,
        enum: ['penalty_save', 'substitution', 'sanction', 'goal', 'bonus'],
        required: true,
    },
    time: {
        type: Number,
        required: true
    },
    description: {
        type: String,
        default: ''
    },
    card: {
        type: String,
        enum: ['2 yellow', 'red direct', null],
        default: null
    },
    goalType: {
        type: String,
        enum: ['regular', 'penalty', 'own_goal', null],
        default: null
    },
    assist: {
        type: Schema.Types.ObjectId,
        default: null,
        ref: 'Player'
    },
    penaltySaveGoalkeeper: {
        type: Schema.Types.ObjectId,
        default: null,
        ref: 'Player'
    },
    penaltySaveMissedby: {
        type: Schema.Types.ObjectId,
        default: null,
        ref: 'Player'
    },
    substitutionPlayerIn: {
        type: Schema.Types.ObjectId,
        default: null,
        ref: 'Player'
    },
    substitutionPlayerOut: {
        type: Schema.Types.ObjectId,
        default: null,
        ref: 'Player'
    }
},
    { versionKey: false });

module.exports = mongoose.model('MatchEvent', MatchEventSchema);
