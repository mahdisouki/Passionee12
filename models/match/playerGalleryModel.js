const { Schema, mongoose } = require('mongoose')

// Define the Player Schema
const playerSchema = new Schema({
    player: {
        type: Schema.Types.ObjectId,
        ref: "Player",
        required: true,
    },
    logo: {
        type: String,
        required: true
    },
    reactions: {
        likes: {
            type: Number,
            default: 0
        },
        loves: {
            type: Number,
            default: 0
        },
        smile: {
            type: Number,
            default: 0
        }
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
},
    { versionKey: false });

module.exports = mongoose.model('PlayerGallery', playerSchema);
