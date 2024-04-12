'use strict';
const { DATE } = require("sequelize");
const { STRING } = require("sequelize");
const { INTEGER } = require("sequelize");

module.exports = {
  async up (queryInterface, Sequelize) {
     return queryInterface.createTable("temporary_notices", {
      id: {
        type: INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },
    customerName: {
        type: STRING,
        allowNull: false,
    },
      driverName: {
        type: STRING,
        allowNull: false,
    },
    drivingLicenceNumber: {
        type: STRING,
        allowNull: false,
    },
    
     typeOfVehicle: {
        type: STRING,
        allowNull: false,
    },
     plateNumber: {
        type: STRING,
        allowNull: false,
    },
     cartPlateNumber: {
        type: STRING,
        allowNull: false,
    },
     policyNumber: {
        type: INTEGER,
        allowNull: false,
    },
     typeOfAccident: {
        type: String,
        allowNull: false,
    },
     typeOfAccident: {
        type: STRING,
        allowNull: false,
    },
    accidentDate: {
        type: STRING,
        allowNull: true,
    },
    placeOfAccident: {
        type: STRING,
        allowNull: false,
    },
    accidentDescription: {
        type: STRING,
        allowNull: false,
    },
    reportedBy: {
        type: STRING,
        allowNull: true,
    },
    relationWithTheReporter: {
        type: STRING,
        allowNull: true,
    },
     policeOfficerName: {
        type: STRING,
        allowNull: true,
    },
    addressOfTheReport: {
        type: STRING,
        allowNull: true,
    },
    resonForUsingFillingThisForm: {
        type: STRING,
        allowNull: false,
    },
    responseToTheCustomer: {
        type: STRING,
        allowNull: false,
    },
      dateOfRegistration: {
        type: DATE,
        allowNull: false,
    },
      createdAt: Sequelize.DATE,
      updatedAt: Sequelize.DATE,
     
   });
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
  }
};
