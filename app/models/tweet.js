'use strict';

const mongoose = require('mongoose');

const tweetSchema = mongoose.Schema({
  imagePath: String,
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  message: String,
  time: {
    type: Date,
    default: Date.now,
  },
});

const Tweet = mongoose.model('Tweet', tweetSchema);
module.exports = Tweet;
