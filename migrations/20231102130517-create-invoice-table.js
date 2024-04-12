"use strict";
const { DATE } = require("sequelize");
const { STRING } = require("sequelize");
const { INTEGER, BOOLEAN } = require("sequelize");
module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.createTable("invoices", {
      id: {
        type: INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true
      },
      invoiceNo: {
        type: STRING
      },
      name: {
        type: STRING,
      },
      status: {
        type: STRING,
      },
      TOT: {
        type: STRING,
      },
      socialSecurity: {
        type: STRING,
      },
      registrationForVat: {
        type: STRING,
      },
      being: {
        type: STRING,
      },
      isCash: {
        type: BOOLEAN
      },
      chequeNo: {
        type: STRING
      },
      invoicePath: {
        type: STRING,
      },
      assignedTo: {
        type: INTEGER,
      },
      branchId: {
        type: INTEGER,
      },
      proposalId: {
        type: INTEGER
      },
      contactId: {
        type: INTEGER
      },
      userId: {
        type: INTEGER,
      },
      policyId: {
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
  },
};
