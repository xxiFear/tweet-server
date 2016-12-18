'use strict';

const SyncHttpService = require('./sync-http-client');
const baseUrl = 'http://localhost:4000';

class TweetService {

  deleteAllTweets() {
    return this.httpService.delete('/api/tweets');
  }

  deleteOneTweet(id) {
    return this.httpService.delete('/api/tweets/' + id);
  }

  constructor(baseUrl) {
    this.httpService = new SyncHttpService(baseUrl);
  }

  getTweets() {
    return this.httpService.get('/api/tweets');
  }

  getTweet(id) {
    return this.httpService.get('/api/tweets/' + id);
  }

  getTweetsFromUser(userId) {
    return this.httpService.get('/api/users/' + userId + '/tweets');
  }

  deleteTweetsFromUser(userId) {
    return this.httpService.delete('/api/users/' + userId + '/tweets');
  }

  createTweet(userId, newTweet) {
    return this.httpService.post('/api/users/' + userId + '/tweets', newTweet);
  }

  deleteAllUsers() {
    return this.httpService.delete('/api/users');
  }

  getUsers() {
    return this.httpService.get('/api/users');
  }

  getUser(id) {
    return this.httpService.get('/api/users/' + id);
  }

  createUser(newUser) {
    return this.httpService.post('/api/users', newUser);
  }

  deleteOneUser(id) {
    return this.httpService.delete('/api/users/' + id);
  }

  login(user) {
    return this.httpService.setAuth('/api/users/authenticate', user);
  }

  logout() {
    this.httpService.clearAuth();
  }
}

module.exports = TweetService;
