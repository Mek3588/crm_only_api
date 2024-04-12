const { STRING, BOOLEAN } = require("sequelize");
const { DOUBLE } = require("sequelize");
const { INTEGER } = require("sequelize");
const sequelize = require("../database/connections");
const User = require("./acl/user");

const ChartRate = sequelize.define("other_loading_and_discounts", {
    id: {
        type: INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true
    },
    chargeReson: {
        type: STRING,
        allowNull: false,
    },
    rate: {
        type: DOUBLE,
        allowNull: false
    },
    isLoading: {
        type: BOOLEAN,
        allowNull: false
    },
    visibleToCustomer: {
        type: BOOLEAN,
        // allowNull: false,
        defaultValue: true
    },
    // order_no:{
    //     type: INTEGER,
    //     allowNull: false
    // },
    userId: {
        type: INTEGER,
    },
    
})

ChartRate.belongsTo(User, { foreignKey: 'userId', as: 'user' })


module.exports = ChartRate