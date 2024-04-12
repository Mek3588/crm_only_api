const { STRING } = require("sequelize");
const { INTEGER } = require("sequelize");
const sequelize = require("../database/connections");
const User = require("./acl/user");
const Branch = require("./Branch");

const Lead = sequelize.define("leads", {
  id: {
    type: INTEGER,
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
  },
  name: {
    type: STRING,
    allowNull: false,
  },
  status: {
    type: STRING,
    allowNull: false,
  },
  assignedTo: {
    type: INTEGER,
  },
  industry: {
    type: STRING,
  },
  numberOfEmployees: {
    type: INTEGER,
  },
  productId: {
    type: INTEGER,
  },
  parentLeadId: {
    type: INTEGER,
  },
  branchId: {
    type: INTEGER,
  },
  primaryPhone: {
    type: STRING,
    allowNull: false,
  },
  secondaryPhone: {
    type: STRING,
  },
  primaryEmail: {
    type: STRING,
  },
  secondaryEmail: {
    type: STRING,
  },
  website: {
    type: STRING,
  },
  fax: {
    type: STRING,
  },
  userId: {
    type: INTEGER,
  },
  tinNumber: {
    type: STRING,
  },
  annualRevenue: {
    type: STRING,
  },
  legalForm: {
    type: STRING,
  },
  businessSource: {
    type: INTEGER,
    allowNull: false,
  },
  country: {
    type: STRING,
  },
  region: {
    type: STRING,
  },
  city: {
    type: STRING,
  },
  subcity: {
    type: STRING,
  },
  woreda: {
    type: STRING,
  },
  kebele: {
    type: STRING,
  },
  building: {
    type: STRING,
  },
  officeNumber: {
    type: STRING,
  },
  poBox: {
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
  description: {
    type: STRING,
  },
});
Lead.belongsTo(Lead, { foreignKey: "parentLeadId", as: "parentLead" });
Lead.belongsTo(User, { foreignKey: "assignedTo", as: "assignedUser" });
Lead.belongsTo(Branch, { foreignKey: "branchId" });
module.exports = Lead;
