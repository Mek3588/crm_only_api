"use strict";

const { STRING, FLOAT, DOUBLE, BOOLEAN } = require("sequelize");
const { INTEGER } = require("sequelize");

module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.createTable("vehicle_categories", {
      id: {
        type: INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },
      name: {
        type: STRING,
        allowNull: false,
      },
      superCategotyId: {
        type: INTEGER,
      },
      rate: {
        type: DOUBLE,
      },
      make_of: {
        type: STRING,
      },
      description: {
        type: STRING,
      },
      flag: {
        type: STRING,
      },
      isActive: {
        type: BOOLEAN,
      },
      createdAt: Sequelize.DATE,
      updatedAt: Sequelize.DATE,
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
