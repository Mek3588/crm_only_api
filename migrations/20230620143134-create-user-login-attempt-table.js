"use strict";
const { INTEGER, BOOLEAN, STRING, DATE } = require("sequelize");
module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.createTable("user_login_attempts", {
      id: {
        type: INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
      },
      email: {
        type: STRING,
      },
      phone: {
        type: STRING,
      },
      ipAddress: {
        type: STRING,
        allowNull: false,
      },
      attemptCount: {
        type: INTEGER,
        allowNull: false,
      },
      lastAttempt: {
        type: DATE,
        allowNull: false,
      },
      locked: {
        type: BOOLEAN,
        defaultValue: false,
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
