'use strict';
const { DATE } = require("sequelize");
const { DOUBLE } = require("sequelize");
const { BOOLEAN } = require("sequelize");
const { STRING } = require("sequelize");
const { INTEGER } = require("sequelize");
module.exports = {
  async up (queryInterface, Sequelize) {
      return queryInterface.createTable("fire_short_period_rates", {
      id: {
          type: INTEGER,
          allowNull: false,
          autoIncrement: true,
          primaryKey: true,
      },
      minDuration: {
          type: INTEGER,
          allowNull: false,
      },
      maxDuration: {
          type: INTEGER,
          allowNull: false,
      },
      isCancellation: {
          type: BOOLEAN,
          allowNull: false,
      },
      rate: {
          type: DOUBLE,
          allowNull: false,
      },
      createdAt: DATE,
      updatedAt: DATE,
      })
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
