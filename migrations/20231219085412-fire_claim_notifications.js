'use strict';

const { DATE } = require("sequelize");
const { STRING } = require("sequelize");
const { INTEGER, BOOLEAN } = require("sequelize");
module.exports = {
  async up (queryInterface, Sequelize) {
    return queryInterface.createTable("fire_claim_notifications", {
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
      policyId: {
        type: INTEGER
      },
      policyNumber: {
        type: STRING,
      },
      fullName: {
        type: STRING,
      },
      phoneNumber: {
        type: STRING
      },
      huoseNumber: {
        allowNull: false,
        type: STRING
      },
      claimIssuedDate: {
        allowNull: false,
        type: DATE
      },
      AccidentDate: {
        allowNull: false,
        type: STRING
      },
      document: {
        allowNull: false,
        type: STRING
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