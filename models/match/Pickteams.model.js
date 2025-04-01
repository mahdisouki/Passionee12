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
      player: {
        type: Schema.Types.ObjectId,
        ref: 'Player',
        required: true
      },
      isStarting: {
        type: Boolean,
        default: false
      },
      isSubstituted: {
        type: Boolean,
        default: false
      },
      availabilityStatus: {
        type: String,
        enum: ['available', 'willNotPlay', 'uncertain'],
        default: 'available'
      },
      availabilityReason: {
        type: String,
        required: function () {
          return this.availabilityStatus !== 'available';
        }
      },
      captain: {
        type: Boolean,
        default: false
      },
      vicecaptain: {
        type: Boolean,
        default: false
      },
      mvp: {
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
      }
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
