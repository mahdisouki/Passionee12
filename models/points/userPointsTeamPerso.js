const { Schema, mongoose } = require('mongoose');

const userpointsTeamPersoSchema = new Schema({
    user: {
        type: String,
        required: true
    },
    points: {
        type: Number,
        required: true
    },
},
    { versionKey: false });


module.exports = mongoose.model('userpointsteamperso', userpointsTeamPersoSchema);