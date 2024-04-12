const { STRING, DOUBLE } = require("sequelize");
const { BOOLEAN } = require("sequelize");
const { INTEGER } = require("sequelize");
const sequelize = require("../database/connections");
const Proposal = require("./proposals/Proposal")
const Contact = require("./Contact")

const OriginalDraft = sequelize.define("originalDrafts", {
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

OriginalDraft.belongsTo(Proposal);
Proposal.hasOne(OriginalDraft);
// OriginalDraft.hasOne(Contact);
// Contact.belongsTo(OriginalDraft);
module.exports = OriginalDraft;