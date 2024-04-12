const { INTEGER, STRING } = require("sequelize");
const User = require("../acl/user");
const sequelize = require("../../database/connections");
const Partner = require("./Partner");

const PartnerBudget = sequelize.define("partner_budgets", {
  id: {
    type: INTEGER,
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
  },

    budgetYear: {
      type: STRING,
    },
   annualPlan: {
      type: STRING,
  },
  annualProduction: {
      type: STRING,
  },
  partnerId: {
    type: INTEGER
  },
  
  userId: {
    type:INTEGER
  }
})
PartnerBudget.belongsTo(User)

module.exports = PartnerBudget