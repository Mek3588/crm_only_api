'use strict';
const { DATE, DOUBLE, INTEGER, STRING, BOOLEAN} = require("sequelize");

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('customers', {
      id: {
        type: INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },
      active: {
        type: BOOLEAN,
      },
      registrationDate: {
        type: STRING,
      },
      expirationDate: {
        type: STRING,
      },
      userId: {
        type: INTEGER,
      },
      contactId: {
        type: INTEGER,
    
      },
    })
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
