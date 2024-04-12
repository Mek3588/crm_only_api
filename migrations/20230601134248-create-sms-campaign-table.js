"use strict";

/** @type {import('sequelize-cli').Migration} */
const { DATE, DOUBLE } = require("sequelize");
const { STRING } = require("sequelize");
const { INTEGER, BOOLEAN } = require("sequelize");
module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.createTable("sms_campaigns", {
      id: {
        type: INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },
      content: {
        type: STRING,
        allowNull: false,
      },
      userId: {
        type: INTEGER,
      },
      campaignId: {
        type: INTEGER,
      },
      isLeadSms: {
        type: BOOLEAN,
      },
      isAccountSms: {
        type: BOOLEAN,
      },
      isCustomerSms: {
        type: BOOLEAN,
      },
      owner: {
        type: STRING,
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
