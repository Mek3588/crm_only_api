
const sequelize = require("../../database/connections");
const {  INTEGER } = require("sequelize");
const VendorContact = sequelize.define("vendor_contacts", {
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
    vendorId: {
        type: INTEGER,
        allowNull: false,
    }

});
module.exports = VendorContact
