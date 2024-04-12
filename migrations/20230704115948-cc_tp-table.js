"use strict";
const { DATE, DOUBLE } = require("sequelize");
const { STRING } = require("sequelize");
const { INTEGER, BOOLEAN } = require("sequelize");
module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.createTable("cc_tps", {
      id: {
        type: INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
      },
      vehicle_type: {
        type: STRING,
        allowNull: false,
      },
      min_cc: {
        type: INTEGER,
        allowNull: false,
      },
      max_cc: {
        type: INTEGER,
        allowNull: false,
      },
      purpose: {
        type: STRING,
      },
      is_named_driver: {
        defaultValue: false,
        type: BOOLEAN,
      },
      initPremium: {
        type: INTEGER,
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
