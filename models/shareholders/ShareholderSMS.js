const sequelize = require("../../database/connections");
const {INTEGER} = require("sequelize");

const ShareholderSms = sequelize.define("sms_shareholders", {
    id: {
        type: INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
    },
    shareholderId: {
        type: INTEGER,
        allowNull: false
    },
    smsMessageId: {
        type: INTEGER,
        allowNull: false
    }
})

module.exports = ShareholderSms;


