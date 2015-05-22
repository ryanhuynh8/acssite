var express = require('express');
var cors = require('cors');
var cookieParser = require('cookie-parser');
var session = require('express-session');
var app = express();

//app.use(cors());
//app.use(express.bodyParser());
app.use(cookieParser());
app.use(session({ secret: 'this is a test' }));

app.get('/login', function(req, res) {
  req.session.uid = 'user001';
  res.send(req.session);
});


app.get('*', function(req, res) {
  res.send(req.session);
});

app.listen(8080);