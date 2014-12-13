module.exports = function(passport) {
  var LocalStrategy  = require('passport-local').Strategy;
  var BearerStrategy = require('passport-http-bearer').Strategy;
  var User           = require(__dirname + '/../models/index').User;

  passport.serializeUser(function(user, done) {
    done(null,user.values.id);
  });

  passport.deserializeUser(function(id, done) {
    console.log(id);
    User
      .find({ where: { id: id } })
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
        .find({ where: { email: username } })
        .then(function(user) {
          if(user) {
            if(user.validatePassword(password))
              user.createTokenIfNotExists().complete(function(err) { done(err,user); })
            else
              done(null, false, { error: 'The password you typed does not match this email' });
          } else {
            done(null, false, { error: 'The email you typed does not exist' });
          }
        })
    }
  ));

  // Token based auth
  passport.use(new BearerStrategy(
    function(token, done) {
      User
        .find({ where: { token: token } })
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
