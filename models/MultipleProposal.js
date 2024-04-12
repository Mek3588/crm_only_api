const { STRING, DOUBLE, NUMBER } = require("sequelize");
const { BOOLEAN } = require("sequelize");
const { INTEGER } = require("sequelize");
const sequelize = require("../database/connections");
const BranchPhones = require("./BranchPhone");
const Employee = require("./Employee");
const PhoneNo = require("./PhoneNo");

const MultipleProposal = sequelize.define("multiple_proposals", {
  id: {
    type: INTEGER,
    allowNull: false,
    primaryKey: true,
    autoIncrement: true,
  },
  requested_by: {
    type: STRING,
    allowNull: false,
  },
  number_of_proposal: {
    type: INTEGER,
  },
  premium: {
    type: DOUBLE,
  },
});

module.exports = MultipleProposal;