'use strict';

const User = require('../models/user');
const Tweet = require('../models/tweet');
const Boom = require('boom');
const utils = require('./utils.js');
const GCloud = require('gcloud');

exports.getAuthenticatedUser = {

  auth: {
    strategy: 'jwt',
    scope: ['admin', 'user'],
  },

  handler: function (request, reply) {

    const token = request.headers.authorization.split(' ')[1];
    const userInfo = utils.decodeToken(token);
    const userId = userInfo.userId;

    User.findOne({ _id: userId }).populate({
      path: 'following', model: 'User',
    }).exec().then(authorizedUser => {
      if (authorizedUser != null) {
        reply(authorizedUser);
      }

      // reply(Boom.notFound('id not found'));
    }).catch(err => {
      reply(Boom.notFound('id not found'));
    });
  },

};

exports.getFollower = {

  auth: {
    strategy: 'jwt',
    scope: ['admin', 'user'],
  },

  handler: function (request, reply) {
    let userId = request.params.id;
    User.find({ following: request.params.id }).populate('following').exec().then(users => {
      reply(users);
    }).catch(err => {
      reply(Boom.badImplementation('error accessing db'));
    });
  },
};

exports.find = {

  auth: {
    strategy: 'jwt',
    scope: ['admin', 'user'],
  },

  handler: function (request, reply) {
    User.find({}).populate('following').exec().then(users => {
      reply(users);
    }).catch(err => {
      reply(Boom.badImplementation('error accessing db'));
    });
  },

};

exports.findOne = {

  auth: {
    strategy: 'jwt',
    scope: ['admin', 'user'],
  },

  handler: function (request, reply) {
    User.findOne({ _id: request.params.id }).populate('following').exec().then(user => {
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
    scope: ['admin', 'user'],
  },

  handler: function (request, reply) {
    const user = new User(request.payload);
    const query = { '_id': user._id };

    //Email, role and following is not updated on purpose as following is handled by the
    // friendshipsapi
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
    scope: ['admin'],
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
    scope: ['admin'],
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
    scope: ['admin', 'user'],
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
    scope: ['user', 'admin'],
  },

  handler: function (request, reply) {
    const base64regex = /^([0-9a-zA-Z+/]{4})*(([0-9a-zA-Z+/]{2}==)|([0-9a-zA-Z+/]{3}=))?$/;
    const tweet = new Tweet(request.payload);
    const token = request.headers.authorization.split(' ')[1];
    const userInfo = utils.decodeToken(token);
    const userID = userInfo.userId;
    tweet.author = userID;

    // if (request.payload.image && request.payload.image.data.length) {
    if (request.payload.image) {
      // const image = new Uint8Array(request.payload.image.data);

      if (base64regex.test(request.payload.image)) {
        const image = new Buffer(request.payload.image, 'base64');

        var storage = GCloud.storage({
          projectId: 'tweet-bccc8',
          keyFilename: ('gcloudKeyFile.json'),
        });
        var bucket = storage.bucket('tweet-bccc8.appspot.com');

        const fileName = userID + '/' + new Date().getTime();
        const newFile = bucket.file(fileName);

        uploadFile(newFile, image, function (err) {
          if (!err) {

            bucket.file(fileName).getSignedUrl({
              action: 'read',
              expires: '08-12-2025',
            }, function (err, url) {
              if (!err) {

                tweet.imagePath = url;

                tweet.save().then(savedTweet => {
                  Tweet.findOne({ _id: savedTweet._id }).populate('author').exec().then(newTweet => {
                    reply(newTweet).code(201);
                  }).catch(err => {
                    reply(Boom.badImplementation('error finding just saved tweet'));
                  });
                }).catch(err => {
                  reply(Boom.badImplementation('error saving tweet'));
                });

              } else {
                console.error(err);
                reply(Boom.badImplementation('error creating Tweet'));
              }
            });
          } else {
            reply(Boom.badImplementation('error creating Tweet'));
          }
        });
      } else {
        reply(Boom.badData('image needs to be base64 encoded string'));
      }
    } else {
      tweet.save().then(savedTweet => {
        Tweet.findOne({ _id: savedTweet._id }).populate('author').exec().then(newTweet => {
          reply(newTweet).code(201);
        }).catch(err => {
          reply(Boom.badImplementation('error finding just saved tweet'));
        });
      }).catch(err => {
        reply(Boom.badImplementation('error saving tweet'));
      });
    }
  },

};

// exports.createTweet = {
//
//   auth: {
//     strategy: 'jwt',
//     scope: ['admin', 'user'],
//   },
//
//   handler: function (request, reply) {
//     const tweet = new Tweet(request.payload);
//     const token = request.headers.authorization.split(' ')[1];
//     const userInfo = utils.decodeToken(token);
//     tweet.author = userInfo.userId;
//
//     tweet.save().then(savedTweet => {
//       Tweet.findOne({ _id: savedTweet._id }).populate('author').exec().then(newTweet => {
//         reply(newTweet).code(201);
//       }).catch(err => {
//         reply(Boom.badImplementation('error finding just saved tweet'));
//       });
//     }).catch(err => {
//       reply(Boom.badImplementation('error saving tweet'));
//     });
//
//     // tweet.save().then(newTweet => {
//     //   reply(newTweet).code(201);
//     // }).catch(err => {
//     //   reply(Boom.badImplementation('error saving tweet'));
//     // });
//   },
//
// };

exports.deleteAllTweets = {

  auth: {
    strategy: 'jwt',
    scope: ['admin'],
  },

  handler: function (request, reply) {
    Tweet.remove({ author: request.params.id }).then(result => {
      reply().code(204);
    }).catch(err => {
      reply(Boom.badImplementation('error removing Tweets'));
    });
  },
};

exports.deleteMultiple = {

  auth: {
    strategy: 'jwt',
    scope: ['user', 'admin'],
  },

  handler: function (request, reply) {
    const usersToDelete = JSON.parse(request.params.multipleUsers);

    User.remove({ _id: { $in: usersToDelete } }).then(users => {
      reply(users).code(204);
    }).catch(err => {
      reply(Boom.notFound('Id(s) not found'));
    });
  },

};

function uploadFile(file, contents, callback) {
  // open write stream
  var stream = file.createWriteStream({
    metadata: {
      contentType: 'image/jpeg',
    },
  });

  // if there is an error signal back
  stream.on('error', callback);

  // if everything is successfull signal back
  stream.on('finish', callback);

  // send the contents
  stream.end(contents);
}
