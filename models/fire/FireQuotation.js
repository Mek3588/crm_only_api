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
// const FireProposal = require("../proposals/FireProposal");
const FireAlliedPerilsRate = require("./FireAlliedPerilsRate");
const FireQuotationAlliedPerils = require("./FireQuotaionAliedPerilsList");
const Partner = require("../partner/Partner");
const Contact = require("../Contact");

const FireQuotation = sequelize.define("fire_quotations", {
  id: {
    type: INTEGER,
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
  },
  requested_quotation_id: {
    type: INTEGER,
  },
  request_type: {
    type: STRING,
    allowNull: false,
  },
  policy_No: {
    type: STRING,
  },
  quotation_no: {
    type: STRING,
  },
  owner_first_name: {
    type: STRING,
    allowNull: false,
  },
  // owner_middle_name: {
  //   type: STRING,
  // },
  // owner_last_name: {
  //   type: STRING,
  // },
  company_name: {
    type: STRING,
    allowNull: false,
  },
  join_individual_name: {
    type: STRING,
    allowNull: true,
  },
  owner_middle_name: {
    type: STRING,
    allowNull: true,
  },
  owner_last_name: {
    type: STRING,
    allowNull: true,
  },
  owner_phoneNo: {
    type: STRING,
    allowNull: false,
  },
  categoryId: {
    type: STRING,
    allowNull: false,
  },
  fireRateId: {
    type: STRING,
    allowNull: false,
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
    allowNull: false,
  },
  have_content_insurance: {
    type: BOOLEAN,
  },
  content_sum_insured: {
    type: STRING,
  },
  is_near_fire_birgade: {
    type: STRING,
  },
  have_security_appliances: {
    type: BOOLEAN,
  },
  have_branch_discount: {
    type: BOOLEAN,
  },
  have_partnership_discount: {
    type: BOOLEAN,
  },
  have_security_appliances: {
    type: BOOLEAN,
  },
  want_voluntary_excess_discount: {
    type: BOOLEAN,
  },
  have_loss_ration_discount: {
    type: BOOLEAN,
  },
  poor_house_keeping_load: {
    type: BOOLEAN,
  },
  fire_prone_load: {
    type: BOOLEAN,
  },
  premium: {
    type: DOUBLE,
  },
  expirationDate: {
    type: STRING,
  },
  calculation_sheet_path: {
    type: STRING,
  },
  branchId: {
    type: INTEGER,
  },
  assignedTo: {
    type: INTEGER,
  },
  reportTo: {
    type: INTEGER,
  },
  want_negotiation: {
    type: BOOLEAN,
  },
  userId: {
    type: INTEGER,
  },

  partnerId: {
    type: STRING,
  },
  leadId: {
    type: INTEGER,
  },
  opportunityId: {
    type: INTEGER,
  },


});



FireQuotation.belongsTo(User, { foreignKey: "userId", as: "user" });
// FireQuotation.belongsTo(Lead, { foreignKey: "leadId" });
FireQuotation.belongsTo(Employee, { foreignKey: "reportTo" });
FireQuotation.belongsTo(Employee, {
  foreignKey: "assignedTo",
  as: "assignedEmployee",
});

FireQuotation.belongsTo(Contact, { foreignKey: "leadId", as: "contact" })

FireQuotation.belongsTo(FireRate, { foreignKey: "fireRateId" });
FireQuotation.belongsTo(Partner, { foreignKey: "partnerId" });
FireQuotation.belongsTo(FireRateCategory, { foreignKey: "categoryId" });
FireQuotation.belongsTo(User, { foreignKey: "ownerId", as: "owner" });
FireQuotation.belongsTo(Branch, { foreignKey: "branchId" });
FireQuotation.belongsTo(Opportunity, { foreignKey: "opportunityId" });
// FireProposal.belongsTo(FireQuotation, {foreignKey: "fireQuotationId"})
FireQuotation.belongsToMany(FireAlliedPerilsRate, {
  through: FireQuotationAlliedPerils,
});
FireAlliedPerilsRate.belongsToMany(FireQuotation, {
  through: FireQuotationAlliedPerils,
});

module.exports = FireQuotation;
