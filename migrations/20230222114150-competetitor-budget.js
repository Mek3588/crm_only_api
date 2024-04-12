"use strict";

const { STRING, INTEGER, DATE } = require("sequelize");
module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.createTable("competitor_budgets", {
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
