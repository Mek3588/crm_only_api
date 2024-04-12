
const sequelize = require("../database/connections");
const { INTEGER } = require("sequelize");
const ContactDocuments = sequelize.define("contact_documents", {
    id: {
        type: INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
    },
    documentId: {
        type: INTEGER,
        allowNull: false,
    },
    contactId: {
        type: INTEGER,
        allowNull: false,
    }

});
module.exports = ContactDocuments