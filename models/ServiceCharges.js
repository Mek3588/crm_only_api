const { STRING } = require("sequelize");
const { DOUBLE } = require("sequelize");
const { INTEGER } = require("sequelize");
const sequelize = require("../database/connections");
const VehicleCategory = require("./motor/VehicleCategory");
const User = require("./acl/user");

const ServiceCharge = sequelize.define("service_charges", {

    id: {
        type: INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true
    },
    chargeType: {
        type: STRING,
        allowNull: false,
    },
    amount: {
        type: DOUBLE,
        allowNull: false,
    },
    vehicleCategoryId: {
    type: INTEGER,
    },
    
})

ServiceCharge.belongsTo(VehicleCategory)
ServiceCharge.belongsTo(User, { foreignKey: 'userId', as: 'user' })
   

module.exports = ServiceCharge