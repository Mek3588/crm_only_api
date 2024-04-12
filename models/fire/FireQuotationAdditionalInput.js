const { STRING, BOOLEAN } = require("sequelize");
const { DOUBLE } = require("sequelize");
const { INTEGER } = require("sequelize");
const sequelize = require("../../database/connections");
const User = require("../acl/user");
const Branch = require("../Branch");
const Employee = require("../Employee");
const Opportunity = require("../Opportunity");
const FireRate = require("./FireRate");
const FireRateCategory = require("./FireRateCategory");
const FireProposal = require("../proposals/Fire");
const FireAlliedPerilsRate = require("./FireAlliedPerilsRate");
const FireQuotationAlliedPerils = require("./FireQuotaionAliedPerilsList");

const FireQuotationAdditionalInput = sequelize.define("fire_quotation_addtional_inputs", {
  id: {
    type: INTEGER,
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
  },
  categoryId: {
    type: STRING,
  },
  fireRateId: {
    type: STRING,
  },
  class_of_house: {
    type: STRING,
  },
  wall_type: {
    type: STRING,
  },
  roof_type: {
    type: STRING,
  },
  floor_type: {
    type: STRING,
  },
  duration: {
    type: STRING,
  },
  sumInsured: {
    type: STRING,
  },
  is_near_fire_birgade: {
    type: BOOLEAN,
  },
  have_security_appliances: {
    type: BOOLEAN,
  },
  premium: {
    type: DOUBLE,
  },
});

// FireQuotation.belongsTo(FireRate, { foreignKey: "fireRateId" });
// FireQuotation.belongsTo(FireRateCategory, { foreignKey: "categoryId" });

// FireProposal.belongsTo(FireQuotation, {foreignKey: "fireQuotationId"})
FireQuotation.belongsToMany(FireAlliedPerilsRate, {
  through: FireQuotationAlliedPerils,
});
FireAlliedPerilsRate.belongsToMany(FireQuotation, {
  through: FireQuotationAlliedPerils,
});

module.exports = FireQuotationAdditionalInput;
