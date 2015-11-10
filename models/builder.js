var sq = require("../db");
var Sequelize = require("sequelize");

var Builder = module.exports = sq.define('Builder', { 
    builder_id: {
      type: Sequelize.BIGINT,
      primaryKey: true,
      autoIncrement: true,      
      allowNull: false,
    },
    full_name: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    address: {
      type: Sequelize.STRING,
      allowNull: true,
    },
    city: {
      type: Sequelize.STRING,
      allowNull: true,
    },
    state: {
      type: Sequelize.STRING,
      allowNull: true,
    },
    zip: {
      type: Sequelize.STRING,
      allowNull: true,
    },
    contact_name: {
      type: Sequelize.STRING,
      allowNull: true,
    },
    phone1: {
      type: Sequelize.STRING,
      allowNull: true,
    },
    phone2: {
      type: Sequelize.STRING,
      allowNull: true,
    },
    fax: {
      type: Sequelize.STRING,
      allowNull: true,
    },
    office_number: {
      type: Sequelize.STRING,
      allowNull: true,
    },
    discount: {
      type: Sequelize.DECIMAL(10,0),
      allowNull: true,
    },
    deduct_from_contractor: {
      type: Sequelize.INTEGER(4),
      allowNull: true,
    },
    id_counter: {
      type: Sequelize.INTEGER(11),
      allowNull: true
    }
  }, {
    tableName: 'tbl_builders',
    timestamps: false    
  });

