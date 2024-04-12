"use strict";
const { DATE, DOUBLE } = require("sequelize");
const { STRING } = require("sequelize");
const { INTEGER, BOOLEAN } = require("sequelize");
module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.createTable("truck_tanker_tps", {
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
      minCapacity: {
        type: INTEGER,
      },
      maxCapacity: {
        type: INTEGER,
      },
      purpose: {
        type: STRING,
      },
      initPremium: {
        type: DOUBLE,
      },
      is_trailer: {
        type: BOOLEAN
      },
      is_semi_trailer: {
        type: BOOLEAN
      },
      vehicleId: {
        type: INTEGER
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
