const { Schema, mongoose } = require('mongoose');

const messageSchema = new Schema({
    content: {
        type: String,
        required: true
    }
},
    { versionKey: false });

module.exports = mongoose.model('message', messageSchema);