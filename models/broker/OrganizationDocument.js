
const sequelize = require("../../database/connections");
const {  INTEGER } = require("sequelize");
const OrganizationDocuments = sequelize.define("organization_documents", {
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
    organizationId: {
        type: INTEGER,
        allowNull: false,
    }

});
module.exports =  OrganizationDocuments