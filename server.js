const express = require('express');
const session = require('express-session');
const passport = require('passport');
const bodyParser = require('body-parser');


const PORT = process.env.PORT || 8080;
const routes = require('./routes');

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

app.set('view engine', 'ejs');

app.use(session({
  secret: 'some secret',
  resave: false,
  saveUninitialized: true,
  cookie: {},
}));
app.use(passport.initialize());
app.use(passport.session());

require('./config/passport')(passport);

app.use('/', routes);

app.listen(PORT, () => {
  console.log(`listening on ${PORT}`);
});