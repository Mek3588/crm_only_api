"use strict";
const { DATE } = require("sequelize");
const { STRING } = require("sequelize");
const { INTEGER, DOUBLE, BOOLEAN } = require("sequelize");
module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.createTable("motor_trades", {
      id: {
        type: INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
      },
      is_garage: {
        type: BOOLEAN,
        allowNull: false,
      },
      risk_type: {
        type: STRING,
      },
      rate: {
        type: DOUBLE,
      },
      createdAt: DATE,
      updatedAt: DATE,
    });
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
  },
};
