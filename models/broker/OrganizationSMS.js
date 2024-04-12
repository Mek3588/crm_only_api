const sequelize = require("../../database/connections");
const {INTEGER} = require("sequelize");

const OrganizationSms = sequelize.define("sms_organizations", {
    id: {
        type: INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
    },
    organizationId: {
        type: INTEGER,
        allowNull: false
    },
    smsMessageId: {
        type: INTEGER,
        allowNull: false
    }
});

module.exports = OrganizationSms;