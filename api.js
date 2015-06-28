var router = require('express').Router();
var crypto = require('crypto');
var moment = require('moment');
var Models = require("./models/models");
var Task = Models.Task;
var User = Models.User;
var Announcement = Models.Announcement;

function auth_require(req, res, roles) {
  // if (req.session.user_id == null)
  // {
  //   res.json({message: "Access denied"});
  //   res.status(401);
  //   res.end();
  // }
  // else
  return true;
}

// LIST TASKS FOR CURRENT LOGGED IN USER
router.get('/task/list', function(req, res)   {
  if (!auth_require(req, res, 'admin')) return;

  var user_id = req.session.user_id;
  Task.findAll({
    include: [{
      model: User,
      as: 'assignee',
      attributes: ['id'],
      where: {
        id: user_id
      }
    }, {
      model: User,
      as: 'poster',
      attributes: ['first_name', 'last_name']
    }],
    where: {
        status_task_id: 19
    },
    order: 'create_on DESC',
    limit : 100
  }).then(function(tasks) {
    res.json(tasks);
    res.end();
  });
});

// LIST ARCHIVED TASKS FOR CURRENT LOGGED IN USER
router.get('/task/list/archived', function(req, res)   {
  if (!auth_require(req, res, 'admin')) return;

  var user_id = req.session.user_id;
  Task.findAll({
    include: [{
      model: User,
      as: 'assignee',
      attributes: ['id'],
      where: {
        id: user_id
      }
    }, {
      model: User,
      as: 'poster',
      attributes: ['first_name', 'last_name']
    }],
    where: {
        status_task_id: 21
    },
    order: 'create_on DESC',
  }).then(function(tasks) {
    res.json(tasks);
    res.end();
  });
});

// LIST ALL TASK
router.get('/task/all/list', function(req, res) {
  if (!auth_require(req, res, 'admin')) return;

  Task.findAll({
    include: [{
      model: User,
      as: 'assignee',
      attributes: ['first_name', 'last_name']
    }, {
      model: User,
      as: 'poster',
      attributes: ['first_name', 'last_name']
    }],
    order: [['create_on','DESC']]
  }).then(function(tasks) {
    res.json(tasks);
    res.end();
  });
});

// LIST ALL INCOMPLETED TASK
router.get('/task/all/archived', function(req, res) {
  if (!auth_require(req, res, 'admin')) return;

  Task.findAll({
    include: [{
      model: User,
      as: 'assignee',
      attributes: ['first_name', 'last_name']
    }, {
      model: User,
      as: 'poster',
      attributes: ['first_name', 'last_name']
    }],
    where: {
      status_task_id: 21
    },
    order: [['create_on','DESC']]
  }).then(function(tasks) {
    res.json(tasks);
    res.end();
  });
});

// CREATE A NEW TASK
router.post('/task/new', function(req, res) {
    if (!auth_require(req, res, 'admin')) return;

    var task = req.body;
    // is the data typeof Task?
    if ((task.due_date === undefined) || (task.task_description === undefined) || (task.assign_by === undefined))
    {
      res.status(400);
      res.json({ message: 'invalid' });
      res.end();
      return;
    }

    task.posted_by = req.session.user_id;
    Task.create(task)
      .then(function(result){
        res.status(201);
        res.json({ message: 'success' })
      })
      .catch(function(err) {
        res.status(503);
        res.json({ message: err });
        console.log(err);
      })
      .finally(function() {
        res.end();
      })
})

// GENERIC SEARCH FUNCTION
var searchTask = function(req, res, search_params) {
  
  // semi- query building
  var opt_task = {};
  var opt_assigned_by = {};
  var opt_status = {};
  var opt_id = {};
  
  if (search_params.user_id === undefined)
    opt_id = { ne: 'NULL' };
  else
    opt_id = { like: search_params.user_id };

  if (search_params.assignee === undefined)
    opt_id = { ne: 'NULL' };
  else
    opt_id = { like : search_params.assignee };
    
  if (search_params.task_description === undefined)
    opt_task = { ne: 'NULL' };
  else
    opt_task = { like : '%'+ search_params.task_description +'%' };

  if (search_params.assigned_by === undefined)
    opt_assigned_by = { ne: 'NULL' };
  else
    opt_assigned_by = { like : search_params.assigned_by };
    
  if (search_params.status === undefined)
    opt_status = { ne: 'NULL' };
  else
    opt_status = { like: search_params.status };
  
  Task.findAll({
    include: [
      {
        model: User,
        as: 'assignee',
        attributes: ['id', 'first_name', 'last_name'],
        where: {
          id: opt_id
        }
      },
      {
        model: User,
        as: 'poster',
        attributes: ['first_name', 'last_name'],
        where: {
          id: opt_assigned_by
        }
      }
    ],
    where: {
      task_description: opt_task,
      status_task_id: opt_status
    },
    order: 'due_date DESC',
    limit: 100
  })
  .then(function(tasks) {
    res.status(200);
    res.json(tasks);
  })
  .catch(function(err){
    console.log(err);
    res.status(500);
  })
  .finally(function(){
    res.end();
  });
};

// SEARCH FOR TASKS BASE ON VARIOUS CRITERIAS
router.post('/task/search', function(req, res) {
  if (!auth_require(req, res, 'all')) return;

  var user_id = req.session.user_id;
  var search_params = req.body;

  search_params.user_id = user_id;
  searchTask(req, res, search_params);
});

// SEARCH FOR TASKS BASE ON VARIOUS CRITERIAS
router.post('/task/all/search', function(req, res) {
  if (!auth_require(req, res, 'all')) return;

  var search_params = req.body;
  searchTask(req, res, search_params);
});

// MARK TASK AS READED
router.post('/task/readed', function(req, res) {
  if (!auth_require(req, res, 'admin')) return;
  // TODO: confirm task's owner or admin

  var task_to_update = req.body;
  Task.update({
      readed: true
    }, {
      where: {
        id: task_to_update.id
      }
    })
    .then(function(result) {
      res.status(200);
      res.json({
        message: 'success'
      });
    })
    .catch(function(err) {
      res.status(500);
      res.json({
        message: err
      });
    })
    .finally(function(result) {
      res.end();
    });
});

// ARCHIVE A TASK (ie. set status to 19)
router.post('/task/archive', function(req, res) {
  if (!auth_require(req, res, 'admin')) return;
  // TODO: confirm task's owner or admin

  var task_to_update = req.body;
  Task.update({
      status_task_id: 21,
      readed: true
    }, {
      where: {
        id: task_to_update.id
      }
    })
    .then(function(result) {
      res.status(200);
      res.json({
        message: 'success'
      });
    })
    .catch(function(err) {
      res.status(500);
      res.json({
        message: err
      });
    })
    .finally(function(result) {
      res.end();
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
        id: task_to_update.id
      }
    })
    .then(function(task_original) {
      if (task_to_update.row_version === task_original.row_version) {
        Task.update({
          'task_description': task_to_update.task_description,
          'assign_by': task_to_update.assign_by,
          'due_date': task_to_update.due_date,
          'row_version' : task_to_update.row_version + 1
        }, {
          where: {
            id: task_to_update.id
          }
        }).then(function(result) {
          res.json({
            message: 'success'
          });
        }).catch(function(err) {
          res.json({
            message: err
          });
        }).finally(function(result) {
          res.end();
        });
      }
      else {
        res.json({
          message: 'error_modified'
        });
      }
    });
});

// LIST ALL USER: /api/user/list
router.get('/user/list', function(req, res) {
  if (!auth_require(req, res, 'admin')) return;

  User.findAll({
    attributes: ['id', 'role_id', 'first_name', 'last_name']
  }).then(function(users) {
    res.json(users);
    res.end();
  });
});

// LOGIN: /api/auth/<username>
router.post('/auth', function(req, res) {
  User.findOne({
      where: {
        user_name: req.body.user_name
      },
      attributes: ['id', 'password', 'first_name', 'last_name']
    })
    .then(function(user) {
      if (!user) {
        throw new Error('INVALID_LOGIN');
      }

      var md5Hash = crypto.createHash('md5');
      md5Hash.update(req.body.password);
      var hashed = md5Hash.digest('hex');
      if (hashed === user.password) {
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
      else {
        throw new Error('INVALID_LOGIN');
      }
    })
    .catch(function (error) {
      console.log('FAILED', error);
      if (error.message === 'INVALID_LOGIN')
      {
        res.status(401).send('invalid');
      }
      else
        res.status(503).send('database error');  // causing race condition
      res.end();

    })
    .finally(function () {
      // res.end();
    });
});

// LIST ALL ANNOUNCEMENT BEFORE THE EXPIRING DATE
router.get('/announcement/list', function(req, res) {
  if (!auth_require(req, res, 'admin')) return;

  Announcement.findAll({
    where: {
      expired_date: {
        $gte: moment().format()
      }
    },
    order: 'post_on_date DESC'
  }).then(function(list) {
    res.json(list);
    res.end();
  });
});

// CREATE A NEW ANNOUNCEMENT
router.post('/announcement/new', function(req, res) {
    if (!auth_require(req, res, 'admin')) return;

    var model = req.body;
    // is the data typeof Announcement?
    if ((model.expired_date === undefined) || (model.task_description === undefined))
    {
      res.status(400);
      res.json({ message: 'invalid' });
      res.end();
      return;
    }

    var new_announcement = {};
    new_announcement.expired_date = model.expired_date;
    new_announcement.announcements_description = model.task_description;

    Announcement.create(new_announcement)
      .then(function(result){
        res.status(201);
        res.json({ message: 'success' });
      })
      .catch(function(err) {
        res.status(503);
        res.json({ message: err });
        console.log(err);
      })
      .finally(function() {
        res.end();
      });
});

exports = module.exports = router;