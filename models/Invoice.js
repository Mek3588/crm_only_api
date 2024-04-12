const { STRING, BOOLEAN } = require("sequelize");
const { INTEGER } = require("sequelize");
const sequelize = require("../database/connections");
const User = require("./acl/user");
const Branch = require("./Branch");
const Contact = require("./Contact");
const Proposal = require("./proposals/Proposal");
const Policy = require("./Policy");

const Invoice = sequelize.define("invoices", {
  id: {
    type: INTEGER,
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
  },
  invoiceNo: {
    type: INTEGER,
    allowNull: false,
  },
  name: {
    type: STRING,
  },
  status: {
    type: STRING,
  },
  TOT: {
    type: STRING,
  },
  socialSecurity: {
    type: STRING,
  },
  registrationForVat: {
    type: STRING,
  },
  being: {
    type: STRING,
  },
  isCash: {
    type: BOOLEAN
  },
  chequeNo: {
    type: STRING
  },
  invoicePath: {
    type: STRING,
  },
  assignedTo: {
    type: INTEGER,
  },
  branchId: {
    type: INTEGER,
  },
  proposalId: {
    type:  INTEGER
  },
  contactId: {
    type: INTEGER
  },
  userId: {
    type: INTEGER,
  },
  policyId: {
    type: INTEGER
  },
});

Invoice.belongsTo(User);
Invoice.belongsTo(Contact);
Invoice.belongsTo(Proposal);
Invoice.belongsTo(Branch, { foreignKey: "branchId" });
Invoice.belongsTo(Policy);
module.exports = Invoice;
