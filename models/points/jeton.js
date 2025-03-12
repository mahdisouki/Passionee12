const { Schema, mongoose } = require('mongoose');

require("./userModels");

const PredictionSchema = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    jetonTotal: {
        type: Number,
        default: 0
    }
},
    { versionKey: false });


module.exports = mongoose.model('Jeton', PredictionSchema);