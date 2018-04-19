const express = require('express');
const passport = require('passport');
const router = express.Router();


router.get('/', (req, res) => {
  res.render('../src/index');
});

router.get('/signup', (req, res) => {
  res.render('../src/signup');
});

router.post('/signup', passport.authenticate('signup', {
  successRedirect: '/app',
  failureRedirect: '/signup',
  // failureFlash: true
}));

router.post('/login', passport.authenticate('login', {
  successRedirect: '/app',
  failureRedirect: '/',
}));

router.get('/app', isLoggedIn, (req, res) => {
  res.render('../src/app', {
    user: req.user,
  });
});

router.get('/logout', (req, res) => {
  req.logout();
  res.redirect('/');
});

module.exports = router;

function isLoggedIn(req, res, next) {
  console.log('is logged in?', req.isAuthenticated());
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect('/');
}