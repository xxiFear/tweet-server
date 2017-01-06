const User = require('../models/user');
const Tweet = require('../models/tweet');
const Boom = require('boom');
const utils = require('./utils.js');
const _ = require('lodash');

exports.follow = {

  auth: {
    strategy: 'jwt',
  },

  handler: function (request, reply) {
    const userToFollow = new User(request.payload);
    const token = request.headers.authorization.split(' ')[1];
    const userInfo = utils.decodeToken(token);
    const userId = userInfo.userId;

    User.findByIdAndUpdate(
        userId,
        { $addToSet: { 'following': userToFollow._id } },
        { safe: true, upsert: true, new: true },
        function (err, newUser) {
          if (err) reply(Boom.badImplementation('error'));
          reply(newUser).code(201);
        }
    );

  },
};

exports.unfollow = {

  auth: {
    strategy: 'jwt',
  },

  handler: function (request, reply) {
    const userToUnfollow = new User(request.payload);
    const token = request.headers.authorization.split(' ')[1];
    const userInfo = utils.decodeToken(token);
    const userId = userInfo.userId;

    User.findByIdAndUpdate(
        userId,
        { $pull: { 'following': userToUnfollow._id } },
        { safe: true, upsert: true, new: true },
        function (err, newUser) {
          if (err) reply(Boom.badImplementation('error'));

          reply(newUser).code(201);
        }
    );

  },
};
