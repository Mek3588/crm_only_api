const { STRING, BOOLEAN } = require("sequelize");
const { DOUBLE } = require("sequelize");
const { INTEGER } = require("sequelize");
const sequelize = require("../../database/connections");

const FireProposalAttachedFiles = sequelize.define("fire_proposal_attached_files", {
    id: {
        type: INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true
    },
    name: {
        type: STRING,
        allowNull: false,
    },
    path:{ 
        type:STRING,
        allowNull: false
    },
})

module.exports = FireProposalAttachedFiles