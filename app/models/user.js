'use strict';

const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
  firstName: String,
  lastName: String,
  gender: { type: String, enum: ['Male', 'Female'] },
  email: String,
  password: String,
  joined: {
    type: Date,
    default: Date.now,
  },
  description: String,
});

const User = mongoose.model('User', userSchema);
module.exports = User;
