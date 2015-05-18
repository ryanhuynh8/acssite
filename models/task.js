var sq = require("../db");
var Sequelize = require("sequelize");

var Task = module.exports = sq.define('Task', {
    task_id: {
        type: Sequelize.BIGINT(20),
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
    },
    posted_by: {
        type: Sequelize.BIGINT(20),
        allowNull: true,
    },
    assign_by: {
        type: Sequelize.BIGINT(20),
        allowNull: true,
    },
    create_on: {
        type: Sequelize.DATE,
        allowNull: true,
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
    },
    task_description: {
        type: Sequelize.TEXT,
        allowNull: true,
    },
    readed: {
        type: Sequelize.BOOLEAN,
        allowNull: true,
        defaultValue: false
    }
},{
    tableName: 'tbl_task',
    timestamps: false
});

