const passport = require('passport');
const LocalStrategy = require('passport-local');
const db = require('../db');
const bcrypt = require('bcrypt-nodejs');

module.exports = () => {
  passport.serializeUser((user, done) => {
    done(null, user.id);
  });

  passport.deserializeUser((user, done) => {
    done(null, user);
  });

  passport.use('signup', new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password_digest',
    passReqToCallback: true,
  },
  (req, email, password, done) => {
    db('login_user').where({email}).first().then(user => {
      if (user) {
        return done(null, false, console.log('email is taken')); //flash message here
      } else {
        db('login_user').insert({
          email,
          password_digest: generateHash(password),
        })
        .returning().then(user => done(null, user))
        .catch(err => err);
      }
    })
    .catch(err => err);
  }));

}

function generateHash(password) {
  return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
}

function validPassword(password, passwordHash) {
  return bcrypt.compareSync(password, passwordHash);
}