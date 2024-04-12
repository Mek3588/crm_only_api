const sequelize = require("../database/connections");
const {INTEGER} = require("sequelize");

const CompanyContactsSms = sequelize.define("sms_companyContacts", {
    id: {
        type: INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
    },
    companyContactId: {
        type: INTEGER,
        allowNull: false
    },
    smsMessageId: {
        type: INTEGER,
        allowNull: false
    }
})
module.exports = CompanyContactsSms;