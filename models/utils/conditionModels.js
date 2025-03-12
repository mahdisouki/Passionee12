const { Schema, mongoose } = require('mongoose');

const conditionSchema = new Schema({
    content: {
        type: String,
        required: true
    }
},
    { versionKey: false });

module.exports = mongoose.model('condition', conditionSchema);