var sq = require("../db");
var Sequelize = require("sequelize");

var Unit = module.exports = sq.define('Unit', { 
    customer_id: {
      type: Sequelize.INTEGER(11),
      allowNull: false,
    },
    make: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    model: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    serial: {
      type: Sequelize.STRING,
      allowNull: false,
    }
  }, {
    tableName: 'tbl_units',
    timestamps: false
  });
