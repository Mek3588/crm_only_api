"use strict";

const { STRING, INTEGER, DATE } = require("sequelize");

module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.createTable("contact_activity_update_histories", {
      id: {
        type: INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },
      userId: {
        type: INTEGER,
        allowNull: false,
      },
      contactId: {
        type: INTEGER,
        allowNull: false,
      },
      activity: {
        type: STRING,
        allowNull: false,
      },
      attribute: {
        type: STRING,
        allowNull: false,
      },
      previous_status: {
        type: STRING,
        allowNull: false,
      },
      current_status: {
        type: STRING,
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
