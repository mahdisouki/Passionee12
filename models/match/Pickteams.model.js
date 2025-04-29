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
      playerIn: {
        type: Schema.Types.ObjectId,
        ref: 'Player',
        required: true
      },
    
      playerOut: {
        type: Schema.Types.ObjectId,
        ref: 'Player',
        required: true
      }
    },
    
  ], 
  
  playerReplace: [
    {
      playerIn: {
        type: Schema.Types.ObjectId,
        ref: 'Player',
        required: true
      },
    
      playerOut: {
        type: Schema.Types.ObjectId,
        ref: 'Player',
        required: true
      }
    },
    
  ]
}, { versionKey: false });

module.exports = mongoose.model('Pickteam', pickteamSchema);
