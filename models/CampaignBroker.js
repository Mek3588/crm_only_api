const { STRING, INTEGER, DOUBLE, BOOLEAN, DATE } = require("sequelize");
const sequelize = require("../database/connections");
const Campaign = require("./Campaign");
const Employee = require("./Employee");
const CampaignTeam = require("./CampaignTeam");

const CampaignBroker = sequelize.define("campaign_brokers", {
    id: {
        type: INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
    },
    campaignId: {
        type: INTEGER
    },
    brokerId: {
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
    firstName : {
        type: STRING
    },
    fatherName : {
        type: STRING
    },
    createdAt: DATE,
    updatedAt: DATE,
})

// sequelize.sync({ alter: true });
// Campaign.hasMany(CampaignTeam)
// CampaignTeam.belongsTo(Campaign);

// Employee.hasMany(CampaignIndividual);
// CampaignIndividual.belongsTo(Employee);

module.exports = CampaignBroker