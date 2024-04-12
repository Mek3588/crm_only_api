"use strict";
const { DATE, STRING, INTEGER, BOOLEAN } = require("sequelize");

module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.createTable("documents", {
      id: {
        type: INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
      },
      name: {
        type: STRING,
        allowNull: false,
      },
      originalName: {
        type: STRING,
      },
      type: {
        type: STRING,
        allowNull: false,
      },
      document: {
        type: STRING,
        allowNull: false,
      },
      description: {
        type: STRING,
      },
      active: {
        type: BOOLEAN,
      },
      code: {
        type: STRING,
      },
      userId: {
        type: INTEGER,
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
