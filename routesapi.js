const TweetsApi = require('./app/api/tweetsapi');
const UsersApi = require('./app/api/usersapi');

module.exports = [

  { method: 'GET', path: '/api/tweets', config: TweetsApi.find },
  { method: 'POST', path: '/api/tweets', config: UsersApi.createTweet },
  { method: 'GET', path: '/api/tweets/{id}', config: TweetsApi.findOne },
  { method: 'GET', path: '/api/tweets/{id}/user', config: UsersApi.findOne },
  { method: 'DELETE', path: '/api/tweets/{id}', config: TweetsApi.deleteOne },
  { method: 'DELETE', path: '/api/tweets', config: TweetsApi.deleteAll },

  { method: 'GET', path: '/api/users/{id}/tweets', config: UsersApi.findAllTweets },
  { method: 'DELETE', path: '/api/users/{id}/tweets', config: UsersApi.deleteAllTweets },

  { method: 'GET', path: '/api/users', config: UsersApi.find },
  { method: 'GET', path: '/api/users/{id}', config: UsersApi.findOne },
  { method: 'POST', path: '/api/users', config: UsersApi.create },
  { method: 'DELETE', path: '/api/users/{id}', config: UsersApi.deleteOne },
  { method: 'DELETE', path: '/api/users', config: UsersApi.deleteAll },
  { method: 'POST', path: '/api/users/authenticate', config: UsersApi.authenticate },

];
