'use strict';

const {  INTEGER, DATE } = require("sequelize");
module.exports = {
  async up (queryInterface, Sequelize) {
    return queryInterface.createTable("sms_vendors", {
      id: {
        type: INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },
       vendorId: {
        type: INTEGER,
        allowNull: false
    },
    smsMessageId: {
        type: INTEGER,
        allowNull: false
    },
    createdAt: DATE,
    updatedAt: DATE
      
    },
    {freezeTableName: true});
  
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
