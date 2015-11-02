var router = require('express').Router();
var cors = require('cors');
var crypto = require('crypto');
var moment = require('moment');
var Models = require("./models/models");
var Task = Models.Task;
var Ticket = Models.Ticket;
var User = Models.User;
var Announcement = Models.Announcement;
var Customer = Models.Customer;
var Unit = Models.Unit;

router.use(cors({
  credentials: true
}));

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
            name: user.first_name + ' ' + user.last_name,
            sid: req.session.id
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
      else {
        res.status(503).send('database error');  // causing race condition
      }
      res.end();

    })
    .finally(function () {
      // res.end();
    });
});

router.get('/logout', function(req, res) {
  req.session.destroy();
  res.status(201);
  res.json({ message: 'success' });
  res.end();
});

// LIST TASKS FOR CURRENT LOGGED IN USER
router.get('/task/list', function(req, res) {
  if (!auth_require(req, res, 'admin')) return;

  var user_id = req.session.user_id;
  //var user_id=24;
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
  // var user_id = 24;
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

    if (!req.session.user_id)
    {
      res.status(401).end();
      return;
    }

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
  // var user_id=24;
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

// DELETE A TASK
router.post('/task/delete', function(req, res) {
  if (!auth_require(req, res, 'admin')) return;
  // TODO: confirm task's owner or admin
  var item_to_delete = req.body;

  Task.destroy({
    where: {
      id: item_to_delete.id
    }
  })
  .then(function(result) {
    res.json({
      message: "success"
    });
  })
  .catch(function(err) {
    console.log(err);
    res.json({
      message: err
    });
  })
  .finally(function() {
    res.end();
  });
});

// UPDATE TASK DETAILS
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
        }).end();
      }
    });
});

// LIST ALL USER
router.get('/user/list', function(req, res) {
  if (!auth_require(req, res, 'admin')) return;

  User.findAll({
    attributes: ['id', 'role_id', 'first_name', 'last_name']
  }).then(function(users) {
    res.json(users);
    res.end();
  });
});

// LIST ALL USER WITH FULL INFORMATION
router.get('/user/list_fullinfo', function(req, res) {
  if (!auth_require(req, res, 'admin')) return;

  User.findAll({
  }).then(function(users) {
    res.json(users);
    res.end();
  });
});

// ADD NEW USER
router.post('/user/new', function(req, res) {
  if (!auth_require(req, res, 'admin')) return;

  var model = req.body;
  // TODO: check for duplicate user_name before processing
  User.create(model)
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

router.post('/user/update', function(req, res) {
  if (!auth_require(req, res, 'admin')) return;
  // TODO: confirm task's owner or admin

  var user_to_update = req.body;
  User.update({
    first_name: user_to_update.first_name,
    middle_name: user_to_update.middle_name,
    last_name: user_to_update.last_name,
    user_name: user_to_update.user_name,
    password: user_to_update.password,
    email: user_to_update.email,
    address: user_to_update.address,
    city: user_to_update.city,
    state: user_to_update.state,
    zip: user_to_update.zip,
    phone1: user_to_update.phone1,
    phone2: user_to_update.phone2,
    ss_number: user_to_update.ss_number,
    dob: user_to_update.dob,
    date_hired: user_to_update.date_hired,
    sex: user_to_update.sex,
    employee_type: user_to_update.employee_type
  }, {
    where: {
      id: user_to_update.id
    }})
  .then(function(result) {
    res.json({
      message: 'success'
    });
  })
  .catch(function(err) {
    res.json({
      message: err
    });
  })
  .finally(function(result) {
      res.end();
  });
});

// DELETE AN ANNOUNCEMENT
router.post('/announcement/delete', function(req, res) {
  if (!auth_require(req, res, 'admin')) return;
  // TODO: confirm task's owner or admin
  
  var item_to_delete = req.body;

  Announcement.destroy({
    where: {
      id: item_to_delete.id
    }
  })
  .then(function(result) {
    res.json({
      message: "success"
    });
  })
  .catch(function(err) {
    console.log(err);
    res.json({
      message: err
    });
  })
  .finally(function() {
    res.end();
  });
});

// LIST ALL ANNOUNCEMENT BEFORE THE EXPIRING DATE AND AFTER THE POST_ON DATE
router.get('/announcement/list', function(req, res) {
  if (!auth_require(req, res, 'admin')) return;

  Announcement.findAll({
    where: {
      expired_date: {
        $gte: moment().format()
      },
      post_on_date: {
        $lte: moment().format()
      }
    },
    order: 'create_on DESC'
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
  if ((model.expired_date === undefined) || (model.task_description === undefined)) {
    res.status(400);
    res.json({
      message: 'invalid'
    });
    res.end();
    return;
  }

  var new_announcement = {};
  new_announcement.expired_date = model.expired_date;
  new_announcement.announcements_description = model.task_description;
  new_announcement.post_on_date = model.post_on_date;

  Announcement.create(new_announcement)
    .then(function(result) {
      res.status(201);
      res.json({
        message: 'success'
      });
    })
    .catch(function(err) {
      res.status(503);
      res.json({
        message: err
      });
      console.log(err);
    })
    .finally(function() {
      res.end();
    });
});

router.post('/customer/new', function(req, res) {
  if (!auth_require(req, res, 'admin')) return;

  if (!req.session.user_id) {
    res.status(401).end();
    return;
  }

  var newCustomer = req.body;
  Customer.create(newCustomer)
    .then(function(result) {
      for (var i = 0, len = newCustomer.units.length; i < len; i++) {
        if (newCustomer.units[i] !== null) {
          var newUnit = {};
          newUnit.customer_id = result.id;
          newUnit.make = newCustomer.units[i].make;
          newUnit.model = newCustomer.units[i].model;
          newUnit.serial = newCustomer.units[i].serial;
          Unit.create(newUnit);
        }
      }
      res.status(201);
      res.json({
        message: 'success'
      });
    })
    .catch(function(err) {
      res.status(503);
      res.json({
        message: err
      });
    })
    .finally(function() {
      res.end();
    });
});

router.post('/customer/update', function(req, res) {
  if (!auth_require(req, res, 'admin')) return;

  var updateCustomer = req.body;
  Customer.update({
    type: updateCustomer.type,
    first_name: updateCustomer.first_name,
    last_name: updateCustomer.last_name,
    address: updateCustomer.address,
    address2: updateCustomer.address2,
    city: updateCustomer.city,
    state: updateCustomer.state,
    zipcode: updateCustomer.zipcode,
    phone1: updateCustomer.phone1,
    phone2: updateCustomer.phone2,
    email:updateCustomer.email,
    referral: updateCustomer.referral,
    builder_1: updateCustomer.builder_1,
    builder_2: updateCustomer.builder_2,
    builder_3: updateCustomer.builder_3
  }, {
    where: {
      id: updateCustomer.id
    }})
  .then(function(result) {
    /* remove all units and re-add them again */
      Unit.destroy({
        where: {
          customer_id: updateCustomer.id
        }
      }).then(function(){
          for (var i = 0, len = updateCustomer.units.length; i < len; i++) {
            if (updateCustomer.units[i] !== null) {
              var newUnit = {};
              newUnit.customer_id = updateCustomer.id;
              newUnit.make = updateCustomer.units[i].make;
              newUnit.model = updateCustomer.units[i].model;
              newUnit.serial = updateCustomer.units[i].serial;
              Unit.create(newUnit);
            }
          }
          res.status(201);
      });
  })
  .catch(function(err) {
    res.json({
      message: err
    });
  })
  .finally(function(result) {
      res.end();
  });
});

// LIST ALL USER
router.get('/customer/list', function(req, res) {
  if (!auth_require(req, res, 'admin')) return;

  Customer.findAll({})
    .then(function(customers) {
      res.json(customers);
      res.end();
    });
});

router.post('/customer/delete', function(req, res) {
  if (!auth_require(req, res, 'admin')) return;

  var item_to_delete = req.body;

  Customer.destroy({
      where: {
        id: item_to_delete.id
      }
    })
    .then(function(result) {
      Unit.destroy({
          where: {
            customer_id: item_to_delete.id
          }
        })
        .then(function() {
          res.json({
            message: "success"
          });
        });
    });
});

router.get('/customer/unit/:id', function(req, res) {
  if (!auth_require(req, res, 'admin')) return;

  var id = req.params.id;
  Unit.findAll({
      where: {
        customer_id: id
      }
    })
    .then(function(result) {
      res.json(result);
      res.end();
    });
});

router.post('/customer/search', function(req, res) {
  if (!auth_require(req, res, 'all')) return;

  var search_params = req.body;

  // semi- query building
  var opt_address = {};
  var opt_name = {};

  if (search_params.address === undefined || search_params.address === '')
    opt_address = { ne: 'NULL' };
  else
    opt_address = { like: '%' + search_params.address + '%' };
    
  if (search_params.name === undefined || search_params.name === '')  
    opt_name = { ne: 'NULL' };
  else
    opt_name = { like: '%' + search_params.name + '%' };
    
  Customer.findAll({
    where: {
      address: opt_address,
      $or: [
        { first_name: opt_name },
        { last_name: opt_name }
      ]
    },
  })
  .then(function(tasks) {
    res.status(200);
    res.json(tasks);
    res.end();
  });
});

// LIST ALL TICKETS
router.get('/tickets', function(req, res) {
  if (!auth_require(req, res, 'admin')) return;

  Ticket.findAll({})
    .then(function(tickets) {
      res.json(tickets);
      res.end();
    });
});

// DELETE A TASK
router.post('/ticket/delete', function(req, res) {
  if (!auth_require(req, res, 'admin')) return;
  var item_to_delete = req.body;

  Ticket.destroy({
    where: {
      id: item_to_delete.id
    }
  })
  .then(function(result) {
    res.json({
      message: "success"
    });
  })
  .catch(function(err) {
    console.log(err);
    res.json({
      message: err
    });
  })
  .finally(function() {
    res.end();
  });
});


// CREATE A NEW TICKET
router.post('/ticket/new', function(req, res) {
    if (!auth_require(req, res, 'admin')) return;

    if (!req.session.user_id)
    {
      res.status(401).end();
      return;
    }

    var ticket = req.body;
    // is the data typeof Task?
    if ((ticket.due_date === undefined) || (ticket.task_description === undefined) || (ticket.assign_by === undefined))
//    {
//      res.status(400);
//      res.json({ message: 'invalid' });
//      res.end();
//      return;
//    }

    ticket.create_by = req.session.user_id;
    
    Ticket.create(ticket)
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