
const sequelize = require("../../database/connections");
const {  INTEGER } = require("sequelize");
const OrganizationDepartment = sequelize.define("organization_departments", {
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
    organizationId: {
        type: INTEGER,
        allowNull: false,
    }

});

module.exports =  OrganizationDepartment