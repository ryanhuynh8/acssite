var sq = require("../db");
var Sequelize = require("sequelize");

var Ticket = module.exports = sq.define('Ticket', {
    id: {
        type: Sequelize.BIGINT(11),
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
        field: 'ticket_id'
    },
    create_by: {
        type: Sequelize.DATE,
        allowNull: true,
        field: 'create_id'
    },
    status: {
        type: Sequelize.STRING,
        allowNull: true
    },
    ticket_type: {
        type: Sequelize.INTEGER,
        allowNull: true,
        field: 'ticket_type'
    },
    invoice_id: {
        type: Sequelize.BIGINT(11),
        allowNull: false,
        field: 'invoice_id'
    },
    office_id: {
      type: Sequelize.BIGINT(11),
      allowNull: false,
      field: 'office_id'
    },
    dispatch_id: {
      type: Sequelize.BIGINT(11),
      allowNull: true,
      field: 'dispatch_id'
    },
    customer_id: {
        type: Sequelize.BIGINT(11),
        field: 'user_id',
        allowNull: false
    },
    problem: {
        type: Sequelize.STRING,
        allowNull: false
    },
    office_note: {
      type: Sequelize.TEXT,
      allowNull: true,
      field: 'office_note'
    },
    job_note: {
      type: Sequelize.TEXT,
      allowNull: true,
      field: 'job_note'
    },
    job_date: {
      type: Sequelize.DATE,
      allowNull: true,
      field: 'job_date'
    },
    assign_tech: {
      type: Sequelize.BIGINT(11),
      allowNull: true,
      field: 'assign_tech'
    },
    seller: {
      type: Sequelize.BIGINT(11),
      allowNull: true,
    },
    promised_date: {
      type: Sequelize.DATE,
      allowNull: true,
      field: 'promised_date'
    },
    promised_time_from: {
      type: Sequelize.INTEGER,
      allowNull: true,
      field: 'promised_time_from'
    },
    promised_time_to: {
      type: Sequelize.INTEGER,
      allowNull: true,
      field: 'promised_time_to'
    },
    urgency: {
      type: Sequelize.STRING,
      allowNull: true,
    }
},{
    tableName: 'tbl_ticket',
    timestamps: true,
    deletedAt: false,
    updatedAt: false,
    createdAt: 'create_on'
});

