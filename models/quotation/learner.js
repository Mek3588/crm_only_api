const { STRING, INTEGER, BOOLEAN, DOUBLE } = require("sequelize");
const sequelize = require("../../database/connections");
const Vehicle = require("../motor/Vehicle");

const Learner = sequelize.define("learners", {
    id: {
        type: INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,

    },   
    vehicle_type: {
        type: STRING,
        allowNull: false
    },
    purpose: {
        type: STRING,
        allowNull: false
    },
    initPremium: {
        type: INTEGER,
        allowNull: false
    },
})

module.exports = Learner