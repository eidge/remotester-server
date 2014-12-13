var express = require('express');
var router = express.Router();
var passport = require('passport');

require('../config/passport')(passport);

router.get('/me',        passport.authenticate('bearer', { session: false }), me);
router.post('/signin',   passport.authenticate('local', { session: false }), signin);
router.post('/signup',   passport.authenticate('bearer', { session: false }), signup);
router.delete('/signin', signout);

function me(req, res) {
  res.send(req.user);
}

function signin(req, res) {
  res.status(201).send(req.user.values);
}

function signup(req, res) {
  res.send(req.user);
}

function signout(req, res) {
  res.send("signed out");
}


module.exports = router;
