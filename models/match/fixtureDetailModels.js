const { Schema, mongoose } = require('mongoose');

// Define the schema for time
const timeSchema = new Schema({
    elapsed: {
        type: Number,
        required: true,
    },
    extra: {
        type: Number,
        default: null,
    },
});

// Define the schema for team
const teamSchema = new Schema({
    id: {
        type: Number,
        required: true,
    },
    name: {
        type: String,
        required: true,
    },
    logo: {
        type: String,
        required: true,
    },
    colors: {
        type: String,
        default: null,
    }
});

// Define the schema for player
const playerSchema = new Schema({
    id: {
        type: Number,
        required: true,
    },
    name: {
        type: String,
        required: true,
    },
    number: {
        type: Number,
        default: null,
    },
    pos: {
        type: String,
        default: null,
    },
    grid: {
        type: String,
        default: null,
    },
});

// Define the schema for assist
const assistSchema = new Schema({
    id: {
        type: Number,
        default: null,
    },
    name: {
        type: String,
        default: null,
    },
});

// Define the schema for events
const eventSchema = new Schema({
    time: timeSchema,
    team: teamSchema,
    player: playerSchema,
    assist: assistSchema,
    type: {
        type: String,
        required: true,
    },
    detail: {
        type: String,
        required: true,
    },
    comments: {
        type: String,
        default: null,
    },
});

// Define the schema for coach
const coachSchema = new Schema({
    id: {
        type: Number,
        required: true,
    },
    name: {
        type: String,
        required: true,
    },
    photo: {
        type: String,
        required: true,
    },
});

// Define the schema for lineups
const lineupSchema = new Schema({
    team: teamSchema,
    coach: coachSchema,
    formation: {
        type: String,
        default: null,
    },
    startXI: [
        {
            player: playerSchema,
        }
    ],
    substitutes: [
        {
            player: playerSchema,
        }
    ],
});

// Define the schema for stats
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

// Define the schema for FixturesDetails
const fixturesDetailSchema = new Schema({
    id: Number,
    all: statsSchema,
    home: statsSchema,
    away: statsSchema,
    events: [eventSchema],
    lineups: [lineupSchema],
}, { versionKey: false });

// Export the FixturesDetail model
module.exports = mongoose.model('FixturesDetail', fixturesDetailSchema);
