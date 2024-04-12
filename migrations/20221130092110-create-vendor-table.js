"use strict";
const { DATE, INTEGER, STRING, BOOLEAN } = require("sequelize");
module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.createTable("vendors", {
      id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },
      vendorName: {
        type: STRING,
        allowNull: false,
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
        allowNull: false,
      },
      secondaryEmail: {
        type: STRING,
      },
      website: {
        type: STRING,
      },
      category: {
        type: STRING,
        allowNull: false,
      },
      country: {
        type: STRING,
        allowNull: false,
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
      streetName: {
        type: STRING,
      },

      zipCode: {
        type: STRING,
      },

      glAccount: {
        type: STRING,
      },
      vat: {
        type: STRING,
      },
      annualPlan: {
        type: STRING,
      },
      tinNumber: {
        type: STRING,
      },
      registeredForVat: {
        type: STRING,
      },
      vatRegistrationNumber: {
        type: STRING,
      },
      tot: {
        type: STRING,
      },
      profilePicture: {
        type: STRING,
      },
      active: {
        type: BOOLEAN,
        allowNull: false,
      },
      employeeId: {
        type: INTEGER,
      },
      userId: {
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
