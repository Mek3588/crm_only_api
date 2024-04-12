"use strict";

const { INTEGER, BOOLEAN, DOUBLE, STRING, DATE } = require("sequelize");
module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.createTable("tp_unitPrices", {
      id: {
        type: INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,

      },
      vehicle_type: {
        type: STRING
      },
      unit_price: {
        type: INTEGER
      },
      purpose: {
        type: STRING
      },
      purpose: {
        type: STRING
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
