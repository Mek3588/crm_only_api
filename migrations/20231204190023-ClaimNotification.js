'use strict';
const { DATE, DOUBLE } = require("sequelize");
const { STRING } = require("sequelize");
const { INTEGER, BOOLEAN } = require("sequelize");


/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.createTable("claimNotifications", {
      id: {
        type: INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      customerId: {
        type: INTEGER,

      },
      claimNo: {
        type: STRING,
      },
      policyNumber: {
        type: STRING,
      },
      firstPlateNumber: {
        type: STRING,
      },
      driverFirstName: {
        type: STRING,
      },
      driverMiddleName: {
        type: STRING,
      },
      driverLastName: {
        type: STRING,
      },
      driverAddress: {
        type: STRING,
      },
      driverSubcity: {
        type: STRING,
      },
      driverKebele: {
        type: STRING,
      },
      driverHouseNo: {
        type: STRING,
      },
      driverPhoneNo: {
        type: STRING,
      },


      driverLicenseNo: {
        type: STRING,
      },
      driverLicenseType: {
        type: STRING,
      },

      driverLicenseExpiryDate: {
        type: STRING,
      },
      policyHolderProfession: {
        type: STRING,
      },
      policyHolderHouseNo: {
        type: INTEGER,
      },
      accidentDate: {
        type: STRING,
      },
      accidentTime: {
        type: STRING,
      },
      accidentPlace: {
        type: STRING,
      },
      accidentType: {
        type: STRING,
      },
      secondPersonName: {
        type: STRING,
      },
      secondPlateNumber: {
        type: STRING,
      },
      cargoType: {
        type: STRING,
      },
      cargoQuantity: {
        type: STRING,
      },
      crainType: {
        type: STRING,
      },
      isPoliceTakeParticular: {
        type: BOOLEAN,
      },
      policeStationName: {
        type: STRING,
      },
      policeName: {
        type: STRING,
      },
      accidentDescription: {
        type: STRING,
      },
      cargoDamageExtent: {
        type: STRING,
      },
      claimNotificationDate: {
        type: STRING,
      },
      notificationPath: {
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
