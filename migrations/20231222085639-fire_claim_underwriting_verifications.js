'use strict';

const { DATE } = require("sequelize");
const { STRING } = require("sequelize");
const { INTEGER, BOOLEAN } = require("sequelize");
module.exports = {
  async up (queryInterface, Sequelize) {
    return queryInterface.createTable("fire_claim_underwriting_verifications", {
      id: {
        type: INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
      },
      fireClaimVerificationId: {
        //allowNull: false,
        type: INTEGER
      },
       coverType: {
        type: STRING,
      },
      deductable: {
        type: INTEGER
      },
      policyNumber: {
        type: STRING,
      },
      insured: {
        type: STRING,
      },
      remark: {
        type: STRING
      },
      duration: {
        allowNull: false,
        type: STRING
      },
      sumInsured: {
        //allowNull: false,  Previous Claim Record 
        type: INTEGER
      },
      fornow: {
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