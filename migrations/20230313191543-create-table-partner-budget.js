'use strict';

const { INTEGER, STRING, DATE } = require("sequelize");
module.exports = {
  async up (queryInterface, Sequelize) {
    return queryInterface.createTable("partner_budgets", {
      id: {
        type: INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true
      },
       budgetYear: {
      type: STRING
    },
   annualPlan: {
      type: STRING
  },
  annualProduction: {
      type: STRING
  },
  
  userId: {
    type:INTEGER
      },
      partnerId: {
     type:INTEGER
  },
      createdAt: DATE,
      updatedAt: DATE
    });
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
  }
};
