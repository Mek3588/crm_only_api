const sequelize = require("../../database/connections");
const {INTEGER} = require("sequelize");

const VendorSms = sequelize.define("sms_vendors", {
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
    smsMessageId: {
        type: INTEGER,
        allowNull: false
    }
})
module.exports = VendorSms;