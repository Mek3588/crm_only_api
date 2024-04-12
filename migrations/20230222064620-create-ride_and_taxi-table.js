"use strict";
const { DATE, DOUBLE } = require("sequelize");
const { STRING } = require("sequelize");
const { INTEGER, BOOLEAN } = require("sequelize");
module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.createTable("rides_and_taxes", {
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
        allowNull: false,
      },
      min_manufactured_year: {
        type: DATE,
      },
      max_manufactured_year: {
        type: DATE,
      },
      rate: {
        type: DOUBLE,
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
