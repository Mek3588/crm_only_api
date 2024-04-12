const { STRING, DOUBLE, NUMBER } = require("sequelize");
const { BOOLEAN } = require("sequelize");
const { INTEGER } = require("sequelize");
const sequelize = require("../database/connections");
const Proposal = require("./proposals/Proposal");

const MultiplePolicy = sequelize.define("multiple_policies", {
  id: {
    type: INTEGER,
    allowNull: false,
    primaryKey: true,
    autoIncrement: true,
  },
  number_of_policies: {
    type: INTEGER,
    allowNull: false,
  },
  requested_by: {
    type: STRING,
    allowNull: false,
  },
  cover_type: {
    type: STRING,
    allowNull: false,
  },
  is_motor: {
    type: BOOLEAN
  },
  is_fire: {
    type: BOOLEAN
  },
  status: {
    type: STRING,
    allowNull: false,
  },
  proposalId: {
    type: INTEGER,
    allowNull: false,
  },
});

MultiplePolicy.belongsTo(Proposal, { foreignKey: "proposalId" });

module.exports = MultiplePolicy;