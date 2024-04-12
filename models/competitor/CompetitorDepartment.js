
const sequelize = require("../../database/connections");
const {  INTEGER } = require("sequelize");
const CompetitorDepartment = sequelize.define("competitor_departments", {
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
    competitorId: {
        type: INTEGER,
        allowNull: false,
    }

});

module.exports =  CompetitorDepartment