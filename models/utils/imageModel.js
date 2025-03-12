const { Schema, mongoose } = require('mongoose')

const ImageSchema = new Schema({
    titre: {
        type: String,
        required: true
    },
    fichier: {
        type: String,
        required: true
    }
},
    { versionKey: false });


module.exports = mongoose.model('Image', ImageSchema);