'use strict';

const Tweet = require('../models/tweet');
const Boom = require('boom');

exports.find = {

  auth: {
    strategy: 'jwt',
  },

  handler: function (request, reply) {
    Tweet.find({}).sort([['_id', -1]]).limit(30).populate('author').exec().then(tweets => {
      reply(tweets);
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
    Tweet.findOne({ _id: request.params.id }).then(tweet => {
      if (tweet != null) {
        reply(tweet);
      }

      reply(Boom.notFound('id not found'));
    }).catch(err => {
      reply(Boom.notFound('id not found'));
    });
  },

};

exports.findUser = {

  auth: {
    strategy: 'jwt',
  },

  handler: function (request, reply) {
    User.find({}).populate('tweet').then(user => {
      reply(user);
    }).catch(err => {
      reply(Boom.badImplementation('error accessing db'));
    });
  },

};

exports.create = {

  auth: {
    strategy: 'jwt',
  },

  handler: function (request, reply) {
    const tweet = new Tweet(request.payload);
    tweet.save().then(newTweet => {
      reply(newTweet).code(201);
    }).catch(err => {
      reply(Boom.badImplementation('error creating Tweet'));
    });
  },

};

exports.deleteAll = {

  auth: {
    strategy: 'jwt',
  },

  handler: function (request, reply) {
    Tweet.remove({}).then(err => {
      reply().code(204);
    }).catch(err => {
      reply(Boom.badImplementation('error removing Tweets'));
    });
  },

};

exports.deleteOne = {

  auth: {
    strategy: 'jwt',
  },

  handler: function (request, reply) {
    Tweet.remove({ _id: request.params.id }).then(tweet => {
      reply(Tweet).code(204);
    }).catch(err => {
      reply(Boom.notFound('id not found'));
    });
  },

};
