"use strict";
const { DATE, DOUBLE } = require("sequelize");
const { STRING } = require("sequelize");
const { INTEGER, BOOLEAN } = require("sequelize");
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.createTable("campaign_brokers", {
      id: {
        type: INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
      },
      campaignId: {
        type: INTEGER,
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

      isReported: {
        type: BOOLEAN,
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
        type: BOOLEAN,
      },
      firstName: {
        type: STRING,
      },
      fatherName: {
        type: STRING,
      },
      createdAt: DATE,
      updatedAt: DATE,
    });
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
  },
};
