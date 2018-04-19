const passport = require('passport');
const LocalStrategy = require('passport-local');
const db = require('../db');
const bcrypt = require('bcrypt-nodejs');

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((user, done) => {
  done(null, user);
});

passport.use('signup', new LocalStrategy({
  usernameField: 'email',
  passwordField: 'password',
  passReqToCallback: true,
},
(req, email, password, done) => {
  // passport wont even try empty submissions
  if (validEmail(email)) { // add password validation on both sides. 
    db('login_user').where({email}).first().then(user => {
      if (user) {
        console.log('user already exists');
        return done(null, false); //flash message here
      } else {
        db('login_user').insert({
          email,
          password_digest: generateHash(password),
        })
        .returning('*').then(user => done(null, user[0]))
        .catch(err => err);
      }
    })
    .catch(err => err);
  } else {
    console.log('invalid email');
    return done(null, false);
  }
  
}));

passport.use('login', new LocalStrategy({
  usernameField: 'email',
  passwordField: 'password',
  passReqToCallback: true,
},
(req, email, password, done) => {
  db('login_user').where({email}).first().then(user => {
    if (!user) {
      console.log('user not found');
      return done(null, false);
    }
    
    if (!validPassword(password, user.password_digest)) {
      console.log('password mismatch');
      return done(null, false);
    }

    return done(null, user);
  })
  .catch(err => err);
}));

function generateHash(password) {
  return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
}

function validPassword(password, passwordHash) {
  return bcrypt.compareSync(password, passwordHash);
}

function validEmail(email) {
  const re = /[^\s@]+@[^\s@]+\.[^\s@]+/; // Not the strongest email check
  return re.test(email);
}