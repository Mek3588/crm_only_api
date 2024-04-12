'use strict';
const { DATE } = require("sequelize");
const { STRING } = require("sequelize");
const { INTEGER, DOUBLE, BOOLEAN } = require("sequelize");

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.createTable("financeDatas", {

      id: {
        type: INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
      },
      sum_insured: {
        type: DOUBLE,
      },
      premium: {
        type: DOUBLE,
      },
      tp_fund_levy: {
        type: DOUBLE,
      },
      revenue_stamp: {
        type: DOUBLE,
      },
      excess_cont: {
        type: DOUBLE,
      },
      other: {
        type: DOUBLE,
      },
      sum: {
        type: DOUBLE,
      },
      userId: {
        type: INTEGER,
      },
      quotationId: {
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
  }
};
