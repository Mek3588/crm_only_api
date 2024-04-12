const { DOUBLE } = require("sequelize");
const { INTEGER } = require("sequelize");
const sequelize = require("../../database/connections");
const Vehicle = require("./Vehicle");
const User = require("../acl/user");


const MinimumPremium = sequelize.define("minimum_premiums", {
    id: {
        type: INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
    },
    amount: {
        type: DOUBLE,
        allowNull: false,
    },
    category: {
        type: String,
        allowNull: true,
    },
    type: {
        type: String,
        allowNull: true,
    },
    userId: {
        type: INTEGER,
    },
    vehicleCategoryId: {
        type: INTEGER,
    },
    
})
MinimumPremium.belongsTo(User)

module.exports = MinimumPremium;