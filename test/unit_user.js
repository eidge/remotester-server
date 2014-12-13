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

describe('User', function() {
  before(function(done) {
    models
      .User
      .findOrCreate({ where: {email: 'test@test.com', name: 'test'} })
      .complete(function(err, user){done(err);})
  });

  describe('validations', function() {
    it('is invalid without a name', function(done){
      models
        .User
        .create({ where: {email: 'test@test.com'} })
        .complete(function(err, user){
          err.name.should.be.exactly('SequelizeDatabaseError')
          done();
        })
    });

    it('is invalid without an email', function(done){
      models
        .User
        .create({ where: {name: 'test'} })
        .complete(function(err, user){
          err.name.should.be.exactly('SequelizeDatabaseError')
          done();
        })
    });

    it('is invalid if email already exists', function(done){
      models
        .User
        .findOrCreate({ where: {email: 'test@test.com', name: 'test'} })
        .complete(function(err, user){
          models
            .User
            .create({ where: {name: 'test'} })
            .complete(function(err, user){
              err.name.should.be.exactly('SequelizeDatabaseError')
              done();
            })
        })
    });
  })

  describe('authentication', function(){
    it('sets the password hash from the password field', function(done){
      var new_user = models.User.build({ password: '123' })
      new_user.getDataValue('password_hash').should.not.be.exactly(undefined);
      done();
    });

    it('compares password with hash and returns true if they match', function(done){
      var new_user = models.User.build({ password: '123' })
      new_user.validatePassword('123').should.be.exactly(true);
      done();
    });

    it('compares password with hash and returns true if they match', function(done){
      var new_user = models.User.build({ password: '123' })
      new_user.validatePassword('1233').should.be.exactly(false);
      done();
    });
  });
});

