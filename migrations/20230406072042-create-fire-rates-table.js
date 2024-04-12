'use strict';
const { DATE } = require("sequelize");
const { DOUBLE } = require("sequelize");
const { BOOLEAN } = require("sequelize");
const { STRING } = require("sequelize");
const { INTEGER } = require("sequelize");
module.exports = {
  async up (queryInterface, Sequelize) {
      return queryInterface.createTable("fire_rates", {
    id: {
        type: INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true
    },
    categoryId: {
      type: STRING,
      allowNull: false
    },
    riskCode: {
        type: INTEGER,
        allowNull: false,
    },
    occupation: {
        type: STRING,
        allowNull: false
    },
    rate: {
        type: DOUBLE,
        allowNull: false,
    },
    warranty: {
        type: INTEGER
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
