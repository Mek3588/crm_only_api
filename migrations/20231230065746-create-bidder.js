'use strict';

const { DATE, DOUBLE, INTEGER, STRING, BOOLEAN} = require("sequelize");
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('bidders', {
      id: {
        type: INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
      claimNo: {
          type: STRING,
      },
  
      bidId: {
          type: INTEGER,
      },
  
      name: {
          type: STRING,
      },
      email: {
          type: STRING,
      },
      phone: {
          type: STRING,
      },
      address: {
          type: STRING,
      },
      city: {
          type: STRING,
      },
      state: {
          type: STRING,
      },
      createdAt: {
          type: DATE,
      },
      updatedAt: {
          type: DATE,
      },
  
      });
  },

  async down (queryInterface, Sequelize) {
   await queryInterface.dropTable('bidders');
  }
};
