const { Schema, mongoose } = require('mongoose');


const teamSchema = new Schema({
    /*_id: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Team', 
    },*/
    id: {
        type: Schema.Types.ObjectId,
        required: true,
        unique: true,
        ref: 'Team',
    },
    name: {
        type: String,
        required: true,
    },
    /*logo: {
        type: String,
        required: false,
    },*/
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
    loose: {
        type: String,
        required: true,
    },
});

const ClassementtSchema = new Schema({
    rank: {
        type: String,
        required: true,
    },
    team: {
        type: teamSchema,
        cascade: true,
        required: true,
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
        required: true,
    },
    all: {

        type: statsSchema,
        required: true,
        cascade: true,
    },
    home: {
        type: statsSchema,
        required: false,
        cascade: true,
    },
    away: {
        type: statsSchema,
        required: false,
        cascade: true,
    },

},
    { versionKey: false });


module.exports = mongoose.model('Classementt', ClassementtSchema);