'use strict';

const { INTEGER, STRING, DATE,BOOLEAN } = require("sequelize");
module.exports = {
  async up (queryInterface, Sequelize) {
    return queryInterface.createTable("partners", {
      id: {
        type: INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },
      partnerName: {
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
      building: {
        type: STRING,
      },
      officeNumber: {
        type: STRING,
      },
      poBox: {
        type: STRING
      },
      streetName: {
          type: STRING
      },
      zipCode: {
        type: STRING,
      },
      website: {
        type: STRING,
      },
        tinNumber: {
        type: STRING,
      },
      active: {
        type:BOOLEAN
      },
      licenseIssuedDate: {
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
      profilePicture: {
        type:STRING
      },

      note: {
        type: STRING,
      },
      userId: {
        type: INTEGER
      },
      employeeId: {
        type: INTEGER
      },
      
          createdAt: DATE,
          updatedAt: DATE
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
