"use strict";
const { DATE } = require("sequelize");
const { STRING } = require("sequelize");
const { INTEGER, BOOLEAN } = require("sequelize");
module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.createTable("event_logs", {
      id: {
        type: INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
      },
      userId: {
        type: INTEGER,
        allowNull: false,
      },
      resourceType: {
        type: STRING,
        allowNull: false,
      },
      resourceName: {
        type: STRING,
        allowNull: false,
      },
      resourceId: {
        type: INTEGER,
        allowNull: false,
      },
      action: {
        type: STRING,
        allowNull: false,
      },
      changedField: {
        type: STRING,
      },
      ipAddress: {
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
