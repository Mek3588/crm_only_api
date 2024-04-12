const sequelize = require("../../database/connections");
const {INTEGER} = require("sequelize");

const OrganizationEmails = sequelize.define("organization_emails", {
    id: {
        type: INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
    },
    organizationId: {
        type: INTEGER,
        allowNull: false
    },
    emailModelId: {
        type: INTEGER,
        allowNull: false
    }
});

module.exports = OrganizationEmails;