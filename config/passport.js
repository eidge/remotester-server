module.exports = function(passport) {
  var LocalStrategy  = require('passport-local').Strategy;
  var BearerStrategy = require('passport-http-bearer').Strategy;
  var User           = require('../models/index').User;

  var userAttributes = ['id', 'name', 'email'];

  passport.serializeUser(function(user, done) {
    done(null,user.values.id);
  });

  passport.deserializeUser(function(id, done) {
    console.log(id);
    User
      .find({ where: { id: id }, attributes: userAttributes })
      .then(function(user){
        console.log(user)
        return done(null, user);
      });
  });

  // Username & Password auth
  passport.use(new LocalStrategy({
      usernameField: 'email',
      passwordField: 'password'
    },
    function(username, password, done) {
      User
        .find({ where: { email: username }, attributes: userAttributes })
        .then(function(user) {
          if(user) {
            done(null, user);
          } else {
            done(null, false, { error: 'Wrong username or password' });
          }
        })
    }
  ));

  // Token based auth
  passport.use(new BearerStrategy(
    function(token, done) {
      User
        .find({ where: { email: token }, attributes: userAttributes })
        .then(function(user) {
          if(user) {
            done(null, user, { scope: 'all' });
          } else {
            done(null, false, { error: 'Invalid token' });
          }
        })
    }
  ));
}
