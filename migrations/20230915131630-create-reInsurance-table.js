'use strict';

/** @type {import('sequelize-cli').Migration} */
const { STRING, INTEGER, DOUBLE, DATE } = require("sequelize");
module.exports = {
  async up(queryInterface, Sequelize) {

    return queryInterface.createTable("reInsurances", {
      id: {
        type: INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
      },
      classOfBusiness: {
        type: STRING,
      },
      product: {
        type: STRING,
      },
      category: {
        type: STRING,
      },
      amount: {
        type: DOUBLE
      },
      activeFromDate: {
        type: DATE
      },
      activeUntilDate: {
        type: DATE
      },
      userId: {
        type: INTEGER
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
  }
};
