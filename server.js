var express = require('express');
var app = express();
var db = require('./config/config-db');
var Sequelize = require('sequelize');

function andRestrictToSelf(req, res, next) {
  if (req.authenticatedUser.id == req.user.id) {
    next();
  } else {
    next(new Error('Unauthorized'));
  }
}

function andRestrictTo(role) {
  return function(req, res, next) {
    if (req.authenticatedUser.role == role) {
      next();
    } else {
      next(new Error('Unauthorized'));
    }
  }
}

var connectionString = db.dialect+"://"+db.username+":"+db.password+"@"+db.host+":"+db.port+"/"+db.database;
var sq = new Sequelize(connectionString);

app.get('/', function(req, res){
  console.log(connectionString);
  sq.query("SELECT * FROM tbl_users")
  .then(function(data) {
    res.send(JSON.stringify(data));
    res.end();
  }).catch(function (err)
  {
    console.log(err);
  })
});

app.listen(8080);
console.log('Express started on port 8080');
