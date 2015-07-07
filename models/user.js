var sq = require("../db");
var Sequelize = require("sequelize");

var User = module.exports = sq.define('User',{
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        field: "user_id"
    },
    role_id: {
        type: Sequelize.INTEGER
    },
    first_name: {
        type: Sequelize.STRING(100)
    },
    middle_name: {
        type: Sequelize.STRING(50)
    },
    last_name: {
        type: Sequelize.STRING(100)
    },
    user_name: {
        type: Sequelize.STRING(250),
        allowNull : false
    },
    password: {
        type: Sequelize.STRING(100),
        allowNull : false
    },
    email: {
        type: Sequelize.STRING(250),
        allowNull : false
    },
    status: {
        type: Sequelize.BOOLEAN,
        defaultValue: true
    },
    created: {
        type: Sequelize.DATE
    },
    session_id: {
        type: Sequelize.STRING(250),
    },
    is_login: {
        type: Sequelize.BOOLEAN,
        defaultValue: false
    },
    last_login_date: {
        type: Sequelize.DATE
    },
    address: {
        type: Sequelize.STRING(300)
    },
    city: {
        type: Sequelize.STRING(100)
    },
    state: {
        type: Sequelize.STRING(10)
    },
    zip: {
        type: Sequelize.STRING(30)
    },
    phone1: {
        type: Sequelize.STRING(20)
    },
    phone2: {
        type: Sequelize.STRING(20)
    },
    ss_number: {
        type: Sequelize.STRING(20)
    },
    dob: {
        type: Sequelize.DATE
    },
    date_hired: {
        type: Sequelize.DATE
    },
    sex: {
        type: Sequelize.BOOLEAN
    },
    commission: {
        type: Sequelize.DECIMAL(10,2)
    },
    builder_deduction: {
        type: Sequelize.DECIMAL(10,2)
    },
    employee_type: {
        type: Sequelize.INTEGER(2)
    }
},{
    tableName: 'tbl_users',
    timestamps: false
});