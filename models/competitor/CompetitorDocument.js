
const sequelize = require("../../database/connections");
const {  INTEGER } = require("sequelize");
const CompetitorDocuments = sequelize.define("competitor_documents", {
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
    competitorId: {
        type: INTEGER,
        allowNull: false,
    }

});
module.exports =  CompetitorDocuments