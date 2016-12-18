'use strict';

const assert = require('chai').assert;
const TweetService = require('./tweet-service');
const fixtures = require('./fixtures.json');
const _ = require('lodash');

suite('Tweet API tests', function () {

  let users = fixtures.users;
  let tweets = fixtures.tweets;
  let newUser = fixtures.newUser;

  const tweetService = new TweetService(fixtures.tweetService);

  beforeEach(function () {
    tweetService.login(users[0]);
    tweetService.deleteAllTweets();
  });

  afterEach(function () {
    tweetService.deleteAllTweets();
    tweetService.logout();
  });

  test('create a tweet', function () {
    const returnedUser = tweetService.createUser(newUser);
    tweetService.createTweet(returnedUser._id, tweets[0]);
    const returnedTweets = tweetService.getTweetsFromUser(returnedUser._id);
    assert.equal(returnedTweets.length, 1);
    assert(_.some([returnedTweets[0]], tweets[0]), 'returned tweet must be a superset of tweet');
  });

  test('create multiple tweets', function () {
    const returnedUser = tweetService.createUser(newUser);
    for (var i = 0; i < tweets.length; i++) {
      tweetService.createTweet(returnedUser._id, tweets[i]);
    }

    const returnedTweets = tweetService.getTweetsFromUser(returnedUser._id);
    assert.equal(returnedTweets.length, tweets.length);
    for (var i = 0; i < tweets.length; i++) {
      assert(_.some([returnedTweets[i]], tweets[i]), 'returned tweet must be a superset of tweet');
    }
  });

  test('delete all tweets', function () {
    const returnedUser = tweetService.createUser(newUser);
    for (var i = 0; i < tweets.length; i++) {
      tweetService.createTweet(returnedUser._id, tweets[i]);
    }

    const d1 = tweetService.getTweetsFromUser(returnedUser._id);
    assert.equal(d1.length, tweets.length);
    tweetService.deleteAllTweets();
    const d2 = tweetService.getTweetsFromUser(returnedUser._id);
    assert.equal(d2.length, 0);
  });

  test('get all tweets', function () {
    const returnedUser = tweetService.createUser(newUser);
    for (var i = 0; i < tweets.length; i++) {
      tweetService.createTweet(returnedUser._id, tweets[i]);
    }

    const totalTweets = tweetService.getTweets();
    assert.equal(totalTweets.length, fixtures.tweets.length);
  });

  test('delete tweets', function () {
    const returnedUser = tweetService.createUser(newUser);
    for (var i = 0; i < tweets.length; i++) {
      tweetService.createTweet(returnedUser._id, tweets[i]);
    }

    tweetService.deleteTweetsFromUser(returnedUser._id);
    const d = tweetService.getTweetsFromUser(returnedUser._id);
    assert.equal(d.length, 0);
  });
});
