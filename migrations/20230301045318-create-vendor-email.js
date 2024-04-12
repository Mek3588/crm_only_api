'use strict';

const {  INTEGER, DATE } = require("sequelize");
module.exports = {
  async up (queryInterface, Sequelize) {
     return queryInterface.createTable("vendor_emails", {
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
    emailModelId: {
        type: INTEGER,
        allowNull: false
    }, createdAt: DATE,
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
