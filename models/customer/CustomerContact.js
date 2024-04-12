
const sequelize = require("../../database/connections");
const {  INTEGER } = require("sequelize");
const CustomerContact = sequelize.define("customer_contacts", {
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
    customerId: {
        type: INTEGER,
        allowNull: false,
    }

});
module.exports =  CustomerContact