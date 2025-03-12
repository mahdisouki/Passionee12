const { Schema, mongoose } = require('mongoose');

const TypeBlogSchema = new Schema({
  nom: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
},
  { versionKey: false });


module.exports = mongoose.model('TypeBlog', TypeBlogSchema);