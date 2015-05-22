/* system modules */
var express = require('express');
var session = require('express-session');
var app = express();
var router = express.Router();
var crypto = require('crypto');
var _ = require('underscore');

/* user-defined modules */
var Models = require("./models/models");
var Task = Models.Task;
var User = Models.User;

/* authentication array */
var auth_required = ['/tasks','/profile'];

router.use(authenticateInterceptor);

function authenticateInterceptor(req, res, next)
{
  if (_.contains(auth_required, req.url))
  {
    if (!req.session.uid)
    {
      res.status(404);
      res.json({message: "Access denied"});
      res.end();
    }
    else 
    {
      next();
    }
  }
  next();
}


// LIST ALL INCOMPLETED TASK: /api/task/incompleted
router.get('/task/incompleted', function(req, res) {
  Task.findAll({
    include: {
      model: User,
      as: 'assignee',
      attributes: ['first_name', 'last_name']
    },
    where:{
      status_task_id: 19
    }
  })
  .then(function (tasks) {
    res.json(tasks);
    res.end();
  });
});

// LIST ALL TASK: /api/task/list
router.get('/task/list', function(req, res) {
  Task.findAll({
    include: {
      model: User,
      as: 'assignee',
      attributes: ['first_name', 'last_name']
    }
  }).then(function(tasks) {
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
    attributes: ['user_name', 'password']
  })
  .then(function (user) {
    if (!user) {
      res.json({ message : 'unauthorized' });
      return;
    }
    var md5Hash = crypto.createHash('md5');
    md5Hash.update(req.params.password);
    var hashed = md5Hash.digest('hex');
    if (hashed === user.password)
    {
      req.session.uid = user.user_id;
      req.session.loggedin = true;
      res.json({ message: 'authorized'});
      //res.json(req.session);
    }
    else
      res.json({ message : 'unauthorized' });

    res.end();
  });
});

app.use(session({
  secret: '2,M@bQ2T&U~fnMH`U"r=3kMe}|1,2A',
  saveUninitialized: false,
  resave: false
}));

app.use('/api', router);
app.use(express.static('public'));

app.listen(8080);
console.log('Express started on port 8080');
