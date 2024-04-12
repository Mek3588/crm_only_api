"use strict";
const { DATE } = require("sequelize");
const { STRING } = require("sequelize");
const { INTEGER, DOUBLE, BOOLEAN } = require("sequelize");
module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.createTable("limited_cover_rates", {
      id: {
        type: INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
    },
    name: {
        type: STRING,
        allowNull: false,
    },
    purpose: {
        type: STRING,
        allowNull: false,
    },
    rate: {
        type: DOUBLE
    },
    isAvailable: {
        type: BOOLEAN,
        defaultValue: true
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
