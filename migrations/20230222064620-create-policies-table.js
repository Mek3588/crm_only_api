"use strict";
const { INTEGER, BOOLEAN, DOUBLE, DATE, STRING } = require("sequelize");
module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.createTable("policies", {
      id: {
        type: INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
      },
    
      policyNumber: {
        type: STRING,
        allowNull: false,
      },
      fullName: {
        type: STRING,
        allowNull: false,
      },
    
      proposalId: {
        type: INTEGER,
        allowNull: false,
      },
    
      policyIssuedDate: {
        allowNull: false,
        type: DATE,
      },
      policyEndDate: {
        allowNull: false,
        type: DATE,
      },
      premium: {
        type: INTEGER,
        allowNull: false,
      },
    
      policyStatus: {
        type: STRING,
        allowNull: false,
      },
      branchManagerApprovalStatus: {
        type: STRING,
      },
      financeStatus: {
        type: STRING,
        allowNull: false,
      },
      scheduleSheetPath: {
        type: STRING,
      },
      endorsementsPath: {
        type: STRING
      },
      policyDocPath: {
        type: STRING
      },
      receiptOrderSheetPath: {
        type: STRING,
      },
      wordingSheetPath: {
        type: STRING,
      },
      policySheetPath: {
        type: STRING,
      },
      tpEndorsementSheetPath: {
        type: STRING,
      },
      customerId: {
        type: INTEGER
      },
      multiplePolicyId: {
        type: INTEGER
      },
      policyType: {
        type: STRING
      },
      invoicedOC: {
        type: STRING
      },
      policyDoc: {
        type: STRING
      },
      coverType: {
        type: STRING,
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
