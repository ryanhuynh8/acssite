var router = require('express').Router();
var crypto = require('crypto');
var moment = require('moment');
var Models = require("./models/models");
var Task = Models.Task;
var User = Models.User;
var Announcement = Models.Announcement;

function auth_require(req,res,roles)
{
  // if (req.session.uid == null)
  // {
  //   res.json({message: "Access denied"});
  //   res.status(404);
  //   res.end();
  // }
  // else
  return true;
}

// LIST ALL INCOMPLETED TASK: /api/task/incompleted
router.get('/task/incompleted', function(req, res) {
  if (!auth_require(req, res, 'admin')) return;

  Task.findAll({
    include: {
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

// LIST TASKS FOR CURRENT LOGGED IN USER: /api/task/list
router.get('/task/list', function(req, res) {
  if (!auth_require(req, res, 'admin')) return;
  var user_id = req.session.user_id;
  Task.findAll({
    include: [{
      model: User,
      as: 'assignee',
      attributes: ['id'],
      where: { 'id' : user_id }
    },
    {
      model: User,
      as: 'poster',
      attributes: ['first_name', 'last_name']
    }],
  }).then(function(tasks) {
    res.json(tasks);
    res.end();
  });
});

// LIST ALL TASK: /api/task/list/all
router.get('/task/list/all', function(req, res) {
  if (!auth_require(req, res, 'admin')) return;

  Task.findAll({
    include: [{
      model: User,
      as: 'assignee',
      attributes: ['first_name', 'last_name']
    },
    {
      model: User,
      as: 'poster',
      attributes: ['first_name', 'last_name']
    }]
  }).then(function(tasks) {
    res.json(tasks);
    res.end();
  });
});

// LIST ALL USER: /api/user/list
router.get('/user/list', function(req, res) {
  if (!auth_require(req, res, 'admin')) return;

  User.findAll({
    attributes: ['id','role_id', 'first_name', 'last_name']
  }).then(function(users) {
    res.json(users);
    res.end();
  });
});

// LOGIN: /api/auth/<username>
router.post('/auth/:user_name/:password', function(req, res) {
  User.findOne({
    where: {
      user_name: req.params.user_name
    },
    attributes: ['id', 'password', 'first_name', 'last_name']
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
      // issue new session and invalidate the old one to prevent session-fixation
      req.session.regenerate(function() {
        req.session.user_id = user.id;
        req.session.loggedin = true;
        res.json({
          message: 'authorized',
          name: user.first_name + ' ' + user.last_name
        });
        res.end();
      });
    }
    else
    {
      res.json({ message : 'unauthorized' });
      res.end();
    }
  });
});

// UPDATE TASK DETAILS: /api/task/update
router.post('/task/update', function(req, res) {
    if (!auth_require(req, res, 'admin')) return;
    // TODO: confirm task's owner or admin

    var task_to_update = req.body;
    Task.findOne({
      attributes: ['id', 'row_version'],
      where: {
        id : task_to_update.id
      }
    })
    .then(function(task_original) {
      if (task_to_update.row_version === task_original.row_version)
      {
        Task.update({
          'task_description': task_to_update.task_description,
          'assign_by': task_to_update.assign_by,
          'due_date': task_to_update.due_date
          },{
          where: {
            id: task_to_update.id
          }
        }).then(function(result){
          res.json({ message: 'success'})  ;
        }).catch(function(err) {
          res.json({ message: err });
        }).finally(function(result){
          res.end();
        });
      } else {
        res.json({ message: 'error_modified'});
      }
    });
});

router.get('/announcement/list', function(req, res) {
  if (!auth_require(req, res, 'admin')) return;

  Announcement.findAll({
    where: {
      expired_date: { $gte: moment().format() }
    },
    order: 'post_on_date DESC'
  }).then(function(list){
    res.json(list);
    res.end();
  });
});

exports = module.exports = router;