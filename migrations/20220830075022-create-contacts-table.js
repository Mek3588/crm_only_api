"use strict";

const { INTEGER, STRING, DATE, BOOLEAN } = require("sequelize");

module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.createTable("contacts", {
      id: {
        type: INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },
      type: {
        type: STRING,
        allowNull: false,
      },
      firstName: {
        type: STRING,

      },
      middleName: {
        type: STRING,

      },
      lastName: {
        type: STRING,
      },
      joinIndividualName: {
        type: STRING,

      },
      companyName: {
        type: STRING,
      },
      stage: {
        type: STRING,
      },
      numberOfEmployees: {
        type: STRING,
      },
      memberOf: {
        type: INTEGER,
      },
      industry: {
        type: STRING,
      },
      accountStage: {
        type: STRING,
      },
      registrationDate: {
        type: STRING
      },
      status: {
        type: STRING,
      },
      assignedTo: {
        type: INTEGER,
      },
      branchId: {
        type: INTEGER,
      },
      parentLeadId: {
        type: INTEGER,
      },
      productId: {
        type: INTEGER,
      },
      primaryEmail: {
        type: STRING,
        isUnique: true,
      },
      secondaryEmail: {
        type: STRING,
      },
      primaryPhone: {
        type: STRING,
        allowNull: false,
      },
      secondaryPhone: {
        type: STRING,
      },
      website: {
        type: STRING,
      },
      fax: {
        type: STRING,
      },
      annualRevenue: {
        type: INTEGER,
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
      tinNumber: {
        type: STRING,
      },
      vatRegistrationNumber: {
        type: STRING,
      },
      socialSecurity: {
        type: STRING,
      },
      registeredForVat: {
        type: STRING,
      },
      description: {
        type: STRING,
      },
      userId: {
        type: INTEGER,
      },
      gender: {
        type: STRING,
      },
      deleted: {
        type: BOOLEAN,
        allowNull: false,
        default: false,
      },
      accountId: {
        type: STRING,
      },
      business_source_type: {
        type: STRING,
      },
      business_source: {
        type: STRING,
      },
      conversion_date: {
        type: DATE,
      },
      fire_productId: {
        type: INTEGER,
      },
      productIds: {
        type: STRING,
      },
      productNames: {
        type: STRING,
      },
      salutation: {
        type: STRING,
      },
      product_type: {
        type: STRING,
      },
      fire_productId: {
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
