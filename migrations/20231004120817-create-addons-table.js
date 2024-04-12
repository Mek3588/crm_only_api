'use strict';
const { DATE } = require("sequelize");
const { STRING } = require("sequelize");
const { INTEGER, DOUBLE, BOOLEAN } = require("sequelize");

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.createTable("addons", {
      id: {
        type: INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
      },
      addonPremium: {
        type: DOUBLE
      },
      ignition_sum_insured: {
        type: DOUBLE,
      },
      property_limit_extension_amount: {
        type: DOUBLE,
      },
      bodt_limit_extension_amount: {
        type: DOUBLE,
      },
      territorial_countryId: {
        type: INTEGER,
      },
      comprehensive_id: {
        type: INTEGER,
      },
      dailyCash_benefit: {
        type: DOUBLE,
      },
      dailyCash_duration: {
        type: STRING,
      },
      quotationId: {
        type: INTEGER,
      },
      yellow_card_vehicle_type: {
        type: STRING,
      },
      coverRateId: {
        type: INTEGER,
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
  }
};
