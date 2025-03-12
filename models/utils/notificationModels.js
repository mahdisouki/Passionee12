const { Schema, mongoose } = require('mongoose');
const notificationSchema = new Schema({
    message: {
        type: String,
        required: true
    },
    timestamp: {
        type: Date,
        default: Date.now
    },
    recipient: {
        type: Schema.Types.ObjectId,
        //refPath: 'recipientModel',
        refPath: 'user',
        required: true,
    },
    /*recipientModel: {
        type: String,
        // enum: ['User', 'Blog', 'Player', 'Team', 'Match'],
        required: true,
    },*/
    status: {
        type: String,
        enum: ['read', 'unread'],
        default: 'unread'
    },
}, { versionKey: false });


module.exports = mongoose.model('Notification', notificationSchema);