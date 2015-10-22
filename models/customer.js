var sq = require("../db");
var Sequelize = require("sequelize");

var Customer = module.exports = sq.define('Customer', { 
  id: {
    type: Sequelize.INTEGER(11),
    primaryKey: true,
    autoIncrement: true,
    allowNull: false,
  },
  type: {
    type: Sequelize.INTEGER(11),
    allowNull: false,
  },
  first_name: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  last_name: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  address: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  city: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  state: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  zipcode: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  phone1: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  phone2: {
    type: Sequelize.STRING,
    allowNull: true,
  },
  email: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  referral: {
    type: Sequelize.INTEGER(11),
    allowNull: true,
  },
  address2: {
    type: Sequelize.STRING,
    allowNull: true,
  },
  builder_1: {
    type: Sequelize.INTEGER(11),
    allowNull: true,
  },
  builder_2: {
    type: Sequelize.INTEGER(11),
    allowNull: true,
  },
  builder_3: {
    type: Sequelize.INTEGER(11),
    allowNull: true,
  }
},{
  tableName: 'tbl_customers',
  timestamps: false
});

