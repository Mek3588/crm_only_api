'use strict';
const { STRING } = require("sequelize");
const { DOUBLE } = require("sequelize");
const { INTEGER } = require("sequelize");
const { DATE } = require("sequelize");
module.exports = {
  async up (queryInterface, Sequelize) {
  return queryInterface.createTable("service_charges", {
   id: {
        type: INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true
    },
    chargeType: {
        type: STRING,
        allowNull: false,
    },
    amount: {
        type: DOUBLE,
        allowNull: false,
    },
    vehicleCategoryId: {
    type: INTEGER,
    },
    createdAt: DATE,
    updatedAt: DATE,
  })},

  async down (queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
  }
};
