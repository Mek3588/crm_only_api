const { STRING } = require("sequelize");
const { BOOLEAN } = require("sequelize");
const { INTEGER } = require("sequelize");
const sequelize = require("../database/connections");

const Declarartion = sequelize.define("declarations", {
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
    description: {
        type: STRING
    },
});

module.exports = Declarartion;