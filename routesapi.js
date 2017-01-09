const TweetsApi = require('./app/api/tweetsapi');
const UsersApi = require('./app/api/usersapi');
const FriendshipsApi = require('./app/api/friendshipsapi');

module.exports = [

  { method: 'GET', path: '/api/tweets', config: TweetsApi.find },
  { method: 'POST', path: '/api/tweets', config: UsersApi.createTweet },
  { method: 'GET', path: '/api/tweets/{id}', config: TweetsApi.findOne },
  { method: 'GET', path: '/api/tweets/{id}/user', config: UsersApi.findOne },
  { method: 'DELETE', path: '/api/tweets/{id}', config: TweetsApi.deleteOne },
  { method: 'DELETE', path: '/api/tweets', config: TweetsApi.deleteAll },
  //  TODO
  // { method: 'DELETE', path: '/api/tweets/{multipleTweets}', config: TweetsApi.deleteMultiple },

  { method: 'GET', path: '/api/users/{id}/tweets', config: UsersApi.findAllTweets },
  { method: 'DELETE', path: '/api/users/{id}/tweets', config: UsersApi.deleteAllTweets },

  //  Todo Routes for tests need to be reworked
  // { method: 'POST', path: '/api/users/{id}/tweets', config: UsersApi.deleteAllTweets },

  { method: 'GET', path: '/api/users', config: UsersApi.find },
  { method: 'GET', path: '/api/users/authenticated', config: UsersApi.getAuthenticatedUser },
  { method: 'GET', path: '/api/users/{id}', config: UsersApi.findOne },
  { method: 'POST', path: '/api/users', config: UsersApi.createOrUpdate },
  { method: 'DELETE', path: '/api/users/{id}', config: UsersApi.deleteOne },
  { method: 'DELETE', path: '/api/users', config: UsersApi.deleteAll },
  //TODO
  // { method: 'DELETE', path: '/api/users/{multipleUsers}', config: TweetsApi.deleteMultiple },
  { method: 'POST', path: '/api/users/authenticate', config: UsersApi.authenticate },
  { method: 'GET', path: '/api/users/{id}/follower', config: UsersApi.getFollower },

  { method: 'POST', path: '/api/friendships/follow', config: FriendshipsApi.follow },
  { method: 'POST', path: '/api/friendships/unfollow', config: FriendshipsApi.unfollow },


];
