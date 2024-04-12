
const sequelize = require("../../database/connections");
const {  INTEGER } = require("sequelize");
const CustomerDocuments = sequelize.define("customer_documents", {
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
    customerId: {
        type: INTEGER,
        allowNull: false,
    }

});
module.exports =  CustomerDocuments