'use strict';
const { DATE, BOOLEAN } = require("sequelize");
const { STRING } = require("sequelize");
const { INTEGER } = require("sequelize");
const { DOUBLE } = require("sequelize");

module.exports = {
  async up(queryInterface, Sequelize) {

    return queryInterface.createTable("campaign_teams", {
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
      },
      isIndividualExpectedSet: {
        type: BOOLEAN
    },
    

      createdAt: DATE,
      updatedAt: DATE,

    })


    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
  },


  async down(queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
  }
};
