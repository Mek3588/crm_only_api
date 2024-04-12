"use strict";

const { INTEGER, BOOLEAN, DOUBLE, STRING, DATE } = require("sequelize");
module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.createTable("vehicle_rate_charts", {
      id: {
        type: INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
      },
      vehicleType: {
        type: STRING,
        allowNull: false,
      },
      vehicleId: {
        type: INTEGER,
      },
      min_manufactured_year: {
        type: DATE,
      },
      max_manufactured_year: {
        type: DATE,
      },
      is_named_driver: {
        type: BOOLEAN,
        defaultValue: false,
      },
      purpose: {
        type: STRING,
        allowNull: false,
      },
      rate: {
        type: DOUBLE,
        allowNull: false,
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
