
const sequelize = require("../../database/connections");
const {  INTEGER } = require("sequelize");
const PartnerDepartment = sequelize.define("partner_departments", {
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
    partnerId: {
        type: INTEGER,
        allowNull: false,
    }

});
module.exports =  PartnerDepartment