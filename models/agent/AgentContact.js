
const sequelize = require("../../database/connections");
const {  INTEGER } = require("sequelize");
const AgentContact = sequelize.define("agent_contacts", {
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
    agentId: {
        type: INTEGER,
        allowNull: false,
    }

});

module.exports =  AgentContact