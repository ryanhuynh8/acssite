var express = require('express');
var app = express();
var sq = require("./db");
var Model = require("./models/model");

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


app.get('/', function(req, res){
    
});

Model.initModels();

// check if User model is already loaded
if (Model.User !== undefined)   
{
  var User = Model.User;
  User.find(48).then(function(user){
    console.log(JSON.stringify(user));
  });
}

app.listen(8080);
console.log('Express started on port 8080');
