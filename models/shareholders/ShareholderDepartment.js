
const sequelize = require("../../database/connections");
const {  INTEGER } = require("sequelize");
const ShareholderDepartment = sequelize.define("shareholder_departments", {
    id: {
        type: INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
    },
    departmentId: {
        type: INTEGER,
        allowNull: false,
    },
    shareholderId: {
        type: INTEGER,
        allowNull: false,
    }

});
module.exports = ShareholderDepartment
