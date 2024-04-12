"use strict";

const { INTEGER, STRING, DATE, BOOLEAN } = require("sequelize");
module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.createTable("brokers", {
      id: {
        type: INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },
      code: {
        type: STRING,
        // allowNull: false,
      },
      firstName: {
        type: STRING,
        allowNull: false,
      },
      fatherName: {
        type: STRING,
        allowNull: false,
      },
      grandfatherName: {
        type: STRING,
        allowNull: false,
      },
      gender: {
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

      // active: {
      //   type:BOOLEAN
      // },

      note: {
        type: STRING,
      },
      profilePicture: {
        type: STRING,
      },
      userId: {
        type: INTEGER,
      },
      organizationId: {
        type: INTEGER,
      },
      accountId: {
        type: INTEGER,
      },
      isRepresentative: {
        type: BOOLEAN,
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
