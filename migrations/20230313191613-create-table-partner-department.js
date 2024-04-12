'use strict';

const { INTEGER, STRING, DATE } = require("sequelize");
module.exports = {
  async up (queryInterface, Sequelize) {
   return queryInterface.createTable("partner_departments", {
      id: {
        type: INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
     },
     departmentId: {
        type: INTEGER,
        allowNull: false,
    },
    partnerId: {
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