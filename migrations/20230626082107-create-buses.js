"use strict";
const { DATE, DOUBLE } = require("sequelize");
const { STRING } = require("sequelize");
const { INTEGER, BOOLEAN } = require("sequelize");
module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.createTable("buses", {
      id: {
        type: INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
      },
      vehicle_id: {
        type: INTEGER,
        allowNull: false,
      },
      min_manufactured_year: {
        type: DATE,
      },
      max_manufactured_year: {
        type: DATE,
      },
      purpose: {
        type: STRING,
        allowNull: false,
      },
      min_seat: {
        type: INTEGER,
        allowNull: false,
      },
      max_seat: {
        type: INTEGER,
        allowNull: false,
      },
      is_locally_modified_body: {
        type: BOOLEAN,
        allowNull: false,
      },
      rate: {
        type: DOUBLE,
        allowNull: false,
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
