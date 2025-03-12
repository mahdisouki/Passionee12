const { Schema, mongoose } = require('mongoose');

const gameRuleSchema = new Schema({
    content: {
        type: String,
        required: true
    }
},
    { versionKey: false });

module.exports = mongoose.model('gameRule', gameRuleSchema);