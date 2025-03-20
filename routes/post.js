const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
  imageText: {
    type: String,
    required: true, // Ensures that postText is mandatory
    trim: true, // Removes whitespace from both ends of the string
  },
  image:{
    type:String
  },
  Price:{
   type:String
  },
 user: {
    type: mongoose.Schema.Types.ObjectId,// Ensures that user is an object
    ref: 'User',                         // Refers to the user model
  },
  createdAt: {
    type: Date,
    default: Date.now, // Automatically sets the date and time to the current time
  },
  likes: {
    type: Array,
    default: [], // Default number of likes is set to 0
  },
});


module.exports = mongoose.model('Post', postSchema);

