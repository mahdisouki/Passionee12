const { Schema, mongoose } = require('mongoose');

const BlogSchema = new Schema({
  players: [
    {
      type: Schema.Types.ObjectId,
      ref: "Player",
      required: true,
    },
  ],
  type: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  author: {
    type: String,
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  logo: {
    type: String,
  },
  viewsCount: {
    type: Number,
    default: 1,
  },
  date: {
    type: Date,
    default: Date.now,
  },
  tags: {
    type: [String],
  },
  comments: [
    {
      author: {
        type: String,
      },
      comment: {
        type: String,
      },
      date: {
        type: Date,
        default: Date.now,
      },
    },
  ],
},
  { versionKey: false });


module.exports = mongoose.model('BlogModel', BlogSchema);