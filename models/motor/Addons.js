const { STRING, DOUBLE, DATE } = require("sequelize");
const { BOOLEAN } = require("sequelize");
const { INTEGER } = require("sequelize");
const sequelize = require("../../database/connections");
const CoverRate = require("../CoverRate");
const Quotation = require("../Quotation");
const TerritorialExtension = require("../TerritorialExtension");
const LimitedCoverRate = require("./LimitedCoverRate");
const ComprehensiveTp = require("../ComprehnsicveTp");


const Addons = sequelize.define("addons", {
  id: {
    type: INTEGER,
    allowNull: false,
    primaryKey: true,
    autoIncrement: true,
  },
  ignition_sum_insured: {
    type: DOUBLE,
  },
  property_limit_extension_amount: {
    type: DOUBLE,
  },
  bodt_limit_extension_amount: {
    type: DOUBLE,
  },
  territorial_countryId: {
    type: INTEGER,
  },
  comprehensive_id: {
    type: INTEGER,
  },
  dailyCash_benefit: {
    type: DOUBLE,
  },
  dailyCash_duration: {
    type: STRING,
  },
  yellow_card_vehicle_type: {
    type: STRING,
  },
  period: {
    type: STRING,
  },
  quotationId: {
    type: INTEGER,
  },
  coverRateId: {
    type: INTEGER,
  },
  addonPremium: {
    type: DOUBLE
  },
  bsg_vehicle: {
    type: String
  }
});
// sequelize.sync({ alter: true });
// Addons.belongsTo(Quotation, { foreignKey: "quotationId" })
Addons.belongsTo(CoverRate, { foreignKey: "coverRateId", as: "coverRate" })
Addons.belongsTo(LimitedCoverRate, { foreignKey: "coverRateId", as: "limitedCoverRate" })
Addons.belongsTo(TerritorialExtension, { foreignKey: "territorial_countryId", as: "territorialExtension" })
Addons.belongsTo(ComprehensiveTp, { foreignKey: "comprehensive_id", as: "comprehensiveTp" })



module.exports = Addons;
