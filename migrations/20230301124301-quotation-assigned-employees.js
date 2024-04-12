'use strict';
const { DATE } = require("sequelize");
const { STRING } = require("sequelize");
const { INTEGER, BOOLEAN } = require("sequelize");
module.exports = {
  async up (queryInterface, Sequelize) {
    return queryInterface.createTable("quotation_assigned_employees", {
      id: {
        type: INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        },
     employeeId: {
        type: INTEGER,
        allowNull: false,
        },
     quotationAssignedId: {
        type: INTEGER,
        allowNull: false,
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
