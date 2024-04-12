const { STRING, DOUBLE, BOOLEAN, DATE } = require("sequelize");
const { INTEGER } = require("sequelize");
const sequelize = require("../database/connections");
const User = require("./acl/user");

const PeriodRate = sequelize.define("period_rate", {
  id: {
    type: INTEGER,
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
},
minDuration: {
    type: INTEGER,
    allowNull: false,
},
maxDuration: {
    type: INTEGER,
    allowNull: false,
},
isCancellation: {
    type: BOOLEAN,
    allowNull: false,
},
rate: {
    type: DOUBLE,
    allowNull: false,
},
userId: {
    type: INTEGER,
},
})

PeriodRate.belongsTo(User, { foreignKey: 'userId', as: 'user' })

module.exports = PeriodRate