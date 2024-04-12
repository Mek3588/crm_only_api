"use strict";

const { STRING, INTEGER, DATE } = require("sequelize");

module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.createTable("comunication_histories", {
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
      type: {
        type: STRING,
        allowNull: false
      },
      subject: {
        type: STRING,
      },
      content: {
        type: STRING,
        allowNull: false,
      },
      attachments: {
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
