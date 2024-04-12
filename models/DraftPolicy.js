const { STRING, DOUBLE } = require("sequelize");
const { BOOLEAN } = require("sequelize");
const { INTEGER } = require("sequelize");
const sequelize = require("../database/connections");
const Proposal = require("./proposals/Proposal");   
const Contact = require("./Contact");

const DraftPolicy = sequelize.define("draftPolicies", {
    id: {
        type: INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
    },
    proposalId: {
        type: INTEGER,
        allowNull: false,
    },
    scheduleSheetPath: {
        type: STRING,
    },
    endorsementsPath: {
        type: STRING
    },
    policyDocPath: {
        type: STRING
    },
    receiptOrderSheetPath: {
        type: STRING,
    },
    wordingSheetPath: {
        type: STRING,
    },
    policySheetPath: {
        type: STRING,
    },
    quotationId: {
        type: INTEGER,
    },
    });

    DraftPolicy.belongsTo(Proposal, { foreignKey: "proposalId"});
    Proposal.hasOne(DraftPolicy);
    // DraftPolicy.belongsTo(Contact);
    // Contact.hasMany(DraftPolicy);
    module.exports = DraftPolicy;