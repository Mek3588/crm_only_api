const sequelize = require("../database/connections");
const {INTEGER} = require("sequelize");

const ContactSms = sequelize.define("sms_contacts", {
    id: {
        type: INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
    },
    contactId: {
        type: INTEGER,
        allowNull: false
    },
    smsMessageId: {
        type: INTEGER,
        allowNull: false
    }
});

module.exports = ContactSms;