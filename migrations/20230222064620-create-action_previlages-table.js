"use strict";
const { DATE, DOUBLE } = require("sequelize");
const { STRING } = require("sequelize");
const { INTEGER, BOOLEAN } = require("sequelize");
module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.createTable("actionPrevilages", {
      id: {
        type: INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
      },
      object: {
        type: STRING,
        allowNull: false,
      },
      group: {
        allowNull: false,
        type: INTEGER,
      },
      action: {
        type: STRING,
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
