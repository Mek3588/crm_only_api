const { STRING, INTEGER, BOOLEAN, DOUBLE, DATE } = require("sequelize");
const sequelize = require("../database/connections");
const Campaign = require("./Campaign");
const CampaignTeam = sequelize.define("campaign_teams", {
    id: {
        type: INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
    },
    teamName: {
        type: STRING,
    },
    teamLeader: {
        type: STRING,
    },
    teamMembers: {
        type: STRING,
    },
    branchId: {
        type: STRING

    },
    campaignId: {
        type: INTEGER
    },
    isIndividuallyAssigned: {
        type: BOOLEAN,
        default: false
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

    isTeamReported: {
        type: BOOLEAN
    }
    ,

    isIndividualTotalReported: {
        type: BOOLEAN
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
    }
    ,
    isIndividualExpectedSet: {
        type: BOOLEAN
    },
    createdAt: DATE,
    updatedAt: DATE,

})

// sequelize.sync({alter: true})
Campaign.hasMany(CampaignTeam)
// CampaignTeam.belongsTo(Campaign);

CampaignTeam.belongsTo(Campaign, {
    foreignKey: "campaignId",
    as: "mainCampaign",
  });
module.exports = CampaignTeam