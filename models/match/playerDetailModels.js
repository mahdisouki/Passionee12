const { Schema, mongoose } = require('mongoose');

const PlayerDetailSchema = new Schema({
    designation: {
        type: String,
        required: true
    },
    id_player: {
        type: String,
        required: true
    }
},
    { versionKey: false });


module.exports = mongoose.model('PlayerDetail', PlayerDetailSchema);