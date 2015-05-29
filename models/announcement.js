var sq = require("../db");
var Sequelize = require("sequelize");

var Announcement = sq.define('Announcement', {
  id: {
    type: Sequelize.BIGINT(20),
    primaryKey: true,
    autoIncrement: true,
    allowNull: false,
    field: 'announcements_id'
  },
  create_on: {
    type: Sequelize.DATE,
    allowNull: true,
  },
  post_on_date: {
    type: Sequelize.DATE,
    allowNull: true,
  },
  expired_date: {
    type: Sequelize.DATE,
    allowNull: true,
  },
  announcements_description: {
    type: Sequelize.TEXT,
    allowNull: true,
  }
}, {
  tableName: 'tbl_announcements',
  timestamps: false,
});
