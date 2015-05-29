var sq = require("../db");
var User = require("./user");
var Task = require("./task");
var Announcement = require("./announcement");
var Employee = require("./employee");

Task.belongsTo(User, {
    foreignKey: 'posted_by',
    as: 'poster'
});

Task.belongsTo(User, {
    foreignKey: 'assign_by',
    as: 'assignee'
});

User.hasMany(Task, {
    foreignKey: 'posted_by'
});

exports.User = User;
exports.Task = Task;
exports.Announcement = Announcement;