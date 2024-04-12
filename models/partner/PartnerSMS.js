const sequelize = require("../../database/connections");
const {INTEGER} = require("sequelize");

const PartnerSms = sequelize.define("sms_partners", {
    id: {
        type: INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
    },
    partnerId: {
        type: INTEGER,
        allowNull: false
    },
    smsMessageId: {
        type: INTEGER,
        allowNull: false
    }
})
module.exports = PartnerSms;