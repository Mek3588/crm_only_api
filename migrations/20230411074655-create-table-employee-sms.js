'use strict';

const { INTEGER, DATE } = require("sequelize");
module.exports = {
  async up (queryInterface, Sequelize) {
    return queryInterface.createTable("sms_employees", {
       id: {
        type: INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
    },
    employeeId: {
        type: INTEGER,
        allowNull: false
    },
    smsMessageId: {
        type: INTEGER,
        allowNull: false
    },
      createdAt: DATE,
      updatedAt:DATE,
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
