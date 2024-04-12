'use strict';
const { DATE, DOUBLE } = require("sequelize");
const { STRING } = require("sequelize");
const { INTEGER, BOOLEAN } = require("sequelize");
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
   await queryInterface.createTable('ClaimVerifications', {
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
  createdAt: {
      allowNull: false,
      type: Sequelize.DATE
  },
  updatedAt: {
      allowNull: false,
      type: Sequelize.DATE
  }
  });
  
  },

  async down (queryInterface, Sequelize) {
   await queryInterface.dropTable('ClaimVerifications');
  }
};
