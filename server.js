/* system modules */
var express = require('express');
var session = require('express-session');
var bodyParser = require('body-parser');
var cors = require('cors');
var RedisStore = require('connect-redis')(session);
var app = express();

var _ = require('underscore');

/* user-defined modules */
var api = require('./api');

app.use(session({
  store: new RedisStore({
    host: '127.0.0.1',
    port: 6379,
  }),
  secret: '2,M@bQ2T&U~fnMH`U"r=3kMe}|1,2A',
  saveUninitialized: false,
  resave: false,
  ttl: 3600
}));
// app.use(cors());
app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded
app.use('/api', api);
app.use(express.static('public'));

app.listen(8080);
console.log('Express started on port 8080');

