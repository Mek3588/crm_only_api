"use strict";
const { DATE, STRING, INTEGER, BOOLEAN } = require("sequelize");

module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.createTable("customer_proposals", {
      id: {
        type: INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },
      motorProposalId: {
        type: INTEGER,
        allowNull: false,
      },
      customerId: {
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
