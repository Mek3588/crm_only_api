'use strict';
const { INTEGER, STRING, DATE } = require('sequelize');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('claimNotifications', {
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
      allowNull: false,
      unique: true,
      index: true,
      
      },
      policyNumber: {
      type: STRING,
      
      },
      plateNumber: {
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
      driverProfession: {
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
      cargoType: {
      type: STRING,
      
      
      },
      cargoQuantity: {
      type: STRING,
      
      
      },
      crainType: {
      type: STRING,
      allowNull: false,
      unique: true,
      
      },
      isPoliceTakeParticular: {
      type: STRING,
      
      
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
      createdAt: {
      type: DATE,
      allowNull: false,
      },
      updatedAt: {
      type: DATE,
      allowNull: false,
      },
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable('claimNotifications');
  }
};
