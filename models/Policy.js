const { STRING, DOUBLE, DATE } = require("sequelize");
const { BOOLEAN } = require("sequelize");
const { INTEGER } = require("sequelize");
const sequelize = require("../database/connections");
const BranchPhones = require("./BranchPhone");
const Employee = require("./Employee");
const PhoneNo = require("./PhoneNo");
const EndorsementFilesPath = require("./endorsement/EndorsementFilesPath");
const Proposal = require("./proposals/Proposal");
const Contact = require("./Contact");
const Customer = require("./customer/Customer");
const FireProposal = require("./proposals/FireProposal");
const MultiplePolicy = require("./MultiplePolicy");

const Policy = sequelize.define("policies", {
  id: {
    type: INTEGER,
    allowNull: false,
    primaryKey: true,
    autoIncrement: true,
  },

  policyNumber: {
    type: STRING,
    allowNull: false,
  },
  isPaid:{
    type:BOOLEAN
  },
  fullName: {
    type: STRING,
    allowNull: false,
  },
  multiplePolicyId:{
  type:INTEGER,
  allowNull:true
   },
  proposalId: {
    type: INTEGER,
    allowNull: false,
  },

  policyIssuedDate: {
    allowNull: false,
    type: DATE,
  },
  policyEndDate: {
    allowNull: false,
    type: DATE,
  },
  premium: {
    type: INTEGER,
    allowNull: false,
  },

  policyStatus: {
    type: STRING,
    allowNull: false,
  },
  branchManagerApprovalStatus: {
    type: STRING,
  },
  financeStatus: {
    type: STRING,
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
  tpEndorsementSheetPath: {
    type: STRING,
  },
  certificateSheetPath: {
    type: STRING,
  },
  customerId: {
    type: INTEGER
  },
  policyType: {
    type: STRING
  },
  invoicedOC: {
    type: STRING
  },
  policyDoc: {
    type: STRING
  },
  coverType: {
    type: STRING,
  },
  isPaid: {
    type: BOOLEAN,
  },

});


Policy.hasMany(EndorsementFilesPath)
// Policy.belongsTo(Customer)
Customer.hasMany(Policy)
Policy.belongsTo(Proposal, { foreignKey: "proposalId" });
Policy.belongsTo(FireProposal, { foreignKey: "proposalId" });
Policy.belongsTo(MultiplePolicy, { foreignKey: "multiplePolicyId" })
Proposal.hasOne(Policy)
// MultiplePolicy.hasMany(Policy)
module.exports = Policy;


