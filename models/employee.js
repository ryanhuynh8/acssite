var sq = require("../db");
var Sequelize = require("sequelize");

var Employee = module.exports = sq.define('Employee', {
  id: {
    type: Sequelize.BIGINT(20),
    primaryKey: true,
    autoIncrement: true,
    allowNull: false,
    field: 'employee_id'
  },
  first_name: {
    type: Sequelize.STRING(100),
    allowNull: true,
  },
  middle_name: {
    type: Sequelize.STRING(50),
    allowNull: true,
  },
  last_name: {
    type: Sequelize.STRING(100),
    allowNull: true,
  },
  address: {
    type: Sequelize.STRING(250),
    allowNull: true,
  },
  city: {
    type: Sequelize.STRING(150),
    allowNull: true,
  },
  state: {
    type: Sequelize.STRING(40),
    allowNull: true,
  },
  zip: {
    type: Sequelize.STRING(15),
    allowNull: true,
  },
  phone1: {
    type: Sequelize.STRING(20),
    allowNull: true,
  },
  phone2: {
    type: Sequelize.STRING(20),
    allowNull: true,
  },
  email: {
    type: Sequelize.STRING(150),
    allowNull: true,
  },
  ss_number: {
    type: Sequelize.STRING(20),
    allowNull: true,
  },
  sex: {
    type: Sequelize.INTEGER(4),
    allowNull: true,
  },
  dob: {
    type: Sequelize.DATE,
    allowNull: true,
  },
  date_hired: {
    type: Sequelize.DATE,
    allowNull: true,
  },
  commission: {
    type: Sequelize.DECIMAL(10, 0),
    allowNull: true,
  },
  builder_deduction: {
    type: Sequelize.DECIMAL(10, 0),
    allowNull: true,
  },
  created_date: {
    type: Sequelize.DATE,
    allowNull: true,
  },
  created_by: {
    type: Sequelize.BIGINT,
    allowNull: true,
  },
  status: {
    type: Sequelize.BOOLEAN,
    allowNull: true,
    defaultValue: false
  }
},{
  tableName: 'tbl_employees',
  timestamps: false, 
});
