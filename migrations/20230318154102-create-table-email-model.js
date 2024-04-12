'use strict';

const { INTEGER, STRING, DATE } = require('sequelize');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.createTable("email_models", {
      id: {
        type: INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true
      },
      userId: {
        type: INTEGER,
        allowNull: false
      },
      subject: {
        type: STRING,
        allowNull: false
      },
      message: {
        type: STRING,
        allowNull: false
      },
      createdAt: DATE,
      updatedAt: DATE,
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
