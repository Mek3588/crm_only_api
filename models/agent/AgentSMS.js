const sequelize = require("../../database/connections");
const {INTEGER} = require("sequelize");

const AgentSms = sequelize.define("sms_agents", {
    id: {
        type: INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
    },
    agentId: {
        type: INTEGER,
        allowNull: false
    },
    smsMessageId: {
        type: INTEGER,
        allowNull: false
    }
});

module.exports = AgentSms;