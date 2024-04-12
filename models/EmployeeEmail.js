const sequelize = require("../database/connections");
const {INTEGER} = require("sequelize");

const EmployeeEmails = sequelize.define("employee_emails", {
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
    emailModelId: {
        type: INTEGER,
        allowNull: false
    }
})

module.exports = EmployeeEmails;
