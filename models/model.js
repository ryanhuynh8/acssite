var sq = require("../db");
var user = require("./user");

exports.initModels = function()
{
    exports.User = user.User;
};
