'use strict';

const { DATE } = require("sequelize");
const { STRING } = require("sequelize");
const { INTEGER, BOOLEAN } = require("sequelize");
module.exports = {
  async up (queryInterface, Sequelize) {
    return queryInterface.createTable("fire_claim_verifications", {
      id: {
        type: INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
      },
      claimNumber: {
        type: STRING,
        allowNull: false
      },
      customerId: {
        type: INTEGER
      },
      policyNumber: {
        type: STRING,
      },
      insured: {
        type: STRING,
      },
      lossNature: {
        type: STRING
      },
      AccidentDate: {
        allowNull: false,
        type: STRING
      },
      fireClaimNotificationId: {
        //allowNull: false,
        type: INTEGER
      },
      underwritingApproval: {
        type: STRING,
      },
      createdAt: DATE,
      updatedAt: DATE,
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