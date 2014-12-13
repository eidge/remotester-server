var env = process.env.NODE_ENV || 'test';
var should = require('should');
var assert = require('assert');
var models = require(__dirname + '/../models');
var app = require(__dirname + '/../app');
var request = require('supertest')(app);
var config = require(__dirname + '/../config/config.json')[env];
var Sequelize = require('sequelize');
var sequelize = new Sequelize(
  config.database,
  config.username,
  config.password,
  config
);

var existingUser;

describe('Auth', function() {
  before(function(done) {
    models
      .User
      .findOrCreate({ where: { email: 'test@test.com', name: 'test' } })
      .spread(function(user, create){
        user.password = '123456';

        user.save().complete(function(err){
          existingUser = user;
          done(err);
        })
      })
  });

  describe('sign in', function() {
    it('returns an authorization token', function(done){
      request
        .post('/signin')
        .send({ email: 'test@test.com', password: '123456' })
        .expect(201)
        .expect(function(res) {
          if(!JSON.parse(res.text).token)
            return 'expect res.token to be present';
        })
        .end(function(err, res) {done(err);});
    });

    it('returns unauthorized if email is not correct', function(done){
      request
        .post('/signin')
        .send({email: 'test1@test.com', password: '123456'})
        .expect(401)
        .end(function(err, res) {done(err);});
    });

    it('returns unauthorized if password is not correct', function(done){
      request
        .post('/signin')
        .send({email: 'test@test.com', password: '1'})
        .expect(401)
        .end(function(err, res) {done(err);});
    });
  });

  describe('me', function(){
    it('returns current user profile', function(done){
      request
        .get('/me?access_token=' + existingUser.token)
        .expect(200)
        .expect(function(res){
          if(JSON.parse(res.text).id != existingUser.id)
            return 'expect response to be user ' + existingUser.id;
        })
        .end(function(err, res) { done(err);});
    });
  });
});
