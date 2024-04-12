"use strict";
const { DATE } = require("sequelize");
const { STRING } = require("sequelize");
const { INTEGER, BOOLEAN } = require("sequelize");
module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.createTable(
      "fire_quotations_additional_inputs_relations",
      {
        id: {
          type: INTEGER,
          allowNull: false,
          primaryKey: true,
          autoIncrement: true,
        },
        fireQuotationId: {
          type: INTEGER,
          allowNull: false,
        },
        fireQuotationAdditionalInputId: {
          type: INTEGER,
          allowNull: false,
        },
        createdAt: DATE,
        updatedAt: DATE,
      }
    );
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
