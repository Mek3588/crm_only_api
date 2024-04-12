
const sequelize = require("../../database/connections");
const {  INTEGER } = require("sequelize");
const VendorDocuments = sequelize.define("vendor_documents", {
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
    vendorId: {
        type: INTEGER,
        allowNull: false,
    }

});
module.exports = VendorDocuments
