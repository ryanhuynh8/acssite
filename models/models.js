var sq = require("../db");
var User = require("./user");
var Task = require("./task");

Task.belongsTo(User, {
    foreignKey: 'posted_by'
});
User.hasMany(Task, {
    foreignKey: 'posted_by'
});

Task.findByUserCreated = function(user_id) {
    Task.findAll({
        where: {
            posted_by: user_id
        }
    })
    .then(function(result) {
        return result;
    });
}

Task.Foo = "Foo";

exports.User = User;
exports.Task = Task;
