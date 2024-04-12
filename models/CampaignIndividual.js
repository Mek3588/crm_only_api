const { STRING, INTEGER, DOUBLE, BOOLEAN, DATE } = require("sequelize");
const sequelize = require("../database/connections");
const Campaign = require("./Campaign");
const Employee = require("./Employee");
const CampaignTeam = require("./CampaignTeam");
const CampaignIndividual = sequelize.define("campaign_individuals", {
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
    // campaign_teamId: {
    //     type: STRING,
    // },
    teamLeaderId: {
        type: STRING,
    },
    teamMemberId: {
        type: STRING,
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

    isReported:{
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
    },
    first_name : {
        type: STRING
    },
    father_name : {
        type: STRING
    },
    createdAt: DATE,
    updatedAt: DATE,
})

// sequelize.sync({ alter: true });
// Campaign.hasMany(CampaignTeam)
// CampaignTeam.belongsTo(Campaign);

CampaignIndividual.belongsTo(Campaign, {
    foreignKey: "campaignId",
    as: "mainCampaign",
  });
// Employee.hasMany(CampaignIndividual);
// CampaignIndividual.belongsTo(Employee);

module.exports = CampaignIndividual