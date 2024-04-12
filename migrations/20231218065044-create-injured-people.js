'use strict';

const { DATE, DOUBLE } = require("sequelize");
const { STRING } = require("sequelize");
const { INTEGER, BOOLEAN } = require("sequelize");
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
   await queryInterface.createTable('InjuredPeople', {
    id: {
      type: INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
  },
  policeReportId: {
      type: INTEGER,
      allowNull: false,
  },
  injuredPersonFirstName: {
      type: STRING,
  },
  injuredPersonMiddleName: {
      type: STRING,
  },
  injuredPersonIdentity: {
      type: STRING,
  },
  injuredPersonAddress: {
      type: STRING,
  },
  injuredPersonInjuryType: {
      type: STRING,
     
  },
  isInjuredAnimal: {
      type: BOOLEAN,
     
  },
  injuredAnimalOwnerFirstName: {
      type: STRING,
  },
  injuredAnimalOwnerMiddleName: {
      type: STRING,
  },
  injuredAnimalType: {
      type: STRING,
  },
  injuredAnimalOwnerAddress: {
      type: STRING,
  },
  injuredAnimalAmount: {
      type: INTEGER,
  },
  injuredAnimalEstimatedValue: {
      type: DOUBLE,
  },
  createdAt: {
      allowNull: false,
      type: Sequelize.DATE
  },
  updatedAt: {
      allowNull: false,
      type: Sequelize.DATE
  }
   })
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable('InjuredPeople');
  }
};
