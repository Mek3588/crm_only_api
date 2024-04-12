"use strict";
const { DATE } = require("sequelize");
const { STRING } = require("sequelize");
const { INTEGER, TEXT } = require("sequelize");
module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.createTable("recieved_emails", {
      id: {
        type: INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
      },
      subject: {
        type: STRING,
      },
      from: {
        type: STRING,
        allowNull: false,
      },
      to: {
        type: STRING,
      },
      cc: {
        type: STRING,
      },
      message: {
        type: TEXT('long'),
        allowNull: false,
      },
      recievedDate: {
        type: DATE
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
