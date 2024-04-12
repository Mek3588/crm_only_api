const { STRING, INTEGER, DOUBLE, BOOLEAN, DATE } = require("sequelize");
const sequelize = require("../database/connections");
const Campaign = require("./Campaign");
const Employee = require("./Employee");
const CampaignTeam = require("./CampaignTeam");
const CampaignBranch = sequelize.define("campaign_branches", {
    id: {
        type: INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
    },
    campaignId: {
        type: INTEGER
    },
    branchId: {
        type: STRING

    },

    actualCost: {
        type: DOUBLE,
    },
    actualSalesCount: {
        type: DOUBLE,
    },
    actualResponseCount: {
        type: DOUBLE,
    },
    actualROI: {
        type: DOUBLE,
    },
    actualRevenue: {
        type: DOUBLE,
    },

    isBranchReported: {
        type: BOOLEAN
    },

    isTeamTotalReported: {
        type: BOOLEAN
    },

    branchName: {
        type: STRING

    },

    expectedCost: {
        type: DOUBLE,
    },
    expectedSalesCount: {
        type: DOUBLE,
    },
    expectedResponseCount: {
        type: DOUBLE,
    },
    expectedROI: {
        type: DOUBLE,
    },

    expectedRevenue: {
        type: DOUBLE,
    },

    isExpectedSet: {
        type: BOOLEAN
    },

    isTeamExpectedSet: {
        type: BOOLEAN
    },
    createdAt: DATE,
    updatedAt: DATE,
})

// sequelize.sync({ alter: true });
Campaign.hasMany(CampaignTeam)
CampaignTeam.belongsTo(Campaign);

// Employee.hasMany(CampaignBranch);
// CampaignBranch.belongsTo(Employee);

CampaignBranch.belongsTo(Campaign, {
    foreignKey: "campaignId",
    as: "mainCampaign",
  });

module.exports = CampaignBranch