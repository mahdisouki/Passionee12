const { Schema, mongoose } = require('mongoose')

const PlayerSchema = new Schema({
    team: {
        _id: {
            type: Schema.Types.ObjectId,
            ref: 'Team',
            required: true
        },
        id: {
            type: Number,
        },
        code: {
            type: String,
            required: true
        },
        name: {
            type: String,
            required: true
        },
        logo: {
            type: String,
            required: true
        },
    },
    name: {
        type: String,
        required: true
    },
    age: {
        type: Number,
        required: true
    },
    number: {
        type: Number,
        required: true
    },
    position: {
        type: String,
        required: true
    },
    logo: {
        type: String
    },
    value: {
        type: String
    },
    value_passionne: {
        type: Number
    },
    height: {
        type: String
    },
    points: [{
        round: String,
        total: Number,
    }],
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
},
    { versionKey: false });


module.exports = mongoose.model('Player', PlayerSchema);