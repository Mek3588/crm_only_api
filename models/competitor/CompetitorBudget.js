const { INTEGER, STRING } = require("sequelize");
const User = require("../acl/user");
const sequelize = require("../../database/connections");
const CompetitorBudget = sequelize.define("competitor_budgets", {
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
    semiAnnualGrossWrittenPremium : {
      type: STRING,
    },
      marketShare : {
      type: STRING,
  },
  growth: {
        type:INTEGER
      },
    rank : {
      type: STRING,
    },
    remark: {
      type: STRING,
  },
  competitorId: {
    type:INTEGER
  },
  userId: {
    type:INTEGER
  }
  
})
CompetitorBudget.belongsTo(User)
module.exports = CompetitorBudget
