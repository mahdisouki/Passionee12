const { Schema, mongoose } = require('mongoose')

const TeamSchema = new Schema({
    id: {
        type: String
    },
    name: {
        type: String,
        required: true
    },
    code: {
        type: String,
        required: true
    },
    country: {
        type: String,
        required: true
    },
    city: {
        type: String,
        required: true,
    },
    founded: {
        type: String,
        default: true
    },
    logo: {
        type: String
    },
    group: {
        type: String
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    staf: {
        entprincipal: {
            type: String,
            //required: true
        },
        entadjoints: {
            entadj1: {
                type: String,
            },
            entadj2: {
                type: String,
            },
        },
        manager: {
            type: String,

        },
        entgardien: {
            type: String,

        },
        prepphysique: {
            type: String,

        },
        analystedonnes: {
            type: String,

        },
        kine: {
            type: String,

        },
        kineadjoint: {
            type: String,

        },
        medecins: {
            medc1: {
                type: String,
            },
            medc2: {
                type: String,
            }

        },
        administration: {
            president: {
                type: String,
            },
            vicepresident: {
                type: String,
            },
        },

        recruteurs: {
            recr1: {
                type: String,
            },
            recr2: {
                type: String,
            },

        },
    }

},
    { versionKey: false });


module.exports = mongoose.model('Team', TeamSchema);