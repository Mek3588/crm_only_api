const { STRING, Sequelize } = require("sequelize");
const { INTEGER } = require("sequelize");
const sequelize = require("../../database/connections");
const User = require("../acl/user");

const TpUnitPrice = sequelize.define("tp_unitPrices", {
    id: {
        type: INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
    },
    vehicle_type: {
        type: STRING
    },
    unit_price: {
        type: INTEGER
    },
    purpose: {
        type: STRING
    },
    userId: {
        type: INTEGER,
    },
    
});

TpUnitPrice.belongsTo(User, { foreignKey: 'userId', as: 'user' })

module.exports = TpUnitPrice;