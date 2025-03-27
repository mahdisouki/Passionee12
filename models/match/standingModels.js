const { Schema, mongoose } = require('mongoose');

const teamSchema = new Schema({
    _id: {
        type: Schema.Types.ObjectId,
        ref: 'Team',
    },
    id: {
        type: Number,
        required: true,
        unique: true,
    },
    name: {
        type: String,
        required: true,
    },
    logo: {
        type: String,
        required: true,
    },
});

const statsSchema = new Schema({
    played: {
        type: String,
        required: true,
    },
    win: {
        type: String,
        required: true,
    },
    draw: {
        type: String,
        required: true,
    },
    lose: {
        type: String,
        required: true,
    },
});

const StandingSchema = new Schema({
    rank: {
        type: String,
        required: true,
    },
    team: {
        type: teamSchema,
    },
    points: {
        type: String,
        required: true,
    },
    goalsDiff: {
        type: String,
        required: true,
    },
    group: {
        type: String,
    },
    all: {
        type: statsSchema,
        required: true,
    },
    home: {
        type: statsSchema,
        required: true,
    },
    away: {
        type: statsSchema,
        required: true,
    },
},
    { versionKey: false });


module.exports = mongoose.model('Standing', StandingSchema);