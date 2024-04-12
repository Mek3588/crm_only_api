'use strict';
const { DATE, DOUBLE } = require("sequelize");
const { STRING } = require("sequelize");
const { INTEGER, BOOLEAN } = require("sequelize");

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.createTable("claimVerifications", {
      id: {
        type: INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
      },
      customerid: {
        type: INTEGER,
        allowNull: false
      },
      policyNumber: {
        type: STRING,
        allowNull: false
      },
      plateNumber: {
        type: STRING,

      },
      accidentDate: {
        type: STRING,
      },
      accidentType: {
        type: STRING,
      },
      claimNumber: {
        type: STRING,
      },
      vehicle_type: {
        type: STRING,
      },
      rvNumber: {
        type: STRING,
      },
      collisionedVehicleOwner: {
        type: STRING,
      },
      collisionedVehiclePlateNumber: {
        type: STRING,
      },
      verificationStatus: {
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
  }
};
