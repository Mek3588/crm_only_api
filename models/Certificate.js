const { STRING } = require("sequelize");
const { BOOLEAN } = require("sequelize");
const { INTEGER } = require("sequelize");
const sequelize = require("../database/connections");
const BranchPhones = require("./BranchPhone");
const Employee = require("./Employee");
const PhoneNo = require("./PhoneNo");

const Certificate = sequelize.define("certificates", {
    id: {
        type: INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
    },
    name: {
        type: INTEGER,
        allowNull: false,
    },
    shortName: {
        type: STRING,
    },
    description: {
        type: STRING
    },
});



module.exports = Certificate;