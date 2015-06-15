var sq = require("../db");
var Sequelize = require("sequelize");

var Task = module.exports = sq.define('Task', {
    id: {
        type: Sequelize.BIGINT(20),
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
        field: 'task_id'
    },
    posted_by: {
        type: Sequelize.BIGINT(20),
        allowNull: true,
    },
    assign_by: {
        type: Sequelize.BIGINT(20),
        allowNull: true,
    },
    created_on: {
        type: Sequelize.DATE,
        allowNull: true,
        field: 'create_on' // LMAO
    },
    due_date: {
        type: Sequelize.DATE,
        allowNull: true,
    },
    complete_date: {
        type: Sequelize.DATE,
        allowNull: true,
    },
    status_task_id: {
        type: Sequelize.INTEGER(11),
        allowNull: true,
        defaultValue: '19'
    },
    task_description: {
        type: Sequelize.TEXT,
        allowNull: true,
    },
    readed: {
        type: Sequelize.BOOLEAN,
        allowNull: true,
        defaultValue: false
    },
    row_version: {
        type: Sequelize.INTEGER(10),
        defaultValue: 1,
    }
},{
    tableName: 'tbl_task',
    timestamps: true,
    deletedAt: false,
    updatedAt: false,
    createdAt: 'create_on'
});

