
const sequelize = require("../../database/connections");
const {  INTEGER } = require("sequelize");
const PartnerDocuments = sequelize.define("partner_documents", {
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
    partnerId: {
        type: INTEGER,
        allowNull: false,
    }

});
module.exports =  PartnerDocuments