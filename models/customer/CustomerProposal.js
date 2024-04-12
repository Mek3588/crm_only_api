const sequelize = require("../../database/connections");
const { INTEGER } = require("sequelize");
const Customer = require("./Customer");
const CustomerProposal = sequelize.define("customer_proposals", {
  id: {
    type: INTEGER,
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
  },
  motorProposalId: {
    type: INTEGER,
    allowNull: false,
  },
  customerId: {
    type: INTEGER,
    allowNull: false,
  },
});

module.exports = CustomerProposal;

