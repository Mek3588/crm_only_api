
const sequelize = require("../../database/connections");
const {  INTEGER } = require("sequelize");
const ShareholderDocuments = sequelize.define("shareholder_documents", {
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
    shareholderId: {
        type: INTEGER,
        allowNull: false,
    }

});
module.exports = ShareholderDocuments

