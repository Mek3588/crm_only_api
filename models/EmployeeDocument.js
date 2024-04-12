
const sequelize = require("../database/connections");
const {  INTEGER } = require("sequelize");
const EmployeeDocument = sequelize.define("employee_documents", {
    id: {
        type: INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
    },
    documentId: {
        type: INTEGER,
        allowNull: false,
    },
    employeeId: {
        type: INTEGER,
        allowNull: false,
    }

});
module.exports = EmployeeDocument
