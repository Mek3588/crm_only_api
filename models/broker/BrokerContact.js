
const sequelize = require("../../database/connections");
const {  INTEGER } = require("sequelize");
const BrokerContact = sequelize.define("broker_contacts", {
    id: {
        type: INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
    },
    companyContactId: {
        type: INTEGER,
        allowNull: false,
    },
    brokerId: {
        type: INTEGER,
        allowNull: false,
    }

});

module.exports =  BrokerContact