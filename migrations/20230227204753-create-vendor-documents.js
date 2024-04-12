'use strict';

const {  INTEGER, DATE } = require("sequelize");
module.exports = {
  async up(queryInterface, Sequelize) {
      return queryInterface.createTable("vendor_documents", {
      id: {
        type: INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },
     documentId: {
        type: INTEGER,
        allowNull: false,
    },
    vendorId: {
        type: INTEGER,
        allowNull: false,
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
