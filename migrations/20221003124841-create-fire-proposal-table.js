"use strict";
const { DOUBLE } = require("sequelize");
const { DATE } = require("sequelize");
const { STRING } = require("sequelize");
const { INTEGER } = require("sequelize");
const { BOOLEAN } = require("sequelize");

module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.createTable("fire_proposals", {
      id: {
        type: INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
      },
      riskCountry: {
        type: STRING
      },
      riskRegion: {
        type: STRING
      },
      riskCity: {
        type: STRING,
      },
      riskWoreda: {
        type: STRING,
      },
      riskKebele: {
        type: STRING,
      },
      riskHouseNo: {
        type: STRING,
      },
      activities: {
        type: STRING,
      },
      fireBrigades: {
        type: STRING,
      },
      distance: {
        type: INTEGER,
      },
      responseTime: {
        type: INTEGER,
      },
      contractionDate: {
        type: STRING,
      },
      duration: {
        type: STRING,
      },
      partitionsMaterial: {
        type: STRING,
      },
      alterationsMade: {
        type: STRING,
      },
      lightingSystems: {
        type: STRING,
      },
      pastLosses: {
        type: STRING,
      },
      insuranceCover: {
        type: STRING,
      },
      insuranceCoverFor: {
        type: STRING,
      },
      effectiveFrom: {
        type: STRING,
      },
      gatesFences: {
        type: INTEGER,
      },
      building: {
        type: INTEGER,
      },
      gatesFences: {
        type: INTEGER,
      },
      goods: {
        type: STRING,
      },
      others: {
        type: STRING,
      },
      printPath: {
        type: STRING
      },
      receiptOrderPath: {
        type: STRING
      },
      schedulePath: {
        type: STRING,
      },
      fireQuotationId: {
        type: INTEGER,
      },
      firePolicyId: {
        type: INTEGER
      },
      fireRateId: {
        type: INTEGER,
      },
      categoryId: {
        type: INTEGER,
      },
      idImage: {
        type: STRING
      },
      videoFootage: {
        type: STRING
      },
      document: {
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
