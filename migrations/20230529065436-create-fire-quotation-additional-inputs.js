"use strict";

const { INTEGER, BOOLEAN, DOUBLE, DATE, STRING } = require("sequelize");
module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.createTable("fire_quotation_addtional_inputs", {
      id: {
        type: INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
      },
      categoryId: {
        type: STRING,
      },
      fireRateId: {
        type: STRING,
      },
      class_of_house: {
        type: STRING,
      },
      wall_type: {
        type: STRING,
      },
      roof_type: {
        type: STRING,
      },
      floor_type: {
        type: STRING,
      },
      duration: {
        type: STRING,
      },
      sumInsured: {
        type: STRING,
      },
      is_near_fire_birgade: {
        type: BOOLEAN,
      },
      have_security_appliances: {
        type: BOOLEAN,
      },
      premium: {
        type: DOUBLE,
      },
      expirationDate: {
        type: STRING,
      },
      calculation_sheet_path: {
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
