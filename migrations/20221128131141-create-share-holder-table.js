"use strict";
const { STRING, INTEGER, DATE, BOOLEAN, ENUM } = require("sequelize");

module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.createTable("shareholders", {
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
      shareHolderId: {
        type: STRING,
        allowNull: false,
        unique: true,
      },
      name: {
        type: STRING,
        allowNull: false,
      },

      gender: {
        type: STRING,
      },
      // legalEntity: {
      //      type: STRING,

      // },
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
      numberOfShare: {
        type: INTEGER,
      },

      userId: {
        type: INTEGER,
      },
      active: {
        type: BOOLEAN,
        allowNull: false,
      },
      stateOfInfluence: {
        type: ENUM("Major", "Influential", "Non-Influential"),
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
      socialSecurity: {
        type: STRING,
      },
      profilePicture: {
        type: STRING,
      },
      note: {
        type: STRING,
      },
      employeeId: {
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
