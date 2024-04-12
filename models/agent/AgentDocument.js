
const sequelize = require("../../database/connections");
const {  INTEGER } = require("sequelize");
const AgentDocuments = sequelize.define("agent_documents", {
    id: {
        type: INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
    },
    documentId: {
        type: INTEGER,
        allowNull: false,
    },
    agentId: {
        type: INTEGER,
        allowNull: false,
    }

});
module.exports =  AgentDocuments