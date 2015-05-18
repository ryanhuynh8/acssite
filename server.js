var express = require('express');
var app = express();
var Models = require("./models/models");

//Models.initModels();
var Task = Models.Task;
var User = Models.User;

app.get('/', function(req, res) {
  // Task.findAll({
  //   include: [{
  //     model: User,
  //     attributes: ['email']
  //   }],
  //   where: {
  //     readed: false
  //   }
  // }).then(function(result) {
  //   res.send(JSON.stringify(result));
  //   res.end();
  // });
  var tasks = Task.findByUserCreated(69);
  res.send(JSON.stringify(tasks));
  res.send(Task.Foo);
  res.end();
});

app.listen(8080);
console.log('Express started on port 8080');
