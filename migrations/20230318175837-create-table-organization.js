"use strict";

const { INTEGER, STRING, DATE } = require("sequelize");
module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.createTable("organizations", {
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

      //
      zipCode: {
        type: STRING,
      },
      tinNumber: {
        type: STRING,
      },
      licenseNumber: {
        type: STRING,
        allowNull: false,
      },
      licenseIssuedDate: {
        type: STRING,
        allowNull: false,
      },
      licenseExpirationDate: {
        type: STRING,
        allowNull: false,
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
      note: {
        type: STRING,
      },
      profilePicture: {
        type: STRING,
      },
      userId: {
        type: INTEGER,
      },
      description: {
        type: STRING,
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
