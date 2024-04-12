"use strict";
const { DATE, DOUBLE } = require("sequelize");
const { STRING } = require("sequelize");
const { INTEGER, BOOLEAN } = require("sequelize");
module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.createTable("bus_taxi_tps", {
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
      minSeat: {
        type: INTEGER,
      },
      maxSeat: {
        type: INTEGER,
      },
      purpose: {
        type: STRING,
      },
      initPremium: {
        type: DOUBLE,
      },
      taxi_type: {
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
