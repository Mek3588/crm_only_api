const sequelize = require("../../database/connections");
const { STRING, INTEGER, BOOLEAN } = require("sequelize");
const Contact = require("../Contact");
const MotorProposal = require("./MotorProposal");
const User = require("../acl/user");
const Quotation = require("../Quotation");
const FireProposal = require("./FireProposal");
const MultipleProposal = require("../MultipleProposal");
// const Policy = require("../Policy");
const Proposal = sequelize.define("proposals", {
    id: {
        type: INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
    },
    contactId: {
        type: INTEGER
    },
    proposalNo: {
        type: STRING
    },
    userId: {
        type: INTEGER
    },
    motorProposalId: {
        type: INTEGER
    },
    assignedTo: {
        type: INTEGER,
    },
    underwritingApproval: {
        type: STRING,
    },
    preApprovalCheck: {
        type: STRING,
    },
    specialApproval: {
        type: STRING,
    },
    branchManagerApproval: {
        type: STRING,
    },
    notificationNotSeen: {
        type: Boolean
    },
    multipleProposalId:{
        type:INTEGER
    },
    noClaim: {
        type: STRING
    },
    withholdingDocument: {
        type: STRING
    },
    effectiveFrom: {
        type: STRING,
    },
    canNotEdit: {
        type: BOOLEAN
    },
    fireProposalId: {
        type: INTEGER
    },
    tot: {
        type: STRING
    },
    printPath: {
        type: STRING
    },
    multipleProposalId: {
        type: INTEGER
    }

})



Proposal.belongsTo(Contact);
Contact.hasMany(Proposal)
Proposal.belongsTo(User);

Proposal.belongsTo(User, { foreignKey: "assignedTo" });
Proposal.belongsTo(MotorProposal, { foreignKey: "motorProposalId" });
MotorProposal.hasMany(Proposal)


Proposal.belongsTo(FireProposal, { foreignKey: "fireProposalId" });
FireProposal.hasMany(Proposal)

Proposal.belongsTo(MultipleProposal)

module.exports = Proposal;