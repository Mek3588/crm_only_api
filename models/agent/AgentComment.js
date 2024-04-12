
const sequelize = require("../../database/connections");
const {  INTEGER,STRING } = require("sequelize");
const User = require("../acl/user");
const Agent = require("./Agent");
const AgentComment = sequelize.define("agent_comments", {
    id: {
        type: INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
    },
    Comment: {
        type: STRING,
        allowNull: false,
    },
    agentId: {
        type: INTEGER,
        allowNull: false,
    },
    userId: {
        type: INTEGER,
        allowNull: false,
    }

});
Agent.hasMany(AgentComment)
AgentComment.belongsTo(Agent)


AgentComment.belongsTo(User)
module.exports =  AgentComment