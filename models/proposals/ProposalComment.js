const sequelize = require("../../database/connections");
const { STRING, INTEGER, BOOLEAN } = require("sequelize");
const Contact = require("../Contact");
const MotorProposal = require("./MotorProposal");
const Proposal = require("./Proposal");
const User = require("../acl/user");
const Quotation = require("../Quotation");
const ProposalComment = sequelize.define("proposalComments", {
    id: {
        type: INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
    },
    proposalId: {
        type: INTEGER
    },

    comment: {
        type: STRING
    },
    commentBy: {
        type: STRING
    },

    status: {
        type: STRING
    },

})


ProposalComment.belongsTo(Proposal)
Proposal.hasMany(ProposalComment)
// Proposal.belongsTo(Contact);
// Proposal.belongsTo(User);
// Proposal.belongsTo(MotorProposal)
// Proposal.belongsTo(Quotation)


module.exports = ProposalComment;