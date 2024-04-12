"use strict";
const { DATE, STRING, INTEGER, BOOLEAN } = require("sequelize");

module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.createTable("customer_notes", {
      id: {
        type: INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },
      note: {
        type: STRING,
        allowNull: false,
      },
      comment: {
        type: STRING,
      },
      createdDate: {
        type: STRING,
        allowNull: false,
      },
      userId: {
        type: INTEGER,
      },
      reportTo: {
        type: INTEGER,
      },
      targetId: {
        type: INTEGER,
      },
      target: {
        type: STRING,
      },
      customerId: {
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
