
const sequelize = require("../../database/connections");
const {  INTEGER } = require("sequelize");
const OrganizationContact = sequelize.define("organization_contacts", {
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
    organizationId: {
        type: INTEGER,
        allowNull: false,
    }

});

module.exports =  OrganizationContact