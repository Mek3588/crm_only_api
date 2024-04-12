const { STRING } = require("sequelize");
const { INTEGER } = require("sequelize");
const sequelize = require("../database/connections");

const ServiceCategory = sequelize.define("service_categories", {
    id: {
        type: INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true
    },
    categoryName: {
        type: STRING,
        allowNull: false,
    },
    description: {
        type: STRING,
        allowNull: false,
    }
    
    });

module.exports = ServiceCategory;