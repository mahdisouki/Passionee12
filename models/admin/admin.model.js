const { Schema, mongoose } = require('mongoose');

const adminSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    username: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    telephone:{
        type: String
    },
    logo: {
        type: String
    },
    lastDateConnection: {
        type: Date,
        default: Date.now
    },
    dateAdd: {
        type: Date,
        default: Date.now
    },
    role: {
        type: String,
        enum: ['admin', 'user', 'equipe', 'finance', 'moderator', 'scout'],
        default: 'user'
    }
},
    { versionKey: false });


module.exports = mongoose.model('admin', adminSchema);

