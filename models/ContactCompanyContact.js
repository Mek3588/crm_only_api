
const sequelize = require("../database/connections");
const {  INTEGER } = require("sequelize");
const ContactCompanyConatact = sequelize.define("contact_companyContacts", {
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
    contactId: {
        type: INTEGER,
        allowNull: false,
    }

});
module.exports =  ContactCompanyConatact