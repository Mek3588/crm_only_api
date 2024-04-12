const { STRING, DOUBLE } = require("sequelize");
const { BOOLEAN } = require("sequelize");
const { INTEGER } = require("sequelize");
const sequelize = require("../../database/connections");
const User = require("../acl/user");

const LimitedCoverRate = sequelize.define("limited_cover_rates", {
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
    purpose: {
        type: STRING,
        allowNull: false,
    },
    rate: {
        type: DOUBLE
    },
    isAvailable: {
        type: BOOLEAN,
        defaultValue: true
    },
    userId: {
        type: INTEGER,
    },
    
});

LimitedCoverRate.belongsTo(User, { foreignKey: 'userId', as: 'user' })

module.exports = LimitedCoverRate;