"use strict";

const { DOUBLE } = require("sequelize");
const { BOOLEAN } = require("sequelize");
const { STRING } = require("sequelize");
const { INTEGER } = require("sequelize");

module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.createTable("services", {
      id: {
        type: INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },
      serviceName: {
        type: STRING,
        allowNull: false,
      },
      usageUnit: {
        type: STRING,
        allowNull: false,
      },
      website: {
        type: STRING,
        allowNull: false,
      },
      category: {
        type: STRING,
        allowNull: false,
      },
      assignedTo: {
        type: STRING,
        allowNull: false,
      },
      sharedWith: {
        type: STRING,
        allowNull: false,
      },
      active: {
        type: BOOLEAN,
        allowNull: false,
      },
      renewable: {
        type: BOOLEAN,
        allowNull: true,
      },

      private: {
        type: BOOLEAN,
        allowNull: false,
      },
      price: {
        type: DOUBLE,
        allowNull: false,
      },
      cost: {
        type: DOUBLE,
        allowNull: false,
      },
      taxes: {
        type: DOUBLE,
        allowNull: false,
      },
      description: {
        type: STRING,
        allowNull: false,
      },

      createdAt: Sequelize.DATE,
      updatedAt: Sequelize.DATE,
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
