"use strict";

const { STRING, INTEGER, DATE, UUID, UUIDV4, BOOLEAN } = require("sequelize");

module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.createTable("company_contacts", {
      id: {
        type: INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },
      firstName: {
        type: STRING,
        allowNull: false,
      },
      fatherName: {
        type: STRING,
        allowNull: false,
      },
      grandFatherName: {
        type: STRING,
      },
      status: {
        type: STRING,
        allowNull: false,
      },
      leadSource: {
        type: INTEGER,
      },
      gender: {
        type: STRING,
        allowNull: false,
      },
      salutationId: {
        type: INTEGER,
      },
      memberType: {
        type: STRING,
      },
      memberOf: {
        type: STRING,
      },
      memberName: {
        type: STRING,
      },
      assignedTo: {
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
        allowNull: false,
      },
      secondaryEmail: {
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
      TOT: {
        type: STRING,
      },
      streetName: {
        type: STRING,
      },
      note: {
        type: STRING,
      },
      website: {
        type: STRING,
      },
      zipCode: {
        type: STRING,
      },
      TINNumber: {
        type: STRING,
      },
      socialSecurity: {
        type: STRING,
      },
      languageNotifications: {
        type: STRING,
      },
      decisionMaker: {
        type: BOOLEAN,
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
