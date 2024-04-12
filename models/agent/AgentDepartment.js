
const sequelize = require("../../database/connections");
const {  INTEGER } = require("sequelize");
const AgentDepartment = sequelize.define("agent_departments", {
    id: {
        type: INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
    },
    departmentId: {
        type: INTEGER,
        allowNull: false,
    },
    agentId: {
        type: INTEGER,
        allowNull: false,
    }

});

module.exports =  AgentDepartment