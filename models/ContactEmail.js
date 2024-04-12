const sequelize = require("../database/connections");
const {INTEGER} = require("sequelize");

const ContactEmails = sequelize.define("contact_emails", {
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
    emailModelId: {
        type: INTEGER,
        allowNull: false
    }
});

module.exports = ContactEmails;