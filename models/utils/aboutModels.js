const { Schema, mongoose } = require('mongoose');

const aboutSchema = new Schema({
    content: {
        type: String,
        required: true
    }
},
    { versionKey: false });

module.exports = mongoose.model('about', aboutSchema);