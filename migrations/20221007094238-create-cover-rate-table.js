"use strict";
const { DATE } = require("sequelize");
const { DOUBLE } = require("sequelize");

const { STRING } = require("sequelize");
const { INTEGER } = require("sequelize");
module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.createTable("cover_rates", {
      id: {
        type: INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },
      coverType: {
        type: STRING,
        allowNull: false,
      },
      rate: {
        type: DOUBLE,
        defaultValue: 0,
      },
      included_in: {
        type: INTEGER,
      },
      prerequisites: {
        type: INTEGER,
      },
      constant: {
        type: DOUBLE,
        defaultValue: 0,
      },
      flag: {
        type: STRING,
      },
      description: {
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
