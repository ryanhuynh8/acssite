var sq = require("../db");
var User = require("./user");
var Task = require("./task");
var Announcement = require("./announcement");
var Employee = require("./employee");
var Builder = require("./builder");
var Customer = require("./customer");
var Unit = require("./unit");

/* relationships */
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

Customer.hasMany(Unit, {
    foreignKey: 'customer_id'
});

Unit.removeAttribute('id');

/* exports */
exports.User = User;
exports.Task = Task;
exports.Announcement = Announcement;
exports.Customer = Customer;
exports.Unit = Unit;