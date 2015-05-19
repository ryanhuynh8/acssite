var express = require('express');
var app = express();
var router = express.Router();
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

// get all task
router.get('/task/incomplete', function(req, res) {
  Task.findAll({
    where:{
      status_task_id: 19
    }
  })
  .then(function (tasks) {
    res.json(tasks);
    res.end();
  })
})

app.use('/api', router);
app.use(express.static('web'));

app.listen(8080);
console.log('Express started on port 8080');
