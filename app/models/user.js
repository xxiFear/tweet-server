'use strict';
const Tweet = require('./tweet');
const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
  firstName: String,
  lastName: String,
  gender: {
    type: String,
    enum: ['Male', 'Female'],
  },
  email: String,
  password: String,
  joined: {
    type: Date,
    default: Date.now,
  },
  description: String,
  following: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        unique: true,
        index: true,
        default: [],
      },
      ],
  role: {
    type: String,
    enum: ['admin', 'user'],
    default: 'user',
  },
});

userSchema.pre('remove', function (next) {
  Tweet.remove({ author: this._id }).exec();
  next();
});

const User = mongoose.model('User', userSchema);
module.exports = User;
