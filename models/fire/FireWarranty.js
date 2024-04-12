const { STRING, Sequelize } = require("sequelize");
const { BOOLEAN } = require("sequelize");
const { INTEGER } = require("sequelize");
const sequelize = require("../../database/connections");

const FireWarranty = sequelize.define("fire_warranties", {
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
    code: {
        type: STRING
    },
    description: {
        type: Sequelize.TEXT('long'),
    },
    userId: {
        type: INTEGER,
    },
    branchId: {
        type: INTEGER,
    }
});


module.exports = FireWarranty;