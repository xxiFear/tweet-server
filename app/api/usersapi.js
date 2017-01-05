'use strict';

const User = require('../models/user');
const Tweet = require('../models/tweet');
const Boom = require('boom');
const utils = require('./utils.js');

exports.find = {

  auth: {
    strategy: 'jwt',
  },

  handler: function (request, reply) {
    User.find({}).exec().then(users => {
      reply(users);
    }).catch(err => {
      reply(Boom.badImplementation('error accessing db'));
    });
  },

};

exports.findOne = {

  auth: {
    strategy: 'jwt',
  },

  handler: function (request, reply) {
    User.findOne({ _id: request.params.id }).then(user => {
      if (user != null) {
        reply(user);
      }

      // reply(Boom.notFound('id not found'));
    }).catch(err => {
      reply(Boom.notFound('id not found'));
    });
  },

};

exports.authenticate = {
  auth: false,
  handler: function (request, reply) {
    const user = request.payload;
    User.findOne({ email: user.email }).then(foundUser => {
      if (foundUser && foundUser.password === user.password) {
        const token = utils.createToken(foundUser);
        reply({ success: true, token: token }).code(201);
      } else {
        reply({ success: false, message: 'Authentication failed. User not found.' }).code(201);
      }
    }).catch(err => {
      reply(Boom.notFound('internal db failure'));
    });
  },

};

exports.createOrUpdate = {

  auth: {
    strategy: 'jwt',
  },

  handler: function (request, reply) {
    const user = new User(request.payload);
    const query = { '_id': user._id };
    const update = {
      firstName: user.firstName,
      lastName: user.lastName,
      gender: user.gender,
      password: user.password,
      description: user.description,
    };
    const options = { upsert: true, new: true, setDefaultsOnInsert: true };

    User.findOneAndUpdate(query, update, options, function (error, newUser) {
      if (error) reply(Boom.badImplementation('error creating or updating user'));

      reply(newUser).code(201);
    });

    //   user.save().then(newUser => {
    //     reply(newUser).code(201);
    //   }).catch(err => {
    //     reply(Boom.badImplementation('error creating User'));
    //   });
    // },
  },
};

exports.deleteAll = {

  auth: {
    strategy: 'jwt',
  },

  handler: function (request, reply) {
    User.remove({}).then(err => {
      reply().code(204);
    }).catch(err => {
      reply(Boom.badImplementation('error removing Users'));
    });
  },

};

exports.deleteOne = {

  auth: {
    strategy: 'jwt',
  },

  handler: function (request, reply) {
    User.remove({ _id: request.params.id }).then(user => {
      reply(User).code(204);
    }).catch(err => {
      reply(Boom.notFound('id not found'));
    });
  },

};

exports.findAllTweets = {

  auth: {
    strategy: 'jwt',
  },

  handler: function (request, reply) {
    Tweet.find({ author: request.params.id })
        .sort([['_id', -1]])
        .limit(30)
        .populate('author')
        .exec()
        .then(tweets => {

      reply(tweets);

    }).catch(err => {
      reply(Boom.badImplementation('error accessing db'));
    });
  },

};

exports.createTweet = {

  auth: {
    strategy: 'jwt',
  },

  handler: function (request, reply) {
    const tweet = new Tweet(request.payload);
    const token = request.headers.authorization.split(' ')[1];
    const userInfo = utils.decodeToken(token);
    tweet.author = userInfo.userId;

    tweet.save().then(savedTweet => {
      Tweet.findOne({ _id: savedTweet._id }).populate('author').exec().then(newTweet => {
        reply(newTweet).code(201);
      }).catch(err => {
        reply(Boom.badImplementation('error finding just saved tweet'));
      });
    }).catch(err => {
      reply(Boom.badImplementation('error saving tweet'));
    });

    // tweet.save().then(newTweet => {
    //   reply(newTweet).code(201);
    // }).catch(err => {
    //   reply(Boom.badImplementation('error saving tweet'));
    // });
  },

};

exports.deleteAllTweets = {

  auth: {
    strategy: 'jwt',
  },

  handler: function (request, reply) {
    Tweet.remove({ author: request.params.id }).then(result => {
      reply().code(204);
    }).catch(err => {
      reply(Boom.badImplementation('error removing Tweets'));
    });
  },
};
