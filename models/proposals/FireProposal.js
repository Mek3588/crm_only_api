const { STRING } = require("sequelize");
const { BOOLEAN } = require("sequelize");
const { INTEGER } = require("sequelize");
const sequelize = require("../../database/connections");
const Branch = require("../Branch");
const FireQuotation = require("../fire/FireQuotation");
const FireRateCategory = require("../fire/FireRateCategory");
const FireRate = require("../fire/FireRate");
const Opportunity = require("../Opportunity");
const User = require("../acl/user");
const Proposal = require("./Proposal");

const FireProposal = sequelize.define("fire_proposals", {
  id: {
    type: INTEGER,
    allowNull: false,
    primaryKey: true,
    autoIncrement: true,
  },
  riskCountry: {
    type: STRING
  },
  riskRegion: {
    type: STRING
  },
  riskCity: {
    type: STRING,
  },
  riskWoreda: {
    type: STRING,
  },
  riskKebele: {
    type: STRING,
  },
  riskHouseNo: {
    type: STRING,
  },
  activities: {
    type: STRING,
  },
  fireBrigades: {
    type: STRING,
  },
  distance: {
    type: INTEGER,
  },
  responseTime: {
    type: INTEGER,
  },
  contractionDate: {
    type: STRING,
  },
  duration: {
    type: STRING,
  },
  partitionsMaterial: {
    type: STRING,
  },
  alterationsMade: {
    type: STRING,
  },
  lightingSystems: {
    type: STRING,
  },
  pastLosses: {
    type: STRING,
  },
  insuranceCover: {
    type: STRING,
  },
  insuranceCoverFor: {
    type: STRING,
  },
  effectiveFrom: {
    type: STRING,
  },
  gatesFences: {
    type: INTEGER,
  },
  building: {
    type: INTEGER,
  },
  gatesFences: {
    type: INTEGER,
  },
  goods: {
    type: STRING,
  },
  others: {
    type: STRING,
  },
  printPath: {
    type: STRING
  },
  receiptOrderPath: {
    type: STRING
  },
  schedulePath: {
    type: String,
  },
  fireQuotationId: {
    type: INTEGER,
  },
  firePolicyId: {
    type: INTEGER
  },
  fireRateId: {
    type: INTEGER,
  },
  categoryId: {
    type: INTEGER,
  },
  idImage: {
    type: STRING
  },
  videoFootage: {
    type: STRING
  },
  document: {
    type: STRING
  },
});

FireProposal.belongsTo(FireQuotation);

FireProposal.belongsTo(FireRateCategory, { foreignKey: "categoryId" });
FireProposal.belongsTo(FireRate, { foreignKey: "fireRateId" });

module.exports = FireProposal;