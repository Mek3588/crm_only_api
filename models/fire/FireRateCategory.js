const { INTEGER, STRING, DOUBLE, NUMBER } = require("sequelize");
const sequelize = require("../../database/connections");

const FireRateCategory = sequelize.define("fire_rate_categories", {
    id: {
        type: INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true
    },
    name: {
        type: STRING,
        allowNull: false
    },
    description: {
        type: STRING
    },
    userId: {
        type: INTEGER
    },
    branchId: {
        type: INTEGER
    }

})
module.exports = FireRateCategory

