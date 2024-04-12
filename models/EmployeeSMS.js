const sequelize = require("../database/connections");
const {INTEGER} = require("sequelize");

const EmployeeSms = sequelize.define("sms_employees", {
    id: {
        type: INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
    },
    employeeId: {
        type: INTEGER,
        allowNull: false
    },
    smsMessageId: {
        type: INTEGER,
        allowNull: false
    }
})
module.exports = EmployeeSms;