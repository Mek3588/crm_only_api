"use strict";

const { INTEGER, STRING, DATE, BOOLEAN } = require("sequelize");
module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.createTable("customers", {
      id: {
        type: INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
      },
      active: {
        type: BOOLEAN,
      },
      registrationDate: {
        type: STRING,
      },
      expirationDate: {
        type: STRING,
      },
      userId: {
        type: INTEGER,
      },
      employeeId: {
        type: INTEGER,
      },
      contactId: {
        type: INTEGER,

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
