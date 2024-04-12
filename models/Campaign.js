const { STRING, DOUBLE, INTEGER, DATE, NUMBER, BOOLEAN } = require("sequelize");
const sequelize = require("../database/connections");
const Branch = require("./Branch");
const Employee = require("./Employee");
const VehicleCategory = require("./motor/VehicleCategory");
const Campaign = sequelize.define("campaigns", {
    id: {
        type: INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
    },
    campaignName: {
        type: STRING,
        allowNull: false
    },
    campaignType: {
        type: STRING,
    },
    campaignStatus: {
        type: STRING,
    },
    targetAudience: {
        type: STRING,
    },
    sponsor: {
        type: STRING,
    },
    campaignBudget: {
        type: DOUBLE,
    },
    expectedRevenue: {
        type: DOUBLE,
    },
    expectedSalesCount: {
        type: DOUBLE,
    },
    expectedResponseCount: {
        type: INTEGER,
    },
    expectedROI: {
        type: DOUBLE,
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

    employeeId: {
        type: INTEGER
    },

    objective: {
        type: STRING
    },
    campaignLevel: {
        type: STRING
    },
    productId: {
        type: STRING
    },
    campaignStartDate: {
        type: STRING
    },
    expectedClosedDate: {
        type: STRING
    },
    targetSize: {
        type: INTEGER
    },
    headOffice: {
        type: BOOLEAN
    },
    branches: {
        type: STRING
    },
    intermediaries: {
        type: STRING
    },
    description: {
        type: STRING
    },
    remark: {
        type: STRING
    },
    isHeadOfficeReported: {
        type: BOOLEAN
    },
    isBranchTotalReported: {
        type: BOOLEAN
    },

    isBranchExpectedSet: {
        type: BOOLEAN
    },
    isAgentExpectedSet: {
        type: BOOLEAN
    },
    isBrokerExpectedSet:{
        type: BOOLEAN
    },
    featuredAsset: {
        type: STRING
    },
    leads: {
        type: STRING
    },
    accounts: {
        type: STRING
    },
    customers: {
        type: STRING
    },
    agents: {
        type: STRING
    },
    brokers: {
        type: STRING
    },

    agentId: {
        type: STRING
    },
    brokerId: {
        type: STRING
    },
    creatorBranch: {
        type: INTEGER 
    },
    addedByBranch : {
        type: BOOLEAN
    },
    isAgentTotalReported: {
        type: BOOLEAN
    },
    isBrokerTotalReported: {
        type: BOOLEAN
    },
    expectedStatus: {
        type: STRING
    },
})
// sequelize.sync({ alter: true });
Campaign.belongsTo(Employee)
Campaign.belongsTo(Branch, {
    foreignKey: "creatorBranch",
    as: "createdBranch",
  });
// Campaign.belongsTo(VehicleCategory, {foreignKey: "productId", as: "product"});
module.exports = Campaign