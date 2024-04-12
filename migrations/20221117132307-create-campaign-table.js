"use strict";
const { DATE, BOOLEAN, NUMBER } = require("sequelize");
const { STRING } = require("sequelize");
const { INTEGER } = require("sequelize");
const { DOUBLE } = require("sequelize");
module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.createTable("campaigns", {
      id: {
        type: INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },
      campaignName: {
        type: STRING,
        allowNull: false,
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
      expectedRevenue: {
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
        type: INTEGER,
      },

      objective: {
        type: STRING,
      },
      campaignLevel: {
        type: STRING,
      },
      productId: {
        type: STRING,
      },
      campaignStartDate: {
        type: STRING,
      },
      expectedClosedDate: {
        type: STRING,
      },
      targetSize: {
        type: INTEGER,
      },
      headOffice: {
        type: BOOLEAN,
      },
      branches: {
        type: STRING,
      },
      intermediaries: {
        type: STRING,
      },
      description: {
        type: STRING,
      },
      remark: {
        type: STRING
      },
      isHeadOfficeReported: {
        type: BOOLEAN,
      },
      isBranchTotalReported: {
        type: BOOLEAN,
      },
      isBranchExpectedSet: {
        type: BOOLEAN,
      },
      isAgentExpectedSet: {
        type: BOOLEAN
      },
      isBrokerExpectedSet: {
        type: BOOLEAN
      },
      featuredAsset: {
        type: STRING,
      },
      leads: {
        type: STRING,
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
      addedByBranch: {
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
      createdAt: DATE,
      updatedAt: DATE,
    });
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
  },
};
