const sequelize = require("../../database/connections");
const {INTEGER} = require("sequelize");

const AgentEmails = sequelize.define("agent_emails", {
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
    emailModelId: {
        type: INTEGER,
        allowNull: false
    }
});
module.exports = AgentEmails;