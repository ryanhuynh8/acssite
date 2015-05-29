var router = require('express').Router();
var crypto = require('crypto');
var Models = require("./models/models");
var Task = Models.Task;
var User = Models.User;

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

// LIST ALL TASK: /api/task/list
router.get('/task/list', function(req, res) {
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
    attributes: ['id', 'password']
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
      req.session.uid = user.id;
      req.session.loggedin = true;
      res.json({ message: 'authorized'});
    }
    else
      res.json({ message : 'unauthorized' });

    res.end();
  });
});

router.post('/task/update', function(req, res) {
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

exports = module.exports = router;