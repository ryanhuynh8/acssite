var db_config = require('./config/config-db');
var Sequelize = require('sequelize');
var connectionString = db_config.dialect+"://"+db_config.username+":"+db_config.password+"@"+db_config.host+":"+db_config.port+"/"+db_config.database;
var sq = new Sequelize(connectionString);

module.exports = sq;