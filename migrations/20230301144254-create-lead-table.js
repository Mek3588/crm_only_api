"use strict";

const { INTEGER, STRING, DATE } = require("sequelize");

module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.createTable("leads", {
      id: {
        type: INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },
      name: {
        type: STRING,
        allowNull: false,
      },
      status: {
        type: STRING,
        allowNull: false,
      },
      assignedTo: {
        type: INTEGER,
      },
      industry: {
        type: STRING,
      },
      numberOfEmployees: {
        type: INTEGER,
      },
      productId: {
        type: INTEGER,
      },
      parentLeadId: {
        type: INTEGER,
      },
      branchId: {
        type: INTEGER,
      },
      primaryPhone: {
        type: STRING,
        allowNull: false,
      },
      secondaryPhone: {
        type: STRING,
      },
      primaryEmail: {
        type: STRING,
      },
      secondaryEmail: {
        type: STRING,
      },
      website: {
        type: STRING,
      },
      fax: {
        type: STRING,
      },
      userId: {
        type: INTEGER,
      },
      tinNumber: {
        type: STRING,
      },
      annualRevenue: {
        type: STRING,
      },
      legalForm: {
        type: STRING,
      },
      businessSource: {
        type: INTEGER,
        allowNull: false,
      },
      country: {
        type: STRING,
      },
      region: {
        type: STRING,
      },
      city: {
        type: STRING,
      },
      subcity: {
        type: STRING,
      },
      woreda: {
        type: STRING,
      },
      kebele: {
        type: STRING,
      },
      building: {
        type: STRING,
      },
      officeNumber: {
        type: STRING,
      },
      poBox: {
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
      description: {
        type: STRING,
      },
      createdAt: DATE,
      updatedAt: DATE,
    });
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
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
