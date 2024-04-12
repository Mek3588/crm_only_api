"use strict";

const { INTEGER, DATE, STRING } = require("sequelize");
module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.createTable("vehicles", {
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
      make_of: {
        type: STRING,
      },
      vehicle_type: {
        type: STRING,
      },
      description: {
        type: STRING,
      },
      category: {
        type: STRING,
        defaultValue: "Normal"
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
