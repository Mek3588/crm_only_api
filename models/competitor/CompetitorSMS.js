const sequelize = require("../../database/connections");
const {INTEGER} = require("sequelize");

const CompetitorSms = sequelize.define("sms_competitors", {
    id: {
        type: INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
    },
    competitorId: {
        type: INTEGER,
        allowNull: false
    },
    smsMessageId: {
        type: INTEGER,
        allowNull: false
    }
});

module.exports = CompetitorSms;