"use strict";
const { DATE, DOUBLE } = require("sequelize");
const { STRING } = require("sequelize");
const { INTEGER, BOOLEAN } = require("sequelize");
module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.createTable("multiple_policies", {
      id: {
        type: INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
      },
      number_of_policies: {
        type: INTEGER,
        allowNull: false,
      },
      requested_by: {
        type: STRING,
        allowNull: false,
      },
      cover_type: {
        type: STRING,
        allowNull: false,
      },
      is_motor: {
        type : BOOLEAN
      },
      is_fire: {
        type : BOOLEAN
      },
      status: {
        type: STRING,
        allowNull: false,
      },
      proposalId: {
        type: INTEGER,
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
