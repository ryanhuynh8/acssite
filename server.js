/* system modules */
var express = require('express');
var app = express();
var router = express.Router();
var crypto = require('crypto');

/* user-defined modules */
var Models = require("./models/models");
var Task = Models.Task;
var User = Models.User;

// Task.findAll({
//   include: [{
//     model: User,
//     attributes: ['email']
//   }],
//   where: {
//     readed: false
//   }

router.use(function (req, res, next) {
  console.log('Time: ', Date.now());
  next();
});

// LIST ALL INCOMPLETED TASK: /api/task/incompleted
router.get('/task/incompleted', function(req, res) {
  Task.findAll({
    where:{
      status_task_id: 19
    }
  })
  .then(function (tasks) {
    res.json(tasks);
    res.end();
  });
});

// LOGIN: /api/auth/<username>
router.post('/auth/:user_name/:password', function(req, res) {
  User.findOne({
    where: {
      user_name: req.params.user_name
    },
    attributes: ['password']
  })
  .then(function (user) {
    if (!user) {
      res.send("Login failed.");
      return;
    }
    var md5Hash = crypto.createHash('md5');
    md5Hash.update(req.params.password);
    var hashed = md5Hash.digest('hex');
    if (hashed === user.password)
      res.send("Authorized.");
    else
      res.send("Login failed.");
    res.end();
  });
});

app.use('/api', router);
app.use(express.static('web'));

app.listen(8080);
console.log('Express started on port 8080');
