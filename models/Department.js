const { STRING } = require("sequelize");
const { BOOLEAN } = require("sequelize");
const { INTEGER } = require("sequelize");
const sequelize = require("../database/connections");
const BranchPhones = require("./BranchPhone");
const Employee = require("./Employee");
const PhoneNo = require("./PhoneNo");

const Department = sequelize.define("departments", {
    id: {
        type: INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
    },
    name: {
        type: STRING,
        allowNull: false,
    },
    isActive:{
        type: BOOLEAN,
        defaultValue: false
    },
    description: {
        type: STRING
    },
    employeeId:{
        type: INTEGER,
    },
});



module.exports = Department;