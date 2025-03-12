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
        _id: {
            type: Schema.Types.ObjectId,
            ref: 'Team'
        },
        id: {
            type: Number,
        },
        code: {
            type: String
        },
        name: {
            type: String
        },
        logo: {
            type: String
        },
    },
    teamsaway: {
        _id: {
            type: Schema.Types.ObjectId,
            ref: 'Team'
        },
        id: {
            type: Number,
        },
        code: {
            type: String
        },
        name: {
            type: String
        },
        logo: {
            type: String
        },
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
