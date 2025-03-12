const { Schema, mongoose } = require('mongoose');

const villeSchema = new Schema({
    name: {
        type: String,
        required: true
    }
},
    { versionKey: false });


module.exports = mongoose.model('ville', villeSchema);