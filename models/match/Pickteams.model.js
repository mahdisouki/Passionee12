const { Schema, mongoose } = require('mongoose');

const pickteamSchema = new Schema({
    userId: String,
    round: String,
    currentPoint: Number,
    totalsPoint: Number,
    nickName: String,
    player: [
        {
            rowIndex: Number,
            playerid: String,
            position: String,
            transfert: {
                type: Boolean,
                default: false
            },
            captain: {
                type: Boolean,
                default: false
            },
            vicecaptain: {
                type: Boolean,
                default: false
            },
            isInjured: {
                type: Boolean,
                default: false
            },
            redCard: {
                type: Boolean,
                default: false
            },
            isSubstituted: Boolean
        }
    ],
    playerTransfert: [
        {
            playerid: String,
            transferType: {
                type: String,
                enum: ['in', 'out'],
                required: true
            }
        }
    ]
}, { versionKey: false });

module.exports = mongoose.model('Pickteam', pickteamSchema);
