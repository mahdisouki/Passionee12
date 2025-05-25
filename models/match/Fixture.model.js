const { Schema, mongoose } = require('mongoose');

const matchSchema = new Schema({
    id: Number,
    referee: String,
    round: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        required: true
    },
    stadename: {
        type: String,
        required: true
    },
    stadecity: {
        type: String,
        required: true
    },
    teamshome: {
            type: Schema.Types.ObjectId,
            ref: 'Team'
    },
    teamsaway: {
            type: Schema.Types.ObjectId,
            ref: 'Team'
    },
    statuslong: {
        type: String,
        default: 'Not Started'
    },
    statusshort: {
        type: String,
        default: 'NS'
    },
    goalshome: {
        halftime: {
            type: Number,
            default: 0
        },
        fulltime: {
            type: Number,
            default: 0
        }
    },
    goalsaway: {
        halftime: {
            type: Number,
            default: 0
        },
        fulltime: {
            type: Number,
            default: 0
        }
    }
},
    { versionKey: false });


module.exports = mongoose.model('Fixtures', matchSchema);
