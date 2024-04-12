const sequelize = require("../../database/connections");
const {INTEGER} = require("sequelize");

const VendorEmails = sequelize.define("vendor_emails", {
    id: {
        type: INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
    },
    vendorId: {
        type: INTEGER,
        allowNull: false
    },
    emailModelId: {
        type: INTEGER,
        allowNull: false
    }
})

module.exports = VendorEmails;
