const { Schema, mongoose } = require('mongoose');

const pickteamSchema = new Schema({
  userId: {
    type: String,
    required: true
  },
  round: {
    type: String,
    required: true
  },
  currentPoint: Number,
  totalsPoint: Number,
  nickName: String,

  players: [
    {
      rowIndex: Number,
      columnIndex:Number,
      player: {
        type: Schema.Types.ObjectId,
        ref: 'Player',
        required: true
      },
      isSubstituted: {
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
     
    }
  ],

  playerTransfert: [
    {
      player: {
        type: Schema.Types.ObjectId,
        ref: 'Player',
        required: true
      },
      transferType: {
        type: String,
        enum: ['in', 'out'],
        required: true
      }
    }
  ]
}, { versionKey: false });

module.exports = mongoose.model('Pickteam', pickteamSchema);
